import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PieceVisual from '@/components/PieceVisual';
import Monogram from '@/components/Monogram';
import { Reveal } from '@/components/Motion';
import { PriceLabel } from '@/components/PieceGrid';
import { pieces, priceNote } from '@/lib/pieces';
import { company } from '@/lib/content';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const piece = pieces.find((p) => p.slug === slug);
  if (!piece) return {};
  return {
    title: piece.name,
    description: `${piece.name} — ${piece.caption}. Made to order at the Saii Jewels atelier in Higashi-Ueno, Tokyo.`,
  };
}

export default async function PiecePage({ params }: Params) {
  const { slug } = await params;
  const piece = pieces.find((p) => p.slug === slug);
  if (!piece) notFound();

  const others = pieces.filter((p) => p.slug !== piece.slug).slice(0, 3);

  const enquiry = `mailto:${company.email}?subject=${encodeURIComponent(
    `Enquiry — ${piece.name} (${piece.ref})`,
  )}&body=${encodeURIComponent(
    `I would like to enquire about the ${piece.name} (${piece.ref}).\n\nStone shape:\nApproximate weight:\nBudget in mind:\nRing size, if known:\n\n`,
  )}`;

  return (
    <>
      <article className="bg-ivory pt-32">
        <div className="shell">
          <Reveal>
            <nav aria-label="Breadcrumb" className="py-8">
              <ol className="flex items-center gap-3 font-sans text-[0.62rem] uppercase tracking-wide2 text-muted">
                <li>
                  <Link href="/pieces" className="link-rule hover:text-gold-deep">
                    Pieces
                  </Link>
                </li>
                <li aria-hidden="true" className="text-ivory-300">
                  /
                </li>
                <li className="text-onyx">{piece.name}</li>
              </ol>
            </nav>
          </Reveal>

          <div className="grid gap-16 pb-24 lg:grid-cols-2 lg:gap-20">
            {/* Stone */}
            <Reveal>
              <div
                className="relative flex aspect-square items-center justify-center overflow-hidden lg:sticky lg:top-28"
                style={{
                  background: `radial-gradient(110% 90% at 50% 35%, ${piece.accent}30 0%, transparent 62%), #141416`,
                }}
              >
                <PieceVisual
                  piece={piece}
                  size={60}
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <span className="absolute left-7 top-7 font-sans text-[0.6rem] tracking-luxe text-ivory/30">
                  {piece.ref}
                </span>
              </div>
            </Reveal>

            {/* Detail */}
            <div>
              <Reveal>
                <p className="font-jp text-[0.66rem] tracking-wide2 text-gold-deep">
                  {piece.nameJa}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="display mt-3 text-[clamp(2.4rem,5vw,3.8rem)] text-onyx">
                  {piece.name}
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-4 font-display text-xl italic text-gold-deep">{piece.caption}</p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap items-center gap-6 border-y border-ivory-300 py-6">
                  <PriceLabel
                    priceFrom={piece.priceFrom}
                    className="font-display text-2xl text-onyx"
                  />
                  <a href={enquiry} className="btn-solid">
                    Enquire about this piece
                  </a>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <div className="mt-10 space-y-6">
                  {piece.body.map((p, i) => (
                    <p key={i} className="font-sans text-base leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>

              {/* Specification */}
              <Reveal delay={320}>
                <h2 className="eyebrow mt-14">Specification</h2>
                <dl className="mt-6 divide-y divide-ivory-300 border-y border-ivory-300">
                  {piece.specs.map((s) => (
                    <div key={s.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                      <dt className="font-sans text-sm text-muted">{s.label}</dt>
                      <dd className="font-sans text-sm text-onyx">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={380}>
                <p className="mt-10 border-l border-gold-deep/40 pl-6 font-sans text-sm leading-relaxed text-muted">
                  {priceNote}
                </p>
              </Reveal>

              <Reveal delay={440}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/guide" className="btn-ghost">
                    Read the buyer’s guide
                  </Link>
                  <Link href="/contact" className="btn-ghost">
                    Book an appointment
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      {/* Other pieces */}
      <section className="relative overflow-hidden bg-onyx py-28">
        <Monogram
          className="pointer-events-none absolute -bottom-20 -right-10 h-[24rem] w-auto text-gold/[0.05]"
          title=""
        />
        <div className="shell relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-4xl text-ivory">Also from the bench</h2>
            <Link href="/pieces" className="btn-ghost-dark">
              All pieces
            </Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link href={`/pieces/${p.slug}`} className="group block">
                  <div
                    className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
                    style={{
                      background: `radial-gradient(120% 100% at 50% 30%, ${p.accent}22 0%, transparent 62%), #0B0B0C`,
                    }}
                  >
                    <PieceVisual
                      piece={p}
                      size={52}
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.08]"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-ivory transition-colors duration-500 group-hover:text-gold">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-ivory/40">{p.caption}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
