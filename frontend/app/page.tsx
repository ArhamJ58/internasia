import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BellRing, Zap, Globe2, Filter, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "InternAsia — Real-time Internship Alerts for Asia",
  description:
    "Find internships in Hong Kong, Singapore, Japan, South Korea and Taiwan. Get instant email alerts the moment a matching role goes live — before the competition.",
};

const COUNTRIES = [
  { flag: "🇭🇰", name: "Hong Kong",   sub: "Finance & Law hub",    color: "#ef4444" },
  { flag: "🇸🇬", name: "Singapore",   sub: "Tech & MNC central",   color: "#3b82f6" },
  { flag: "🇯🇵", name: "Japan",       sub: "Engineering & AI",     color: "#be123c" },
  { flag: "🇰🇷", name: "South Korea", sub: "Creative & Media",     color: "#1d4ed8" },
  { flag: "🇹🇼", name: "Taiwan",      sub: "Semiconductor & HW",   color: "#16a34a" },
];

const FEATURES = [
  {
    icon: <Zap size={18} color="#f0b429" />,
    title: "Scraped every 6 hours",
    desc: "Our scrapers run continuously across JobsDB, MyCareersFuture, Wantedly, and Indeed. New listings hit your inbox before they hit the competition.",
  },
  {
    icon: <BellRing size={18} color="#f0b429" />,
    title: "Instant email alerts",
    desc: "Set your filters once. The moment a matching internship is detected, you get an email — ahead of anyone manually checking job boards.",
  },
  {
    icon: <Filter size={18} color="#f0b429" />,
    title: "Language-aware filtering",
    desc: "Filter by language required — a feature LinkedIn doesn't offer. Critical for international students targeting Japan or bilingual HK roles.",
  },
  {
    icon: <TrendingUp size={18} color="#f0b429" />,
    title: "Built for Asia",
    desc: "Not a US platform bolted onto Asia. Every data source, filter, and design decision is built around HK, SG, JP and regional hiring norms.",
  },
];

