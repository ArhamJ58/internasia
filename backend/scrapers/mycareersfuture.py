import httpx
from scrapers.base import BaseScraper
from scrapers.jobsdb import classify_industry, detect_language
from core.config import MAX_PAGES

# MyCareersFuture has a public API - no scraping needed, fully legal
API_URL = "https://api.mycareersfuture.gov.sg/v2/jobs"


class MyCareersFutureScraper(BaseScraper):
    source_name = "mycareersfuture"

    async def scrape(self) -> list[dict]:
        listings = []
        limit = 20
        headers = {
            "User-Agent": "InternAsia/1.0 (internship aggregator)",
            "Accept": "application/json",
        }

        async with httpx.AsyncClient(timeout=30) as client:
            for page in range(MAX_PAGES):
                params = {
                    "search": "internship",
                    "limit": limit,
                    "offset": page * limit,
                    "employmentType": "Internship",
                }

                print(f"[MCF] Fetching page {page + 1}...")

                try:
                    response = await client.get(API_URL, params=params, headers=headers)
                    response.raise_for_status()
                    data = response.json()

                    results = data.get("results", [])
                    if not results:
                        print(f"[MCF] No more results at page {page + 1}")
                        break

                    for job in results:
                        listing = self._parse_job(job)
                        if listing:
                            listings.append(listing)

                    print(f"[MCF] Page {page + 1}: {len(results)} listings")
                    await self.polite_delay()

                except httpx.HTTPError as e:
                    print(f"[MCF] HTTP error on page {page + 1}: {e}")
                    break
                except Exception as e:
                    print(f"[MCF] Error on page {page + 1}: {e}")
                    break

        return listings

    def _parse_job(self, job: dict) -> dict | None:
        try:
            metadata = job.get("metadata", {})
            salary = job.get("salary", {})
            address = job.get("postedCompany", {}).get("address", {})

            title = job.get("title", "").strip()
            if not title:
                return None

            company = job.get("postedCompany", {}).get("name", "Unknown")
            description = job.get("description", "")
            skills = ", ".join(job.get("skills", []))

            # Salary parsing
            min_salary = salary.get("minimum")
            max_salary = salary.get("maximum")
            is_paid = bool(min_salary)
            stipend_amount = f"SGD {min_salary}–{max_salary}/mo" if min_salary and max_salary else (
                f"SGD {min_salary}/mo" if min_salary else None
            )

            # Location
            district = address.get("block", "") or address.get("postalCode", "")
            city = "Singapore"

            # Posted date
            posted = metadata.get("createdAt", "")

            # UUID from MCF as source_id
            source_id = job.get("uuid", "")

            # Apply URL
            apply_url = f"https://www.mycareersfuture.gov.sg/job/{source_id}" if source_id else ""

            return {
                "title": title,
                "company_name": company,
                "location_city": city,
                "location_country": "Singapore",
                "industry": classify_industry(title, description + " " + skills),
                "language_required": detect_language(title, description),
                "is_paid": is_paid,
                "stipend_amount": stipend_amount,
                "stipend_currency": "SGD" if is_paid else None,
                "description_snippet": description[:300] if description else None,
                "apply_url": apply_url,
                "posted_date": posted or None,
                "source_id": source_id,
                "source": "mycareersfuture",
            }

        except Exception as e:
            print(f"[MCF] Job parse error: {e}")
            return None
