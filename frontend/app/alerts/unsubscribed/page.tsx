import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Unsubscribed" };

export default function UnsubscribedPage() {
  return (
    <div style={{ maxWidth: 520, margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>👋</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--text)", margin: "0 0 14px" }}>
        You've been unsubscribed.
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
        You won't receive any more alerts from InternAsia. You can always come back
        and set up a new one.
      </p>
      <Link href="/" className="btn-outline-gold" style={{ fontSize: 14 }}>
        Back to Home
      </Link>
    </div>
  );
}
