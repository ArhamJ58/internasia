import random
import asyncio
from playwright.async_api import async_playwright
from scrapers.base import BaseScraper
from scrapers.jobsdb import classify_industry, detect_language, USER_AGENTS
from core.config import MAX_PAGES


class WantedlyScraper(BaseScraper):
    source_name = "wantedly"
    # Wantedly is strong in Japan and Singapore for startups
    search_urls = [
        ("https://www.wantedly.com/projects?type=internship&location=Singapore", "Singapore"),
        ("https://www.wantedly.com/projects?type=internship&location=Tokyo", "Japan"),
    ]

    async def scrape(self) -> list[dict]:
        listings = []

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
            )

            for url, country in self.search_urls:
                context = await browser.new_context(
                    user_agent=random.choice(USER_AGENTS),
                    viewport={"width": 1440, "height": 900},
                )
                await context.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                """)
                page = await context.new_page()

                print(f"[WANTEDLY] Scraping {country}...")

                try:
                    await page.goto(url, wait_until="networkidle", timeout=30000)
                    await asyncio.sleep(random.uniform(2, 3))

                    # Scroll to load more listings (infinite scroll)
                    for _ in range(5):
                        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        await asyncio.sleep(1.5)

                    # Try multiple possible selectors Wantedly uses
                    cards = await page.query_selector_all('.ProjectCard, [class*="project-card"], [class*="ProjectCard"]')

                    if not cards:
                        # Fallback: grab all links with job-like structure
                        cards = await page.query_selector_all('article')

                    print(f"[WANTEDLY] {country}: {len(cards)} cards found")

                    for card in cards:
                        try:
                            listing = await self._parse_card(card, country)
                            if listing:
                                listings.append(listing)
                        except Exception as e:
                            print(f"[WANTEDLY] Card error: {e}")

                except Exception as e:
                    print(f"[WANTEDLY] Error for {country}: {e}")
                finally:
                    await context.close()

            await browser.close()

        return listings

    async def _parse_card(self, card, country: str) -> dict | None:
        try:
            # Title
            title_el = await card.query_selector('h2, h3, [class*="title"]')
            title = await title_el.inner_text() if title_el else None
            if not title or len(title.strip()) < 3:
                return None

            # Company
            company_el = await card.query_selector('[class*="company"], [class*="Company"]')
            company = await company_el.inner_text() if company_el else "Unknown"

            # Link
            link_el = await card.query_selector('a')
            href = await link_el.get_attribute("href") if link_el else ""
            apply_url = f"https://www.wantedly.com{href}" if href and href.startswith("/") else href

            # Description
            desc_el = await card.query_selector('p, [class*="description"]')
            description = await desc_el.inner_text() if desc_el else ""

            city = "Tokyo" if country == "Japan" else "Singapore"

            return {
                "title": title.strip(),
                "company_name": company.strip(),
                "location_city": city,
                "location_country": country,
                "industry": classify_industry(title, description),
                "language_required": detect_language(title, description),
                "is_paid": None,  # Wantedly often doesn't show salary
                "stipend_amount": None,
                "stipend_currency": None,
                "description_snippet": description[:300] if description else None,
                "apply_url": apply_url,
                "posted_date": None,
                "source": "wantedly",
            }

        except Exception as e:
            print(f"[WANTEDLY] Parse error: {e}")
            return None
