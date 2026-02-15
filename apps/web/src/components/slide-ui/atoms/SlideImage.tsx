'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { em } from '../units';

interface SlideImageProps extends EntranceProps {
  /** Image source URL. */
  src: string;
  /** Alt text. */
  alt?: string;
  /** Object fit. */
  fit?: 'cover' | 'contain' | 'fill';
  /** Border radius in pixels. */
  borderRadius?: number;
  /** Width (CSS value). */
  width?: number | string;
  /** Height (CSS value). */
  height?: number | string;
  /** Additional class names. */
  className?: string;
}

export function SlideImage({
  src,
  alt = '',
  fit = 'cover',
  borderRadius = 12,
  width = '100%',
  height = 'auto',
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: SlideImageProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      style={{ borderRadius: em(borderRadius), width: typeof width === 'number' ? em(width) : width, height: typeof height === 'number' ? em(height) : height }}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          borderRadius: em(borderRadius),
        }}
      />
    </motion.div>
  );
}
