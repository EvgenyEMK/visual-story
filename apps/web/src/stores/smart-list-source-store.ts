/**
 * Zustand store for Smart List Sources.
 *
 * Holds all SmartListSource entities in memory for the current session.
 * The InMemorySmartListRepository reads/writes through this store.
 *
 * Widgets with a `sourceId` subscribe to this store and auto-re-render
 * when their source data changes — no polling, no manual sync.
 *
 * @source docs/product-modules/slide-editor/element-editing/smart-list-editor-concept.md
 */

import { create } from 'zustand';
import type { SmartListSource } from '@/types/smart-list-source';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface SmartListSourceState {
  /** All loaded sources for the current session. */
  sources: SmartListSource[];
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface SmartListSourceActions {
  /** Load sources (e.g., after fetching from DB). Replaces all. */
  setSources: (sources: SmartListSource[]) => void;

  /** Add a single source. */
  addSource: (source: SmartListSource) => void;

  /** Update a source by ID (shallow merge). */
  updateSource: (sourceId: string, updates: Partial<SmartListSource>) => void;

  /** Remove a source by ID. */
  removeSource: (sourceId: string) => void;

  /** Clear all sources (e.g., when navigating away from a presentation). */
  clearSources: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSmartListSourceStore = create<SmartListSourceState & SmartListSourceActions>(
  (set) => ({
    sources: [],

    setSources: (sources) => set({ sources }),

    addSource: (source) =>
      set((state) => ({
        sources: [...state.sources, source],
      })),

    updateSource: (sourceId, updates) =>
      set((state) => ({
        sources: state.sources.map((s) =>
          s.id === sourceId ? { ...s, ...updates } : s,
        ),
      })),

    removeSource: (sourceId) =>
      set((state) => ({
        sources: state.sources.filter((s) => s.id !== sourceId),
      })),

    clearSources: () => set({ sources: [] }),
  }),
);

// ---------------------------------------------------------------------------
// Selectors (for use in components)
// ---------------------------------------------------------------------------

/**
 * Select a single source by ID. Returns undefined if not found.
 * Usage: `const source = useSmartListSourceStore(selectSourceById('abc-123'))`
 */
export function selectSourceById(sourceId: string) {
  return (state: SmartListSourceState): SmartListSource | undefined =>
    state.sources.find((s) => s.id === sourceId);
}

/**
 * Select all sources for a given presentation.
 * Usage: `const sources = useSmartListSourceStore(selectSourcesByPresentation('pres-123'))`
 */
export function selectSourcesByPresentation(presentationId: string) {
  return (state: SmartListSourceState): SmartListSource[] =>
    state.sources.filter((s) => s.presentationId === presentationId);
}

/**
 * Select all items from a source by ID. Returns empty array if source not found.
 * This enables widgets with `sourceId` to subscribe to just the items they need.
 */
export function selectSourceItems(sourceId: string) {
  return (state: SmartListSourceState): SmartListSource['items'] =>
    state.sources.find((s) => s.id === sourceId)?.items ?? [];
}
