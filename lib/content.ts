/**
 * Single source of truth for all site copy and company details.
 *
 * ─────────────────────────────────────────────────────────────
 *  VERIFIED  — transcribed directly from the company business card.
 *  REVIEW    — written to be true of the business but not independently
 *              confirmed. Read these before launch and adjust freely.
 *  TODO      — facts only Saii Jewels can supply. Search for "TODO".
 *
 *  WHAT THE BUSINESS IS: a jewellery trading house in Higashi-Ueno
 *  (Okachimachi), Tokyo — wholesale supply to the trade, and retail to
 *  private clients. It buys and sells loose diamonds, coloured gemstones
 *  and finished jewellery. It does NOT run a workshop and does not
 *  manufacture: there is no bench, no setting, no polishing. Nothing on
 *  this site should claim otherwise.
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
    // Higashi-Ueno / Okachimachi is Tokyo's jewellery trading quarter.
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
    'A jewellery house in Okachimachi, Tokyo — supplying loose diamonds, coloured gemstones and finished jewellery to the trade and to private clients.',
  ctaPrimary: { label: 'View the collection', href: '/collection' },
  ctaSecondary: { label: 'Get in touch', href: '/contact' },
} as const;

/**
 * The four marks on the home page band.
 *
 * Every entry is something already true of the business, so nothing
 * unverified appears on a public page. The claims a jewellery site usually
 * leads with — year founded, certifications, volumes — are exactly the ones
 * only Saii Jewels can confirm, so they are left out rather than guessed at.
 *
 * To add one once confirmed, replace an entry below. A purely numeric
 * `value` counts up as it scrolls into view; anything else is shown as
 * written. For example:
 *
 *   { value: 'Est. 1998', label: 'Trading in Tokyo' },
 *   { value: '30', label: 'Years in the quarter' },
 */
export const marks = [
  { value: 'Tokyo', label: 'Okachimachi quarter' },
  { value: 'Wholesale', label: 'Supply to the trade' },
  { value: 'Retail', label: 'Private clients, by appointment' },
  { value: 'Loose & set', label: 'Stones and finished jewellery' },
] as const;

/* ── What the business does ───────────────────────────────── */

export const services = [
  {
    title: 'Wholesale supply',
    body: 'Loose stones and finished jewellery supplied to jewellers, retailers and other dealers. Trade terms and volume pricing on request.',
  },
  {
    title: 'Retail',
    body: 'Private clients are welcome by appointment. The same stock as the trade sees, shown and explained without a shop floor in the way.',
  },
  {
    title: 'Loose diamonds & gemstones',
    body: 'Diamonds and coloured stones held loose, natural and laboratory-grown, viewed in daylight and supplied with their reports.',
  },
  {
    title: 'Sourcing to order',
    body: 'A specific weight, colour, clarity or shape that is not in stock is found through the quarter. Tell us the brief and the budget.',
  },
] as const;

/* ── About ────────────────────────────────────────────────── */

export const about = {
  title: 'A house in Okachimachi',
  lede: 'Higashi-Ueno has been Tokyo’s jewellery quarter for longer than anyone trading in it today. Saii Jewels has its office in the middle of it.',
  paragraphs: [
    'The streets around Okachimachi are unusual: within a few blocks sit the stone dealers, the importers, the manufacturers and the wholesalers who between them move most of the fine jewellery sold in Japan. A business that works here sees what is available first, and pays what the trade pays.',
    'Saii Jewels buys and sells in that market. Loose diamonds and coloured gemstones, and finished jewellery, supplied to jewellers and retailers across Japan and shown to private clients at the office by appointment.',
    'What a trading house is actually for is judgement — knowing which stone is worth its certificate, which is over-graded, and what a fair price looks like on the day. That is the part you cannot get from a listing, and it is the reason the same buyers come back.',
  ],
  /**
   * Written as a house line rather than a personal quote — attributing words
   * to a named person requires that person to have said them. Swap in a real
   * quote from Sandeep Jain and change `attribution` to his name.
   */
  quote: {
    text: 'A stone is only ever as good as the light you let into it.',
    attribution: 'Saii Jewels, Okachimachi',
  },
} as const;

/** Why the location matters — replaces the old workshop process copy. */
export const quarter = {
  title: 'Why the quarter matters',
  lede: 'Okachimachi concentrates in a few blocks what most countries spread across a whole industry. Buying inside it changes what is available and what it costs.',
  points: [
    {
      title: 'Selection',
      body: 'Stones are seen loose and in person before anything is committed to. What does not measure up in the hand never reaches a client.',
    },
    {
      title: 'Price',
      body: 'Buying where the trade buys removes the layers between the stone and the buyer. That margin stays with the client rather than the chain.',
    },
    {
      title: 'Speed',
      body: 'A specific brief — a weight, a colour, a shape — can usually be answered from within the quarter rather than from overseas.',
    },
    {
      title: 'Judgement',
      body: 'Two stones with the same certificate are rarely the same stone. Knowing which is which is the whole job, and it is learned here.',
    },
  ],
} as const;

/* ── Visit ────────────────────────────────────────────────── */

export const visit = {
  title: 'Visit',
  body: 'The office is in the middle of the Okachimachi quarter. Appointments are preferred so there is time to lay stones out properly and see them in daylight.',
  transit:
    'Okachimachi Station (JR) · Ueno-okachimachi (Toei Ōedo) · Naka-okachimachi (Tokyo Metro Hibiya)',
} as const;

/* ── Navigation ───────────────────────────────────────────── */

export const nav = [
  { label: 'Collection', href: '/collection' },
  { label: 'Education', href: '/education' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;
