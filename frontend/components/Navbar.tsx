"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing, Briefcase, BookOpen, Star, Plus, Menu, X } from "lucide-react";

const NAV = [
  { href: "/internships", label: "Browse",    icon: <Briefcase size={14} /> },
  { href: "/alerts",      label: "Set Alert", icon: <BellRing  size={14} /> },
  { href: "/resources",   label: "Resources", icon: <BookOpen  size={14} /> },
  { href: "/post-job",    label: "Post a Job", icon: <Plus     size={14} /> },
  { href: "/advertise",   label: "Advertise", icon: <Star      size={14} />, highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(7,11,20,0.85)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>
          InternAsia
        </Link>

        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                textDecoration: "none",
                background: item.highlight ? "rgba(240,180,41,0.1)" : active ? "rgba(255,255,255,0.06)" : "transparent",
                color: item.highlight ? "var(--gold)" : active ? "var(--text)" : "var(--text-2)",
                border: item.highlight ? "1px solid rgba(240,180,41,0.2)" : "1px solid transparent",
                transition: "all 0.15s",
              }}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </div>

        <button className="mobile-menu-btn" onClick={() => setOpen(!open)} style={{
          background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: 8,
        }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "12px 24px 20px" }}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 0", fontSize: 15, color: item.highlight ? "var(--gold)" : "var(--text-2)",
              textDecoration: "none", borderBottom: "1px solid var(--border)",
            }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
