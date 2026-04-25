import hashlib
from datetime import datetime, timezone
from typing import Optional
from core.config import get_db


def make_hash(company: str, title: str, posted_date: Optional[str]) -> str:
    """
    Deduplication hash. Uses company + title + posted_date.
    If posted_date is None (common for Playwright scrapers that can't parse dates),
    we use a sentinel so null-date listings don't all collapse into one hash.
    """
    date_part = str(posted_date) if posted_date else "undated"
    raw = f"{company.lower().strip()}|{title.lower().strip()}|{date_part}"
    return hashlib.md5(raw.encode()).hexdigest()


def upsert_internship(data: dict) -> tuple[bool, Optional[str]]:
    """
    Insert new internship or refresh scraped_at if already exists.
    Returns (is_new, internship_id).
    """
    db = get_db()
    unique_hash = make_hash(
        data.get("company_name", ""),
        data.get("title", ""),
        data.get("posted_date"),
    )
    data["unique_hash"] = unique_hash
    data["scraped_at"]  = datetime.now(timezone.utc).isoformat()

    existing = db.table("internships").select("id").eq("unique_hash", unique_hash).execute()
    if existing.data:
        db.table("internships").update({
            "scraped_at": data["scraped_at"],
            "is_active":  True,
        }).eq("unique_hash", unique_hash).execute()
        return False, existing.data[0]["id"]

    result = db.table("internships").insert(data).execute()
    if result.data:
        return True, result.data[0]["id"]
    return False, None


def mark_stale_inactive(source: str, run_start: str, run_id: str):
    """
    Mark listings from a source as inactive if they weren't seen (i.e. scraped_at
    was not refreshed) during this run. Uses the run_start timestamp with a small
    buffer to handle listings touched near the start of the run.
    """
    db = get_db()
    db.table("internships") \
        .update({"is_active": False}) \
        .eq("source", source) \
        .lt("scraped_at", run_start) \
        .execute()


def log_scraper_run(source: str) -> str:
    db = get_db()
    result = db.table("scraper_runs").insert({"source": source, "status": "running"}).execute()
    return result.data[0]["id"]


def finish_scraper_run(run_id: str, found: int, new: int, error: str = None):
    db = get_db()
    db.table("scraper_runs").update({
        "finished_at":    datetime.now(timezone.utc).isoformat(),
        "listings_found": found,
        "listings_new":   new,
        "status":         "error" if error else "success",
        "error_message":  error,
    }).eq("id", run_id).execute()


def get_matching_alerts(internship: dict) -> list:
    """
    Find active confirmed alerts matching an internship.
    Pre-filters at DB level where possible to reduce Python-side iteration.
    """
    db = get_db()
    q = db.table("user_alerts").select("*").eq("is_active", True).eq("confirmed", True)

    # Only pull alerts that match country or have no country filter
    country = internship.get("location_country", "")
    if country:
        q = q.or_(f"country.is.null,country.eq.,country.ilike.%{country}%")

    alerts = q.execute()
    matches = []

    for alert in alerts.data:
        if alert["country"] and alert["country"].lower() != country.lower():
            continue
        if alert["industry"] and alert["industry"].lower() != (internship.get("industry") or "").lower():
            continue
        if alert["language"] and alert["language"].lower() not in (internship.get("language_required") or "").lower():
            continue
        if alert["paid_only"] and not internship.get("is_paid"):
            continue
        if alert["keywords"]:
            kws  = [k.strip().lower() for k in alert["keywords"].split(",")]
            title = (internship.get("title") or "").lower()
            if not any(kw in title for kw in kws):
                continue
        # Skip daily/weekly alerts — they're batched, not instant
        if alert.get("frequency") in ("daily", "weekly"):
            continue
        matches.append(alert)

    return matches


def has_been_notified(alert_id: str, internship_id: str) -> bool:
    db = get_db()
    return len(db.table("alert_notifications").select("id")
               .eq("alert_id", alert_id).eq("internship_id", internship_id)
               .execute().data) > 0


def log_notification(alert_id: str, internship_id: str):
    db = get_db()
    try:
        db.table("alert_notifications").insert({"alert_id": alert_id, "internship_id": internship_id}).execute()
    except Exception:
        pass  # UNIQUE constraint means it's fine
