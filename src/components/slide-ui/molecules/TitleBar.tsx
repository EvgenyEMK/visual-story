'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, ComponentSize } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';

interface TitleBarProps extends EntranceProps {
  /** Main heading. */
  title: string;
  /** Subtitle below the heading. */
  subtitle?: string;
  /** Right-side slot content (e.g. status dots, legends). */
  right?: ReactNode;
  /** Size preset. */
  size?: ComponentSize;
  /** Show bottom border. */
  bordered?: boolean;
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<ComponentSize, { title: string; subtitle: string; pad: string }> = {
  sm: { title: 'text-xs font-bold', subtitle: 'text-[8px]', pad: 'px-4 pt-3 pb-2' },
  md: { title: 'text-sm font-bold tracking-tight', subtitle: 'text-[10px]', pad: 'px-5 pt-4 pb-2.5' },
  lg: { title: 'text-base font-bold tracking-tight', subtitle: 'text-xs', pad: 'px-6 pt-5 pb-3' },
  xl: { title: 'text-xl font-black tracking-tight', subtitle: 'text-sm', pad: 'px-8 pt-6 pb-4' },
};

export function TitleBar({
  title,
  subtitle,
  right,
  size = 'md',
  bordered = true,
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: TitleBarProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeClasses[size];

  return (
    <motion.div
      className={cn(
        s.pad,
        bordered && 'border-b border-white/5',
        className,
      )}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h2 className={cn(s.title, 'text-white/90')}>{title}</h2>
          {subtitle && (
            <p className={cn(s.subtitle, 'text-white/40')}>{subtitle}</p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </motion.div>
  );
}
