'use client';

import { useState } from 'react';
import type { Slide, SlideElement, TriggerMode } from '@/types/slide';
import type { GroupedAnimationConfig, HoverEffect } from '@/types/animation';
import { flattenItemsAsElements } from '@/lib/flatten-items';

/**
 * Slide canvas — main visual editor workspace.
 * Supports element rendering, selection, and grouped animation preview with
 * hover interactions for click-mode presentations.
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
  // TODO: Integrate Remotion Player for animation preview
  // TODO: Implement drag-to-reposition, inline text editing, multi-select

  const handleCanvasClick = () => {
    if (triggerMode === 'click' && onAdvanceStep) {
      onAdvanceStep();
    }
  };

  return (
    <div className="relative flex flex-col">
      <div
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

        {/* Slide elements */}
        {(slide.items.length > 0
          ? flattenItemsAsElements(slide.items)
          : slide.elements
        ).map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-pointer border-2 p-2 transition-colors ${
              selectedElementId === element.id
                ? 'border-primary'
                : 'border-transparent hover:border-primary/30'
            }`}
            style={{
              left: element.position.x,
              top: element.position.y,
              color: element.style.color,
              fontSize: element.style.fontSize,
              fontWeight: element.style.fontWeight,
              fontFamily: element.style.fontFamily,
              backgroundColor: element.style.backgroundColor,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onElementSelect(element.id);
            }}
          >
            {element.content}
          </div>
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
