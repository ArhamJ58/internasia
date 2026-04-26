"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Briefcase, BookOpen, Menu, X } from "lucide-react";

const NAV = [
  { href: "/internships", label: "Find Internships", icon: <Search size={15} /> },
  { href: "/alerts",      label: "Job Alerts",       icon: <Bell    size={15} /> },
  { href: "/resources",   label: "Resources",        icon: <BookOpen size={15} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: "#2563eb", letterSpacing: "-0.02em" }}>
            InternAsia
          </Link>
          <div className="desktop-nav">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 6, fontSize: 14, fontWeight: 500,
                  color: active ? "#2563eb" : "#6b7280",
                  background: active ? "#eff6ff" : "transparent",
                  transition: "all 0.15s",
                }}>
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/alerts" className="btn-primary" style={{ fontSize: 13, padding: "7px 16px" }}>
            <Bell size={13} /> Set Alert
          </Link>
          <button className="mobile-menu-btn" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 6 }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff", padding: "8px 24px 16px" }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
