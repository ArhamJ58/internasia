import os
import secrets
import resend
from core.config import RESEND_API_KEY, FRONTEND_URL

resend.api_key = RESEND_API_KEY

APP_URL    = FRONTEND_URL
FROM_EMAIL = "InternAsia <alerts@internasia.app>"
SPONSOR    = os.getenv("DIGEST_SPONSOR", "")          # e.g. "Kickresume"
SPONSOR_URL = os.getenv("DIGEST_SPONSOR_URL", "")     # e.g. "https://kickresume.com?ref=internasia"
SPONSOR_COPY = os.getenv("DIGEST_SPONSOR_COPY", "")   # e.g. "Build a stunning CV in minutes"


def _sponsor_block() -> str:
    """Inline sponsor slot for digest emails — rotate via env vars. Empty if not set."""
    if not SPONSOR or not SPONSOR_URL:
        return ""
    copy = SPONSOR_COPY or f"Discover {SPONSOR}"
    return f"""
    <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:12px;">
        <span style="color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;font-size:10px;">Sponsored · </span>
        <strong style="color:#e8edf5;">{SPONSOR}</strong>
        <span style="color:#8899bb;"> — {copy}</span>
        <a href="{SPONSOR_URL}" style="color:#f0b429;font-weight:700;margin-left:10px;text-decoration:none;">{SPONSOR} →</a>
    </div>"""


def send_confirmation_email(alert_id: str, email: str, name: str, filters_summary: str) -> str | None:
    token = secrets.token_urlsafe(32)
    # Confirmation link goes to backend (which then redirects to frontend)
    backend_url = os.getenv("BACKEND_URL", APP_URL)
    confirm_url = f"{backend_url}/confirm-alert?id={alert_id}&token={token}"

    html = f"""
    <div style="font-family:sans-serif;max-width:580px;margin:auto;padding:24px;">
        <div style="background:#1e1b4b;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">📬 Confirm your alert</h1>
            <p style="color:#a5b4fc;margin:6px 0 0;font-size:14px;">InternAsia — Real-time Internship Alerts</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:28px;border-radius:0 0 8px 8px;">
            <p style="color:#374151;font-size:15px;margin-top:0;">Hey {name or 'there'}! One click to activate.</p>
            <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0;font-size:14px;color:#6b7280;">
                <strong style="color:#374151;display:block;margin-bottom:8px;">Your alert filters:</strong>
                {filters_summary}
            </div>
            <a href="{confirm_url}"
               style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
                      font-weight:bold;padding:14px 28px;border-radius:8px;font-size:15px;">
                ✅ Confirm &amp; Activate Alert
            </a>
            <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
                This link expires in 24 hours. If you didn't sign up, ignore this email.
            </p>
        </div>
    </div>"""

    try:
        resend.Emails.send({"from": FROM_EMAIL, "to": [email],
                            "subject": "Confirm your InternAsia alert", "html": html})
        return token
    except Exception as e:
        print(f"[EMAIL] Confirmation send failed: {e}")
        return None


