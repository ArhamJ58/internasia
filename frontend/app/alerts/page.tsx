"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createAlert, fetchFilters } from "@/lib/api";
import { BellRing, CheckCircle2, Loader2, Zap, Mail, Globe, Briefcase, Languages, DollarSign, Search } from "lucide-react";

const LABEL_STYLE = {
  display: 'block',
  fontFamily: 'var(--font-mono)' as const,
  fontSize: 10,
  fontWeight: 600 as const,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'var(--text-3)',
  marginBottom: 8,
};

export default function AlertsPage() {
  const searchParams = useSearchParams();
  const [options, setOptions] = useState<any>({ countries: [], industries: [], languages: [] });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email:     "",
    name:      "",
    country:   searchParams.get("country") || "",
    industry:  searchParams.get("industry") || "",
    language:  "",
    keywords:  "",
    paid_only: false,
    frequency: "instant",
  });

  useEffect(() => { fetchFilters().then(setOptions).catch(console.error); }, []);
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.email) { setError("Email is required."); return; }
    setLoading(true); setError("");
    try {
      await createAlert({
        ...form,
        country:  form.country  || undefined,
        industry: form.industry || undefined,
        language: form.language || undefined,
        keywords: form.keywords || undefined,
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle2 size={34} color="#4ade80" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--text)', margin: '0 0 12px' }}>
          Alert created!
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 8px' }}>
          Check your email to confirm and activate your alert.
        </p>
        <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '0 0 32px', fontFamily: 'var(--font-mono)' }}>
          Once confirmed, you'll be emailed the instant a match is scraped.
        </p>
        <button onClick={() => { setSuccess(false); setForm({ email: "", name: "", country: "", industry: "", language: "", keywords: "", paid_only: false, frequency: "instant" }); }}
          className="btn-ghost">
          Create another alert
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 80, alignItems: 'start' }}>

        {/* Left — explanation */}
        <div>
          <p className="label-overline" style={{ marginBottom: 16 }}>Instant alerts</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, color: 'var(--text)', margin: '0 0 20px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Get notified the instant a match<br />
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>goes live.</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15, lineHeight: 1.8, margin: '0 0 40px' }}>
            Set your filters once. The moment our scrapers detect a matching internship across any of our 4 sources, your email fires — before anyone who checks manually.
          </p>

          {/* How it works */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: <Search size={15} color="var(--gold)" />, step: "01", title: "Set your filters", desc: "Country, industry, language, keywords, paid-only — any combination." },
              { icon: <Zap size={15} color="var(--gold)" />, step: "02", title: "We scrape 24/7", desc: "Our scrapers hit JobsDB, MCF, Wantedly and Indeed every 6 hours automatically." },
              { icon: <Mail size={15} color="var(--gold)" />, step: "03", title: "You hear first", desc: "Instant email the moment a match is detected. No batch, no delay." },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.icon}</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{s.step}</p>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, margin: '0 0 4px' }}>{s.title}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="card" style={{ padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 28px', letterSpacing: '-0.01em' }}>
            Configure your alert
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <div>
              <label style={LABEL_STYLE}>Email <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Mail size={13} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => set("email", e.target.value)} className="input" style={{ paddingLeft: 36 }} />
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={LABEL_STYLE}>Name (optional)</label>
              <input type="text" placeholder="Alex" value={form.name}
                onChange={e => set("name", e.target.value)} className="input" />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>
                Filters — leave blank to match all
              </p>

              {/* Country */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}><Globe size={10} style={{ display: 'inline', marginRight: 4 }} />Country</label>
                <select className="input" value={form.country} onChange={e => set("country", e.target.value)}>
                  <option value="">Any country</option>
                  {options.countries.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Industry */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}><Briefcase size={10} style={{ display: 'inline', marginRight: 4 }} />Industry</label>
                <select className="input" value={form.industry} onChange={e => set("industry", e.target.value)}>
                  <option value="">Any industry</option>
                  {options.industries.map((i: string) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {/* Language */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}><Languages size={10} style={{ display: 'inline', marginRight: 4 }} />Language Required</label>
                <select className="input" value={form.language} onChange={e => set("language", e.target.value)}>
                  <option value="">Any language</option>
                  {options.languages.map((l: string) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Keywords */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}><Search size={10} style={{ display: 'inline', marginRight: 4 }} />Keywords</label>
                <input type="text" placeholder="finance, data analyst, marketing..."
                  value={form.keywords} onChange={e => set("keywords", e.target.value)} className="input" />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', margin: '6px 0 0' }}>
                  Comma-separated. Matches against job title.
                </p>
              </div>

              {/* Paid toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 20 }}>
                <div onClick={() => set("paid_only", !form.paid_only)} style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: form.paid_only ? 'var(--gold)' : 'var(--border)',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, left: form.paid_only ? 21 : 3,
                    transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>Paid internships only</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>Skip unpaid roles</div>
                </div>
              </label>
            </div>

            {/* Frequency */}
            <div>
              <label style={LABEL_STYLE}>Alert frequency</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { val: "instant", label: "Instant", sub: "Email on detection" },
                  { val: "daily",   label: "Daily",   sub: "Once per day" },
                  { val: "weekly",  label: "Weekly",  sub: "Monday digest" },
                ].map(opt => (
                  <button key={opt.val} onClick={() => set("frequency", opt.val)} style={{
                    padding: '12px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                    border: `1px solid ${form.frequency === opt.val ? 'rgba(240,180,41,0.4)' : 'var(--border)'}`,
                    background: form.frequency === opt.val ? 'rgba(240,180,41,0.08)' : 'transparent',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: form.frequency === opt.val ? 'var(--gold)' : 'var(--text)', marginBottom: 3 }}>{opt.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>
              </div>
            )}

            <button onClick={submit} disabled={loading} className="btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px', borderRadius: 12, opacity: loading ? 0.7 : 1 }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <BellRing size={16} />}
              {loading ? "Creating..." : "Create Alert"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
