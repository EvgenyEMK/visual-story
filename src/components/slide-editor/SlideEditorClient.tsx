'use client';

import { useState, useMemo, useCallback } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS } from '@/config/demo-slides';
import { SlideThumbnail } from './SlideThumbnail';
import { SlideMainCanvas } from './SlideMainCanvas';
import { ScriptPanel } from './ScriptPanel';
import { SubSlideStrip } from './SubSlideStrip';
import type { Slide } from '@/types/slide';
import type { SlideScript } from '@/types/script';
import { flattenItemsAsElements } from '@/lib/flatten-items';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get a flat element list from a slide, preferring the new items tree.
 */
function getElements(slide: Slide) {
  return slide.items.length > 0
    ? flattenItemsAsElements(slide.items)
    : slide.elements;
}

/** Tokenise the first element's content into words (for zoom-in-word). */
function getZoomWords(slide: Slide): string[] {
  const elements = getElements(slide);
  const mainEl = elements[0];
  if (!mainEl) return [];
  return mainEl.content.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
}

/**
 * Calculate total animation sub-steps for a slide.
 * Special overrides for zoom-in-word, items-grid, and grid-to-sidebar slides.
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
  const elements = getElements(slide);
  const elementSteps = elements.filter(
    (el) => el.animation.type !== 'none',
  ).length;
  return groupSteps > 0 ? groupSteps : Math.max(elementSteps, 1);
}

/** Generate sub-slide labels for the strip. */
function generateSubSlideLabels(slide: Slide, script?: SlideScript): string[] {
  const total = calcTotalSteps(slide);
  const labels: string[] = [];

  // Zoom-in-word: word labels + subtitle + morph
  if (slide.animationTemplate === 'zoom-in-word') {
    const words = getZoomWords(slide);
    words.forEach((w) => labels.push(`"${w}"`));
    labels.push('Subtitle');
    labels.push('Morph → Title');
    return labels;
  }

  if (slide.groupedAnimation) {
    const items = slide.groupedAnimation.items;
    for (let i = 0; i < items.length; i++) {
      labels.push(items[i].title);
    }
    // Extra steps for items-grid
    if (slide.groupedAnimation.type === 'items-grid') {
      labels.push('All Items');
      if (slide.animationTemplate === 'grid-to-sidebar') {
        items.forEach((it) => labels.push(`→ ${it.title}`));
      }
    }
  } else {
    const elements = getElements(slide);
    const animated = [...elements]
      .filter((el) => el.animation.type !== 'none')
      .sort((a, b) => a.animation.delay - b.animation.delay);
    for (let i = 0; i < total; i++) {
      const el = animated[i];
      if (el) {
        const scriptEl = script?.elements.find((s) => s.elementId === el.id);
        labels.push(scriptEl?.label ?? (el.content.slice(0, 20) || `Element ${i + 1}`));
      } else {
        labels.push(`Step ${i + 1}`);
      }
    }
  }
  return labels;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SlideEditorClient() {
  const [slides] = useState<Slide[]>(DEMO_SLIDES);
  const [scripts] = useState<SlideScript[]>(DEMO_SCRIPTS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showSubSlides, setShowSubSlides] = useState(true);
  const [currentSubStep, setCurrentSubStep] = useState(0);

  const currentSlide = slides[currentSlideIndex];
  const currentScript = scripts.find((s) => s.slideId === currentSlide.id);
  const totalSteps = useMemo(() => calcTotalSteps(currentSlide), [currentSlide]);
  const subSlideLabels = useMemo(
    () => generateSubSlideLabels(currentSlide, currentScript),
    [currentSlide, currentScript]
  );

  // Reset sub-step when switching slides
  const handleSlideSelect = useCallback((index: number) => {
    setCurrentSlideIndex(index);
    setCurrentSubStep(0);
    setSelectedElementId(null);
  }, []);

  const handleSubStepSelect = useCallback((step: number) => {
    setCurrentSubStep(step);
  }, []);

  // Find which script element corresponds to the selected element
  const activeScriptElementId = selectedElementId ?? undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Slide Editor</h1>
          <span className="text-sm text-muted-foreground">
            Demo Deck &mdash; {slides.length} slides
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSubSlides(!showSubSlides)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showSubSlides
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            {showSubSlides ? 'Sub-slides ON' : 'Sub-slides OFF'}
          </button>
          <span className="text-xs text-muted-foreground">
            Slide {currentSlideIndex + 1}/{slides.length}
            {showSubSlides && ` · Step ${currentSubStep + 1}/${totalSteps}`}
          </span>
        </div>
      </div>

      {/* Main workspace: thumbnails | canvas | (future: properties) */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel — slide thumbnails */}
        <div className="w-48 lg:w-56 border-r bg-muted/20 overflow-y-auto shrink-0">
          <div className="p-2 space-y-2">
            {slides.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                slide={slide}
                index={index}
                isActive={index === currentSlideIndex}
                hasGroupedAnimation={!!slide.groupedAnimation}
                transitionType={slide.transition}
                onClick={() => handleSlideSelect(index)}
              />
            ))}
          </div>
        </div>

        {/* Center — main canvas + sub-slide strip */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas area */}
          <div className="flex-1 min-h-0 flex items-center justify-center p-4 bg-muted/10 overflow-auto">
            <SlideMainCanvas
              slide={currentSlide}
              selectedElementId={selectedElementId}
              currentSubStep={currentSubStep}
              totalSteps={totalSteps}
              onElementSelect={setSelectedElementId}
            />
          </div>

          {/* Sub-slide strip */}
          {showSubSlides && (
            <SubSlideStrip
              labels={subSlideLabels}
              currentStep={currentSubStep}
              totalSteps={totalSteps}
              slide={currentSlide}
              onStepSelect={handleSubStepSelect}
            />
          )}
        </div>
      </div>

      {/* Bottom panel — script */}
      <ScriptPanel
        script={currentScript}
        activeElementId={activeScriptElementId}
        onElementClick={(elementId) => setSelectedElementId(elementId)}
      />
    </div>
  );
}
