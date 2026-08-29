/**
 * The pieces shown at /pieces.
 *
 * ─────────────────────────────────────────────────────────────
 *  READ THIS BEFORE LAUNCH
 *
 *  These are written as MADE-TO-ORDER MODELS, not as stock. Each one
 *  describes a setting the atelier makes and the range of stones it takes —
 *  which is true of a bespoke house and needs no inventory behind it.
 *
 *  What is deliberately NOT here:
 *
 *  • Prices. Every piece is "price on request", because a made-to-order
 *    setting has no single price until a stone is chosen, and inventing one
 *    for a real company would be worse than showing none. If you want prices,
 *    set `priceFrom` on a piece and it will render as "from ¥—".
 *
 *  • Stock. Nothing here claims a particular stone is sitting in a safe.
 *    If you move to selling specific stones, see the note in README.md about
 *    turning this into real inventory with checkout.
 *
 *  Replace the five models below with the settings you actually make. The
 *  reference numbers are arbitrary and should become your own.
 * ─────────────────────────────────────────────────────────────
 */

import type { Cut } from '@/components/Gemstone';

export type Piece = {
  slug: string;
  ref: string;
  name: string;
  nameJa: string;
  category: 'Rings' | 'Pendants' | 'Earrings';
  cut: Cut;
  accent: string;
  /**
   * How the stones sit. 'band' draws a calibrated row for channel-set
   * eternity work; 'pair' draws two, for anything sold as a pair. Defaults
   * to a single stone.
   */
  layout?: 'single' | 'band' | 'pair';
  /** One line under the name in the grid. */
  caption: string;
  /** Two or three paragraphs on the detail page. */
  body: string[];
  /** Rendered as the specification table. Order is preserved. */
  specs: { label: string; value: string }[];
  /** Set this to render "from ¥…" instead of "Price on request". */
  priceFrom?: number;
  /**
   * Optional photograph. Drop a file into `public/images/` and set the path
   * here to replace the drawn stone. Alt text is required alongside it.
   */
  image?: string;
  imageAlt?: string;
};

