/**
 * Zustand store for the web player playback state.
 * Used by the WebPlayer, PlayerControls, and MobilePlayerControls components.
 * @source docs/modules/export-publish/web-player.md
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface PlayerState {
  /** Whether playback is active. */
  isPlaying: boolean;
  /** Whether slides auto-advance based on timing / voice-over. */
  isAutoMode: boolean;
  /** Current slide index (0-based). */
  currentSlideIndex: number;
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
  /** Go to the next slide. */
  nextSlide: () => void;
  /** Go to the previous slide. */
  prevSlide: () => void;
  /** Jump to a specific slide by index. */
  goToSlide: (index: number) => void;
  /** Seek to a specific time in milliseconds. */
  seekTo: (timeMs: number) => void;
  /** Toggle auto-advance mode. */
  toggleAutoMode: () => void;
  /** Set auto-mode explicitly. */
  setAutoMode: (auto: boolean) => void;
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
  isAutoMode: true,
  currentSlideIndex: 0,
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

  nextSlide: () =>
    set((s) => ({
      currentSlideIndex: Math.min(s.totalSlides - 1, s.currentSlideIndex + 1),
    })),

  prevSlide: () =>
    set((s) => ({
      currentSlideIndex: Math.max(0, s.currentSlideIndex - 1),
    })),

  goToSlide: (index) =>
    set((s) => ({
      currentSlideIndex: Math.max(0, Math.min(s.totalSlides - 1, index)),
    })),

  seekTo: (timeMs) =>
    set((s) => ({
      currentTime: Math.max(0, Math.min(s.totalDuration, timeMs)),
    })),

  toggleAutoMode: () =>
    set((s) => ({ isAutoMode: !s.isAutoMode })),

  setAutoMode: (auto) =>
    set({ isAutoMode: auto }),

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
      currentTime: 0,
      isPlaying: false,
    }),

  reset: () => set(initialState),
}));
