'use client';

import { useState, useMemo, useCallback } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS, DEMO_SECTIONS } from '@/config/demo-slides';
import { SlideThumbnail } from './SlideThumbnail';
import { SlideMainCanvas } from './SlideMainCanvas';
import { ScriptPanel } from './ScriptPanel';
import { AnimationStepStrip } from './AnimationStepStrip';
import { useEditorStore } from '@/stores/editor-store';
import type { Slide } from '@/types/slide';
import type { Scene } from '@/types/scene';
import type { SlideScript } from '@/types/script';
import { calcSceneSteps, generateSceneStepLabels } from '@/types/scene';
import { ensureScenes } from '@/lib/migrate-to-scenes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a widgetId → title lookup from the slide's grouped items or scene data.
 */
function buildWidgetTitleMap(slide: Slide, scenes: Scene[]): Record<string, string> {
  const map: Record<string, string> = {};

  // From grouped animation items (legacy)
  if (slide.groupedAnimation) {
    for (const item of slide.groupedAnimation.items) {
      map[item.id] = item.title;
    }
  }

  // From slide items tree (title atoms within cards)
  // Simple heuristic: look for card children with text atoms
  for (const item of slide.items) {
    if (item.type === 'card' || item.type === 'layout') {
      map[item.id] = item.id; // fallback
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/** Pair of slide and its index in the full slides array (for selection). */
type SlideEntry = { slide: Slide; index: number };

export function SlideEditorClient() {
  const [slides] = useState<Slide[]>(DEMO_SLIDES);
  const [scripts] = useState<SlideScript[]>(DEMO_SCRIPTS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showScenes, setShowScenes] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { collapsedSections, toggleSectionCollapse } = useEditorStore();

  // Group slides for sidebar: unsectioned first, then each section's slides in section order
  const { unsectionedEntries, sectionEntries } = useMemo(() => {
    const withIndex: SlideEntry[] = slides.map((slide, index) => ({ slide, index }));
    const unsectioned = withIndex.filter(({ slide }) => !slide.sectionId);
    const sectionEntriesList: { sectionId: string; title: string; icon?: string; slideIds: string[]; entries: SlideEntry[] }[] = DEMO_SECTIONS.map((section) => {
      const entries: SlideEntry[] = section.slideIds
        .map((id) => withIndex.find((e) => e.slide.id === id))
        .filter((e): e is SlideEntry => e != null);
      return { sectionId: section.id, title: section.title, icon: section.icon, slideIds: section.slideIds, entries };
    });
    return { unsectionedEntries: unsectioned, sectionEntries: sectionEntriesList };
  }, [slides]);

  const currentSlide = slides[currentSlideIndex];
  const currentScript = scripts.find((s) => s.slideId === currentSlide.id);

  // Derive scenes from the slide (migrate from legacy if needed)
  const scenes = useMemo(() => ensureScenes(currentSlide), [currentSlide]);
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];

  // Calculate steps for the current scene
  const totalSteps = useMemo(() => calcSceneSteps(currentScene), [currentScene]);

  // Build widget title map for labels
  const widgetTitles = useMemo(
    () => buildWidgetTitleMap(currentSlide, scenes),
    [currentSlide, scenes],
  );

  // Generate step labels from the scene
  const stepLabels = useMemo(() => {
    // Use script labels when available
    const scriptTitles = { ...widgetTitles };
    if (currentScript) {
      for (const el of currentScript.elements) {
        scriptTitles[el.elementId] = el.label;
      }
    }
    return generateSceneStepLabels(currentScene, scriptTitles);
  }, [currentScene, widgetTitles, currentScript]);

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  // Reset scene + step when switching slides
  const handleSlideSelect = useCallback((index: number) => {
    setCurrentSlideIndex(index);
    setCurrentSceneIndex(0);
    setCurrentStepIndex(0);
    setSelectedElementId(null);
  }, []);

  // Reset step when switching scenes
  const handleSceneSelect = useCallback((sceneIndex: number) => {
    setCurrentSceneIndex(sceneIndex);
    setCurrentStepIndex(0);
    setSelectedElementId(null);
  }, []);

  const handleStepSelect = useCallback((step: number) => {
    setCurrentStepIndex(step);
  }, []);

  // ---------------------------------------------------------------------------
  // Compute legacy-compatible currentSubStep for canvas rendering
  // This maps (sceneIndex, stepIndex) → a flat step index that the canvas uses
  // ---------------------------------------------------------------------------

  const currentSubStep = useMemo(() => {
    if (currentScene.widgetStateLayer.enterBehavior.revealMode === 'sequential') {
      return currentStepIndex;
    }
    // All-at-once: if step > 0, all widgets are revealed
    return currentStepIndex > 0
      ? currentScene.widgetStateLayer.animatedWidgetIds.length - 1
      : 0;
  }, [currentScene, currentStepIndex]);

  // Total legacy steps (for canvas compatibility)
  const legacyTotalSteps = useMemo(() => {
    const { enterBehavior, animatedWidgetIds } = currentScene.widgetStateLayer;
    if (enterBehavior.revealMode === 'sequential') {
      return animatedWidgetIds.length || 1;
    }
    return 1;
  }, [currentScene]);

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
            onClick={() => setShowScenes(!showScenes)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showScenes
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            {showScenes ? 'Scenes ON' : 'Scenes OFF'}
          </button>
          <span className="text-xs text-muted-foreground">
            Slide {currentSlideIndex + 1}/{slides.length}
            {showScenes && scenes.length > 1 && (
              <> &middot; Scene {currentSceneIndex + 1}/{scenes.length}</>
            )}
            {showScenes && <> &middot; Step {currentStepIndex + 1}/{totalSteps}</>}
          </span>
        </div>
      </div>

      {/* Main workspace: thumbnails | canvas | (future: properties) */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel — sections and slide thumbnails with scene children */}
        <div className="w-48 lg:w-56 border-r bg-muted/20 overflow-y-auto shrink-0">
          <div className="p-2 space-y-2">
            {/* Unsectioned slides at the top */}
            {unsectionedEntries.length > 0 && (
              <div className="space-y-2">
                {unsectionedEntries.map(({ slide, index }) => {
                  const slideScenes = ensureScenes(slide);
                  return (
                    <SlideThumbnail
                      key={slide.id}
                      slide={slide}
                      index={index}
                      isActive={index === currentSlideIndex}
                      hasGroupedAnimation={!!slide.groupedAnimation}
                      transitionType={slide.transition}
                      onClick={() => handleSlideSelect(index)}
                      scenes={slideScenes}
                      activeSceneIndex={index === currentSlideIndex ? currentSceneIndex : undefined}
                      onSceneSelect={handleSceneSelect}
                      showScenes={showScenes}
                    />
                  );
                })}
              </div>
            )}

            {/* Section headers and their slides */}
            {sectionEntries.map(({ sectionId, title, icon, entries }) => {
              const isCollapsed = collapsedSections[sectionId] === true;
              return (
                <div key={sectionId} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleSectionCollapse(sectionId)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-colors"
                  >
                    <span className="text-muted-foreground shrink-0 transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(-90deg)' : undefined }}>
                      ▼
                    </span>
                    {icon && <span className="text-sm">{icon}</span>}
                    <span className="text-xs font-medium text-foreground truncate flex-1">{title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{entries.length}</span>
                  </button>
                  {!isCollapsed && (
                    <div className="space-y-2 pl-0">
                      {entries.map(({ slide, index }) => {
                        const slideScenes = ensureScenes(slide);
                        return (
                          <SlideThumbnail
                            key={slide.id}
                            slide={slide}
                            index={index}
                            isActive={index === currentSlideIndex}
                            hasGroupedAnimation={!!slide.groupedAnimation}
                            transitionType={slide.transition}
                            onClick={() => handleSlideSelect(index)}
                            scenes={slideScenes}
                            activeSceneIndex={index === currentSlideIndex ? currentSceneIndex : undefined}
                            onSceneSelect={handleSceneSelect}
                            showScenes={showScenes}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center — main canvas + animation step strip */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas area */}
          <div className="flex-1 min-h-0 flex items-center justify-center p-4 bg-muted/10 overflow-auto">
            <SlideMainCanvas
              slide={currentSlide}
              selectedElementId={selectedElementId}
              currentSubStep={currentSubStep}
              totalSteps={legacyTotalSteps}
              onElementSelect={setSelectedElementId}
            />
          </div>

          {/* Animation step strip */}
          {showScenes && (
            <AnimationStepStrip
              labels={stepLabels}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              scene={currentScene}
              onStepSelect={handleStepSelect}
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
