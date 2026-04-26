import { ExternalLink } from "lucide-react";
import AffiliateBanner from "@/components/ads/AffiliateBanner";
import AdSense from "@/components/ads/AdSense";

const SECTIONS = [
  {
    label: "Resume & CV",
    title: "Stand out on paper.",
    desc: "The ATS-friendly builders that HK, SG, and JP recruiters actually see.",
    items: [
      { name: "Kickresume", tag: "Most popular", url: "https://www.kickresume.com?ref=internasia", desc: "ATS-optimised templates with AI content suggestions. Used widely across APAC markets. Free tier available." },
      { name: "Enhancv",   tag: "Consulting & finance", url: "https://enhancv.com?ref=internasia", desc: "Impact-first design philosophy. Strong for structured internship programs at major banks and consulting firms." },
      { name: "Novoresume", tag: "Student favourite", url: "https://novoresume.com?ref=internasia", desc: "Clean one-page layouts. Popular among university students in HK and SG applying to structured schemes." },
    ],
  },
  {
    label: "Language",
    title: "Open Japan up.",
    desc: "Most Japan internships are gated by language. These break that gate open.",
    items: [
      { name: "Preply",  tag: "For Japan applicants", url: "https://preply.com?ref=internasia", desc: "1-on-1 tutoring with native Japanese speakers. Best for conversational prep before an interview." },
      { name: "iTalki", tag: "Budget-friendly", url: "https://www.italki.com?ref=internasia", desc: "Community tutors at lower rates. Good alongside JLPT prep. Business Japanese focus." },
    ],
  },
  {
    label: "Courses",
    title: "Build a profile they notice.",
    desc: "Certifications that appear on APAC recruiter shortlists.",
    items: [
      { name: "Coursera", tag: "University-backed", url: "https://coursera.org?ref=internasia", desc: "Finance, data, and business courses from NUS, HKU, and global universities. Widely recognised across APAC." },
      { name: "Udemy",    tag: "Practical skills",  url: "https://udemy.com?ref=internasia", desc: "Python, Excel, financial modelling. Build project portfolio pieces alongside your application." },
    ],
  },
];

const GUIDES = [
  { title: "Applying to Japan without Japanese", sub: "English-friendly companies, application etiquette, which platforms work for international students." },
  { title: "HK internship season calendar",      sub: "When big banks and firms open applications, and how to time your alert filters." },
  { title: "Singapore internship visa guide",     sub: "What you need as a non-Singaporean student, and which companies sponsor." },
  { title: "Cover letters for Asian employers",   sub: "Cultural differences between HK/SG and Japanese hiring norms, and how to adapt." },
];

export default function ResourcesPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <p className="label-overline" style={{ marginBottom: 12 }}>Toolkit</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Resources to land<br />
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>your Asian internship.</span>
        </h1>
      </div>

      {/* Top ad */}
      <div style={{ marginBottom: 48 }}>
        <AdSense slot="1234567890" format="horizontal" />
      </div>

      {/* Sections */}
      {SECTIONS.map((section, si) => (
        <div key={section.label} style={{ marginBottom: 64 }}>
          {/* Section header */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div>
              <p className="label-overline" style={{ marginBottom: 10 }}>{section.label}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: '0 0 10px', lineHeight: 1.2 }}>{section.title}</h2>
              <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{section.desc}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.items.length}, 1fr)`, gap: 12, alignItems: 'start' }}>
              {section.items.map(item => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card" style={{
                    padding: '20px',
                    transition: 'all 0.2s',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--gold-dim)';
                      el.style.transform = 'translateY(-2px)';
                      el.style.boxShadow = '0 0 24px rgba(240,180,41,0.1)';
                    }}
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--border)';
                      el.style.transform = '';
                      el.style.boxShadow = '';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>{item.name}</span>
                      <ExternalLink size={12} color="var(--text-3)" />
                    </div>
                    <span className="badge badge-gold" style={{ marginBottom: 12 }}>{item.tag}</span>
                    <p style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Mid ad */}
      <div style={{ margin: '48px 0' }}>
        <AdSense slot="0987654321" format="rectangle" />
      </div>

      {/* Guides */}
      <div style={{ marginBottom: 56 }}>
        <p className="label-overline" style={{ marginBottom: 24 }}>Guides</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {GUIDES.map(g => (
            <div key={g.title} className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, margin: '0 0 6px' }}>{g.title}</p>
                <p style={{ color: 'var(--text-3)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{g.sub}</p>
              </div>
              <ExternalLink size={14} color="var(--text-3)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <AffiliateBanner context="detail" />
        <AffiliateBanner context="japan" />
        <AffiliateBanner context="sidebar" />
      </div>
    </div>
  );
}
