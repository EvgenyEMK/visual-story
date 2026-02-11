/**
 * Zustand store for the web player playback state.
 * Handles both auto-mode (voice-over / timed) and click-mode (live presentation)
 * with per-slide trigger mode resolution and animation step tracking.
 *
 * @source docs/modules/export-publish/web-player.md
 * @source docs/modules/animation-engine/README.md — Trigger Modes
 */

import { create } from 'zustand';
import type { TriggerMode } from '@/types/slide';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface PlayerState {
  /** Whether playback is active. */
  isPlaying: boolean;
  /** Project-level default trigger mode. */
  projectTriggerMode: TriggerMode;
  /** Per-slide trigger mode overrides (sparse — only slides that differ from project default). */
  slideTriggerModes: Record<number, TriggerMode>;
  /** Current slide index (0-based). */
  currentSlideIndex: number;
  /**
   * Current animation step within the active slide (0-based).
   * In click mode, each click advances this counter.
   * When `currentAnimStep >= totalAnimSteps`, the slide is "complete" and
   * the next click triggers the slide transition.
   */
  currentAnimStep: number;
  /** Total animation steps on the current slide (element animations + grouped items). */
  totalAnimSteps: number;
  /** Current playback time in milliseconds. */
  currentTime: number;
  /** Total presentation duration in milliseconds. */
  totalDuration: number;
  /** Total number of slides. */
  totalSlides: number;
  /** Whether the player is in fullscreen. */
  isFullscreen: boolean;
  /** Volume level (0 to 1). */
  volume: number;
  /** Whether audio is muted. */
  isMuted: boolean;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface PlayerActions {
  /** Start playback. */
  play: () => void;
  /** Pause playback. */
  pause: () => void;
  /** Toggle play/pause. */
  togglePlay: () => void;

  // -- Slide navigation --
  /** Go to the next slide (resets animation step to 0). */
  nextSlide: () => void;
  /** Go to the previous slide (resets animation step to 0). */
  prevSlide: () => void;
  /** Jump to a specific slide by index. */
  goToSlide: (index: number) => void;

  // -- Animation step navigation (click mode) --
  /** Advance to the next animation step. If all steps complete, advances slide. */
  advanceStep: () => void;
  /** Go back one animation step. If at step 0, goes to previous slide's last step. */
  retreatStep: () => void;
  /** Jump to a specific step (for out-of-order group navigation). */
  goToStep: (step: number) => void;
  /** Jump to the group start state (step 0, all items hidden). */
  toGroupStart: () => void;
  /** Jump to the group end state (all items revealed). */
  toGroupEnd: () => void;
  /** Set the total animation steps for the current slide. */
  setTotalAnimSteps: (count: number) => void;

  // -- Trigger mode --
  /** Set the project-level default trigger mode. */
  setProjectTriggerMode: (mode: TriggerMode) => void;
  /** Set a per-slide trigger mode override. */
  setSlideTriggerMode: (slideIndex: number, mode: TriggerMode) => void;
  /** Clear a per-slide trigger mode override (revert to project default). */
  clearSlideTriggerMode: (slideIndex: number) => void;
  /** Resolve the effective trigger mode for a given slide index. */
  getEffectiveTriggerMode: (slideIndex: number) => TriggerMode;

  // -- Playback controls --
  /** Seek to a specific time in milliseconds. */
  seekTo: (timeMs: number) => void;
  /** Toggle fullscreen state. */
  toggleFullscreen: () => void;
  /** Set volume (0 to 1). */
  setVolume: (volume: number) => void;
  /** Toggle mute. */
  toggleMute: () => void;
  /** Initialize player with presentation data. */
  initPlayer: (totalDuration: number, totalSlides: number) => void;
  /** Reset the player to initial state. */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: PlayerState = {
  isPlaying: false,
  projectTriggerMode: 'auto',
  slideTriggerModes: {},
  currentSlideIndex: 0,
  currentAnimStep: 0,
  totalAnimSteps: 0,
  currentTime: 0,
  totalDuration: 0,
  totalSlides: 0,
  isFullscreen: false,
  volume: 1,
  isMuted: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  ...initialState,

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  // -- Slide navigation --

  nextSlide: () =>
    set((s) => ({
      currentSlideIndex: Math.min(s.totalSlides - 1, s.currentSlideIndex + 1),
      currentAnimStep: 0,
      totalAnimSteps: 0,
    })),

  prevSlide: () =>
    set((s) => ({
      currentSlideIndex: Math.max(0, s.currentSlideIndex - 1),
      currentAnimStep: 0,
      totalAnimSteps: 0,
    })),

  goToSlide: (index) =>
    set((s) => ({
      currentSlideIndex: Math.max(0, Math.min(s.totalSlides - 1, index)),
      currentAnimStep: 0,
      totalAnimSteps: 0,
    })),

  // -- Animation step navigation --

  advanceStep: () => {
    const s = get();
    if (s.currentAnimStep < s.totalAnimSteps) {
      set({ currentAnimStep: s.currentAnimStep + 1 });
    } else {
      // All steps complete — advance to next slide
      if (s.currentSlideIndex < s.totalSlides - 1) {
        set({
          currentSlideIndex: s.currentSlideIndex + 1,
          currentAnimStep: 0,
          totalAnimSteps: 0,
        });
      }
    }
  },

  retreatStep: () => {
    const s = get();
    if (s.currentAnimStep > 0) {
      set({ currentAnimStep: s.currentAnimStep - 1 });
    } else if (s.currentSlideIndex > 0) {
      // At step 0 — go to previous slide
      set({
        currentSlideIndex: s.currentSlideIndex - 1,
        currentAnimStep: 0,
        totalAnimSteps: 0,
      });
    }
  },

  goToStep: (step) =>
    set((s) => ({
      currentAnimStep: Math.max(0, Math.min(s.totalAnimSteps, step)),
    })),

  toGroupStart: () =>
    set({ currentAnimStep: 0 }),

  toGroupEnd: () =>
    set((s) => ({ currentAnimStep: s.totalAnimSteps })),

  setTotalAnimSteps: (count) =>
    set({ totalAnimSteps: count }),

  // -- Trigger mode --

  setProjectTriggerMode: (mode) =>
    set({ projectTriggerMode: mode }),

  setSlideTriggerMode: (slideIndex, mode) =>
    set((s) => ({
      slideTriggerModes: { ...s.slideTriggerModes, [slideIndex]: mode },
    })),

  clearSlideTriggerMode: (slideIndex) =>
    set((s) => {
      const updated = { ...s.slideTriggerModes };
      delete updated[slideIndex];
      return { slideTriggerModes: updated };
    }),

  getEffectiveTriggerMode: (slideIndex) => {
    const s = get();
    return s.slideTriggerModes[slideIndex] ?? s.projectTriggerMode;
  },

  // -- Playback controls --

  seekTo: (timeMs) =>
    set((s) => ({
      currentTime: Math.max(0, Math.min(s.totalDuration, timeMs)),
    })),

  toggleFullscreen: () =>
    set((s) => ({ isFullscreen: !s.isFullscreen })),

  setVolume: (volume) =>
    set({ volume: Math.max(0, Math.min(1, volume)), isMuted: false }),

  toggleMute: () =>
    set((s) => ({ isMuted: !s.isMuted })),

  initPlayer: (totalDuration, totalSlides) =>
    set({
      totalDuration,
      totalSlides,
      currentSlideIndex: 0,
      currentAnimStep: 0,
      totalAnimSteps: 0,
      currentTime: 0,
      isPlaying: false,
    }),

  reset: () => set(initialState),
}));
