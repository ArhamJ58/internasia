# Saii Jewels

Website for **Saii Jewels Co., Ltd.** (サイイ ジュエルズ株式会社) — a jewellery
house in Higashi-Ueno (Okachimachi), Taito-ku, Tokyo.

**What the business is:** a jewellery trading house. It buys and sells loose
diamonds, coloured gemstones and finished jewellery — wholesale to the trade,
retail to private clients. It does **not** manufacture: there is no workshop,
no bench, no setting or polishing. Nothing on this site should ever claim
otherwise, and the copy is written to keep that line clear.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS. Every page is
statically prerendered, so the whole site can be served from a CDN.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Pages

| Path                | What it is                                                |
| ------------------- | --------------------------------------------------------- |
| `/`                 | Hero, marks, the house, collection, why the quarter, services |
| `/collection`       | What the business supplies, filterable by category         |
| `/collection/[slug]`| One item: specification table and enquiry                  |
| `/education`        | Four Cs, shapes, origin, certificates, metals, sizing, care |
| `/about`            | Okachimachi, the trade, leadership                         |
| `/contact`          | Enquiry form, address, phone, transit                      |

## Editing the site

Copy lives in three files, and the pages read from them. You should not need
to touch a component to change wording.

| File                | What is in it                                          |
| ------------------- | ------------------------------------------------------ |
| `lib/content.ts`    | Company details, navigation, and the page copy         |
| `lib/collection.ts` | The items supplied and their specifications            |
| `lib/education.ts`  | Everything in the education section                    |

`lib/content.ts` marks every claim as one of three kinds:

- **VERIFIED** — transcribed straight off the business card (name, address,
  phone, fax, mobile, email, president, tagline). Correct as written.
- **REVIEW** — written to be true of the house but not independently
  confirmed. Read it and adjust to taste.
- **TODO** — things only you can confirm. Search the file for `TODO`.

### Before launch

Two things to check, both marked `TODO` in the source:

- **`lib/collection.ts`** — the six items are written as representative of
  what the business supplies, not as live stock, and none carries a price.
  Replace them with what you actually deal in and give them your own reference
  numbers. The header comment explains what was left out and why.
- **`certification.labs`** in `lib/education.ts` — the four laboratories listed
  are the ones whose reports circulate most widely in the Tokyo trade. Cut any
  whose reports you do not actually supply.

Separately, the marks band on the home page (`marks`) deliberately avoids the
claims a jewellery site usually leads with — year founded, certifications,
years at the bench — because none of them were in the material provided and
inventing them would put false statements on a live page. The file shows
exactly how to add them once you have the real values.

## Brand

The **SJ monogram** in `public/brand/monogram.svg` was traced from the
business card artwork and is rendered by `components/Monogram.tsx`, which
fills with `currentColor` so it takes the colour of whatever wraps it. Pass
`draw` to have it stroke itself on and then fill, as it does on the home page.

Brand gold is **`#DBB300`**, sampled from the card itself. The palette around
it (onyx, ivory, champagne, deep gold) is defined in `tailwind.config.ts`.

Type is Cormorant Garamond for display, Inter for body, and Noto Sans JP for
the Japanese lines.

## Photography

The stones on the site are **drawn, not photographed** — `components/Gemstone.tsx`
generates each cut from real facet geometry as SVG. They are placeholders in
the sense that they are not your pieces, but they are original artwork, so
there is no licensing question and nothing to replace in a hurry.

To use real photographs instead, drop files into `public/images/` and add two
lines to the item in `lib/collection.ts`:

```ts
{
  slug: 'round-brilliant-solitaire',
  // ...
  image: '/images/solitaire.jpg',
  imageAlt: 'Round brilliant solitaire in platinum',
}
```

The photograph then replaces the drawn stone everywhere that item appears —
the home page strip, the collection grid and the item page — and is served
through `next/image`. Items without an `image` keep the drawing, so you can
switch them over one at a time.

## Selling on the site

Right now every piece reads **price on request** and the buttons open an
enquiry. That is deliberate rather than a limitation: a made-to-order setting
has no single price until a stone is chosen, so a fixed number would be
misleading, and inventing prices for a real company is not something to do
casually.

There are three ways forward, in increasing order of work:

**1. Show prices, keep enquiries.** Set `priceFrom` on an item in
`lib/collection.ts` and it renders as "from ¥…" instead. Nothing else changes.
Good for setting expectations without committing to a checkout.

**2. Sell specific stones.** This is the real change, and it is a data problem
before it is a code one. Selling a stone means listing *that* stone — its
weight, grades, certificate number and photographs — and taking it down the
moment it sells. That needs inventory someone keeps current, not a static
file. Practically: move `items` behind a CMS or a spreadsheet sync, and add
the fields a buyer needs (carat, colour, clarity, cut grade, certificate
number, price).

**3. Take payment.** Two routes, and the choice is mostly about who handles
tax, shipping and card compliance:

- **Stripe** — keep this site as it is and add Stripe Checkout. Least
  disruption, and the design stays entirely yours. You handle inventory,
  order emails and shipping yourself.
- **Shopify** — move the catalogue into Shopify and keep this site as the
  storefront through their Storefront API. More to set up, but you get
  inventory, orders, tax, shipping and Japanese payment methods (konbini,
  PayPay, bank transfer) without building any of it.

For fine jewellery at these prices, be aware that most sales still close in
person. An enquiry flow that reliably books an appointment is often worth more
than a checkout that rarely completes — worth deciding deliberately rather
than by default.

## The enquiry form

`components/EnquiryForm.tsx` composes a pre-filled message and hands it to the
visitor's mail client (`mailto:info@saiijewels.com`). That keeps the site fully
static with no server to run or maintain.

To collect enquiries server-side instead, replace the body of `handleSubmit`
with a `fetch` POST to your form endpoint (Formspree, Basin, a Next.js route
handler — anything that accepts JSON). The form fields and validation stay as
they are.

## Motion

Animation primitives are in `components/Motion.tsx`: `Reveal` (scroll-triggered
fade and lift), `Parallax`, `SplitText` (per-character rise), `Counter`, and
`CursorGlow`.

All of it is disabled under `prefers-reduced-motion: reduce`, handled in one
block at the bottom of `app/globals.css`. If you add an animation, add it as a
keyframe there so that rule keeps covering it.

## Deploying

The site builds to fully static pages, so any static host works.

**Vercel** — import the repository, framework preset **Next.js**, no
environment variables needed. It deploys on push.

**Anywhere else** — `npm run build && npm start` runs the Node server, or add
`output: 'export'` to `next.config.js` to emit a plain `out/` directory of HTML
you can upload to any web host.

Set the real domain in `company.url` (`lib/content.ts`) before launch — the
sitemap, robots.txt, canonical URLs and the structured data for search engines
are all generated from it.
