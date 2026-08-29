import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import FourCs from '@/components/FourCs';
import Gemstone from '@/components/Gemstone';
import Contents from '@/components/Contents';
import { Reveal } from '@/components/Motion';
import { ContactCta } from '@/components/Sections';
import {
  educationIntro,
  sections,
  shapes,
  origin,
  certification,
  metals,
  sizing,
  care,
} from '@/lib/education';

export const metadata: Metadata = {
  title: 'Education',
  description:
    'How diamonds are graded, grown, certified and sized — the four Cs, shapes, natural and laboratory-grown stones, reading a certificate, metals, Japanese ring sizing and care.',
};

/**
 * A reference page, so it is built as one: a single light ground, a sticky
 * contents rail, and one consistent heading rhythm all the way down. Only the
 * four Cs gets a dark panel, because it is the part people come for.
 */
function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-ivory-300 pt-14 first:border-t-0 first:pt-0">
      <Reveal>
        <h2 className="display text-[clamp(1.9rem,3.6vw,2.8rem)] text-onyx">{title}</h2>
        {lede && (
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted">{lede}</p>
        )}
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function EducationPage() {
  return (
    <>
      <PageHeader eyebrow="Education" title="Knowing a stone" lede={educationIntro} />

      <div className="bg-ivory py-24">
        <div className="shell grid gap-14 lg:grid-cols-[13rem_1fr] lg:gap-20">
          <Contents sections={sections} />

          <div className="min-w-0 space-y-16">
            {/* ── The four Cs ──────────────────────────────── */}
            <Section
              id="four-cs"
              title="The four Cs"
              lede="Four properties account for nearly all of the price difference between two stones of the same shape. Only one of them was decided by a person."
            >
              <div className="bg-onyx p-8 sm:p-12">
                <FourCs />
              </div>
            </Section>

            {/* ── Shapes ───────────────────────────────────── */}
            <Section
              id="shapes"
              title="Shapes"
              lede="Shape is the first thing anyone chooses. Each one asks something different of the stone behind it."
            >
              <div className="space-y-10">
                {shapes.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 70}>
                    <div className="grid gap-6 sm:grid-cols-[9rem_1fr] sm:gap-9">
                      <div
                        className="flex aspect-square items-center justify-center"
                        style={{
                          background: `radial-gradient(110% 90% at 50% 35%, ${s.accent}30 0%, transparent 62%), #141416`,
                        }}
                      >
                        <Gemstone cut={s.cut} tint={s.accent} className="h-[62%] w-[62%]" />
                      </div>
                      <div>
                        <p className="font-jp text-[0.62rem] tracking-wide2 text-gold-deep">
                          {s.nameJa}
                        </p>
                        <h3 className="mt-1.5 font-display text-2xl text-onyx">{s.name}</h3>
                        <p className="mt-1 font-display text-lg italic text-gold-deep">
                          {s.caption}
                        </p>
                        <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Section>

            {/* ── Natural and laboratory-grown ─────────────── */}
            <Section id="origin" title={origin.title} lede={origin.lede}>
              <div className="grid gap-6 sm:grid-cols-2">
                {origin.methods.map((m, i) => (
                  <Reveal key={m.abbr} delay={i * 80}>
                    <div className="h-full border border-ivory-300 p-8">
                      <p className="font-display text-3xl text-gold-deep">{m.abbr}</p>
                      <h3 className="mt-2 font-sans text-[0.66rem] uppercase tracking-wide2 text-muted">
                        {m.name}
                      </h3>
                      <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{m.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={120}>
                <div className="mt-10 overflow-x-auto">
                  <table className="w-full min-w-[38rem] border-collapse text-left">
                    <caption className="sr-only">
                      Laboratory-grown diamonds compared with natural diamonds
                    </caption>
                    <thead>
                      <tr className="border-b border-ivory-300">
                        {['', 'Natural', 'Laboratory-grown'].map((h) => (
                          <th
                            key={h}
                            scope="col"
                            className="py-3.5 pr-6 font-sans text-[0.6rem] uppercase tracking-luxe text-gold-deep"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {origin.comparison.map((row) => (
                        <tr key={row.property} className="border-b border-ivory-300">
                          <th
                            scope="row"
                            className="py-3.5 pr-6 font-sans text-sm font-normal text-muted"
                          >
                            {row.property}
                          </th>
                          <td className="py-3.5 pr-6 font-sans text-sm text-onyx">{row.mined}</td>
                          <td className="py-3.5 font-sans text-sm text-onyx">{row.lab}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-9 border-l border-gold-deep/40 pl-6 font-display text-lg italic leading-relaxed text-onyx">
                  {origin.position}
                </p>
              </Reveal>
            </Section>

            {/* ── Certificates ─────────────────────────────── */}
            <Section id="certificates" title={certification.title} lede={certification.lede}>
              <Reveal>
                <div className="flex flex-wrap gap-2.5">
                  {certification.labs.map((l) => (
                    <span
                      key={l.abbr}
                      title={l.name}
                      className="border border-ivory-300 px-5 py-2.5 font-sans text-[0.66rem] uppercase tracking-wide2 text-muted"
                    >
                      <span className="text-gold-deep">{l.abbr}</span>
                      <span className="mx-2 text-ivory-300">·</span>
                      {l.note}
                    </span>
                  ))}
                </div>
              </Reveal>

              <dl className="mt-10 divide-y divide-ivory-300 border-y border-ivory-300">
                {certification.reading.map((r, i) => (
                  <Reveal key={r.field} delay={i * 50}>
                    <div className="grid gap-1.5 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                      <dt className="font-sans text-sm text-onyx">{r.field}</dt>
                      <dd className="font-sans text-sm leading-relaxed text-muted">{r.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </Section>

            {/* ── Metals ───────────────────────────────────── */}
            <Section
              id="metals"
              title="Metals"
              lede="What holds the stone, and how each behaves over a lifetime of wear."
            >
              <dl className="divide-y divide-ivory-300 border-y border-ivory-300">
                {metals.map((m, i) => (
                  <Reveal key={m.name} delay={i * 50}>
                    <div className="grid gap-1.5 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                      <dt>
                        <span className="block font-sans text-sm text-onyx">{m.name}</span>
                        <span className="mt-0.5 block font-jp text-[0.6rem] tracking-wide2 text-muted">
                          {m.ja}
                        </span>
                      </dt>
                      <dd className="font-sans text-sm leading-relaxed text-muted">{m.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </Section>

            {/* ── Ring size ────────────────────────────────── */}
            <Section id="sizing" title={sizing.title} lede={sizing.lede}>
              <div className="grid gap-12 lg:grid-cols-2">
                <Reveal>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <caption className="sr-only">
                        Japanese ring sizes with inner circumference and approximate US
                        equivalents
                      </caption>
                      <thead>
                        <tr className="border-b border-ivory-300">
                          {['JP', 'Circumference', 'US (approx.)'].map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="py-3 pr-6 font-sans text-[0.6rem] uppercase tracking-luxe text-gold-deep"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        {sizing.table.map((r) => (
                          <tr key={r.jp} className="border-b border-ivory-300">
                            <th
                              scope="row"
                              className="py-2.5 pr-6 font-display text-lg font-normal text-onyx"
                            >
                              {r.jp}
                            </th>
                            <td className="py-2.5 pr-6 font-sans text-sm text-muted">{r.mm} mm</td>
                            <td className="py-2.5 font-sans text-sm text-muted">{r.us}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>

                <div>
                  <ul className="space-y-5">
                    {sizing.notes.map((n, i) => (
                      <Reveal key={i} delay={i * 60}>
                        <li className="flex gap-5">
                          <span className="mt-2.5 h-px w-5 shrink-0 bg-gold-deep/50" />
                          <span className="font-sans text-sm leading-relaxed text-muted">{n}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                  <Reveal delay={280}>
                    <p className="mt-8 border-l border-gold-deep/40 pl-6 font-display text-lg italic leading-relaxed text-onyx">
                      {sizing.cta}
                    </p>
                    <Link href="/contact" className="btn-ghost mt-7">
                      Book an appointment
                    </Link>
                  </Reveal>
                </div>
              </div>
            </Section>

            {/* ── Care ─────────────────────────────────────── */}
            <Section
              id="care"
              title="Care"
              lede="Four things that keep a piece looking the way it did on the day it was bought."
            >
              <dl className="divide-y divide-ivory-300 border-y border-ivory-300">
                {care.map((c, i) => (
                  <Reveal key={c.title} delay={i * 50}>
                    <div className="grid gap-1.5 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                      <dt className="font-sans text-sm text-onyx">{c.title}</dt>
                      <dd className="font-sans text-sm leading-relaxed text-muted">{c.body}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </Section>
          </div>
        </div>
      </div>

      <ContactCta />
    </>
  );
}
