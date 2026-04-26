import Link from "next/link";
import type { Metadata } from "next";
import { Search, Bell, MapPin, Building2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "InternAsia — Find Internships in Asia",
  description: "Search internships across Hong Kong, Singapore, Japan, South Korea and Taiwan. Free email alerts.",
};

const COUNTRIES = [
  { name: "Hong Kong",   count: "Finance · Law · Trading" },
  { name: "Singapore",   count: "Tech · Consulting · Banking" },
  { name: "Japan",       count: "Engineering · Gaming · AI" },
  { name: "South Korea", count: "Media · Tech · Design" },
  { name: "Taiwan",      count: "Hardware · Semiconductors" },
];

const INDUSTRIES = ["Finance", "Technology", "Consulting", "Marketing", "Legal", "Design", "Research", "Operations"];

export default function HomePage() {
  return (
    <div style={{ background: "#f9fafb" }}>

      {/* Hero */}
      <div className="hero-section" style={{ padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "4px 14px", marginBottom: 24, fontSize: 12, fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Updated every 6 hours across 4 job boards
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Find internships in Asia.<br />Get alerts before anyone else.
          </h1>
          <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.6, margin: "0 0 36px", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            We aggregate internship listings from JobsDB, MyCareersFuture, Wantedly and Indeed across 5 countries — all in one place.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/internships" style={{ background: "#fff", color: "#2563eb", fontWeight: 600, fontSize: 15, padding: "11px 24px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Search size={15} /> Browse Internships
            </Link>
            <Link href="/alerts" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontWeight: 500, fontSize: 15, padding: "11px 24px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Bell size={15} /> Set Up Free Alert
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { value: "5", label: "Countries" },
            { value: "4", label: "Job boards" },
            { value: "6h", label: "Update frequency" },
            { value: "Free", label: "Email alerts" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Browse by country */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>Browse by country</h2>
          <Link href="/internships" style={{ fontSize: 13, color: "#2563eb", display: "flex", alignItems: "center", gap: 4 }}>All listings <ArrowRight size={13} /></Link>
        </div>
        <div className="country-grid">
          {COUNTRIES.map((c) => (
            <Link key={c.name} href={`/internships?country=${encodeURIComponent(c.name)}`}>
              <div className="card card-interactive" style={{ padding: "20px 18px" }}>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 14, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{c.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse by industry */}
      <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 20px" }}>Browse by industry</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {INDUSTRIES.map(ind => (
              <Link key={ind} href={`/internships?industry=${encodeURIComponent(ind)}`}>
                <div className="tag" style={{ cursor: "pointer", padding: "8px 16px", fontSize: 13, fontWeight: 500, transition: "all 0.15s" }}>
                  {ind}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alert CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e40af", margin: "0 0 8px" }}>Never miss a new listing</h2>
            <p style={{ color: "#3b82f6", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              Set your filters once. We'll email you the moment a matching role goes live — before it fills up.
            </p>
          </div>
          <Link href="/alerts" className="btn-primary" style={{ fontSize: 14, padding: "10px 24px", flexShrink: 0 }}>
            <Bell size={14} /> Create Free Alert
          </Link>
        </div>
      </div>

    </div>
  );
}
