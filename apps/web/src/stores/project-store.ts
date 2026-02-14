/**
 * Zustand store for project data and slide management.
 * Manages the active project, slides array, and dirty state.
 * @source docs/modules/user-management/projects-library.md
 * @source docs/modules/story-editor/slide-canvas.md
 */

import { create } from 'zustand';
import type { Project } from '@/types/project';
import type { Slide, SlideElement } from '@/types/slide';
import { flattenItemsAsElements } from '@/lib/flatten-items';

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

  // Element operations within a slide
  /** Update an element within a specific slide. */
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
  /** Add an element to a slide. */
  addElement: (slideId: string, element: SlideElement) => void;
  /** Remove an element from a slide. */
  removeElement: (slideId: string, elementId: string) => void;

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

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  ...initialState,

  setProject: (project) =>
    set({
      project,
      slides: project.slides,
      isDirty: false,
      isLoading: false,
    }),

  clearProject: () =>
    set(initialState),

  updateProject: (updates) =>
    set((state) => ({
      project: state.project ? { ...state.project, ...updates } : null,
      isDirty: true,
    })),

  // -- Slide operations --

  updateSlide: (slideId, updates) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === slideId ? { ...s, ...updates } : s,
      ),
      isDirty: true,
    })),

  addSlide: (slide, atIndex) =>
    set((state) => {
      const newSlides = [...state.slides];
      const insertAt = atIndex ?? newSlides.length;
      newSlides.splice(insertAt, 0, slide);
      // Re-order
      const ordered = newSlides.map((s, i) => ({ ...s, order: i }));
      return { slides: ordered, isDirty: true };
    }),

  removeSlide: (slideId) =>
    set((state) => {
      const filtered = state.slides.filter((s) => s.id !== slideId);
      const ordered = filtered.map((s, i) => ({ ...s, order: i }));
      return { slides: ordered, isDirty: true };
    }),

  reorderSlides: (fromIndex, toIndex) =>
    set((state) => {
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
      items: slide.items, // TODO: deep-clone with new IDs when item editing is implemented
    };

    const idx = state.slides.findIndex((s) => s.id === slideId);
    set((s) => {
      const newSlides = [...s.slides];
      newSlides.splice(idx + 1, 0, duplicate);
      const ordered = newSlides.map((sl, i) => ({ ...sl, order: i }));
      return { slides: ordered, isDirty: true };
    });

    return newId;
  },

  // -- Element operations --

  updateElement: (slideId, elementId, updates) =>
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id !== slideId) return s;
        const elts =
          flattenItemsAsElements(s.items);
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
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id !== slideId) return s;
        const elts =
          flattenItemsAsElements(s.items);
        return { ...s, elements: [...elts, element] };
      }),
      isDirty: true,
    })),

  removeElement: (slideId, elementId) =>
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id !== slideId) return s;
        const elts =
          flattenItemsAsElements(s.items);
        return {
          ...s,
          elements: elts.filter((el) => el.id !== elementId),
        };
      }),
      isDirty: true,
    })),

  // -- Dirty tracking --

  markSaved: () =>
    set({ isDirty: false, lastSavedAt: new Date() }),

  setLoading: (loading) =>
    set({ isLoading: loading }),
}));
