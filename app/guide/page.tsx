import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import FourCs from '@/components/FourCs';
import Gemstone from '@/components/Gemstone';
import { Reveal } from '@/components/Motion';
import { SectionHeading, ContactCta } from '@/components/Sections';
import { collections } from '@/lib/content';
import {
  guideIntro,
  guideSections,
  grown,
  certification,
  metals,
  sizing,
  care,
} from '@/lib/guide';

export const metadata: Metadata = {
  title: 'Diamond Guide',
  description:
    'How diamonds are graded, grown, certified and sized — the four Cs, laboratory and mined stones, reading a grading report, metals, Japanese ring sizing and care.',
};

export default function GuidePage() {
  return (
    <>
      <PageHeader eyebrow="Buyer’s guide" title="Knowing a stone" lede={guideIntro}>
        <Reveal delay={520}>
          <nav aria-label="Guide sections" className="mt-12 flex flex-wrap gap-x-7 gap-y-3">
            {guideSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="link-rule font-sans text-[0.66rem] uppercase tracking-wide2 text-ivory/45 transition-colors duration-500 hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </PageHeader>

      {/* ── The four Cs ────────────────────────────────────── */}
      <section id="four-cs" className="scroll-mt-24 bg-onyx py-32">
        <div className="shell">
          <SectionHeading
            dark
            eyebrow="01 · Grading"
            title={
              <>
                The four <span className="italic text-lustre">Cs</span>
              </>
            }
            lede="Four properties account for nearly all of the difference in price between two stones of the same shape. Only one of them was decided by a person."
          />
          <div className="mt-20">
            <FourCs />
          </div>
        </div>
      </section>

      {/* ── Shapes ─────────────────────────────────────────── */}
      <section id="shapes" className="scroll-mt-24 bg-ivory py-32">
        <div className="shell">
          <SectionHeading
            eyebrow="02 · Shapes"
            title={
              <>
                What each cut
                <br />
                <span className="italic">asks of a setting</span>
              </>
            }
            lede="Shape is the first thing anyone chooses and the last thing they should worry about. These are the four we work in most."
          />

          <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c, i) => (
              <Reveal key={c.slug} delay={i * 90}>
                <Link href={`/collections#${c.slug}`} className="group block">
                  <div
                    className="relative flex aspect-square items-center justify-center overflow-hidden"
                    style={{
                      background: `radial-gradient(110% 90% at 50% 35%, ${c.accent}30 0%, transparent 62%), #141416`,
                    }}
                  >
                    <Gemstone
                      cut={c.stone}
                      tint={c.accent}
                      className="h-[58%] w-[58%] transition-transform duration-[1200ms] ease-silk group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-xl text-onyx transition-colors duration-500 group-hover:text-gold-deep">
                    {c.name}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{c.caption}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grown and mined ────────────────────────────────── */}
      <section id="grown" className="scroll-mt-24 bg-onyx py-32">
        <div className="shell">
          <SectionHeading dark eyebrow="03 · Origin" title={grown.title} lede={grown.lede} />

          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            {grown.methods.map((m, i) => (
              <Reveal key={m.abbr} delay={i * 100}>
                <div className="h-full border border-ivory/12 p-10">
                  <p className="font-display text-4xl text-gold">{m.abbr}</p>
                  <h3 className="mt-3 font-sans text-[0.68rem] uppercase tracking-wide2 text-ivory/60">
                    {m.name}
                  </h3>
                  <p className="mt-6 font-sans text-sm leading-relaxed text-ivory/50">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Comparison table */}
          <Reveal delay={120}>
            <div className="mt-16 overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left">
                <caption className="sr-only">
                  Laboratory-grown diamonds compared with mined diamonds
                </caption>
                <thead>
                  <tr className="border-b border-ivory/20">
                    {['', 'Mined', 'Laboratory-grown'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="py-4 pr-6 font-sans text-[0.62rem] uppercase tracking-luxe text-gold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grown.comparison.map((row) => (
                    <tr key={row.property} className="border-b border-ivory/10">
                      <th
                        scope="row"
                        className="py-4 pr-6 font-sans text-sm font-normal text-ivory/45"
                      >
                        {row.property}
                      </th>
                      <td className="py-4 pr-6 font-sans text-sm text-ivory/75">{row.mined}</td>
                      <td className="py-4 font-sans text-sm text-ivory/75">{row.lab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-14 max-w-3xl border-l border-gold/50 pl-7 font-display text-xl italic leading-relaxed text-gold/90">
              {grown.position}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Certification ──────────────────────────────────── */}
      <section id="certification" className="scroll-mt-24 bg-ivory py-32">
        <div className="shell">
          <SectionHeading
            eyebrow="04 · Paperwork"
            title={certification.title}
            lede={certification.lede}
          />

          <div className="mt-20 grid gap-16 lg:grid-cols-[0.85fr_1fr]">
            <div>
              <h3 className="eyebrow">Laboratories</h3>
              <ul className="mt-7 space-y-7">
                {certification.labs.map((l, i) => (
                  <Reveal key={l.abbr} delay={i * 80}>
                    <li>
                      <p className="font-display text-2xl text-onyx">{l.abbr}</p>
                      <p className="mt-1 font-sans text-sm text-muted">{l.name}</p>
                      <p className="mt-1.5 font-sans text-sm text-gold-deep">{l.note}</p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow">What is on the page</h3>
              <dl className="mt-7 divide-y divide-ivory-300 border-y border-ivory-300">
                {certification.reading.map((r, i) => (
                  <Reveal key={r.field} delay={i * 60}>
                    <div className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                      <dt className="font-sans text-sm text-onyx">{r.field}</dt>
                      <dd className="font-sans text-sm leading-relaxed text-muted">{r.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metals ─────────────────────────────────────────── */}
      <section id="metals" className="scroll-mt-24 bg-onyx py-32">
        <div className="shell">
          <SectionHeading
            dark
            eyebrow="05 · Metal"
            title={
              <>
                What holds
                <br />
                <span className="italic text-lustre">the stone</span>
              </>
            }
          />
          <div className="mt-20 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {metals.map((m, i) => (
              <Reveal key={m.name} delay={i * 70}>
                <div className="h-full bg-onyx-800 p-9 transition-colors duration-500 hover:bg-onyx-700">
                  <h3 className="font-display text-xl text-gold">{m.name}</h3>
                  <p className="mt-1 font-jp text-[0.62rem] tracking-wide2 text-ivory/35">{m.ja}</p>
                  <p className="mt-5 font-sans text-sm leading-relaxed text-ivory/50">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ring size ──────────────────────────────────────── */}
      <section id="sizing" className="scroll-mt-24 bg-ivory-200 py-32">
        <div className="shell">
          <SectionHeading eyebrow="06 · Fit" title={sizing.title} lede={sizing.lede} />

          <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">
                    Japanese ring sizes with inner circumference and approximate US equivalents
                  </caption>
                  <thead>
                    <tr className="border-b border-ivory-300">
                      {['JP size', 'Inner circumference', 'US (approx.)'].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="py-4 pr-6 font-sans text-[0.62rem] uppercase tracking-luxe text-gold-deep"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizing.table.map((r) => (
                      <tr
                        key={r.jp}
                        className="border-b border-ivory-300 transition-colors duration-300 hover:bg-ivory/70"
                      >
                        <th scope="row" className="py-3.5 pr-6 font-display text-xl font-normal text-onyx">
                          {r.jp}
                        </th>
                        <td className="py-3.5 pr-6 font-sans text-sm text-muted">{r.mm} mm</td>
                        <td className="py-3.5 font-sans text-sm text-muted">{r.us}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <div>
              <h3 className="eyebrow">Getting it right</h3>
              <ul className="mt-7 space-y-6">
                {sizing.notes.map((n, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <li className="flex gap-5">
                      <span className="mt-2.5 h-px w-6 shrink-0 bg-gold-deep/50" />
                      <span className="font-sans text-sm leading-relaxed text-muted">{n}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={340}>
                <p className="mt-10 border-l border-gold-deep/40 pl-6 font-display text-lg italic leading-relaxed text-onyx">
                  {sizing.cta}
                </p>
                <Link href="/contact" className="btn-ghost mt-8">
                  Book a sizing
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Care ───────────────────────────────────────────── */}
      <section id="care" className="scroll-mt-24 bg-ivory py-32">
        <div className="shell">
          <SectionHeading
            align="center"
            eyebrow="07 · Care"
            title={
              <>
                Looking after it
                <br />
                <span className="italic">for fifty years</span>
              </>
            }
          />
          <div className="mt-20 grid gap-8 sm:grid-cols-2">
            {care.map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="group relative h-full border border-ivory-300 p-10 transition-colors duration-500 hover:border-gold/60">
                  <h3 className="font-display text-2xl text-onyx">{c.title}</h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{c.body}</p>
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-silk group-hover:scale-x-100" />
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
