import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Image from 'next/image';
import Gemstone from '@/components/Gemstone';
import { Reveal, Parallax } from '@/components/Motion';
import { ContactCta } from '@/components/Sections';
import { collections } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Solitaire, emerald, marquise and pear — the four cuts Saii Jewels works in, and how each is set.',
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title="Four cuts"
        lede="We keep the range deliberately narrow. Each of these cuts asks something different of a setting, and each is worked here rather than bought in finished."
      />

      <div className="bg-ivory">
        {collections.map((item, i) => {
          const flipped = i % 2 === 1;
          return (
            <section
              key={item.slug}
              id={item.slug}
              className="scroll-mt-24 border-b border-ivory-300 py-28 last:border-b-0"
            >
              <div
                className={`shell grid items-center gap-16 lg:grid-cols-2 ${
                  flipped ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Stone panel */}
                <Parallax speed={0.07}>
                  <div
                    className="relative flex aspect-square items-center justify-center overflow-hidden"
                    style={{
                      background: `radial-gradient(110% 90% at 50% 35%, ${item.accent}30 0%, transparent 62%), #141416`,
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? item.name}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <Gemstone cut={item.stone} tint={item.accent} className="h-[62%] w-[62%]" />
                    )}
                    <span className="absolute left-7 top-7 font-sans text-[0.6rem] tracking-luxe text-ivory/30">
                      {String(i + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
                    </span>
                  </div>
                </Parallax>

                {/* Copy */}
                <div className={flipped ? 'lg:pr-10' : 'lg:pl-10'}>
                  <Reveal>
                    <p className="font-jp text-[0.66rem] tracking-wide2 text-gold-deep">
                      {item.nameJa}
                    </p>
                  </Reveal>
                  <Reveal delay={80}>
                    <h2 className="display mt-3 text-[clamp(2.4rem,5vw,3.8rem)] text-onyx">
                      {item.name}
                    </h2>
                  </Reveal>
                  <Reveal delay={140}>
                    <p className="mt-4 font-display text-xl italic text-gold-deep">
                      {item.caption}
                    </p>
                  </Reveal>
                  <Reveal delay={200}>
                    <span className="mt-8 block h-px w-16 bg-gold-deep/35" />
                  </Reveal>
                  <Reveal delay={260}>
                    <p className="mt-8 max-w-lg font-sans text-base leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <ContactCta />
    </>
  );
}
