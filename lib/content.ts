/**
 * Single source of truth for all site copy and company details.
 *
 * ─────────────────────────────────────────────────────────────
 *  VERIFIED  — transcribed directly from the company business card.
 *  REVIEW    — written to be true of the house but not independently
 *              confirmed. Read these before launch and adjust freely.
 *  TODO      — facts only Saii Jewels can supply. Placeholder values are
 *              marked and are deliberately conservative; search this file
 *              for "TODO" to find every one.
 * ─────────────────────────────────────────────────────────────
 */

/* ── VERIFIED ─────────────────────────────────────────────── */

export const company = {
  name: 'Saii Jewels',
  legalName: 'Saii Jewels Co., Ltd.',
  legalNameJa: 'サイイ ジュエルズ株式会社',
  tagline: 'Timeless. Elegant. Saii.',
  president: {
    name: 'Sandeep Jain',
    nameJa: 'ジェーヌ サンディープ',
    title: 'President',
    titleJa: '代表取締役',
  },
  address: {
    room: 'Room 502, Yamamo Building',
    street: '1-24-2 Higashi-Ueno, Taito-ku',
    city: 'Tokyo',
    postalCode: '110-0015',
    country: 'Japan',
    ja: '〒110-0015 東京都台東区東上野1-24-2 山茂ビル502号室',
    // Higashi-Ueno / Okachimachi is Tokyo's historic jewellery quarter.
    district: 'Okachimachi, Tokyo',
  },
  tel: '03-5846-8313',
  fax: '03-5846-8314',
  mobile: '090-7269-8314',
  email: 'info@saiijewels.com',
  web: 'www.saiijewels.com',
  url: 'https://www.saiijewels.com',
} as const;

/* ── REVIEW ───────────────────────────────────────────────── */

export const hero = {
  eyebrow: 'Higashi-Ueno · Tokyo',
  headline: ['Timeless.', 'Elegant.', 'Saii.'],
  subhead:
    'A Tokyo jewellery house working in diamonds, coloured gemstones and precious metal — where every piece is selected, set and finished by hand.',
  ctaPrimary: { label: 'View Collections', href: '/collections' },
  ctaSecondary: { label: 'Visit the Atelier', href: '/contact' },
} as const;

/**
 * The four marks on the home page band.
 *
 * Every entry here is deliberately something already true of the house, so
 * nothing unverified is stated on a public page. The claims a jewellery site
 * would normally lead with — year founded, certification bodies, number of
 * pieces — are exactly the ones only Saii Jewels can confirm, so they are
 * left out rather than guessed at.
 *
 * To add one once confirmed, replace an entry below. A purely numeric
 * `value` animates upward as it scrolls into view; anything else is shown
 * as written. For example:
 *
 *   { value: 'Est. 1998', label: 'Founded in Tokyo' },
 *   { value: '30', label: 'Years at the bench' },
 *   { value: 'GIA', label: 'Certified diamonds' },
 */
export const marks = [
  { value: 'Tokyo', label: 'Higashi-Ueno atelier' },
  { value: 'Okachimachi', label: 'The jewellery quarter' },
  { value: '4', label: 'Signature cuts' },
  { value: 'By hand', label: 'Set and finished in-house' },
] as const;

export type Collection = {
  slug: string;
  name: string;
  nameJa: string;
  stone: 'brilliant' | 'emerald' | 'marquise' | 'pear';
  caption: string;
  body: string;
  /** Tint the drawn stone is shaded from, and the wash behind it. */
  accent: string;
  /**
   * Optional photograph. Drop a file into `public/images/` and set this to
   * its path (e.g. '/images/solitaire.jpg') and it replaces the drawn stone
   * everywhere that collection appears. Leave it out to keep the drawing.
   */
  image?: string;
  /** Alt text for `image`. Required whenever an image is set. */
  imageAlt?: string;
};

