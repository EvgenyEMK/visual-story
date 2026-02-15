'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { em } from '../units';
import type { EntranceProps, ComponentSize } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';

interface TitleBarProps extends EntranceProps {
  /** Main heading. */
  title: string;
  /** Subtitle below the heading. */
  subtitle?: string;
  /** Optional icon or emoji displayed before the title text. */
  icon?: string;
  /** Right-side slot content (e.g. status dots, legends). */
  right?: ReactNode;
  /** Size preset. */
  size?: ComponentSize;
  /** Show bottom border. */
  bordered?: boolean;
  /** Additional class names. */
  className?: string;
}

const sizeClasses: Record<ComponentSize, { title: string; subtitle: string; pad: string; iconSize: number }> = {
  sm: { title: 'text-[0.75em] font-bold', subtitle: 'text-[0.5em]', pad: 'px-[1em] pt-[0.75em] pb-[0.5em]', iconSize: 16 },
  md: { title: 'text-[0.875em] font-bold tracking-tight', subtitle: 'text-[0.625em]', pad: 'px-[1.25em] pt-[1em] pb-[0.625em]', iconSize: 20 },
  lg: { title: 'text-[1em] font-bold tracking-tight', subtitle: 'text-[0.75em]', pad: 'px-[1.5em] pt-[1.25em] pb-[0.75em]', iconSize: 24 },
  xl: { title: 'text-[1.25em] font-black tracking-tight', subtitle: 'text-[0.875em]', pad: 'px-[2em] pt-[1.5em] pb-[1em]', iconSize: 28 },
};

export function TitleBar({
  title,
  subtitle,
  icon,
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
      <div className="flex items-start justify-between gap-[1em]">
        <div className="flex items-center gap-[0.625em] min-w-0 flex-1">
          {icon && (
            <span className="shrink-0 flex items-center justify-center" style={{ fontSize: em(s.iconSize) }}>
              {renderIcon(icon, { size: s.iconSize })}
            </span>
          )}
          <div className="flex flex-col gap-[0.125em] min-w-0">
            <h2 className={cn(s.title, 'text-white/90')}>{title}</h2>
            {subtitle && (
              <p className={cn(s.subtitle, 'text-white/40')}>{subtitle}</p>
            )}
          </div>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </motion.div>
  );
}
