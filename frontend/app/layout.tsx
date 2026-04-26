import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "InternAsia — Internships in Asia", template: "%s | InternAsia" },
  description: "Find internships in Hong Kong, Singapore, Japan, South Korea and Taiwan. Get email alerts the moment a matching role is posted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 56px)" }}>{children}</main>
        <footer style={{ background: "#ffffff", borderTop: "1px solid #e5e7eb", padding: "32px 24px", marginTop: 60 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#2563eb", marginBottom: 4 }}>InternAsia</div>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>Internship listings across Hong Kong, Singapore, Japan, South Korea & Taiwan</p>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { href: "/internships", label: "Browse" },
                { href: "/alerts",     label: "Job Alerts" },
                { href: "/resources",  label: "Resources" },
                { href: "/advertise",  label: "Advertise" },
                { href: "/post-job",   label: "Post a Job" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: "#6b7280", fontSize: 13 }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import Link from "next/link";
