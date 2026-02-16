/**
 * Smart List widget types for VisualFlow.
 *
 * SmartItemsList is the first "Smart Widget" — a self-contained interactive
 * molecule backed by the WidgetItem SlideItem variant. It supports hierarchical
 * items, predefined icon sets, collapse/expand, gradual disclosure, numbering,
 * and keyboard-first editing.
 *
 * @source docs/product-modules/slide-editor/element-editing/smart-item-lists.md
 */

import type { IconProp, AccentColor, ComponentSize, EntranceType } from '@/components/slide-ui/types';

// ---------------------------------------------------------------------------
// Icon Reference
// ---------------------------------------------------------------------------

/**
 * A reference to a specific icon within an icon set.
 * The `setId` + `iconId` pair resolves to a concrete icon via the icon set registry.
 */
export interface IconRef {
  /** ID of the icon set (e.g., 'task-status', 'priority', 'risk'). */
  setId: string;
  /** ID of the icon within the set (e.g., 'done', 'in-progress', 'p1'). */
  iconId: string;
}

// ---------------------------------------------------------------------------
// Icon Set
// ---------------------------------------------------------------------------

/** A single icon definition within an icon set. */
export interface IconSetEntry {
  /** Unique ID within the set. */
  id: string;
  /** Display label (e.g., "Done", "In Progress"). */
  label: string;
  /** The icon to render (emoji, Lucide component, ReactNode). */
  icon: IconProp;
  /** Accent color for this status. */
  color: AccentColor;
  /** Sort order within the set (lower = first). */
  order: number;
}

/** A predefined or custom icon set. */
export interface IconSet {
  /** Unique ID (e.g., 'task-status', 'priority'). */
  id: string;
  /** Display name (e.g., "Task Status", "Priority"). */
  name: string;
  /** Short description. */
  description: string;
  /** The icons in this set. */
  entries: IconSetEntry[];
  /** Whether this is a built-in set (not deletable). */
  builtIn: boolean;
}

// ---------------------------------------------------------------------------
// Smart List Item
// ---------------------------------------------------------------------------

/** A single item in a smart list. */
export interface SmartListItem {
  /** Unique identifier. */
  id: string;
  /** Primary text. */
  text: string;
  /** Optional secondary description text. */
  description?: string;
  /** Primary icon reference (from the list's icon set). */
  primaryIcon?: IconRef;
  /** Secondary icon reference (Phase 2, SL-F03). */
  secondaryIcon?: IconRef;
  /** Whether this item is a section header (no icon, bold text). */
  isHeader?: boolean;
  /** Nested sub-items. */
  children?: SmartListItem[];
  /** Whether sub-items are collapsed in the UI. */
  collapsed?: boolean;
  /** Whether this item is visible in presentation mode (default: true). */
  visible?: boolean;
  /** Expandable detail content — plain text (Phase 2, SL-F08). */
  detail?: string;
}

// ---------------------------------------------------------------------------
// Smart List Configuration
// ---------------------------------------------------------------------------

/** How sub-items appear by default. */
export type CollapseDefault =
  | 'all-expanded'
  | 'all-collapsed'
  | 'first-expanded'
  | 'top-level-only';

/** Reveal mode for presentation/animation. */
export type RevealMode =
  | 'all-at-once'
  | 'one-by-one-focus'
  | 'one-by-one-accumulate'
  | 'by-section';

/** Numbering format for ordered lists. */
export type NumberingFormat = '1.' | 'a.' | 'a)' | 'i.' | 'Step N' | '01.';

/** Detail display mode for per-item expandable content (Phase 2). */
export type DetailMode = 'none' | 'inline' | 'callout';

/** Conditional formatting intensity (Phase 2). */
export type ConditionalFormatIntensity = 'subtle' | 'medium' | 'strong';

/** Progress summary position (Phase 2). */
export type ProgressSummaryPosition = 'above' | 'below' | 'hidden';

/** Configuration for a Smart Items List widget. */
export interface SmartListConfig {
  /** ID of the primary icon set. */
  iconSetId: string;
  /** Default collapse behavior for sub-items. */
  collapseDefault: CollapseDefault;
  /** Reveal mode for presentation. */
  revealMode: RevealMode;
  /** Whether to show auto-numbering. */
  showNumbering?: boolean;
  /** Numbering format when showNumbering is true. */
  numberingFormat?: NumberingFormat;
  /** Numbering format for nested items (defaults to 'a)' when parent uses numeric). */
  childNumberingFormat?: NumberingFormat;
  /** Component size preset. */
  size?: ComponentSize;
  /** Show left accent bar on items. */
  showAccentBar?: boolean;
  /** Entrance animation type. */
  entrance?: EntranceType;
  /** Stagger delay between items (seconds). */
  stagger?: number;

  // --- Phase 2 fields ---

  /** ID of the secondary icon set (SL-F03, dual icon slots). */
  secondaryIconSetId?: string;
  /** Enable conditional formatting (SL-F14, auto-color rows by status). */
  conditionalFormatting?: boolean;
  /** Conditional formatting intensity. */
  conditionalFormatIntensity?: ConditionalFormatIntensity;
  /** Progress summary position (SL-F13). 'hidden' or omitted = no summary. */
  progressSummary?: ProgressSummaryPosition;
  /** Detail display mode (SL-F08). */
  detailMode?: DetailMode;
  /** ID of a linked legend widget (SL-F07). */
  linkedLegendId?: string;

  // --- Phase 3 fields ---

  /** Filter: only show items whose primaryIcon.iconId is in this set (SL-F16). Empty/undefined = show all. */
  filterByStatuses?: string[];
  /** Group items by their primary icon status instead of original order (SL-F16). */
  groupByStatus?: boolean;

  // --- Phase 3a: Shared source reference ---

  /**
   * ID of a SmartListSource that provides the canonical item data.
   * When set, the widget reads items from the source store instead of
   * its own embedded `data.items`. The `data` field may be empty.
   * When unset, the widget uses embedded data (backward-compatible mode).
   */
  sourceId?: string;

  // --- Phase 3b: Aggregator mode ---

  /**
   * When `true`, this widget is an aggregator that collects items from
   * multiple SmartListSources. Use `aggregateFrom` to specify sources.
   */
  aggregator?: boolean;
  /** Sources to aggregate from (only used when `aggregator` is true). */
  aggregateFrom?: Array<{
    sourceId: string;
    filter?: string[];
  }>;
  /** Group aggregated items under source-name headers. */
  groupBySource?: boolean;
  /** Deduplicate items that appear in multiple sources (by item ID). */
  deduplicateById?: boolean;
}

/** Data payload for a Smart Items List widget. */
export interface SmartListData {
  /** The list items. */
  items: SmartListItem[];
}

// ---------------------------------------------------------------------------
// Flattened item (for rendering)
// ---------------------------------------------------------------------------

/** A flattened list item with depth and numbering metadata for rendering. */
export interface FlatSmartListItem {
  /** The original item. */
  item: SmartListItem;
  /** Nesting depth (0 = top-level). */
  depth: number;
  /** Index in the flat list (for stagger animation). */
  flatIndex: number;
  /** Numbering label (e.g., "1.", "a.", "Step 1"). */
  numberLabel?: string;
  /** Whether this item's children are collapsed. */
  isParentCollapsed?: boolean;
}
