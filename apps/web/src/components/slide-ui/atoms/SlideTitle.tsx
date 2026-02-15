'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, ComponentSize } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';

interface SlideTitleProps extends EntranceProps {
  /** Main heading text. */
  text: string;
  /** Optional subtitle below the heading. */
  subtitle?: string;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Heading size preset. */
  size?: ComponentSize;
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<ComponentSize, { heading: string; subtitle: string }> = {
  sm: { heading: 'text-[0.875em] font-bold', subtitle: 'text-[0.625em]' },
  md: { heading: 'text-[1.125em] font-bold tracking-tight', subtitle: 'text-[0.75em]' },
  lg: { heading: 'text-[1.5em] font-black tracking-tight', subtitle: 'text-[0.875em]' },
  xl: { heading: 'text-[2.25em] font-black tracking-tight', subtitle: 'text-[1em]' },
};

export function SlideTitle({
  text,
  subtitle,
  align = 'left',
  size = 'md',
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: SlideTitleProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeClasses[size];
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <motion.div
      className={cn('flex flex-col gap-[0.25em]', alignClass, className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <h2 className={cn(s.heading, 'text-white/90')}>{text}</h2>
      {subtitle && (
        <p className={cn(s.subtitle, 'text-white/50')}>{subtitle}</p>
      )}
    </motion.div>
  );
}
