"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createAlert } from "@/lib/api";
import { Bell, Check } from "lucide-react";

function AlertForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [form, setForm] = useState({
    email: "", name: "",
    country: searchParams.get("country") || "",
    industry: searchParams.get("industry") || "",
    language: "", keywords: "", paid_only: false, frequency: "instant",
  });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const COUNTRIES  = ["","Hong Kong","Singapore","Japan","South Korea","Taiwan"];
  const INDUSTRIES = ["","Finance","Technology","Marketing","Consulting","Legal","Design","Operations","Human Resources","Research","General"];
  const LANGUAGES  = ["","English","Chinese","Japanese","Korean","Bilingual"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await createAlert(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Check size={28} color="#16a34a" />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>Check your email</h2>
      <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>We sent a confirmation link. Click it to activate your alert — then we'll email you the moment a match is found.</p>
      <a href="/internships" className="btn-primary">Browse listings now</a>
    </div>
  );

  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
  const inputStyle: React.CSSProperties = { width: "100%", background: "#fff", border: "1px solid #d1d5db", borderRadius: 6, padding: "9px 12px", color: "#111827", fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>

      {/* Left — form */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Create a Job Alert</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 32px", lineHeight: 1.6 }}>Get emailed the instant a matching internship is posted. Free, no spam.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="form-grid-2">
            <div><label style={labelStyle}>Email address *</label><input style={inputStyle} required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" /></div>
            <div><label style={labelStyle}>Your name</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jane" /></div>
          </div>
          <div className="form-grid-2">
            <div><label style={labelStyle}>Country</label>
              <select style={inputStyle} value={form.country} onChange={e => set("country", e.target.value)}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c || "Any country"}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Industry</label>
              <select style={inputStyle} value={form.industry} onChange={e => set("industry", e.target.value)}>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i || "Any industry"}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid-2">
            <div><label style={labelStyle}>Language required</label>
              <select style={inputStyle} value={form.language} onChange={e => set("language", e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l || "Any language"}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Alert frequency</label>
              <select style={inputStyle} value={form.frequency} onChange={e => set("frequency", e.target.value)}>
                <option value="instant">Instant (as soon as posted)</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly digest</option>
              </select>
            </div>
          </div>
          <div><label style={labelStyle}>Keywords (optional)</label><input style={inputStyle} value={form.keywords} onChange={e => set("keywords", e.target.value)} placeholder="e.g. analyst, excel, python" /></div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#374151" }}>
            <input type="checkbox" checked={form.paid_only} onChange={e => set("paid_only", e.target.checked)} />
            Only show paid internships
          </label>
          {status === "error" && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "12px 16px", color: "#dc2626", fontSize: 13 }}>Something went wrong. Please try again.</div>}
          <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ fontSize: 15, padding: "12px", justifyContent: "center" }}>
            {status === "loading" ? "Creating alert..." : <><Bell size={15} /> Create Alert — Free</>}
          </button>
        </form>
      </div>

      {/* Right — benefits */}
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "28px" }}>
        <div style={{ fontWeight: 600, color: "#111827", fontSize: 15, marginBottom: 20 }}>How it works</div>
        {[
          { step: "1", title: "Set your filters", desc: "Choose country, industry, language and salary preferences." },
          { step: "2", title: "Confirm your email", desc: "Click the link we send — takes 10 seconds." },
          { step: "3", title: "Get notified instantly", desc: "We email you the moment a matching role is posted on any of our 4 job boards." },
        ].map(s => (
          <div key={s.step} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, background: "#2563eb", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontWeight: 600, color: "#111827", fontSize: 13, marginBottom: 4 }}>{s.title}</div>
              <div style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>✓ Completely free &nbsp;·&nbsp; ✓ No spam &nbsp;·&nbsp; ✓ Unsubscribe anytime</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>Loading...</div>}><AlertForm /></Suspense>;
}
