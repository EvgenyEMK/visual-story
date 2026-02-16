/**
 * Hook that resolves smart list data from either embedded data or a shared source.
 *
 * This is the primary integration point between the SmartItemsList component
 * and the SmartListSource system. Components use this hook instead of reading
 * data directly — it transparently handles:
 *
 * 1. Embedded mode: returns `data.items` directly (backward-compatible)
 * 2. Source mode: subscribes to useSmartListSourceStore and returns source items
 * 3. Aggregator mode: collects and merges items from multiple sources
 *
 * @source docs/product-modules/slide-editor/element-editing/smart-list-editor-concept.md
 */

import { useMemo } from 'react';
import type { SmartListConfig, SmartListData, SmartListItem } from '@/types/smart-list';
import { useSmartListSourceStore, selectSourceById } from '@/stores/smart-list-source-store';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ResolvedSmartListData {
  /** The resolved items to render. */
  items: SmartListItem[];
  /** Whether data comes from a shared source (vs. embedded). */
  isSharedSource: boolean;
  /** Whether this is an aggregator (data from multiple sources). */
  isAggregator: boolean;
  /** Source name (if shared source mode). */
  sourceName?: string;
  /** Source ID (if shared source mode). */
  sourceId?: string;
  /**
   * For aggregators: grouped items by source with headers.
   * Only populated when `groupBySource` is true in config.
   */
  sourceGroups?: Array<{
    sourceId: string;
    sourceName: string;
    items: SmartListItem[];
  }>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Resolves smart list data from the appropriate source.
 *
 * @param config - The widget configuration (may contain sourceId or aggregator settings)
 * @param embeddedData - The embedded data payload (used when no sourceId is set)
 * @returns Resolved data with items and metadata
 */
export function useSmartListData(
  config: SmartListConfig,
  embeddedData: SmartListData,
): ResolvedSmartListData {
  // --- Single shared source ---
  const sourceId = config.sourceId;
  const source = useSmartListSourceStore(
    sourceId ? selectSourceById(sourceId) : () => undefined,
  );

  // --- Aggregator: read all referenced sources ---
  const aggregateFrom = config.aggregator ? config.aggregateFrom : undefined;
  const allSources = useSmartListSourceStore((state) => state.sources);

  return useMemo(() => {
    // Mode 1: Aggregator
    if (config.aggregator && aggregateFrom && aggregateFrom.length > 0) {
      return resolveAggregator(aggregateFrom, allSources, config);
    }

    // Mode 2: Shared source
    if (sourceId && source) {
      return {
        items: source.items,
        isSharedSource: true,
        isAggregator: false,
        sourceName: source.name,
        sourceId: source.id,
      };
    }

    // Mode 3: Embedded data (backward-compatible)
    return {
      items: embeddedData.items,
      isSharedSource: false,
      isAggregator: false,
    };
  }, [config, sourceId, source, aggregateFrom, allSources, embeddedData]);
}

// ---------------------------------------------------------------------------
// Aggregator resolution
// ---------------------------------------------------------------------------

import type { SmartListSource } from '@/types/smart-list-source';

function resolveAggregator(
  aggregateFrom: NonNullable<SmartListConfig['aggregateFrom']>,
  allSources: SmartListSource[],
  config: SmartListConfig,
): ResolvedSmartListData {
  const sourceMap = new Map(allSources.map((s) => [s.id, s]));
  const seenIds = new Set<string>();
  const sourceGroups: ResolvedSmartListData['sourceGroups'] = [];

  for (const ref of aggregateFrom) {
    const src = sourceMap.get(ref.sourceId);
    if (!src) continue;

    let items = [...src.items];

    // Apply per-source filter
    if (ref.filter && ref.filter.length > 0) {
      const filterSet = new Set(ref.filter);
      items = items.filter(
        (item) => item.isHeader || (item.primaryIcon && filterSet.has(item.primaryIcon.iconId)),
      );
    }

    // Deduplicate across sources
    if (config.deduplicateById) {
      items = items.filter((item) => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });
    } else {
      items.forEach((item) => seenIds.add(item.id));
    }

    sourceGroups.push({
      sourceId: src.id,
      sourceName: src.name,
      items,
    });
  }

  // Build flat items list — optionally with synthetic source-name headers
  let allItems: SmartListItem[];
  if (config.groupBySource) {
    allItems = [];
    for (const group of sourceGroups) {
      // Insert a synthetic section header for each source
      allItems.push({
        id: `__source-header-${group.sourceId}`,
        text: group.sourceName,
        isHeader: true,
      });
      allItems.push(...group.items);
    }
  } else {
    allItems = sourceGroups.flatMap((g) => g.items);
  }

  return {
    items: allItems,
    isSharedSource: false,
    isAggregator: true,
    sourceGroups,
  };
}
