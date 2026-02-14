'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS } from '@/config/demo-slides';
import type { Slide } from '@/types/slide';
import type { Scene } from '@/types/scene';
import type { SlideScript } from '@/types/script';
import { calcSceneSteps, generateSceneStepLabels } from '@/types/scene';
import { ensureScenes } from '@/lib/migrate-to-scenes';
import { flattenItems } from '@/lib/flatten-items';
import { SlideFrame } from '@/components/animation/SlideFrame';
import { SlideHeaderRenderer } from '@/components/animation/SlideHeaderRenderer';
import { AnimationLayer } from '@/components/animation/AnimationLayer';
import { ItemRenderer, type ItemVisibility } from '@/components/animation/ItemRenderer';
import { SlideAnimationProvider } from '@/hooks/useSlideAnimation';
import { CardExpandLayout } from '@/components/slide-ui';
import type { CardExpandVariant } from '@/components/slide-ui';
import { SMART_CARD_ITEMS } from '@/config/smart-card-items';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Tokenise the first element's content into words (for zoom-in-word). */
function getZoomWords(slide: Slide): string[] {
  const atoms = flattenItems(slide.items);
  const mainAtom = atoms[0];
  if (!mainAtom) return [];
  return mainAtom.content.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
}

function isZoomWordSlide(slide: Slide): boolean {
  return slide.animationTemplate === 'zoom-in-word';
}

function isItemsGridSlide(slide: Slide): boolean {
  return slide.groupedAnimation?.type === 'items-grid';
}

function isCardExpandSlide(slide: Slide): boolean {
  return slide.groupedAnimation?.type === 'card-expand';
}

// Items Grid default layouts (columns per row for 2–8 items)
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

/**
 * Convert scene-level (sceneIndex, stepIndex) to a flat sub-step
 * for backward-compatible canvas rendering.
 */
