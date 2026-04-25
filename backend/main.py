import asyncio
import os
import secrets
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
from core.config import get_db, ADMIN_SECRET, FRONTEND_URL, ALLOWED_AFFILIATES
from core.alerts import (
    send_confirmation_email, send_scraper_health_alert, send_weekly_digest,
    send_daily_digest, send_job_post_notification
)
from scheduler import start_scheduler, run_all_scrapers, run_scraper_by_name

OWNER_EMAIL = os.getenv("OWNER_EMAIL", "")


# ── Rate limiting ─────────────────────────────────────────────────────────────
_rate_limits: dict[str, list] = {}

def check_rate_limit(ip: str, limit: int = 60, window_seconds: int = 60) -> bool:
    now = datetime.now(timezone.utc).timestamp()
    hits = [t for t in _rate_limits.get(ip, []) if now - t < window_seconds]
    _rate_limits[ip] = hits
    if len(hits) >= limit:
        return False
    _rate_limits[ip].append(now)
    return True


# ── Admin auth dependency ─────────────────────────────────────────────────────
def require_admin(x_admin_secret: str = Header(...)):
    if not ADMIN_SECRET:
        raise HTTPException(status_code=500, detail="ADMIN_SECRET not configured on server.")
    if x_admin_secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden.")


# ── Startup ───────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[API] Running initial scrape on startup...")
    asyncio.create_task(run_all_scrapers())
    scheduler = start_scheduler()
    yield
    scheduler.shutdown()


app = FastAPI(
    title="InternAsia API",
    version="3.0.0",
    lifespan=lifespan,
    docs_url="/docs" if os.getenv("DOCS_ENABLED") else None,
    redoc_url=None,
)

_allowed_origins = [o.strip() for o in FRONTEND_URL.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PATCH"],
    allow_headers=["*"],
)


# ── Rate limit middleware ─────────────────────────────────────────────────────
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(ip):
        from fastapi.responses import JSONResponse
        return JSONResponse({"detail": "Rate limit exceeded. Try again in a minute."}, status_code=429)
    return await call_next(request)


# ── Models ────────────────────────────────────────────────────────────────────
class AlertCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    language: Optional[str] = None
    paid_only: bool = False
    keywords: Optional[str] = None
    frequency: str = "instant"

class AffiliateClick(BaseModel):
    affiliate: str
    source: str
    internship_id: Optional[str] = None

class JobPostRequest(BaseModel):
    company_name: str
    contact_email: EmailStr
    contact_name: Optional[str] = None
    role_title: str
    location_country: str
    location_city: Optional[str] = None
    industry: Optional[str] = None
    is_paid: bool = True
    stipend_range: Optional[str] = None
    language_required: str = "English"
    description: str
    apply_url: str
    duration_weeks: Optional[int] = None
    tier: str = "standard"
    message: Optional[str] = None

class FeatureListingRequest(BaseModel):
    days: int = 30
    label: Optional[str] = "Featured"


