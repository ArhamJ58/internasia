# Saii Jewels

Website for **Saii Jewels Co., Ltd.** (サイイ ジュエルズ株式会社) — a jewellery
house in Higashi-Ueno, Taito-ku, Tokyo.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS. Every page is
statically prerendered, so the whole site can be served from a CDN.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Pages

| Path           | What it is                                                   |
| -------------- | ------------------------------------------------------------ |
| `/`            | Hero, marks band, the house, collections, craft, services     |
| `/collections` | The four cuts, one full panel each                            |
| `/atelier`     | Process, materials, how to commission                         |
| `/heritage`    | The Okachimachi quarter and the house's place in it           |
| `/contact`     | Enquiry form, address, phone, hours, transit                  |

## Editing the site

**Nearly all copy lives in one file: `lib/content.ts`.** Company details, page
copy, collection descriptions, services and hours are all there, and the pages
read from it. You should not need to touch a component to change wording.

That file marks every claim as one of three kinds:

- **VERIFIED** — transcribed straight off the business card (name, address,
  phone, fax, mobile, email, president, tagline). Correct as written.
- **REVIEW** — written to be true of the house but not independently
  confirmed. Read it and adjust to taste.
- **TODO** — things only you can confirm. Search the file for `TODO`.

### Before launch

There is **one** outstanding factual TODO:

- **Opening hours** (`visit.hours` in `lib/content.ts`) are a conservative
  guess, not something from the card. Confirm and correct them.

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
lines to the collection in `lib/content.ts`:

```ts
{
  slug: 'solitaire',
  // ...
  image: '/images/solitaire.jpg',
  imageAlt: 'Round brilliant solitaire in platinum',
}
```

The photograph then replaces the drawn stone everywhere that collection
appears — the home page grid and the collections page panel — and is served
through `next/image`. Collections without an `image` keep the drawing, so you
can switch them over one at a time.

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
