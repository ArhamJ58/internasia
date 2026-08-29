import Link from 'next/link';
import Hero from '@/components/Hero';
import Gemstone from '@/components/Gemstone';
import { Reveal, Parallax } from '@/components/Motion';
import {
  SectionHeading,
  Marks,
  CollectionsPreview,
  QuoteBand,
  ContactCta,
} from '@/components/Sections';
import { craft, heritage, services } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marks />

      {/* ── Opening statement ──────────────────────────────── */}
      <section className="bg-ivory py-32">
        <div className="shell grid gap-20 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="The house"
              title={
                <>
                  Made where Tokyo
                  <br />
                  <span className="italic">keeps its stones</span>
                </>
              }
              lede={heritage.lede}
            />
            <Reveal delay={220}>
              <p className="mt-7 max-w-xl font-sans text-base leading-relaxed text-muted">
                {heritage.paragraphs[0]}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Link href="/heritage" className="btn-ghost mt-10">
                Read the heritage
              </Link>
            </Reveal>
          </div>

          <Parallax speed={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-onyx">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(100% 80% at 50% 20%, rgba(219,179,0,0.14) 0%, transparent 60%)',
                }}
              />
              <Gemstone
                cut="emerald"
                tint="#CFE6D8"
                className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-sans text-[0.6rem] uppercase tracking-luxe text-gold">
                  Higashi-Ueno · Taito-ku
                </p>
                <p className="mt-2 font-display text-2xl font-light text-ivory">
                  The Okachimachi quarter
                </p>
              </div>
            </div>
            {/* Thin gold frame offset behind the panel. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-5 -right-5 -z-10 h-full w-full border border-gold/30"
            />
          </Parallax>
        </div>
      </section>

      <CollectionsPreview />

      {/* ── Craft steps ────────────────────────────────────── */}
      <section className="bg-ivory py-32">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="Craft"
            title={
              <>
                From loose stone
                <br />
                <span className="italic">to finished piece</span>
              </>
            }
            lede={craft.intro}
          />

          <div className="mt-24 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {craft.steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 110}>
                <div className="group relative">
                  <span className="display text-6xl text-ivory-300 transition-colors duration-700 group-hover:text-gold/45">
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-normal text-onyx">
                    {step.title}
                  </h3>
                  <span className="mt-5 block h-px w-12 bg-gold-deep/35 transition-all duration-700 ease-silk group-hover:w-24 group-hover:bg-gold" />
                  <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand text={heritage.quote.text} attribution={heritage.quote.attribution} />

      {/* ── Services ───────────────────────────────────────── */}
      <section className="bg-ivory py-32">
        <div className="shell">
          <SectionHeading eyebrow="What we do" title="Services" />
          <div className="mt-20 divide-y divide-ivory-300 border-y border-ivory-300">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="group grid gap-4 py-9 transition-colors duration-500 hover:bg-ivory-200/60 sm:grid-cols-[0.4fr_1fr] sm:gap-10 sm:px-4">
                  <h3 className="font-display text-2xl font-normal text-onyx transition-colors duration-500 group-hover:text-gold-deep">
                    {s.title}
                  </h3>
                  <p className="max-w-xl font-sans text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
