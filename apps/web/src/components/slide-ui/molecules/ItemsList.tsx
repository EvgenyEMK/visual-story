'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, StaggerProps, ComponentSize, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';
import { em } from '../units';

// ---------------------------------------------------------------------------
// Item types
// ---------------------------------------------------------------------------

/** A single list item with an icon and text. */
export interface ListItem {
  /** Unique key. */
  id: string;
  /** Icon to display (emoji, Lucide component, ReactNode, etc.). */
  icon?: IconProp;
  /** Primary text. */
  text: string;
  /** Optional secondary / description text. */
  description?: string;
  /** Accent color for the icon area. */
  color?: AccentColor;
  /** Whether the item is checked / active. */
  checked?: boolean;
  /** Nested sub-items (indented). */
  children?: ListItem[];
}

/** A section header that groups items visually. */
export interface ListHeader {
  /** Unique key. */
  id: string;
  /** Header text (e.g. "Project 1"). */
  text: string;
  /** Accent color for the header indicator. */
  color?: AccentColor;
}

/** A row in the list — either a header or an item. */
export type ListRow = (ListItem & { kind?: 'item' }) | (ListHeader & { kind: 'header' });

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ItemsListProps extends StaggerProps {
  /** Rows to render. Headers use `kind: 'header'`, items default to `kind: 'item'`. */
  items: ListRow[];
  /** Size preset. */
  size?: ComponentSize;
  /** Show a left accent bar on each item. */
  showAccentBar?: boolean;
  /** Additional class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Size presets
// ---------------------------------------------------------------------------

const sizeConfig: Record<ComponentSize, {
  icon: number; iconBox: number;
  title: string; desc: string; header: string;
  gap: string; indent: number; pad: string;
}> = {
  sm: { icon: 12, iconBox: 22, title: 'text-[0.5625em]', desc: 'text-[0.4375em]', header: 'text-[0.625em] font-bold', gap: 'gap-[0.25em]', indent: 20, pad: 'py-[0.25em] px-[0.375em]' },
  md: { icon: 16, iconBox: 28, title: 'text-[0.6875em]', desc: 'text-[0.5625em]', header: 'text-[0.75em] font-bold', gap: 'gap-[0.375em]', indent: 28, pad: 'py-[0.375em] px-[0.5em]' },
  lg: { icon: 20, iconBox: 34, title: 'text-[0.75em]', desc: 'text-[0.625em]', header: 'text-[0.875em] font-bold', gap: 'gap-[0.5em]', indent: 36, pad: 'py-[0.5em] px-[0.75em]' },
  xl: { icon: 24, iconBox: 40, title: 'text-[0.875em]', desc: 'text-[0.75em]', header: 'text-[1em] font-bold', gap: 'gap-[0.625em]', indent: 44, pad: 'py-[0.625em] px-[1em]' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ItemsList({
  items,
  size = 'md',
  showAccentBar = false,
  entrance = 'none',
  delay = 0,
  duration,
  stagger = 0.08,
  className,
}: ItemsListProps) {
  const s = sizeConfig[size];

  /** Flatten items + children into a render list with depth. */
  function flattenRows(rows: ListRow[], depth = 0): Array<{ row: ListRow; depth: number; index: number }> {
    const result: Array<{ row: ListRow; depth: number; index: number }> = [];
    for (const row of rows) {
      result.push({ row, depth, index: result.length });
      // If it's an item with children, recurse
      if (row.kind !== 'header' && 'children' in row && row.children) {
        const sub = flattenRows(
          row.children.map((c) => ({ ...c, kind: 'item' as const })),
          depth + 1,
        );
        for (const s of sub) {
          result.push({ ...s, index: result.length });
        }
      }
    }
    return result;
  }

  const flat = flattenRows(items);

  return (
    <div className={cn('flex flex-col', s.gap, className)}>
      {flat.map(({ row, depth, index }) => {
        const itemDelay = delay + index * stagger;
        const motion$ = getEntranceMotion(entrance, itemDelay, duration);
        const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
          ? entranceVariants[entrance as keyof typeof entranceVariants]
          : undefined;

        // Header row
        if (row.kind === 'header') {
          const h = row as ListHeader;
          return (
            <motion.div
              key={h.id}
              className={cn('flex items-center gap-[0.375em]', s.pad)}
              style={{ paddingLeft: em(depth * s.indent) }}
              variants={variants}
              initial={motion$?.initial}
              animate={motion$?.animate}
              transition={motion$?.transition}
            >
              {h.color && (
                <div
                  className="rounded-[0.125em] shrink-0"
                  style={{ width: em(3), height: em(s.iconBox * 0.7), backgroundColor: h.color }}
                />
              )}
              <span className={cn(s.header, 'text-white/90')}>{h.text}</span>
            </motion.div>
          );
        }

        // Item row
        const item = row as ListItem;
        const accentColor = item.color ?? '#3b82f6';

        return (
          <motion.div
            key={item.id}
            className={cn(
              'flex items-start gap-[0.5em] rounded-[0.5em]',
              s.pad,
              item.checked ? 'opacity-70' : 'opacity-100',
            )}
            style={{ paddingLeft: em(depth * s.indent) }}
            variants={variants}
            initial={motion$?.initial}
            animate={motion$?.animate}
            transition={motion$?.transition}
          >
            {/* Icon / Checkbox area */}
            <div
              className="flex items-center justify-center shrink-0 rounded-[0.375em]"
              style={{
                width: em(s.iconBox),
                height: em(s.iconBox),
                backgroundColor: `${accentColor}15`,
                border: `1px solid ${accentColor}25`,
              }}
            >
              {item.icon
                ? renderIcon(item.icon, { size: em(s.icon), color: `${accentColor}cc` })
                : (
                  <div
                    className="rounded-[0.125em]"
                    style={{
                      width: em(s.icon * 0.65),
                      height: em(s.icon * 0.65),
                      backgroundColor: item.checked ? accentColor : 'transparent',
                      border: `1.5px solid ${accentColor}60`,
                      borderRadius: em(3),
                    }}
                  />
                )}
            </div>

            {/* Text area */}
            <div className="flex flex-col gap-[0.125em] min-w-0 pt-[0.125em]">
              {showAccentBar && (
                <div
                  className="absolute left-0 top-[0.25em] bottom-[0.25em] rounded-full"
                  style={{ width: em(2), backgroundColor: accentColor }}
                />
              )}
              <span
                className={cn(
                  s.title,
                  'font-medium text-white/85',
                  item.checked && 'line-through text-white/50',
                )}
              >
                {item.text}
              </span>
              {item.description && (
                <span className={cn(s.desc, 'text-white/45 leading-relaxed')}>
                  {item.description}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
