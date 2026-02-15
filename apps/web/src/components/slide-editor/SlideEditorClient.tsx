'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { DEMO_SLIDES, DEMO_SCRIPTS, DEMO_SECTIONS } from '@/config/demo-slides';
import { SlideThumbnail } from './SlideThumbnail';
import { SlideMainCanvas } from './SlideMainCanvas';
import { ScriptPanel } from './ScriptPanel';
import { AnimationStepStrip } from './AnimationStepStrip';
import { useEditorStore } from '@/stores/editor-store';
import { useProjectStore } from '@/stores/project-store';
import { useUndoRedoStore } from '@/stores/undo-redo-store';
import { ItemPropertiesPanel } from '@/components/editor/item-properties-panel';
import type { Slide, SlideItem } from '@/types/slide';
import type { Scene } from '@/types/scene';
import type { SlideScript } from '@/types/script';
import { calcSceneSteps, generateSceneStepLabels } from '@/types/scene';
import { findItemById } from '@/lib/flatten-items';

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
  // Project store — source of truth for slide data
  const slides = useProjectStore((s) => s.slides);
  const updateItem = useProjectStore((s) => s.updateItem);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);

  // Undo/redo state — for button disabled states
  const canUndo = useUndoRedoStore((s) => s.past.length > 0);
  const canRedo = useUndoRedoStore((s) => s.future.length > 0);

  // Initialize project store with demo data on first mount
  const setProject = useProjectStore((s) => s.setProject);
  useEffect(() => {
    // Only initialize if the store has no slides yet
    if (useProjectStore.getState().slides.length === 0) {
      setProject({
        id: 'demo-project',
        tenantId: 'demo-tenant',
        createdByUserId: 'demo-user',
        name: 'Demo Deck',
        script: '',
        intent: 'educational',
        slides: DEMO_SLIDES,
        voiceSettings: { voiceId: '', syncPoints: [] },
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [setProject]);

  const [scripts] = useState<SlideScript[]>(DEMO_SCRIPTS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showScenes, setShowScenes] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { collapsedSections, toggleSectionCollapse, showProperties, toggleProperties } = useEditorStore();

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

  const currentSlide = slides[currentSlideIndex] ?? null;
  const currentScript = currentSlide ? scripts.find((s) => s.slideId === currentSlide.id) : undefined;

  // Derive scenes directly from slide (all slides now define scenes natively)
  const scenes = useMemo(() => currentSlide?.scenes ?? [], [currentSlide]);
  const currentScene = scenes[currentSceneIndex] ?? scenes[0];

  // Calculate steps for the current scene
  const totalSteps = useMemo(() => (currentScene ? calcSceneSteps(currentScene) : 1), [currentScene]);

  // Build widget title map for step labels
  const widgetTitles = useMemo(() => (currentSlide ? buildWidgetTitleMap(currentSlide) : {}), [currentSlide]);

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
    setEditingItemId(null);
  }, []);

  const handleSceneSelect = useCallback((sceneIndex: number) => {
    setCurrentSceneIndex(sceneIndex);
    setCurrentStepIndex(0);
    setSelectedElementId(null);
    setEditingItemId(null);
  }, []);

  const handleStepSelect = useCallback((step: number) => {
    setCurrentStepIndex(step);
  }, []);

  // ---------------------------------------------------------------------------
  // Item editing handlers
  // ---------------------------------------------------------------------------

  const handleItemSelect = useCallback((itemId: string | null) => {
    setSelectedElementId(itemId);
    // End editing when selecting a different item or deselecting
    setEditingItemId((prev) => (itemId !== prev ? null : prev));
  }, []);

  const handleItemEditStart = useCallback((itemId: string) => {
    setEditingItemId(itemId);
    setSelectedElementId(itemId);
  }, []);

  const handleItemEditEnd = useCallback(() => {
    setEditingItemId(null);
  }, []);

  const handleItemUpdate = useCallback(
    (itemId: string, updates: Partial<SlideItem>) => {
      if (!currentSlide) return;
      updateItem(currentSlide.id, itemId, updates);
    },
    [currentSlide, updateItem],
  );

  // Resolve the selected item from the items tree for the properties panel
  const selectedItem = useMemo(() => {
    if (!selectedElementId || !currentSlide) return null;
    return findItemById(currentSlide.items, selectedElementId) ?? null;
  }, [selectedElementId, currentSlide]);

  // ---------------------------------------------------------------------------
  // Keyboard shortcuts
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: if editing, exit edit mode (InlineTextEditor handles its own Escape);
      // if an item is selected but not editing, deselect it.
      if (e.key === 'Escape') {
        if (editingItemId) {
          setEditingItemId(null);
        } else if (selectedElementId) {
          setSelectedElementId(null);
        }
      }

      // Undo/redo: skip when inline text editing is active (Tiptap handles
      // its own undo within the rich-text field).
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && !editingItemId) {
        // Undo: Ctrl+Z / Cmd+Z (without Shift)
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        // Redo: Ctrl+Y / Cmd+Y  OR  Ctrl+Shift+Z / Cmd+Shift+Z
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey) || (e.key === 'Z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingItemId, selectedElementId, undo, redo]);

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

  // Guard: wait for store initialisation
  if (!currentSlide || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
        Loading slides...
      </div>
    );
  }

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
          {/* Undo / Redo buttons */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="px-2 py-1.5 text-xs font-medium rounded-md border transition-colors bg-background text-foreground border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3L3 13"/></svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="px-2 py-1.5 text-xs font-medium rounded-md border transition-colors bg-background text-foreground border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.69 3L21 13"/></svg>
          </button>

          <div className="w-px h-5 bg-border mx-1" />

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
          <button
            onClick={toggleProperties}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showProperties
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            {showProperties ? 'Properties ON' : 'Properties OFF'}
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
                    <span className="text-[0.625rem] text-muted-foreground shrink-0">{entries.length}</span>
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
              allScenes={scenes}
              selectedElementId={selectedElementId}
              editingItemId={editingItemId}
              currentSubStep={currentSubStep}
              totalSteps={totalSteps}
              onElementSelect={handleItemSelect}
              onItemEditStart={handleItemEditStart}
              onItemEditEnd={handleItemEditEnd}
              onItemUpdate={handleItemUpdate}
              onSceneSelect={handleSceneSelect}
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
              isMenuNavigation={scenes.some((s) => s.activatedByWidgetIds && s.activatedByWidgetIds.length > 0)}
            />
          )}
        </div>

        {/* Right panel — item properties */}
        {showProperties && (
          <div className="w-64 lg:w-72 border-l bg-muted/20 overflow-y-auto shrink-0">
            <ItemPropertiesPanel
              item={selectedItem}
              onUpdate={handleItemUpdate}
            />
          </div>
        )}
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
