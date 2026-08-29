/**
 * The items shown at /collection.
 *
 * ─────────────────────────────────────────────────────────────
 *  READ THIS BEFORE LAUNCH
 *
 *  Saii Jewels supplies jewellery and loose stones; it does not
 *  manufacture them. Nothing here claims the business cuts, sets or
 *  polishes anything, and nothing here should be edited to say so.
 *
 *  These are written as REPRESENTATIVE ITEMS — the kinds of piece the
 *  business supplies, and the specifications a buyer would ask about —
 *  rather than as live stock. That is honest for a trading house without
 *  needing an inventory system behind the website.
 *
 *  What is deliberately NOT here:
 *
 *  • Prices. A stone's price moves with the market and with the individual
 *    stone, so every item reads "price on request". Setting `priceFrom` on
 *    an item switches it to "from ¥…" if you would rather show a figure.
 *
 *  • Live stock. Nothing claims a particular stone is in the safe today.
 *    See README.md for what turning this into real inventory involves.
 *
 *  Replace the items below with what you actually supply, and give them
 *  your own reference numbers.
 * ─────────────────────────────────────────────────────────────
 */

import type { Cut } from '@/components/Gemstone';

export type Item = {
  slug: string;
  ref: string;
  name: string;
  nameJa: string;
  category: 'Rings' | 'Pendants' | 'Earrings' | 'Loose stones';
  cut: Cut;
  accent: string;
  /**
   * How the stones sit. 'band' draws a calibrated row for eternity work,
   * 'pair' draws two for anything supplied as a pair, 'loose' draws a
   * single stone on its own. Defaults to a single set stone.
   */
  layout?: 'single' | 'band' | 'pair' | 'loose';
  /** One line under the name in the grid. */
  caption: string;
  /** Two or three paragraphs on the detail page. */
  body: string[];
  /** The specification table. Order is preserved. */
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

export const items: Item[] = [
  {
    slug: 'round-brilliant-solitaire',
    ref: 'SJ-R01',
    name: 'Round Brilliant Solitaire',
    nameJa: 'ラウンドブリリアント ソリテール',
    category: 'Rings',
    cut: 'brilliant',
    accent: '#EAF2F7',
    caption: 'Six-claw · platinum 950',
    body: [
      'The most asked-for ring in Japan and the one most worth getting right. A six-claw head holds more securely than four and spreads the pressure around the girdle, which matters on a stone worn every day.',
      'Supplied set with a stone of your choosing, or as a mount for a stone you already own. Both natural and laboratory-grown diamonds are available, and we will show you what the same budget buys in each.',
    ],
    specs: [
      { label: 'Head', value: 'Six-claw, open gallery' },
      { label: 'Metal', value: 'Platinum 950, or 18k on request' },
      { label: 'Stone', value: 'Round brilliant, 0.30 ct upward' },
      { label: 'Origin', value: 'Natural or laboratory-grown' },
      { label: 'Certificate', value: 'Supplied with the stone where it carries one' },
      { label: 'Sizing', value: 'Japanese sizes 5 – 23' },
      { label: 'Supply', value: 'Wholesale and retail' },
    ],
  },
  {
    slug: 'eternity-band',
    ref: 'SJ-R02',
    name: 'Eternity Band',
    nameJa: 'エタニティバンド',
    category: 'Rings',
    cut: 'brilliant',
    accent: '#F6EEDC',
    layout: 'band',
    caption: 'Channel-set · platinum 900',
    body: [
      'A full band of calibrated round brilliants held in a channel. Nothing protrudes, which is why it wears better than a claw-set band and stacks cleanly against an engagement ring.',
      'Because the stones run the whole way round, a full eternity cannot be resized later — the size has to be right when it is ordered. A half eternity can be resized, and is the more practical choice for most buyers.',
    ],
    specs: [
      { label: 'Setting', value: 'Channel, full eternity' },
      { label: 'Metal', value: 'Platinum 900' },
      { label: 'Stones', value: 'Calibrated round brilliants, matched' },
      { label: 'Band width', value: '2.4 mm' },
      { label: 'Sizing', value: 'Ordered to size — not resizable afterwards' },
      { label: 'Half eternity', value: 'Available, and resizable' },
      { label: 'Supply', value: 'Wholesale and retail' },
    ],
  },
  {
    slug: 'emerald-cut-ring',
    ref: 'SJ-R03',
    name: 'Emerald Cut Ring',
    nameJa: 'エメラルドカットリング',
    category: 'Rings',
    cut: 'emerald',
    accent: '#CFE6D8',
    caption: 'Four-claw · north–south or east–west',
    body: [
      'A step cut trades fire for clarity: broad parallel facets and a wide table, so the eye travels straight down into the stone rather than catching sparkle off it.',
      'That openness is also the catch — a step cut shows inclusions far more readily than a brilliant, so clarity matters more here than it does elsewhere. VS2 or better is the sensible floor, and we will say so rather than sell you an SI.',
    ],
    specs: [
      { label: 'Head', value: 'Four corner claws, low rail' },
      { label: 'Metal', value: 'Platinum 950' },
      { label: 'Stone', value: 'Emerald or Asscher cut, 0.50 ct upward' },
      { label: 'Orientation', value: 'North–south or east–west' },
      { label: 'Clarity', value: 'VS2 or better advised for step cuts' },
      { label: 'Sizing', value: 'Japanese sizes 5 – 23' },
      { label: 'Supply', value: 'Wholesale and retail' },
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
      'A marquise hangs well because the weight sits low and the two points give the eye a direction to travel. Held by a claw at each point and two along the girdle, so nothing crosses the face of the stone.',
      'Supplied on a matched chain in the same metal, adjustable between two lengths so it sits where the wearer wants it.',
    ],
    specs: [
      { label: 'Setting', value: 'Four-claw with integrated bail' },
      { label: 'Metal', value: 'Platinum 950 or 18k' },
      { label: 'Stone', value: 'Marquise, 0.30 ct upward' },
      { label: 'Chain', value: '40 / 45 cm adjustable, matched metal' },
      { label: 'Supply', value: 'Wholesale and retail' },
    ],
  },
  {
    slug: 'pear-drop-earrings',
    ref: 'SJ-E01',
    name: 'Pear Drop Earrings',
    nameJa: 'ペアシェイプピアス',
    category: 'Earrings',
    cut: 'pear',
    accent: '#F6EEDC',
    layout: 'pair',
    caption: 'Matched pair · platinum posts',
    body: [
      'Supplied as a matched pair, which is most of the work. Two pear-shaped stones that agree on colour, clarity and outline are considerably harder to find than one good stone, and a pair that is a grade apart is obvious the moment someone turns their head.',
      'Platinum posts with fixed backs rather than hinges — the arrangement least likely to lose an earring.',
    ],
    specs: [
      { label: 'Setting', value: 'Three-claw, post and fixed back' },
      { label: 'Metal', value: 'Platinum 950' },
      { label: 'Stones', value: 'Matched pear pair, 0.25 ct each upward' },
      { label: 'Matching', value: 'Colour and clarity matched within one grade' },
      { label: 'Supply', value: 'Sold as a pair only' },
    ],
  },
  {
    slug: 'loose-diamonds',
    ref: 'SJ-L01',
    name: 'Loose Diamonds',
    nameJa: 'ルースダイヤモンド',
    category: 'Loose stones',
    cut: 'brilliant',
    accent: '#EAF2F7',
    layout: 'loose',
    caption: 'Natural & laboratory-grown · certificated',
    body: [
      'Stones held loose, in every shape on this site and a good many that are not. Natural and laboratory-grown, and we are straightforward about which is which and what each is worth.',
      'Loose is how a stone should be judged — in the hand, in daylight, against others of its grade, before any decision is made about a setting. Bring a certificate you are considering elsewhere and we will read it with you.',
    ],
    specs: [
      { label: 'Shapes', value: 'Round, emerald, marquise, pear, oval, princess' },
      { label: 'Origin', value: 'Natural and laboratory-grown' },
      { label: 'Weight', value: 'From 0.20 ct; larger stones sourced to order' },
      { label: 'Certificates', value: 'GIA, CGL, AGT and IGI reports' },
      { label: 'Coloured stones', value: 'Sapphire, ruby and emerald also held' },
      { label: 'Supply', value: 'Wholesale and retail' },
    ],
  },
];

export const categories = ['All', 'Rings', 'Pendants', 'Earrings', 'Loose stones'] as const;

export const collectionIntro =
  'What we supply, and the specifications a buyer actually asks about. Items are shown set for illustration — most are available as a mount alone, or as a loose stone on its own.';

/**
 * Shown beneath the grid and on every detail page. Honest for a trading
 * house, and the thing most likely to start a conversation.
 */
export const priceNote =
  'Prices move with the market and with the individual stone, so nothing here carries a fixed figure. Tell us the shape, the rough weight and the budget you have in mind, and we will come back with what that buys today — in both natural and laboratory-grown stones, so you can see the difference.';
