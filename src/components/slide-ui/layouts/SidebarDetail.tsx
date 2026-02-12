'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { ItemThumbnail } from '../molecules/ItemThumbnail';
import { HeroSpotlight } from '../molecules/HeroSpotlight';

export interface SidebarItem {
  icon: IconProp;
  title: string;
  description?: string;
  color?: AccentColor;
}

interface SidebarDetailProps {
  /** Items to display. */
  items: SidebarItem[];
  /** Sidebar width (CSS value). */
  sidebarWidth?: string;
  /** Initially active index. */
  defaultActive?: number;
  /** Additional class names. */
  className?: string;
}

export function SidebarDetail({
  items,
  sidebarWidth = '180px',
  defaultActive = 0,
  className,
}: SidebarDetailProps) {
  const [active, setActive] = useState(defaultActive);
  const current = items[active];

  return (
    <div className={cn('flex w-full h-full', className)}>
      {/* Sidebar */}
      <div
        className="bg-white/[0.03] border-r border-white/5 py-2 px-1 flex flex-col gap-1 overflow-auto"
        style={{ width: sidebarWidth, flexShrink: 0 }}
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

      {/* Detail area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {current && (
          <HeroSpotlight
            key={active}
            icon={current.icon}
            title={current.title}
            description={current.description}
            color={current.color}
            size="lg"
            entrance="fade"
            duration={0.4}
          />
        )}
      </div>
    </div>
  );
}
