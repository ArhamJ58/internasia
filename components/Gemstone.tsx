'use client';

import { useId } from 'react';

export type Cut = 'brilliant' | 'emerald' | 'marquise' | 'pear';

/**
 * Gemstones drawn as facet geometry rather than photographed.
 *
 * Two things make these read as stones instead of faceted balls: the crown
 * facet pattern is the real one (table, stars, bezel kites, upper girdle
 * halves), and adjacent facets are given deliberately opposed brightness.
 * A cut stone's face-up look is mostly that contrast — neighbouring facets
 * return light from very different directions, so one is near-white while
 * the one beside it is nearly black.
 *
 * Brightness is assigned by facet index, never randomly, so the server and
 * the client render identical markup.
 */

const TAU = Math.PI * 2;
const CX = 100;
const CY = 100;

type Pt = [number, number];
type Facet = { pts: Pt[]; light: number };
type Stone = { outline: Pt[]; facets: Facet[] };

const points = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

/** Deterministic -0.5..0.5 jitter from an integer. */
function jitter(i: number) {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return v - Math.floor(v) - 0.5;
}

/* ── Colour ──────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(
    a[1] + (b[1] - a[1]) * t,
  )},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

/* ── Round brilliant ──────────────────────────────────────
   The real crown pattern: an octagonal table, eight star facets
   between the table edges, eight bezel kites running out to the
   girdle, and sixteen upper-girdle halves along the rim.
   ─────────────────────────────────────────────────────── */
function brilliant(): Stone {
  const rT = 38; // table
  const rS = 64; // star tips
  const rG = 92; // girdle
  const step = TAU / 8;
  const half = step / 2;

  const at = (r: number, a: number): Pt => [CX + Math.cos(a) * r, CY + Math.sin(a) * r];

  const A = (k: number) => k * step - Math.PI / 2; // start at 12 o'clock
  const T = (k: number) => at(rT, A(k));
  const S = (k: number) => at(rS, A(k) + half);
  const G = (k: number) => at(rG, A(k));
  const g = (k: number) => at(rG, A(k) + half);

  const outline: Pt[] = Array.from({ length: 64 }, (_, k) => at(rG, (k / 64) * TAU));
  const facets: Facet[] = [];

  // Table
  facets.push({ pts: Array.from({ length: 8 }, (_, k) => T(k)), light: 0.58 });

  // Star facets: triangles between two table corners, pointing outward.
  for (let k = 0; k < 8; k++) {
    facets.push({
      pts: [T(k), T(k + 1), S(k)],
      light: (k % 2 ? 0.24 : 0.78) + jitter(k) * 0.12,
    });
  }

  // Bezel kites: table corner at the top, girdle point directly below it,
  // and a star tip to either side.
  for (let k = 0; k < 8; k++) {
    facets.push({
      pts: [T(k), S(k), G(k), S(k - 1)],
      light: (k % 2 ? 0.88 : 0.3) + jitter(k + 20) * 0.14,
    });
  }

  // Upper girdle halves, two per bezel.
  for (let k = 0; k < 8; k++) {
    facets.push({ pts: [S(k), G(k), g(k)], light: (k % 2 ? 0.16 : 0.62) + jitter(k + 40) * 0.12 });
    facets.push({
      pts: [S(k), g(k), G(k + 1)],
      light: (k % 2 ? 0.66 : 0.2) + jitter(k + 60) * 0.12,
    });
  }

  return { outline, facets };
}

/* ── Emerald (step) cut ───────────────────────────────────
   Nested cut-corner octagons with the corner steps picked out.
   ─────────────────────────────────────────────────────── */
function emerald(): Stone {
  const octagon = (w: number, h: number, c: number): Pt[] => [
    [CX - w + c, CY - h],
    [CX + w - c, CY - h],
    [CX + w, CY - h + c],
    [CX + w, CY + h - c],
    [CX + w - c, CY + h],
    [CX - w + c, CY + h],
    [CX - w, CY + h - c],
    [CX - w, CY - h + c],
  ];

  const rings = [octagon(70, 94, 19), octagon(56, 76, 15), octagon(40, 56, 11)];
  const lights = [0.22, 0.5, 0.82];
  const facets: Facet[] = rings.map((pts, i) => ({ pts, light: lights[i] }));

  // Corner steps sit at an angle to the long sides and go darker.
  const [outer, mid] = rings;
  for (let k = 1; k < 8; k += 2) {
    facets.push({
      pts: [outer[k], outer[(k + 1) % 8], mid[(k + 1) % 8], mid[k]],
      light: k % 4 === 1 ? 0.72 : 0.12,
    });
  }
  // Long sides alternate too, which is what gives a step cut its ladder.
  for (let k = 0; k < 8; k += 2) {
    facets.push({
      pts: [outer[k], outer[(k + 1) % 8], mid[(k + 1) % 8], mid[k]],
      light: k % 4 === 0 ? 0.34 : 0.6,
    });
  }

  return { outline: rings[0], facets };
}

