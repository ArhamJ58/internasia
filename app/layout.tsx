import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Sans_JP } from 'next/font/google';
import { company } from '@/lib/content';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  // Italic is load-bearing here — the hero, the section headings and the pull
  // quotes all use it — so the real italics are loaded rather than letting the
  // browser slant the upright faces.
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.legalName} — ${company.tagline}`,
    template: `%s — ${company.name}`,
  },
  description:
    'Saii Jewels is a Tokyo jewellery house in Higashi-Ueno, working in diamonds, coloured gemstones and precious metal. Bespoke commissions, bridal and loose stones.',
  keywords: [
    'Saii Jewels',
    'Tokyo jewellery',
    'Okachimachi',
    'Higashi-Ueno',
    'diamonds',
    'bespoke jewellery Japan',
  ],
  openGraph: {
    title: `${company.legalName} — ${company.tagline}`,
    description: 'A Tokyo jewellery house in Higashi-Ueno. Diamonds, coloured gemstones, and work finished by hand.',
    url: company.url,
    siteName: company.legalName,
    locale: 'en_JP',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/brand/monogram.svg', type: 'image/svg+xml' }],
  },
};

/** Organization schema so search engines read the real company details. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: company.legalName,
  alternateName: company.legalNameJa,
  slogan: company.tagline,
  url: company.url,
  email: company.email,
  telephone: `+81-${company.tel.replace(/^0/, '').replace(/-/g, '-')}`,
  faxNumber: company.fax,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${company.address.room}, ${company.address.street}`,
    addressLocality: company.address.city,
    postalCode: company.address.postalCode,
    addressCountry: 'JP',
  },
  founder: { '@type': 'Person', name: company.president.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${jp.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
                     focus:bg-onyx focus:px-5 focus:py-3 focus:text-ivory"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
