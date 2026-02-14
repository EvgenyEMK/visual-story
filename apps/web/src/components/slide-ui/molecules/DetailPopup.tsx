'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { renderIcon } from '../render-icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Layout variant for the popup card content.
 *
 * - `'simple'`     — Icon + title + description centred (original behaviour).
 * - `'two-column'` — Left column: icon + title + description.
 *                     Right column: `children` (rich detail content).
 */
export type DetailPopupLayout = 'simple' | 'two-column';

/**
 * Width preset for the popup.
 *
 * - `'compact'` — 200px (original size, good for quick tooltips).
 * - `'wide'`    — 70% of slide width (good for expanded detail views).
 * - `'full'`    — 90% of slide width.
 */
export type DetailPopupWidth = 'compact' | 'wide' | 'full';

interface DetailPopupProps {
  /** Whether the popup is visible. */
  open: boolean;
  /** Icon to display. */
  icon: IconProp;
  /** Title text. */
  title: string;
  /** Description text. */
  description?: string;
  /** Accent color. */
  color?: AccentColor;
  /** Close handler. */
  onClose: () => void;
  /**
   * Rich detail content rendered inside the popup.
   * When `layout` is `'two-column'`, rendered in the right column.
   * When `layout` is `'simple'`, rendered below the description.
   */
  children?: ReactNode;
  /**
   * Layout variant for the popup content.
   * Automatically switches to `'two-column'` when `children` are provided
   * and no explicit layout is set.
   * @default 'simple'
   */
  layout?: DetailPopupLayout;
  /**
   * Width preset for the popup card.
   * Automatically switches to `'wide'` when `children` are provided
   * and no explicit width is set.
   * @default 'compact'
   */
  width?: DetailPopupWidth;
  /** Additional class names for the popup card. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Width mapping
// ---------------------------------------------------------------------------

const widthStyles: Record<DetailPopupWidth, string> = {
  compact: 'w-[200px]',
  wide: 'w-[70%] max-h-[80%]',
  full: 'w-[90%] max-h-[90%]',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DetailPopup({
  open,
  icon,
  title,
  description,
  color = '#3b82f6',
  onClose,
  children,
  layout: layoutProp,
  width: widthProp,
  className,
}: DetailPopupProps) {
  // Auto-detect layout / width when children are provided
  const hasChildren = children != null;
  const layout = layoutProp ?? (hasChildren ? 'two-column' : 'simple');
  const width = widthProp ?? (hasChildren ? 'wide' : 'compact');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40" />

          {/* Card */}
          <motion.div
            className={cn(
              'relative rounded-xl shadow-2xl backdrop-blur-md z-10 overflow-hidden',
              widthStyles[width],
              className,
            )}
            style={{
              backgroundColor: `${color}12`,
              border: `1.5px solid ${color}40`,
              boxShadow: `0 8px 32px ${color}25`,
            }}
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {layout === 'two-column' ? (
              <TwoColumnContent
                icon={icon}
                title={title}
                description={description}
                color={color}
              >
                {children}
              </TwoColumnContent>
            ) : (
              <SimpleContent
                icon={icon}
                title={title}
                description={description}
                color={color}
              >
                {children}
              </SimpleContent>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ContentProps {
  icon: IconProp;
  title: string;
  description?: string;
  color: string;
  children?: ReactNode;
}

/** Centred layout (backward-compatible with original). */
function SimpleContent({ icon, title, description, color, children }: ContentProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-5 text-center">
      {renderIcon(icon, { size: 32, color: `${color}cc` })}
      <div className="text-sm font-bold" style={{ color }}>
        {title}
      </div>
      {description && (
        <p className="text-[10px] leading-relaxed text-white/50">
          {description}
        </p>
      )}
      {children && <div className="w-full mt-2">{children}</div>}
    </div>
  );
}

/** Two-column layout: left identity, right detail content. */
function TwoColumnContent({ icon, title, description, color, children }: ContentProps) {
  return (
    <div className="flex h-full min-h-[200px]">
      {/* Left — identity column */}
      <div
        className="flex flex-col items-center justify-center gap-3 shrink-0 p-5"
        style={{ width: '30%', borderRight: `1px solid ${color}20` }}
      >
        {renderIcon(icon, { size: 48, color: `${color}cc` })}
        <div className="text-sm font-bold text-center" style={{ color }}>
          {title}
        </div>
        {description && (
          <p className="text-[9px] leading-relaxed text-white/40 text-center px-2">
            {description}
          </p>
        )}
      </div>

      {/* Right — detail content */}
      <div className="flex-1 p-4 overflow-auto">
        {children ?? (
          <span className="text-white/30 text-xs italic">No detail content</span>
        )}
      </div>
    </div>
  );
}
