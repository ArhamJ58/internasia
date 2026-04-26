"use client";
import Link from "next/link";

const RESOURCES = [
  {
    category: "CV & Resume",
    items: [
      { name: "Kickresume", desc: "ATS-optimized resume builder with Asia-friendly templates.", url: "https://kickresume.com?ref=internasia", cta: "Build free →" },
      { name: "Enhancv", desc: "Modern resume builder trusted by 3M+ job seekers.", url: "https://enhancv.com?ref=internasia", cta: "Try free →" },
      { name: "Novoresume", desc: "Clean one-page resumes that pass ATS screening.", url: "https://novoresume.com?ref=internasia", cta: "Try free →" },
    ],
  },
  {
    category: "Language Learning",
    items: [
      { name: "Preply", desc: "1-on-1 tutors for Japanese, Cantonese, Korean and Mandarin.", url: "https://preply.com?ref=internasia", cta: "Find tutor →" },
      { name: "iTalki", desc: "Affordable language lessons with native speakers.", url: "https://italki.com?ref=internasia", cta: "Start learning →" },
    ],
  },
  {
    category: "Skills & Courses",
    items: [
      { name: "Coursera", desc: "University-backed courses in finance, tech, and business.", url: "https://coursera.org?ref=internasia", cta: "Browse free →" },
      { name: "Udemy", desc: "Affordable practical skills courses for any industry.", url: "https://udemy.com?ref=internasia", cta: "Browse courses →" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
      <div style={{ marginBottom: 56 }}>
        <p className="label-overline" style={{ marginBottom: 12 }}>Intern Smarter</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "var(--text)", margin: "0 0 16px", lineHeight: 1.15 }}>
          Resources for Asia Interns
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
          Tools and courses to help you land the role and thrive once you do.
        </p>
      </div>

      {RESOURCES.map((section) => (
        <div key={section.category} style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 20px" }}>
            {section.category}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {section.items.map((item) => (
              <div key={item.name} className="card" style={{ padding: "24px" }}>
                <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 16, marginBottom: 8 }}>{item.name}</div>
                <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>{item.desc}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" style={{ fontSize: 13 }}>
                  {item.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 60, textAlign: "center" }}>
        <p style={{ color: "var(--text-2)", fontSize: 15, margin: "0 0 20px" }}>Ready to find your internship?</p>
        <Link href="/internships" className="btn-gold" style={{ fontSize: 15, padding: "12px 28px" }}>
          Browse Listings →
        </Link>
      </div>
    </div>
  );
}
