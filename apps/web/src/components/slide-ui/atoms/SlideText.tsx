'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, ComponentSize } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { em } from '../units';

interface SlideTextProps extends EntranceProps {
  /** Text content. */
  text: string;
  /** Size preset. */
  size?: ComponentSize;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Visual weight. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Italic style. */
  italic?: boolean;
  /** Serif font (for quotes). */
  serif?: boolean;
  /** Max width in pixels or CSS value. */
  maxWidth?: number | string;
  /** Text color class or CSS color. */
  color?: string;
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<ComponentSize, string> = {
  sm: 'text-[0.625em] leading-relaxed',
  md: 'text-[0.75em] leading-relaxed',
  lg: 'text-[0.875em] leading-relaxed',
  xl: 'text-[1em] leading-relaxed',
};

const weightClasses: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function SlideText({
  text,
  size = 'md',
  align = 'left',
  weight = 'normal',
  italic = false,
  serif = false,
  maxWidth,
  color,
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: SlideTextProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const textColor = color ?? 'text-white/70';
  const isColorClass = textColor.startsWith('text-');

  return (
    <motion.p
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        alignClass,
        italic && 'italic',
        serif && 'font-serif',
        isColorClass && textColor,
        className,
      )}
      style={{
        maxWidth: typeof maxWidth === 'number' ? em(maxWidth) : maxWidth,
        color: !isColorClass ? textColor : undefined,
        whiteSpace: 'pre-line',
      }}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      {text}
    </motion.p>
  );
}
