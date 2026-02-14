'use client';

import { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import type { Slide, SlideElement } from '@/types/slide';
import { flattenItemsAsElements } from '@/lib/flatten-items';
import { SlideHeaderRenderer } from '@/components/animation/SlideHeaderRenderer';
import { CardExpandLayout } from '@/components/slide-ui';
import type { CardExpandVariant } from '@/components/slide-ui';
import { SMART_CARD_ITEMS } from '@/config/smart-card-items';
import { InlineTextEditor } from '@/components/editor/inline-text-editor';

interface SlideMainCanvasProps {
  slide: Slide;
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
// Items Grid default layouts (columns per row for 2–8 items)
// ---------------------------------------------------------------------------

const GRID_LAYOUTS: Record<number, number[]> = {
  2: [2],
  3: [3],
  4: [2, 2],
  5: [3, 2],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
};

function getGridLayout(count: number): number[] {
  return GRID_LAYOUTS[count] ?? [Math.min(count, 4)];
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

  // In preview mode or when element has special overlay rendering,
  // render as a static positioned div (no drag/resize).
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
          // Convert drag delta back to design-space pixels
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
 * Elements are rendered with visibility based on the current sub-step.
 * Supports drag-to-reposition, resize, and inline text editing.
 *
 * Uses flattenItemsAsElements() to derive a flat element list from the
 * new SlideItem tree, falling back to slide.elements for legacy data.
 */
export function SlideMainCanvas({
  slide,
  selectedElementId,
  currentSubStep,
  totalSteps,
  onElementSelect,
  onElementUpdate,
  isPreview = false,
}: SlideMainCanvasProps) {
  const hasGroup = !!slide.groupedAnimation;
  const isZoomWord = slide.animationTemplate === 'zoom-in-word';
  const isSidebarDetail = slide.animationTemplate === 'sidebar-detail';
  const isCardExpand = slide.groupedAnimation?.type === 'card-expand';
  const hasStructuredHeader = !!slide.header;
  const showItemsGrid = slide.groupedAnimation?.type === 'items-grid';

  // Derive flat elements from the item tree (prefer items, fallback to elements)
  const elements = slide.items.length > 0
    ? flattenItemsAsElements(slide.items)
    : slide.elements;

  // Determine which elements are visible at the current sub-step
  const getElementVisibility = (elementId: string, _index: number): { visible: boolean; isFocused: boolean } => {
    if (hasGroup) {
      const groupItemIndex = slide.groupedAnimation!.items.findIndex(
        (item) => item.elementIds.includes(elementId),
      );
      if (groupItemIndex === -1) return { visible: true, isFocused: false };
      return {
        visible: groupItemIndex <= currentSubStep,
        isFocused: groupItemIndex === currentSubStep,
      };
    }

    const sortedByDelay = [...elements]
      .filter((el) => el.animation.type !== 'none')
      .sort((a, b) => a.animation.delay - b.animation.delay);
    const stepIndex = sortedByDelay.findIndex((el) => el.id === elementId);
    if (stepIndex === -1) return { visible: true, isFocused: false };
    return {
      visible: stepIndex <= currentSubStep,
      isFocused: stepIndex === currentSubStep,
    };
  };

  // Callback for element updates — no-op if no handler provided
  const handleElementUpdate = useCallback(
    (elementId: string, updates: Partial<SlideElement>) => {
      onElementUpdate?.(elementId, updates);
    },
    [onElementUpdate],
  );

  // --- Render: Structured header (from slide.header data model) ---
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
    const mainEl = elements[0];
    const subtitleEl = elements[1];
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

  // --- Shared sidebar dimensions (editor scale) ---
  const SB_ICON = 24;
  const SB_FONT = 9;
  const SB_GAP = 4;
  const SB_TOP = 40;
  const SB_LEFT = 8;
  const SB_W = 130;

  // --- Render: Items Grid (with end-state and item-by-item migration) ---
  const renderItemsGridOverlay = () => {
    if (!showItemsGrid) return null;
    const items = slide.groupedAnimation!.items;
    const itemCount = items.length;
    const isEndState = currentSubStep >= itemCount;
    const isGridToSidebar = slide.animationTemplate === 'grid-to-sidebar';
    const migratedCount = isGridToSidebar && currentSubStep > itemCount
      ? Math.min(currentSubStep - itemCount, itemCount)
      : 0;

    const gridLayout = getGridLayout(itemCount);
    type ItemPos = { gridX: number; gridY: number };
    const positions: ItemPos[] = [];
    let rowY = 0;
    gridLayout.forEach((cols) => {
      for (let c = 0; c < cols; c++) {
        positions.push({ gridX: c - (cols - 1) / 2, gridY: rowY });
      }
      rowY++;
    });

    const gridSpacingX = 90;
    const gridSpacingY = 80;

    return (
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        {items.map((item, i) => {
          const pos = positions[i];
          const isRevealed = i <= currentSubStep || isEndState;
          const isActive = !isEndState && i === currentSubStep;
          const inSidebar = i < migratedCount;

          const gridX = `calc(50% + ${pos.gridX * gridSpacingX}px - 32px)`;
          const gridY = `calc(52% + ${(pos.gridY - (gridLayout.length - 1) / 2) * gridSpacingY}px - 36px)`;
          const sidebarX = `${SB_LEFT}px`;
          const sidebarY = `${SB_TOP + i * (SB_ICON + SB_GAP + 6)}px`;

          return (
            <div
              key={item.id}
              className="absolute transition-all duration-500"
              style={{
                left: inSidebar ? sidebarX : gridX,
                top: inSidebar ? sidebarY : gridY,
                opacity: isRevealed ? 1 : 0.15,
                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                display: 'flex',
                flexDirection: inSidebar ? 'row' : 'column',
                alignItems: 'center',
                gap: inSidebar ? 6 : 4,
                width: inSidebar ? SB_W : 64,
              }}
            >
              <div
                className="flex items-center justify-center shadow shrink-0 transition-all duration-300"
                style={{
                  width: inSidebar ? SB_ICON : 52,
                  height: inSidebar ? SB_ICON : 52,
                  borderRadius: inSidebar ? 6 : 10,
                  backgroundColor: item.color ? `${item.color}18` : '#f1f5f9',
                  fontSize: inSidebar ? 12 : 20,
                }}
              >
                {item.icon}
              </div>
              <span
                className="font-semibold text-foreground leading-tight transition-all duration-300"
                style={{
                  fontSize: inSidebar ? SB_FONT : 9,
                  textAlign: inSidebar ? 'left' : 'center',
                  maxWidth: inSidebar ? 90 : 60,
                }}
              >
                {item.title}
              </span>
              {isActive && !inSidebar && item.description && (
                <div className="mt-0.5 px-2 py-1 rounded bg-primary text-primary-foreground text-[8px] max-w-24 text-center shadow-lg">
                  {item.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // --- Render: Sidebar-Detail (slide 7) ---
  const renderSidebarDetailOverlay = () => {
    if (!isSidebarDetail || !slide.groupedAnimation) return null;
    const items = slide.groupedAnimation.items;

    return (
      <div className="absolute inset-0 z-10 flex" style={{ paddingTop: SB_TOP }}>
        <div
          className="shrink-0 flex flex-col border-r border-border/30 overflow-hidden"
          style={{ width: SB_W, paddingLeft: SB_LEFT, paddingTop: 2, gap: SB_GAP }}
        >
          {items.map((item, i) => {
            const isRevealed = i <= currentSubStep;
            const isActive = i === currentSubStep;
            return (
              <div
                key={item.id}
                className="flex items-center gap-1.5 rounded px-1 py-1 transition-all duration-200"
                style={{
                  opacity: isRevealed ? 1 : 0.25,
                  backgroundColor: isActive ? (item.color ? `${item.color}12` : '#f1f5f9') : 'transparent',
                }}
              >
                <div
                  className="flex items-center justify-center shrink-0 rounded"
                  style={{
                    width: SB_ICON,
                    height: SB_ICON,
                    backgroundColor: item.color ? `${item.color}18` : '#f1f5f9',
                    fontSize: 12,
                  }}
                >
                  {item.icon}
                </div>
                <span className="font-semibold text-foreground leading-tight" style={{ fontSize: SB_FONT, maxWidth: 80 }}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex-1 px-4 py-3">
          {items.map((item, i) => {
            if (i !== currentSubStep) return null;
            return (
              <div key={item.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: item.color ? `${item.color}12` : '#f1f5f9' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                </div>
                {item.description && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed max-w-sm">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Render: Card-Expand (smart card) via CardExpandLayout ---
  const renderCardExpandOverlay = () => {
    if (!isCardExpand) return null;
    const variant = (slide.groupedAnimation!.cardExpandVariant ?? 'grid-to-overlay') as CardExpandVariant;

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
          expandedIndex={currentSubStep}
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
        {hasGroup && ` · ${slide.groupedAnimation!.type}`}
      </div>

      {/* Structured header from slide.header data model */}
      {renderStructuredHeader()}

      {/* Zoom-In Word Reveal overlay */}
      {renderZoomWordOverlay()}

      {/* Items Grid overlay */}
      {renderItemsGridOverlay()}

      {/* Sidebar-Detail overlay */}
      {isSidebarDetail && renderSidebarDetailOverlay()}

      {/* Card-Expand (Smart Card) overlay */}
      {renderCardExpandOverlay()}

      {/* Elements — with drag/resize/inline-edit when not in special overlay mode */}
      {elements.map((element, idx) => {
        const { visible, isFocused } = getElementVisibility(element.id, idx);
        const isSelected = selectedElementId === element.id;

        // Zoom-word slides render elements via overlay
        if (isZoomWord) return null;

        // Card-expand slides render entirely via CardExpandLayout overlay
        if (isCardExpand) return null;

        // Slides with structured headers already render title/subtitle via header
        // Skip legacy title/subtitle elements that were formerly at idx 0-1
        if (hasStructuredHeader && (showItemsGrid || isSidebarDetail) && idx <= 1) return null;

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

      {/* Grouped animation items overlay — standard (non-grid, non-sidebar, non-card-expand) grouped */}
      {hasGroup && !showItemsGrid && !isSidebarDetail && !isCardExpand && (
        <div className="absolute bottom-12 left-4 right-4 flex gap-2 justify-center">
          {slide.groupedAnimation!.items.map((item, i) => {
            const isRevealed = i <= currentSubStep;
            const isActive = i === currentSubStep;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : isRevealed
                    ? 'bg-muted text-foreground'
                    : 'bg-muted/40 text-muted-foreground/50'
                }`}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.title}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Transition badge */}
      {slide.transition !== 'none' && (
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 z-20">
          → {slide.transition}
        </div>
      )}
    </div>
  );
}
