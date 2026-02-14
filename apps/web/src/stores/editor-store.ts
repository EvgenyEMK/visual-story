/**
 * Zustand store for the slide editor state.
 * Manages current slide selection, element selection, playback, and canvas settings.
 * @source docs/modules/story-editor/ (slide-canvas, element-properties, timeline-view)
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface EditorState {
  /** Index of the currently active slide in the slides array. */
  currentSlideIndex: number;
  /** ID of the currently selected element (null = no selection). */
  selectedElementId: string | null;

  // -- Scene-level state (ADR-001) --
  /** Index of the currently active scene within the slide (0-based). */
  currentSceneIndex: number;
  /** Current animation step within the active scene (0-based). */
  currentStepIndex: number;
  /** Whether to show scenes in the sidebar and step strip. */
  showScenes: boolean;

  /** Whether preview playback is active. */
  isPlaying: boolean;
  /** Current playback time in milliseconds. */
  currentTime: number;
  /** Canvas zoom level (1 = 100%). */
  zoom: number;
  /** Whether the alignment grid overlay is visible. */
  showGrid: boolean;
  /** Whether the right-side properties panel is open. */
  showProperties: boolean;

  /** Section ID → collapsed (true = collapsed). Omitted or false = expanded. */
  collapsedSections: Record<string, boolean>;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface EditorActions {
  /** Select a slide by index. Clears element and scene selection. */
  selectSlide: (index: number) => void;
  /** Select an element by ID (or null to deselect). */
  selectElement: (elementId: string | null) => void;

  // -- Scene-level actions (ADR-001) --
  /** Select a scene within the current slide. Resets step to 0. */
  selectScene: (sceneIndex: number) => void;
  /** Set the animation step within the current scene. */
  setStepIndex: (stepIndex: number) => void;
  /** Toggle the scenes panel visibility. */
  toggleScenes: () => void;

  /** Toggle preview playback. */
  setPlaying: (playing: boolean) => void;
  /** Toggle play/pause. */
  togglePlaying: () => void;
  /** Set the current playback time (ms). */
  setCurrentTime: (time: number) => void;
  /** Set the canvas zoom level. */
  setZoom: (zoom: number) => void;
  /** Zoom in by a step. */
  zoomIn: () => void;
  /** Zoom out by a step. */
  zoomOut: () => void;
  /** Reset zoom to 100%. */
  resetZoom: () => void;
  /** Toggle the alignment grid. */
  toggleGrid: () => void;
  /** Toggle the properties panel. */
  toggleProperties: () => void;
  /** Toggle section collapse in the slide sidebar. */
  toggleSectionCollapse: (sectionId: string) => void;
  /** Reset the entire editor state. */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: EditorState = {
  currentSlideIndex: 0,
  selectedElementId: null,
  currentSceneIndex: 0,
  currentStepIndex: 0,
  showScenes: true,
  isPlaying: false,
  currentTime: 0,
  zoom: 1,
  showGrid: false,
  showProperties: true,
  collapsedSections: {},
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

export const useEditorStore = create<EditorState & EditorActions>((set) => ({
  ...initialState,

  selectSlide: (index) =>
    set({ currentSlideIndex: index, selectedElementId: null, currentSceneIndex: 0, currentStepIndex: 0 }),

  selectElement: (elementId) =>
    set({ selectedElementId: elementId }),

  // -- Scene-level actions (ADR-001) --

  selectScene: (sceneIndex) =>
    set({ currentSceneIndex: sceneIndex, currentStepIndex: 0, selectedElementId: null }),

  setStepIndex: (stepIndex) =>
    set({ currentStepIndex: stepIndex }),

  toggleScenes: () =>
    set((state) => ({ showScenes: !state.showScenes })),

  setPlaying: (playing) =>
    set({ isPlaying: playing }),

  togglePlaying: () =>
    set((state) => ({ isPlaying: !state.isPlaying })),

  setCurrentTime: (time) =>
    set({ currentTime: time }),

  setZoom: (zoom) =>
    set({ zoom: Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom)) }),

  zoomIn: () =>
    set((state) => ({
      zoom: Math.min(ZOOM_MAX, state.zoom + ZOOM_STEP),
    })),

  zoomOut: () =>
    set((state) => ({
      zoom: Math.max(ZOOM_MIN, state.zoom - ZOOM_STEP),
    })),

  resetZoom: () =>
    set({ zoom: 1 }),

  toggleGrid: () =>
    set((state) => ({ showGrid: !state.showGrid })),

  toggleProperties: () =>
    set((state) => ({ showProperties: !state.showProperties })),

  toggleSectionCollapse: (sectionId) =>
    set((state) => ({
      collapsedSections: {
        ...state.collapsedSections,
        [sectionId]: !state.collapsedSections[sectionId],
      },
    })),

  reset: () =>
    set(initialState),
}));
