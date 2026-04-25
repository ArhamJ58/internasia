-- ============================================================
-- SCHEMA V3 — Run after schema.sql and schema_v2.sql
-- ============================================================

-- ── Job submissions (companies posting directly / paying for featured) ────────
CREATE TABLE IF NOT EXISTS job_submissions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name     TEXT NOT NULL,
    contact_email    TEXT NOT NULL,
    contact_name     TEXT,
    role_title       TEXT NOT NULL,
    location_country TEXT NOT NULL,
    location_city    TEXT,
    industry         TEXT,
    is_paid          BOOLEAN DEFAULT TRUE,
    stipend_range    TEXT,
    language_required TEXT DEFAULT 'English',
    description      TEXT,
    apply_url        TEXT NOT NULL,
    duration_weeks   INTEGER,
    tier             TEXT DEFAULT 'standard',   -- 'standard' | 'featured'
    message          TEXT,                      -- notes from company
    status           TEXT DEFAULT 'pending',    -- 'pending' | 'approved' | 'rejected'
    internship_id    UUID REFERENCES internships(id) ON DELETE SET NULL,  -- set after approval
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON job_submissions(status, created_at DESC);

-- ── Add BACKEND_URL to app_config ────────────────────────────────────────────
INSERT INTO app_config (key, value) VALUES
    ('backend_url', 'https://your-backend.onrender.com'),
    ('digest_sponsor', ''),
    ('digest_sponsor_url', ''),
    ('digest_sponsor_copy', '')
ON CONFLICT (key) DO NOTHING;

-- ── Postgres aggregation functions (replaces Python loop in /stats) ──────────
CREATE OR REPLACE FUNCTION count_by_country()
RETURNS TABLE(location_country TEXT, count BIGINT) AS $$
    SELECT location_country, COUNT(*) AS count
    FROM internships
    WHERE is_active = TRUE
    GROUP BY location_country
    ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION count_by_source()
RETURNS TABLE(source TEXT, count BIGINT) AS $$
    SELECT source, COUNT(*) AS count
    FROM internships
    WHERE is_active = TRUE
    GROUP BY source
    ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- ── Indexes for common query patterns ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_internships_compound
    ON internships(is_active, location_country, industry, is_paid);

CREATE INDEX IF NOT EXISTS idx_alerts_freq
    ON user_alerts(frequency, is_active, confirmed);

-- ── Add internship_id to job_submissions if upgrading from older schema ───────
ALTER TABLE job_submissions
    ADD COLUMN IF NOT EXISTS internship_id UUID REFERENCES internships(id) ON DELETE SET NULL;
