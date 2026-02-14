'use client';

import type { Slide, TriggerMode } from '@/types/slide';
import { Timer, MousePointer, Layers } from 'lucide-react';

/**
 * Timeline view — horizontal slide overview with trigger mode indicators.
 * @source docs/modules/story-editor/timeline-view.md
 * @source docs/modules/animation-engine/README.md — Trigger Modes
 */

interface TimelineViewProps {
  slides: Slide[];
  currentSlideIndex: number;
  currentTime: number;
  totalDuration: number;
  /** Project-level default trigger mode. */
  projectTriggerMode: TriggerMode;
  onSlideSelect: (index: number) => void;
  onSlideReorder: (fromIndex: number, toIndex: number) => void;
  onSlideDurationChange: (slideId: string, duration: number) => void;
  onSlideAdd: (afterIndex: number) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideTriggerModeChange: (slideId: string, mode: TriggerMode | undefined) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TriggerModeIcon({ mode }: { mode: TriggerMode }) {
  if (mode === 'click') {
    return <MousePointer className="h-3 w-3 text-amber-500" />;
  }
  return <Timer className="h-3 w-3 text-blue-500" />;
}

function resolveMode(slide: Slide, projectDefault: TriggerMode): TriggerMode {
  return slide.triggerMode ?? projectDefault;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TimelineView({
  slides,
  currentSlideIndex,
  currentTime,
  totalDuration,
  projectTriggerMode,
  onSlideSelect,
  onSlideReorder,
  onSlideDurationChange,
  onSlideAdd,
  onSlideDelete,
  onSlideTriggerModeChange,
}: TimelineViewProps) {
  // TODO: Implement with @dnd-kit/core for drag-and-drop reordering
  // TODO: Add thumbnail generation via Remotion renderStill
  return (
    <div className="border-t bg-muted/30 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">Timeline</span>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs">
            <Timer className="h-3 w-3" /> Auto
            <MousePointer className="ml-1 h-3 w-3" /> Click
          </span>
          <span>
            Total: {Math.floor(totalDuration / 60)}:{String(Math.floor(totalDuration % 60)).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((slide, index) => {
          const effectiveMode = resolveMode(slide, projectTriggerMode);
          const hasGroup = !!slide.groupedAnimation;
          const groupSteps = slide.groupedAnimation?.items.length ?? 0;

          return (
            <button
              key={slide.id}
              className={`group relative flex h-20 w-28 shrink-0 flex-col items-center justify-center rounded-lg border text-xs transition-all ${
                index === currentSlideIndex
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                  : 'border-border bg-background hover:border-primary/40'
              }`}
              onClick={() => onSlideSelect(index)}
            >
              {/* Slide number */}
              <span className="font-semibold text-sm">{index + 1}</span>

              {/* Duration */}
              <span className="text-muted-foreground">{slide.duration}s</span>

              {/* Trigger mode indicator */}
              <div className="absolute top-1.5 left-1.5" title={`Trigger: ${effectiveMode}`}>
                <TriggerModeIcon mode={effectiveMode} />
              </div>

              {/* Grouped animation badge */}
              {hasGroup && (
                <div
                  className="absolute top-1.5 right-1.5 flex items-center gap-0.5"
                  title={`Grouped: ${slide.groupedAnimation!.type} (${groupSteps} steps)`}
                >
                  <Layers className="h-3 w-3 text-purple-500" />
                  <span className="text-[9px] text-purple-500 font-medium">{groupSteps}</span>
                </div>
              )}

              {/* Trigger mode toggle (click on indicator area) */}
              <button
                className="absolute bottom-1 right-1 rounded px-1 py-0.5 text-[8px] text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  const newMode: TriggerMode | undefined =
                    slide.triggerMode === undefined
                      ? (projectTriggerMode === 'auto' ? 'click' : 'auto')
                      : undefined; // toggle back to inherit
                  onSlideTriggerModeChange(slide.id, newMode);
                }}
                title="Toggle trigger mode"
              >
                {slide.triggerMode ? `${effectiveMode}` : 'inherit'}
              </button>
            </button>
          );
        })}
        <button
          className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          onClick={() => onSlideAdd(slides.length - 1)}
        >
          + Add Slide
        </button>
      </div>
    </div>
  );
}
