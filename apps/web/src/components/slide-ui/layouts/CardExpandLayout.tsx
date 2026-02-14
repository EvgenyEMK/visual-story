'use client';

import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor, ComponentSize, EntranceProps } from '../types';
import { renderIcon } from '../render-icon';
import { FeatureCard } from '../molecules/FeatureCard';
import { StatCard } from '../molecules/StatCard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Visual variant for the card-expand interaction.
 *
 * - `'grid-to-overlay'` — Expanded card takes ~70% width; remaining cards
 *   stack vertically on the right.  (Default, similar to bento-grid-expansion.)
 * - `'center-popup'` — Expanded card floats as a centred overlay with a
 *   backdrop blur; the collapsed grid is dimmed behind.
 * - `'row-to-split'` — Single row of cards; clicking one expands it into a
 *   two-column split (large icon+title left, detail right) with remaining
 *   cards shown as mini-tabs above.
 * - `'sidebar-detail'` — Cards collapse into a sidebar; detail fills the
 *   main area to the right.
 */
export type CardExpandVariant =
  | 'grid-to-overlay'
  | 'center-popup'
  | 'row-to-split'
  | 'sidebar-detail';

/**
 * Type of collapsed card to render.
 *
 * - `'feature'` — `FeatureCard` with icon + title + optional description.
 * - `'stat'`    — `StatCard` with value + label + delta + optional progress.
 */
export type CollapsedCardType = 'feature' | 'stat';

// ---------------------------------------------------------------------------
// Card Item
// ---------------------------------------------------------------------------

/** Base fields shared by every card item. */
interface CardExpandItemBase {
  /** Unique key (used for animation layout IDs). */
  id: string;
  /** Icon for the collapsed card. */
  icon: IconProp;
  /** Title text. */
  title: string;
  /** Optional description shown on the collapsed card. */
  description?: string;
  /** Accent color for the card. */
  color?: AccentColor;
  /**
   * Rich content rendered in the expanded detail area.
   * Accepts any React node — e.g. `<ItemsList>`, `<GridOfCards>`, text blocks.
   */
  detailContent?: ReactNode;
}

/** Extra fields when `cardType` is `'stat'`. */
interface StatFields {
  /** The main metric value (e.g. '$2.4M'). */
  value: string;
  /** Optional label above the value. */
  label?: string;
  /** Change delta (e.g. '+27% YoY'). */
  delta?: string;
  /** Direction of the delta. */
  deltaDirection?: 'up' | 'down' | 'neutral';
  /** Optional progress bar (0-100). */
  progress?: number;
}

