'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky contents rail for the education page.
 *
 * A reference page is scanned, not read straight through, so the sections
 * stay visible and the current one is marked as you scroll. Collapses to a
 * horizontal scroller under the header on narrow screens.
 */
export default function Contents({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    // A scroll listener rather than an IntersectionObserver: the sections are
    // tall, so an observer fires only when one enters or leaves the viewport
    // and never while you scroll through the middle of a long one — which is
    // most of the time on this page.
    let frame = 0;
    const update = () => {
      frame = 0;
      // The last section whose top has passed under the header is the one
      // being read.
      let current = targets[0];
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= 160) current = el;
      }
      // At the very bottom the last section may never reach the line, so the
      // final entry wins once the page is scrolled to the end.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = targets[targets.length - 1];
      }
      setActive(current.id);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
      <p className="eyebrow mb-5 hidden lg:block">Contents</p>
      <ul
        className="-mx-[var(--shell-x)] flex gap-6 overflow-x-auto px-[var(--shell-x)] pb-3
                   lg:mx-0 lg:flex-col lg:gap-3.5 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={on ? 'true' : undefined}
                className={`block whitespace-nowrap font-sans text-[0.68rem] uppercase tracking-wide2 transition-colors duration-500 ${
                  on ? 'text-gold-deep' : 'text-muted hover:text-onyx'
                }`}
              >
                <span
                  className={`mr-3 hidden h-px w-5 align-middle transition-all duration-500 ease-silk lg:inline-block ${
                    on ? 'bg-gold w-8' : 'bg-ivory-300'
                  }`}
                />
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
