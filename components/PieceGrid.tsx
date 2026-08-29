'use client';

import Link from 'next/link';
import { useState } from 'react';
import { pieces, pieceCategories } from '@/lib/pieces';
import PieceVisual from './PieceVisual';

const yen = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

export function PriceLabel({ priceFrom, className }: { priceFrom?: number; className?: string }) {
  return (
    <span className={className}>
      {priceFrom === undefined ? 'Price on request' : `from ${yen.format(priceFrom)}`}
    </span>
  );
}

export default function PieceGrid() {
  const [filter, setFilter] = useState<string>('All');
  const shown = filter === 'All' ? pieces : pieces.filter((p) => p.category === filter);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter pieces by category">
        {pieceCategories.map((c) => {
          const on = c === filter;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={on}
              className={`border px-6 py-3 font-sans text-[0.66rem] uppercase tracking-wide2 transition-all duration-500 ease-silk ${
                on
                  ? 'border-gold bg-gold text-onyx'
                  : 'border-ivory-300 text-muted hover:border-gold/60 hover:text-gold-deep'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Link
            key={p.slug}
            href={`/pieces/${p.slug}`}
            className="group block"
            // Re-keying on filter change restarts the entrance stagger.
            style={{
              animation: `charRise 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 70}ms both`,
            }}
          >
            <div
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
              style={{
                background: `radial-gradient(120% 100% at 50% 30%, ${p.accent}22 0%, transparent 62%), #141416`,
              }}
            >
              <PieceVisual
                piece={p}
                size={55}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="transition-transform duration-[1200ms] ease-silk group-hover:-translate-y-2 group-hover:scale-[1.08]"
              />

              <span className="absolute left-6 top-6 font-sans text-[0.58rem] tracking-luxe text-ivory/30">
                {p.ref}
              </span>

              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-silk group-hover:opacity-100"
                style={{ background: 'linear-gradient(0deg, rgba(219,179,0,0.16) 0%, transparent 55%)' }}
              />
            </div>

            <div className="relative pt-6">
              <p className="font-jp text-[0.6rem] tracking-wide2 text-gold-deep">{p.nameJa}</p>
              <h3 className="mt-2 font-display text-2xl text-onyx transition-colors duration-500 group-hover:text-gold-deep">
                {p.name}
              </h3>
              <p className="mt-1.5 font-sans text-sm text-muted">{p.caption}</p>
              <PriceLabel
                priceFrom={p.priceFrom}
                className="mt-3 block font-sans text-[0.66rem] uppercase tracking-wide2 text-gold-deep"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
