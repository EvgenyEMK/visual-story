'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, StaggerProps, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { FeatureCard } from '../molecules/FeatureCard';

export interface GridItem {
  icon: IconProp;
  title: string;
  description?: string;
  color?: AccentColor;
}

interface GridOfCardsProps extends StaggerProps {
  /** Items to display in the grid. */
  items: GridItem[];
  /** Number of columns. Default: auto-fit based on item count. */
  columns?: number;
  /** Gap between items in pixels. */
  gap?: number;
  /** Card size. */
  cardSize?: 'sm' | 'md' | 'lg' | 'xl';
  /** Card direction. */
  cardDirection?: 'vertical' | 'horizontal';
  /** Additional class names. */
  className?: string;
}

function getAutoColumns(count: number): number {
  if (count <= 2) return count;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function GridOfCards({
  items,
  columns,
  gap = 16,
  cardSize = 'md',
  cardDirection = 'vertical',
  entrance = 'none',
  delay = 0,
  duration,
  stagger = 0.1,
  className,
}: GridOfCardsProps) {
  const cols = columns ?? getAutoColumns(items.length);
  const containerMotion = getEntranceMotion('fade', delay, 0.3);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  return (
    <motion.div
      className={cn('grid w-full', className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap,
      }}
      variants={variants ? undefined : undefined}
      initial={containerMotion?.initial}
      animate={containerMotion?.animate}
      transition={containerMotion?.transition}
    >
      {items.map((item, i) => (
        <FeatureCard
          key={`${item.title}-${i}`}
          icon={item.icon}
          title={item.title}
          description={item.description}
          color={item.color ?? '#3b82f6'}
          size={cardSize}
          direction={cardDirection}
          entrance={entrance}
          delay={delay + i * stagger}
          duration={duration}
        />
      ))}
    </motion.div>
  );
}
