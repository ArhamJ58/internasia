# InternAsia — Real-time Internship Aggregator for Asia

Find internships across Hong Kong, Singapore, Japan, South Korea and Taiwan.
Get instant email alerts the moment a matching role goes live.

## Stack

| Layer    | Tech                                                      |
|----------|-----------------------------------------------------------|
| Backend  | Python 3.12 · FastAPI · Playwright · APScheduler          |
| Database | Supabase (Postgres)                                       |
| Email    | Resend                                                    |
| Frontend | Next.js 14 App Router · TypeScript · Tailwind CSS         |
| Hosting  | Render (backend) · Vercel (frontend) · Supabase (DB free) |

## Setup

### 1. Database

Run migrations in order in your Supabase SQL editor:

```
backend/schema.sql       ← initial schema
backend/schema_v2.sql    ← tokens, digest queue, featured columns
backend/schema_v3.sql    ← job_submissions, SQL aggregations, indexes
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
playwright install chromium

cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY,
# FRONTEND_URL, BACKEND_URL, ADMIN_SECRET, OWNER_EMAIL

uvicorn main:app --reload
```

**Key env vars:**

| Variable              | Purpose                                           |
|-----------------------|---------------------------------------------------|
| `ADMIN_SECRET`        | Required — protects all /admin/* endpoints        |
| `FRONTEND_URL`        | Your Vercel domain — used in CORS + email links   |
| `BACKEND_URL`         | Your Render domain — used in confirmation links   |
| `OWNER_EMAIL`         | Gets scraper health alerts + job submission emails|
| `DIGEST_SPONSOR`      | Optional: sponsor name shown in digest emails     |
| `DIGEST_SPONSOR_URL`  | Optional: sponsor affiliate link                  |

### 3. Frontend

```bash
cd frontend
npm install

cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL

npm run dev
```

## Architecture

```
browser → Vercel (Next.js) → Render (FastAPI) → Supabase (Postgres)
                                    ↓
                               APScheduler
                                    ↓
                    Playwright scrapers (JobsDB, MCF, Wantedly, Indeed)
                                    ↓
                          New listing found?
                                    ↓
                      Match against confirmed alerts
                                    ↓
                         Resend → subscriber inbox
```

## Monetization

Four revenue streams are wired in:

| Stream                | How                                              | Rate          |
|-----------------------|--------------------------------------------------|---------------|
| Featured listings     | Companies pay to pin to top · POST /jobs/submit  | USD 99/30 days|
| Email digest sponsor  | Inline sponsor slot via env vars                 | USD 149/edition|
| Banner / affiliate    | Kickresume, Enhancv, Preply, Coursera, Udemy CTAs | CPA commissions|
| Google AdSense        | Drop-in via NEXT_PUBLIC_ADSENSE_CLIENT env var   | CPM revenue   |

## Admin API

All admin endpoints require `X-Admin-Secret: your_secret` header.

| Method  | Path                                       | Description              |
|---------|--------------------------------------------|--------------------------|
| GET     | /admin/stats                               | Dashboard overview       |
| GET     | /admin/scraper-runs                        | Scraper run log          |
| POST    | /admin/trigger-scrape?source=jobsdb        | Manual scrape trigger    |
| PATCH   | /admin/internships/{id}/feature            | Pin listing to top       |
| PATCH   | /admin/internships/{id}/unfeature          | Unpin listing            |
| PATCH   | /admin/job-submissions/{id}/approve        | Publish submitted listing|
| POST    | /admin/send-weekly-digests                 | Fire weekly digests now  |

## Scrapers

| Source           | Method    | Markets        |
|------------------|-----------|----------------|
| JobsDB           | Playwright| Hong Kong      |
| MyCareersFuture  | Public API| Singapore      |
| Wantedly         | Playwright| Japan, SG      |
| Indeed           | Playwright| HK, SG         |

Add a new scraper: create `backend/scrapers/yoursite.py`, extend `BaseScraper`,
add to `run_all_scrapers()` in `scheduler.py`.

## Deployment

**Backend (Render):**
- Build command: `pip install -r requirements.txt && playwright install chromium`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set all env vars in Render dashboard

**Frontend (Vercel):**
- Connect GitHub repo, set NEXT_PUBLIC_API_URL + NEXT_PUBLIC_SITE_URL
- Auto-deploys on push to main

## Pages

| Path              | Description                                   |
|-------------------|-----------------------------------------------|
| /                 | Homepage with hero, country grid, features    |
| /internships      | Browse page with filters + pagination         |
| /internships/[id] | Detail page with JSON-LD for Google Jobs      |
| /alerts           | Email alert sign-up form                      |
| /alerts/confirmed | Post-confirmation landing page                |
| /alerts/unsubscribed | Post-unsubscribe landing page              |
| /resources        | Editorial resource guide                      |
| /post-job         | Company listing submission form               |
| /advertise        | Advertising packages pricing page             |
| /admin            | Admin dashboard (no auth — add before launch) |
