import Image from 'next/image';
import Gemstone from './Gemstone';
import type { Piece } from '@/lib/pieces';

/**
 * The stone arrangement for a piece.
 *
 * A solitaire and a full eternity band are both round brilliants, so drawing
 * one stone for each makes two very different pieces look identical. The
 * layout says how the stones are set, not what shape they are.
 */
export default function PieceVisual({
  piece,
  size = 55,
  className,
  priority = false,
  sizes,
}: {
  piece: Piece;
  /** Face size of a single stone, as a percentage of the panel. */
  size?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (piece.image) {
    return (
      <Image
        src={piece.image}
        alt={piece.imageAlt ?? piece.name}
        fill
        sizes={sizes ?? '(min-width: 1024px) 33vw, 100vw'}
        priority={priority}
        className={`object-cover ${className ?? ''}`}
      />
    );
  }

  const stone = (pct: number, key?: number) => (
    <Gemstone
      key={key}
      cut={piece.cut}
      tint={piece.accent}
      style={{ width: `${pct}%`, height: `${pct}%` }}
      className="shrink-0"
    />
  );

  if (piece.layout === 'band') {
    // A row of calibrated stones, tallest in the middle, as a channel reads.
    const scale = [0.5, 0.68, 0.85, 1, 0.85, 0.68, 0.5];
    return (
      <div className={`flex w-full items-center justify-center gap-[1.5%] ${className ?? ''}`}>
        {scale.map((f, i) => (
          <Gemstone
            key={i}
            cut={piece.cut}
            tint={piece.accent}
            style={{ width: `${size * 0.36 * f}%`, height: `${size * 0.36 * f}%` }}
            className="shrink-0"
          />
        ))}
      </div>
    );
  }

  if (piece.layout === 'pair') {
    // Sold and made as a matched pair, so it is drawn as one.
    return (
      <div className={`flex w-full items-center justify-center gap-[6%] ${className ?? ''}`}>
        {stone(size * 0.72, 0)}
        {stone(size * 0.72, 1)}
      </div>
    );
  }

  return (
    <div className={`flex w-full items-center justify-center ${className ?? ''}`}>
      {stone(size)}
    </div>
  );
}
