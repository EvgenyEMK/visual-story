/**
 * Zustand store for undo/redo history.
 *
 * Stores snapshots of the `Slide[]` array to enable multi-step undo/redo.
 * The project store calls `saveSnapshot()` before each mutation so the
 * previous state is captured, and exposes `undo()` / `redo()` actions
 * that restore slides from the history stacks.
 *
 * Design:
 * - Snapshot-based (full Slide[] copy per entry) — simple, correct, and
 *   sufficient for the typical number of slides in a deck.
 * - Capped at MAX_HISTORY_SIZE to limit memory.
 * - A new mutation after an undo clears the redo (future) stack, matching
 *   the standard behaviour of every undo system.
 */

import { create } from 'zustand';
import type { Slide } from '@/types/slide';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum number of undo snapshots to keep. */
export const MAX_HISTORY_SIZE = 50;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface UndoRedoState {
  /** Stack of previous slide states (most recent at end). */
  past: Slide[][];
  /** Stack of future slide states for redo (most recent at end). */
  future: Slide[][];
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface UndoRedoActions {
  /**
   * Save a snapshot of the current slides before a mutation.
   * Clears the redo (future) stack — a new action starts a new branch.
   */
  saveSnapshot: (slides: Slide[]) => void;

  /**
   * Undo: restore the most recent past state.
   * Pushes `currentSlides` onto the future stack so it can be redo-ed.
   * @returns The restored `Slide[]`, or `null` if nothing to undo.
   */
  undo: (currentSlides: Slide[]) => Slide[] | null;

  /**
   * Redo: restore the most recent future state.
   * Pushes `currentSlides` onto the past stack.
   * @returns The restored `Slide[]`, or `null` if nothing to redo.
   */
  redo: (currentSlides: Slide[]) => Slide[] | null;

  /** Clear all history (e.g., when loading a new project). */
  clear: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUndoRedoStore = create<UndoRedoState & UndoRedoActions>(
  (set, get) => ({
    past: [],
    future: [],

    saveSnapshot: (slides) =>
      set((state) => ({
        past: [
          ...state.past.slice(-(MAX_HISTORY_SIZE - 1)),
          slides,
        ],
        future: [],
      })),

    undo: (currentSlides) => {
      const { past, future } = get();
      if (past.length === 0) return null;

      const previous = past[past.length - 1];
      set({
        past: past.slice(0, -1),
        future: [...future, currentSlides],
      });
      return previous;
    },

    redo: (currentSlides) => {
      const { past, future } = get();
      if (future.length === 0) return null;

      const next = future[future.length - 1];
      set({
        past: [...past, currentSlides],
        future: future.slice(0, -1),
      });
      return next;
    },

    clear: () => set({ past: [], future: [] }),
  }),
);
