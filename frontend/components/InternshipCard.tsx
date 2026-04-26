"use client";
import Link from "next/link";
import { Internship } from "@/lib/api";

const COUNTRY_COLORS: Record<string, string> = {
  "Hong Kong": "#ef4444",
  "Singapore": "#3b82f6",
  "Japan": "#be123c",
  "South Korea": "#1d4ed8",
  "Taiwan": "#16a34a",
};

const FLAGS: Record<string, string> = {
  "Hong Kong": "🇭🇰",
  "Singapore": "🇸🇬",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "Taiwan": "🇹🇼",
};

export default function InternshipCard({ job }: { job: Internship }) {
  const color = COUNTRY_COLORS[job.location_country] || "#f0b429";
  const flag = FLAGS[job.location_country] || "🌏";
  const isNew = Date.now() - new Date(job.scraped_at).getTime() < 24 * 60 * 60 * 1000;
  const pay = job.stipend_amount || (job.is_paid ? "Paid" : job.is_paid === false ? "Unpaid" : "—");

  return (
    <Link href={`/internships/${job.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="card card-interactive" style={{ padding: "20px 24px", borderLeft: `3px solid ${color}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 15, lineHeight: 1.3, marginBottom: 4 }}>
              {job.title}
            </div>
            <div style={{ color: "var(--text-2)", fontSize: 13 }}>{job.company_name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
            {isNew && <span className="badge badge-green">New</span>}
            {job.is_featured && <span className="badge badge-gold">{job.featured_label || "Featured"}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
          <span style={{ color: "var(--text-3)" }}>{flag} {job.location_country}</span>
          <span style={{ color: job.is_paid ? "#4ade80" : "var(--text-3)", fontFamily: "var(--font-mono)" }}>{pay}</span>
          {job.industry && <span style={{ color: "var(--text-3)" }}>{job.industry}</span>}
          {job.language_required && job.language_required !== "English" && (
            <span style={{ color: "var(--text-3)" }}>{job.language_required}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
