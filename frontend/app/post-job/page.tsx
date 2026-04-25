"use client";
import { useState } from "react";
import { submitJobPost } from "@/lib/api";
import { Star, CheckCircle, Send, Zap } from "lucide-react";

const COUNTRIES = ["Hong Kong", "Singapore", "Japan", "South Korea", "Taiwan"];
const INDUSTRIES = ["Finance", "Technology", "Marketing", "Consulting", "Legal", "Design", "Operations", "Human Resources", "Research", "General"];
const LANGUAGES  = ["English", "Chinese", "Japanese", "Korean", "Bilingual", "Any"];

const TIERS = [
  {
    id: "standard",
    name: "Standard",
    price: "Free",
    color: "var(--border-hi)",
    perks: ["Listed in organic results", "Included in relevant email alerts", "Active for 30 days"],
    note: "Reviewed within 24 hours",
  },
  {
    id: "featured",
    name: "Featured",
    price: "USD 99",
    color: "#f0b429",
    perks: ["⭐ Pinned to top of all results", "Gold 'Featured' badge", "Priority in email digests", "Active for 30 days"],
    note: "Payment via invoice after approval",
  },
] as const;

export default function PostJobPage() {
  const [tier, setTier]           = useState<"standard" | "featured">("standard");
  const [status, setStatus]       = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [form, setForm] = useState({
    company_name: "", contact_email: "", contact_name: "",
    role_title: "", location_country: "Hong Kong", location_city: "",
    industry: "Technology", is_paid: true, stipend_range: "",
    language_required: "English", description: "",
    apply_url: "", duration_weeks: "", message: "",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitJobPost({
        ...form,
        duration_weeks: form.duration_weeks ? Number(form.duration_weeks) : undefined,
        tier,
      });
      setStatus("success");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Submission failed. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ maxWidth: 540, margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--text)", margin: "0 0 14px" }}>
          Submission received!
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
          We'll review your listing and publish it within 24 hours.
          {tier === "featured" && " We'll send a payment invoice to your contact email once approved."}
        </p>
        <a href="/internships" className="btn-gold" style={{ textDecoration: "none", fontSize: 14 }}>Browse Listings →</a>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--text)", fontSize: 14, padding: "10px 14px",
    outline: "none", transition: "border-color 0.15s", fontFamily: "var(--font-body)", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 8,
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 24px 80px" }}>

      <div style={{ marginBottom: 48 }}>
        <p className="label-overline" style={{ marginBottom: 12 }}>Reach Asia's Top Talent</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "var(--text)", margin: "0 0 16px", lineHeight: 1.2 }}>
          Post an Internship
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
          Get your listing in front of students actively hunting roles across
          Hong Kong, Singapore, Japan, South Korea and Taiwan.
        </p>
      </div>

      {/* Tier selector */}
      <div className="tier-grid" style={{ marginBottom: 40 }}>
        {TIERS.map((t) => (
          <button key={t.id} onClick={() => setTier(t.id)}
            style={{
              background: tier === t.id ? `${t.color}10` : "var(--card)",
              border: `2px solid ${tier === t.id ? t.color : "var(--border)"}`,
              borderRadius: 12, padding: "20px 22px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
            }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>{t.name}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: t.color }}>{t.price}</div>
            </div>
            <ul style={{ listStyle: "none", margin: "0 0 10px", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {t.perks.map((p) => (
                <li key={p} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-2)" }}>
                  <CheckCircle size={11} color={t.color} /> {p}
                </li>
              ))}
            </ul>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.note}</div>
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div className="form-grid-2">
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input style={inputStyle} required value={form.company_name} onChange={e => set("company_name", e.target.value)} placeholder="Acme Corp" />
          </div>
          <div>
            <label style={labelStyle}>Role Title *</label>
            <input style={inputStyle} required value={form.role_title} onChange={e => set("role_title", e.target.value)} placeholder="Software Engineering Intern" />
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label style={labelStyle}>Contact Email *</label>
            <input style={inputStyle} required type="email" value={form.contact_email} onChange={e => set("contact_email", e.target.value)} placeholder="hr@company.com" />
          </div>
          <div>
            <label style={labelStyle}>Contact Name</label>
            <input style={inputStyle} value={form.contact_name} onChange={e => set("contact_name", e.target.value)} placeholder="Jane Smith" />
          </div>
        </div>

        <div className="form-grid-3">
          <div>
            <label style={labelStyle}>Country *</label>
            <select style={inputStyle} value={form.location_country} onChange={e => set("location_country", e.target.value)}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={form.location_city} onChange={e => set("location_city", e.target.value)} placeholder="Central" />
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <select style={inputStyle} value={form.industry} onChange={e => set("industry", e.target.value)}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div className="form-grid-3">
          <div>
            <label style={labelStyle}>Language Required</label>
            <select style={inputStyle} value={form.language_required} onChange={e => set("language_required", e.target.value)}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Duration (weeks)</label>
            <input style={inputStyle} type="number" min="4" max="52" value={form.duration_weeks} onChange={e => set("duration_weeks", e.target.value)} placeholder="12" />
          </div>
          <div>
            <label style={labelStyle}>Stipend / Pay</label>
            <input style={inputStyle} value={form.stipend_range} onChange={e => set("stipend_range", e.target.value)} placeholder="HKD 15,000/mo" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.is_paid} onChange={e => set("is_paid", e.target.checked)} />
            <span style={{ fontSize: 14, color: "var(--text-2)" }}>This internship is paid</span>
          </label>
        </div>

        <div>
          <label style={labelStyle}>Apply URL *</label>
          <input style={inputStyle} required type="url" value={form.apply_url} onChange={e => set("apply_url", e.target.value)} placeholder="https://jobs.yourcompany.com/internship-123" />
        </div>

        <div>
          <label style={labelStyle}>Description *</label>
          <textarea style={{ ...inputStyle, height: 140, resize: "vertical" }} required value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Brief description of the role, responsibilities, and what applicants should expect..." />
        </div>

        <div>
          <label style={labelStyle}>Message to InternAsia (optional)</label>
          <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={form.message}
            onChange={e => set("message", e.target.value)}
            placeholder="Anything else you'd like us to know..." />
        </div>

        {status === "error" && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {tier === "featured" && (
          <div style={{ background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Star size={16} color="var(--gold)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--gold)", fontSize: 13, marginBottom: 4 }}>Featured Listing — USD 99</div>
              <div style={{ color: "var(--text-3)", fontSize: 12, lineHeight: 1.6 }}>
                We'll send a payment invoice to your contact email once we've reviewed and approved your listing.
                No payment required to submit.
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-gold"
          style={{ fontSize: 15, padding: "13px 28px", opacity: status === "loading" ? 0.7 : 1, cursor: status === "loading" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, width: "fit-content" }}
        >
          {status === "loading" ? <><Zap size={15} /> Submitting...</> : <><Send size={15} /> Submit Listing</>}
        </button>
      </form>
    </div>
  );
}
