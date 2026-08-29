'use client';

import { useState } from 'react';
import { fourCs, colourScale, clarityScale } from '@/lib/guide';
import Gemstone from './Gemstone';

/* ── Per-tab illustrations ───────────────────────────────── */

/** Light entering a well cut stone returns; in a shallow one it leaks out. */
function CutDiagram() {
  const stone = (x: number, depth: number, label: string, good: boolean) => (
    <g transform={`translate(${x},0)`}>
      <polygon
        points={`-46,0 46,0 30,-16 -30,-16`}
        fill="#EAF2F7"
        fillOpacity="0.22"
        stroke="#EAF2F7"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      <polygon
        points={`-46,0 46,0 0,${depth}`}
        fill="#EAF2F7"
        fillOpacity="0.12"
        stroke="#EAF2F7"
        strokeOpacity="0.5"
        strokeWidth="0.8"
      />
      {/* Ray in */}
      <path
        d={`M -22,-40 L -22,0 L 0,${depth * 0.82}`}
        fill="none"
        stroke="#DBB300"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Ray out: back up through the table when cut well, out of the side when not */}
      <path
        d={good ? `M 0,${depth * 0.82} L 22,0 L 22,-40` : `M 0,${depth * 0.82} L 40,4 L 62,26`}
        fill="none"
        stroke={good ? '#DBB300' : '#7A736A'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray={good ? undefined : '3 3'}
      />
      <text
        x="0"
        y="78"
        textAnchor="middle"
        fill={good ? '#DBB300' : '#7A736A'}
        fontSize="9"
        letterSpacing="2"
      >
        {label}
      </text>
    </g>
  );

  return (
    <svg
      viewBox="0 0 300 148"
      className="w-full"
      role="img"
      aria-label="Light return in a well cut stone compared with a shallow one"
    >
      <g transform="translate(0,52)">
        {stone(80, 52, 'WELL CUT', true)}
        {stone(220, 26, 'TOO SHALLOW', false)}
      </g>
    </svg>
  );
}

function ColourScale() {
  return (
    <div>
      <div className="flex overflow-hidden rounded-sm">
        {colourScale.map((c) => (
          <div key={c.grades} className="flex-1">
            <div className="h-16 w-full" style={{ background: c.hex }} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex">
        {colourScale.map((c) => (
          <div key={c.grades} className="flex-1 pr-3">
            <p className="font-sans text-[0.66rem] tracking-wide2 text-ivory">{c.grades}</p>
            <p className="mt-1 font-sans text-[0.6rem] leading-snug text-ivory/40">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClarityScale() {
  return (
    <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
      {clarityScale.map((c) => (
        <li key={c.grade} className="grid gap-1 py-3.5 sm:grid-cols-[8rem_1fr] sm:gap-6">
          <span className="font-sans text-[0.68rem] tracking-wide2 text-gold">{c.grade}</span>
          <span className="font-sans text-sm text-ivory/55">
            <span className="text-ivory/80">{c.name}</span>
            <span className="mx-2 text-ivory/20">·</span>
            {c.visible}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Face-up spread of common weights, drawn to relative scale. */
function CaratScale() {
  const sizes = [
    { ct: '0.50', mm: 5.2 },
    { ct: '0.75', mm: 5.9 },
    { ct: '1.00', mm: 6.5 },
    { ct: '1.50', mm: 7.4 },
    { ct: '2.00', mm: 8.2 },
  ];
  const max = 8.2;

  return (
    <div className="flex items-end gap-3 sm:gap-5">
      {sizes.map((s) => {
        const size = (s.mm / max) * 100;
        return (
          <div key={s.ct} className="text-center">
            <div className="flex h-[100px] items-end justify-center">
              <Gemstone
                cut="brilliant"
                tint="#EAF2F7"
                animate={false}
                className="block"
                // Sized by the stone's real face-up diameter, so the steps
                // between weights are honest rather than decorative.
                style={{ width: `${size}px`, height: `${size}px` }}
              />
            </div>
            <p className="mt-3 font-sans text-[0.68rem] tracking-wide2 text-gold">{s.ct} ct</p>
            <p className="mt-1 font-sans text-[0.6rem] text-ivory/40">≈ {s.mm} mm</p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Tabs ────────────────────────────────────────────────── */

export default function FourCs() {
  const [active, setActive] = useState(fourCs[0].key);
  const tab = fourCs.find((t) => t.key === active) ?? fourCs[0];

  return (
    <div>
      {/* Tab list */}
      <div role="tablist" aria-label="The four Cs" className="flex flex-wrap gap-2">
        {fourCs.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={on}
              aria-controls={`panel-${t.key}`}
              onClick={() => setActive(t.key)}
              className={`group border px-7 py-4 text-left transition-all duration-500 ease-silk ${
                on
                  ? 'border-gold bg-gold/10'
                  : 'border-ivory/15 hover:border-gold/50 hover:bg-ivory/[0.03]'
              }`}
            >
              <span
                className={`block font-display text-2xl transition-colors duration-500 ${
                  on ? 'text-gold' : 'text-ivory/70 group-hover:text-ivory'
                }`}
              >
                {t.label}
              </span>
              <span className="mt-0.5 block font-jp text-[0.6rem] tracking-wide2 text-ivory/35">
                {t.labelJa}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${tab.key}`}
        aria-labelledby={`tab-${tab.key}`}
        // Re-keying restarts the entrance animation on every tab change.
        key={tab.key}
        className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16"
        style={{ animation: 'charRise 0.7s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <div>
          <h3 className="display text-[clamp(1.8rem,3.4vw,2.6rem)] text-ivory">{tab.headline}</h3>
          <p className="mt-6 font-sans text-base leading-relaxed text-ivory/55">{tab.body}</p>
          <p className="mt-8 border-l border-gold/50 pl-6 font-display text-lg italic leading-relaxed text-gold/90">
            {tab.note}
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-full">
            {tab.key === 'cut' && <CutDiagram />}
            {tab.key === 'colour' && <ColourScale />}
            {tab.key === 'clarity' && <ClarityScale />}
            {tab.key === 'carat' && <CaratScale />}
          </div>
        </div>
      </div>
    </div>
  );
}
