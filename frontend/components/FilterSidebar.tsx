"use client";
import { useState } from "react";
import { Filters } from "@/lib/api";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  options: { countries: string[]; industries: string[]; languages: string[] };
  /** When true, renders as a slide-in overlay drawer (mobile) */
  asDrawer?: boolean;
  onClose?: () => void;
}

const LABEL: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  marginBottom: 8,
};

export default function FilterSidebar({ filters, onChange, options, asDrawer, onClose }: Props) {
  const set = (key: keyof Filters, val: unknown) =>
    onChange({ ...filters, [key]: val || undefined, page: 1 });

  const clear = () => {
    onChange({ page: 1, limit: 20 });
    onClose?.();
  };

  const hasFilters =
    filters.country || filters.industry || filters.language ||
    filters.paid_only || filters.search || filters.posted_within_hours;

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Search */}
      <div>
        <label style={LABEL}>Search</label>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Title, company..."
            value={filters.search || ""}
            onChange={e => set("search", e.target.value)}
            className="input"
            style={{ paddingLeft: 34 }}
          />
        </div>
      </div>

      <div className="divider" />

      {/* Country */}
      <div>
        <label style={LABEL}>Country</label>
        <select className="input" value={filters.country || ""} onChange={e => set("country", e.target.value)}>
          <option value="">All countries</option>
          {options.countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Industry */}
      <div>
        <label style={LABEL}>Industry</label>
        <select className="input" value={filters.industry || ""} onChange={e => set("industry", e.target.value)}>
          <option value="">All industries</option>
          {options.industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Language */}
      <div>
        <label style={LABEL}>Language</label>
        <select className="input" value={filters.language || ""} onChange={e => set("language", e.target.value)}>
          <option value="">Any language</option>
          {options.languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Recency */}
      <div>
        <label style={LABEL}>Posted Within</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {([
            { label: "Any",   value: undefined },
            { label: "24h ⚡", value: 24 },
            { label: "3d",    value: 72 },
            { label: "1w",    value: 168 },
          ] as const).map(opt => {
            const active = filters.posted_within_hours === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => set("posted_within_hours", opt.value)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  padding: "5px 10px", borderRadius: 6,
                  border: `1px solid ${active ? "var(--gold-dim)" : "var(--border)"}`,
                  background: active ? "rgba(240,180,41,0.1)" : "transparent",
                  color: active ? "var(--gold)" : "var(--text-3)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >{opt.label}</button>
            );
          })}
        </div>
      </div>

      {/* Paid toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div
          onClick={() => set("paid_only", !filters.paid_only)}
          style={{
            width: 36, height: 20, borderRadius: 10,
            background: filters.paid_only ? "var(--gold)" : "var(--border)",
            position: "relative", cursor: "pointer",
            transition: "background 0.2s", flexShrink: 0,
          }}
        >
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            background: "#fff",
            position: "absolute", top: 3,
            left: filters.paid_only ? 19 : 3,
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }} />
        </div>
        <span style={{ fontSize: 13, color: "var(--text-2)" }}>Paid only</span>
      </label>

      {/* Clear button */}
      {hasFilters && (
        <button
          onClick={clear}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "9px 16px", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "#ef4444", letterSpacing: "0.06em", textTransform: "uppercase",
            transition: "all 0.15s", marginTop: 4,
          }}
        >
          <X size={10} /> Clear all filters
        </button>
      )}
    </div>
  );

  // ── Mobile drawer mode ────────────────────────────────────────────────────
  if (asDrawer) {
    return (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "flex-end",
        }}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        />
        {/* Drawer panel */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxHeight: "85vh",
          background: "var(--surface)",
          borderRadius: "20px 20px 0 0",
          border: "1px solid var(--border)",
          borderBottom: "none",
          overflowY: "auto",
          padding: "24px 20px 40px",
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-hi)", margin: "0 auto 24px" }} />
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SlidersHorizontal size={14} color="var(--gold)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-2)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Filters
              </span>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4 }}>
              <X size={18} />
            </button>
          </div>
          {content}
          {/* Apply button */}
          <button
            onClick={onClose}
            className="btn-gold"
            style={{ width: "100%", justifyContent: "center", marginTop: 20, padding: "13px" }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop sidebar mode ──────────────────────────────────────────────────
  return (
    <aside style={{ width: "100%", maxWidth: 240, flexShrink: 0 }}>
      <div className="card" style={{ padding: "20px", position: "sticky", top: 76 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SlidersHorizontal size={14} color="var(--gold)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-2)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Filters
            </span>
          </div>
          {hasFilters && (
            <button onClick={clear} style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--text-3)", letterSpacing: "0.06em",
              textTransform: "uppercase", transition: "color 0.15s", padding: 0,
            }}
            >
              <X size={10} /> Clear
            </button>
          )}
        </div>
        {content}
      </div>
    </aside>
  );
}
