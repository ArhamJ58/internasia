/**
 * Builds a single self-contained HTML file of the whole site, for sharing a
 * preview link without deploying anything.
 *
 *   npm run build
 *   npm start &                            # serve the production build
 *   npm run preview                        # writes preview/saii-jewels.html
 *
 * How it works: every page is opened in a real browser so React has hydrated,
 * then the rendered markup is lifted out and the pages are stitched together
 * behind a small vanilla router. The Next.js runtime is dropped, so the
 * behaviours it provided — scroll reveals, parallax, the nav's colour states,
 * the drawer, the four-Cs tabs, the pieces filter, the counters — are
 * reimplemented in the inline script at the bottom of the generated file.
 *
 * Elements whose classes the real components swap at runtime are tagged with
 * `data-pv` during capture, so the preview can restyle exactly those and
 * nothing else.
 *
 * This is a preview artefact, not a deployment target. The Next.js app is the
 * real site; a new page has to be added to PAGES below to appear here.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.PREVIEW_BASE ?? 'http://localhost:3999';
const OUT = resolve(ROOT, 'preview/saii-jewels.html');
const EXECUTABLE = process.env.CHROMIUM_PATH || undefined;

/** slug → category, read out of the source so the filter cannot drift. */
function pieceCategories() {
  const src = readFileSync(resolve(ROOT, 'lib/pieces.ts'), 'utf8');
  const map = {};
  const re = /slug:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) map[m[1]] = m[2];
  return map;
}

const PIECE_PATHS = Object.keys(pieceCategories()).map((slug) => `/pieces/${slug}`);

const PAGES = [
  '/',
  '/pieces',
  ...PIECE_PATHS,
  '/collections',
  '/guide',
  '/atelier',
  '/heritage',
  '/contact',
].map((path) => ({
  path,
  id: path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-'),
}));

/**
 * Runs in the page: drop framework-only state, rewind anything already played,
 * and tag the elements the preview will need to restyle.
 */
function prepare(categories) {
  document.querySelectorAll('[style*="will-change"]').forEach((el) => {
    el.style.transform = '';
    el.dataset.pvParallax = '';
  });

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.setAttribute('data-reveal', '');
  });

  const header = document.querySelector('header');
  if (header) {
    header.querySelectorAll('nav[aria-label="Main"] a').forEach((a) => {
      a.dataset.pv = a.getAttribute('href').startsWith('tel:') ? 'tel' : 'navlink';
    });
    const brand = header.querySelector('a[aria-label]');
    if (brand) {
      const svg = brand.querySelector('svg');
      if (svg) svg.dataset.pv = 'monogram';
      const word = brand.querySelector('span');
      if (word) word.dataset.pv = 'wordmark';
    }
    header.querySelectorAll('button[aria-expanded] span').forEach((s) => {
      s.dataset.pv = 'bar';
    });
  }

  // Category on each card, so the preview filter has something to match on.
  document.querySelectorAll('a[href^="/pieces/"]').forEach((a) => {
    const slug = a.getAttribute('href').replace('/pieces/', '');
    if (categories[slug]) a.dataset.pvCategory = categories[slug];
  });
}

