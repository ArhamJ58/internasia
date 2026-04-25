import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL          = os.getenv("SUPABASE_URL")
SUPABASE_KEY          = os.getenv("SUPABASE_KEY")
RESEND_API_KEY        = os.getenv("RESEND_API_KEY", "")
SCRAPE_INTERVAL_HOURS = int(os.getenv("SCRAPE_INTERVAL_HOURS", 6))
REQUEST_DELAY_SECONDS = float(os.getenv("REQUEST_DELAY_SECONDS", 2))
MAX_PAGES             = int(os.getenv("MAX_PAGES_PER_SOURCE", 10))

# Security
ADMIN_SECRET  = os.getenv("ADMIN_SECRET", "")
FRONTEND_URL  = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Alias used in alerts.py
APP_URL = FRONTEND_URL

# Affiliate allowlist — prevents DB pollution from spoofed POSTs
ALLOWED_AFFILIATES = {
    "kickresume", "enhancv", "novoresume", "preply", "italki", "coursera", "udemy"
}

_db_client: Client | None = None

def get_db() -> Client:
    global _db_client
    if _db_client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in .env")
        _db_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _db_client
