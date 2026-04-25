import asyncio
import random
from playwright.async_api import async_playwright
from scrapers.base import BaseScraper
from scrapers.jobsdb import classify_industry, detect_language, USER_AGENTS
from core.config import MAX_PAGES

# Indeed HK — good volume, moderately bot-resistant
# Strategy: use slow scrolling + realistic delays to avoid detection

INDEED_URLS = [
    ("https://hk.indeed.com/jobs?q=internship&l=Hong+Kong", "Hong Kong"),
    ("https://sg.indeed.com/jobs?q=internship&l=Singapore", "Singapore"),
]


class IndeedScraper(BaseScraper):
    source_name = "indeed"

    async def scrape(self) -> list[dict]:
        listings = []

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-blink-features=AutomationControlled",
                    "--disable-dev-shm-usage",
                ]
            )

            for base_url, country in INDEED_URLS:
                print(f"[INDEED] Starting {country}...")

                for page_num in range(MAX_PAGES):
                    context = await browser.new_context(
                        user_agent=random.choice(USER_AGENTS),
                        viewport={"width": 1366, "height": 768},
                        locale="en-HK" if country == "Hong Kong" else "en-SG",
                    )
                    await context.add_init_script("""
                        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                        window.chrome = { runtime: {} };
                    """)

                    page = await context.new_page()
                    offset = page_num * 15
                    url = f"{base_url}&start={offset}" if offset > 0 else base_url

                    try:
                        print(f"[INDEED] {country} page {page_num + 1}")
                        await page.goto(url, wait_until="domcontentloaded", timeout=30000)

                        # Human-like: wait, then slow scroll
                        await asyncio.sleep(random.uniform(2, 4))
                        for _ in range(3):
                            await page.evaluate("window.scrollBy(0, 400)")
                            await asyncio.sleep(random.uniform(0.5, 1))

                        content = await page.content()
                        if "captcha" in content.lower() or "unusual traffic" in content.lower():
                            print(f"[INDEED] Detected bot check on {country}, skipping.")
                            await context.close()
                            break

                        # Indeed job cards
                        cards = await page.query_selector_all('[data-jk], .job_seen_beacon, .tapItem')

                        if not cards:
                            print(f"[INDEED] No cards on {country} page {page_num + 1}, done.")
                            await context.close()
                            break

                        for card in cards:
                            try:
                                listing = await self._parse_card(card, country)
                                if listing:
                                    listings.append(listing)
                            except Exception as e:
                                print(f"[INDEED] Card error: {e}")

                        print(f"[INDEED] {country} p{page_num+1}: {len(cards)} cards")
                        await context.close()
                        await self.polite_delay()

                    except Exception as e:
                        print(f"[INDEED] Error {country} p{page_num+1}: {e}")
                        await context.close()
                        break

            await browser.close()

        return listings

    async def _parse_card(self, card, country: str) -> dict | None:
        try:
            # Title
            title_el = await card.query_selector('[data-testid="jobTitle"] span, .jobTitle span, h2 span')
            title = await title_el.inner_text() if title_el else None
            if not title or len(title.strip()) < 3:
                return None

            # Company
            company_el = await card.query_selector('[data-testid="company-name"], .companyName')
            company = await company_el.inner_text() if company_el else "Unknown"

            # Location
            location_el = await card.query_selector('[data-testid="text-location"], .companyLocation')
            location_text = await location_el.inner_text() if location_el else country

            # Salary
            salary_el = await card.query_selector('[data-testid="attribute_snippet_testid"], .salary-snippet-container')
            salary_text = await salary_el.inner_text() if salary_el else ""

            # Snippet
            snippet_el = await card.query_selector('.job-snippet, [data-testid="jobsnippet_footer"]')
            snippet = await snippet_el.inner_text() if snippet_el else ""

            # Job link — Indeed uses data-jk attribute as job key
            jk = await card.get_attribute("data-jk")
            if country == "Hong Kong":
                apply_url = f"https://hk.indeed.com/viewjob?jk={jk}" if jk else ""
            else:
                apply_url = f"https://sg.indeed.com/viewjob?jk={jk}" if jk else ""

            # Date
            date_el = await card.query_selector('[data-testid="myJobsStateDate"], .date')
            date_text = await date_el.inner_text() if date_el else ""

            # Parse salary
            is_paid = False
            stipend = None
            currency = "HKD" if country == "Hong Kong" else "SGD"
            if salary_text and "undisclosed" not in salary_text.lower():
                is_paid = True
                stipend = salary_text.strip()

            city = location_text.split(",")[0].strip() if "," in location_text else location_text.strip()

            return {
                "title": title.strip(),
                "company_name": company.strip(),
                "location_city": city,
                "location_country": country,
                "industry": classify_industry(title, snippet),
                "language_required": detect_language(title, snippet),
                "is_paid": is_paid,
                "stipend_amount": stipend,
                "stipend_currency": currency if is_paid else None,
                "description_snippet": snippet[:300] if snippet else None,
                "apply_url": apply_url,
                "posted_date": self._parse_date(date_text),
                "source": "indeed",
            }

        except Exception as e:
            print(f"[INDEED] Parse error: {e}")
            return None

    def _parse_date(self, text: str) -> str:
        from datetime import datetime, timezone, timedelta
        now = datetime.now(timezone.utc)
        text = text.lower().strip()
        try:
            if "just posted" in text or "today" in text:
                return now.isoformat()
            elif "1 day" in text or "yesterday" in text:
                return (now - timedelta(days=1)).isoformat()
            elif "day" in text:
                days = int(''.join(filter(str.isdigit, text)) or 2)
                return (now - timedelta(days=days)).isoformat()
            elif "30+" in text:
                return (now - timedelta(days=30)).isoformat()
        except Exception:
            pass
        return now.isoformat()