def send_alert_email(alert: dict, internship: dict):
    country    = internship.get("location_country", "")
    city       = internship.get("location_city", "")
    location   = f"{city}, {country}" if city else country
    stipend    = internship.get("stipend_amount")
    pay_text   = stipend if stipend else ("Paid" if internship.get("is_paid") else "Unpaid")
    pay_color  = "#059669" if internship.get("is_paid") else "#6b7280"

    # Token-gated unsubscribe URL
    unsub_token = alert.get("unsubscribe_token", "")
    unsubscribe_url = f"{APP_URL}/alerts/unsubscribed?id={alert['id']}&token={unsub_token}"
    # Hit backend for actual DB update
    backend_url = os.getenv("BACKEND_URL", APP_URL)
    unsub_action = f"{backend_url}/alerts/unsubscribe?id={alert['id']}&token={unsub_token}"

    source_labels = {"jobsdb": "JobsDB", "mycareersfuture": "MyCareersFuture",
                     "wantedly": "Wantedly", "indeed": "Indeed", "direct": "InternAsia"}
    source = source_labels.get(internship.get("source", ""), internship.get("source", "").upper())

    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;">
        <div style="background:linear-gradient(135deg,#1e1b4b,#4f46e5);padding:20px 24px;border-radius:8px 8px 0 0;">
            <p style="color:#a5b4fc;margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;">New Match 🎯</p>
            <h1 style="color:#fff;margin:0;font-size:22px;line-height:1.3;">{internship.get('title')}</h1>
            <p style="color:#c7d2fe;margin:6px 0 0;font-size:15px;">{internship.get('company_name')}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <tr>
                    <td style="width:50%;padding:10px;background:#f9fafb;border-radius:6px;">
                        <div style="font-size:11px;color:#9ca3af;margin-bottom:3px;">📍 LOCATION</div>
                        <div style="font-size:14px;font-weight:600;color:#111;">{location}</div>
                    </td>
                    <td style="width:8px;"></td>
                    <td style="width:50%;padding:10px;background:#f9fafb;border-radius:6px;">
                        <div style="font-size:11px;color:#9ca3af;margin-bottom:3px;">💰 PAY</div>
                        <div style="font-size:14px;font-weight:600;color:{pay_color};">{pay_text}</div>
                    </td>
                </tr>
                <tr><td colspan="3" style="height:8px;"></td></tr>
                <tr>
                    <td style="padding:10px;background:#f9fafb;border-radius:6px;">
                        <div style="font-size:11px;color:#9ca3af;margin-bottom:3px;">🌐 LANGUAGE</div>
                        <div style="font-size:14px;font-weight:600;color:#111;">{internship.get('language_required','English')}</div>
                    </td>
                    <td></td>
                    <td style="padding:10px;background:#f9fafb;border-radius:6px;">
                        <div style="font-size:11px;color:#9ca3af;margin-bottom:3px;">📂 INDUSTRY</div>
                        <div style="font-size:14px;font-weight:600;color:#111;">{internship.get('industry','General')}</div>
                    </td>
                </tr>
            </table>
            {f'<p style="color:#4b5563;font-size:14px;line-height:1.7;margin-bottom:20px;">{internship.get("description_snippet")}</p>' if internship.get("description_snippet") else ""}
            <a href="{internship.get('apply_url')}"
               style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
                      font-weight:bold;padding:13px 26px;border-radius:8px;font-size:15px;margin-bottom:8px;">
                Apply Now →
            </a>
            <p style="color:#9ca3af;font-size:11px;margin-top:4px;">Via {source} · Scraped just now</p>
            <hr style="margin:24px 0;border:none;border-top:1px solid #f3f4f6;">
            <div style="background:#eff6ff;border-radius:8px;padding:16px;margin-bottom:20px;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1e40af;">📄 Stand out with a great CV</p>
                <a href="https://www.kickresume.com?ref=internasia" style="font-size:12px;color:#4f46e5;font-weight:bold;margin-right:12px;">Kickresume →</a>
                <a href="https://enhancv.com?ref=internasia" style="font-size:12px;color:#4f46e5;font-weight:bold;">Enhancv →</a>
            </div>
            <p style="font-size:11px;color:#d1d5db;margin:0;">
                <a href="{APP_URL}" style="color:#a5b4fc;">InternAsia</a> ·
                <a href="{unsub_action}" style="color:#d1d5db;">Unsubscribe</a>
            </p>
        </div>
    </div>"""

    try:
        resend.Emails.send({
            "from": FROM_EMAIL, "to": [alert["email"]],
            "subject": f"🎯 {internship.get('title')} at {internship.get('company_name')} ({country})",
            "html": html,
        })
        print(f"[EMAIL] Alert sent → {alert['email']}: {internship.get('title')}")
    except Exception as e:
        print(f"[EMAIL] Failed → {alert['email']}: {e}")


def send_daily_digest(alert: dict, internships: list):
    if not internships:
        return
    _send_digest_email(alert, internships, subject_prefix="📅 Daily", title="Your Daily Digest")


def send_weekly_digest(alert: dict, internships: list):
    if not internships:
        return
    _send_digest_email(alert, internships, subject_prefix="📋 Weekly", title="Your Weekly Digest")


def _send_digest_email(alert: dict, internships: list, subject_prefix: str, title: str):
    unsub_token = alert.get("unsubscribe_token", "")
    backend_url = os.getenv("BACKEND_URL", APP_URL)
    unsub_action = f"{backend_url}/alerts/unsubscribe?id={alert['id']}&token={unsub_token}"

    rows = ""
    for job in internships[:15]:
        pay = job.get("stipend_amount") or ("Paid" if job.get("is_paid") else "Unpaid")
        rows += f"""
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
                <div style="font-weight:600;font-size:14px;color:#111;">{job.get('title')}</div>
                <div style="font-size:12px;color:#6b7280;margin:2px 0;">
                    {job.get('company_name')} · {job.get('location_country')} · {pay}
                </div>
                <a href="{job.get('apply_url')}" style="font-size:12px;color:#4f46e5;font-weight:600;">Apply →</a>
            </td>
        </tr>"""

    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;">
        <div style="background:#1e1b4b;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">{title}</h1>
            <p style="color:#a5b4fc;margin:6px 0 0;font-size:14px;">{len(internships)} new matching internship{"s" if len(internships) != 1 else ""}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
            {_sponsor_block()}
            <table style="width:100%;border-collapse:collapse;">{rows}</table>
            <a href="{APP_URL}/internships"
               style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;
                      font-weight:bold;padding:12px 24px;border-radius:8px;margin-top:20px;font-size:14px;">
                View All →
            </a>
            <hr style="margin:24px 0;border:none;border-top:1px solid #f3f4f6;">
            <p style="font-size:11px;color:#d1d5db;">
                <a href="{APP_URL}" style="color:#a5b4fc;">InternAsia</a> ·
                <a href="{unsub_action}" style="color:#d1d5db;">Unsubscribe</a>
            </p>
        </div>
    </div>"""

    try:
        resend.Emails.send({
            "from": FROM_EMAIL, "to": [alert["email"]],
            "subject": f"{subject_prefix}: {len(internships)} new internship{'s' if len(internships) != 1 else ''} matching your alert",
            "html": html,
        })
    except Exception as e:
        print(f"[EMAIL] Digest failed → {alert['email']}: {e}")


