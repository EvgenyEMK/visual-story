'use client';

import { useRef, useEffect } from 'react';
import type { Slide } from '@/types/slide';

interface SubSlideStripProps {
  labels: string[];
  currentStep: number;
  totalSteps: number;
  slide: Slide;
  onStepSelect: (step: number) => void;
}

/**
 * Horizontal strip of auto-generated sub-slides shown below the main canvas.
 * Each sub-slide represents an animation state within the current slide.
 */
export function SubSlideStrip({
  labels,
  currentStep,
  totalSteps,
  slide,
  onStepSelect,
}: SubSlideStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGroup = !!slide.groupedAnimation;

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
        <span className="text-[10px] font-semibold text-muted-foreground shrink-0 uppercase tracking-wider">
          Sub-slides
        </span>
        <span className="text-[10px] text-muted-foreground shrink-0">
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

          // For grouped slides, show the group item info
          const groupItem = hasGroup
            ? slide.groupedAnimation!.items[i]
            : undefined;

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
              {/* Mini preview */}
              <div
                className="relative w-full bg-white dark:bg-zinc-900"
                style={{ aspectRatio: '16/9' }}
              >
                {/* Show a simplified representation of what's visible at this step */}
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  {groupItem ? (
                    <div className="flex flex-col items-center gap-0.5">
                      {groupItem.icon && (
                        <span className="text-sm">{groupItem.icon}</span>
                      )}
                      <span
                        className="text-[7px] font-bold text-center leading-tight"
                        style={{ color: groupItem.color ?? undefined }}
                      >
                        {groupItem.title}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[7px] text-muted-foreground text-center leading-tight">
                      {label}
                    </span>
                  )}
                </div>

                {/* Step number */}
                <div className="absolute top-0.5 left-0.5 text-[6px] font-bold text-muted-foreground/60">
                  {i + 1}
                </div>

                {/* Items revealed count for grouped */}
                {hasGroup && (
                  <div className="absolute bottom-0.5 right-0.5 text-[6px] text-muted-foreground/60">
                    {Math.min(i + 1, slide.groupedAnimation!.items.length)}/
                    {slide.groupedAnimation!.items.length}
                  </div>
                )}
              </div>

              {/* Label bar */}
              <div
                className={`px-1.5 py-1 text-[8px] font-medium truncate border-t ${
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
