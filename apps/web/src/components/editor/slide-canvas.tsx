'use client';

import { useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import type { Slide, SlideElement, TriggerMode } from '@/types/slide';
import { flattenItemsAsElements } from '@/lib/flatten-items';
import { InlineTextEditor } from './inline-text-editor';

/**
 * Slide canvas — main visual editor workspace.
 * Supports element rendering, selection, drag-to-reposition, resize,
 * inline text editing, and grouped animation preview with hover
 * interactions for click-mode presentations.
 *
 * @source docs/modules/story-editor/slide-canvas.md
 * @source docs/modules/animation-engine/README.md — Interaction Model
 */

interface SlideCanvasProps {
  slide: Slide;
  selectedElementId?: string;
  zoom: number;
  showGrid: boolean;
  isPlaying: boolean;
  currentTime: number;
  /** Effective trigger mode for this slide. */
  triggerMode: TriggerMode;
  /** Current animation step (for click-mode preview). */
  currentAnimStep: number;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<SlideElement>) => void;
  onTimeChange: (time: number) => void;
  /** Click-mode: advance to next animation step. */
  onAdvanceStep?: () => void;
  /** Click-mode: jump to a specific grouped item step. */
  onGoToStep?: (step: number) => void;
}

// ---------------------------------------------------------------------------
// Editable Element Wrapper (with react-rnd + inline editing)
// ---------------------------------------------------------------------------

function EditableElement({
  element,
  isSelected,
  isPlaying,
  onSelect,
  onUpdate,
}: {
  element: SlideElement;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<SlideElement>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const isTextElement = element.type === 'text';

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isTextElement && !isPlaying) {
        setIsEditing(true);
      }
    },
    [isTextElement, isPlaying],
  );

  const handleSave = useCallback(
    (html: string) => {
      onUpdate({ content: html });
    },
    [onUpdate],
  );

  const handleExitEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Build element-level styles
  const elementStyle: React.CSSProperties = {
    color: element.style.color,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    fontFamily: element.style.fontFamily,
    fontStyle: element.style.fontStyle,
    backgroundColor: element.style.backgroundColor,
    opacity: element.style.opacity,
    textAlign: element.style.textAlign as React.CSSProperties['textAlign'],
    borderRadius: element.style.borderRadius,
    borderWidth: element.style.borderWidth,
    borderColor: element.style.borderColor,
    borderStyle: element.style.borderWidth ? 'solid' : undefined,
    boxShadow: element.style.boxShadow,
    padding: element.style.padding,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  return (
    <Rnd
      position={{
        x: typeof element.position.x === 'number' ? element.position.x : 0,
        y: typeof element.position.y === 'number' ? element.position.y : 0,
      }}
      size={{
        width: element.style.width ?? 'auto',
        height: element.style.height ?? 'auto',
      }}
      onDragStop={(_e, d) => {
        onUpdate({
          position: { x: Math.round(d.x), y: Math.round(d.y) },
        });
      }}
      onResizeStop={(_e, _dir, ref, _delta, position) => {
        onUpdate({
          position: { x: Math.round(position.x), y: Math.round(position.y) },
          style: {
            ...element.style,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          },
        });
      }}
      bounds="parent"
      disableDragging={isEditing || isPlaying}
      enableResizing={isSelected && !isPlaying && !isEditing}
      minWidth={30}
      minHeight={20}
      className={`${
        isSelected
          ? 'ring-2 ring-primary ring-offset-1'
          : 'hover:ring-1 hover:ring-primary/30'
      } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      style={{ zIndex: isSelected ? 10 : 1 }}
    >
      <div
        style={elementStyle}
        className="cursor-pointer select-none"
        onClick={(e) => {
          e.stopPropagation();
          if (!isEditing) onSelect();
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <InlineTextEditor
            content={element.content}
            onSave={handleSave}
            onExit={handleExitEdit}
            style={{
              color: element.style.color,
              fontSize: element.style.fontSize ? `${element.style.fontSize}px` : undefined,
              fontWeight: element.style.fontWeight,
              fontFamily: element.style.fontFamily,
            }}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: element.content }}
            className="pointer-events-none"
          />
        )}
      </div>
    </Rnd>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SlideCanvas({
  slide,
  selectedElementId,
  zoom,
  showGrid,
  isPlaying,
  currentTime,
  triggerMode,
  currentAnimStep,
  onElementSelect,
  onElementUpdate,
  onTimeChange,
  onAdvanceStep,
  onGoToStep,
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = () => {
    onElementSelect(null);
    if (triggerMode === 'click' && onAdvanceStep) {
      onAdvanceStep();
    }
  };

  const elements = flattenItemsAsElements(slide.items);

  return (
    <div className="relative flex flex-col">
      <div
        ref={canvasRef}
        className="relative mx-auto shadow-lg"
        style={{
          aspectRatio: '16/9',
          width: `${zoom * 100}%`,
          maxWidth: '100%',
          backgroundColor: 'var(--anim-stage-bg, white)',
        }}
        onClick={handleCanvasClick}
      >
        {/* Grid overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '10% 10%',
            }}
          />
        )}

        {/* Slide elements with drag/resize/inline-edit */}
        {elements.map((element) => (
          <EditableElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            isPlaying={isPlaying}
            onSelect={() => onElementSelect(element.id)}
            onUpdate={(updates) => onElementUpdate(element.id, updates)}
          />
        ))}

        {/* Click mode indicator */}
        {triggerMode === 'click' && !isPlaying && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white/70 backdrop-blur-sm pointer-events-none">
            Click to advance
          </div>
        )}
      </div>
    </div>
  );
}