export type CardExpandItem = CardExpandItemBase & Partial<StatFields>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CardExpandLayoutProps extends EntranceProps {
  /** Items to display as expandable cards. */
  items: CardExpandItem[];
  /**
   * Visual variant for the expand interaction.
   * @default 'grid-to-overlay'
   */
  variant?: CardExpandVariant;
  /**
   * Type of collapsed card to render.
   * @default 'feature'
   */
  cardType?: CollapsedCardType;
  /** Size preset for collapsed cards. */
  cardSize?: ComponentSize;
  /** Number of columns for the collapsed grid. Auto-detected if not set. */
  columns?: number;
  /** Gap between collapsed cards (px). */
  gap?: number;
  /** Index of initially expanded card (-1 = all collapsed). */
  defaultExpanded?: number;
  /**
   * Controlled expanded index. When provided, overrides internal state.
   * Use -1 for all collapsed. Pair with `onExpandChange` for full control.
   */
  expandedIndex?: number;
  /** Callback when expanded card changes. */
  onExpandChange?: (index: number) => void;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Shared animation constants
// ---------------------------------------------------------------------------

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const TRANSITION_EXPAND = { duration: 0.4, ease: EASE_OUT_EXPO } as const;
const TRANSITION_DETAIL = { duration: 0.3, delay: 0.15, ease: EASE_OUT_EXPO } as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CardExpandLayout({
  items,
  variant = 'grid-to-overlay',
  cardType = 'feature',
  cardSize = 'md',
  columns,
  gap = 8,
  defaultExpanded = -1,
  expandedIndex: controlledExpanded,
  onExpandChange,
  className,
}: CardExpandLayoutProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleExpand = useCallback(
    (index: number) => {
      const next = index === expanded ? -1 : index;
      if (controlledExpanded === undefined) {
        setInternalExpanded(next);
      }
      onExpandChange?.(next);
    },
    [expanded, controlledExpanded, onExpandChange],
  );

  const isExpanded = expanded >= 0 && expanded < items.length;
  const currentItem = isExpanded ? items[expanded] : null;

  // Auto-detect columns if not specified
  const cols = columns ?? Math.min(items.length, items.length <= 4 ? items.length : 3);

  // Delegate to the variant renderer
  switch (variant) {
    case 'center-popup':
      return (
        <CenterPopupVariant
          items={items}
          expanded={expanded}
          currentItem={currentItem}
          cols={cols}
          gap={gap}
          cardType={cardType}
          cardSize={cardSize}
          onExpand={handleExpand}
          className={className}
        />
      );
    case 'sidebar-detail':
      return (
        <SidebarDetailVariant
          items={items}
          expanded={expanded}
          currentItem={currentItem}
          cardType={cardType}
          cardSize={cardSize}
          onExpand={handleExpand}
          className={className}
        />
      );
    case 'row-to-split':
      return (
        <RowToSplitVariant
          items={items}
          expanded={expanded}
          currentItem={currentItem}
          gap={gap}
          cardType={cardType}
          cardSize={cardSize}
          onExpand={handleExpand}
          className={className}
        />
      );
    case 'grid-to-overlay':
    default:
      return (
        <GridToOverlayVariant
          items={items}
          expanded={expanded}
          currentItem={currentItem}
          cols={cols}
          gap={gap}
          cardType={cardType}
          cardSize={cardSize}
          onExpand={handleExpand}
          className={className}
        />
      );
  }
}

// ---------------------------------------------------------------------------
// Shared types for variant sub-components
// ---------------------------------------------------------------------------

interface VariantProps {
  items: CardExpandItem[];
  expanded: number;
  currentItem: CardExpandItem | null;
  cardType: CollapsedCardType;
  cardSize: ComponentSize;
  onExpand: (index: number) => void;
  className?: string;
}

interface GridVariantProps extends VariantProps {
  cols: number;
  gap: number;
}

// ---------------------------------------------------------------------------
// Variant A: Grid-to-Overlay
// ---------------------------------------------------------------------------

function GridToOverlayVariant({
  items,
  expanded,
  currentItem,
  cols,
  gap,
  cardType,
  cardSize,
  onExpand,
  className,
}: GridVariantProps) {
  const isExpanded = currentItem != null;

  return (
    <div className={cn('w-full h-full p-3', className)}>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key={`expanded-${expanded}`}
            className="flex gap-2 w-full h-full"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={TRANSITION_EXPAND}
          >
            {/* Expanded detail area (~70%) */}
            <ExpandedDetailPanel item={currentItem} onClose={() => onExpand(expanded)} />

            {/* Right sidebar: stacked compact cards (~30%) */}
            <div className="flex flex-col gap-2 shrink-0" style={{ width: '28%' }}>
              {items.map((item, i) => (
                <CompactCardButton
                  key={item.id}
                  item={item}
                  isActive={i === expanded}
                  onClick={() => onExpand(i)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed-grid"
            className="grid w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION_EXPAND}
          >
            {items.map((item, i) => (
              <CollapsedCard
                key={item.id}
                item={item}
                cardType={cardType}
                cardSize={cardSize}
                onClick={() => onExpand(i)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant B: Center Popup
// ---------------------------------------------------------------------------

function CenterPopupVariant({
  items,
  expanded,
  currentItem,
  cols,
  gap,
  cardType,
  cardSize,
  onExpand,
  className,
}: GridVariantProps) {
  return (
    <div className={cn('relative w-full h-full p-3', className)}>
      {/* Collapsed grid (always visible, dimmed when expanded) */}
      <div
        className={cn(
          'grid w-full h-full transition-opacity duration-300',
          currentItem && 'opacity-30 pointer-events-none',
        )}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap,
        }}
      >
        {items.map((item, i) => (
          <CollapsedCard
            key={item.id}
            item={item}
            cardType={cardType}
            cardSize={cardSize}
            onClick={() => onExpand(i)}
          />
        ))}
      </div>

      {/* Popup overlay — key on item ID for proper card-to-card transitions */}
      <AnimatePresence mode="wait">
        {currentItem && (
          <motion.div
            key={currentItem.id}
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onExpand(expanded)}
          >
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30" />
            <motion.div
              className="relative z-10 w-[70%] max-h-[80%] rounded-xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: `${currentItem.color ?? '#3b82f6'}12`,
                border: `1.5px solid ${currentItem.color ?? '#3b82f6'}40`,
                boxShadow: `0 8px 32px ${currentItem.color ?? '#3b82f6'}25`,
              }}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
            >
              <TwoColumnExpandedContent item={currentItem} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant C: Row-to-Split
// ---------------------------------------------------------------------------

function RowToSplitVariant({
  items,
  expanded,
  currentItem,
  gap,
  cardType,
  cardSize,
  onExpand,
  className,
}: VariantProps & { gap: number }) {
  return (
    <div className={cn('flex flex-col w-full h-full p-3 gap-2', className)}>
      {/* Top tabs / collapsed row */}
      <div
        className={cn(
          'flex shrink-0 transition-all duration-300',
          currentItem ? 'gap-1' : 'gap-2',
        )}
        style={{ gap: currentItem ? 4 : gap }}
      >
        {items.map((item, i) => {
          if (currentItem) {
            // Compact tab mode
            return (
              <CompactCardButton
                key={item.id}
                item={item}
                isActive={i === expanded}
                onClick={() => onExpand(i)}
                horizontal
              />
            );
          }
          // Full card mode
          return (
            <div key={item.id} className="flex-1">
              <CollapsedCard
                item={item}
                cardType={cardType}
                cardSize={cardSize}
                onClick={() => onExpand(i)}
              />
            </div>
          );
        })}
      </div>

      {/* Expanded split area — key on item ID for card-to-card transitions */}
      <AnimatePresence mode="wait">
        {currentItem && (
          <motion.div
            key={`split-${currentItem.id}`}
            className="flex-1 rounded-xl overflow-hidden"
            style={{
              backgroundColor: `${currentItem.color ?? '#3b82f6'}10`,
              border: `1px solid ${currentItem.color ?? '#3b82f6'}25`,
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={TRANSITION_EXPAND}
          >
            <TwoColumnExpandedContent item={currentItem} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant D: Sidebar-Detail
// ---------------------------------------------------------------------------

function SidebarDetailVariant({
  items,
  expanded,
  currentItem,
  onExpand,
  className,
}: VariantProps) {
  return (
    <div className={cn('flex w-full h-full p-3 gap-2', className)}>
      {/* Left sidebar */}
      <div className="flex flex-col gap-2 shrink-0" style={{ width: '25%' }}>
        {items.map((item, i) => (
          <CompactCardButton
            key={item.id}
            item={item}
            isActive={i === expanded}
            onClick={() => onExpand(i)}
          />
        ))}
      </div>

      {/* Right detail area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentItem ? (
            <motion.div
              key={currentItem.id}
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                backgroundColor: `${currentItem.color ?? '#3b82f6'}10`,
                border: `1px solid ${currentItem.color ?? '#3b82f6'}25`,
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={TRANSITION_EXPAND}
            >
              <TwoColumnExpandedContent item={currentItem} />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="absolute inset-0 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-white/20 text-xs">Click a card to expand</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

/** Full collapsed card: FeatureCard or StatCard depending on cardType. */
function CollapsedCard({
  item,
  cardType,
  cardSize,
  onClick,
}: {
  item: CardExpandItem;
  cardType: CollapsedCardType;
  cardSize: ComponentSize;
  onClick: () => void;
}) {
  if (cardType === 'stat' && item.value) {
    // StatCard doesn't accept onClick — wrap in a clickable div
    return (
      <div className="cursor-pointer h-full" onClick={onClick} role="button" tabIndex={0}>
        <StatCard
          value={item.value}
          label={item.label ?? item.title}
          delta={item.delta}
          deltaDirection={item.deltaDirection}
          color={item.color}
          progress={item.progress}
          className="h-full pointer-events-none"
          entrance="fade"
        />
      </div>
    );
  }

  return (
    <FeatureCard
      icon={item.icon}
      title={item.title}
      description={item.description}
      color={item.color}
      size={cardSize}
      entrance="fade"
      onClick={onClick}
    />
  );
}

/** Compact button used in sidebars and tab strips. */
function CompactCardButton({
  item,
  isActive,
  onClick,
  horizontal = false,
}: {
  item: CardExpandItem;
  isActive: boolean;
  onClick: () => void;
  horizontal?: boolean;
}) {
  const c = item.color ?? '#3b82f6';
  return (
    <motion.div
      className={cn(
        'rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300',
        horizontal ? 'gap-1.5 px-3 py-1.5' : 'gap-1.5 flex-1 px-2 py-2',
      )}
      style={{
        backgroundColor: isActive ? `${c}30` : `${c}10`,
        border: `1px solid ${isActive ? `${c}50` : `${c}15`}`,
      }}
      whileHover={{ scale: 1.03, borderColor: `${c}40` }}
      onClick={onClick}
    >
      {renderIcon(item.icon, { size: 16, color: `${c}bb` })}
      <span className="text-white/60 text-[9px] font-medium truncate">{item.title}</span>
    </motion.div>
  );
}

/** Expanded detail panel for the grid-to-overlay variant. */
function ExpandedDetailPanel({
  item,
  onClose,
}: {
  item: CardExpandItem;
  onClose: () => void;
}) {
  const c = item.color ?? '#3b82f6';

  return (
    <motion.div
      className="flex-1 rounded-xl overflow-hidden"
      style={{
        backgroundColor: `${c}10`,
        border: `1px solid ${c}25`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={TRANSITION_EXPAND}
    >
      <TwoColumnExpandedContent item={item} />
    </motion.div>
  );
}

/** Two-column expanded content: left identity, right detail. */
function TwoColumnExpandedContent({ item }: { item: CardExpandItem }) {
  const c = item.color ?? '#3b82f6';

  return (
    <div className="flex h-full min-h-[180px]">
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
      <motion.div
        className="flex-1 p-4 overflow-auto"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={TRANSITION_DETAIL}
      >
        {item.detailContent ?? (
          <span className="text-white/30 text-xs italic">No detail content</span>
        )}
      </motion.div>
    </div>
  );
}
