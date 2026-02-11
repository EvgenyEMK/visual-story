'use client';

import type { Slide } from '@/types/slide';

/**
 * Timeline view — horizontal slide overview
 * See docs/modules/story-editor/timeline-view.md for full spec
 */

interface TimelineViewProps {
  slides: Slide[];
  currentSlideIndex: number;
  currentTime: number;
  totalDuration: number;
  onSlideSelect: (index: number) => void;
  onSlideReorder: (fromIndex: number, toIndex: number) => void;
  onSlideDurationChange: (slideId: string, duration: number) => void;
  onSlideAdd: (afterIndex: number) => void;
  onSlideDelete: (slideId: string) => void;
}

export function TimelineView({
  slides,
  currentSlideIndex,
  currentTime,
  totalDuration,
  onSlideSelect,
  onSlideReorder,
  onSlideDurationChange,
  onSlideAdd,
  onSlideDelete,
}: TimelineViewProps) {
  // TODO: Implement with @dnd-kit/core for drag-and-drop reordering
  // TODO: Add thumbnail generation via Remotion renderStill
  return (
    <div className="border-t bg-muted/30 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">Timeline</span>
        <span className="text-muted-foreground">
          Total: {Math.floor(totalDuration / 60)}:{String(Math.floor(totalDuration % 60)).padStart(2, '0')}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`flex h-16 w-24 shrink-0 flex-col items-center justify-center rounded border text-xs ${
              index === currentSlideIndex
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background'
            }`}
            onClick={() => onSlideSelect(index)}
          >
            <span className="font-medium">{index + 1}</span>
            <span className="text-muted-foreground">{slide.duration}s</span>
          </button>
        ))}
        <button
          className="flex h-16 w-24 shrink-0 items-center justify-center rounded border border-dashed text-xs text-muted-foreground hover:border-primary"
          onClick={() => onSlideAdd(slides.length - 1)}
        >
          + Add
        </button>
      </div>
    </div>
  );
}