export const collections: Collection[] = [
  {
    slug: 'solitaire',
    name: 'Solitaire',
    nameJa: 'ソリテール',
    stone: 'brilliant',
    caption: 'The single stone, uninterrupted',
    body: 'A brilliant cut asks for nothing around it. Our solitaire settings are drawn to disappear — fine claws, a knife-edge shank, and a gallery cut away so light reaches the pavilion from every side.',
    accent: '#EAF2F7',
  },
  {
    slug: 'emerald-line',
    name: 'The Emerald Line',
    nameJa: 'エメラルド',
    stone: 'emerald',
    caption: 'Step cuts, long shadows',
    body: 'Step cuts reward stillness. Broad tables and parallel facets trade fire for clarity, and the eye travels straight down into the stone. Set in platinum, framed by nothing at all.',
    accent: '#CFE6D8',
  },
  {
    slug: 'marquise',
    name: 'Marquise',
    nameJa: 'マーキス',
    stone: 'marquise',
    caption: 'Length, drawn to a point',
    body: 'A marquise lengthens the hand. Cut long and finished at two fine points, it is the most demanding shape to set well — and the most rewarding when the symmetry is exact.',
    accent: '#F3E3EC',
  },
  {
    slug: 'pear',
    name: 'Pear',
    nameJa: 'ペアシェイプ',
    stone: 'pear',
    caption: 'Half brilliant, half repose',
    body: 'One rounded shoulder, one point. The pear carries the fire of a brilliant and the calm of a drop, and it hangs beautifully — which is why it has never left the pendant.',
    accent: '#F6EEDC',
  },
];

export const craft = {
  title: 'The Atelier',
  intro:
    'Saii Jewels works from Higashi-Ueno, the quarter of Tokyo where the city has traded stones for generations. Everything below happens within walking distance of our door.',
  steps: [
    {
      n: '01',
      title: 'Selection',
      body: 'Stones are chosen loose, in daylight, one at a time. Colour, cut and clarity are judged in the hand before anything is committed to a design.',
    },
    {
      n: '02',
      title: 'Design',
      body: 'A drawing is made to the stone rather than the other way round. Proportion, finger fit and the way light will enter the pavilion are all settled on paper first.',
    },
    {
      n: '03',
      title: 'Setting',
      body: 'Claws are cut and closed by hand under magnification. A setting is right when the stone sits dead level and no metal interrupts the return of light.',
    },
    {
      n: '04',
      title: 'Finish',
      body: 'Polishing is the last and longest stage. Every surface a finger will find is worked until the piece feels finished from the inside out.',
    },
  ],
} as const;

export const heritage = {
  title: 'A house in Okachimachi',
  lede: 'Higashi-Ueno has been Tokyo’s jewellery quarter for longer than anyone trading in it today. Saii Jewels keeps a workshop in the middle of it.',
  paragraphs: [
    'The streets around Okachimachi are unusual: within a few blocks sit the stone dealers, the casters, the setters and the polishers who between them make most of the fine jewellery sold in Japan. A house that works here has the whole trade at arm’s length — and no distance to hide behind.',
    'Saii Jewels was built in that setting, and works the way the quarter works: stones bought loose and judged by eye, pieces made to order rather than to a catalogue, and the same hands on a commission from the first drawing to the final polish.',
    'The result is a small output and a long relationship. Most of what leaves the atelier was designed for one person, and a good number of our clients have come back across a generation.',
  ],
  /**
   * Written as a house line rather than a personal quote — attributing words
   * to a named person needs that person to have said them. Swap in a real
   * quote from Sandeep Jain and change `attribution` to his name when you
   * have one.
   */
  quote: {
    text: 'A stone is only ever as good as the light you let into it.',
    attribution: 'Saii Jewels, Higashi-Ueno',
  },
} as const;

export const services = [
  {
    title: 'Bespoke commissions',
    body: 'A piece designed around a stone you bring, or one we source for you. Drawings first, then wax, then metal.',
  },
  {
    title: 'Bridal',
    body: 'Engagement rings and wedding bands, sized and set to the pair. Discretion assumed throughout.',
  },
  {
    title: 'Loose stones',
    body: 'Diamonds and coloured gemstones selected from the Okachimachi trade, viewed in daylight at the atelier.',
  },
  {
    title: 'Restoration',
    body: 'Re-setting, re-tipping and re-polishing of inherited pieces, with the original character kept intact.',
  },
] as const;

export const visit = {
  title: 'Visit',
  body: 'The atelier is a working room, not a shop floor. Appointments are preferred so a bench and good daylight are free when you arrive.',
  /**
   * TODO — confirm these with the atelier before launch. They are the only
   * unverified factual claim left on the site; the values below are a
   * conservative guess, not something taken from the business card.
   */
  hours: [
    { days: 'Monday – Friday', time: '10:00 – 18:00' },
    { days: 'Saturday', time: 'By appointment' },
    { days: 'Sunday & holidays', time: 'Closed' },
  ],
  transit: 'Okachimachi Station (JR) · Ueno-okachimachi (Toei Ōedo) · Naka-okachimachi (Tokyo Metro Hibiya)',
} as const;

export const nav = [
  { label: 'Collections', href: '/collections' },
  { label: 'Atelier', href: '/atelier' },
  { label: 'Heritage', href: '/heritage' },
  { label: 'Contact', href: '/contact' },
] as const;
