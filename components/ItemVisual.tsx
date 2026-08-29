import Image from 'next/image';
import Gemstone from './Gemstone';
import type { Item } from '@/lib/collection';

/**
 * The stone arrangement for a item.
 *
 * A solitaire and a full eternity band are both round brilliants, so drawing
 * one stone for each makes two very different pieces look identical. The
 * layout says how the stones are set, not what shape they are.
 */
export default function ItemVisual({
  item,
  size = 55,
  className,
  priority = false,
  sizes,
}: {
  item: Item;
  /** Face size of a single stone, as a percentage of the panel. */
  size?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (item.image) {
    return (
      <Image
        src={item.image}
        alt={item.imageAlt ?? item.name}
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
      cut={item.cut}
      tint={item.accent}
      style={{ width: `${pct}%`, height: `${pct}%` }}
      className="shrink-0"
    />
  );

  if (item.layout === 'band') {
    // A row of calibrated stones, largest in the middle, as a channel reads.
    // Per-stone width is derived from the row's total rather than set
    // directly, and the total is capped, so the outermost stones cannot be
    // clipped by the panel at any `size` this is called with.
    const scale = [0.5, 0.68, 0.85, 1, 0.85, 0.68, 0.5];
    const gap = 1.5;
    const total = Math.min(size * 1.65, 92);
    const unit = (total - gap * (scale.length - 1)) / scale.reduce((a, b) => a + b, 0);
    return (
      <div className={`flex w-full items-center justify-center ${className ?? ''}`} style={{ gap: `${gap}%` }}>
        {scale.map((f, i) => (
          <Gemstone
            key={i}
            cut={item.cut}
            tint={item.accent}
            style={{ width: `${unit * f}%`, height: `${unit * f}%` }}
            className="shrink-0"
          />
        ))}
      </div>
    );
  }

  if (item.layout === 'loose') {
    // Nothing is set, so the stone gets the whole panel.
    return (
      <div className={`flex w-full items-center justify-center ${className ?? ''}`}>
        {stone(size * 1.15)}
      </div>
    );
  }

  if (item.layout === 'pair') {
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
