import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Mail, BarChart2, Star, CheckCircle, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise on InternAsia",
  description:
    "Reach thousands of students and graduates actively hunting internships across Hong Kong, Singapore, Japan, South Korea and Taiwan.",
};

const PACKAGES = [
  {
    name: "Featured Listing",
    price: "USD 99",
    period: "/ 30 days",
    color: "#f0b429",
    icon: <Star size={20} color="#f0b429" />,
    highlight: true,
    description: "Pin your internship to the top of every search result and country feed.",
    features: [
      "Gold 'Featured' badge on all listing cards",
      "Pinned above organic results for 30 days",
      "Appears in relevant email alerts sent to subscribers",
      "Included in the weekly digest highlight section",
      "Admin dashboard tracking (views, clicks)",
    ],
    cta: "Post a Featured Listing",
    ctaHref: "/post-job?tier=featured",
  },
  {
    name: "Email Digest Sponsor",
    price: "USD 149",
    period: "/ edition",
    color: "#3b82f6",
    icon: <Mail size={20} color="#3b82f6" />,
    highlight: false,
    description: "Your brand in front of subscribers actively looking for Asia internships.",
    features: [
      "Inline sponsor banner in weekly digest",
      "Sent to all confirmed alert subscribers",
      "Your name, tagline, and link",
      "Audience: students and grads in HK, SG, JP, KR, TW",
      "Exclusive — one sponsor per edition",
    ],
    cta: "Enquire About Sponsorship",
    ctaHref: "mailto:advertise@internasia.app?subject=Digest Sponsorship Enquiry",
  },
  {
    name: "Banner Advertising",
    price: "USD 79",
    period: "/ month",
    color: "#22c55e",
    icon: <BarChart2 size={20} color="#22c55e" />,
    highlight: false,
    description: "Contextual sidebar and in-feed banners across the browse and detail pages.",
    features: [
      "Resume builder / language course / career tool placements",
      "Context-aware (Japan roles get language tool ads, etc.)",
      "Click-through tracking provided",
      "Monthly performance report",
      "Custom copy and link",
    ],
    cta: "Enquire About Banners",
    ctaHref: "mailto:advertise@internasia.app?subject=Banner Advertising Enquiry",
  },
];

const STATS = [
  { label: "Countries covered",  value: "5" },
  { label: "Scrape interval",    value: "6h" },
  { label: "Sources aggregated", value: "4+" },
  { label: "Alert subscribers",  value: "Growing" },
];

export default function AdvertisePage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p className="label-overline" style={{ marginBottom: 12 }}>Reach Asia's Next Workforce</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.15 }}>
          Advertise on <span style={{ color: "var(--gold)", fontStyle: "italic" }}>InternAsia</span>
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
          Our audience is students and graduates actively hunting internships across Hong Kong,
          Singapore, Japan, South Korea and Taiwan. High intent. Growing daily.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--gold)" }}>{s.value}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 64 }}>
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className="card"
            style={{
              padding: "32px",
              borderTop: `3px solid ${pkg.color}`,
              position: "relative",
              ...(pkg.highlight ? { boxShadow: `0 0 40px rgba(240,180,41,0.12)`, borderColor: pkg.color } : {}),
            }}
          >
            {pkg.highlight && (
              <div style={{ position: "absolute", top: -1, right: 20, background: "var(--gold)", color: "#000", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "0 0 6px 6px" }}>
                Most Popular
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${pkg.color}15`, border: `1px solid ${pkg.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {pkg.icon}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>{pkg.name}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text)" }}>{pkg.price}</span>
              <span style={{ color: "var(--text-3)", fontSize: 14, marginLeft: 4 }}>{pkg.period}</span>
            </div>

            <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>{pkg.description}</p>

            <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {pkg.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
                  <CheckCircle size={14} color={pkg.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={pkg.ctaHref}
              className={pkg.highlight ? "btn-gold" : "btn-outline-gold"}
              style={{ display: "block", textAlign: "center", textDecoration: "none", fontSize: 14, padding: "11px 20px" }}
            >
              {pkg.cta}
            </a>
          </div>
        ))}
      </div>

      {/* Why advertise here */}
      <div className="card" className="advertise-split" style={{ padding: "40px 48px" }}>
        <div>
          <p className="label-overline" style={{ marginBottom: 12 }}>Why InternAsia</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text)", margin: "0 0 16px" }}>
            The highest-intent audience in Asian internship recruiting.
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            Everyone browsing InternAsia is actively looking to land an internship. They set up email
            alerts, check listings daily, and click apply links. This is not passive scrolling — it's
            job-hunting behaviour. Your product reaches them exactly when they need it most.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { icon: <Zap size={16} color="var(--gold)" />, t: "High intent traffic", d: "Every visitor is actively job hunting. Conversion rates beat generic ad networks." },
            { icon: <TrendingUp size={16} color="#22c55e" />, t: "Growing subscriber list", d: "Email alert subscribers are the highest-value users — they opted in and confirmed." },
            { icon: <Mail size={16} color="#3b82f6" />, t: "Direct inbox access", d: "Digest sponsors reach subscribers' personal inboxes, not just a browser tab." },
          ].map((item) => (
            <div key={item.t} style={{ display: "flex", gap: 14, padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14, marginBottom: 4 }}>{item.t}</div>
                <div style={{ color: "var(--text-3)", fontSize: 13, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: 64 }}>
        <p style={{ color: "var(--text-2)", fontSize: 15, margin: "0 0 20px" }}>
          Questions? Custom packages available for agencies and long-term partners.
        </p>
        <a
          href="mailto:advertise@internasia.app"
          className="btn-gold"
          style={{ fontSize: 15, padding: "13px 30px", textDecoration: "none" }}
        >
          <Mail size={15} /> Get in Touch
        </a>
      </div>
    </div>
  );
}
