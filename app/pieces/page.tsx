import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import PieceGrid from '@/components/PieceGrid';
import { Reveal } from '@/components/Motion';
import { ContactCta } from '@/components/Sections';
import { piecesIntro, priceNote } from '@/lib/pieces';

export const metadata: Metadata = {
  title: 'Pieces',
  description:
    'Settings made to order at the Saii Jewels atelier in Higashi-Ueno, Tokyo — solitaires, eternity bands, step-cut rings, pendants and matched pairs.',
};

export default function PiecesPage() {
  return (
    <>
      <PageHeader eyebrow="Pieces" title="Made to order" lede={piecesIntro} />

      <section className="bg-ivory py-28">
        <div className="shell">
          <PieceGrid />

          <Reveal delay={200}>
            <p className="mx-auto mt-24 max-w-2xl border-t border-ivory-300 pt-10 text-center font-sans text-sm leading-relaxed text-muted">
              {priceNote}
            </p>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
