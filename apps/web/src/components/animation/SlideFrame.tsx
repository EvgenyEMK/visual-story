/**
 * SlideFrame — the top-level container for a slide's visual content.
 *
 * Architecture (three layers, bottom to top):
 *
 *   z:0   — Layout Layer   — DOM flex/grid layout rendered by ItemRenderer
 *   z:50  — Animation Layer — motion.dev overlay for cross-boundary flights
 *   z:100 — HUD Layer       — controls, debug labels, click hints
 *
 * When a `header` prop is provided, the Layout Layer splits into two
 * regions — a shrink-to-fit header at the top and a flex-1 content area
 * below. Both regions have `overflow: hidden` so animations in the
 * content area do not bleed into the header.
 *
 * The frame maintains a static pixel size (16:9 aspect ratio) and only
 * recalculates after browser resize settles (debounced). This ensures
 * that animations are never disrupted by mid-resize reflows.
 */

'use client';

import {
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { useSlideFrame, type SlideFrameSize } from '@/hooks/useSlideFrame';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SlideFrameContext = createContext<SlideFrameSize>({
  width: 960,
  height: 540,
  ready: false,
});

/**
 * Access the current slide frame size from any descendant component.
 * Useful for coordinate calculations in the animation layer.
 */
export function useSlideFrameContext(): SlideFrameSize {
  return useContext(SlideFrameContext);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SlideFrameProps {
  /**
   * Optional header content rendered above the main content area.
   * When provided the Layout Layer splits into header + content regions.
   * Typically a <SlideHeaderRenderer />.
   */
  header?: ReactNode;
  /** The layout layer content (typically an <ItemRenderer /> tree). */
  children: ReactNode;
  /** Optional content rendered in the animation layer (z:50). */
  animationLayer?: ReactNode;
  /** Optional content rendered in the HUD layer (z:100). */
  hudLayer?: ReactNode;
  /** Additional CSS class names on the outer container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlideFrame({
  header,
  children,
  animationLayer,
  hudLayer,
  className = '',
}: SlideFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameSize = useSlideFrame(containerRef);

  return (
    <SlideFrameContext.Provider value={frameSize}>
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* Layout Layer (z:0) — DOM-driven flex/grid content */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{ zIndex: 0 }}
        >
          {/* Header region — shrink-to-fit, isolated overflow */}
          {header && (
            <div className="shrink-0" style={{ overflow: 'hidden', isolation: 'isolate' }}>
              {header}
            </div>
          )}

          {/* Content region — fills remaining space */}
          <div className="flex-1 min-h-0 relative" style={{ overflow: 'hidden' }}>
            {children}
          </div>
        </div>

        {/* Animation Layer (z:50) — motion.dev flight clones */}
        {animationLayer && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 50 }}
          >
            {animationLayer}
          </div>
        )}

        {/* HUD Layer (z:100) — controls, labels, debug overlays */}
        {hudLayer && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 100 }}
          >
            {hudLayer}
          </div>
        )}
      </div>
    </SlideFrameContext.Provider>
  );
}
