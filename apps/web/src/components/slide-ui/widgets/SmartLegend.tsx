'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { em } from '../units';
import { renderIcon } from '../render-icon';
import { getEntranceMotion, entranceVariants } from '../entrance';
import type { ComponentSize, EntranceType } from '../types';
import type { IconSet } from '@/types/smart-list';
import { getIconSet } from '@/config/icon-sets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** How the legend appears in presentation mode. */
export type LegendVisibility = 'always' | 'edit-only' | 'expandable';

export interface SmartLegendProps {
  /** Icon set ID to display (or pass iconSet directly). */
  iconSetId?: string;
  /** Direct icon set object (overrides iconSetId). */
  iconSet?: IconSet;
  /** Optional secondary icon set (for dual-icon lists). */
  secondaryIconSetId?: string;
  /** Optional title. */
  title?: string;
  /** Size preset. */
  size?: ComponentSize;
  /** Layout direction. */
  direction?: 'vertical' | 'horizontal';
  /** Visibility mode. */
  visibility?: LegendVisibility;
  /** Whether the host is in editing mode. */
  isEditing?: boolean;
  /** Entrance animation. */
  entrance?: EntranceType;
  /** Animation delay. */
  delay?: number;
  /** Stagger between entries. */
  stagger?: number;
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

export function SmartLegend({
  iconSetId,
  iconSet: iconSetProp,
  secondaryIconSetId,
  title,
  size = 'md',
  direction = 'vertical',
  visibility = 'always',
  isEditing = false,
  entrance = 'none',
  delay = 0,
  stagger = 0.06,
  className,
}: SmartLegendProps) {
  const s = sizeConfig[size];
  const isVertical = direction === 'vertical';
  const [expanded, setExpanded] = useState(false);

  // Resolve icon sets
  const primarySet = iconSetProp ?? (iconSetId ? getIconSet(iconSetId) : undefined);
  const secondarySet = secondaryIconSetId ? getIconSet(secondaryIconSetId) : undefined;

  if (!primarySet) return null;

  // Visibility logic
  const isVisible = visibility === 'always'
    || (visibility === 'edit-only' && isEditing)
    || (visibility === 'expandable');

  if (!isVisible && !isEditing) return null;

  // "Edit-only" mode: show with a dashed border indicator
  const isEditOnlyHidden = visibility === 'edit-only' && isEditing;

  // "Expandable" mode in presentation: show collapsed toggle
  const isExpandable = visibility === 'expandable' && !isEditing;

  // Title entrance
  const titleMotion = getEntranceMotion(entrance, delay);
  const titleVariants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  const renderEntries = (set: IconSet, baseDelay: number) =>
    set.entries.map((entry, i) => {
      const entryDelay = baseDelay + i * stagger;
      const motion$ = getEntranceMotion(entrance, entryDelay);
      const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
        ? entranceVariants[entrance as keyof typeof entranceVariants]
        : undefined;

      return (
        <motion.div
          key={entry.id}
          className={cn('flex items-center', s.gap)}
          variants={variants}
          initial={motion$?.initial}
          animate={motion$?.animate}
          transition={motion$?.transition}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{ width: em(s.iconBox), height: em(s.iconBox) }}
          >
            {renderIcon(entry.icon, { size: em(s.icon), color: entry.color })}
          </div>
          <span className={cn(s.label, 'text-white/70 font-medium')}>
            {entry.label}
          </span>
        </motion.div>
      );
    });

  const legendContent = (
    <div className={cn(
      'flex flex-col', s.gap,
      'rounded-[0.75em] bg-white/5 border',
      isEditOnlyHidden ? 'border-dashed border-white/20' : 'border-white/10',
      s.pad,
      className,
    )}>
      {/* Title row */}
      {(title || isEditOnlyHidden) && (
        <motion.div
          className="flex items-center justify-between"
          variants={titleVariants}
          initial={titleMotion?.initial}
          animate={titleMotion?.animate}
          transition={titleMotion?.transition}
        >
          <span className={cn(s.title, 'text-white/60 uppercase tracking-wider')}>
            {title ?? 'Legend'}
          </span>
          {isEditOnlyHidden && (
            <span className={cn(s.label, 'text-white/25 italic')}>
              hidden in presentation
            </span>
          )}
        </motion.div>
      )}

      {/* Primary icon set entries */}
      <div className={cn('flex', isVertical ? 'flex-col' : 'flex-row flex-wrap', s.gap)}>
        {renderEntries(primarySet, delay + stagger)}
      </div>

      {/* Secondary icon set entries (dual icons) */}
      {secondarySet && (
        <>
          <div className="border-t border-white/[0.06] my-[0.125em]" />
          <div className={cn('flex', isVertical ? 'flex-col' : 'flex-row flex-wrap', s.gap)}>
            {renderEntries(secondarySet, delay + stagger * (primarySet.entries.length + 1))}
          </div>
        </>
      )}
    </div>
  );

  // Expandable mode: show a small toggle button in presentation
  if (isExpandable) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            'flex items-center gap-[0.25em] px-[0.5em] py-[0.25em] rounded-[0.5em]',
            'bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors',
            s.label, 'text-white/50',
          )}
        >
          <span style={{ fontSize: em(s.icon) }}>☰</span>
          <span>{title ?? 'Legend'}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.15 }}
            style={{ fontSize: em(s.icon * 0.8), lineHeight: 1 }}
          >
            ▾
          </motion.span>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-[0.25em]"
            >
              {legendContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return legendContent;
}
