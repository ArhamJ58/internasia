import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Monogram from '@/components/Monogram';
import { Reveal, Parallax } from '@/components/Motion';
import { SectionHeading, QuoteBand, ContactCta } from '@/components/Sections';
import { company, about, quarter, services } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Saii Jewels trades from Okachimachi, the Tokyo quarter where the country buys and sells its stones — wholesale to the trade, retail to private clients.',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="The house" title={about.title} lede={about.lede} />

      {/* ── Narrative ──────────────────────────────────────── */}
      <section className="bg-ivory py-28">
        <div className="shell grid gap-20 lg:grid-cols-[1fr_0.8fr]">
          <div className="max-w-2xl">
            {about.paragraphs.map((p, i) => (
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

          {/* Leadership */}
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
                  {company.legalName} is run from the Higashi-Ueno office, where stones are shown
                  in daylight and buyers are seen by appointment.
                </p>
              </aside>
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* ── The quarter ────────────────────────────────────── */}
      <section className="bg-onyx py-28">
        <div className="shell">
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
            lede={quarter.lede}
          />

          <div className="mt-20 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {quarter.points.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full bg-onyx-800 p-9 transition-colors duration-500 hover:bg-onyx-700">
                  <h3 className="font-display text-xl font-normal text-ivory">{c.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ivory/45">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────── */}
      <section className="bg-ivory py-28">
        <div className="shell">
          <SectionHeading eyebrow="What we do" title="Trade and retail" />
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="group relative h-full border border-ivory-300 p-10 transition-colors duration-500 hover:border-gold/60">
                  <h3 className="font-display text-2xl font-normal text-onyx">{s.title}</h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{s.body}</p>
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-silk group-hover:scale-x-100" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand text={about.quote.text} attribution={about.quote.attribution} />
      <ContactCta />
    </>
  );
}
