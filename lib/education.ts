/**
 * Content for the education section at /education.
 *
 * All of it is original writing about how diamonds are graded, grown,
 * certified and sized. The grading scales (GIA D–Z colour, FL–I clarity) and
 * the Japanese ring size standard are published industry facts, not claims
 * about Saii Jewels — nothing here needs the company to verify it.
 *
 * The one thing to check before launch is `certification.labs`: which
 * laboratories' reports the business actually supplies is a fact about the
 * business rather than a general one. See the note there.
 *
 * Saii Jewels trades in stones and jewellery; it does not manufacture. Keep
 * this section about how to judge and buy a stone, never about making one.
 *
 * The business deals in NATURAL stones only. The laboratory-grown material
 * below is deliberately kept — it is the decision every diamond buyer now
 * has to make, and a buyer who does not understand it is easy to mislead.
 * It is written to inform, not to sell: see `origin.position`.
 */

export const educationIntro =
  'Most of what makes one diamond cost several times another is invisible until somebody shows you where to look. This is what we go through with a buyer choosing a stone, written down.';

/* ── The four Cs ──────────────────────────────────────────── */

export type CTab = {
  key: string;
  label: string;
  labelJa: string;
  headline: string;
  body: string;
  note: string;
};

export const fourCs: CTab[] = [
  {
    key: 'cut',
    label: 'Cut',
    labelJa: 'カット',
    headline: 'The only C a person decides',
    body: 'Colour, clarity and carat are settled underground or in a reactor. Cut is the one property a human being chooses. It describes the proportions and the finish of the facets — how deep the pavilion runs, how wide the table sits, how precisely the facets meet — and it governs how much light entering the stone comes back to your eye rather than leaking out of the bottom.',
    note: 'A well cut stone one grade lower in colour will almost always outperform a poorly cut stone one grade higher. If you have to spend on one C, spend it here.',
  },
  {
    key: 'colour',
    label: 'Colour',
    labelJa: 'カラー',
    headline: 'Graded by how little there is',
    body: 'The scale runs D to Z, and it measures absence. D, E and F are colourless; G through J are near-colourless and read as white on the hand; K and beyond carry a warmth you can see face-up. Grading is done face-down against masterstones in controlled light, which is why two stones that look identical in a shop window can sit two grades apart.',
    note: 'Warmth is not a fault. In yellow or rose gold, a stone in the G–J range often looks better set than a colourless one, and costs considerably less.',
  },
  {
    key: 'clarity',
    label: 'Clarity',
    labelJa: 'クラリティ',
    headline: 'What the stone carries inside',
    body: 'Almost every diamond holds something — a crystal, a feather, a wisp of cloud. Clarity grades how visible those inclusions are at ten times magnification, from Flawless down through VVS, VS, SI and I. The grade depends as much on where an inclusion sits as on how large it is: one under the table is far more consequential than one hiding under a claw.',
    note: 'Above VS2, differences are invisible without a loupe. What matters at the counter is whether a stone is eye-clean, and plenty of SI1 stones are.',
  },
  {
    key: 'carat',
    label: 'Carat',
    labelJa: 'カラット',
    headline: 'Weight, not size',
    body: 'One carat is 0.2 grams. It measures mass rather than spread, so two one-carat stones can look noticeably different across the top depending on how they are cut — a deep stone hides its weight in the pavilion, where nobody sees it. Price does not rise in a straight line either: it steps sharply at the round numbers, because that is where demand sits.',
    note: 'Buying just under a landmark — 0.90 rather than 1.00 — often costs meaningfully less for a stone that measures nearly the same across the finger.',
  },
];

/** GIA colour scale, grouped the way the grades are actually described. */
export const colourScale = [
  { grades: 'D E F', name: 'Colourless', hex: '#FFFFFF' },
  { grades: 'G H I J', name: 'Near colourless', hex: '#FDFCF4' },
  { grades: 'K L M', name: 'Faint', hex: '#FAF4DC' },
  { grades: 'N – R', name: 'Very light', hex: '#F6EDC4' },
  { grades: 'S – Z', name: 'Light', hex: '#F0E3A6' },
];

