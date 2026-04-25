import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: API_URL });

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
  total: number;   // total matching rows (for pagination)
}

export async function fetchInternships(filters: Filters = {}): Promise<InternshipsResponse> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "" && v !== null)
  );
  const { data } = await api.get("/internships", { params });
  return data as InternshipsResponse;
}

export async function fetchInternship(id: string): Promise<Internship> {
  const { data } = await api.get(`/internships/${id}`);
  return data as Internship;
}

export async function fetchStats() {
  const { data } = await api.get("/internships/stats/summary");
  return data as {
    total_active: number;
    new_last_24h: number;
    by_country: Record<string, number>;
    by_source: Record<string, number>;
  };
}

export async function fetchFilters() {
  const { data } = await api.get("/filters");
  return data as { countries: string[]; industries: string[]; languages: string[]; sources: string[] };
}

export async function createAlert(alert: {
  email: string;
  name?: string;
  country?: string;
  industry?: string;
  language?: string;
  paid_only?: boolean;
  keywords?: string;
  frequency?: string;
}) {
  const { data } = await api.post("/alerts", alert);
  return data;
}

export async function submitJobPost(job: {
  company_name: string;
  contact_email: string;
  contact_name?: string;
  role_title: string;
  location_country: string;
  location_city?: string;
  industry?: string;
  is_paid: boolean;
  stipend_range?: string;
  language_required: string;
  description: string;
  apply_url: string;
  duration_weeks?: number;
  tier: "standard" | "featured";
  message?: string;
}) {
  const { data } = await api.post("/jobs/submit", job);
  return data;
}

export async function trackAffiliateClick(affiliate: string, source: string, internshipId?: string) {
  api.post("/affiliate/click", { affiliate, source, internship_id: internshipId || null }).catch(() => {});
}
