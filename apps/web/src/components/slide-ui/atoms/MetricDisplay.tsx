'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, ComponentSize, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';

interface MetricDisplayProps extends EntranceProps {
  /** The main metric value (e.g. '$2.4M', '+34.7%', '1,247'). */
  value: string;
  /** Label above the value. */
  label?: string;
  /** Change delta (e.g. '+27% YoY'). */
  delta?: string;
  /** Direction of the delta for coloring. */
  deltaDirection?: 'up' | 'down' | 'neutral';
  /** Accent color for the value. */
  color?: AccentColor;
  /** Size preset. */
  size?: ComponentSize;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<ComponentSize, { value: string; label: string; delta: string }> = {
  sm: { value: 'text-[1.25em] font-black tabular-nums', label: 'text-[0.5em] uppercase tracking-widest', delta: 'text-[0.5625em]' },
  md: { value: 'text-[1.875em] font-black tabular-nums', label: 'text-[0.625em] uppercase tracking-widest', delta: 'text-[0.75em]' },
  lg: { value: 'text-[2.25em] font-black tabular-nums', label: 'text-[0.75em] uppercase tracking-widest', delta: 'text-[0.875em]' },
  xl: { value: 'text-[3.75em] font-black tabular-nums', label: 'text-[0.875em] uppercase tracking-widest', delta: 'text-[1em]' },
};

const deltaColors = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  neutral: 'text-white/50',
};

export function MetricDisplay({
  value,
  label,
  delta,
  deltaDirection = 'neutral',
  color = '#3b82f6',
  size = 'md',
  align = 'center',
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: MetricDisplayProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeClasses[size];
  const alignClass = align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left';

  return (
    <motion.div
      className={cn('flex flex-col gap-[0.25em]', alignClass, className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      {label && (
        <div className={cn(s.label, 'text-white/50')}>{label}</div>
      )}
      <div className={s.value} style={{ color }}>
        {value}
      </div>
      {delta && (
        <div className="flex items-center gap-[0.25em] mt-[0.125em]">
          {deltaDirection === 'up' && (
            <div className="w-0 h-0 border-l-[0.25em] border-r-[0.25em] border-b-[0.375em] border-transparent border-b-emerald-400" />
          )}
          {deltaDirection === 'down' && (
            <div className="w-0 h-0 border-l-[0.25em] border-r-[0.25em] border-t-[0.375em] border-transparent border-t-rose-400" />
          )}
          <span className={cn('font-semibold', deltaColors[deltaDirection])}>
            {delta}
          </span>
        </div>
      )}
    </motion.div>
  );
}
