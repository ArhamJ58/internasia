const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Internship {
  id: string;
  title: string;
  company_name: string;
  location_city: string | null;
  location_country: string;
  industry: string | null;
  language_required: string;
  is_paid: boolean | null;
  stipend_amount: string | null;
  stipend_currency: string | null;
  description_snippet: string | null;
  apply_url: string;
  source: string;
  posted_date: string | null;
  scraped_at: string;
  is_active: boolean;
  is_featured: boolean;
  featured_label: string | null;
}

export interface Filters {
  country?: string;
  industry?: string;
  language?: string;
  paid_only?: boolean;
  search?: string;
  posted_within_hours?: number;
  page?: number;
  limit?: number;
}

export interface InternshipsResponse {
  results: Internship[];
  page: number;
  count: number;
  total: number;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.detail || "API error"), { response: { data: err } });
  }
  return res.json();
}

export async function fetchInternships(filters: Filters = {}): Promise<InternshipsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== "" && v !== null) params.set(k, String(v)); });
  return apiFetch(`/internships?${params.toString()}`);
}

export async function fetchInternship(id: string): Promise<Internship> {
  return apiFetch(`/internships/${id}`);
}

export async function fetchStats() {
  return apiFetch("/internships/stats/summary");
}

export async function fetchFilters() {
  return apiFetch("/filters");
}

export async function createAlert(alert: {
  email: string; name?: string; country?: string; industry?: string;
  language?: string; paid_only?: boolean; keywords?: string; frequency?: string;
}) {
  return apiFetch("/alerts", { method: "POST", body: JSON.stringify(alert) });
}

export async function submitJobPost(job: object) {
  return apiFetch("/jobs/submit", { method: "POST", body: JSON.stringify(job) });
}

export function trackAffiliateClick(affiliate: string, source: string, internshipId?: string) {
  fetch(`${API_URL}/affiliate/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ affiliate, source, internship_id: internshipId || null }),
  }).catch(() => {});
}