const main = async () => {
  const categories = pieceCategories();
  const browser = await chromium.launch({ executablePath: EXECUTABLE });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // ── Stylesheets ────────────────────────────────────────────
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const cssHrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) => l.href),
  );
  let css = '';
  for (const href of cssHrefs) {
    css += (await (await ctx.request.get(href)).text()) + '\n';
  }
  // The bundled @font-face rules point at /_next/ paths that will not resolve
  // in a standalone file, so the fonts are embedded instead of linked — the
  // preview then renders correctly with no network at all.
  //
  // next/font emits one rule per family, weight and unicode subset, which is
  // 136 files and about 5.6 MB. Only the subsets this site actually sets type
  // in are kept: Latin (whose optimised range covers the ASCII letters) and
  // kana, for the Japanese lines.
  // Google writes the Latin subset as the wildcard `U+??` (meaning U+0000-00FF)
  // rather than spelling the range out, so the test has to be per-token —
  // matching a substring would also catch `U+1F??`, the emoji block.
  const wanted = (range) =>
    range
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .some(
        (t) =>
          t === 'U+??' ||
          t === 'U+0-FF' ||
          t === 'U+0000-00FF' ||
          /^U\+41(-|$)/.test(t) || // Noto's optimised Latin carries A-M here
          /^U\+(3041|30A1)/.test(t), // hiragana and katakana
      );

  let embedded = 0;
  let dropped = 0;

  css = css.replace(/@font-face\s*\{[^}]*\}/g, (block) => {
    const range = /unicode-range:([^;}]*)/.exec(block);
    // The three fallback-metric rules carry no range and no file; keep them.
    if (!range) return block;
    if (!wanted(range[1])) {
      dropped += 1;
      return '';
    }
    const url = /url\(\.\.\/media\/([^)]+)\)/.exec(block);
    if (!url) return block;
    try {
      const file = readFileSync(resolve(ROOT, '.next/static/media', url[1]));
      embedded += 1;
      return block.replace(
        url[0],
        `url(data:font/woff2;base64,${file.toString('base64')})`,
      );
    } catch {
      dropped += 1;
      return '';
    }
  });
  console.log(`  fonts: embedded ${embedded}, dropped ${dropped} unused subsets`);

  // ── Chrome, taken once from the home page ──────────────────
  await page.evaluate(prepare, categories);
  const header = await page.evaluate(() => document.querySelector('header').outerHTML);
  const footer = await page.evaluate(() => document.querySelector('footer').outerHTML);

  // ── Each page's <main> ─────────────────────────────────────
  const mains = {};
  for (const { path, id } of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.evaluate(prepare, categories);
    mains[id] = await page.evaluate(() => document.querySelector('main').innerHTML);
    process.stdout.write(`  captured ${path}\n`);
  }

  // ── The four-Cs panels ─────────────────────────────────────
  // Only the live panel is ever in the DOM, so each is collected by clicking
  // its tab. All four ship and the preview toggles between them.
  await page.goto(`${BASE}/guide`, { waitUntil: 'networkidle' });
  const panels = {};
  for (const key of ['cut', 'colour', 'clarity', 'carat']) {
    await page.click(`#tab-${key}`);
    await page.waitForTimeout(450);
    await page.evaluate(prepare, categories);
    panels[key] = await page.evaluate((k) => {
      const el = document.querySelector(`#panel-${k}`);
      el.removeAttribute('style');
      el.setAttribute('data-panel', k);
      return el.outerHTML;
    }, key);
  }

  // Swap the single captured panel for all four. The placeholder is inserted
  // in the page so the splice does not depend on matching generated markup.
  await page.evaluate(() => {
    const p = document.querySelector('[role="tabpanel"]');
    if (p) p.replaceWith(document.createComment('PV_PANELS'));
  });
  mains.guide = (await page.evaluate(() => document.querySelector('main').innerHTML)).replace(
    '<!--PV_PANELS-->',
    Object.values(panels).join('\n'),
  );

  await browser.close();

  // A file opened straight off disk has no charset declaration, so a browser
  // falls back to windows-1252 and every em dash and kana turns to mojibake.
  // Escaping non-ASCII in the markup makes the output encoding-independent.
  // The stylesheet is pure ASCII already, and the script below is written to
  // stay that way.
  const esc = (html) =>
    html.replace(/[\u0080-\uFFFF]/g, (c) => `&#${c.charCodeAt(0)};`);

  const body = PAGES.map(
    ({ id }) =>
      `<div class="pv-page" data-page="${id}"${id === 'home' ? '' : ' hidden'}><main>${esc(
        mains[id],
      )}</main></div>`,
  ).join('\n');

  const html = `<title>Saii Jewels</title>
<style>
${css}
/* next/font sets these variables through a generated class on <html>, which
   this file has no control over, so they are declared here instead. The
   families resolve to the faces embedded above. */
:root{
  --font-display:'Cormorant Garamond','Times New Roman',serif;
  --font-sans:'Inter',system-ui,sans-serif;
  --font-jp:'Noto Sans JP',system-ui,sans-serif;
}
body{font-family:var(--font-sans);background:#F7F4EE;color:#3A3733;margin:0}
.pv-page[hidden],[data-panel][hidden]{display:none!important}
.pv-note{
  position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);z-index:80;
  display:flex;align-items:center;gap:.6rem;white-space:nowrap;
  background:rgba(11,11,12,.9);color:#F7F4EE;backdrop-filter:blur(8px);
  padding:.5rem .9rem;border:1px solid rgba(219,179,0,.35);
  font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;
}
.pv-note b{color:#DBB300;font-weight:500}
.pv-note button{
  background:none;border:0;color:#F7F4EE;opacity:.5;cursor:pointer;
  font:inherit;letter-spacing:inherit;padding:0 0 0 .4rem;
}
.pv-note button:hover{opacity:1}
@media (max-width:640px){.pv-note{font-size:.52rem;padding:.45rem .7rem}}
</style>

${esc(header)}
${body}
${esc(footer)}

<div class="pv-note" id="pv-note">
  <span><b>Preview</b> &middot; Saii Jewels &middot; static snapshot</span>
  <button type="button" aria-label="Dismiss">&#10005;</button>
</div>

<script>
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('header');
  var pages = [].slice.call(document.querySelectorAll('.pv-page'));
  var current = 'home';

  function idFor(href) {
    var p = (href || '').split('#')[0].split('?')[0];
    if (p === '/' || p === '') return 'home';
    return p.replace(/^\\//, '').replace(/\\/$/, '').replace(/\\//g, '-');
  }

  /* -- Header colour states -------------------------------- */
  // The real Nav swaps these classes on scroll and per route; the preview has
  // to do the same or the links go white-on-ivory off the home page.
  function paintHeader() {
    if (!header) return;
    var over = current === 'home' && window.scrollY <= 24;
    header.className = 'fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-silk ' +
      (over ? 'bg-transparent py-7'
            : 'bg-ivory/90 py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md');

    header.querySelectorAll('[data-pv="navlink"]').forEach(function (a) {
      var on = idFor(a.getAttribute('href')) === current;
      a.className = 'link-rule font-sans text-[0.68rem] uppercase tracking-wide2 transition-colors duration-500 ' +
        (over ? 'text-ivory/80 hover:text-gold' : 'text-ink hover:text-gold-deep') +
        (on ? ' !text-gold-deep' : '');
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    header.querySelectorAll('[data-pv="tel"]').forEach(function (a) {
      a.className = 'hidden font-sans text-[0.68rem] uppercase tracking-wide2 transition-colors duration-500 xl:block ' +
        (over ? 'text-gold' : 'text-gold-deep');
    });
    header.querySelectorAll('[data-pv="monogram"]').forEach(function (s) {
      s.setAttribute('class', 'h-9 w-auto transition-colors duration-700 ' + (over ? 'text-gold' : 'text-gold-deep'));
    });
    header.querySelectorAll('[data-pv="wordmark"]').forEach(function (s) {
      s.className = 'hidden font-display text-lg tracking-wide2 transition-colors duration-700 sm:block ' +
        (over ? 'text-ivory' : 'text-onyx');
    });
    var open = burger && burger.getAttribute('aria-expanded') === 'true';
    header.querySelectorAll('[data-pv="bar"]').forEach(function (s, i) {
      s.className = 'block h-px w-6 transition-all duration-500 ease-silk ' +
        ((open || over) ? 'bg-ivory' : 'bg-onyx') +
        (open && i === 0 ? ' translate-y-[4px] rotate-45' : '') +
        (open && i === 1 ? ' -translate-y-[4px] -rotate-45' : '');
    });
  }

  /* -- Scroll reveal --------------------------------------- */
  var io = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver(function (es, obs) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.setAttribute('data-reveal', 'in');
          obs.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    : null;

  // Nothing inside a hidden page can intersect, so each page is observed again
  // whenever it is shown.
  function observeReveals() {
    var live = document.querySelector('.pv-page:not([hidden])');
    if (!live) return;
    live.querySelectorAll('[data-reveal]:not([data-reveal="in"])').forEach(function (el) {
      if (io) io.observe(el); else el.setAttribute('data-reveal', 'in');
    });
  }

  /* -- Parallax -------------------------------------------- */
  var frame = 0;
  function applyParallax() {
    frame = 0;
    if (reduce) return;
    var h = window.innerHeight;
    document.querySelectorAll('[data-pv-parallax]').forEach(function (el) {
      if (!el.offsetParent) return;
      var r = el.getBoundingClientRect();
      // Big decorative layers drift further than panels, matching the source.
      var speed = el.clientHeight > 320 ? 0.08 : 0.06;
      var offset = r.top + r.height / 2 - h / 2;
      el.style.transform = 'translate3d(0,' + (-offset * speed).toFixed(2) + 'px,0)';
    });
  }

  /* -- Router ---------------------------------------------- */
  function show(id, hash) {
    if (!pages.some(function (p) { return p.dataset.page === id; })) id = 'home';
    pages.forEach(function (p) { p.hidden = p.dataset.page !== id; });
    current = id;
    closeDrawer();
    observeReveals();
    paintHeader();
    applyParallax();
    if (hash) {
      var t = document.querySelector('.pv-page:not([hidden]) ' + hash);
      if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (/^(https?:|mailto:|tel:)/.test(href)) return;
    e.preventDefault();
    show(idFor(href), href.indexOf('#') > -1 ? '#' + href.split('#')[1] : null);
  });

  window.addEventListener('scroll', function () {
    paintHeader();
    if (!frame) frame = requestAnimationFrame(applyParallax);
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (!frame) frame = requestAnimationFrame(applyParallax);
  });

  /* -- Mobile drawer --------------------------------------- */
  var burger = header && header.querySelector('button[aria-expanded]');
  var drawer = header && header.querySelector('.fixed.inset-0');
  function setDrawer(open) {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('pointer-events-auto', open);
    drawer.classList.toggle('opacity-100', open);
    drawer.classList.toggle('pointer-events-none', !open);
    drawer.classList.toggle('opacity-0', !open);
    drawer.querySelectorAll('a').forEach(function (a, i) {
      a.style.transitionDelay = open ? (120 + i * 70) + 'ms' : '0ms';
      a.style.opacity = open ? '1' : '0';
      a.style.transform = open ? 'none' : 'translateY(14px)';
    });
    document.body.style.overflow = open ? 'hidden' : '';
    paintHeader();
  }
  function closeDrawer() { setDrawer(false); }
  if (burger) {
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
  }

  /* -- Four-Cs tabs ---------------------------------------- */
  var panels = document.querySelectorAll('[data-panel]');
  if (panels.length) {
    var tabs = document.querySelectorAll('[id^="tab-"]');
    var setTab = function (key) {
      panels.forEach(function (p) { p.hidden = p.dataset.panel !== key; });
      tabs.forEach(function (b) {
        var on = b.id === 'tab-' + key;
        b.setAttribute('aria-selected', String(on));
        b.className = 'group border px-7 py-4 text-left transition-all duration-500 ease-silk ' +
          (on ? 'border-gold bg-gold/10' : 'border-ivory/15 hover:border-gold/50 hover:bg-ivory/[0.03]');
        var label = b.querySelector('span');
        if (label) {
          label.className = 'block font-display text-2xl transition-colors duration-500 ' +
            (on ? 'text-gold' : 'text-ivory/70 group-hover:text-ivory');
        }
      });
      observeReveals();
    };
    tabs.forEach(function (b) {
      b.addEventListener('click', function () { setTab(b.id.replace('tab-', '')); });
    });
    setTab('cut');
  }

  /* -- Pieces filter --------------------------------------- */
  var piecesPage = document.querySelector('.pv-page[data-page="pieces"]');
  if (piecesPage) {
    var buttons = piecesPage.querySelectorAll('button[aria-pressed]');
    var cards = piecesPage.querySelectorAll('a[data-pv-category]');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var want = b.textContent.trim().toLowerCase();
        buttons.forEach(function (o) {
          var on = o === b;
          o.setAttribute('aria-pressed', String(on));
          o.className = 'border px-6 py-3 font-sans text-[0.66rem] uppercase tracking-wide2 transition-all duration-500 ease-silk ' +
            (on ? 'border-gold bg-gold text-onyx'
                : 'border-ivory-300 text-muted hover:border-gold/60 hover:text-gold-deep');
        });
        cards.forEach(function (c) {
          var cat = (c.dataset.pvCategory || '').toLowerCase();
          c.style.display = (want === 'all' || cat === want) ? '' : 'none';
        });
      });
    });
  }

  /* -- Counters -------------------------------------------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es, obs) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var el = e.target;
        var target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        var start = performance.now();
        (function tick(now) {
          var t = Math.min((now - start) / 1400, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.display span').forEach(function (el) {
      if (/^\\d+$/.test(el.textContent.trim())) cio.observe(el);
    });
  }

  /* -- Preview badge --------------------------------------- */
  var note = document.getElementById('pv-note');
  if (note) note.querySelector('button').addEventListener('click', function () { note.remove(); });

  observeReveals();
  paintHeader();
  applyParallax();
})();
</script>
`;

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, html);
  console.log(`\nwrote ${OUT} — ${(html.length / 1024).toFixed(0)} KB`);
};

main();
