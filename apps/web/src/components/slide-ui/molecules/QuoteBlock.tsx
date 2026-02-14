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
  sm: { quote: 'text-xs', attr: 'text-[9px]' },
  md: { quote: 'text-sm', attr: 'text-[10px]' },
  lg: { quote: 'text-base', attr: 'text-xs' },
  xl: { quote: 'text-lg', attr: 'text-sm' },
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
      className={cn('flex flex-col gap-3 px-6', className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div className="w-8 h-1 rounded-full bg-blue-500/40" />
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