function sceneToFlatStep(scene: Scene, stepIndex: number): number {
  if (scene.widgetStateLayer.enterBehavior.revealMode === 'sequential') {
    return stepIndex;
  }
  // All-at-once: step 0 = hidden, step >= 1 = all visible
  return stepIndex > 0
    ? scene.widgetStateLayer.animatedWidgetIds.length - 1
    : 0;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlidePlayClient() {
  const [slides] = useState<Slide[]>(DEMO_SLIDES);
  const [scripts] = useState<SlideScript[]>(DEMO_SCRIPTS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSlide = slides[currentSlideIndex];
  const currentScript = scripts.find((s) => s.slideId === currentSlide.id);

  // Derive scenes
  const scenes = useMemo(() => ensureScenes(currentSlide), [currentSlide]);
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];
  const totalSteps = useMemo(() => calcSceneSteps(currentScene), [currentScene]);
  const hasGroup = !!currentSlide.groupedAnimation;

  // Flat step for canvas compatibility
  const currentStep = useMemo(
    () => sceneToFlatStep(currentScene, currentStepIndex),
    [currentScene, currentStepIndex],
  );

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = currentScene.widgetStateLayer.enterBehavior.stepDuration ?? 1500;
    const timer = setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((s) => s + 1);
      } else if (currentSceneIndex < scenes.length - 1) {
        setCurrentSceneIndex((s) => s + 1);
        setCurrentStepIndex(0);
      } else if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex((s) => s + 1);
        setCurrentSceneIndex(0);
        setCurrentStepIndex(0);
      } else {
        setIsPlaying(false);
      }
    }, stepMs);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, currentSceneIndex, currentSlideIndex, totalSteps, scenes.length, slides.length, currentScene]);

  const handleAdvance = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((s) => s + 1);
    } else if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((s) => s + 1);
      setCurrentStepIndex(0);
    } else if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((s) => s + 1);
      setCurrentSceneIndex(0);
      setCurrentStepIndex(0);
    }
  }, [currentStepIndex, totalSteps, currentSceneIndex, scenes.length, currentSlideIndex, slides.length]);

  const handleRetreat = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((s) => s - 1);
    } else if (currentSceneIndex > 0) {
      setCurrentSceneIndex((s) => s - 1);
      setCurrentStepIndex(0);
    } else if (currentSlideIndex > 0) {
      setCurrentSlideIndex((s) => s - 1);
      setCurrentSceneIndex(0);
      setCurrentStepIndex(0);
    }
  }, [currentStepIndex, currentSceneIndex, currentSlideIndex]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleRetreat();
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPlaying((s) => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleAdvance, handleRetreat]);

  // -----------------------------------------------------------------------
  // Visibility callback for ItemRenderer
  // -----------------------------------------------------------------------

  const getItemVisibility = useCallback(
    (itemId: string): ItemVisibility => {
      // Special slides handle their own rendering — hide items from the tree
      if (isZoomWordSlide(currentSlide)) {
        return { visible: false, isFocused: false, hidden: true };
      }

      // Scene-based visibility: check if widget is in the animated list
      const { animatedWidgetIds, enterBehavior } = currentScene.widgetStateLayer;
      const widgetIndex = animatedWidgetIds.indexOf(itemId);

      if (widgetIndex !== -1) {
        if (enterBehavior.revealMode === 'sequential') {
          const isRevealed = widgetIndex <= currentStep;
          const isFocused = widgetIndex === currentStep;
          return { visible: isRevealed, isFocused, hidden: false };
        } else {
          // All-at-once: all visible after step 0
          const allRevealed = currentStepIndex > 0 || totalSteps <= 1;
          return { visible: allRevealed, isFocused: false, hidden: false };
        }
      }

      // For grouped animations (legacy fallback), check grouped items
      if (hasGroup) {
        const groupItems = currentSlide.groupedAnimation!.items;
        const groupItemIndex = groupItems.findIndex((gi) => gi.id === itemId);
        if (groupItemIndex !== -1) {
          const isRevealed = groupItemIndex <= currentStep;
          const isFocused = groupItemIndex === currentStep;
          return { visible: isRevealed, isFocused, hidden: false };
        }
      }

      // For standalone elements: reveal by animation delay order
      const atoms = flattenItems(currentSlide.items);
      const animated = atoms
        .filter((a) => a.animation && a.animation.type !== 'none')
        .sort((a, b) => (a.animation?.delay ?? 0) - (b.animation?.delay ?? 0));
      const stepIndex = animated.findIndex((a) => a.id === itemId);
      if (stepIndex !== -1) {
        return {
          visible: stepIndex <= currentStep,
          isFocused: stepIndex === currentStep,
          hidden: false,
        };
      }

      // Default: visible
      return { visible: true, isFocused: false, hidden: false };
    },
    [currentSlide, currentStep, currentStepIndex, currentScene, hasGroup, totalSteps],
  );

  // -----------------------------------------------------------------------
  // Script text for display
  // -----------------------------------------------------------------------

  const currentScriptText = (() => {
    if (!currentScript) return '';
    if (currentStepIndex === 0 && !hasGroup) return currentScript.opening.text;
    if (hasGroup && currentScript.elements[currentStep]) {
      return currentScript.elements[currentStep].script.text;
    }
    const atoms = flattenItems(currentSlide.items);
    const sortedAtoms = atoms
      .filter((a) => a.animation && a.animation.type !== 'none')
      .sort((a, b) => (a.animation?.delay ?? 0) - (b.animation?.delay ?? 0));
    const atom = sortedAtoms[currentStep];
    if (atom) {
      const scriptEntry = currentScript.elements.find((s) => s.elementId === atom.id);
      return scriptEntry?.script.text ?? '';
    }
    return '';
  })();

  // =====================================================================
  // Render helpers for special slide types (kept as overlays)
  // =====================================================================

  const renderZoomWordOverlay = () => {
    if (!isZoomWordSlide(currentSlide)) return null;
    const atoms = flattenItems(currentSlide.items);
    const mainAtom = atoms[0];
    const subtitleAtom = atoms[1];
    if (!mainAtom) return null;

    const words = getZoomWords(currentSlide);
    const wordCount = words.length;
    const subtitleStep = wordCount;
    const morphStep = wordCount + 1;
    const isMorphing = currentStep >= morphStep;
    const subtitleVisible = currentStep >= subtitleStep;

    return (
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-700"
        style={{
          transform: isMorphing
            ? 'translate(-30%, -38%) scale(0.5)'
            : 'translate(0, 0) scale(1)',
          opacity: isMorphing ? 0.7 : 1,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-12 max-w-[80%]">
            {words.map((word, i) => {
              const isWordVisible = currentStep >= i;
              const isWordActive = currentStep === i;
              return (
                <span
                  key={i}
                  className="transition-all duration-600 ease-out"
                  style={{
                    fontSize: mainAtom.style?.fontSize ?? 56,
                    fontWeight: (mainAtom.style?.fontWeight as string) ?? 'bold',
                    color: mainAtom.style?.color ?? '#1e293b',
                    opacity: isWordVisible ? 1 : 0,
                    transform: isWordVisible
                      ? isWordActive ? 'scale(1.05)' : 'scale(1)'
                      : 'scale(0.2)',
                    filter: isWordVisible ? 'blur(0px)' : 'blur(12px)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
          {subtitleAtom && (
            <span
              className="transition-all duration-500"
              style={{
                fontSize: subtitleAtom.style?.fontSize ?? 14,
                color: subtitleAtom.style?.color ?? '#94a3b8',
                opacity: subtitleVisible && !isMorphing ? 1 : 0,
                transform: subtitleVisible && !isMorphing ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              {subtitleAtom.content}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Sidebar dimensions
  const SIDEBAR_W = 180;
  const SIDEBAR_ICON = 32;
  const SIDEBAR_FONT = 12;
  const SIDEBAR_GAP = 6;
  const SIDEBAR_TOP = 56;
  const SIDEBAR_LEFT = 12;

  // Items Grid overlay
  const renderItemsGridOverlay = () => {
    if (!isItemsGridSlide(currentSlide)) return null;
    const items = currentSlide.groupedAnimation!.items;
    const itemCount = items.length;
    const isEndState = currentStep >= itemCount;
    const isGridToSidebar = currentSlide.animationTemplate === 'grid-to-sidebar';
    const migratedCount = isGridToSidebar && currentStep > itemCount
      ? Math.min(currentStep - itemCount, itemCount)
      : 0;

    const gridLayout = getGridLayout(itemCount);
    type ItemPos = { gridX: number; gridY: number; globalIdx: number };
    const positions: ItemPos[] = [];
    let rowY = 0;
    let flatIdx = 0;
    gridLayout.forEach((cols) => {
      for (let c = 0; c < cols; c++) {
        const gridX = c - (cols - 1) / 2;
        positions.push({ gridX, gridY: rowY, globalIdx: flatIdx });
        flatIdx++;
      }
      rowY++;
    });

    return (
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        {items.map((item, i) => {
          const pos = positions[i];
          const isRevealed = i <= currentStep || isEndState;
          const isActive = !isEndState && i === currentStep;
          const hasMigrated = i < migratedCount;

          const gridCenterX = 50;
          const gridCenterY = 52;
          const gridSpacingX = 120;
          const gridSpacingY = 110;
          const gridX = `calc(${gridCenterX}% + ${(pos.gridX) * gridSpacingX}px - 40px)`;
          const gridY = `calc(${gridCenterY}% + ${(pos.gridY - (gridLayout.length - 1) / 2) * gridSpacingY}px - 50px)`;

          const sidebarX = `${SIDEBAR_LEFT}px`;
          const sidebarY = `${SIDEBAR_TOP + i * (SIDEBAR_ICON + SIDEBAR_GAP + 8)}px`;

          const inSidebar = hasMigrated;
          const left = inSidebar ? sidebarX : gridX;
          const top = inSidebar ? sidebarY : gridY;

          return (
            <div
              key={item.id}
              className="absolute transition-all duration-700 ease-in-out"
              style={{
                left,
                top,
                opacity: isRevealed ? 1 : 0.12,
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                filter: isRevealed ? 'blur(0px)' : 'blur(3px)',
                display: 'flex',
                flexDirection: inSidebar ? 'row' : 'column',
                alignItems: 'center',
                gap: inSidebar ? 8 : 6,
                width: inSidebar ? SIDEBAR_W : 96,
              }}
            >
              <div
                className="flex items-center justify-center shadow-lg transition-all duration-500 shrink-0"
                style={{
                  width: inSidebar ? SIDEBAR_ICON : 80,
                  height: inSidebar ? SIDEBAR_ICON : 80,
                  borderRadius: inSidebar ? 8 : 16,
                  backgroundColor: item.color ? `${item.color}20` : '#f1f5f9',
                  fontSize: inSidebar ? 16 : 30,
                }}
              >
                {item.icon}
              </div>
              <span
                className="font-semibold text-zinc-800 leading-tight transition-all duration-500"
                style={{
                  fontSize: inSidebar ? SIDEBAR_FONT : 14,
                  textAlign: inSidebar ? 'left' : 'center',
                  maxWidth: inSidebar ? 130 : 96,
                }}
              >
                {item.title}
              </span>
              {isActive && !inSidebar && item.description && (
                <div className="mt-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-[11px] max-w-40 text-center shadow-xl">
                  {item.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Sidebar-Detail overlay
  const renderSidebarDetailOverlay = () => {
    if (currentSlide.animationTemplate !== 'sidebar-detail') return null;
    if (!currentSlide.groupedAnimation) return null;
    const items = currentSlide.groupedAnimation.items;

    return (
      <div className="absolute inset-0 z-10 flex" style={{ paddingTop: SIDEBAR_TOP }}>
        <div
          className="shrink-0 flex flex-col border-r border-black/5 overflow-hidden"
          style={{ width: SIDEBAR_W, paddingLeft: SIDEBAR_LEFT, paddingTop: 4, gap: SIDEBAR_GAP }}
        >
          {items.map((item, i) => {
            const isRevealed = i <= currentStep;
            const isActive = i === currentStep;
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-300 cursor-pointer"
                style={{
                  opacity: isRevealed ? 1 : 0.3,
                  backgroundColor: isActive ? (item.color ? `${item.color}15` : '#f1f5f9') : 'transparent',
                }}
              >
                <div
                  className="flex items-center justify-center shrink-0 rounded-lg transition-all duration-200"
                  style={{
                    width: SIDEBAR_ICON,
                    height: SIDEBAR_ICON,
                    backgroundColor: item.color ? `${item.color}20` : '#f1f5f9',
                    fontSize: 16,
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="font-semibold text-zinc-700 leading-tight"
                  style={{ fontSize: SIDEBAR_FONT, maxWidth: 120 }}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex-1 px-8 py-6 flex flex-col">
          {items.map((item, i) => {
            if (i !== currentStep) return null;
            return (
              <div key={item.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: item.color ? `${item.color}15` : '#f1f5f9' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-800">{item.title}</h3>
                </div>
                {item.description && (
                  <p className="text-sm text-zinc-600 leading-relaxed max-w-lg">
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

  // Card-Expand (Smart Card) overlay
  const renderCardExpandOverlay = () => {
    if (!isCardExpandSlide(currentSlide)) return null;
    const variant = (currentSlide.groupedAnimation!.cardExpandVariant ?? 'grid-to-overlay') as CardExpandVariant;

    return (
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: '#0f172a' }}
      >
        <CardExpandLayout
          items={SMART_CARD_ITEMS}
          variant={variant}
          cardSize="sm"
          columns={variant === 'row-to-split' ? undefined : 2}
          gap={8}
          expandedIndex={currentStep}
        />
      </div>
    );
  };

  // -----------------------------------------------------------------------
  // Derived booleans
  // -----------------------------------------------------------------------

  const isZoomWord = isZoomWordSlide(currentSlide);
  const isSidebarDetail = currentSlide.animationTemplate === 'sidebar-detail';
  const showItemsGrid = isItemsGridSlide(currentSlide);
  const showCardExpand = isCardExpandSlide(currentSlide);

  const hasStructuredHeader = !!currentSlide.header;
  const hasSpecialOverlay = isZoomWord || showItemsGrid || isSidebarDetail || showCardExpand;

  // -----------------------------------------------------------------------
  // HUD layer content
  // -----------------------------------------------------------------------

  const hudContent = (
    <div className="pointer-events-auto">
      <div className="absolute bottom-2 left-2 text-[9px] text-black/20 dark:text-white/15 font-mono">
        {currentSlide.animationTemplate}
        {hasGroup && ` · ${currentSlide.groupedAnimation!.type}`}
        {scenes.length > 1 && ` · Scene ${currentSceneIndex + 1}/${scenes.length}`}
      </div>
      <div className="absolute top-3 right-3 text-[10px] text-white/30 font-mono">
        {currentSlide.transition !== 'none' && `→ ${currentSlide.transition}`}
      </div>
    </div>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <SlideAnimationProvider>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-black text-white">
        {/* Main canvas */}
        <div
          className="flex-1 flex items-center justify-center cursor-pointer relative"
          onClick={handleAdvance}
        >
          <SlideFrame
            className="max-w-5xl mx-8 rounded-lg bg-white dark:bg-zinc-900 shadow-2xl"
            header={hasStructuredHeader
              ? <SlideHeaderRenderer header={currentSlide.header!} slide={currentSlide} />
              : undefined
            }
            animationLayer={<AnimationLayer />}
            hudLayer={hudContent}
          >
            {/* Special overlays rendered directly in the layout layer */}
            {isZoomWord && renderZoomWordOverlay()}
            {showItemsGrid && renderItemsGridOverlay()}
            {isSidebarDetail && renderSidebarDetailOverlay()}
            {showCardExpand && renderCardExpandOverlay()}

            {/* Grouped items bar for non-special grouped slides */}
            {hasGroup && !hasSpecialOverlay && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center z-10">
                {currentSlide.groupedAnimation!.items.map((item, i) => {
                  const isRevealed = i <= currentStep;
                  const isActive = i === currentStep;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-500 ${
                        isActive
                          ? 'bg-white text-zinc-900 shadow-lg scale-110'
                          : isRevealed
                          ? 'bg-white/20 text-white/80'
                          : 'bg-white/5 text-white/20'
                      }`}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.title}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Item tree rendered via ItemRenderer (for non-special slides) */}
            {!hasSpecialOverlay && (
              <ItemRenderer
                items={currentSlide.items}
                getVisibility={getItemVisibility}
              />
            )}
          </SlideFrame>
        </div>

        {/* Script bar */}
        {currentScriptText && (
          <div className="px-8 py-3 bg-black/80 border-t border-white/10 text-center">
            <p className="text-sm text-white/80 max-w-3xl mx-auto leading-relaxed">
              {currentScriptText}
            </p>
          </div>
        )}

        {/* Controls bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-t border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCurrentSlideIndex(0); setCurrentSceneIndex(0); setCurrentStepIndex(0); }}
              className="px-2 py-1 text-xs text-white/60 hover:text-white transition-colors"
            >
              ⏮ Start
            </button>
            <button
              onClick={handleRetreat}
              className="px-2 py-1 text-xs text-white/60 hover:text-white transition-colors"
            >
              ◀ Back
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                isPlaying
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={handleAdvance}
              className="px-2 py-1 text-xs text-white/60 hover:text-white transition-colors"
            >
              Next ▶
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentSlideIndex(i); setCurrentSceneIndex(0); setCurrentStepIndex(0); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlideIndex
                      ? 'bg-white scale-125'
                      : i < currentSlideIndex
                      ? 'bg-white/40'
                      : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/40 font-mono">
              {currentSlideIndex + 1}/{slides.length}
              {scenes.length > 1 && ` · Scene ${currentSceneIndex + 1}/${scenes.length}`}
              {' · '}
              Step {currentStepIndex + 1}/{totalSteps}
            </span>
          </div>

          <div className="text-[10px] text-white/30">
            ← → Space to navigate · P to play/pause
          </div>
        </div>
      </div>
    </SlideAnimationProvider>
  );
}