def send_scraper_health_alert(source: str, error: str, owner_email: str):
    html = f"""
    <div style="font-family:monospace;max-width:580px;margin:auto;padding:24px;
                border:2px solid #ef4444;border-radius:8px;">
        <h2 style="color:#ef4444;margin-top:0;">⚠️ Scraper Failed: {source.upper()}</h2>
        <pre style="background:#fef2f2;padding:12px;border-radius:6px;font-size:13px;
                    color:#7f1d1d;white-space:pre-wrap;">{error}</pre>
        <p style="color:#6b7280;font-size:13px;">Check Render logs or trigger a manual scrape via your admin dashboard.</p>
    </div>"""
    try:
        resend.Emails.send({
            "from": FROM_EMAIL, "to": [owner_email],
            "subject": f"🚨 InternAsia scraper down: {source}", "html": html,
        })
    except Exception as e:
        print(f"[EMAIL] Health alert failed: {e}")


def send_job_post_notification(job: dict, submission_id: str, owner_email: str):
    """Notify owner when a company submits a job for review."""
    tier_badge = "⭐ FEATURED ($99)" if job.get("tier") == "featured" else "Standard (free)"
    html = f"""
    <div style="font-family:sans-serif;max-width:580px;margin:auto;padding:24px;
                border:2px solid #f0b429;border-radius:8px;">
        <h2 style="color:#f0b429;margin-top:0;">📬 New Job Submission</h2>
        <p><strong>ID:</strong> {submission_id}</p>
        <p><strong>Tier:</strong> {tier_badge}</p>
        <p><strong>Company:</strong> {job.get('company_name')}</p>
        <p><strong>Contact:</strong> {job.get('contact_email')} ({job.get('contact_name','')})</p>
        <p><strong>Role:</strong> {job.get('role_title')}</p>
        <p><strong>Country:</strong> {job.get('location_country')} · {job.get('location_city','')}</p>
        <p><strong>Industry:</strong> {job.get('industry','')}</p>
        <p><strong>Pay:</strong> {'Paid — ' + (job.get('stipend_range') or 'amount TBD') if job.get('is_paid') else 'Unpaid'}</p>
        <p><strong>Apply URL:</strong> <a href="{job.get('apply_url')}">{job.get('apply_url')}</a></p>
        <p><strong>Message:</strong> {job.get('message','—')}</p>
        <hr>
        <p style="font-size:13px;color:#6b7280;">
            Approve via admin dashboard or API:<br>
            <code>PATCH /admin/job-submissions/{submission_id}/approve</code>
        </p>
    </div>"""
    try:
        resend.Emails.send({
            "from": FROM_EMAIL, "to": [owner_email],
            "subject": f"📬 New {'FEATURED ' if job.get('tier')=='featured' else ''}job submission: {job.get('role_title')} @ {job.get('company_name')}",
            "html": html,
        })
    except Exception as e:
        print(f"[EMAIL] Job post notification failed: {e}")
