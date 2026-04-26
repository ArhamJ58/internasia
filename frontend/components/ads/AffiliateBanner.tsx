"use client";
import { api } from "@/lib/api";

interface Props { context?: "listing" | "detail" | "sidebar" | "japan"; internshipId?: string; }

const AFFILIATES = {
  resume: {
    label: "📄 Stand out on paper",
    sub:   "Build a CV that gets past ATS in minutes",
    links: [
      { name: "Kickresume", url: "https://www.kickresume.com?ref=internasia", key: "kickresume" },
      { name: "Enhancv",   url: "https://enhancv.com?ref=internasia",        key: "enhancv" },
    ],
    accent: "#f0b429",
  },
  language: {
    label: "🇯🇵 Targeting Japan?",
    sub:   "Learn Japanese with a live tutor",
    links: [
      { name: "Preply", url: "https://preply.com?ref=internasia",        key: "preply" },
      { name: "iTalki", url: "https://www.italki.com?ref=internasia",    key: "italki" },
    ],
    accent: "#ef4444",
  },
  courses: {
    label: "📚 Boost your profile",
    sub:   "Certifications APAC recruiters notice",
    links: [
      { name: "Coursera", url: "https://coursera.org?ref=internasia",   key: "coursera" },
      { name: "Udemy",    url: "https://udemy.com?ref=internasia",      key: "udemy" },
    ],
    accent: "#22c55e",
  },
};

function track(affiliate: string, source: string, id?: string) {
  api.post("/affiliate/click", { affiliate, source, internship_id: id || null }).catch(() => {});
}

export default function AffiliateBanner({ context = "listing", internshipId }: Props) {
  const aff = context === "japan" ? AFFILIATES.language : context === "sidebar" ? AFFILIATES.courses : AFFILIATES.resume;

  return (
    <div style={{
      background: 'var(--card)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${aff.accent}`,
      borderRadius: 10,
      padding: '16px 18px',
    }}>
      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', margin: '0 0 3px' }}>{aff.label}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{aff.sub}</p>
      <div style={{ display: 'flex', gap: 14 }}>
        {aff.links.map(link => (
          <a key={link.key} href={link.url} target="_blank" rel="noopener noreferrer sponsored"
            onClick={() => track(link.key, context, internshipId)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              color: aff.accent, textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            {link.name} →
          </a>
        ))}
      </div>
    </div>
  );
}
