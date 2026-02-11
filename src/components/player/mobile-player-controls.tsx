/**
 * Touch-friendly mobile player controls with tap-to-show and swipe navigation.
 * @source docs/modules/export-publish/web-player.md
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MobilePlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MobilePlayerControls({
  isPlaying,
  onPlayPause,
  onPrevSlide,
  onNextSlide,
}: MobilePlayerControlsProps) {
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track touch for swipe detection
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // --- Auto-hide controls after 3 seconds ---
  useEffect(() => {
    if (!showControls) return;

    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls, isPlaying]);

  // --- Swipe detection ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const minSwipeDistance = 50;

      // Only register horizontal swipes (ignore vertical scrolls)
      if (
        Math.abs(deltaX) > minSwipeDistance &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        if (deltaX > 0) {
          onPrevSlide(); // Swipe right → previous slide
        } else {
          onNextSlide(); // Swipe left → next slide
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    },
    [onPrevSlide, onNextSlide],
  );

  const handleTap = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  return (
    <div
      className="absolute inset-0"
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Overlay controls */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex items-center gap-10">
          {/* Previous */}
          <button
            className="rounded-full bg-black/40 p-4 text-white active:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              onPrevSlide();
            }}
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            className="rounded-full bg-black/40 p-5 text-white active:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            className="rounded-full bg-black/40 p-4 text-white active:bg-black/60"
            onClick={(e) => {
              e.stopPropagation();
              onNextSlide();
            }}
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 18l8.5-6L6 6v12zm10 0h2V6h-2v12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swipe hint (shown briefly on first load) */}
      {!showControls && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <span className="animate-pulse rounded-full bg-white/20 px-3 py-1 text-xs text-white/50">
            Tap to show controls &middot; Swipe to navigate
          </span>
        </div>
      )}
    </div>
  );
}
