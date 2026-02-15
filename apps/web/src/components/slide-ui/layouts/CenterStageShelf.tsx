'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { em } from '../units';
import { ItemThumbnail } from '../molecules/ItemThumbnail';
import { HeroSpotlight } from '../molecules/HeroSpotlight';

export interface ShelfItem {
  icon: IconProp;
  title: string;
  description?: string;
  color?: AccentColor;
}

interface CenterStageShelfProps {
  /** Items for the shelf. */
  items: ShelfItem[];
  /** Initially active index. */
  defaultActive?: number;
  /** Shelf height in pixels. */
  shelfHeight?: number;
  /** Additional class names. */
  className?: string;
}

export function CenterStageShelf({
  items,
  defaultActive = 0,
  shelfHeight = 56,
  className,
}: CenterStageShelfProps) {
  const [active, setActive] = useState(defaultActive);
  const current = items[active];

  return (
    <div className={cn('flex flex-col w-full h-full', className)}>
      {/* Center stage */}
      <div className="flex-1 flex items-center justify-center relative">
        {current && (
          <HeroSpotlight
            key={active}
            icon={current.icon}
            title={current.title}
            description={current.description}
            color={current.color}
            size="lg"
            entrance="scale-in"
            duration={0.4}
          />
        )}
      </div>

      {/* Bottom shelf */}
      <div
        className="bg-white/[0.03] border-t border-white/5 flex items-center justify-center gap-[0.5em] px-[1em]"
        style={{ height: em(shelfHeight) }}
      >
        {items.map((item, i) => (
          <ItemThumbnail
            key={`${item.title}-${i}`}
            icon={item.icon}
            label={item.title}
            color={item.color}
            active={i === active}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
