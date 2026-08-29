import Link from 'next/link';
import { company, nav, services } from '@/lib/content';
import Monogram from './Monogram';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-onyx text-ivory">
      {/* Oversized monogram bled off the bottom edge as a watermark. */}
      <Monogram
        className="pointer-events-none absolute -bottom-24 -right-10 h-[26rem] w-auto text-gold/[0.05]"
        title=""
      />

      <div className="shell relative py-24">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Monogram className="h-14 w-auto text-gold" />
            <p className="mt-7 font-display text-3xl font-light leading-tight text-ivory">
              {company.tagline}
            </p>
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-ivory/55">
              A jewellery house in Okachimachi, Tokyo — supplying loose diamonds, coloured
              gemstones and finished jewellery.
            </p>
          </div>

          <div>
            <h2 className="eyebrow-on-dark">Explore</h2>
            <ul className="mt-6 space-y-3.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-rule font-sans text-sm text-ivory/70 transition-colors duration-500 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow-on-dark mt-10">Services</h2>
            <ul className="mt-6 space-y-3 font-sans text-sm text-ivory/55">
              {services.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow-on-dark">Office</h2>
            <address className="mt-6 not-italic font-sans text-sm leading-relaxed text-ivory/70">
              {company.address.room}
              <br />
              {company.address.street}
              <br />
              {company.address.city} {company.address.postalCode}, {company.address.country}
              <br />
              <span className="mt-2 block font-jp text-xs text-ivory/40">{company.address.ja}</span>
            </address>

            <dl className="mt-7 space-y-2.5 font-sans text-sm">
              <div className="flex gap-3">
                <dt className="w-14 shrink-0 text-ivory/35">Tel</dt>
                <dd>
                  <a
                    href={`tel:${company.tel.replace(/-/g, '')}`}
                    className="link-rule text-ivory/75 hover:text-gold"
                  >
                    {company.tel}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-14 shrink-0 text-ivory/35">Fax</dt>
                <dd className="text-ivory/75">{company.fax}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-14 shrink-0 text-ivory/35">Mobile</dt>
                <dd>
                  <a
                    href={`tel:${company.mobile.replace(/-/g, '')}`}
                    className="link-rule text-ivory/75 hover:text-gold"
                  >
                    {company.mobile}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-14 shrink-0 text-ivory/35">Mail</dt>
                <dd>
                  <a
                    href={`mailto:${company.email}`}
                    className="link-rule text-ivory/75 hover:text-gold"
                  >
                    {company.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-ivory/40">
            © {year} {company.legalName}
            <span className="mx-2 text-ivory/20">·</span>
            <span className="font-jp">{company.legalNameJa}</span>
          </p>
          <p className="font-sans text-xs tracking-wide2 text-ivory/40">
            {company.president.name}, {company.president.title}
          </p>
        </div>
      </div>
    </footer>
  );
}
