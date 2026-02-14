/**
 * Hook that manages the slide frame's computed pixel size.
 *
 * The frame fills its container at 16:9 aspect ratio and computes
 * a stable pixel size. During browser resize, updates are debounced
 * so animations are never disrupted mid-flight.
 */

'use client';

import { useState, useEffect, useCallback, type RefObject } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SlideFrameSize {
  /** Computed width of the slide frame in pixels. */
  width: number;
  /** Computed height of the slide frame in pixels. */
  height: number;
  /** Whether the initial measurement has completed. */
  ready: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Base canvas dimensions used for coordinate normalization. */
export const CANVAS_BASE_WIDTH = 960;
export const CANVAS_BASE_HEIGHT = 540;
const ASPECT_RATIO = 16 / 9;
const RESIZE_DEBOUNCE_MS = 150;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Measures the container and returns a stable pixel size for the slide frame.
 *
 * - On mount, measures the container's width and computes height from 16:9.
 * - On resize, waits for the resize to settle (150ms debounce) before
 *   recalculating — so in-progress animations are not disrupted.
 *
 * @param containerRef — ref to the outer container that the frame should fill
 */
export function useSlideFrame(
  containerRef: RefObject<HTMLDivElement | null>,
): SlideFrameSize {
  const [size, setSize] = useState<SlideFrameSize>({
    width: CANVAS_BASE_WIDTH,
    height: CANVAS_BASE_HEIGHT,
    ready: false,
  });

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(width / ASPECT_RATIO);
    setSize({ width, height, ready: true });
  }, [containerRef]);

  useEffect(() => {
    // Initial measurement
    measure();

    // Debounced resize observer
    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new ResizeObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        measure();
      }, RESIZE_DEBOUNCE_MS);
    });

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [containerRef, measure]);

  return size;
}
