'use client';

import { useRef, useEffect } from 'react';
import type { Scene } from '@/types/scene';

interface SubSlideStripProps {
  labels: string[];
  currentStep: number;
  totalSteps: number;
  scene?: Scene;
  onStepSelect: (step: number) => void;
}

/**
 * Horizontal strip of auto-generated sub-slides shown below the main canvas.
 * Each sub-slide represents an animation state within the current scene.
 *
 * @deprecated Replaced by AnimationStepStrip. Kept for backward compatibility.
 */
export function SubSlideStrip({
  labels,
  currentStep,
  totalSteps,
  scene,
  onStepSelect,
}: SubSlideStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep the active step visible
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStep]);

  const animatedWidgetIds = scene?.widgetStateLayer.animatedWidgetIds ?? [];

  return (
    <div className="border-t bg-muted/20">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="text-[0.625rem] font-semibold text-muted-foreground shrink-0 uppercase tracking-wider">
          Sub-slides
        </span>
        <span className="text-[0.625rem] text-muted-foreground shrink-0">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-thin"
      >
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === currentStep;
          const isPast = i < currentStep;
          const label = labels[i] ?? `Step ${i + 1}`;

          return (
            <button
              key={i}
              data-active={isActive}
              onClick={() => onStepSelect(i)}
              className={`shrink-0 rounded-lg border-2 transition-all overflow-hidden ${
                isActive
                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                  : isPast
                  ? 'border-border/60 opacity-80 hover:opacity-100 hover:border-primary/40'
                  : 'border-border/40 opacity-50 hover:opacity-80 hover:border-border'
              }`}
              style={{ width: 140 }}
            >
              <div
                className="relative w-full bg-white dark:bg-zinc-900"
                style={{ aspectRatio: '16/9' }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <span className="text-[0.4375rem] text-muted-foreground text-center leading-tight">
                    {label}
                  </span>
                </div>
                <div className="absolute top-0.5 left-0.5 text-[0.375rem] font-bold text-muted-foreground/60">
                  {i + 1}
                </div>
                {animatedWidgetIds.length > 0 && (
                  <div className="absolute bottom-0.5 right-0.5 text-[0.375rem] text-muted-foreground/60">
                    {Math.min(i + 1, animatedWidgetIds.length)}/{animatedWidgetIds.length}
                  </div>
                )}
              </div>
              <div
                className={`px-1.5 py-1 text-[0.5rem] font-medium truncate border-t ${
                  isActive
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