/** GIA clarity scale. `visible` is what you would see unaided. */
export const clarityScale = [
  { grade: 'FL / IF', name: 'Flawless', visible: 'Nothing at 10×' },
  { grade: 'VVS1 / VVS2', name: 'Very very slightly included', visible: 'Difficult even at 10×' },
  { grade: 'VS1 / VS2', name: 'Very slightly included', visible: 'Clear at 10×, invisible unaided' },
  { grade: 'SI1 / SI2', name: 'Slightly included', visible: 'Easy at 10×, usually still eye-clean' },
  { grade: 'I1 – I3', name: 'Included', visible: 'Visible without magnification' },
];

/* ── Shapes ───────────────────────────────────────────────── */

/**
 * The four cuts the business works in most. These previously lived on their
 * own page, which duplicated the collection; they belong here, where someone
 * is deciding what to buy rather than looking at what is for sale.
 */
export const shapes = [
  {
    slug: 'brilliant',
    cut: 'brilliant' as const,
    name: 'Round brilliant',
    nameJa: 'ラウンドブリリアント',
    accent: '#EAF2F7',
    caption: 'The single stone, uninterrupted',
    body: 'Fifty-seven facets arranged to throw back as much light as possible, and by a wide margin the most bought shape in the world. It hides colour and inclusions better than any other cut, which means a round brilliant can carry a lower colour or clarity grade and still face up beautifully.',
  },
  {
    slug: 'emerald',
    cut: 'emerald' as const,
    name: 'Emerald cut',
    nameJa: 'エメラルドカット',
    accent: '#CFE6D8',
    caption: 'Step cuts, long shadows',
    body: 'Broad parallel facets and a wide open table. A step cut trades fire for clarity — instead of sparkle you get depth, and the eye travels straight down into the stone. The same openness shows every inclusion, so clarity matters more here than in any other shape.',
  },
  {
    slug: 'marquise',
    cut: 'marquise' as const,
    name: 'Marquise',
    nameJa: 'マーキス',
    accent: '#F3E3EC',
    caption: 'Length, drawn to a point',
    body: 'Cut long and finished at two fine points, a marquise lengthens the finger and looks larger than its weight because so much of it sits face-up. The points are the vulnerable part and want a setting that covers them.',
  },
  {
    slug: 'pear',
    cut: 'pear' as const,
    name: 'Pear',
    nameJa: 'ペアシェイプ',
    accent: '#F6EEDC',
    caption: 'Half brilliant, half repose',
    body: 'One rounded shoulder and one point — the fire of a brilliant with the calm of a drop. It hangs better than any other shape, which is why it has never left the pendant, and it also flatters the hand set point-up.',
  },
];

/* ── Grown and mined ──────────────────────────────────────── */

