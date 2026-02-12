'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS } from '@/config/demo-slides';
import type { Slide } from '@/types/slide';
import type { SlideScript } from '@/types/script';
import { flattenItems } from '@/lib/flatten-items';
import { SlideFrame } from '@/components/animation/SlideFrame';
import { AnimationLayer } from '@/components/animation/AnimationLayer';
import { ItemRenderer, type ItemVisibility } from '@/components/animation/ItemRenderer';
import { SlideAnimationProvider } from '@/hooks/useSlideAnimation';

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

/**
 * Calculate total sub-steps for a slide.
 */
function calcTotalSteps(slide: Slide): number {
  if (slide.animationTemplate === 'zoom-in-word') {
    return getZoomWords(slide).length + 1 /* subtitle */ + 1; /* morph */
  }
  if (slide.groupedAnimation?.type === 'items-grid') {
    const N = slide.groupedAnimation.items.length;
    if (slide.animationTemplate === 'grid-to-sidebar') {
      return N + 1 /* end-state */ + N; /* one-by-one migration */
    }
    return N + 1; // end-state only
  }
  const groupSteps = slide.groupedAnimation?.items.length ?? 0;
  const atoms = flattenItems(slide.items);
  const elementSteps = atoms.filter(
    (a) => a.animation && a.animation.type !== 'none',
  ).length;
  return groupSteps > 0 ? groupSteps : Math.max(elementSteps, 1);
}

function isZoomWordSlide(slide: Slide): boolean {
  return slide.animationTemplate === 'zoom-in-word';
}

function isSlideTitleSlide(slide: Slide): boolean {
  return slide.animationTemplate === 'slide-title';
}

function isItemsGridSlide(slide: Slide): boolean {
  return slide.groupedAnimation?.type === 'items-grid';
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
// Component
// ---------------------------------------------------------------------------

export function SlidePlayClient() {
  const [slides] = useState<Slide[]>(DEMO_SLIDES);
  const [scripts] = useState<SlideScript[]>(DEMO_SCRIPTS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSlide = slides[currentSlideIndex];
  const currentScript = scripts.find((s) => s.slideId === currentSlide.id);
  const totalSteps = useMemo(() => calcTotalSteps(currentSlide), [currentSlide]);
  const hasGroup = !!currentSlide.groupedAnimation;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = currentSlide.groupedAnimation?.stepDuration ?? 1500;
    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((s) => s + 1);
      } else if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex((s) => s + 1);
        setCurrentStep(0);
      } else {
        setIsPlaying(false);
      }
    }, stepMs);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, currentSlideIndex, totalSteps, slides.length, currentSlide]);

  const handleAdvance = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((s) => s + 1);
      setCurrentStep(0);
    }
  }, [currentStep, totalSteps, currentSlideIndex, slides.length]);

  const handleRetreat = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else if (currentSlideIndex > 0) {
      setCurrentSlideIndex((s) => s - 1);
      setCurrentStep(0);
    }
  }, [currentStep, currentSlideIndex]);

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

      // For grouped animations, check if the item is a grouped item card
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
    [currentSlide, currentStep, hasGroup],
  );

  // -----------------------------------------------------------------------
  // Script text for display
  // -----------------------------------------------------------------------

  const currentScriptText = (() => {
    if (!currentScript) return '';
    if (currentStep === 0 && !hasGroup) return currentScript.opening.text;
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

  // Slide Title header
  const renderSlideTitleHeader = () => {
    if (!isSlideTitleSlide(currentSlide) && !isItemsGridSlide(currentSlide)) return null;
    const atoms = flattenItems(currentSlide.items);
    const titleAtom = atoms[0];
    const subtitleAtom = atoms[1];
    if (!titleAtom) return null;

    return (
      <div className="absolute top-0 left-0 right-0 px-6 py-3 flex items-baseline justify-between border-b border-black/5 z-10">
        <div className="flex items-baseline gap-3">
          <span
            className="transition-all duration-500"
            style={{
              fontSize: titleAtom.style?.fontSize ?? 28,
              fontWeight: (titleAtom.style?.fontWeight as string) ?? 'bold',
              color: titleAtom.style?.color ?? '#1e293b',
            }}
          >
            {titleAtom.content}
          </span>
          {subtitleAtom && (
            <span
              className="transition-all duration-500"
              style={{
                fontSize: subtitleAtom.style?.fontSize ?? 14,
                color: subtitleAtom.style?.color ?? '#64748b',
              }}
            >
              {subtitleAtom.content}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs text-zinc-400">Active</span>
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

  // -----------------------------------------------------------------------
  // Derived booleans
  // -----------------------------------------------------------------------

  const isZoomWord = isZoomWordSlide(currentSlide);
  const isSidebarDetail = currentSlide.animationTemplate === 'sidebar-detail';
  const showSlideTitleHeader = isSlideTitleSlide(currentSlide) || isItemsGridSlide(currentSlide) || currentSlide.animationTemplate === 'grid-to-sidebar' || isSidebarDetail;
  const showItemsGrid = isItemsGridSlide(currentSlide);

  // Whether this slide uses a special overlay that handles its own rendering
  const hasSpecialOverlay = isZoomWord || showItemsGrid || isSidebarDetail;

  // -----------------------------------------------------------------------
  // HUD layer content
  // -----------------------------------------------------------------------

  const hudContent = (
    <div className="pointer-events-auto">
      {/* Template badge */}
      <div className="absolute bottom-2 left-2 text-[9px] text-black/20 dark:text-white/15 font-mono">
        {currentSlide.animationTemplate}
        {hasGroup && ` · ${currentSlide.groupedAnimation!.type}`}
      </div>
      {/* Transition indicator */}
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
            animationLayer={<AnimationLayer />}
            hudLayer={hudContent}
          >
            {/* Slide Title header for applicable slides */}
            {showSlideTitleHeader && renderSlideTitleHeader()}

            {/* Special overlays rendered directly in the layout layer */}
            {isZoomWord && renderZoomWordOverlay()}
            {showItemsGrid && renderItemsGridOverlay()}
            {isSidebarDetail && renderSidebarDetailOverlay()}

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
              onClick={() => { setCurrentSlideIndex(0); setCurrentStep(0); }}
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
                  onClick={() => { setCurrentSlideIndex(i); setCurrentStep(0); }}
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
              {' · '}
              Step {currentStep + 1}/{totalSteps}
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