/* ── Marquise and pear ────────────────────────────────────
   A long outline with a fan of crown facets. The marquise is a
   true lens — two circular arcs meeting at a point at each end.
   The pear runs to a point at the top and a round shoulder at
   the bottom, so its profile is linear at one end and
   square-root at the other.
   ─────────────────────────────────────────────────────── */
function pointed(kind: 'marquise' | 'pear'): Stone {
  const L = 90; // half-length
  const W = kind === 'marquise' ? 50 : 58; // max half-width

  const d = (L * L - W * W) / (2 * W);
  const R = W + d;

  const profile = (t: number) => {
    if (kind === 'marquise') {
      const y = t * L;
      return Math.max(0, Math.sqrt(Math.max(0, R * R - y * y)) - d);
    }
    const s = (t + 1) / 2;
    return 2 * W * s * Math.sqrt(Math.max(0, 1 - s * s));
  };

  const steps = 48;
  const side = (sign: 1 | -1): Pt[] =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const t = -1 + (2 * i) / steps;
      return [CX + sign * profile(t), CY + t * L] as Pt;
    });

  const right = side(1);
  const left = side(-1).reverse();
  const outline: Pt[] = [...right, ...left.slice(1, -1)];

  const shiftY = kind === 'pear' ? -9 : 0;
  // Two concentric rings inside the girdle rather than one. A single fan of
  // facets from table to girdle reads as a wheel; splitting it and offsetting
  // the bright/dark alternation between the rings gives the broken-up
  // scintillation a brilliant-cut stone actually has.
  const shrink = (f: number): Pt[] =>
    outline.map(([x, y]) => [CX + (x - CX) * f, CY + (y - CY) * f + shiftY * f] as Pt);

  const table = shrink(0.4);
  const ring = shrink(0.7);

  const facets: Facet[] = [{ pts: table, light: 0.62 }];

  const n = 16;
  const len = outline.length;
  const idx = (k: number) => Math.floor((k / n) * len) % len;

  for (let k = 0; k < n; k++) {
    const a = idx(k);
    const b = idx(k + 1);
    // Inner ring: table edge out to the mid ring.
    facets.push({
      pts: [table[a], table[b], ring[b], ring[a]],
      light: (k % 2 ? 0.8 : 0.24) + jitter(k + 7) * 0.14,
    });
    // Outer ring, alternation offset by one so no facet touches its twin.
    facets.push({
      pts: [ring[a], ring[b], outline[b], outline[a]],
      light: (k % 2 ? 0.22 : 0.86) + jitter(k + 31) * 0.14,
    });
  }

  return { outline, facets };
}

function stoneFor(cut: Cut): Stone {
  if (cut === 'brilliant') return brilliant();
  if (cut === 'emerald') return emerald();
  return pointed(cut);
}

export default function Gemstone({
  cut = 'brilliant',
  tint = '#EAF2F7',
  className,
  style,
  animate = true,
}: {
  cut?: Cut;
  tint?: string;
  className?: string;
  /** For sizing a stone to a real measurement rather than a utility class. */
  style?: React.CSSProperties;
  animate?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const { outline, facets } = stoneFor(cut);
  const shape = points(outline);

  // Facet colours run between a deeply shaded and a near-white version of
  // the stone's own tint, which is what produces the light/dark scintillation.
  const base = hexToRgb(tint);
  const shade: [number, number, number] = [
    Math.round(base[0] * 0.1),
    Math.round(base[1] * 0.13),
    Math.round(base[2] * 0.2),
  ];
  const bright: [number, number, number] = [
    Math.round(base[0] + (255 - base[0]) * 0.92),
    Math.round(base[1] + (255 - base[1]) * 0.92),
    Math.round(base[2] + (255 - base[2]) * 0.92),
  ];

  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <defs>
        {/* Band of light that travels across the stone. */}
        <linearGradient id={`sweep-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          {animate && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-1.1 0; 1.1 0; -1.1 0"
              dur="8s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>

        <clipPath id={`clip-${uid}`}>
          <polygon points={shape} />
        </clipPath>
      </defs>

      {/* Girdle body, so no background shows through facet seams. */}
      <polygon points={shape} fill={mix(shade, bright, 0.34)} />

      {facets.map((f, i) => (
        <polygon
          key={i}
          points={points(f.pts)}
          fill={mix(shade, bright, Math.max(0, Math.min(1, f.light)))}
        />
      ))}

      {/* Hairline seams, dark so they read as facet junctions. */}
      {facets.map((f, i) => (
        <polygon
          key={`e${i}`}
          points={points(f.pts)}
          fill="none"
          stroke={mix(shade, bright, 0.06)}
          strokeOpacity={0.5}
          strokeWidth={0.4}
        />
      ))}

      {/* Travelling light band, clipped to the girdle. */}
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="0" y="0" width="200" height="200" fill={`url(#sweep-${uid})`} />
      </g>

      {/* Bright girdle rim. */}
      <polygon
        points={shape}
        fill="none"
        stroke={mix(shade, bright, 0.96)}
        strokeOpacity={0.75}
        strokeWidth={1}
      />
    </svg>
  );
}
