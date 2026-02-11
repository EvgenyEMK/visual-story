'use client';

import type { Slide, SlideElement } from '@/types/slide';

/**
 * Slide canvas — main visual editor workspace
 * See docs/modules/story-editor/slide-canvas.md for full spec
 */

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId?: string;
  zoom: number;
  showGrid: boolean;
  isPlaying: boolean;
  currentTime: number;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<SlideElement>) => void;
  onTimeChange: (time: number) => void;
}

export function SlideCanvas({
  slide,
  selectedElementId,
  zoom,
  showGrid,
  isPlaying,
  currentTime,
  onElementSelect,
  onElementUpdate,
  onTimeChange,
}: SlideCanvasProps) {
  // TODO: Integrate Remotion Player for animation preview
  // TODO: Implement element selection, drag-to-reposition, inline text editing
  return (
    <div className="relative flex flex-col">
      <div
        className="relative mx-auto bg-white shadow-lg"
        style={{
          aspectRatio: '16/9',
          width: `${zoom}%`,
          maxWidth: '100%',
        }}
      >
        {slide.elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-pointer border-2 p-2 ${
              selectedElementId === element.id
                ? 'border-primary'
                : 'border-transparent'
            }`}
            style={{
              left: element.position.x,
              top: element.position.y,
            }}
            onClick={() => onElementSelect(element.id)}
          >
            {element.content}
          </div>
        ))}
      </div>
    </div>
  );
}
