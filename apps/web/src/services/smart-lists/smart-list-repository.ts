/**
 * Smart List Repository — abstraction layer for smart list data access.
 *
 * This repository defines the interface contract for smart list CRUD operations.
 * The actual implementation can be swapped between:
 * - In-memory (Zustand) for client-side editing
 * - Supabase (PostgreSQL) for persistence
 * - Future: external data sources (Jira, Asana, webhooks)
 *
 * All consumers should depend on SmartListRepository, NOT on Zustand or Supabase directly.
 * This enables changing the storage layer without affecting components, editors, or renderers.
 *
 * @source docs/product-modules/slide-editor/element-editing/smart-list-editor-concept.md
 */

import type {
  SmartListSource,
  SmartListSourceSummary,
  SmartListSnapshot,
  CreateSmartListSourceRequest,
  UpdateSmartListSourceRequest,
} from '@/types/smart-list-source';
import type { SmartListItem } from '@/types/smart-list';

// ---------------------------------------------------------------------------
// Repository Interface
// ---------------------------------------------------------------------------

/**
 * Abstract interface for smart list data operations.
 * Implementations must be stateless (no side effects beyond the data store).
 */
export interface SmartListRepository {
  // --- Source CRUD ---

  /** Get a single source by ID. Returns null if not found. */
  getSource(sourceId: string): Promise<SmartListSource | null>;

  /** List all sources for a given presentation. */
  listSourcesByPresentation(presentationId: string): Promise<SmartListSourceSummary[]>;

  /** List all sources for a given tenant (includes standalone lists). */
  listSourcesByTenant(tenantId: string): Promise<SmartListSourceSummary[]>;

  /** Create a new source. Returns the created source with generated ID. */
  createSource(tenantId: string, request: CreateSmartListSourceRequest): Promise<SmartListSource>;

  /** Update a source's metadata or items. Returns the updated source. */
  updateSource(sourceId: string, request: UpdateSmartListSourceRequest): Promise<SmartListSource>;

  /** Delete a source by ID. */
  deleteSource(sourceId: string): Promise<void>;

  // --- Item-level operations ---

  /** Get all items from a source. */
  getItems(sourceId: string): Promise<SmartListItem[]>;

  /** Replace all items in a source (full overwrite). */
  setItems(sourceId: string, items: SmartListItem[]): Promise<void>;

  /** Update a single item by ID within a source's item tree. */
  updateItem(sourceId: string, itemId: string, updates: Partial<SmartListItem>): Promise<void>;

  /** Add items to a source (appends at the end). */
  addItems(sourceId: string, items: SmartListItem[]): Promise<void>;

  /** Remove an item by ID from a source's item tree. */
  removeItem(sourceId: string, itemId: string): Promise<void>;

  /** Reorder items within a source. */
  reorderItems(sourceId: string, fromIndex: number, toIndex: number): Promise<void>;

  // --- Snapshots ---

  /** Create a named snapshot of the current items. */
  createSnapshot(sourceId: string, name: string): Promise<SmartListSnapshot>;

  /** List all snapshots for a source. */
  listSnapshots(sourceId: string): Promise<SmartListSnapshot[]>;

  /** Delete a snapshot. */
  deleteSnapshot(sourceId: string, snapshotId: string): Promise<void>;

  // --- Conversion ---

  /**
   * Convert an embedded (inline) smart list to a shared source.
   * Extracts the items from the widget and creates a new SmartListSource.
   * Returns the new source ID.
   */
  convertEmbeddedToShared(
    tenantId: string,
    presentationId: string,
    name: string,
    iconSetId: string,
    items: SmartListItem[],
    secondaryIconSetId?: string,
  ): Promise<string>;
}

// ---------------------------------------------------------------------------
// Aggregation Helper (pure function, repository-agnostic)
// ---------------------------------------------------------------------------

import type { AggregateSourceRef } from '@/types/smart-list-source';

/**
 * Aggregation result with items grouped by source.
 */
export interface AggregatedList {
  /** All items from all sources, in order. */
  allItems: SmartListItem[];
  /** Items grouped by source ID (for groupBySource display). */
  bySource: Array<{
    sourceId: string;
    sourceName: string;
    items: SmartListItem[];
  }>;
  /** Total item count across all sources. */
  totalCount: number;
}

/**
 * Aggregate items from multiple sources using a repository.
 * This is a pure orchestration function — it reads from the repository
 * and applies filters/dedup, but doesn't modify any data.
 */
export async function aggregateFromSources(
  repo: SmartListRepository,
  refs: AggregateSourceRef[],
  options: { groupBySource?: boolean; deduplicateById?: boolean } = {},
): Promise<AggregatedList> {
  const bySource: AggregatedList['bySource'] = [];
  const seenIds = new Set<string>();

  for (const ref of refs) {
    const source = await repo.getSource(ref.sourceId);
    if (!source) continue;

    let items = source.items;

    // Apply per-source filter
    if (ref.filter && ref.filter.length > 0) {
      const filterSet = new Set(ref.filter);
      items = items.filter(
        (item) => item.isHeader || (item.primaryIcon && filterSet.has(item.primaryIcon.iconId)),
      );
    }

    // Deduplicate across sources
    if (options.deduplicateById) {
      items = items.filter((item) => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });
    } else {
      items.forEach((item) => seenIds.add(item.id));
    }

    bySource.push({
      sourceId: source.id,
      sourceName: source.name,
      items,
    });
  }

  const allItems = bySource.flatMap((group) => group.items);

  return {
    allItems,
    bySource,
    totalCount: allItems.length,
  };
}
