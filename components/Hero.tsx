'use client';

import Link from 'next/link';
import { company, hero } from '@/lib/content';
import Monogram from './Monogram';
import { Parallax, SplitText, CursorGlow } from './Motion';

/**
 * Small fixed points of light scattered over the hero. All sit to the right
 * of the headline column and clear of the centred scroll cue, and they only
 * appear at the breakpoint where that column exists.
 */
const SPARKS = [
  { x: 60, y: 20, d: 0 },
  { x: 72, y: 63, d: 1.4 },
  { x: 84, y: 29, d: 2.6 },
  { x: 91, y: 72, d: 0.7 },
  { x: 77, y: 87, d: 3.1 },
  { x: 96, y: 45, d: 1.9 },
  { x: 64, y: 40, d: 2.2 },
  { x: 88, y: 12, d: 0.4 },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-onyx">
      {/* Warm floor light rising from the lower left. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 22% 108%, rgba(219,179,0,0.20) 0%, rgba(219,179,0,0.06) 32%, transparent 62%), radial-gradient(90% 70% at 82% -10%, rgba(240,211,78,0.10) 0%, transparent 58%)',
        }}
      />

      <CursorGlow />

      {SPARKS.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute hidden h-1 w-1 rounded-full bg-gold-light lg:block"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animation: `sparkle ${3.5 + (i % 3)}s ease-in-out ${s.d}s infinite`,
            boxShadow: '0 0 10px 2px rgba(240,211,78,0.55)',
          }}
        />
      ))}

      <div className="shell relative grid w-full items-center gap-16 pt-32 pb-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p
            className="eyebrow-on-dark mb-9 flex items-center gap-4"
            data-char-wrap=""
            style={{ animation: 'charRise 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}
          >
            <span className="h-px w-10 bg-gold/50" />
            {hero.eyebrow}
          </p>

          <h1 className="display text-[clamp(3.2rem,10vw,7.5rem)] text-ivory">
            {hero.headline.map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <SplitText
                  text={word}
                  delay={450 + i * 280}
                  stagger={40}
                  className={i === 2 ? 'italic' : ''}
                  charClassName={i === 2 ? 'text-lustre' : undefined}
                />
              </span>
            ))}
          </h1>

          <p
            className="mt-10 max-w-lg font-sans text-base leading-relaxed text-ivory/60"
            style={{ animation: 'charRise 1.2s cubic-bezier(0.22,1,0.36,1) 1.5s both' }}
          >
            {hero.subhead}
          </p>

          <div
            className="mt-12 flex flex-wrap items-center gap-4"
            style={{ animation: 'charRise 1.2s cubic-bezier(0.22,1,0.36,1) 1.75s both' }}
          >
            <Link href={hero.ctaPrimary.href} className="btn bg-gold text-onyx hover:bg-ivory">
              {hero.ctaPrimary.label}
            </Link>
            <Link href={hero.ctaSecondary.href} className="btn-ghost-dark">
              {hero.ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* Monogram drawing itself on inside a pair of hairline rings. */}
        <div className="relative hidden items-center justify-center lg:flex">
          <Parallax speed={0.08} className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="h-[30rem] w-[30rem]" aria-hidden="true">
              <defs>
                <radialGradient id="heroAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#DBB300" stopOpacity="0.16" />
                  <stop offset="55%" stopColor="#DBB300" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#DBB300" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="200" fill="url(#heroAura)" />
              <circle
                cx="200"
                cy="200"
                r="168"
                fill="none"
                stroke="#DBB300"
                strokeOpacity="0.18"
                strokeWidth="0.75"
              />
              {/* Broken outer ring, turning slowly. */}
              <circle
                cx="200"
                cy="200"
                r="186"
                fill="none"
                stroke="#DBB300"
                strokeOpacity="0.3"
                strokeWidth="0.75"
                strokeDasharray="2 15"
                style={{ animation: 'spin 64s linear infinite', transformOrigin: 'center' }}
              />
            </svg>
          </Parallax>

          <Parallax speed={-0.05} className="relative">
            <Monogram
              draw
              className="h-[22rem] w-auto text-gold drop-shadow-[0_0_44px_rgba(219,179,0,0.3)]"
            />
          </Parallax>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ animation: 'charRise 1.2s cubic-bezier(0.22,1,0.36,1) 2.2s both' }}
      >
        <span className="font-sans text-[0.55rem] uppercase tracking-luxe text-ivory/35">
          Scroll
        </span>
        <span className="rule-vert h-14 bg-ivory/15" />
      </div>

      <span className="sr-only">
        {company.legalName} — {company.tagline}
      </span>
    </section>
  );
}
