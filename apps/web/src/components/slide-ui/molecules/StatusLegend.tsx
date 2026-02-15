'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, StaggerProps, ComponentSize, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';
import { em } from '../units';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single legend entry — icon + label. */
export interface LegendEntry {
  /** Unique key. */
  id: string;
  /** Icon to display (emoji, Lucide component, ReactNode, etc.). */
  icon: IconProp;
  /** Label text for this status. */
  label: string;
  /** Accent color for the icon background. */
  color?: AccentColor;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StatusLegendProps extends StaggerProps {
  /** Legend entries to display. */
  entries: LegendEntry[];
  /** Optional title above the legend (e.g. "Legend" or "Status Key"). */
  title?: string;
  /** Size preset. */
  size?: ComponentSize;
  /** Layout direction for entries. */
  direction?: 'vertical' | 'horizontal';
  /** Show a background card wrapper. */
  showCard?: boolean;
  /** Additional class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Size presets
// ---------------------------------------------------------------------------

const sizeConfig: Record<ComponentSize, {
  icon: number; iconBox: number;
  label: string; title: string;
  gap: string; pad: string;
}> = {
  sm: { icon: 10, iconBox: 18, label: 'text-[0.5em]', title: 'text-[0.5625em] font-semibold', gap: 'gap-[0.25em]', pad: 'p-[0.375em]' },
  md: { icon: 14, iconBox: 24, label: 'text-[0.625em]', title: 'text-[0.6875em] font-semibold', gap: 'gap-[0.375em]', pad: 'p-[0.625em]' },
  lg: { icon: 18, iconBox: 30, label: 'text-[0.75em]', title: 'text-[0.75em] font-bold', gap: 'gap-[0.5em]', pad: 'p-[0.75em]' },
  xl: { icon: 22, iconBox: 36, label: 'text-[0.875em]', title: 'text-[0.875em] font-bold', gap: 'gap-[0.625em]', pad: 'p-[1em]' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatusLegend({
  entries,
  title,
  size = 'md',
  direction = 'vertical',
  showCard = true,
  entrance = 'none',
  delay = 0,
  duration,
  stagger = 0.06,
  className,
}: StatusLegendProps) {
  const s = sizeConfig[size];
  const isVertical = direction === 'vertical';

  // Title entrance
  const titleMotion = getEntranceMotion(entrance, delay, duration);
  const titleVariants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  return (
    <div
      className={cn(
        'flex flex-col',
        s.gap,
        showCard && 'rounded-[0.75em] bg-white/5 border border-white/10',
        showCard && s.pad,
        className,
      )}
    >
      {/* Optional title */}
      {title && (
        <motion.div
          className={cn(s.title, 'text-white/60 uppercase tracking-wider mb-[0.125em]')}
          variants={titleVariants}
          initial={titleMotion?.initial}
          animate={titleMotion?.animate}
          transition={titleMotion?.transition}
        >
          {title}
        </motion.div>
      )}

      {/* Entries */}
      <div className={cn(
        'flex',
        isVertical ? 'flex-col' : 'flex-row flex-wrap',
        s.gap,
      )}>
        {entries.map((entry, i) => {
          const entryDelay = delay + (title ? stagger : 0) + i * stagger;
          const motion$ = getEntranceMotion(entrance, entryDelay, duration);
          const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
            ? entranceVariants[entrance as keyof typeof entranceVariants]
            : undefined;
          const accentColor = entry.color ?? '#3b82f6';

          return (
            <motion.div
              key={entry.id}
              className={cn('flex items-center', s.gap)}
              variants={variants}
              initial={motion$?.initial}
              animate={motion$?.animate}
              transition={motion$?.transition}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center shrink-0 rounded-[0.375em]"
                style={{
                  width: em(s.iconBox),
                  height: em(s.iconBox),
                  backgroundColor: `${accentColor}15`,
                  border: `1px solid ${accentColor}25`,
                }}
              >
                {renderIcon(entry.icon, { size: em(s.icon), color: `${accentColor}cc` })}
              </div>

              {/* Label */}
              <span className={cn(s.label, 'text-white/70 font-medium')}>
                {entry.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
