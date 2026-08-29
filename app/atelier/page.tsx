import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Gemstone from '@/components/Gemstone';
import { Reveal, Parallax } from '@/components/Motion';
import { SectionHeading, ContactCta } from '@/components/Sections';
import { craft, services } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Atelier',
  description:
    'Selection, design, setting and finish — how a piece is made at the Saii Jewels atelier in Higashi-Ueno, Tokyo.',
};

export default function AtelierPage() {
  return (
    <>
      <PageHeader eyebrow="Craft" title="The Atelier" lede={craft.intro} />

      {/* ── The four stages, as a vertical spine ───────────── */}
      <section className="bg-ivory py-32">
        <div className="shell">
          <SectionHeading
            eyebrow="Process"
            title={
              <>
                Four stages,
                <br />
                <span className="italic">one pair of hands</span>
              </>
            }
          />

          <ol className="mt-24 space-y-0">
            {craft.steps.map((step, i) => (
              <li key={step.n}>
                <Reveal delay={i * 90}>
                  <div className="group grid gap-8 border-t border-ivory-300 py-14 md:grid-cols-[7rem_1fr_1fr] md:gap-14">
                    <span className="display text-6xl leading-none text-ivory-300 transition-colors duration-700 group-hover:text-gold/50">
                      {step.n}
                    </span>

                    <h2 className="font-display text-3xl font-normal text-onyx transition-colors duration-500 group-hover:text-gold-deep">
                      {step.title}
                    </h2>

                    <p className="max-w-lg font-sans text-base leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Materials ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-onyx py-32">
        <Parallax
          speed={0.09}
          className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2"
        >
          <Gemstone cut="marquise" tint="#F0D34E" className="h-[36rem] w-[36rem] opacity-[0.14]" />
        </Parallax>

        <div className="shell relative">
          <SectionHeading
            dark
            eyebrow="Materials"
            title={
              <>
                What we will
                <br />
                <span className="italic text-lustre">and will not use</span>
              </>
            }
          />

          <div className="mt-20 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: 'Platinum 900 / 950',
                b: 'The default for diamond settings. Dense, unreactive, and it holds a claw where gold would eventually tire.',
              },
              {
                t: '18k yellow, white & rose',
                b: 'Alloyed for colour and for wear. White gold is rhodium-finished on request, though we will say when a piece is better in platinum.',
              },
              {
                t: 'Diamonds',
                b: 'Bought loose and viewed in daylight before anything is designed around them. Certification supplied where the stone carries it.',
              },
              {
                t: 'Coloured gemstones',
                b: 'Sapphire, ruby, emerald and the finer semi-precious stones, selected for colour first and size second.',
              },
              {
                t: 'No hollow shanks',
                b: 'A ring should have metal where the wear is. We do not thin a shank to make a stone look larger.',
              },
              {
                t: 'No glued settings',
                b: 'Every stone is held mechanically — claw, bezel, channel or grain. Nothing in a Saii piece depends on adhesive.',
              },
            ].map((m, i) => (
              <Reveal key={m.t} delay={i * 70}>
                <div className="h-full bg-onyx-800 p-9 transition-colors duration-500 hover:bg-onyx-700">
                  <h3 className="font-display text-xl font-normal text-gold">{m.t}</h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-ivory/50">{m.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────── */}
      <section className="bg-ivory py-32">
        <div className="shell">
          <SectionHeading align="center" eyebrow="Commissions" title="How to work with us" />
          <div className="mt-20 grid gap-8 sm:grid-cols-2">
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

      <ContactCta />
    </>
  );
}
