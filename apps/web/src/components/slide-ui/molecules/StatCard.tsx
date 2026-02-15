'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, AccentColor } from '../types';
import { em } from '../units';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { MetricDisplay } from '../atoms/MetricDisplay';
import { ProgressBar } from '../atoms/ProgressBar';

interface StatCardProps extends EntranceProps {
  /** The main metric value (e.g. '$2.4M'). */
  value: string;
  /** Label above the value. */
  label?: string;
  /** Change delta (e.g. '+27% YoY'). */
  delta?: string;
  /** Direction of the delta. */
  deltaDirection?: 'up' | 'down' | 'neutral';
  /** Accent color. */
  color?: AccentColor;
  /** Optional progress bar value (0–100). */
  progress?: number;
  /** Additional class names. */
  className?: string;
}

export function StatCard({
  value,
  label,
  delta,
  deltaDirection = 'neutral',
  color = '#3b82f6',
  progress,
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: StatCardProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  return (
    <motion.div
      className={cn(
        'rounded-[0.75em] bg-white/5 border border-white/10 p-[1em] flex flex-col gap-[0.5em]',
        className,
      )}
      style={{ borderColor: `${color}20` }}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <MetricDisplay
        value={value}
        label={label}
        delta={delta}
        deltaDirection={deltaDirection}
        color={color}
        size="md"
        align="left"
      />
      {progress != null && (
        <ProgressBar
          value={progress}
          color={color}
          height={6}
          entrance={entrance !== 'none' ? 'fade' : 'none'}
          delay={delay + 0.3}
        />
      )}
    </motion.div>
  );
}
