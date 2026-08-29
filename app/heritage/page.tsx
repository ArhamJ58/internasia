import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Monogram from '@/components/Monogram';
import Gemstone from '@/components/Gemstone';
import { Reveal, Parallax } from '@/components/Motion';
import { SectionHeading, QuoteBand, ContactCta } from '@/components/Sections';
import { company, heritage } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Heritage',
  description:
    'Saii Jewels works from Okachimachi, the Tokyo quarter where the city has traded stones for generations.',
};

export default function HeritagePage() {
  return (
    <>
      <PageHeader eyebrow="The house" title={heritage.title} lede={heritage.lede} />

      {/* ── Narrative ──────────────────────────────────────── */}
      <section className="bg-ivory py-32">
        <div className="shell grid gap-20 lg:grid-cols-[1fr_0.8fr]">
          <div className="max-w-2xl">
            {heritage.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 110}>
                <p
                  className={
                    i === 0
                      ? 'font-display text-2xl font-light leading-relaxed text-onyx'
                      : 'mt-8 font-sans text-base leading-relaxed text-muted'
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Leadership card */}
          <Parallax speed={0.06}>
            <Reveal delay={160}>
              <aside className="border border-ivory-300 bg-ivory-200/50 p-10">
                <Monogram className="h-12 w-auto text-gold-deep" title="" />
                <p className="eyebrow mt-8">Leadership</p>
                <p className="mt-4 font-display text-3xl font-light text-onyx">
                  {company.president.name}
                </p>
                <p className="mt-1 font-jp text-sm text-muted">{company.president.nameJa}</p>
                <p className="mt-4 font-sans text-[0.66rem] uppercase tracking-wide2 text-gold-deep">
                  {company.president.title}
                  <span className="mx-2 text-muted/40">·</span>
                  <span className="font-jp">{company.president.titleJa}</span>
                </p>
                <hr className="my-8" />
                <p className="font-sans text-sm leading-relaxed text-muted">
                  {company.legalName} is directed from the Higashi-Ueno atelier, where commissions
                  are taken in person and stones are shown in daylight.
                </p>
              </aside>
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* ── The quarter ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-onyx py-32">
        <Parallax
          speed={0.08}
          className="pointer-events-none absolute -left-40 top-1/3 hidden lg:block"
        >
          <Gemstone cut="pear" tint="#F0D34E" className="h-[34rem] w-[34rem] opacity-[0.13]" />
        </Parallax>

        <div className="shell relative">
          <SectionHeading
            dark
            eyebrow="Okachimachi"
            title={
              <>
                The trade sits
                <br />
                <span className="italic text-lustre">within a few blocks</span>
              </>
            }
            lede="Higashi-Ueno concentrates in walking distance what most cities spread across a country — and that proximity is the reason a small house can work to this standard."
          />

          <div className="mt-20 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Stone dealers', b: 'Loose diamonds and coloured stones, viewed and negotiated in person.' },
              { t: 'Casters', b: 'Wax and metal turned around in days rather than weeks.' },
              { t: 'Setters', b: 'Specialists for claw, bezel, pavé and channel work.' },
              { t: 'Polishers', b: 'The last hands on a piece, and often the most exacting.' },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 80}>
                <div className="h-full bg-onyx-800 p-9 transition-colors duration-500 hover:bg-onyx-700">
                  <p className="font-sans text-[0.6rem] uppercase tracking-luxe text-gold/70">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-5 font-display text-xl font-normal text-ivory">{c.t}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ivory/45">{c.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand text={heritage.quote.text} attribution={heritage.quote.attribution} />
      <ContactCta />
    </>
  );
}
