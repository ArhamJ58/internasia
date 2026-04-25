import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://internasia.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "InternAsia — Real-time Internship Alerts for Asia",
    template: "%s | InternAsia",
  },
  description:
    "Find internships in Hong Kong, Singapore, Japan, South Korea and Taiwan. Get instant email alerts the moment a matching role is posted.",
  keywords: [
    "internship hong kong", "internship singapore", "internship japan",
    "asia internship", "internship alert", "real-time internship",
    "graduate job asia", "student internship hk sg jp",
  ],
  openGraph: {
    title: "InternAsia — Real-time Internship Alerts for Asia",
    description: "Scraped every 6 hours. Get emailed the instant a matching internship goes live.",
    type: "website",
    url: BASE_URL,
    siteName: "InternAsia",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "InternAsia — Real-time internship aggregator for Asia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "InternAsia — Real-time Internship Alerts for Asia",
    description: "Scraped every 6 hours. Get emailed the instant a matching internship goes live.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer style={{ borderTop: "1px solid var(--border)", marginTop: "80px", padding: "48px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--gold)", marginBottom: 6 }}>
                InternAsia
              </div>
              <p style={{ color: "var(--text-3)", fontSize: 13, margin: 0 }}>
                Real-time internship aggregator for Asia · Scraped every 6 hours
              </p>
              <p style={{ color: "var(--text-3)", fontSize: 12, margin: "4px 0 0" }}>
                © {new Date().getFullYear()} · Sources: JobsDB, MyCareersFuture, Wantedly, Indeed
              </p>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "16px 32px" }}>
              {[
                { href: "/internships",  label: "Browse" },
                { href: "/alerts",       label: "Set Alert" },
                { href: "/resources",    label: "Resources" },
                { href: "/advertise",    label: "Advertise" },
                { href: "/post-job",     label: "Post a Job" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{ color: "var(--text-3)", fontSize: 13, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
