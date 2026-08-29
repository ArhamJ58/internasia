'use client';

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';

/* ── Reveal ───────────────────────────────────────────────────
   Fades and lifts its children the first time they scroll into
   view. Motion is defined in globals.css so `prefers-reduced-motion`
   neutralises it in one place.
   ─────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-reveal', 'in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ── Parallax ─────────────────────────────────────────────────
   Translates its children against scroll. `speed` is the fraction
   of scroll distance to travel — negative moves against the page.
   ─────────────────────────────────────────────────────────── */

export function Parallax({
  children,
  speed = 0.15,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Distance of the element's centre from the viewport centre.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(2)}px, 0)`;
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
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

/* ── SplitText ────────────────────────────────────────────────
   Renders a line one character at a time so each can rise on its
   own delay. Spaces keep their width; the whole line is still read
   as one string by assistive tech.
   ─────────────────────────────────────────────────────────── */

export function SplitText({
  text,
  delay = 0,
  stagger = 45,
  className,
  charClassName,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  /** Applied to every character. Gradient text fills must go here rather
   *  than on the wrapper: `background-clip: text` only paints where the
   *  element's own glyphs are, and the wrapper holds no text of its own. */
  charClassName?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          data-char=""
          aria-hidden="true"
          className={charClassName}
          style={{ '--char-delay': `${delay + i * stagger}ms` } as React.CSSProperties}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

/* ── Counter ──────────────────────────────────────────────────
   Counts up to a number once it is on screen. Falls back to the
   plain value for non-numeric marks and under reduced motion.
   ─────────────────────────────────────────────────────────── */

export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const numeric = /^\d+$/.test(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !numeric) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = parseInt(value, 10);
    setShown('0');

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(String(Math.round(target * eased)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, numeric]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

/* ── Cursor glow ──────────────────────────────────────────────
   A soft gold light that trails the pointer across a dark section.
   Pointer-only; never shown on touch or under reduced motion.
   ─────────────────────────────────────────────────────────── */

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setActive(true);

    const el = ref.current;
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
    };

    parent.addEventListener('pointermove', onMove);
    frame = requestAnimationFrame(loop);
    return () => {
      parent.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 -ml-64 -mt-64 h-[32rem] w-[32rem] rounded-full opacity-0 transition-opacity duration-700"
      style={{
        background:
          'radial-gradient(circle, rgba(219,179,0,0.16) 0%, rgba(219,179,0,0.05) 40%, transparent 68%)',
        opacity: active ? 1 : 0,
      }}
    />
  );
}
