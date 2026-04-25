import asyncio
import os
from datetime import datetime, timezone, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from scrapers.jobsdb import JobsDBScraper
from scrapers.mycareersfuture import MyCareersFutureScraper
from scrapers.wantedly import WantedlyScraper
from scrapers.indeed import IndeedScraper
from core.config import SCRAPE_INTERVAL_HOURS, get_db
from core.alerts import send_scraper_health_alert

OWNER_EMAIL           = os.getenv("OWNER_EMAIL", "")
ZERO_RESULT_THRESHOLD = int(os.getenv("scraper_alert_threshold", 0))


async def run_all_scrapers():
    scrapers = [JobsDBScraper(), MyCareersFutureScraper(), WantedlyScraper(), IndeedScraper()]
    for scraper in scrapers:
        try:
            await scraper.run()

            db = get_db()
            recent = db.table("scraper_runs") \
                .select("listings_found, status") \
                .eq("source", scraper.source_name) \
                .order("started_at", desc=True).limit(1).execute()

            if recent.data:
                run = recent.data[0]
                if run["status"] == "error" and OWNER_EMAIL:
                    send_scraper_health_alert(scraper.source_name, "Scraper returned error status", OWNER_EMAIL)
                elif run["listings_found"] <= ZERO_RESULT_THRESHOLD and OWNER_EMAIL:
                    send_scraper_health_alert(
                        scraper.source_name,
                        f"Scraper returned {run['listings_found']} listings — possible bot block or site change.",
                        OWNER_EMAIL
                    )
        except Exception as e:
            print(f"[SCHEDULER] {scraper.source_name} failed: {e}")
            if OWNER_EMAIL:
                send_scraper_health_alert(scraper.source_name, str(e), OWNER_EMAIL)

        await asyncio.sleep(15)


async def run_scraper_by_name(name: str):
    scrapers = {
        "jobsdb":          JobsDBScraper(),
        "mycareersfuture": MyCareersFutureScraper(),
        "wantedly":        WantedlyScraper(),
        "indeed":          IndeedScraper(),
    }
    scraper = scrapers.get(name)
    if scraper:
        await scraper.run()
    else:
        raise ValueError(f"Unknown scraper: {name}")


async def cleanup_stale_confirmations():
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    deleted = db.table("user_alerts") \
        .delete() \
        .eq("confirmed", False) \
        .lt("confirmation_expires_at", now) \
        .execute()
    if deleted.data:
        print(f"[CLEANUP] Removed {len(deleted.data)} expired unconfirmed alerts")


async def expire_featured_listings():
    """Auto-unfeature listings whose paid period has ended."""
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()
    expired = db.table("internships") \
        .update({"is_featured": False, "featured_until": None, "featured_label": None}) \
        .eq("is_featured", True) \
        .lt("featured_until", now) \
        .execute()
    if expired.data:
        print(f"[CLEANUP] Expired {len(expired.data)} featured listings")


# ── Daily and weekly digest triggers (no circular import) ─────────────────────
# These functions live here and import from main at call time to break the cycle.

async def trigger_daily_digests():
    """Called by APScheduler — imports at runtime to avoid circular import."""
    from main import _send_all_daily_digests
    _send_all_daily_digests()


async def trigger_weekly_digests():
    """Called by APScheduler — imports at runtime to avoid circular import."""
    from main import _send_all_weekly_digests
    _send_all_weekly_digests()


def start_scheduler():
    scheduler = AsyncIOScheduler()

    # Main scrape — every N hours
    scheduler.add_job(run_all_scrapers, IntervalTrigger(hours=SCRAPE_INTERVAL_HOURS),
                      id="scrape_all", max_instances=1, replace_existing=True)

    # Cleanup expired confirmations — every hour
    scheduler.add_job(cleanup_stale_confirmations, IntervalTrigger(hours=1),
                      id="cleanup_confirmations", replace_existing=True)

    # Expire paid featured listings — every hour
    scheduler.add_job(expire_featured_listings, IntervalTrigger(hours=1),
                      id="expire_featured", replace_existing=True)

    # Daily digest — every day at 8am UTC
    scheduler.add_job(trigger_daily_digests,
                      CronTrigger(hour=8, minute=0),
                      id="daily_digest", replace_existing=True)

    # Weekly digest — Monday 9am UTC
    scheduler.add_job(trigger_weekly_digests,
                      CronTrigger(day_of_week="mon", hour=9, minute=0),
                      id="weekly_digest", replace_existing=True)

    scheduler.start()
    print(f"[SCHEDULER] Started. Scraping every {SCRAPE_INTERVAL_HOURS}h. "
          f"Daily digests: 8am UTC. Weekly: Monday 9am UTC.")
    return scheduler