# ── Internships ───────────────────────────────────────────────────────────────
@app.get("/internships")
async def get_internships(
    country: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    paid_only: Optional[bool] = Query(None),
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    posted_within_hours: Optional[int] = Query(None),
    featured_first: bool = Query(True),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    db = get_db()

    def _apply_filters(q):
        q = q.eq("is_active", True)
        if country:              q = q.ilike("location_country", f"%{country}%")
        if industry:             q = q.ilike("industry", f"%{industry}%")
        if language:             q = q.ilike("language_required", f"%{language}%")
        if paid_only:            q = q.eq("is_paid", True)
        if source:               q = q.eq("source", source)
        if search:               q = q.or_(f"title.ilike.%{search}%,company_name.ilike.%{search}%")
        if posted_within_hours:
            cutoff = (datetime.now(timezone.utc) - timedelta(hours=posted_within_hours)).isoformat()
            q = q.gte("scraped_at", cutoff)
        return q

    offset = (page - 1) * limit
    q = _apply_filters(db.table("internships").select("*"))
    if featured_first:
        q = q.order("is_featured", desc=True).order("scraped_at", desc=True)
    else:
        q = q.order("scraped_at", desc=True)
    result = q.range(offset, offset + limit - 1).execute()

    count_result = _apply_filters(db.table("internships").select("id", count="exact")).execute()

    return {
        "page": page, "limit": limit,
        "total": count_result.count or 0,
        "results": result.data,
        "count": len(result.data),
    }


@app.get("/internships/stats/summary")
async def get_stats():
    db = get_db()
    total   = db.table("internships").select("id", count="exact").eq("is_active", True).execute()
    cutoff  = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    recent  = db.table("internships").select("id", count="exact").eq("is_active", True).gte("scraped_at", cutoff).execute()

    try:
        cr = db.rpc("count_by_country").execute()
        sr = db.rpc("count_by_source").execute()
        by_country = {r["location_country"]: r["count"] for r in (cr.data or [])}
        by_source  = {r["source"]: r["count"] for r in (sr.data or [])}
    except Exception:
        raw_c = db.table("internships").select("location_country").eq("is_active", True).execute()
        raw_s = db.table("internships").select("source").eq("is_active", True).execute()
        by_country = {}
        for r in raw_c.data: by_country[r["location_country"]] = by_country.get(r["location_country"], 0) + 1
        by_source = {}
        for r in raw_s.data: by_source[r["source"]] = by_source.get(r["source"], 0) + 1

    return {"total_active": total.count, "new_last_24h": recent.count, "by_country": by_country, "by_source": by_source}


@app.get("/internships/{internship_id}")
async def get_internship(internship_id: str):
    db = get_db()
    result = db.table("internships").select("*").eq("id", internship_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Internship not found")
    try:
        db.table("page_views").insert({"path": f"/internships/{internship_id}"}).execute()
    except Exception:
        pass
    return result.data[0]


@app.get("/filters")
async def get_filters():
    return {
        "countries":  ["Hong Kong", "Singapore", "Japan", "South Korea", "Taiwan"],
        "industries": ["Finance", "Technology", "Marketing", "Consulting", "Legal",
                       "Design", "Operations", "Human Resources", "Research", "General"],
        "languages":  ["English", "Chinese", "Japanese", "Korean", "Bilingual"],
        "sources":    ["jobsdb", "mycareersfuture", "wantedly", "indeed"],
    }


# ── Alerts ────────────────────────────────────────────────────────────────────
@app.post("/alerts", status_code=201)
async def create_alert(alert: AlertCreate, background_tasks: BackgroundTasks):
    db = get_db()
    if alert.frequency not in ("instant", "daily", "weekly"):
        raise HTTPException(status_code=400, detail="frequency must be instant, daily, or weekly.")

    existing = db.table("user_alerts").select("id") \
        .eq("email", str(alert.email)).eq("country", alert.country or "").eq("industry", alert.industry or "").execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Alert with these filters already exists.")

    parts = []
    if alert.country:   parts.append(f"🌏 Country: {alert.country}")
    if alert.industry:  parts.append(f"📂 Industry: {alert.industry}")
    if alert.language:  parts.append(f"🌐 Language: {alert.language}")
    if alert.keywords:  parts.append(f"🔍 Keywords: {alert.keywords}")
    if alert.paid_only: parts.append("💰 Paid only")
    parts.append(f"⏱ Frequency: {alert.frequency}")
    filters_summary = "<br>".join(parts) if parts else "All internships across Asia"

    unsub_token = secrets.token_urlsafe(32)
    result = db.table("user_alerts").insert({
        **alert.model_dump(), "confirmed": False, "is_active": True, "unsubscribe_token": unsub_token,
    }).execute()
    alert_id = result.data[0]["id"]

    background_tasks.add_task(_send_and_store_confirmation, alert_id, str(alert.email), alert.name or "", filters_summary)
    return {"message": "Check your email to confirm your alert.", "id": alert_id}


def _send_and_store_confirmation(alert_id: str, email: str, name: str, filters_summary: str):
    token = send_confirmation_email(alert_id, email, name, filters_summary)
    if token:
        db = get_db()
        expires = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        db.table("user_alerts").update({"confirmation_token": token, "confirmation_expires_at": expires}).eq("id", alert_id).execute()


@app.get("/confirm-alert")
async def confirm_alert(id: str, token: str):
    db = get_db()
    result = db.table("user_alerts").select("*").eq("id", id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Alert not found.")
    alert = result.data[0]
    if alert.get("confirmed"):
        return RedirectResponse(url=f"{FRONTEND_URL}/alerts/confirmed")
    stored_token = alert.get("confirmation_token")
    expires_at   = alert.get("confirmation_expires_at")
    if not stored_token or stored_token != token:
        raise HTTPException(status_code=400, detail="Invalid confirmation token.")
    if expires_at and datetime.now(timezone.utc) > datetime.fromisoformat(expires_at):
        raise HTTPException(status_code=400, detail="Confirmation link expired. Please sign up again.")
    db.table("user_alerts").update({"confirmed": True, "confirmation_token": None}).eq("id", id).execute()
    return RedirectResponse(url=f"{FRONTEND_URL}/alerts/confirmed")


@app.get("/alerts/unsubscribe")
async def unsubscribe(id: str, token: str):
    """Token-gated — prevents anyone with a UUID from unsubscribing someone else."""
    db = get_db()
    result = db.table("user_alerts").select("id", "unsubscribe_token").eq("id", id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Alert not found.")
    if result.data[0].get("unsubscribe_token") != token:
        raise HTTPException(status_code=400, detail="Invalid unsubscribe token.")
    db.table("user_alerts").update({"is_active": False, "confirmed": False}).eq("id", id).execute()
    return RedirectResponse(url=f"{FRONTEND_URL}/alerts/unsubscribed")


@app.get("/alerts")
async def get_alerts(email: str = Query(...)):
    db = get_db()
    return db.table("user_alerts").select("*").eq("email", email).eq("is_active", True).execute().data


@app.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: str, token: str = Query(...)):
    db = get_db()
    row = db.table("user_alerts").select("unsubscribe_token").eq("id", alert_id).execute()
    if not row.data:
        raise HTTPException(status_code=404, detail="Alert not found.")
    if row.data[0].get("unsubscribe_token") != token:
        raise HTTPException(status_code=403, detail="Invalid token.")
    db.table("user_alerts").update({"is_active": False}).eq("id", alert_id).execute()
    return {"message": "Alert deactivated"}


# ── Affiliate ─────────────────────────────────────────────────────────────────
@app.post("/affiliate/click")
async def track_affiliate_click(click: AffiliateClick):
    if click.affiliate not in ALLOWED_AFFILIATES:
        raise HTTPException(status_code=400, detail=f"Unknown affiliate.")
    db = get_db()
    db.table("affiliate_clicks").insert({
        "affiliate": click.affiliate, "source": click.source, "internship_id": click.internship_id,
    }).execute()
    return {"ok": True}


# ── Company job post submissions ──────────────────────────────────────────────
@app.post("/jobs/submit", status_code=201)
async def submit_job_post(job: JobPostRequest, background_tasks: BackgroundTasks):
    db = get_db()
    result = db.table("job_submissions").insert({
        "company_name": job.company_name, "contact_email": str(job.contact_email),
        "contact_name": job.contact_name, "role_title": job.role_title,
        "location_country": job.location_country, "location_city": job.location_city,
        "industry": job.industry, "is_paid": job.is_paid, "stipend_range": job.stipend_range,
        "language_required": job.language_required, "description": job.description,
        "apply_url": job.apply_url, "duration_weeks": job.duration_weeks,
        "tier": job.tier, "message": job.message, "status": "pending",
    }).execute()
    submission_id = result.data[0]["id"] if result.data else "unknown"
    if OWNER_EMAIL:
        background_tasks.add_task(send_job_post_notification, job.model_dump(), submission_id, OWNER_EMAIL)
    return {"message": "Submission received! We'll review within 24 hours.", "id": submission_id, "tier": job.tier}


# ── Admin (all require X-Admin-Secret header) ─────────────────────────────────
@app.get("/admin/scraper-runs", dependencies=[Depends(require_admin)])
async def get_scraper_runs(limit: int = 30):
    return get_db().table("scraper_runs").select("*").order("started_at", desc=True).limit(limit).execute().data


@app.get("/admin/stats", dependencies=[Depends(require_admin)])
async def admin_stats():
    db = get_db()
    alerts    = db.table("user_alerts").select("id", count="exact").eq("is_active", True).eq("confirmed", True).execute()
    pending   = db.table("user_alerts").select("id", count="exact").eq("confirmed", False).eq("is_active", True).execute()
    notifs    = db.table("alert_notifications").select("id", count="exact").execute()
    clicks_r  = db.table("affiliate_clicks").select("affiliate").execute()
    subs      = db.table("job_submissions").select("*").order("created_at", desc=True).limit(20).execute()
    views     = db.table("page_views").select("id", count="exact").gte("viewed_at", (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()).execute()
    click_counts: dict = {}
    for r in clicks_r.data: click_counts[r["affiliate"]] = click_counts.get(r["affiliate"], 0) + 1
    return {
        "confirmed_alerts": alerts.count, "pending_confirmation": pending.count,
        "total_notifications_sent": notifs.count, "affiliate_clicks": click_counts,
        "page_views_24h": views.count, "job_submissions": subs.data,
    }


@app.post("/admin/trigger-scrape", dependencies=[Depends(require_admin)])
async def trigger_scrape(background_tasks: BackgroundTasks, source: Optional[str] = None):
    if source:
        background_tasks.add_task(run_scraper_by_name, source)
        return {"message": f"Scrape triggered for {source}"}
    background_tasks.add_task(run_all_scrapers)
    return {"message": "Full scrape triggered"}


@app.post("/admin/send-weekly-digests", dependencies=[Depends(require_admin)])
async def trigger_weekly_digests(background_tasks: BackgroundTasks):
    background_tasks.add_task(_send_all_weekly_digests)
    return {"message": "Weekly digests queued"}


@app.patch("/admin/internships/{internship_id}/feature", dependencies=[Depends(require_admin)])
async def feature_internship(internship_id: str, req: FeatureListingRequest):
    until = (datetime.now(timezone.utc) + timedelta(days=req.days)).isoformat()
    get_db().table("internships").update({
        "is_featured": True, "featured_until": until, "featured_label": req.label,
    }).eq("id", internship_id).execute()
    return {"message": f"Featured for {req.days} days.", "until": until}


@app.patch("/admin/internships/{internship_id}/unfeature", dependencies=[Depends(require_admin)])
async def unfeature_internship(internship_id: str):
    get_db().table("internships").update({"is_featured": False, "featured_until": None, "featured_label": None}).eq("id", internship_id).execute()
    return {"message": "Unfeatured."}


@app.patch("/admin/job-submissions/{submission_id}/approve", dependencies=[Depends(require_admin)])
async def approve_job_submission(submission_id: str):
    db = get_db()
    sub = db.table("job_submissions").select("*").eq("id", submission_id).execute()
    if not sub.data:
        raise HTTPException(status_code=404, detail="Submission not found.")
    s = sub.data[0]
    from core.db import upsert_internship
    internship_data = {
        "title": s["role_title"], "company_name": s["company_name"],
        "location_country": s["location_country"], "location_city": s.get("location_city"),
        "industry": s.get("industry", "General"), "is_paid": s.get("is_paid", True),
        "stipend_amount": s.get("stipend_range"), "language_required": s.get("language_required", "English"),
        "description_snippet": (s.get("description") or "")[:400],
        "apply_url": s["apply_url"], "source": "direct",
        "is_featured": s.get("tier") == "featured",
        "featured_until": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat() if s.get("tier") == "featured" else None,
        "featured_label": "Featured" if s.get("tier") == "featured" else None,
        "duration_weeks": s.get("duration_weeks"),
    }
    is_new, iid = upsert_internship(internship_data)
    db.table("job_submissions").update({"status": "approved", "internship_id": iid}).eq("id", submission_id).execute()
    return {"message": "Approved and published.", "internship_id": iid}


@app.get("/health")
async def health():
    return {"status": "ok", "version": "3.0.0"}


# ── Digest helpers ────────────────────────────────────────────────────────────
def _send_all_weekly_digests():
    db = get_db()
    weekly = db.table("user_alerts").select("*").eq("frequency", "weekly").eq("is_active", True).eq("confirmed", True).execute()
    for alert in weekly.data:
        queued = db.table("digest_queue").select("internship_id").eq("alert_id", alert["id"]).eq("sent", False).execute()
        if not queued.data: continue
        ids = [r["internship_id"] for r in queued.data]
        jobs = db.table("internships").select("*").in_("id", ids).execute().data
        if jobs:
            send_weekly_digest(alert, jobs)
            db.table("digest_queue").update({"sent": True}).eq("alert_id", alert["id"]).execute()


def _send_all_daily_digests():
    db = get_db()
    daily = db.table("user_alerts").select("*").eq("frequency", "daily").eq("is_active", True).eq("confirmed", True).execute()
    day_ago = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    for alert in daily.data:
        q = db.table("internships").select("*").eq("is_active", True).gte("scraped_at", day_ago)
        if alert.get("country"):   q = q.ilike("location_country", f"%{alert['country']}%")
        if alert.get("industry"):  q = q.ilike("industry", f"%{alert['industry']}%")
        if alert.get("paid_only"): q = q.eq("is_paid", True)
        jobs = q.order("scraped_at", desc=True).limit(20).execute().data
        if not jobs: continue
        already = {r["internship_id"] for r in db.table("alert_notifications").select("internship_id").eq("alert_id", alert["id"]).execute().data}
        fresh = [j for j in jobs if j["id"] not in already]
        if not fresh: continue
        send_daily_digest(alert, fresh)
        for job in fresh:
            try: db.table("alert_notifications").insert({"alert_id": alert["id"], "internship_id": job["id"]}).execute()
            except Exception: pass
