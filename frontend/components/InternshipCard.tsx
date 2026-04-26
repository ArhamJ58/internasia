import { Internship } from "@/lib/api";
import Link from "next/link";
import { MapPin, DollarSign, Globe, Clock, ExternalLink } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  jobsdb: "JobsDB",
  mycareersfuture: "MCF",
  wantedly: "Wantedly",
  indeed: "Indeed",
};

const COUNTRY_CONFIG: Record<string, { flag: string; color: string }> = {
  "Hong Kong": { flag: "🇭🇰", color: "#ef4444" },
  "Singapore":  { flag: "🇸🇬", color: "#3b82f6" },
  "Japan":      { flag: "🇯🇵", color: "#be123c" },
  "South Korea":{ flag: "🇰🇷", color: "#1d4ed8" },
  "Taiwan":     { flag: "🇹🇼", color: "#16a34a" },
};

const INDUSTRY_COLORS: Record<string, string> = {
  "Finance":        "rgba(251,191,36,0.12)",
  "Technology":     "rgba(59,130,246,0.12)",
  "Marketing":      "rgba(168,85,247,0.12)",
  "Consulting":     "rgba(20,184,166,0.12)",
  "Legal":          "rgba(249,115,22,0.12)",
  "Design":         "rgba(236,72,153,0.12)",
  "Research":       "rgba(34,197,94,0.12)",
  "Human Resources":"rgba(99,102,241,0.12)",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function InternshipCard({ job }: { job: Internship }) {
  const cc = COUNTRY_CONFIG[job.location_country] || { flag: "🌏", color: "var(--border-hi)" };
  const ageMs = Date.now() - new Date(job.scraped_at).getTime();
  const isNew = ageMs < 24 * 60 * 60 * 1000;
  const isFeatured = (job as any).is_featured;
  const industryBg = INDUSTRY_COLORS[job.industry || ""] || "rgba(255,255,255,0.04)";

  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${cc.color}`,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
      }}
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Featured ribbon */}
      {isFeatured && (
        <div style={{
          position: 'absolute', top: -1, right: 16,
          background: 'var(--gold)', color: '#000',
          fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: '0 0 6px 6px',
        }}>Featured</div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/internships/${job.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontWeight: 600, color: 'var(--text)', fontSize: 15,
              lineHeight: 1.35, margin: '0 0 4px',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
              transition: 'color 0.15s',
            }}
            >
              {job.title}
            </h3>
          </Link>
          <div style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 500 }}>{job.company_name}</div>
        </div>
        {isNew && <span className="badge badge-green" style={{ flexShrink: 0 }}>New</span>}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 12, color: 'var(--text-3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={11} />
          {cc.flag} {job.location_city ? `${job.location_city}` : job.location_country}
        </span>
        {job.is_paid !== null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: job.is_paid ? '#4ade80' : 'var(--text-3)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            <DollarSign size={11} />
            {job.is_paid ? (job.stipend_amount || "Paid") : "Unpaid"}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Globe size={11} /> {job.language_required}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} /> {timeAgo(job.scraped_at)}
        </span>
      </div>

      {/* Footer row — industry + source + apply */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {job.industry && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '3px 8px', borderRadius: 4,
              background: industryBg, color: 'var(--text-2)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>{job.industry}</span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(255,255,255,0.03)', color: 'var(--text-3)',
            border: '1px solid var(--border)',
          }}>{SOURCE_LABELS[job.source] || job.source}</span>
        </div>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600, color: 'var(--gold)',
            textDecoration: 'none', transition: 'opacity 0.15s',
          }}
          onClick={e => e.stopPropagation()}
        >
          Apply <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
