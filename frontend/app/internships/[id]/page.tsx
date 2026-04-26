import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, DollarSign, Globe, Clock, ExternalLink, ArrowLeft, Bell, Building2 } from "lucide-react";
import Link from "next/link";
import { Internship } from "@/lib/api";

const API_URL  = process.env.NEXT_PUBLIC_API_URL  || "http://localhost:8000";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://internasia.vercel.app";

const SOURCE_LABELS: Record<string, string> = {
  jobsdb: "JobsDB", mycareersfuture: "MyCareersFuture",
  wantedly: "Wantedly", indeed: "Indeed", direct: "InternAsia",
};

async function getInternship(id: string): Promise<Internship | null> {
  try {
    const res = await fetch(`${API_URL}/internships/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await getInternship(params.id);
  if (!job) return { title: "Not Found | InternAsia" };
  const location = job.location_city ? `${job.location_city}, ${job.location_country}` : job.location_country;
  const title = `${job.title} at ${job.company_name} — ${location}`;
  return { title, description: job.description_snippet || title };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(hrs / 24);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export default async function InternshipDetailPage({ params }: { params: { id: string } }) {
  const job = await getInternship(params.id);
  if (!job) notFound();

  const location = job.location_city ? `${job.location_city}, ${job.location_country}` : job.location_country;
  const isNew = Date.now() - new Date(job.scraped_at).getTime() < 24 * 60 * 60 * 1000;
  const pay = job.stipend_amount || (job.is_paid ? "Paid" : job.is_paid === false ? "Unpaid" : "Not specified");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <Link href="/internships" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
        <ArrowLeft size={13} /> Back to listings
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
        {/* Main */}
        <div>
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                {job.company_name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  {isNew && <span className="badge badge-new">New</span>}
                  {job.is_featured && <span className="badge badge-blue">Featured</span>}
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>via {SOURCE_LABELS[job.source] || job.source}</span>
                </div>
                <h1 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#111827", margin: "0 0 6px", lineHeight: 1.2 }}>{job.title}</h1>
                <div style={{ color: "#374151", fontSize: 15, fontWeight: 500 }}>{job.company_name}</div>
              </div>
            </div>

            <div className="detail-meta-grid">
              {[
                { icon: <MapPin size={13} />,     label: "Location", value: location },
                { icon: <DollarSign size={13} />, label: "Compensation", value: pay, green: job.is_paid === true },
                { icon: <Globe size={13} />,      label: "Language", value: job.language_required },
                { icon: <Clock size={13} />,      label: "Posted", value: timeAgo(job.scraped_at) },
              ].map(m => (
                <div key={m.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9ca3af", marginBottom: 5, fontSize: 11 }}>{m.icon} {m.label}</div>
                  <div style={{ fontWeight: 600, color: (m as {green?: boolean}).green ? "#16a34a" : "#111827", fontSize: 13 }}>{m.value}</div>
                </div>
              ))}
            </div>

            {job.industry && (
              <div style={{ marginBottom: 24 }}>
                <span className="tag">{job.industry}</span>
              </div>
            )}

            {job.description_snippet && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 14, marginBottom: 12 }}>About the role</div>
                <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{job.description_snippet}</p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: "12px 0 0", fontStyle: "italic" }}>Preview only — full details on the original listing.</p>
              </div>
            )}

            <div className="detail-actions">
              <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 14, padding: "11px 24px" }}>
                Apply on {SOURCE_LABELS[job.source] || job.source} <ExternalLink size={13} />
              </a>
              <Link href={`/alerts?country=${encodeURIComponent(job.location_country)}&industry=${encodeURIComponent(job.industry || "")}`} className="btn-secondary" style={{ fontSize: 14 }}>
                <Bell size={13} /> Alert me for similar
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "20px" }}>
            <div style={{ fontWeight: 600, color: "#1e40af", fontSize: 14, marginBottom: 8 }}>Get similar alerts</div>
            <p style={{ color: "#3b82f6", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 }}>Be the first to know when similar roles are posted.</p>
            <Link href={`/alerts?country=${encodeURIComponent(job.location_country)}&industry=${encodeURIComponent(job.industry || "")}`} className="btn-primary" style={{ fontSize: 13, width: "100%", justifyContent: "center" }}>
              <Bell size={13} /> Set Alert
            </Link>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 13, marginBottom: 14 }}>More in {job.location_country}</div>
            <Link href={`/internships?country=${encodeURIComponent(job.location_country)}`} className="btn-secondary" style={{ fontSize: 13, width: "100%", justifyContent: "center" }}>
              Browse {job.location_country} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
