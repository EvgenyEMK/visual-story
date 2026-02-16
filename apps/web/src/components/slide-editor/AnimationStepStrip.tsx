'use client';

import { useRef, useEffect } from 'react';
import type { Scene } from '@/types/scene';

interface AnimationStepStripProps {
  /** Labels for each animation step. */
  labels: string[];
  /** Current step index (0-based). */
  currentStep: number;
  /** Total steps in the current scene (including End state when present). */
  totalSteps: number;
  /** The active scene. */
  scene: Scene;
  /** Callback when a step is selected. */
  onStepSelect: (step: number) => void;
  /** Whether an artificial "End state" step is prepended at index 0. */
  hasEndStateStep?: boolean;
  /** Whether this slide uses menu/tab navigation (scenes as sub-slides). */
  isMenuNavigation?: boolean;
}

/**
 * Horizontal strip of animation steps shown below the main canvas.
 * Each step represents an animation state within the current Scene.
 *
 * Replaces the old SubSlideStrip — steps are now scoped to a single
 * Scene rather than the entire slide.
 *
 * @source docs/technical-architecture/adr-001-scenes-widget-state-layers.md
 */
export function AnimationStepStrip({
  labels,
  currentStep,
  totalSteps,
  scene,
  onStepSelect,
  hasEndStateStep = false,
  isMenuNavigation = false,
}: AnimationStepStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSequential = scene.widgetStateLayer.enterBehavior.revealMode === 'sequential';
  const stripLabel = isMenuNavigation ? 'Sub-slides' : 'Steps';
  const animationStepCount = hasEndStateStep ? totalSteps - 1 : totalSteps;

  // Auto-scroll to keep the active step visible
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStep]);

  return (
    <div className="border-t bg-muted/20">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="text-[0.625rem] font-semibold text-muted-foreground shrink-0 uppercase tracking-wider">
          {stripLabel}
        </span>
        <span className="text-[0.625rem] text-muted-foreground shrink-0">
          {hasEndStateStep && currentStep === 0
            ? `End state · ${animationStepCount} steps`
            : `${hasEndStateStep ? currentStep : currentStep + 1} / ${animationStepCount}`
          }
        </span>
        <span className="text-[0.625rem] text-muted-foreground/60 shrink-0 ml-1">
          {scene.title}
          {isSequential ? ' · Sequential' : ' · All at once'}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-thin"
      >
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isEndState = hasEndStateStep && i === 0;
          const isActive = i === currentStep;
          const isPast = i < currentStep;
          const label = labels[i] ?? `Step ${i + 1}`;

          // For sequential scenes, find the animated widget for this step
          // (offset by 1 when End state step is present)
          const animIdx = hasEndStateStep ? i - 1 : i;
          const widgetId = isSequential && !isEndState
            ? scene.widgetStateLayer.animatedWidgetIds[animIdx]
            : undefined;
          const widgetState = widgetId
            ? scene.widgetStateLayer.initialStates.find((s) => s.widgetId === widgetId)
            : undefined;

          return (
            <button
              key={i}
              data-active={isActive}
              onClick={() => onStepSelect(i)}
              className={`shrink-0 rounded-lg border-2 transition-all overflow-hidden ${
                isEndState
                  ? isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-emerald-400/50 opacity-70 hover:opacity-100 hover:border-emerald-400'
                  : isActive
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : isPast
                      ? 'border-border/60 opacity-80 hover:opacity-100 hover:border-primary/40'
                      : 'border-border/40 opacity-50 hover:opacity-80 hover:border-border'
              }`}
              style={{ width: isEndState ? 100 : 140 }}
            >
              {/* Mini preview */}
              <div
                className={`relative w-full ${isEndState ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-white dark:bg-zinc-900'}`}
                style={{ aspectRatio: '16/9' }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  {isEndState ? (
                    <span className="text-[0.5rem] font-semibold text-emerald-600 dark:text-emerald-400 text-center leading-tight">
                      All visible
                    </span>
                  ) : (
                    <span className="text-[0.4375rem] text-muted-foreground text-center leading-tight">
                      {label}
                    </span>
                  )}
                </div>

                {/* Step number (skip for End state) */}
                {!isEndState && (
                  <div className="absolute top-0.5 left-0.5 text-[0.375rem] font-bold text-muted-foreground/60">
                    {hasEndStateStep ? i : i + 1}
                  </div>
                )}

                {/* Reveal count for sequential (skip for End state) */}
                {isSequential && !isEndState && (
                  <div className="absolute bottom-0.5 right-0.5 text-[0.375rem] text-muted-foreground/60">
                    {Math.min(animIdx + 1, scene.widgetStateLayer.animatedWidgetIds.length)}/
                    {scene.widgetStateLayer.animatedWidgetIds.length}
                  </div>
                )}
              </div>

              {/* Label bar */}
              <div
                className={`px-1.5 py-1 text-[0.5rem] font-medium truncate border-t ${
                  isEndState
                    ? isActive
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600/70 dark:text-emerald-500/70'
                    : isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/30 text-muted-foreground'
                }`}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
