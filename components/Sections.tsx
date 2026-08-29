import Link from 'next/link';
import type { ReactNode } from 'react';
import { marks } from '@/lib/content';
import { items, type Item } from '@/lib/collection';
import ItemVisual from './ItemVisual';
import Monogram from './Monogram';
import { Reveal, Counter, Parallax } from './Motion';

/* ── Section heading ─────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  dark = false,
  align = 'left',
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  dark?: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <Reveal>
          <p
            className={`${dark ? 'eyebrow-on-dark' : 'eyebrow'} mb-6 flex items-center gap-4 ${
              align === 'center' ? 'justify-center' : ''
            }`}
          >
            <span className={`h-px w-10 ${dark ? 'bg-gold/50' : 'bg-gold-deep/40'}`} />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2
          className={`display text-[clamp(2.4rem,5.5vw,4.2rem)] ${
            dark ? 'text-ivory' : 'text-onyx'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={160}>
          <p
            className={`mt-7 font-sans text-base leading-relaxed ${
              dark ? 'text-ivory/55' : 'text-muted'
            }`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ── Marks marquee ───────────────────────────────────────── */

export function Marks() {
  return (
    <section className="border-y border-ivory-300 bg-ivory-200/50">
      <div className="shell grid gap-px py-16 sm:grid-cols-2 lg:grid-cols-4">
        {marks.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 90}
            className="px-4 text-center sm:border-r sm:border-ivory-300 sm:last:border-r-0"
          >
            <p className="display text-5xl text-gold-deep">
              <Counter value={m.value} />
            </p>
            <p className="mt-3 font-sans text-[0.62rem] uppercase tracking-wide2 text-muted">
              {m.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Collection card ─────────────────────────────────────── */

export function ItemCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={index * 110}>
      <Link
        href={`/collection/${item.slug}`}
        className="group relative block overflow-hidden bg-onyx-800"
      >
        <div
          className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(120% 100% at 50% 30%, ${item.accent}22 0%, transparent 62%), #141416`,
          }}
        >
          <ItemVisual
            item={item}
            size={55}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-[1200ms] ease-silk group-hover:-translate-y-2 group-hover:scale-[1.08]"
          />

          {/* Gold wash that fades up from the bottom on hover. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-silk group-hover:opacity-100"
            style={{ background: 'linear-gradient(0deg, rgba(219,179,0,0.16) 0%, transparent 55%)' }}
          />

          <span className="absolute left-6 top-6 font-sans text-[0.58rem] tracking-luxe text-ivory/30">
            {item.ref}
          </span>
        </div>

        <div className="relative bg-onyx px-6 py-7">
          <p className="font-jp text-[0.62rem] tracking-wide2 text-gold/60">{item.nameJa}</p>
          <h3 className="mt-2 font-display text-2xl font-light text-ivory transition-colors duration-500 group-hover:text-gold">
            {item.name}
          </h3>
          <p className="mt-2 font-sans text-sm text-ivory/45">{item.caption}</p>

          <span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-silk group-hover:scale-x-100" />
        </div>
      </Link>
    </Reveal>
  );
}

/* ── Collection strip ────────────────────────────────────── */

export function CollectionPreview() {
  return (
    <section className="bg-onyx py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            dark
            eyebrow="Collection"
            title={
              <>
                Stones and
                <br />
                <span className="italic text-lustre">finished jewellery</span>
              </>
            }
          />
          <Reveal delay={200}>
            <Link href="/collection" className="btn-ghost-dark">
              View the collection
            </Link>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((c, i) => (
            <ItemCard key={c.slug} item={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Quote band ──────────────────────────────────────────── */

export function QuoteBand({ text, attribution }: { text: string; attribution: string }) {
  return (
    <section className="relative overflow-hidden bg-ivory-200 py-32">
      <Parallax
        speed={0.06}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <Monogram className="h-[34rem] w-auto text-gold/[0.06]" title="" />
      </Parallax>

      <div className="shell relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="display text-[clamp(1.9rem,4.2vw,3.1rem)] italic text-onyx">
            “{text}”
          </p>
          <p className="mt-9 font-sans text-[0.62rem] uppercase tracking-luxe text-muted">
            {attribution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Closing call to action ──────────────────────────────── */

export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-onyx py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 120% at 50% 130%, rgba(219,179,0,0.18) 0%, transparent 60%)',
        }}
      />
      <div className="shell relative text-center">
        <Reveal>
          <Monogram className="mx-auto h-16 w-auto text-gold" />
        </Reveal>
        <Reveal delay={100}>
          <h2 className="display mt-10 text-[clamp(2.4rem,6vw,4.6rem)] text-ivory">
            Start a <span className="italic text-lustre">conversation</span>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-7 max-w-xl font-sans text-base leading-relaxed text-ivory/55">
            Whether you are buying for a shop floor or for one person, tell us what you are after
            and we will tell you what it costs today.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn bg-gold text-onyx hover:bg-ivory">
              Make an enquiry
            </Link>
            <Link href="/education" className="btn-ghost-dark">
              Learn about stones
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
