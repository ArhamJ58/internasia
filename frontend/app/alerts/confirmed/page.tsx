import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Alert Confirmed" };

export default function AlertConfirmedPage() {
  return (
    <div style={{ maxWidth: 560, margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text)", margin: "0 0 16px" }}>
        Alert Activated!
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.7, margin: "0 0 36px" }}>
        You're all set. We'll email you the moment a matching internship goes live.
        No spam — only real matches for your filters.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/internships" className="btn-gold" style={{ fontSize: 15, padding: "12px 26px" }}>
          Browse Listings →
        </Link>
        <Link href="/alerts" className="btn-outline-gold" style={{ fontSize: 15, padding: "12px 24px" }}>
          Set Another Alert
        </Link>
      </div>
    </div>
  );
}
