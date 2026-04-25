import asyncio
import random
from datetime import datetime, timezone
from playwright.async_api import async_playwright
from scrapers.base import BaseScraper
from core.config import MAX_PAGES

# Rotate user agents to avoid bot detection
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
]

INDUSTRY_KEYWORDS = {
    "finance": ["finance", "banking", "investment", "accounting", "fintech", "equity", "trading"],
    "technology": ["software", "developer", "engineer", "data", "it", "tech", "ai", "ml", "cyber"],
    "marketing": ["marketing", "social media", "content", "brand", "pr", "communications"],
    "consulting": ["consulting", "strategy", "advisory", "management"],
    "legal": ["legal", "law", "compliance", "regulatory"],
    "design": ["design", "ux", "ui", "graphic", "creative"],
    "operations": ["operations", "supply chain", "logistics", "procurement"],
    "human resources": ["hr", "human resources", "recruitment", "talent"],
    "research": ["research", "analyst", "analysis", "quantitative"],
}


def classify_industry(title: str, description: str = "") -> str:
    text = (title + " " + description).lower()
    for industry, keywords in INDUSTRY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return industry.title()
    return "General"


def detect_language(title: str, description: str = "") -> str:
    text = (title + " " + description).lower()
    if any(kw in text for kw in ["cantonese", "mandarin", "chinese", "putonghua", "廣東話", "普通話"]):
        return "Chinese"
    if any(kw in text for kw in ["japanese", "日本語", "jlpt"]):
        return "Japanese"
    if any(kw in text for kw in ["korean", "한국어"]):
        return "Korean"
    if any(kw in text for kw in ["bilingual", "english and"]):
        return "Bilingual"
    return "English"


class JobsDBScraper(BaseScraper):
    source_name = "jobsdb"
    base_url = "https://hk.jobsdb.com"
    search_url = "https://hk.jobsdb.com/jobs/internship"

    async def scrape(self) -> list[dict]:
        listings = []

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
            )
            context = await browser.new_context(
                user_agent=random.choice(USER_AGENTS),
                viewport={"width": 1440, "height": 900},
                locale="en-HK",
            )

            # Mask automation signals
            await context.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            """)

            page = await context.new_page()

            for page_num in range(1, MAX_PAGES + 1):
                url = f"{self.search_url}?page={page_num}" if page_num > 1 else self.search_url
                print(f"[JOBSDB] Scraping page {page_num}: {url}")

                try:
                    await page.goto(url, wait_until="networkidle", timeout=30000)
                    await asyncio.sleep(random.uniform(2, 4))

                    # Check if we hit a CAPTCHA or empty page
                    content = await page.content()
                    if "captcha" in content.lower() or "blocked" in content.lower():
                        print("[JOBSDB] Bot detection triggered, stopping.")
                        break

                    # Wait for job cards
                    try:
                        await page.wait_for_selector('[data-automation="job-card"]', timeout=10000)
                    except Exception:
                        print(f"[JOBSDB] No job cards on page {page_num}, stopping.")
                        break

                    job_cards = await page.query_selector_all('[data-automation="job-card"]')

                    if not job_cards:
                        print(f"[JOBSDB] No listings on page {page_num}, done.")
                        break

                    for card in job_cards:
                        try:
                            listing = await self._parse_card(card, page)
                            if listing:
                                listings.append(listing)
                        except Exception as e:
                            print(f"[JOBSDB] Error parsing card: {e}")
                            continue

                    print(f"[JOBSDB] Page {page_num}: {len(job_cards)} cards found")
                    await self.polite_delay()

                except Exception as e:
                    print(f"[JOBSDB] Error on page {page_num}: {e}")
                    break

            await browser.close()

        return listings

    async def _parse_card(self, card, page) -> dict | None:
        try:
            # Title
            title_el = await card.query_selector('[data-automation="jobTitle"]')
            title = await title_el.inner_text() if title_el else None
            if not title:
                return None

            # Skip non-internship listings (sanity check)
            if "intern" not in title.lower() and "internship" not in title.lower():
                # Still include if page is internship-filtered
                pass

            # Company
            company_el = await card.query_selector('[data-automation="jobCompany"]')
            company = await company_el.inner_text() if company_el else "Unknown"

            # Location
            location_el = await card.query_selector('[data-automation="jobLocation"]')
            location_text = await location_el.inner_text() if location_el else "Hong Kong"

            # Salary/stipend
            salary_el = await card.query_selector('[data-automation="jobSalary"]')
            salary_text = await salary_el.inner_text() if salary_el else ""

            # Posted date
            date_el = await card.query_selector('[data-automation="jobListingDate"]')
            date_text = await date_el.inner_text() if date_el else ""

            # Apply URL
            link_el = await card.query_selector('a[data-automation="jobTitle"]')
            href = await link_el.get_attribute("href") if link_el else ""
            apply_url = f"{self.base_url}{href}" if href and href.startswith("/") else href

            # Description snippet (from card preview if available)
            desc_el = await card.query_selector('[data-automation="jobDescription"]')
            description = await desc_el.inner_text() if desc_el else ""

            # Parse compensation
            is_paid = False
            stipend_amount = None
            if salary_text and salary_text.strip() not in ["", "Salary undisclosed"]:
                is_paid = True
                stipend_amount = salary_text.strip()

            # Parse location
            city = location_text.split(",")[0].strip() if "," in location_text else location_text.strip()

            return {
                "title": title.strip(),
                "company_name": company.strip(),
                "location_city": city,
                "location_country": "Hong Kong",
                "industry": classify_industry(title, description),
                "language_required": detect_language(title, description),
                "is_paid": is_paid,
                "stipend_amount": stipend_amount,
                "stipend_currency": "HKD" if is_paid else None,
                "description_snippet": description[:300] if description else None,
                "apply_url": apply_url,
                "posted_date": self._parse_date(date_text),
                "source": "jobsdb",
            }

        except Exception as e:
            print(f"[JOBSDB] Card parse error: {e}")
            return None

    def _parse_date(self, date_text: str) -> str:
        """Convert relative dates like '2 days ago' to ISO format."""
        from datetime import timedelta
        now = datetime.now(timezone.utc)
        date_text = date_text.lower().strip()

        try:
            if "today" in date_text or "just now" in date_text or "hour" in date_text:
                return now.isoformat()
            elif "yesterday" in date_text:
                return (now - timedelta(days=1)).isoformat()
            elif "day" in date_text:
                days = int(''.join(filter(str.isdigit, date_text)) or 1)
                return (now - timedelta(days=days)).isoformat()
            elif "week" in date_text:
                weeks = int(''.join(filter(str.isdigit, date_text)) or 1)
                return (now - timedelta(weeks=weeks)).isoformat()
            elif "month" in date_text:
                months = int(''.join(filter(str.isdigit, date_text)) or 1)
                return (now - timedelta(days=months * 30)).isoformat()
        except Exception:
            pass

        return now.isoformat()
