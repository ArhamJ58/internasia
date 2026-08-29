import type { ReactNode } from 'react';
import Monogram from './Monogram';
import { Reveal, SplitText } from './Motion';

/** Dark banner that opens every interior page. */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-onyx pb-24 pt-44">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 90% at 15% 0%, rgba(219,179,0,0.14) 0%, transparent 55%)',
        }}
      />
      <Monogram
        className="pointer-events-none absolute -right-16 -top-16 h-[28rem] w-auto text-gold/[0.055]"
        title=""
      />

      <div className="shell relative">
        <p className="eyebrow-on-dark mb-7 flex items-center gap-4">
          <span className="h-px w-10 bg-gold/50" />
          {eyebrow}
        </p>

        <h1 className="display text-[clamp(2.8rem,8vw,6rem)] text-ivory">
          <SplitText text={title} delay={200} stagger={34} />
        </h1>

        {lede && (
          <Reveal delay={420}>
            <p className="mt-9 max-w-2xl font-sans text-base leading-relaxed text-ivory/55">
              {lede}
            </p>
          </Reveal>
        )}

        {children}
      </div>
    </section>
  );
}
