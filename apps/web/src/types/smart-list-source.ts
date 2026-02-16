/**
 * Smart List Source types for VisualFlow.
 *
 * A SmartListSource is the canonical, shared data for a smart list.
 * It can be scoped to a single presentation (MVP) or exist as a standalone
 * tenant-level entity (future). Widgets reference sources by ID, enabling
 * cross-slide sharing, aggregation, and a dedicated Smart List Editor.
 *
 * @source docs/product-modules/slide-editor/element-editing/smart-list-editor-concept.md
 */

import type { SmartListItem } from './smart-list';

// ---------------------------------------------------------------------------
// Smart List Source — the canonical shared data entity
// ---------------------------------------------------------------------------

/**
 * A Smart List Source is the single source of truth for list data.
 * Slide widgets reference it by `sourceId` and render a filtered/grouped view.
 *
 * **Ownership model:**
 * - MVP: `presentationId` is set — the list belongs to a specific presentation.
 * - Future: `presentationId` may be null — the list is a standalone tenant-level
 *   entity, reusable across multiple presentations or as a standalone tracker.
 *
 * The `tenantId` is always required, enabling RLS and future standalone lists.
 */
export interface SmartListSource {
  /** Unique identifier (UUID). */
  id: string;
  /** Tenant (workspace) this list belongs to. Always required. */
  tenantId: string;
  /** Presentation this list belongs to (null for standalone lists). */
  presentationId: string | null;
  /** Human-readable name (e.g., "Sprint 24 Tasks", "Q1 Risks"). */
  name: string;
  /** Optional description of the list's purpose. */
  description?: string;
  /** Primary icon set ID (e.g., 'task-status', 'priority'). */
  iconSetId: string;
  /** Secondary icon set ID for dual-icon mode (Phase 2). */
  secondaryIconSetId?: string;
  /** The list items — the canonical data. */
  items: SmartListItem[];
  /** Named snapshots for comparison (Phase 3). */
  snapshots?: SmartListSnapshot[];
  /** Share token for read-only public access (Phase 3d — future). */
  shareToken?: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * A named point-in-time snapshot of a list's items.
 * Used for diff/comparison views (SL-F21).
 */
export interface SmartListSnapshot {
  /** Unique identifier for this snapshot. */
  id: string;
  /** Human-readable name (e.g., "Week 8 Status", "Before Reorg"). */
  name: string;
  /** The items at snapshot time. */
  items: SmartListItem[];
  /** ISO timestamp of when the snapshot was taken. */
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Aggregator — cross-slide list aggregation (Phase 3b)
// ---------------------------------------------------------------------------

/**
 * A single source reference within an aggregator configuration.
 * Specifies which source to pull from and optional per-source filters.
 */
export interface AggregateSourceRef {
  /** ID of the SmartListSource to aggregate from. */
  sourceId: string;
  /** Optional: only include items whose primaryIcon.iconId is in this set. */
  filter?: string[];
}

/**
 * Configuration for an aggregator widget — a read-only view that collects
 * items from multiple SmartListSources.
 */
export interface AggregatorConfig {
  /** Marks this widget as an aggregator. */
  aggregator: true;
  /** Sources to aggregate from with optional per-source filters. */
  aggregateFrom: AggregateSourceRef[];
  /** Group items under source-name headers. */
  groupBySource?: boolean;
  /** Deduplicate items that appear in multiple sources (by item ID). */
  deduplicateById?: boolean;
}

// ---------------------------------------------------------------------------
// SmartListConfig extensions for source reference
// ---------------------------------------------------------------------------

/**
 * Extended fields added to SmartListConfig when referencing a shared source.
 * These are merged into the existing SmartListConfig interface.
 */
export interface SmartListSourceRef {
  /** ID of the SmartListSource this widget reads from. */
  sourceId: string;
  /** View-level filter: only show items with these primary icon statuses. */
  viewFilter?: string[];
  /** View-level grouping by status. */
  viewGroupBy?: boolean;
  /** Which fields to display in this view (future: column mapping). */
  viewColumns?: string[];
}

// ---------------------------------------------------------------------------
// Column mapping for Smart List Editor (Phase 3c)
// ---------------------------------------------------------------------------

/** Available data fields on SmartListItem that can be mapped to view columns. */
export type SmartListField =
  | 'text'
  | 'description'
  | 'primaryIcon'
  | 'secondaryIcon'
  | 'detail'
  | 'visible'
  | 'children';

/**
 * Configuration for mapping list fields to visual columns in the Smart List Editor.
 */
export interface ColumnMapping {
  /** Which field this column displays. */
  field: SmartListField;
  /** Display label for the column header. */
  label: string;
  /** Column width (CSS value). */
  width?: string;
  /** Whether this column is visible in this view. */
  visible: boolean;
}

// ---------------------------------------------------------------------------
// CRUD DTOs
// ---------------------------------------------------------------------------

/** Payload for creating a new smart list source. */
export interface CreateSmartListSourceRequest {
  name: string;
  description?: string;
  iconSetId: string;
  secondaryIconSetId?: string;
  items?: SmartListItem[];
  /** If set, the source belongs to this presentation. If null, standalone. */
  presentationId?: string | null;
}

/** Payload for updating an existing smart list source. */
export interface UpdateSmartListSourceRequest {
  name?: string;
  description?: string;
  iconSetId?: string;
  secondaryIconSetId?: string;
  items?: SmartListItem[];
}

/** Summary for list views (e.g., "Manage Smart Lists" panel). */
export interface SmartListSourceSummary {
  id: string;
  name: string;
  description?: string;
  iconSetId: string;
  itemCount: number;
  presentationId: string | null;
  updatedAt: string;
}
