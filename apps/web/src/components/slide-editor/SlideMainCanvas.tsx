'use client';

import { useState, useCallback, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import type { Slide, SlideElement, SlideItem } from '@/types/slide';
import type { Scene } from '@/types/scene';
import { flattenItemsAsElements } from '@/lib/flatten-items';
import { SlideHeaderRenderer } from '@/components/animation/SlideHeaderRenderer';
import { ItemRenderer } from '@/components/animation/ItemRenderer';
import type { ItemVisibility } from '@/components/animation/ItemRenderer';
import { InlineTextEditor } from '@/components/editor/inline-text-editor';
import { em } from '@/components/slide-ui/units';

interface SlideMainCanvasProps {
  slide: Slide;
  /** Current scene being viewed / edited. */
  currentScene?: Scene;
  /** All scenes for the current slide (needed for menu/tab navigation). */
  allScenes?: Scene[];
  selectedElementId: string | null;
  /** ID of the item currently in inline-edit mode (text editing). */
  editingItemId?: string | null;
  currentSubStep: number;
  totalSteps: number;
  onElementSelect: (elementId: string | null) => void;
  /** Callback when an element is updated (position, size, content). */
  onElementUpdate?: (elementId: string, updates: Partial<SlideElement>) => void;
  /** Callback when an item in the items tree is updated (content, style). */
  onItemUpdate?: (itemId: string, updates: Partial<SlideItem>) => void;
  /** Callback when a user double-clicks a text item to start inline editing. */
  onItemEditStart?: (itemId: string) => void;
  /** Callback when the user finishes inline text editing. */
  onItemEditEnd?: () => void;
  /** Callback to append new block children to a card/layout. */
  onAppendBlock?: (parentId: string, children: SlideItem[]) => void;
  /** Callback when a scene should be selected (menu/tab click). */
  onSceneSelect?: (sceneIndex: number) => void;
  /** Whether the canvas is in preview/playback mode (disables editing). */
  isPreview?: boolean;
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
    fontSize: typeof element.style.fontSize === 'number' ? em(element.style.fontSize) : (element.style.fontSize ?? undefined),
    fontWeight: element.style.fontWeight ?? undefined,
    fontFamily: element.style.fontFamily ?? undefined,
    fontStyle: element.style.fontStyle ?? undefined,
    backgroundColor: element.style.backgroundColor ?? undefined,
    borderRadius: typeof element.style.borderRadius === 'number' ? em(element.style.borderRadius) : (element.style.borderRadius ?? undefined),
    textAlign: (element.style.textAlign ?? undefined) as React.CSSProperties['textAlign'],
    opacity: element.style.opacity ?? undefined,
    borderWidth: element.style.borderWidth ?? undefined,
    borderColor: element.style.borderColor ?? undefined,
    borderStyle: element.style.borderWidth ? 'solid' : undefined,
    boxShadow: element.style.boxShadow ?? undefined,
    padding: element.style.backgroundColor ? `${em(12)} ${em(16)}` : (typeof element.style.padding === 'number' ? em(element.style.padding) : (element.style.padding ?? em(4))),
    width: typeof element.style.width === 'number' ? em(element.style.width) : (element.style.width ?? undefined),
    height: typeof element.style.height === 'number' ? em(element.style.height) : (element.style.height ?? undefined),
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
                fontSize: typeof element.style.fontSize === 'number' ? em(element.style.fontSize) : (element.style.fontSize ?? undefined),
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
 * Supports popup callout (DetailPopup) for cards with detailItems, and
 * menu/tab click-to-navigate scene switching via activatedByWidgetIds.
 */
export function SlideMainCanvas({
  slide,
  currentScene,
  allScenes,
  selectedElementId,
  editingItemId,
  currentSubStep,
  totalSteps,
  onElementSelect,
  onElementUpdate,
  onItemUpdate,
  onItemEditStart,
  onItemEditEnd,
  onAppendBlock,
  onSceneSelect,
  isPreview = false,
}: SlideMainCanvasProps) {
  const isZoomWord = slide.animationTemplate === 'zoom-in-word';
  const hasStructuredHeader = !!slide.header;
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

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

  // Use ItemRenderer for slides that have an items tree (non-zoom-word)
  const useItemRenderer = slide.items.length > 0 && !isZoomWord;

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

  // ----- Popup: derive expanded card from step (step-driven mode) -----
  const hasPopupInteraction = useMemo(
    () => currentScene?.widgetStateLayer.interactionBehaviors.some(
      (b) => b.action === 'toggle-expand',
    ) ?? false,
    [currentScene],
  );

  const isClickOnlyPopup = useMemo(() => {
    if (!hasPopupInteraction || !currentScene) return false;
    const expandBehavior = currentScene.widgetStateLayer.interactionBehaviors.find(
      (b) => b.action === 'toggle-expand',
    );
    return currentScene.widgetStateLayer.enterBehavior.revealMode === 'all-at-once'
      && expandBehavior?.availableInAutoMode === false;
  }, [hasPopupInteraction, currentScene]);

  const stepDrivenExpandedCardId = useMemo(() => {
    if (!hasPopupInteraction || isClickOnlyPopup || !currentScene) return null;
    if (isExitStep) return null;
    const { animatedWidgetIds, enterBehavior } = currentScene.widgetStateLayer;
    if (enterBehavior.revealMode !== 'sequential') return null;
    if (hasOverviewStep && currentSubStep === 0) return null;
    const effectiveStep = hasOverviewStep ? currentSubStep - 1 : currentSubStep;
    return animatedWidgetIds[effectiveStep] ?? null;
  }, [hasPopupInteraction, isClickOnlyPopup, currentScene, currentSubStep, hasOverviewStep, isExitStep]);

  const effectiveExpandedCard = isClickOnlyPopup ? expandedCardId : stepDrivenExpandedCardId;

  // ----- Item click handler: menu/tab navigation + popup -----
  const handleItemClick = useCallback(
    (widgetId: string) => {
      // Check for menu/tab navigation
      if (allScenes && onSceneSelect) {
        const targetSceneIndex = allScenes.findIndex(
          (s) => s.activatedByWidgetIds?.includes(widgetId),
        );
        if (targetSceneIndex !== -1) {
          onSceneSelect(targetSceneIndex);
          return;
        }
      }

      // Check for click-only popup
      if (hasPopupInteraction && isClickOnlyPopup) {
        setExpandedCardId((prev) => (prev === widgetId ? null : widgetId));
        return;
      }

      // Default: select element
      onElementSelect(widgetId);
    },
    [allScenes, onSceneSelect, hasPopupInteraction, isClickOnlyPopup, onElementSelect],
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
                    fontSize: em(Math.min(mainEl.style.fontSize ?? 56, 40)),
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
                fontSize: em(Math.min(subtitleEl.style.fontSize ?? 14, 11)),
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

  return (
    <div
      data-slide-canvas
      className="slide-canvas relative w-full max-w-6xl shadow-xl rounded-lg overflow-hidden border bg-white dark:bg-zinc-900 flex flex-col"
      style={{ aspectRatio: '16/9' }}
      onClick={() => onElementSelect(null)}
    >
      {/* Slide content label */}
      <div className="absolute top-2 left-2 text-[0.5625rem] text-muted-foreground/50 font-mono z-20">
        {slide.id} &middot; {slide.animationTemplate}
      </div>

      {/* Structured header from slide.header data model */}
      {renderStructuredHeader()}

      {/* Zoom-In Word Reveal overlay */}
      {renderZoomWordOverlay()}

      {/* Items tree rendering (layout-aware) — for non-zoom slides */}
      {useItemRenderer && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ItemRenderer
            items={slide.items}
            getVisibility={getItemVisibility}
            onItemClick={handleItemClick}
            expandedCardId={effectiveExpandedCard}
            onCardExpand={setExpandedCardId}
            selectedItemId={selectedElementId ?? undefined}
            editingItemId={editingItemId ?? undefined}
            onItemSelect={onElementSelect}
            onItemUpdate={onItemUpdate}
            onItemEditStart={onItemEditStart}
            onItemEditEnd={onItemEditEnd}
            onAppendBlock={onAppendBlock}
            isPreview={isPreview}
          />
        </div>
      )}

      {/* Legacy positioned elements — for slides without items tree */}
      {!useItemRenderer && !isZoomWord &&
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
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-[0.5625rem] font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 z-20">
          → {slide.transition}
        </div>
      )}
    </div>
  );
}
