'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { renderIcon } from '../render-icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Layout variant for the expanded detail area.
 *
 * - `'simple'`     — Icon + title + optional description centred (original behaviour).
 * - `'two-column'` — Left column: large icon + title.  Right column: `detailContent`.
 */
export type BentoExpandedLayout = 'simple' | 'two-column';

export interface BentoItem {
  icon: IconProp;
  title: string;
  description?: string;
  color?: AccentColor;
  /**
   * Rich content rendered in the expanded detail area.
   * When provided and `expandedLayout` is `'two-column'`, this is rendered
   * in the right column next to the icon + title.
   * When `expandedLayout` is `'simple'`, it replaces the default description.
   */
  detailContent?: ReactNode;
}

interface BentoLayoutProps {
  /** Items to display. */
  items: BentoItem[];
  /** Initially expanded index. */
  defaultExpanded?: number;
  /** Sidebar width (CSS value). */
  sidebarWidth?: string;
  /**
   * Layout variant for the expanded detail area.
   * @default 'simple'
   */
  expandedLayout?: BentoExpandedLayout;
  /** Callback when a different item is expanded. */
  onExpandChange?: (index: number) => void;
  /** Additional class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BentoLayout({
  items,
  defaultExpanded = 0,
  sidebarWidth = '28%',
  expandedLayout = 'simple',
  onExpandChange,
  className,
}: BentoLayoutProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const current = items[expanded];

  const handleExpand = (index: number) => {
    setExpanded(index);
    onExpandChange?.(index);
  };

  return (
    <div className={cn('flex gap-2 w-full h-full p-3', className)}>
      {/* Main expanded area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={expanded}
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                backgroundColor: `${current.color ?? '#3b82f6'}15`,
                border: `1px solid ${current.color ?? '#3b82f6'}30`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {expandedLayout === 'two-column' ? (
                <TwoColumnDetail item={current} />
              ) : (
                <SimpleDetail item={current} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right sidebar grid */}
      <div className="flex flex-col gap-2" style={{ width: sidebarWidth }}>
        {items.map((item, i) => {
          const isActive = i === expanded;
          const c = item.color ?? '#3b82f6';
          return (
            <motion.div
              key={`${item.title}-${i}`}
              className="flex-1 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: isActive ? `${c}30` : `${c}10`,
                border: `1px solid ${isActive ? `${c}50` : `${c}15`}`,
              }}
              whileHover={{ scale: 1.03, borderColor: `${c}40` }}
              onClick={() => handleExpand(i)}
            >
              {renderIcon(item.icon, { size: 16, color: `${c}bb` })}
              <span className="text-white/60 text-[9px] font-medium">{item.title}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components for expanded detail area
// ---------------------------------------------------------------------------

/** Original centred layout: icon → title → description or detailContent. */
function SimpleDetail({ item }: { item: BentoItem }) {
  const c = item.color ?? '#3b82f6';

  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full p-4">
      {renderIcon(item.icon, { size: 40, color: `${c}cc` })}
      <span className="text-white/90 text-sm font-bold">{item.title}</span>
      {item.detailContent ? (
        <div className="w-full max-w-[85%]">{item.detailContent}</div>
      ) : (
        item.description && (
          <span className="text-white/40 text-[10px] px-6 text-center leading-relaxed">
            {item.description}
          </span>
        )
      )}
    </div>
  );
}

/**
 * Two-column expanded layout.
 *
 * Left (~30%): large icon + title (+ optional description).
 * Right (~70%): rich `detailContent`.  Falls back to description when no
 * detailContent is provided.
 */
function TwoColumnDetail({ item }: { item: BentoItem }) {
  const c = item.color ?? '#3b82f6';

  return (
    <div className="flex h-full">
      {/* Left — identity column */}
      <div
        className="flex flex-col items-center justify-center gap-3 shrink-0 p-4"
        style={{ width: '30%', borderRight: `1px solid ${c}20` }}
      >
        {renderIcon(item.icon, { size: 48, color: `${c}cc` })}
        <span className="text-white/90 text-sm font-bold text-center">{item.title}</span>
        {item.description && (
          <span className="text-white/40 text-[10px] text-center leading-relaxed px-2">
            {item.description}
          </span>
        )}
      </div>

      {/* Right — detail content */}
      <div className="flex-1 p-4 overflow-auto">
        {item.detailContent ?? (
          <span className="text-white/30 text-xs italic">No detail content</span>
        )}
      </div>
    </div>
  );
}
