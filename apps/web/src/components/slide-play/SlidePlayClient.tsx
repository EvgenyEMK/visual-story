'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS } from '@/config/demo-slides';
import type { Slide } from '@/types/slide';
import type { Scene } from '@/types/scene';
import type { SlideScript } from '@/types/script';
import { calcSceneSteps, generateSceneStepLabels } from '@/types/scene';
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

/** Parse card-expand variant from animationTemplate, e.g. 'card-expand:center-popup' */
function parseCardExpandVariant(animationTemplate: string): CardExpandVariant | null {
  if (!animationTemplate.startsWith('card-expand:')) return null;
  return animationTemplate.split(':')[1] as CardExpandVariant;
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

  // Derive scenes from slide (all demo slides define scenes natively)
  const scenes = useMemo(() => currentSlide.scenes ?? [], [currentSlide]);
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];
  const totalSteps = useMemo(() => (currentScene ? calcSceneSteps(currentScene) : 1), [currentScene]);

  // Scene-derived state
  const hasOverviewStep = !!(
    currentScene?.widgetStateLayer.enterBehavior.includeOverviewStep &&
    currentScene.widgetStateLayer.enterBehavior.revealMode === 'sequential'
  );
  const isExitStep = !!(
    currentScene?.widgetStateLayer.exitBehavior &&
    currentStepIndex === totalSteps - 1
  );
  const cardExpandVariant = parseCardExpandVariant(currentSlide.animationTemplate);
  const isCardExpand = cardExpandVariant !== null;
  const isZoomWord = isZoomWordSlide(currentSlide);
  const hasStructuredHeader = !!currentSlide.header;
  const hasSpecialOverlay = isZoomWord || isCardExpand;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = currentScene?.widgetStateLayer.enterBehavior.stepDuration ?? 1500;
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
      if (isZoomWord) {
        return { visible: false, isFocused: false, hidden: true };
      }

      if (!currentScene) {
        return { visible: true, isFocused: false, hidden: false };
      }

      const { animatedWidgetIds, enterBehavior, initialStates } =
        currentScene.widgetStateLayer;
      const widgetIndex = animatedWidgetIds.indexOf(itemId);

      // Exit step: everything visible, nothing focused (overview)
      if (isExitStep) {
        return { visible: true, isFocused: false, hidden: false };
      }

      if (widgetIndex !== -1) {
        // Overview step (step 0 when includeOverviewStep): all visible, none focused
        if (hasOverviewStep && currentStepIndex === 0) {
          return { visible: true, isFocused: false, hidden: false };
        }

        const effectiveStep = hasOverviewStep
          ? currentStepIndex - 1
          : currentStepIndex;

        if (enterBehavior.revealMode === 'sequential') {
          return {
            visible: widgetIndex <= effectiveStep,
            isFocused: widgetIndex === effectiveStep,
            hidden: false,
          };
        }
        // All-at-once: all visible after step 0
        const allRevealed = currentStepIndex > 0 || totalSteps <= 1;
        return { visible: allRevealed, isFocused: false, hidden: false };
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

      // Default: visible
      return { visible: true, isFocused: false, hidden: false };
    },
    [currentScene, currentStepIndex, totalSteps, isZoomWord, hasOverviewStep, isExitStep],
  );

  // -----------------------------------------------------------------------
  // Script text for display
  // -----------------------------------------------------------------------

  const currentScriptText = useMemo(() => {
    if (!currentScript || !currentScene) return '';

    const { animatedWidgetIds, enterBehavior } = currentScene.widgetStateLayer;

    // Overview or exit step: show opening text
    if ((hasOverviewStep && currentStepIndex === 0) || isExitStep) {
      return currentScript.opening.text;
    }

    // Widget step: find the corresponding script entry
    const effectiveWidgetIndex = hasOverviewStep
      ? currentStepIndex - 1
      : currentStepIndex;
    const widgetId = animatedWidgetIds[effectiveWidgetIndex];
    if (widgetId) {
      const entry = currentScript.elements.find((e) => e.elementId === widgetId);
      if (entry) return entry.script.text;
    }

    // Fallback: opening text or first step
    if (enterBehavior.revealMode === 'all-at-once') {
      return currentScript.opening.text;
    }
    return '';
  }, [currentScript, currentScene, currentStepIndex, hasOverviewStep, isExitStep]);

  // =====================================================================
  // Render helpers
  // =====================================================================

  // --- Zoom-In Word Reveal ---
  const renderZoomWordOverlay = () => {
    if (!isZoomWord) return null;
    const atoms = flattenItems(currentSlide.items);
    const mainAtom = atoms[0];
    const subtitleAtom = atoms[1];
    if (!mainAtom) return null;

    const words = getZoomWords(currentSlide);
    const wordCount = words.length;
    const subtitleStep = wordCount;
    const morphStep = wordCount + 1;
    const isMorphing = currentStepIndex >= morphStep;
    const subtitleVisible = currentStepIndex >= subtitleStep;

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
              const isWordVisible = currentStepIndex >= i;
              const isWordActive = currentStepIndex === i;
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

  // --- Card-Expand (Smart Card) overlay ---
  const renderCardExpandOverlay = () => {
    if (!isCardExpand) return null;
    const variant = cardExpandVariant!;

    // Compute expandedIndex: overview step -> -1, widget steps -> 0..N-1, exit step -> -1
    let expandedIndex: number;
    if (isExitStep) {
      expandedIndex = -1;
    } else if (hasOverviewStep) {
      expandedIndex = currentStepIndex - 1; // step 0 -> -1 (overview)
    } else {
      expandedIndex = currentStepIndex;
    }

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
          expandedIndex={expandedIndex}
        />
      </div>
    );
  };

  // -----------------------------------------------------------------------
  // HUD layer
  // -----------------------------------------------------------------------

  const hudContent = (
    <div className="pointer-events-auto">
      <div className="absolute bottom-2 left-2 text-[9px] text-black/20 dark:text-white/15 font-mono">
        {currentSlide.animationTemplate}
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
            {/* Special overlays */}
            {isZoomWord && renderZoomWordOverlay()}
            {isCardExpand && renderCardExpandOverlay()}

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
