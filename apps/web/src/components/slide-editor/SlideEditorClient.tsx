'use client';

import { useState, useMemo, useCallback } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS, DEMO_SECTIONS } from '@/config/demo-slides';
import { SlideThumbnail } from './SlideThumbnail';
import { SlideMainCanvas } from './SlideMainCanvas';
import { ScriptPanel } from './ScriptPanel';
import { AnimationStepStrip } from './AnimationStepStrip';
import { useEditorStore } from '@/stores/editor-store';
import type { Slide, SlideItem } from '@/types/slide';
import type { Scene } from '@/types/scene';
import type { SlideScript } from '@/types/script';
import { calcSceneSteps, generateSceneStepLabels } from '@/types/scene';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a widgetId -> title lookup from the slide's items tree.
 * Walks the tree and extracts the first text atom inside each card/layout.
 */
function buildWidgetTitleMap(slide: Slide): Record<string, string> {
  const map: Record<string, string> = {};

  function walk(items: SlideItem[]) {
    for (const item of items) {
      if (item.type === 'card') {
        const textAtom = item.children.find(
          (c) => c.type === 'atom' && c.atomType === 'text',
        );
        map[item.id] = textAtom && textAtom.type === 'atom'
          ? textAtom.content
          : item.id;
        walk(item.children);
      } else if (item.type === 'layout') {
        walk(item.children);
      }
    }
  }
  walk(slide.items);

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

  // Group slides for sidebar: unsectioned first, then each section's slides
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

  // Derive scenes directly from slide (all slides now define scenes natively)
  const scenes = useMemo(() => currentSlide.scenes ?? [], [currentSlide]);
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];

  // Calculate steps for the current scene
  const totalSteps = useMemo(() => (currentScene ? calcSceneSteps(currentScene) : 1), [currentScene]);

  // Build widget title map for step labels
  const widgetTitles = useMemo(() => buildWidgetTitleMap(currentSlide), [currentSlide]);

  // Generate step labels from the scene
  const stepLabels = useMemo(() => {
    if (!currentScene) return ['Scene'];
    const titles = { ...widgetTitles };
    if (currentScript) {
      for (const el of currentScript.elements) {
        titles[el.elementId] = el.label;
      }
    }
    return generateSceneStepLabels(currentScene, titles);
  }, [currentScene, widgetTitles, currentScript]);

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const handleSlideSelect = useCallback((index: number) => {
    setCurrentSlideIndex(index);
    setCurrentSceneIndex(0);
    setCurrentStepIndex(0);
    setSelectedElementId(null);
  }, []);

  const handleSceneSelect = useCallback((sceneIndex: number) => {
    setCurrentSceneIndex(sceneIndex);
    setCurrentStepIndex(0);
    setSelectedElementId(null);
  }, []);

  const handleStepSelect = useCallback((step: number) => {
    setCurrentStepIndex(step);
  }, []);

  // ---------------------------------------------------------------------------
  // Compute currentSubStep for canvas rendering
  // ---------------------------------------------------------------------------

  const currentSubStep = useMemo(() => {
    if (!currentScene) return 0;
    if (currentScene.widgetStateLayer.enterBehavior.revealMode === 'sequential') {
      return currentStepIndex;
    }
    // All-at-once: if step > 0, all widgets are revealed
    return currentStepIndex > 0
      ? currentScene.widgetStateLayer.animatedWidgetIds.length - 1
      : 0;
  }, [currentScene, currentStepIndex]);

  const activeScriptElementId = selectedElementId ?? undefined;

  // Helper to get scenes for a slide in thumbnails
  const getSlideScenes = useCallback((slide: Slide): Scene[] => {
    return slide.scenes ?? [];
  }, []);

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

      {/* Main workspace: thumbnails | canvas */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel — sections and slide thumbnails with scene children */}
        <div className="w-48 lg:w-56 border-r bg-muted/20 overflow-y-auto shrink-0">
          <div className="p-2 space-y-2">
            {/* Unsectioned slides at the top */}
            {unsectionedEntries.length > 0 && (
              <div className="space-y-2">
                {unsectionedEntries.map(({ slide, index }) => (
                  <SlideThumbnail
                    key={slide.id}
                    slide={slide}
                    index={index}
                    isActive={index === currentSlideIndex}
                    transitionType={slide.transition}
                    onClick={() => handleSlideSelect(index)}
                    scenes={getSlideScenes(slide)}
                    activeSceneIndex={index === currentSlideIndex ? currentSceneIndex : undefined}
                    onSceneSelect={handleSceneSelect}
                    showScenes={showScenes}
                  />
                ))}
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
                      {entries.map(({ slide, index }) => (
                        <SlideThumbnail
                          key={slide.id}
                          slide={slide}
                          index={index}
                          isActive={index === currentSlideIndex}
                          transitionType={slide.transition}
                          onClick={() => handleSlideSelect(index)}
                          scenes={getSlideScenes(slide)}
                          activeSceneIndex={index === currentSlideIndex ? currentSceneIndex : undefined}
                          onSceneSelect={handleSceneSelect}
                          showScenes={showScenes}
                        />
                      ))}
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
              currentScene={currentScene}
              selectedElementId={selectedElementId}
              currentSubStep={currentSubStep}
              totalSteps={totalSteps}
              onElementSelect={setSelectedElementId}
            />
          </div>

          {/* Animation step strip */}
          {showScenes && currentScene && (
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
