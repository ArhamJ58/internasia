'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { company, nav } from '@/lib/content';
import Monogram from './Monogram';

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The home hero is dark, so the bar starts transparent there and only
  // takes on its ivory background once the page has been scrolled.
  const overHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation, and lock the page behind it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-silk ${
        overHero
          ? 'bg-transparent py-7'
          : 'bg-ivory/90 py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md'
      }`}
    >
      <div className="shell flex items-center justify-between gap-8">
        <Link
          href="/"
          aria-label={`${company.name} — home`}
          className="group flex items-center gap-3.5"
        >
          <Monogram
            className={`h-9 w-auto transition-colors duration-700 ${
              overHero ? 'text-gold' : 'text-gold-deep'
            }`}
          />
          <span
            className={`hidden font-display text-lg tracking-wide2 transition-colors duration-700 sm:block ${
              overHero ? 'text-ivory' : 'text-onyx'
            }`}
          >
            SAII JEWELS
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Main">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`link-rule font-sans text-[0.68rem] uppercase tracking-wide2 transition-colors duration-500 ${
                  overHero
                    ? 'text-ivory/80 hover:text-gold'
                    : 'text-ink hover:text-gold-deep'
                } ${active ? '!text-gold-deep' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={`tel:${company.tel.replace(/-/g, '')}`}
            className={`hidden font-sans text-[0.68rem] uppercase tracking-wide2 transition-colors duration-500 xl:block ${
              overHero ? 'text-gold' : 'text-gold-deep'
            }`}
          >
            {company.tel}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`block h-px w-6 transition-all duration-500 ease-silk ${
                open ? 'bg-ivory' : overHero ? 'bg-ivory' : 'bg-onyx'
              } ${open && i === 0 ? 'translate-y-[4px] rotate-45' : ''} ${
                open && i === 1 ? '-translate-y-[4px] -rotate-45' : ''
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-onyx transition-all duration-700 ease-silk lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="shell flex h-full flex-col justify-center gap-2">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-4xl font-light text-ivory transition-colors duration-500 hover:text-gold sm:text-5xl"
              style={{
                transitionDelay: open ? `${120 + i * 70}ms` : '0ms',
                opacity: open ? 1 : 0,
                transform: open ? 'none' : 'translateY(14px)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-10 space-y-1 font-sans text-xs tracking-wide2 text-ivory/60">
            <a href={`tel:${company.tel.replace(/-/g, '')}`} className="block hover:text-gold">
              {company.tel}
            </a>
            <a href={`mailto:${company.email}`} className="block hover:text-gold">
              {company.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
