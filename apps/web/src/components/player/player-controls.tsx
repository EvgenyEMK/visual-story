/**
 * Desktop player control bar with progress scrubbing, playback, and auto-mode.
 * @source docs/modules/export-publish/web-player.md
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PlayerControlsProps {
  isPlaying: boolean;
  isAutoMode: boolean;
  /** Current playback position in milliseconds. */
  currentTime: number;
  /** Total presentation duration in milliseconds. */
  totalDuration: number;
  /** 1-based current slide number. */
  currentSlide: number;
  totalSlides: number;
  onPlayPause: () => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSeek: (timeMs: number) => void;
  onToggleAutoMode: () => void;
  onFullscreen: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PlayerControls({
  isPlaying,
  isAutoMode,
  currentTime,
  totalDuration,
  currentSlide,
  totalSlides,
  onPlayPause,
  onPrevSlide,
  onNextSlide,
  onSeek,
  onToggleAutoMode,
  onFullscreen,
}: PlayerControlsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // --- Auto-hide after 3 seconds of inactivity ---
  useEffect(() => {
    const scheduleHide = () => {
      setIsVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (isPlaying) setIsVisible(false);
      }, 3000);
    };

    window.addEventListener('mousemove', scheduleHide);
    window.addEventListener('touchstart', scheduleHide);

    return () => {
      window.removeEventListener('mousemove', scheduleHide);
      window.removeEventListener('touchstart', scheduleHide);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isPlaying]);

  // Always visible when paused
  useEffect(() => {
    if (!isPlaying) setIsVisible(true);
  }, [isPlaying]);

  // --- Progress bar click/drag to seek ---
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || totalDuration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(pct * totalDuration);
    },
    [onSeek, totalDuration],
  );

  const progressPct =
    totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="group mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20"
        onClick={handleProgressClick}
      >
        <div
          className="relative h-full rounded-full bg-white transition-[width] duration-100"
          style={{ width: `${progressPct}%` }}
        >
          {/* Scrub handle (visible on hover) */}
          <div className="absolute -right-1.5 -top-1 h-3.5 w-3.5 scale-0 rounded-full bg-white shadow transition-transform group-hover:scale-100" />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between">
        {/* Left: playback controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onPrevSlide}
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-white hover:bg-white/10"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onNextSlide}
            aria-label="Next slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm10 0h2V6h-2v12z" />
            </svg>
          </Button>

          <span className="ml-2 select-none text-sm tabular-nums text-white/80">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        {/* Right: auto-mode, slide counter, fullscreen */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 text-xs ${
              isAutoMode
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            onClick={onToggleAutoMode}
          >
            Auto
          </Button>

          <span className="select-none text-sm tabular-nums text-white/60">
            {currentSlide} / {totalSlides}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onFullscreen}
            aria-label="Toggle fullscreen"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