const PREVIEW_CARDS = [
  { title: "Investment Banking Analyst Intern", company: "HSBC",     country: "🇭🇰 Hong Kong", pay: "HKD 18,000/mo", tag: "Finance",    color: "#ef4444" },
  { title: "Software Engineering Intern",       company: "Grab",     country: "🇸🇬 Singapore",  pay: "SGD 2,500/mo", tag: "Technology", color: "#3b82f6" },
  { title: "AI Research Intern",                company: "SoftBank", country: "🇯🇵 Tokyo",      pay: "Paid",         tag: "Research",   color: "#be123c" },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mesh-hero" style={{ padding: "100px 24px 80px", overflow: "hidden", position: "relative" }}>

        {/* Decorative vertical line */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 1, height: 120,
          background: "linear-gradient(to bottom, transparent, var(--gold-dim))",
        }} />

        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Left — copy */}
          <div>
            <div className="anim-fade-up" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)",
              borderRadius: 100, padding: "6px 14px", marginBottom: 28,
            }}>
              <span className="pulse-dot" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Live · Scraped every 6 hours
              </span>
            </div>

            <h1 className="anim-fade-up delay-100" style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 700, lineHeight: 1.12,
              margin: "0 0 20px", color: "var(--text)", letterSpacing: "-0.02em",
            }}>
              Find internships<br />
              across Asia —<br />
              <span style={{ color: "var(--gold)", fontStyle: "italic" }}>before everyone else.</span>
            </h1>

            <p className="anim-fade-up delay-200" style={{
              color: "var(--text-2)", fontSize: 17, lineHeight: 1.7,
              maxWidth: 440, margin: "0 0 36px",
            }}>
              Real-time aggregator for Hong Kong, Singapore, Japan and more.
              Get an email the moment a new role matching your filters goes live.
            </p>

            <div className="anim-fade-up delay-300" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/internships" className="btn-gold" style={{ fontSize: 15, padding: "12px 26px" }}>
                Browse Internships <ArrowRight size={15} />
              </Link>
              <Link href="/alerts" className="btn-outline-gold" style={{ fontSize: 15, padding: "12px 24px" }}>
                <BellRing size={15} /> Set Up Alert
              </Link>
            </div>

            {/* Social proof metrics */}
            <div className="anim-fade-up delay-400 stats-row" style={{ marginTop: 40, justifyContent: "flex-start", gap: 32 }}>
              {[
                { label: "Sources",        value: "4" },
                { label: "Scrape interval", value: "6h" },
                { label: "Countries",      value: "5" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating preview cards (hidden on mobile via CSS) */}
          <div className="floating-cards anim-fade-in delay-400">
            {PREVIEW_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="card"
                style={{
                  position: "absolute",
                  left: i === 1 ? 40 : i === 2 ? -20 : 0,
                  top: i * 110,
                  width: "90%",
                  padding: "18px 20px",
                  borderLeft: `3px solid ${card.color}`,
                  animation: `float ${3.5 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.7}s`,
                  zIndex: 3 - i,
                  opacity: 1 - i * 0.08,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14, lineHeight: 1.3, marginBottom: 3 }}>{card.title}</div>
                    <div style={{ color: "var(--text-2)", fontSize: 12 }}>{card.company}</div>
                  </div>
                  <span className="badge badge-dim">{card.tag}</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                  <span style={{ color: "var(--text-3)" }}>{card.country}</span>
                  <span style={{ color: "#4ade80", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{card.pay}</span>
                </div>
                {i === 0 && (
                  <div style={{ position: "absolute", top: 14, right: 14 }}>
                    <span className="badge badge-green">New</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Country Grid ──────────────────────────────────── */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="label-overline" style={{ textAlign: "center", marginBottom: 32 }}>Covering internships across</p>
          <div className="country-grid">
            {COUNTRIES.map((c) => (
              <Link
                key={c.name}
                href={`/internships?country=${encodeURIComponent(c.name)}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card card-interactive" style={{
                  padding: "20px 16px", textAlign: "center",
                  borderTop: `2px solid ${c.color}`, cursor: "pointer",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{c.flag}</div>
                  <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 13, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="label-overline" style={{ marginBottom: 12 }}>Why InternAsia</p>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.2,
            }}>
              Built different, by design.
            </h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: "28px 32px", display: "flex", gap: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, color: "var(--text)", fontSize: 16, margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Passive income CTA — Post a Job ───────────────── */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="card" style={{
            padding: "40px 48px",
            background: "linear-gradient(135deg, rgba(240,180,41,0.04) 0%, var(--card) 100%)",
            border: "1px solid rgba(240,180,41,0.15)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 32, flexWrap: "wrap",
          }}>
            <div style={{ maxWidth: 520 }}>
              <p className="label-overline" style={{ marginBottom: 12 }}>For Companies</p>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 700, color: "var(--text)", margin: "0 0 14px", lineHeight: 1.2,
              }}>
                Post directly and reach Asia's top student talent.
              </h2>
              <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Get your listing in front of thousands of students actively hunting roles.
                Free standard listings, or feature your role for USD 99/month for top placement.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/post-job?tier=featured" className="btn-gold" style={{ fontSize: 14, padding: "12px 24px" }}>
                ⭐ Post Featured — USD 99
              </Link>
              <Link href="/post-job" className="btn-ghost" style={{ fontSize: 13, justifyContent: "center" }}>
                Post for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alert CTA ─────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240,180,41,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: "0 auto 24px",
            background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BellRing size={28} color="var(--gold)" />
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 38px)",
            fontWeight: 700, color: "var(--text)", margin: "0 0 16px", lineHeight: 1.2,
          }}>
            Never miss a posting again.
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.7, margin: "0 0 36px" }}>
            Set your filters, drop your email, get alerted instantly.
            No spam. No noise. Just matches.
          </p>
          <Link href="/alerts" className="btn-gold" style={{ fontSize: 15, padding: "13px 30px" }}>
            <BellRing size={15} /> Create Free Alert
          </Link>
        </div>
      </section>

    </div>
  );
}
