'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { renderIcon } from '../render-icon';

export interface StackCardItem {
  icon: IconProp;
  title: string;
  subtitle?: string;
  color?: AccentColor;
}

interface StackOfCardsProps {
  /** Cards in the stack (first = top). */
  items: StackCardItem[];
  /** Card width in pixels. */
  cardWidth?: number;
  /** Card height in pixels. */
  cardHeight?: number;
  /** Additional class names. */
  className?: string;
}

export function StackOfCards({
  items,
  cardWidth = 160,
  cardHeight = 100,
  className,
}: StackOfCardsProps) {
  const [top, setTop] = useState(0);

  const cycle = () => setTop((t) => (t + 1) % items.length);

  return (
    <div
      className={cn('relative flex items-center justify-center w-full h-full cursor-pointer', className)}
      style={{ perspective: '800px' }}
      onClick={cycle}
    >
      {items.map((item, rawI) => {
        const i = (rawI - top + items.length) % items.length;
        const c = item.color ?? '#3b82f6';

        return (
          <motion.div
            key={`${item.title}-${rawI}`}
            className="absolute rounded-xl flex flex-col items-center justify-center gap-2 shadow-xl"
            style={{
              width: cardWidth,
              height: cardHeight,
              backgroundColor: `${c}15`,
              border: `1px solid ${c}30`,
              backfaceVisibility: 'hidden',
            }}
            animate={{
              zIndex: items.length - i,
              rotateX: i === 0 ? 0 : 5,
              translateZ: i === 0 ? 20 : -i * 15,
              translateY: i * 6,
              opacity: Math.max(0.3, 1 - i * 0.25),
              scale: i === 0 ? 1 : 1 - i * 0.05,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderIcon(item.icon, { size: 28, color: `${c}cc` })}
            <span className="text-white/90 text-xs font-bold">{item.title}</span>
            {item.subtitle && (
              <span className="text-white/40 text-[8px]">{item.subtitle}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
