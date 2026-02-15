'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, ComponentSize } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';

interface QuoteBlockProps extends EntranceProps {
  /** The quote text. */
  quote: string;
  /** Attribution (e.g. '— Steve Jobs'). */
  attribution?: string;
  /** Size preset. */
  size?: ComponentSize;
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<ComponentSize, { quote: string; attr: string }> = {
  sm: { quote: 'text-[0.75em]', attr: 'text-[0.5625em]' },
  md: { quote: 'text-[0.875em]', attr: 'text-[0.625em]' },
  lg: { quote: 'text-[1em]', attr: 'text-[0.75em]' },
  xl: { quote: 'text-[1.125em]', attr: 'text-[0.875em]' },
};

export function QuoteBlock({
  quote,
  attribution,
  size = 'md',
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: QuoteBlockProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeClasses[size];

  return (
    <motion.blockquote
      className={cn('flex flex-col gap-[0.75em] px-[1.5em]', className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div className="w-[2em] h-[0.25em] rounded-full bg-blue-500/40" />
      <p className={cn(s.quote, 'text-white/90 italic leading-relaxed font-serif')}>
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <cite className={cn(s.attr, 'text-white/40 not-italic')}>
          {attribution}
        </cite>
      )}
    </motion.blockquote>
  );
}