export const origin = {
  title: 'Natural and laboratory-grown',
  lede: 'A laboratory-grown diamond is a diamond. It is the same crystal, the same hardness and the same optical behaviour as one taken out of the ground — the difference is where the carbon came together, and what that does to the price.',
  methods: [
    {
      abbr: 'HPHT',
      name: 'High pressure, high temperature',
      body: 'Reproduces the conditions under which diamonds form naturally: a carbon source is held at roughly 1,500°C under pressure of some 5 gigapascals around a small seed. It is the older of the two industrial routes and is also used to improve the colour of stones grown by other means.',
    },
    {
      abbr: 'CVD',
      name: 'Chemical vapour deposition',
      body: 'Grows the crystal a layer at a time. A carbon-bearing gas is broken down in a vacuum chamber and the carbon settles onto a diamond seed. It runs at lower pressure than HPHT and gives close control over the growing conditions, which is why most larger laboratory stones now come from it.',
    },
  ],
  comparison: [
    { property: 'Crystal structure', mined: 'Cubic carbon', lab: 'Cubic carbon — identical' },
    { property: 'Hardness', mined: '10 on the Mohs scale', lab: '10 on the Mohs scale' },
    { property: 'Graded on the four Cs', mined: 'Yes', lab: 'Yes, on the same scales' },
    { property: 'Told apart by eye', mined: 'No', lab: 'No — it takes laboratory instruments' },
    { property: 'Typical price', mined: 'Higher, and tied to supply', lab: 'Substantially lower for like for like' },
    { property: 'Resale', mined: 'An established secondary market', lab: 'Thin, and still settling' },
  ],
  /**
   * Where the house stands. Saii Jewels deals in natural stones only, so this
   * must not offer a laboratory-grown one — but the comparison above stays,
   * because it is a real decision every buyer now faces and they are better
   * served knowing it than being steered past it.
   */
  position:
    'Saii Jewels deals in natural stones. That is not a verdict on laboratory-grown diamonds — they are real diamonds, and for a buyer who wants the most size and clarity for the money they are a reasonable answer. It is simply not what we trade in, and you should hear that from us rather than find it out later.',
};

/* ── Certification ────────────────────────────────────────── */

export const certification = {
  title: 'Reading a report',
  lede: 'A grading report is an independent opinion on a stone, issued by a laboratory that never owns it. It is not a valuation and it is not a guarantee — it is a description precise enough that you can compare two stones you cannot hold at the same time.',
  /**
   * The reports a buyer will actually come across, not a list of what this
   * business supplies — that claim belongs in `lib/collection.ts`, and IGI is
   * here because a buyer will meet it elsewhere, most often on a
   * laboratory-grown stone.
   */
  labsLede: 'The four whose reports circulate most widely. Whoever issued it, the number on the paper should match the number inscribed on the girdle.',
  labs: [
    { abbr: 'GIA', name: 'Gemological Institute of America', note: 'The scale everyone else is measured against.' },
    { abbr: 'CGL', name: 'Central Gem Laboratory · 中央宝石研究所', note: 'The most widely held report in Japan.' },
    { abbr: 'AGT', name: 'AGT Gem Laboratory · AGTジェムラボラトリー', note: 'Long established in the Tokyo trade.' },
    { abbr: 'IGI', name: 'International Gemological Institute', note: 'Most often seen on laboratory-grown stones.' },
  ],
  reading: [
    { field: 'Shape and cutting style', body: 'Round brilliant, emerald cut, and so on — with the measurements in millimetres.' },
    { field: 'Carat weight', body: 'To two decimal places. Cross-check it against the measurements to see whether the weight is spread across the top or hidden in the depth.' },
    { field: 'Colour and clarity grade', body: 'The two grades, plus a plotted diagram showing where the inclusions sit.' },
    { field: 'Cut, polish, symmetry', body: 'Three separate judgements. On a round brilliant all three should be Excellent or Very Good before you look further.' },
    { field: 'Fluorescence', body: 'How the stone reacts under ultraviolet light. Faint is of no consequence; Strong can make a colourless stone look slightly milky in daylight.' },
    { field: 'Report number', body: 'Often laser-inscribed on the girdle. Check that the inscription on the stone matches the paper in front of you.' },
  ],
};

/* ── Metals ───────────────────────────────────────────────── */

