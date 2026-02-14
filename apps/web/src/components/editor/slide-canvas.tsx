'use client';

import { useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import type { Slide, SlideElement, TriggerMode } from '@/types/slide';
import type { GroupedAnimationConfig, HoverEffect } from '@/types/animation';
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
// Hover Effect Helpers
// ---------------------------------------------------------------------------

function getHoverStyles(
  hoverEffect: HoverEffect,
  isHovered: boolean,
): React.CSSProperties {
  if (!isHovered || hoverEffect.type === 'none') return {};

  const transition = `all ${hoverEffect.transitionMs ?? 150}ms ease-out`;

  switch (hoverEffect.type) {
    case 'zoom':
      return {
        transform: `scale(${hoverEffect.scale ?? 1.08})`,
        transition,
        zIndex: 10,
      };
    case 'lift':
      return {
        transform: `scale(${hoverEffect.scale ?? 1.05}) translateY(-4px)`,
        boxShadow: '0 4px 12px var(--anim-hover)',
        transition,
        zIndex: 10,
      };
    case 'brighten':
      return {
        filter: 'grayscale(50%) brightness(1.2)',
        transition,
        zIndex: 10,
      };
    case 'pulse':
      return {
        transform: `scale(${hoverEffect.scale ?? 1.08})`,
        boxShadow: '0 0 0 3px var(--anim-hover)',
        transition,
        zIndex: 10,
      };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Per-Item Color Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a dimmed (shown-state) version of a per-item accent color.
 * Uses `color-mix` so brightness adapts to the theme automatically.
 */
function dimmedColor(accent: string): string {
  return `color-mix(in srgb, ${accent} 35%, var(--anim-active))`;
}

// ---------------------------------------------------------------------------
// Grouped Animation Overlay
// ---------------------------------------------------------------------------

function GroupedAnimationOverlay({
  config,
  currentStep,
  triggerMode,
  onGoToStep,
}: {
  config: GroupedAnimationConfig;
  currentStep: number;
  triggerMode: TriggerMode;
  onGoToStep?: (step: number) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Step indicator badges on each group item area */}
      {config.items.map((item, i) => {
        const isActive = i === currentStep;
        const isShown = i < currentStep;
        const isUpcoming = i >= currentStep;
        const isHovered = hoveredIndex === i;

        // Determine status color — per-item `color` acts as an accent
        // override for active & shown states; upcoming items always use the
        // neutral theme color so they don't draw attention prematurely.
        let bgVar = 'var(--anim-inactive)';
        let fgVar = 'var(--anim-inactive-fg)';
        if (isActive) {
          bgVar = item.color ?? 'var(--anim-focus)';
          fgVar = 'var(--anim-focus-fg)';
        } else if (isShown) {
          bgVar = item.color ? dimmedColor(item.color) : 'var(--anim-active)';
          fgVar = 'var(--anim-active-fg)';
        }

        return (
          <div
            key={item.id}
            className="absolute pointer-events-auto"
            style={{
              // Position steps as small badges in a row at the bottom
              bottom: 8,
              left: `${(i / config.items.length) * 80 + 10}%`,
              transform: 'translateX(-50%)',
              ...getHoverStyles(config.hoverEffect, isHovered && isUpcoming),
            }}
            onMouseEnter={() => triggerMode === 'click' && setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              if (triggerMode === 'click' && config.allowOutOfOrder && onGoToStep) {
                onGoToStep(i);
              }
            }}
          >
            <div
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium cursor-pointer transition-all"
              style={{
                backgroundColor: bgVar,
                color: fgVar,
                borderColor: isHovered ? 'var(--anim-hover)' : 'transparent',
                borderWidth: 2,
                borderStyle: 'solid',
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.title}</span>
              <span className="ml-1 opacity-50">#{i + 1}</span>
            </div>

            {/* Hover tooltip (for click mode) */}
            {isHovered && config.hoverEffect.showTooltip && item.description && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-lg px-3 py-2 text-[11px] whitespace-nowrap shadow-lg z-20"
                style={{
                  backgroundColor: 'var(--anim-stage-bg)',
                  color: 'var(--anim-active-fg)',
                  border: '1px solid var(--anim-connector)',
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
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

  // Derive flat elements from item tree (prefer items, fallback to elements)
  const elements =
    slide.items.length > 0
      ? flattenItemsAsElements(slide.items)
      : slide.elements;

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

        {/* Grouped animation overlay */}
        {slide.groupedAnimation && (
          <GroupedAnimationOverlay
            config={slide.groupedAnimation}
            currentStep={currentAnimStep}
            triggerMode={triggerMode}
            onGoToStep={onGoToStep}
          />
        )}

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
