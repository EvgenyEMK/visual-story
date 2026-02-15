'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { em } from '../units';
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

/**
 * Origin rectangle for grow-from-card animation.
 * Coordinates are relative to the popup's container (the slide canvas).
 */
export interface PopupOriginRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  /**
   * Origin rectangle for grow-from-card animation.
   * When provided, the popup scales up from this position instead of
   * the default center-scale animation.
   */
  originRect?: PopupOriginRect;
  /** Additional class names for the popup card. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Width mapping
// ---------------------------------------------------------------------------

const widthStyles: Record<DetailPopupWidth, string> = {
  compact: 'w-[12.5em]',
  wide: 'w-[70%] max-h-[80%]',
  full: 'w-[90%] max-h-[90%]',
};

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Compute CSS `transformOrigin` from an origin rect relative to the
 * popup's container. Returns a string like "25% 40%".
 */
function computeTransformOrigin(
  originRect: PopupOriginRect | undefined,
  containerWidth: number,
  containerHeight: number,
): string {
  if (!originRect || containerWidth === 0 || containerHeight === 0) {
    return '50% 50%';
  }
  const cx = originRect.x + originRect.width / 2;
  const cy = originRect.y + originRect.height / 2;
  const pctX = (cx / containerWidth) * 100;
  const pctY = (cy / containerHeight) * 100;
  return `${pctX}% ${pctY}%`;
}

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
  originRect,
  className,
}: DetailPopupProps) {
  // Auto-detect layout / width when children are provided
  const hasChildren = children != null;
  const layout = layoutProp ?? (hasChildren ? 'two-column' : 'simple');
  const width = widthProp ?? (hasChildren ? 'wide' : 'compact');

  // Compute transform origin for grow-from-card animation
  // Use a reasonable default container size (will be overridden by actual measurements
  // when originRect is provided via the parent)
  const transformOrigin = originRect
    ? computeTransformOrigin(originRect, 960, 540)
    : '50% 50%';

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
          style={{ transformOrigin }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-[3px] bg-black/50" />

          {/* Card */}
          <motion.div
            className={cn(
              'relative rounded-[0.75em] shadow-2xl z-10 overflow-hidden',
              widthStyles[width],
              className,
            )}
            style={{
              backgroundColor: `color-mix(in srgb, ${color} 8%, #0f172a 92%)`,
              border: `1.5px solid ${color}40`,
              boxShadow: `0 ${em(8)} ${em(32)} rgba(0, 0, 0, 0.5), 0 0 ${em(64)} ${color}15`,
              transformOrigin,
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
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
    <div className="flex flex-col items-center gap-[0.5em] p-[1.25em] text-center">
      {renderIcon(icon, { size: em(32), color: `${color}cc` })}
      <div className="text-[0.875em] font-bold" style={{ color }}>
        {title}
      </div>
      {description && (
        <p className="text-[0.625em] leading-relaxed text-white/60">
          {description}
        </p>
      )}
      {children && <div className="w-full mt-[0.5em]">{children}</div>}
    </div>
  );
}

/** Two-column layout: left identity, right detail content. */
function TwoColumnContent({ icon, title, description, color, children }: ContentProps) {
  return (
    <div className="flex h-full min-h-[12.5em]">
      {/* Left — identity column */}
      <div
        className="flex flex-col items-center justify-center gap-[0.75em] shrink-0 p-[1.25em]"
        style={{ width: '30%', borderRight: `1px solid ${color}25` }}
      >
        {renderIcon(icon, { size: em(48), color: `${color}cc` })}
        <div className="text-[0.875em] font-bold text-center" style={{ color }}>
          {title}
        </div>
        {description && (
          <p className="text-[0.5625em] leading-relaxed text-white/50 text-center px-[0.5em]">
            {description}
          </p>
        )}
      </div>

      {/* Right — detail content */}
      <div className="flex-1 p-[1em] overflow-auto">
        {children ?? (
          <span className="text-white/30 text-[0.75em] italic">No detail content</span>
        )}
      </div>
    </div>
  );
}
