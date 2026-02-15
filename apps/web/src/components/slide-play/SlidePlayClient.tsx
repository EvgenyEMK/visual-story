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
import { em } from '@/components/slide-ui/units';

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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

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
  const isZoomWord = isZoomWordSlide(currentSlide);
  const hasStructuredHeader = !!currentSlide.header;

  // Check if any scene has activatedByWidgetIds (menu/tab navigation)
  const hasMenuNavigation = useMemo(
    () => scenes.some((s) => s.activatedByWidgetIds && s.activatedByWidgetIds.length > 0),
    [scenes],
  );

  // Check if current scene has toggle-expand interaction (popup mode)
  const hasPopupInteraction = useMemo(
    () => currentScene?.widgetStateLayer.interactionBehaviors.some(
      (b) => b.action === 'toggle-expand',
    ) ?? false,
    [currentScene],
  );

  // Is this a click-only popup slide (all-at-once, no auto-mode expand)?
  const isClickOnlyPopup = useMemo(() => {
    if (!hasPopupInteraction || !currentScene) return false;
    const enterBehavior = currentScene.widgetStateLayer.enterBehavior;
    const expandBehavior = currentScene.widgetStateLayer.interactionBehaviors.find(
      (b) => b.action === 'toggle-expand',
    );
    return enterBehavior.revealMode === 'all-at-once' && expandBehavior?.availableInAutoMode === false;
  }, [hasPopupInteraction, currentScene]);

  // For step-driven popup: derive expanded card from step
  const stepDrivenExpandedCardId = useMemo(() => {
    if (!hasPopupInteraction || isClickOnlyPopup || !currentScene) return null;
    if (isExitStep) return null;
    const { animatedWidgetIds, enterBehavior } = currentScene.widgetStateLayer;
    if (enterBehavior.revealMode !== 'sequential') return null;

    if (hasOverviewStep && currentStepIndex === 0) return null;
    const effectiveStep = hasOverviewStep ? currentStepIndex - 1 : currentStepIndex;
    return animatedWidgetIds[effectiveStep] ?? null;
  }, [hasPopupInteraction, isClickOnlyPopup, currentScene, currentStepIndex, hasOverviewStep, isExitStep]);

  // The effective expanded card: step-driven or click-driven
  const effectiveExpandedCard = isClickOnlyPopup ? expandedCardId : stepDrivenExpandedCardId;

  // Reset expanded card when slide/scene changes
  useEffect(() => {
    setExpandedCardId(null);
  }, [currentSlideIndex, currentSceneIndex]);

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

  // Handle item click: menu/tab navigation or popup toggle
  const handleItemClick = useCallback(
    (widgetId: string) => {
      // Check for menu/tab navigation: find a scene activated by this widget
      if (hasMenuNavigation) {
        const targetSceneIndex = scenes.findIndex(
          (s) => s.activatedByWidgetIds?.includes(widgetId),
        );
        if (targetSceneIndex !== -1 && targetSceneIndex !== currentSceneIndex) {
          setCurrentSceneIndex(targetSceneIndex);
          setCurrentStepIndex(0);
          return;
        }
      }

      // Check for popup interaction: toggle card detail popup
      if (hasPopupInteraction && isClickOnlyPopup) {
        setExpandedCardId((prev) => (prev === widgetId ? null : widgetId));
      }
    },
    [hasMenuNavigation, hasPopupInteraction, isClickOnlyPopup, scenes, currentSceneIndex],
  );

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
      } else if (e.key === 'Escape') {
        setExpandedCardId(null);
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
        <div className="flex flex-col items-center gap-[1em]">
          <div className="flex flex-wrap justify-center gap-x-[1.25em] gap-y-[0.5em] px-[3em] max-w-[80%]">
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
                fontSize: em(subtitleAtom.style?.fontSize ?? 14),
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

  // -----------------------------------------------------------------------
  // HUD layer
  // -----------------------------------------------------------------------

  const hudContent = (
    <div className="pointer-events-auto">
      <div className="absolute bottom-2 left-2 text-[0.5625rem] text-black/20 dark:text-white/15 font-mono">
        {currentSlide.animationTemplate}
        {scenes.length > 1 && ` · Scene ${currentSceneIndex + 1}/${scenes.length}`}
      </div>
      <div className="absolute top-3 right-3 text-[0.625rem] text-white/30 font-mono">
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
            {/* Zoom-In Word Reveal overlay */}
            {isZoomWord && renderZoomWordOverlay()}

            {/* Item tree rendered via ItemRenderer (for non-zoom slides) */}
            {!isZoomWord && (
              <ItemRenderer
                items={currentSlide.items}
                getVisibility={getItemVisibility}
                onItemClick={handleItemClick}
                expandedCardId={effectiveExpandedCard}
                onCardExpand={setExpandedCardId}
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

          <div className="text-[0.625rem] text-white/30">
            ← → Space to navigate · P to play/pause
          </div>
        </div>
      </div>
    </SlideAnimationProvider>
  );
}
