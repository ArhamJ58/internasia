-- ============================================
-- SCHEMA ADDITIONS (Phase 2)
-- Run this AFTER the initial schema.sql
-- ============================================

-- Add confirmation token + unsubscribe token to user_alerts
ALTER TABLE user_alerts
    ADD COLUMN IF NOT EXISTS confirmation_token TEXT,
    ADD COLUMN IF NOT EXISTS confirmation_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT DEFAULT gen_random_uuid()::TEXT;

-- Pending weekly digest queue
CREATE TABLE IF NOT EXISTS digest_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES user_alerts(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    queued_at TIMESTAMPTZ DEFAULT NOW(),
    sent BOOLEAN DEFAULT FALSE,
    UNIQUE(alert_id, internship_id)
);

-- Featured listings (for monetisation - companies pay to be pinned)
ALTER TABLE internships
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS featured_label TEXT; -- e.g. "Sponsored" or "Featured"

-- Index for featured sort
CREATE INDEX IF NOT EXISTS idx_internships_featured ON internships(is_featured, featured_until);

-- Scraper health alerts config (owner email for monitoring)
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_config (key, value) VALUES
    ('owner_email', 'your@email.com'),
    ('adsense_client_id', ''),
    ('scraper_alert_threshold', '0') -- alert if scraper returns 0 results
ON CONFLICT (key) DO NOTHING;

-- Click tracking for affiliate links (optional analytics)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate TEXT NOT NULL, -- 'kickresume' | 'enhancv' | 'preply' etc
    source TEXT NOT NULL,    -- 'listing_card' | 'detail_page' | 'email'
    internship_id UUID REFERENCES internships(id) ON DELETE SET NULL,
    clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page view counter (lightweight analytics)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path, viewed_at DESC);