export const pieces: Piece[] = [
  {
    slug: 'six-claw-solitaire',
    ref: 'SJ-R01',
    name: 'Six-Claw Solitaire',
    nameJa: '6本爪ソリテール',
    category: 'Rings',
    cut: 'brilliant',
    accent: '#EAF2F7',
    caption: 'Round brilliant · platinum 950',
    body: [
      'The setting almost everyone pictures, made properly. Six claws hold more securely than four and distribute the pressure around the girdle, which matters on a stone that will be worn every day for decades.',
      'The gallery is cut away underneath so light reaches the pavilion from below as well as through the table, and the shank tapers to a knife edge at the front to make the stone read larger than its weight.',
    ],
    specs: [
      { label: 'Setting', value: 'Six-claw, cut-away gallery' },
      { label: 'Metal', value: 'Platinum 950, or 18k on request' },
      { label: 'Stone', value: 'Round brilliant, 0.30 ct upward' },
      { label: 'Origin', value: 'Mined or laboratory-grown' },
      { label: 'Certification', value: 'Report supplied where the stone carries one' },
      { label: 'Band width', value: '1.8 mm tapering to 1.4 mm' },
      { label: 'Sizing', value: 'JP 5 – 23, sized at the atelier' },
      { label: 'Lead time', value: 'Discussed at the first appointment' },
    ],
  },
  {
    slug: 'okachimachi-band',
    ref: 'SJ-R02',
    name: 'Okachimachi Band',
    nameJa: 'エタニティバンド',
    category: 'Rings',
    cut: 'brilliant',
    accent: '#F6EEDC',
    layout: 'band',
    caption: 'Channel-set eternity · platinum 900',
    body: [
      'A full band of round brilliants held in a channel rather than by individual claws. Nothing protrudes, which makes it the setting that survives daily wear best — and the one that stacks cleanly against an engagement ring.',
      'Because the stones run the whole way round, it cannot be resized afterwards. We size on a mandrel and cut the band to that measurement, so the fitting appointment matters more here than on any other piece.',
    ],
    specs: [
      { label: 'Setting', value: 'Channel, full eternity' },
      { label: 'Metal', value: 'Platinum 900' },
      { label: 'Stones', value: 'Matched round brilliants, calibrated' },
      { label: 'Band width', value: '2.4 mm' },
      { label: 'Profile', value: 'Flat court, comfort fit' },
      { label: 'Sizing', value: 'Cut to measurement — not resizable afterwards' },
      { label: 'Half eternity', value: 'Available, and resizable' },
    ],
  },
  {
    slug: 'step-cut-ring',
    ref: 'SJ-R03',
    name: 'Step-Cut Ring',
    nameJa: 'エメラルドカットリング',
    category: 'Rings',
    cut: 'emerald',
    accent: '#CFE6D8',
    caption: 'Emerald cut · east–west or north–south',
    body: [
      'An emerald cut wants a setting that stays out of its way. Four corner claws, a low bezel rail and nothing across the table — a step cut trades fire for clarity, and every piece of metal over the crown costs you some of it.',
      'Set north–south the stone lengthens the finger; set east–west it reads wider and more modern. We will show you both on your hand before anything is cut.',
    ],
    specs: [
      { label: 'Setting', value: 'Four corner claws, low rail' },
      { label: 'Metal', value: 'Platinum 950' },
      { label: 'Stone', value: 'Emerald or Asscher cut, 0.50 ct upward' },
      { label: 'Orientation', value: 'North–south or east–west' },
      { label: 'Note', value: 'Step cuts show inclusions readily — VS2 or better advised' },
      { label: 'Sizing', value: 'JP 5 – 23' },
    ],
  },
  {
    slug: 'marquise-pendant',
    ref: 'SJ-P01',
    name: 'Marquise Pendant',
    nameJa: 'マーキスペンダント',
    category: 'Pendants',
    cut: 'marquise',
    accent: '#F3E3EC',
    caption: 'Marquise · 18k or platinum chain',
    body: [
      'A marquise hangs well because the weight sits low and the two points give the eye somewhere to travel. Set with a fine claw at each point and two along the girdle, so the stone is held without anything crossing the face.',
      'The bail is made to the chain rather than bought in, which keeps the drop short and stops the stone turning on the neck.',
    ],
    specs: [
      { label: 'Setting', value: 'Four-claw, integrated bail' },
      { label: 'Metal', value: 'Platinum 950 or 18k' },
      { label: 'Stone', value: 'Marquise, 0.30 ct upward' },
      { label: 'Chain', value: '40 / 45 cm adjustable, matched metal' },
      { label: 'Note', value: 'Points are the vulnerable part — claws are set to cover them' },
    ],
  },
  {
    slug: 'pear-drops',
    ref: 'SJ-E01',
    name: 'Pear Drops',
    nameJa: 'ペアシェイプピアス',
    category: 'Earrings',
    cut: 'pear',
    accent: '#F6EEDC',
    layout: 'pair',
    caption: 'Matched pear pair · platinum posts',
    body: [
      'Sold and made as a matched pair. Finding two pear-shaped stones that agree on colour, clarity and outline is most of the work — a pair that is a grade apart is obvious the moment someone turns their head.',
      'Set on platinum posts with a fixed back rather than a hinge, which is the arrangement least likely to lose a stone or an earring.',
    ],
    specs: [
      { label: 'Setting', value: 'Three-claw, post and fixed back' },
      { label: 'Metal', value: 'Platinum 950' },
      { label: 'Stones', value: 'Matched pear pair, 0.25 ct each upward' },
      { label: 'Matching', value: 'Colour and clarity matched within one grade' },
      { label: 'Note', value: 'Supplied as a pair only' },
    ],
  },
];

export const pieceCategories = ['All', 'Rings', 'Pendants', 'Earrings'] as const;

export const piecesIntro =
  'Everything here is made to order around a stone you choose. These are the settings we return to most often — starting points for a conversation rather than a catalogue to pick from.';

/**
 * Shown beneath the grid and on every detail page. This is the honest
 * position for a bespoke atelier and also the thing that turns a browser
 * into an appointment.
 */
export const priceNote =
  'A made-to-order piece has no single price until a stone is chosen — the setting is a small part of it and the stone is most of it. Tell us the shape, the rough weight and the budget you have in mind, and we will come back with what that buys in both mined and laboratory stones.';
