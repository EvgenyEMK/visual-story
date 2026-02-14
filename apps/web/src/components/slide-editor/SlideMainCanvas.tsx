'use client';

import { useState, useCallback, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import type { Slide, SlideElement } from '@/types/slide';
import type { Scene } from '@/types/scene';
import { flattenItemsAsElements } from '@/lib/flatten-items';
import { SlideHeaderRenderer } from '@/components/animation/SlideHeaderRenderer';
import { ItemRenderer } from '@/components/animation/ItemRenderer';
import type { ItemVisibility } from '@/components/animation/ItemRenderer';
import { CardExpandLayout } from '@/components/slide-ui';
import type { CardExpandVariant } from '@/components/slide-ui';
import { SMART_CARD_ITEMS } from '@/config/smart-card-items';
import { InlineTextEditor } from '@/components/editor/inline-text-editor';

interface SlideMainCanvasProps {
  slide: Slide;
  /** Current scene being viewed / edited. */
  currentScene?: Scene;
  selectedElementId: string | null;
  currentSubStep: number;
  totalSteps: number;
  onElementSelect: (elementId: string | null) => void;
  /** Callback when an element is updated (position, size, content). */
  onElementUpdate?: (elementId: string, updates: Partial<SlideElement>) => void;
  /** Whether the canvas is in preview/playback mode (disables editing). */
  isPreview?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse card-expand variant from animationTemplate, e.g. 'card-expand:center-popup' */
function parseCardExpandVariant(animationTemplate: string): CardExpandVariant | null {
  if (!animationTemplate.startsWith('card-expand:')) return null;
  return animationTemplate.split(':')[1] as CardExpandVariant;
}

// ---------------------------------------------------------------------------
// Editable Element (with react-rnd + inline text editing)
// ---------------------------------------------------------------------------

function EditableCanvasElement({
  element,
  isSelected,
  visible,
  isFocused,
  isPreview,
  onSelect,
  onUpdate,
}: {
  element: SlideElement;
  isSelected: boolean;
  visible: boolean;
  isFocused: boolean;
  isPreview: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<SlideElement>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const isTextElement = element.type === 'text';

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isTextElement && !isPreview) {
        setIsEditing(true);
      }
    },
    [isTextElement, isPreview],
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

  // Convert design-space position (960x540) to percentage
  const leftPct = `${(element.position.x / 960) * 100}%`;
  const topPct = `${(element.position.y / 540) * 100}%`;

  const elementStyle: React.CSSProperties = {
    color: element.style.color ?? undefined,
    fontSize: element.style.fontSize ?? undefined,
    fontWeight: element.style.fontWeight ?? undefined,
    fontFamily: element.style.fontFamily ?? undefined,
    fontStyle: element.style.fontStyle ?? undefined,
    backgroundColor: element.style.backgroundColor ?? undefined,
    borderRadius: element.style.borderRadius ?? undefined,
    textAlign: (element.style.textAlign ?? undefined) as React.CSSProperties['textAlign'],
    opacity: element.style.opacity ?? undefined,
    borderWidth: element.style.borderWidth ?? undefined,
    borderColor: element.style.borderColor ?? undefined,
    borderStyle: element.style.borderWidth ? 'solid' : undefined,
    boxShadow: element.style.boxShadow ?? undefined,
    padding: element.style.backgroundColor ? '12px 16px' : (element.style.padding ?? 4),
    width: element.style.width ?? undefined,
    height: element.style.height ?? undefined,
    maxWidth: '80%',
    whiteSpace: 'pre-line' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      element.style.textAlign === 'center' ? 'center' : 'flex-start',
  };

  // In preview mode, render as a static positioned div (no drag/resize).
  if (isPreview) {
    return (
      <div
        className={`absolute transition-all duration-300 ${
          visible ? 'opacity-100' : 'opacity-20'
        } ${isFocused ? 'ring-2 ring-primary/50 ring-offset-1' : ''} ${
          isSelected
            ? 'border-2 border-primary shadow-md'
            : 'border-2 border-transparent hover:border-primary/30'
        }`}
        style={{
          left: leftPct,
          top: topPct,
          cursor: 'pointer',
          ...elementStyle,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: element.content }}
          className="pointer-events-none"
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute transition-all duration-300 ${
        visible ? 'opacity-100' : 'opacity-20'
      } ${isFocused ? 'ring-2 ring-primary/50 ring-offset-1' : ''}`}
      style={{ left: leftPct, top: topPct, zIndex: isSelected ? 10 : 1 }}
    >
      <Rnd
        position={{ x: 0, y: 0 }}
        size={{
          width: element.style.width ?? 'auto',
          height: element.style.height ?? 'auto',
        }}
        onDragStop={(_e, d) => {
          const parentEl = document.querySelector('[data-slide-canvas]');
          if (!parentEl) return;
          const rect = parentEl.getBoundingClientRect();
          const scaleX = 960 / rect.width;
          const scaleY = 540 / rect.height;
          onUpdate({
            position: {
              x: Math.round(element.position.x + d.x * scaleX),
              y: Math.round(element.position.y + d.y * scaleY),
            },
          });
        }}
        onResizeStop={(_e, _dir, ref, _delta, _position) => {
          onUpdate({
            style: {
              ...element.style,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            },
          });
        }}
        disableDragging={isEditing}
        enableResizing={isSelected && !isEditing}
        minWidth={30}
        minHeight={20}
        className={`${
          isSelected
            ? 'ring-2 ring-primary ring-offset-1'
            : 'hover:ring-1 hover:ring-primary/30'
        } ${isEditing ? '!ring-2 !ring-blue-500' : ''}`}
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
                fontSize: element.style.fontSize
                  ? `${element.style.fontSize}px`
                  : undefined,
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * Main canvas showing the current slide at full size.
 * Uses ItemRenderer for layout-aware rendering of the items tree,
 * with scene-based visibility for animation steps.
 *
 * Card-expand slides use the CardExpandLayout overlay (variant parsed
 * from slide.animationTemplate, e.g. 'card-expand:center-popup').
 */
export function SlideMainCanvas({
  slide,
  currentScene,
  selectedElementId,
  currentSubStep,
  totalSteps,
  onElementSelect,
  onElementUpdate,
  isPreview = false,
}: SlideMainCanvasProps) {
  const isZoomWord = slide.animationTemplate === 'zoom-in-word';
  const cardExpandVariant = parseCardExpandVariant(slide.animationTemplate);
  const isCardExpand = cardExpandVariant !== null;
  const hasStructuredHeader = !!slide.header;

  // Scene-derived visibility state
  const hasOverviewStep = !!(
    currentScene?.widgetStateLayer.enterBehavior.includeOverviewStep &&
    currentScene.widgetStateLayer.enterBehavior.revealMode === 'sequential'
  );
  const isExitStep = !!(
    currentScene?.widgetStateLayer.exitBehavior &&
    currentSubStep === totalSteps - 1
  );

  const flatElements = useMemo(
    () => flattenItemsAsElements(slide.items),
    [slide.items],
  );

  // Use ItemRenderer for slides that have an items tree (non-card-expand, non-zoom-word)
  const useItemRenderer = slide.items.length > 0 && !isCardExpand && !isZoomWord;

  // ----- Visibility for ItemRenderer (scene-based) -----
  const getItemVisibility = useCallback(
    (itemId: string): ItemVisibility => {
      if (!currentScene) {
        return { visible: true, isFocused: false, hidden: false };
      }

      const { animatedWidgetIds, enterBehavior, initialStates } =
        currentScene.widgetStateLayer;
      const widgetIndex = animatedWidgetIds.indexOf(itemId);

      // Exit step: everything visible, nothing focused (return to overview)
      if (isExitStep) {
        return { visible: true, isFocused: false, hidden: false };
      }

      if (widgetIndex !== -1) {
        // Overview step (step 0 when includeOverviewStep): all visible, none focused
        if (hasOverviewStep && currentSubStep === 0) {
          return { visible: true, isFocused: false, hidden: false };
        }

        const effectiveStep = hasOverviewStep ? currentSubStep - 1 : currentSubStep;

        if (enterBehavior.revealMode === 'sequential') {
          return {
            visible: widgetIndex <= effectiveStep,
            isFocused: widgetIndex === effectiveStep,
            hidden: false,
          };
        }
        // All-at-once: everything visible
        return { visible: true, isFocused: false, hidden: false };
      }

      // Non-animated widget: use initial state
      const initial = initialStates.find((s) => s.widgetId === itemId);
      if (initial) {
        return {
          visible: initial.visible,
          isFocused: initial.isFocused,
          hidden: !initial.visible && initial.displayMode === 'hidden',
        };
      }

      return { visible: true, isFocused: false, hidden: false };
    },
    [currentScene, currentSubStep, totalSteps, hasOverviewStep, isExitStep],
  );

  // ----- Legacy element visibility (for positioned elements) -----
  const getElementVisibility = useCallback(
    (elementId: string, _index: number): { visible: boolean; isFocused: boolean } => {
      if (currentScene) {
        const vis = getItemVisibility(elementId);
        return { visible: vis.visible, isFocused: vis.isFocused };
      }
      // Fallback: delay-based visibility
      const sortedByDelay = [...flatElements]
        .filter((el) => el.animation.type !== 'none')
        .sort((a, b) => a.animation.delay - b.animation.delay);
      const stepIndex = sortedByDelay.findIndex((el) => el.id === elementId);
      if (stepIndex === -1) return { visible: true, isFocused: false };
      return {
        visible: stepIndex <= currentSubStep,
        isFocused: stepIndex === currentSubStep,
      };
    },
    [currentScene, getItemVisibility, currentSubStep, flatElements],
  );

  const handleElementUpdate = useCallback(
    (elementId: string, updates: Partial<SlideElement>) => {
      onElementUpdate?.(elementId, updates);
    },
    [onElementUpdate],
  );

  // --- Render: Structured header ---
  const renderStructuredHeader = () => {
    if (!hasStructuredHeader) return null;
    return (
      <div className="z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <SlideHeaderRenderer header={slide.header!} slide={slide} />
      </div>
    );
  };

  // --- Render: Zoom-In Word Reveal (step-based) ---
  const renderZoomWordOverlay = () => {
    if (!isZoomWord) return null;
    const mainEl = flatElements[0];
    const subtitleEl = flatElements[1];
    if (!mainEl) return null;
    const words = mainEl.content.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const subtitleStep = wordCount;
    const morphStep = wordCount + 1;
    const isMorphing = currentSubStep >= morphStep;
    const subtitleVisible = currentSubStep >= subtitleStep;

    return (
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-500"
        style={{
          transform: isMorphing ? 'translate(-28%, -36%) scale(0.5)' : 'translate(0, 0) scale(1)',
          opacity: isMorphing ? 0.6 : 1,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-10 max-w-[80%]">
            {words.map((word, i) => {
              const isWordVisible = currentSubStep >= i;
              return (
                <span
                  key={i}
                  className="transition-all duration-400"
                  style={{
                    fontSize: Math.min(mainEl.style.fontSize ?? 56, 40),
                    fontWeight: (mainEl.style.fontWeight as string) ?? 'bold',
                    color: mainEl.style.color ?? '#1e293b',
                    opacity: isWordVisible ? 1 : 0.15,
                    transform: isWordVisible ? 'scale(1)' : 'scale(0.3)',
                    filter: isWordVisible ? 'blur(0px)' : 'blur(4px)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
          {subtitleEl && (
            <span
              className="transition-all duration-400"
              style={{
                fontSize: Math.min(subtitleEl.style.fontSize ?? 14, 11),
                color: subtitleEl.style.color ?? '#94a3b8',
                opacity: subtitleVisible && !isMorphing ? 1 : 0,
              }}
            >
              {subtitleEl.content}
            </span>
          )}
        </div>
      </div>
    );
  };

  // --- Render: Card-Expand (smart card) via CardExpandLayout ---
  const renderCardExpandOverlay = () => {
    if (!isCardExpand) return null;
    const variant = cardExpandVariant!;

    // Compute expandedIndex: overview step → -1, widget steps → 0..N-1, exit step → -1
    let expandedIndex: number;
    if (isExitStep) {
      expandedIndex = -1;
    } else if (hasOverviewStep) {
      expandedIndex = currentSubStep - 1; // step 0 → -1 (overview)
    } else {
      expandedIndex = currentSubStep;
    }

    return (
      <div
        className="absolute inset-0 z-10"
        style={{ top: hasStructuredHeader ? 40 : 0, backgroundColor: '#0f172a' }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardExpandLayout
          items={SMART_CARD_ITEMS}
          variant={variant}
          cardSize="sm"
          columns={variant === 'row-to-split' ? undefined : 2}
          gap={8}
          expandedIndex={expandedIndex}
        />
      </div>
    );
  };

  return (
    <div
      data-slide-canvas
      className="relative w-full max-w-4xl shadow-xl rounded-lg overflow-hidden border bg-white dark:bg-zinc-900"
      style={{ aspectRatio: '16/9' }}
      onClick={() => onElementSelect(null)}
    >
      {/* Slide content label */}
      <div className="absolute top-2 left-2 text-[9px] text-muted-foreground/50 font-mono z-20">
        {slide.id} &middot; {slide.animationTemplate}
      </div>

      {/* Structured header from slide.header data model */}
      {renderStructuredHeader()}

      {/* Zoom-In Word Reveal overlay */}
      {renderZoomWordOverlay()}

      {/* Card-Expand (Smart Card) overlay */}
      {renderCardExpandOverlay()}

      {/* Items tree rendering (layout-aware) — for non-card-expand, non-zoom slides */}
      {useItemRenderer && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ItemRenderer
            items={slide.items}
            getVisibility={getItemVisibility}
            onItemClick={(itemId) => onElementSelect(itemId)}
          />
        </div>
      )}

      {/* Legacy positioned elements — for slides without items tree */}
      {!useItemRenderer && !isCardExpand && !isZoomWord &&
        flatElements.map((element, idx) => {
          const { visible, isFocused } = getElementVisibility(element.id, idx);
          const isSelected = selectedElementId === element.id;

          return (
            <EditableCanvasElement
              key={element.id}
              element={element}
              isSelected={isSelected}
              visible={visible}
              isFocused={isFocused}
              isPreview={isPreview}
              onSelect={() => onElementSelect(element.id)}
              onUpdate={(updates) => handleElementUpdate(element.id, updates)}
            />
          );
        })}

      {/* Transition badge */}
      {slide.transition !== 'none' && (
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 z-20">
          → {slide.transition}
        </div>
      )}
    </div>
  );
}
