/**
 * Slide Animation context & hook — manages the animation overlay layer.
 *
 * Components in the layout layer use `useSlideAnimation()` to "promote"
 * an item to the animation layer for cross-boundary flights:
 *
 *   1. `promote(id, from, to, opts)` — hides the source item and renders
 *      a motion.div clone in the overlay that animates from → to.
 *   2. On completion the flight is removed and a callback fires so the
 *      consumer can show the item in its new container.
 *
 * The AnimationLayer component consumes this context to render active flights.
 */

'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A rect measured relative to the slide frame's top-left corner. */
export interface FrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Transition configuration for a flight animation. */
export interface FlightTransition {
  /** Duration in seconds. */
  duration?: number;
  /** Easing curve name or cubic-bezier. */
  ease?: string | number[];
  /** Spring configuration (overrides duration/ease when set). */
  spring?: { stiffness?: number; damping?: number; mass?: number };
}

/** A single in-progress cross-boundary flight animation. */
export interface FlightAnimation {
  /** Unique flight ID (usually the item ID). */
  id: string;
  /** Starting rect (measured from the source container). */
  from: FrameRect;
  /** Target rect (measured from the target container). */
  to: FrameRect;
  /** Transition configuration. */
  transition: FlightTransition;
  /** The React element to render inside the flying clone. */
  render: () => ReactNode;
  /** Callback fired when the flight animation completes. */
  onComplete?: () => void;
}

/** Public API returned by `useSlideAnimation()`. */
export interface SlideAnimationAPI {
  /** Currently active flight animations. */
  flights: FlightAnimation[];
  /**
   * Promote an item to the animation layer.
   * The item should be hidden in its source container while the flight is active.
   */
  promote: (flight: FlightAnimation) => void;
  /** Remove a flight (called automatically on animation complete). */
  dismiss: (flightId: string) => void;
  /** Remove all active flights. */
  dismissAll: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SlideAnimationContext = createContext<SlideAnimationAPI | null>(null);

/**
 * Access the slide animation API from any component inside a SlideFrame.
 * Throws if used outside of a SlideAnimationProvider.
 */
export function useSlideAnimation(): SlideAnimationAPI {
  const ctx = useContext(SlideAnimationContext);
  if (!ctx) {
    throw new Error(
      'useSlideAnimation() must be used inside a <SlideAnimationProvider>',
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SlideAnimationProvider({ children }: { children: ReactNode }) {
  const [flights, setFlights] = useState<FlightAnimation[]>([]);

  const promote = useCallback((flight: FlightAnimation) => {
    setFlights((prev) => {
      // Replace if same ID already exists (re-promote)
      const filtered = prev.filter((f) => f.id !== flight.id);
      return [...filtered, flight];
    });
  }, []);

  const dismiss = useCallback((flightId: string) => {
    setFlights((prev) => {
      const flight = prev.find((f) => f.id === flightId);
      // Fire the onComplete callback
      flight?.onComplete?.();
      return prev.filter((f) => f.id !== flightId);
    });
  }, []);

  const dismissAll = useCallback(() => {
    setFlights((prev) => {
      prev.forEach((f) => f.onComplete?.());
      return [];
    });
  }, []);

  const api: SlideAnimationAPI = {
    flights,
    promote,
    dismiss,
    dismissAll,
  };

  return (
    <SlideAnimationContext.Provider value={api}>
      {children}
    </SlideAnimationContext.Provider>
  );
}
