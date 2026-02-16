/**
 * Zustand store for project data and slide management.
 * Manages the active project, slides array, and dirty state.
 *
 * All slide-mutating actions automatically save a snapshot to the
 * undo/redo history before applying the change.
 *
 * @source docs/modules/user-management/projects-library.md
 * @source docs/modules/story-editor/slide-canvas.md
 */

import { create } from 'zustand';
import type { Project } from '@/types/project';
import type { Slide, SlideElement, SlideItem } from '@/types/slide';
import { flattenItemsAsElements, updateItemInTree, appendChildrenToItem, deepCloneItemsWithNewIds } from '@/lib/flatten-items';
import { useUndoRedoStore } from './undo-redo-store';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface ProjectState {
  /** The currently loaded project (null before loading). */
  project: Project | null;
  /** Ordered array of slides for the current project. */
  slides: Slide[];
  /** Whether unsaved changes exist. */
  isDirty: boolean;
  /** Whether the project is being loaded. */
  isLoading: boolean;
  /** Last saved timestamp. */
  lastSavedAt: Date | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface ProjectActions {
  /** Load a project into the store. */
  setProject: (project: Project) => void;
  /** Clear the current project. */
  clearProject: () => void;
  /** Update metadata on the project (name, intent, etc.). */
  updateProject: (updates: Partial<Pick<Project, 'name' | 'script' | 'intent' | 'status'>>) => void;

  // Slide operations
  /** Replace a single slide by ID. */
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  /** Add a new slide at the given index (or at end if omitted). */
  addSlide: (slide: Slide, atIndex?: number) => void;
  /** Remove a slide by ID. */
  removeSlide: (slideId: string) => void;
  /** Reorder slides by moving from one index to another. */
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  /** Duplicate a slide by ID. Returns the new slide ID. */
  duplicateSlide: (slideId: string) => string | null;

  // Item operations within a slide (items tree)
  /** Immutably update a single item in the slide's items tree by ID. */
  updateItem: (slideId: string, itemId: string, updates: Partial<SlideItem>) => void;
  /** Append new child items to a card or layout in the items tree. */
  appendChildToItem: (slideId: string, parentId: string, newChildren: SlideItem[]) => void;

  // Element operations within a slide (legacy flat array)
  /** Update an element within a specific slide. */
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
  /** Add an element to a slide. */
  addElement: (slideId: string, element: SlideElement) => void;
  /** Remove an element from a slide. */
  removeElement: (slideId: string, elementId: string) => void;

  // Undo / Redo
  /** Undo the last slide mutation. */
  undo: () => void;
  /** Redo the last undone slide mutation. */
  redo: () => void;

  // Dirty tracking
  /** Mark as saved (resets dirty flag). */
  markSaved: () => void;
  /** Set loading state. */
  setLoading: (loading: boolean) => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: ProjectState = {
  project: null,
  slides: [],
  isDirty: false,
  isLoading: false,
  lastSavedAt: null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectState & ProjectActions>(
  (set, get) => {
    /**
     * Wrapper around `set` that saves a snapshot of the current slides
     * to the undo history before applying the state change.
     * Use for every action that mutates `slides`.
     */
    const setWithUndo: typeof set = (...args) => {
      useUndoRedoStore.getState().saveSnapshot(get().slides);
      return set(...args);
    };

    return {
      ...initialState,

      setProject: (project) => {
        useUndoRedoStore.getState().clear();
        set({
          project,
          slides: project.slides,
          isDirty: false,
          isLoading: false,
        });
      },

      clearProject: () => {
        useUndoRedoStore.getState().clear();
        set(initialState);
      },

      updateProject: (updates) =>
        set((state) => ({
          project: state.project ? { ...state.project, ...updates } : null,
          isDirty: true,
        })),

      // -- Slide operations (all undoable) --

      updateSlide: (slideId, updates) =>
        setWithUndo((state) => ({
          slides: state.slides.map((s) =>
            s.id === slideId ? { ...s, ...updates } : s,
          ),
          isDirty: true,
        })),

      addSlide: (slide, atIndex) =>
        setWithUndo((state) => {
          const newSlides = [...state.slides];
          const insertAt = atIndex ?? newSlides.length;
          newSlides.splice(insertAt, 0, slide);
          const ordered = newSlides.map((s, i) => ({ ...s, order: i }));
          return { slides: ordered, isDirty: true };
        }),

      removeSlide: (slideId) =>
        setWithUndo((state) => {
          const filtered = state.slides.filter((s) => s.id !== slideId);
          const ordered = filtered.map((s, i) => ({ ...s, order: i }));
          return { slides: ordered, isDirty: true };
        }),

      reorderSlides: (fromIndex, toIndex) =>
        setWithUndo((state) => {
          const newSlides = [...state.slides];
          const [moved] = newSlides.splice(fromIndex, 1);
          if (!moved) return state;
          newSlides.splice(toIndex, 0, moved);
          const ordered = newSlides.map((s, i) => ({ ...s, order: i }));
          return { slides: ordered, isDirty: true };
        }),

      duplicateSlide: (slideId) => {
        const state = get();
        const slide = state.slides.find((s) => s.id === slideId);
        if (!slide) return null;

        const newId = crypto.randomUUID();
        const sourceElements = flattenItemsAsElements(slide.items);
        const duplicate: Slide = {
          ...slide,
          id: newId,
          order: slide.order + 1,
          elements: sourceElements.map((el) => ({
            ...el,
            id: crypto.randomUUID(),
          })),
          items: deepCloneItemsWithNewIds(slide.items),
        };

        const idx = state.slides.findIndex((s) => s.id === slideId);
        setWithUndo((s) => {
          const newSlides = [...s.slides];
          newSlides.splice(idx + 1, 0, duplicate);
          const ordered = newSlides.map((sl, i) => ({ ...sl, order: i }));
          return { slides: ordered, isDirty: true };
        });

        return newId;
      },

      // -- Item operations (items tree, undoable) --

      updateItem: (slideId, itemId, updates) =>
        setWithUndo((state) => ({
          slides: state.slides.map((s) => {
            if (s.id !== slideId) return s;
            const newItems = updateItemInTree(s.items, itemId, updates);
            if (newItems === s.items) return s;
            return { ...s, items: newItems };
          }),
          isDirty: true,
        })),

      appendChildToItem: (slideId, parentId, newChildren) =>
        setWithUndo((state) => ({
          slides: state.slides.map((s) => {
            if (s.id !== slideId) return s;
            const newItems = appendChildrenToItem(s.items, parentId, newChildren);
            if (newItems === s.items) return s;
            return { ...s, items: newItems };
          }),
          isDirty: true,
        })),

      // -- Element operations (legacy, undoable) --

      updateElement: (slideId, elementId, updates) =>
        setWithUndo((state) => ({
          slides: state.slides.map((s) => {
            if (s.id !== slideId) return s;
            const elts = flattenItemsAsElements(s.items);
            return {
              ...s,
              elements: elts.map((el) =>
                el.id === elementId ? { ...el, ...updates } : el,
              ),
            };
          }),
          isDirty: true,
        })),

      addElement: (slideId, element) =>
        setWithUndo((state) => ({
          slides: state.slides.map((s) => {
            if (s.id !== slideId) return s;
            const elts = flattenItemsAsElements(s.items);
            return { ...s, elements: [...elts, element] };
          }),
          isDirty: true,
        })),

      removeElement: (slideId, elementId) =>
        setWithUndo((state) => ({
          slides: state.slides.map((s) => {
            if (s.id !== slideId) return s;
            const elts = flattenItemsAsElements(s.items);
            return {
              ...s,
              elements: elts.filter((el) => el.id !== elementId),
            };
          }),
          isDirty: true,
        })),

      // -- Undo / Redo --

      undo: () => {
        const restored = useUndoRedoStore.getState().undo(get().slides);
        if (restored) {
          set({ slides: restored, isDirty: true });
        }
      },

      redo: () => {
        const restored = useUndoRedoStore.getState().redo(get().slides);
        if (restored) {
          set({ slides: restored, isDirty: true });
        }
      },

      // -- Dirty tracking --

      markSaved: () =>
        set({ isDirty: false, lastSavedAt: new Date() }),

      setLoading: (loading) =>
        set({ isLoading: loading }),
    };
  },
);
