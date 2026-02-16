/**
 * Web-based presentation player with slide rendering, audio sync, and auto-advance.
 * @source docs/modules/export-publish/web-player.md
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Presentation } from '@/types/presentation';
import type { Slide } from '@/types/slide';
import type { VoiceConfig, SlideSync } from '@/types/voice';
import { PlayerControls } from './player-controls';
import { MobilePlayerControls } from './mobile-player-controls';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface WebPlayerProps {
  project: Presentation;
  voiceConfig: VoiceConfig | null;
  /** Whether the player is rendered inside an iframe embed. */
  embedded?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Calculate the total project duration from slide durations. */
function getTotalDuration(slides: Slide[]): number {
  return slides.reduce((sum, s) => sum + s.duration, 0);
}

/** Find which slide should be active given a global time offset (ms). */
function getSlideIndexAtTime(slides: Slide[], timeMs: number): number {
  let elapsed = 0;
  for (let i = 0; i < slides.length; i++) {
    elapsed += slides[i].duration;
    if (timeMs < elapsed) return i;
  }
  return slides.length - 1;
}

/** Detect mobile viewport. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WebPlayer({
  project,
  voiceConfig,
  embedded = false,
}: WebPlayerProps) {
  const slides = project.slides;
  const totalDuration = getTotalDuration(slides);

  // Playback state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMobile = useIsMobile();

  // --- Auto-advance logic (when no voice-over or in manual timer mode) ---
  useEffect(() => {
    if (!isPlaying || !isAutoMode) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // If there's a global audio track let the audio timeupdate drive the slide
    if (voiceConfig?.fullAudioUrl) return;

    // Otherwise advance based on slide durations
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 100;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        // Update slide index based on time
        const idx = getSlideIndexAtTime(slides, next);
        setCurrentSlideIndex(idx);
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isAutoMode, slides, totalDuration, voiceConfig]);

  // --- Audio sync ---
  const handleAudioTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      const timeMs = e.currentTarget.currentTime * 1000;
      setCurrentTime(timeMs);

      if (isAutoMode) {
        const idx = getSlideIndexAtTime(slides, timeMs);
        setCurrentSlideIndex(idx);
      }
    },
    [isAutoMode, slides],
  );

  // Play/pause audio in sync with state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {
        /* autoplay blocked — needs user gesture */
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;
        case 'ArrowLeft':
          setCurrentSlideIndex((i) => Math.max(0, i - 1));
          break;
        case 'ArrowRight':
          setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1));
          break;
        case 'f':
          document.documentElement.requestFullscreen?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  // --- Navigation handlers ---
  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1));
  }, [slides.length]);

  const handleSeek = useCallback(
    (time: number) => {
      setCurrentTime(time);
      const idx = getSlideIndexAtTime(slides, time);
      setCurrentSlideIndex(idx);

      if (audioRef.current) {
        audioRef.current.currentTime = time / 1000;
      }
    },
    [slides],
  );

  const handleFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.();
  }, []);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div
      className={`relative overflow-hidden bg-black ${
        embedded ? 'h-full w-full' : 'h-screen w-screen'
      }`}
    >
      {/* Presentation Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-video w-full max-w-[1920px]">
          {/* TODO: Replace with Remotion Player or custom SlideRenderer */}
          <div className="flex h-full flex-col items-center justify-center gap-4 text-white">
            {currentSlide ? (
              <>
                <h2 className="text-2xl font-bold">{currentSlide.content}</h2>
                <p className="text-sm text-white/60">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No slides</p>
            )}
          </div>
        </div>
      </div>

      {/* Audio element */}
      {voiceConfig?.fullAudioUrl && (
        <audio
          ref={audioRef}
          src={voiceConfig.fullAudioUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Controls */}
      {isMobile ? (
        <MobilePlayerControls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying((p) => !p)}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
        />
      ) : (
        <PlayerControls
          isPlaying={isPlaying}
          isAutoMode={isAutoMode}
          currentTime={currentTime}
          totalDuration={totalDuration}
          currentSlide={currentSlideIndex + 1}
          totalSlides={slides.length}
          onPlayPause={() => setIsPlaying((p) => !p)}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          onSeek={handleSeek}
          onToggleAutoMode={() => setIsAutoMode((a) => !a)}
          onFullscreen={handleFullscreen}
        />
      )}
    </div>
  );
}
