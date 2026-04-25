"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BellRing, Briefcase, BookOpen, Star, Plus, Menu, X } from "lucide-react";

const NAV = [
  { href: "/internships", label: "Browse",    icon: <Briefcase size={14} /> },
  { href: "/alerts",      label: "Set Alert", icon: <BellRing  size={14} /> },
  { href: "/resources",   label: "Resources", icon: <BookOpen  size={14} /> },
  { href: "/post-job",    label: "Post a Job", icon: <Plus     size={14} /> },
  { href: "/advertise",   label: "Advertise", icon: <Star      size={14} />, highlight: true },
];

export default function Navbar() {
  const path     = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: "1px solid var(--border)",
      background: "rgba(7,11,20,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: "var(--gold)", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Briefcase size={15} color="#0a0a0a" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
            Intern<span style={{ color: "var(--gold)" }}>Asia</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
          {NAV.map(({ href, label, icon, highlight }) => {
            const active = path.startsWith(href);
            if (highlight) return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                textDecoration: "none",
                color: "var(--gold-dim)",
                background: "transparent",
                border: "1px solid transparent",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(240,180,41,0.06)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold-dim)"; }}
              >
                {icon} {label}
              </Link>
            );
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                textDecoration: "none",
                color:      active ? "var(--gold)"              : "var(--text-2)",
                background: active ? "rgba(240,180,41,0.08)"    : "transparent",
                border:     active ? "1px solid rgba(240,180,41,0.15)" : "1px solid transparent",
                transition: "all 0.15s",
              }}>
                {icon} {label}
              </Link>
            );
          })}
          <Link href="/alerts" className="btn-gold" style={{ marginLeft: 8, padding: "7px 16px", fontSize: 13 }}>
            <BellRing size={13} /> Alert Me
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="mobile-menu-btn"
          style={{
            background: "none", border: "1px solid var(--border)", borderRadius: 8,
            padding: "7px 10px", cursor: "pointer", color: "var(--text-2)",
            display: "flex", alignItems: "center",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          padding: "12px 24px 20px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map(({ href, label, icon }) => {
              const active = path.startsWith(href);
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                  textDecoration: "none",
                  color:      active ? "var(--gold)" : "var(--text-2)",
                  background: active ? "rgba(240,180,41,0.08)" : "transparent",
                }}>
                  {icon} {label}
                </Link>
              );
            })}
            <Link href="/alerts" onClick={() => setMenuOpen(false)} className="btn-gold" style={{ marginTop: 8, justifyContent: "center", padding: "12px" }}>
              <BellRing size={14} /> Set Up Email Alert
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
