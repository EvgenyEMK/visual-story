'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, ComponentSize } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';

interface CTAButtonProps extends EntranceProps {
  /** Button label text. */
  text: string;
  /** Gradient start color. */
  gradientFrom?: string;
  /** Gradient end color. */
  gradientTo?: string;
  /** Size preset. */
  size?: ComponentSize;
  /** Show shimmer effect. */
  shimmer?: boolean;
  /** Additional class names. */
  className?: string;
  /** Click handler. */
  onClick?: () => void;
}

const sizeClasses: Record<ComponentSize, string> = {
  sm: 'px-[0.75em] py-[0.375em] text-[0.625em]',
  md: 'px-[1.25em] py-[0.5em] text-[0.75em]',
  lg: 'px-[1.5em] py-[0.625em] text-[0.875em]',
  xl: 'px-[2em] py-[0.75em] text-[1em]',
};

export function CTAButton({
  text,
  gradientFrom = '#3b82f6',
  gradientTo = '#8b5cf6',
  size = 'md',
  shimmer = false,
  entrance = 'none',
  delay = 0,
  duration,
  className,
  onClick,
}: CTAButtonProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  return (
    <motion.button
      className={cn(
        'relative rounded-[0.5em] font-semibold text-white overflow-hidden cursor-pointer',
        sizeClasses[size],
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {text}
      {shimmer && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'slide-ui-shimmer 2s ease-in-out infinite',
          }}
        />
      )}
    </motion.button>
  );
}
