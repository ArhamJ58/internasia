-- ============================================
-- INTERNSHIP AGGREGATOR - SUPABASE SCHEMA
-- Run this entire file in your Supabase SQL editor
-- ============================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core internships table
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    location_city TEXT,
    location_country TEXT NOT NULL,
    industry TEXT,
    duration_weeks INTEGER,
    is_paid BOOLEAN,
    stipend_amount TEXT,
    stipend_currency TEXT,
    language_required TEXT DEFAULT 'English',
    description_snippet TEXT,
    apply_url TEXT NOT NULL,
    source TEXT NOT NULL, -- 'jobsdb' | 'mycareersfuture' | 'wantedly' etc
    source_id TEXT, -- original ID from the source site
    posted_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    unique_hash TEXT UNIQUE, -- company+title+posted_date hash for dedup
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_internships_country ON internships(location_country);
CREATE INDEX IF NOT EXISTS idx_internships_industry ON internships(industry);
CREATE INDEX IF NOT EXISTS idx_internships_language ON internships(language_required);
CREATE INDEX IF NOT EXISTS idx_internships_is_paid ON internships(is_paid);
CREATE INDEX IF NOT EXISTS idx_internships_is_active ON internships(is_active);
CREATE INDEX IF NOT EXISTS idx_internships_scraped_at ON internships(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_internships_posted_date ON internships(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_internships_source ON internships(source);

-- User alerts table
CREATE TABLE IF NOT EXISTS user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    country TEXT,         -- NULL means all countries
    industry TEXT,        -- NULL means all industries  
    language TEXT,        -- NULL means any language
    paid_only BOOLEAN DEFAULT FALSE,
    keywords TEXT,        -- comma-separated search terms
    frequency TEXT DEFAULT 'instant', -- 'instant' | 'daily' | 'weekly'
    is_active BOOLEAN DEFAULT TRUE,
    confirmed BOOLEAN DEFAULT FALSE, -- email confirmation
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_email ON user_alerts(email);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON user_alerts(is_active, confirmed);

-- Notification log (prevent duplicate alerts)
CREATE TABLE IF NOT EXISTS alert_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES user_alerts(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(alert_id, internship_id)
);

-- Scraper run log (monitor health)
CREATE TABLE IF NOT EXISTS scraper_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    listings_found INTEGER DEFAULT 0,
    listings_new INTEGER DEFAULT 0,
    status TEXT DEFAULT 'running', -- 'running' | 'success' | 'error'
    error_message TEXT
);

-- Enable Row Level Security (basic - open read for now)
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read on internships and companies
CREATE POLICY "Public read internships" ON internships FOR SELECT USING (true);
CREATE POLICY "Public read companies" ON companies FOR SELECT USING (true);

-- Allow anyone to insert their own alert
CREATE POLICY "Anyone can create alert" ON user_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own alert" ON user_alerts FOR SELECT USING (true);
