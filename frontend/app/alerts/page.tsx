"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createAlert } from "@/lib/api";

function AlertForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [form, setForm] = useState({
    email: "", name: "",
    country: searchParams.get("country") || "",
    industry: searchParams.get("industry") || "",
    language: "", keywords: "", paid_only: false, frequency: "instant",
  });

  const set = (k: string, v: string|boolean) => setForm(f => ({ ...f, [k]: v }));

  const COUNTRIES = ["","Hong Kong","Singapore","Japan","South Korea","Taiwan"];
  const INDUSTRIES = ["","Finance","Technology","Marketing","Consulting","Legal","Design","Operations","Human Resources","Research","General"];
  const LANGUAGES = ["","English","Chinese","Japanese","Korean","Bilingual"];

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

  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 14, padding: "10px 14px", outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--text-3)", marginBottom: 8 };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>📬</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", margin: "0 0 12px" }}>Check your email!</h2>
      <p style={{ color: "var(--text-2)" }}>We sent a confirmation link. Click it to activate your alert.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "60px 24px 80px" }}>
      <p className="label-overline" style={{ marginBottom: 12 }}>Never miss a role</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "var(--text)", margin: "0 0 12px" }}>Set Up Your Alert</h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.7, margin: "0 0 40px" }}>Get emailed the instant a matching internship goes live.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><label style={labelStyle}>Email *</label><input style={inputStyle} required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" /></div>
          <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><label style={labelStyle}>Language</label>
            <select style={inputStyle} value={form.language} onChange={e => set("language", e.target.value)}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l || "Any language"}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Frequency</label>
            <select style={inputStyle} value={form.frequency} onChange={e => set("frequency", e.target.value)}>
              <option value="instant">Instant</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>
        </div>
        <div><label style={labelStyle}>Keywords (comma separated)</label><input style={inputStyle} value={form.keywords} onChange={e => set("keywords", e.target.value)} placeholder="finance, analyst, excel" /></div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--text-2)", fontSize: 14 }}>
          <input type="checkbox" checked={form.paid_only} onChange={e => set("paid_only", e.target.checked)} />
          Paid internships only
        </label>
        {status === "error" && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: 13 }}>Something went wrong. Please try again.</div>}
        <button type="submit" disabled={status === "loading"} className="btn-gold" style={{ fontSize: 15, padding: "13px 28px", opacity: status === "loading" ? 0.7 : 1 }}>
          {status === "loading" ? "Sending..." : "🔔 Create Alert"}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div style={{ padding: 40, color: "var(--text-3)" }}>Loading...</div>}><AlertForm /></Suspense>;
}
