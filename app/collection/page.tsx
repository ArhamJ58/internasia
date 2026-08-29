import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import CollectionGrid from '@/components/CollectionGrid';
import { Reveal } from '@/components/Motion';
import { ContactCta } from '@/components/Sections';
import { collectionIntro, priceNote } from '@/lib/collection';

export const metadata: Metadata = {
  title: 'Collection',
  description:
    'Jewellery and loose stones supplied by Saii Jewels in Okachimachi, Tokyo — solitaires, eternity bands, step-cut rings, pendants, matched pairs and loose diamonds.',
};

export default function CollectionPage() {
  return (
    <>
      <PageHeader eyebrow="Collection" title="What we supply" lede={collectionIntro} />

      <section className="bg-ivory py-24">
        <div className="shell">
          <CollectionGrid />

          <Reveal delay={200}>
            <p className="mx-auto mt-20 max-w-2xl border-t border-ivory-300 pt-9 text-center font-sans text-sm leading-relaxed text-muted">
              {priceNote}
            </p>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
