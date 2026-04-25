import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, DollarSign, Globe, Clock, ExternalLink, ArrowLeft, BellRing } from "lucide-react";
import Link from "next/link";
import AffiliateBanner from "@/components/ads/AffiliateBanner";
import AdSense from "@/components/ads/AdSense";
import { Internship } from "@/lib/api";

const API_URL  = process.env.NEXT_PUBLIC_API_URL  || "http://localhost:8000";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://internasia.app";

const SOURCE_LABELS: Record<string, string> = {
  jobsdb: "JobsDB", mycareersfuture: "MyCareersFuture",
  wantedly: "Wantedly", indeed: "Indeed", direct: "InternAsia",
};
const COUNTRY_CONFIG: Record<string, { flag: string; color: string }> = {
  "Hong Kong":   { flag: "🇭🇰", color: "#ef4444" },
  "Singapore":   { flag: "🇸🇬", color: "#3b82f6" },
  "Japan":       { flag: "🇯🇵", color: "#be123c" },
  "South Korea": { flag: "🇰🇷", color: "#1d4ed8" },
  "Taiwan":      { flag: "🇹🇼", color: "#16a34a" },
};

async function getInternship(id: string): Promise<Internship | null> {
  try {
    const res = await fetch(`${API_URL}/internships/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Dynamic per-listing metadata for SEO ──────────────────────────────────────
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await getInternship(params.id);
  if (!job) return { title: "Internship Not Found | InternAsia" };

  const location = job.location_city
    ? `${job.location_city}, ${job.location_country}`
    : job.location_country;
  const pay = job.stipend_amount || (job.is_paid ? "Paid" : "Unpaid");
  const title = `${job.title} at ${job.company_name} — ${location}`;
  const description = job.description_snippet
    ? `${job.description_snippet.slice(0, 155)}...`
    : `${job.title} internship at ${job.company_name} in ${location}. ${pay}. Apply via InternAsia.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/internships/${job.id}`,
      type: "article",
    },
    alternates: { canonical: `${BASE_URL}/internships/${job.id}` },
  };
}

// ── JSON-LD structured data for Google Jobs ───────────────────────────────────
function JobPostingSchema({ job }: { job: Internship }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description_snippet || `${job.title} at ${job.company_name}`,
    hiringOrganization: { "@type": "Organization", name: job.company_name },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location_city || "",
        addressCountry: job.location_country,
      },
    },
    datePosted: job.scraped_at,
    employmentType: "INTERN",
    ...(job.is_paid && job.stipend_amount
      ? { baseSalary: { "@type": "MonetaryAmount", currency: job.stipend_currency || "USD", value: job.stipend_amount } }
      : {}),
    url: `${BASE_URL}/internships/${job.id}`,
    applyLink: job.apply_url,
    validThrough: new Date(new Date(job.scraped_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Time helpers ─────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function InternshipDetailPage({ params }: { params: { id: string } }) {
  const job = await getInternship(params.id);
  if (!job) notFound();

  const cc       = COUNTRY_CONFIG[job.location_country] || { flag: "🌏", color: "var(--gold)" };
  const location = job.location_city ? `${job.location_city}, ${job.location_country}` : job.location_country;
  const isNew    = Date.now() - new Date(job.scraped_at).getTime() < 24 * 60 * 60 * 1000;
  const isJapan  = job.location_country === "Japan";
  const pay      = job.stipend_amount || (job.is_paid ? "Paid" : job.is_paid === false ? "Unpaid" : "Not specified");
  const payGreen = job.is_paid === true;

  return (
    <>
      <JobPostingSchema job={job} />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back */}
        <Link href="/internships" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-3)", textDecoration: "none",
          marginBottom: 28, transition: "color 0.15s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
        >
          <ArrowLeft size={14} /> Back to listings
        </Link>

        {/* Main card */}
        <div className="card" style={{ borderLeft: `4px solid ${cc.color}`, padding: "clamp(24px, 5vw, 40px)", marginBottom: 16 }}>

          {/* Country + badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 22 }}>{cc.flag}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {job.location_country}
            </span>
            {isNew && <span className="badge badge-green">New</span>}
            {job.is_featured && <span className="badge badge-gold">{job.featured_label || "Featured"}</span>}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 4vw, 32px)",
            fontWeight: 700, color: "var(--text)",
            margin: "0 0 10px", lineHeight: 1.2, letterSpacing: "-0.01em",
          }}>{job.title}</h1>
          <p style={{ fontSize: 16, color: "var(--text-2)", margin: "0 0 28px", fontWeight: 500 }}>{job.company_name}</p>

          {/* Meta grid — 4-col desktop, 2-col mobile */}
          <div className="detail-meta-grid">
            {[
              { icon: <MapPin size={14} />,     label: "Location", value: location,          green: false },
              { icon: <DollarSign size={14} />, label: "Pay",      value: pay,               green: payGreen },
              { icon: <Globe size={14} />,      label: "Language", value: job.language_required, green: false },
              { icon: <Clock size={14} />,      label: "Scraped",  value: timeAgo(job.scraped_at), green: false },
            ].map((m) => (
              <div key={m.label} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: 10, padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-3)", marginBottom: 6 }}>
                  {m.icon}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</span>
                </div>
                <p style={{ fontWeight: 600, color: m.green ? "#4ade80" : "var(--text)", fontSize: 13, margin: 0, lineHeight: 1.3 }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {job.industry && <span className="badge badge-dim">{job.industry}</span>}
            <span className="badge badge-dim">Via {SOURCE_LABELS[job.source] || job.source}</span>
          </div>

          {/* Description */}
          {job.description_snippet && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ borderLeft: "2px solid var(--border-hi)", paddingLeft: 16, marginBottom: 12 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Description</p>
                <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{job.description_snippet}</p>
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", fontStyle: "italic", margin: 0 }}>
                Preview only — full description on the original listing.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="detail-actions">
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ fontSize: 14, padding: "12px 24px" }}
            >
              Apply on {SOURCE_LABELS[job.source] || job.source} <ExternalLink size={13} />
            </a>
            <Link
              href={`/alerts?country=${encodeURIComponent(job.location_country)}&industry=${encodeURIComponent(job.industry || "")}`}
              className="btn-ghost"
              style={{ fontSize: 14 }}
            >
              <BellRing size={14} /> Alert me for similar
            </Link>
          </div>
        </div>

        {/* Affiliate + AdSense */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <AffiliateBanner context="detail" internshipId={job.id} />
          <AffiliateBanner context={isJapan ? "japan" : "sidebar"} internshipId={job.id} />
        </div>

        <AdSense slot="1122334455" format="horizontal" />
      </div>
    </>
  );
}