export const metals = [
  {
    name: 'Platinum 950',
    ja: 'プラチナ950',
    body: 'Dense, unreactive and naturally white, so it never needs re-plating. It does not wear away so much as move aside, which is why an old platinum claw can be pushed back and re-tipped rather than replaced. The default for diamond settings.',
  },
  {
    name: 'Platinum 900',
    ja: 'プラチナ900',
    body: 'Slightly harder than 950 through a higher proportion of alloy, and long the standard in Japan for bridal work. A good choice where a fine claw has to hold its shape over decades.',
  },
  {
    name: '18k yellow gold',
    ja: 'K18イエローゴールド',
    body: 'Seventy-five per cent gold. Warm enough to flatter a stone in the G–J colour range, and hard enough to hold a setting. The traditional choice for anything worn every day.',
  },
  {
    name: '18k white gold',
    ja: 'K18ホワイトゴールド',
    body: 'Gold alloyed pale and usually finished with rhodium. The plating is a surface, and it will need renewing every few years — where that matters, we will say so and suggest platinum instead.',
  },
  {
    name: '18k rose gold',
    ja: 'K18ピンクゴールド',
    body: 'Copper in the alloy gives the colour, and also makes it the hardest of the three golds. It warms the skin and does not show wear the way white metals do.',
  },
];

/* ── Ring sizing ──────────────────────────────────────────── */

export const sizing = {
  title: 'Ring size in Japan',
  lede: 'Japan uses its own numbering, and it does not line up with American or European sizes. The number is derived from the inner circumference of the band: size 1 is 40.8 mm, and every step up adds about 1.05 mm.',
  /**
   * Japanese ring sizes against inner circumference and the nearest US size.
   * Derived from the JIS standard: size n has an inner diameter of
   * 13.0 mm + (n − 1) ÷ 3 mm. US equivalents are the nearest half size and
   * are approximate — which the page says plainly.
   */
  table: [
    { jp: '5', mm: '45.0', us: '3' },
    { jp: '7', mm: '47.1', us: '3¾' },
    { jp: '9', mm: '49.2', us: '4¾' },
    { jp: '11', mm: '51.3', us: '5¾' },
    { jp: '13', mm: '53.4', us: '6½' },
    { jp: '15', mm: '55.5', us: '7½' },
    { jp: '17', mm: '57.6', us: '8¼' },
    { jp: '19', mm: '59.7', us: '9¼' },
    { jp: '21', mm: '61.8', us: '10' },
    { jp: '23', mm: '63.9', us: '11' },
  ],
  notes: [
    'Fingers swell in heat and late in the day, and shrink in cold. Measure in the evening at ordinary room temperature, never straight after exercise.',
    'A wide band needs to be a size larger than a narrow one to feel the same on the finger.',
    'The knuckle, not the base of the finger, decides the size — the ring has to pass it and then sit without spinning.',
    'A plain band can usually be resized by two or three sizes. A ring set all the way round with stones often cannot be resized at all, so it is worth getting right the first time.',
  ],
  cta: 'We can measure you properly at the office, which takes a minute and removes the guesswork.',
};

/* ── Care ─────────────────────────────────────────────────── */

export const care = [
  {
    title: 'Washing',
    body: 'Warm water, a drop of unscented washing-up liquid and a soft toothbrush, working from underneath where the film actually collects. Rinse in a bowl rather than over an open drain. Nothing else is needed and most things marketed for the purpose are worse.',
  },
  {
    title: 'What to keep it away from',
    body: 'Chlorine attacks the alloys in gold over time, so rings come off before a pool or a hot spring. Hand cream and hairspray dull a stone faster than anything else. Take rings off for the gym — the damage is almost always to the metal, not the diamond.',
  },
  {
    title: 'Storage',
    body: 'Separately, and soft-lined. A diamond is the hardest thing in the box and will scratch every other stone in it, including other diamonds.',
  },
  {
    title: 'Have the claws checked',
    body: 'Once a year for anything worn daily, by whoever you bought it from or any competent jeweller. Almost every lost stone gives warning first, as a claw that has worn thin or lifted — and it is a five-minute job to catch and a very expensive one to miss.',
  },
];

export const sections = [
  { id: 'four-cs', label: 'The four Cs' },
  { id: 'shapes', label: 'Shapes' },
  { id: 'origin', label: 'Natural & lab-grown' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'metals', label: 'Metals' },
  { id: 'sizing', label: 'Ring size' },
  { id: 'care', label: 'Care' },
];
