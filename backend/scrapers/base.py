import asyncio
import random
from datetime import datetime, timezone
from abc import ABC, abstractmethod
from core.db import (
    upsert_internship, mark_stale_inactive,
    log_scraper_run, finish_scraper_run,
    get_matching_alerts, has_been_notified, log_notification
)
from core.alerts import send_alert_email
from core.config import REQUEST_DELAY_SECONDS


class BaseScraper(ABC):
    source_name: str = ""

    async def run(self):
        run_id    = log_scraper_run(self.source_name)
        run_start = datetime.now(timezone.utc).isoformat()
        found = 0
        new   = 0

        print(f"[{self.source_name.upper()}] Starting scrape...")

        try:
            listings = await self.scrape()
            found = len(listings)

            for listing in listings:
                listing["source"] = self.source_name
                is_new, internship_id = upsert_internship(listing)

                if is_new and internship_id:
                    new += 1
                    print(f"[{self.source_name.upper()}] NEW: {listing.get('title')} @ {listing.get('company_name')}")
                    await self._fire_instant_alerts(listing, internship_id)

                await asyncio.sleep(random.uniform(0.3, 0.8))

            # Mark anything not refreshed this run as inactive
            mark_stale_inactive(self.source_name, run_start, run_id)
            finish_scraper_run(run_id, found, new)
            print(f"[{self.source_name.upper()}] Done. Found={found}, New={new}")

        except Exception as e:
            finish_scraper_run(run_id, found, new, error=str(e))
            print(f"[{self.source_name.upper()}] ERROR: {e}")
            raise

    async def _fire_instant_alerts(self, internship: dict, internship_id: str):
        """Send instant alert emails for confirmed alerts on matching listings."""
        matching = get_matching_alerts(internship)
        for alert in matching:
            if not has_been_notified(alert["id"], internship_id):
                send_alert_email(alert, internship)
                log_notification(alert["id"], internship_id)

    async def polite_delay(self):
        delay = REQUEST_DELAY_SECONDS + random.uniform(0, 1.5)
        await asyncio.sleep(delay)

    @abstractmethod
    async def scrape(self) -> list[dict]:
        pass
