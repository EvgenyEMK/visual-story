'use client';

import { useState, useRef, useEffect } from 'react';
import type { Scene } from '@/types/scene';
import type { SlideScript } from '@/types/script';

type BottomPanelMode = 'steps' | 'script';

interface BottomPanelProps {
  /** Whether scenes mode is enabled (controls availability of steps tab). */
  showScenes: boolean;
  /** The active scene (undefined when no scene data). */
  currentScene?: Scene;
  /** Labels for each animation step. */
  stepLabels: string[];
  /** Current step index (0-based). */
  currentStep: number;
  /** Total steps in the current scene (including End state when present). */
  totalSteps: number;
  /** Callback when a step is selected. */
  onStepSelect: (step: number) => void;
  /** Whether an artificial "End state" step is prepended at index 0. */
  hasEndStateStep: boolean;
  /** Whether this slide uses menu/tab navigation (scenes as sub-slides). */
  isMenuNavigation: boolean;
  /** Structured script for the current slide. */
  script?: SlideScript;
  /** Currently selected element ID — highlights matching script section. */
  activeElementId?: string;
  /** Called when user clicks an element script entry (to sync selection). */
  onElementClick: (elementId: string) => void;
}

/**
 * Unified bottom panel combining Animation Steps and Script (presenter notes)
 * into a single horizontal bar with a mode switcher in the left corner.
 *
 * The left corner (aligned with the slide thumbnails sidebar) contains icon
 * buttons to toggle between "Animation Steps" and "Script" views.
 */
export function BottomPanel({
  showScenes,
  currentScene,
  stepLabels,
  currentStep,
  totalSteps,
  onStepSelect,
  hasEndStateStep,
  isMenuNavigation,
  script,
  activeElementId,
  onElementClick,
}: BottomPanelProps) {
  const [mode, setMode] = useState<BottomPanelMode>('steps');

  // When scenes are turned off or no scene is available, fall back to script
  useEffect(() => {
    if (mode === 'steps' && (!showScenes || !currentScene)) {
      setMode('script');
    }
  }, [showScenes, currentScene, mode]);

  const stepsAvailable = showScenes && !!currentScene;

  return (
    <div className="border-t bg-muted/10 flex shrink-0 h-44 lg:h-48">
      {/* Left corner — mode switcher aligned with sidebar width */}
      <div className="w-48 lg:w-56 border-r bg-muted/20 flex flex-col items-center justify-center gap-1 shrink-0">
        {/* Steps mode button */}
        <button
          onClick={() => stepsAvailable && setMode('steps')}
          disabled={!stepsAvailable}
          title="Animation Steps"
          className={`group relative flex items-center gap-2 w-[calc(100%-1rem)] px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
            mode === 'steps'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : stepsAvailable
                ? 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                : 'text-muted-foreground/40 cursor-not-allowed border border-transparent'
          }`}
        >
          {/* Layers/steps icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span className="truncate">Steps</span>
        </button>

        {/* Script mode button */}
        <button
          onClick={() => setMode('script')}
          title="Script (Presenter Notes)"
          className={`group relative flex items-center gap-2 w-[calc(100%-1rem)] px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
            mode === 'script'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
          }`}
        >
          {/* File-text / script icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <span className="truncate">Script</span>
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {mode === 'steps' && currentScene ? (
          <StepsContent
            currentScene={currentScene}
            stepLabels={stepLabels}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepSelect={onStepSelect}
            hasEndStateStep={hasEndStateStep}
            isMenuNavigation={isMenuNavigation}
          />
        ) : (
          <ScriptContent
            script={script}
            activeElementId={activeElementId}
            onElementClick={onElementClick}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps content (extracted from AnimationStepStrip)
// ---------------------------------------------------------------------------

function StepsContent({
  currentScene,
  stepLabels,
  currentStep,
  totalSteps,
  onStepSelect,
  hasEndStateStep,
  isMenuNavigation,
}: {
  currentScene: Scene;
  stepLabels: string[];
  currentStep: number;
  totalSteps: number;
  onStepSelect: (step: number) => void;
  hasEndStateStep: boolean;
  isMenuNavigation: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSequential = currentScene.widgetStateLayer.enterBehavior.revealMode === 'sequential';
  const stripLabel = isMenuNavigation ? 'Sub-slides' : 'Steps';
  const animationStepCount = hasEndStateStep ? totalSteps - 1 : totalSteps;

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStep]);

  return (
    <>
      {/* Compact header */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/20">
        <span className="text-[0.625rem] font-semibold text-muted-foreground shrink-0 uppercase tracking-wider">
          {stripLabel}
        </span>
        <span className="text-[0.625rem] text-muted-foreground shrink-0">
          {hasEndStateStep && currentStep === 0
            ? `End state · ${animationStepCount} steps`
            : `${hasEndStateStep ? currentStep : currentStep + 1} / ${animationStepCount}`}
        </span>
        <span className="text-[0.625rem] text-muted-foreground/60 shrink-0 ml-1">
          {currentScene.title}
          {isSequential ? ' · Sequential' : ' · All at once'}
        </span>
      </div>

      {/* Scrollable step thumbnails */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-2 px-3 overflow-x-auto scrollbar-thin"
      >
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isEndState = hasEndStateStep && i === 0;
          const isActive = i === currentStep;
          const isPast = i < currentStep;
          const label = stepLabels[i] ?? `Step ${i + 1}`;
          const animIdx = hasEndStateStep ? i - 1 : i;
          const widgetId = isSequential && !isEndState
            ? currentScene.widgetStateLayer.animatedWidgetIds[animIdx]
            : undefined;

          return (
            <button
              key={i}
              data-active={isActive}
              onClick={() => onStepSelect(i)}
              className={`shrink-0 rounded-lg border-2 transition-all overflow-hidden ${
                isEndState
                  ? isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-emerald-400/50 opacity-70 hover:opacity-100 hover:border-emerald-400'
                  : isActive
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : isPast
                      ? 'border-border/60 opacity-80 hover:opacity-100 hover:border-primary/40'
                      : 'border-border/40 opacity-50 hover:opacity-80 hover:border-border'
              }`}
              style={{ width: isEndState ? 100 : 140 }}
            >
              {/* Mini preview */}
              <div
                className={`relative w-full ${isEndState ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-white dark:bg-zinc-900'}`}
                style={{ aspectRatio: '16/9' }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  {isEndState ? (
                    <span className="text-[0.5rem] font-semibold text-emerald-600 dark:text-emerald-400 text-center leading-tight">
                      All visible
                    </span>
                  ) : (
                    <span className="text-[0.4375rem] text-muted-foreground text-center leading-tight">
                      {label}
                    </span>
                  )}
                </div>
                {!isEndState && (
                  <div className="absolute top-0.5 left-0.5 text-[0.375rem] font-bold text-muted-foreground/60">
                    {hasEndStateStep ? i : i + 1}
                  </div>
                )}
                {isSequential && !isEndState && (
                  <div className="absolute bottom-0.5 right-0.5 text-[0.375rem] text-muted-foreground/60">
                    {Math.min(animIdx + 1, currentScene.widgetStateLayer.animatedWidgetIds.length)}/
                    {currentScene.widgetStateLayer.animatedWidgetIds.length}
                  </div>
                )}
              </div>
              <div
                className={`px-1.5 py-1 text-[0.5rem] font-medium truncate border-t ${
                  isEndState
                    ? isActive
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600/70 dark:text-emerald-500/70'
                    : isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/30 text-muted-foreground'
                }`}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Script content (extracted from ScriptPanel)
// ---------------------------------------------------------------------------

function ScriptContent({
  script,
  activeElementId,
  onElementClick,
}: {
  script?: SlideScript;
  activeElementId?: string;
  onElementClick: (elementId: string) => void;
}) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeElementId]);

  if (!script) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        No script available for this slide.
      </div>
    );
  }

  return (
    <>
      {/* Compact header */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/20">
        <span className="text-[0.625rem] font-semibold text-muted-foreground shrink-0 uppercase tracking-wider">
          Script
        </span>
        <span className="text-[0.625rem] text-muted-foreground">
          {script.elements.length} element{script.elements.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable script content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {/* Opening script */}
        <div className="rounded-md border bg-background p-2.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[0.6875rem] font-semibold text-foreground">Opening</span>
          </div>
          <div className="pl-3.5 space-y-0.5">
            <p className="text-xs text-foreground leading-relaxed">
              {script.opening.text}
            </p>
            {script.opening.notes && (
              <p className="text-[0.625rem] text-muted-foreground italic leading-snug">
                <span className="font-medium not-italic text-muted-foreground/70">Notes: </span>
                {script.opening.notes}
              </p>
            )}
          </div>
        </div>

        {/* Per-element scripts */}
        {script.elements.map((entry) => {
          const isActive = entry.elementId === activeElementId;
          return (
            <div
              key={entry.elementId}
              ref={isActive ? activeRef : undefined}
              onClick={() => onElementClick(entry.elementId)}
              className={`rounded-md border p-2.5 cursor-pointer transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'bg-background hover:border-primary/30 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
                <span
                  className={`text-[0.6875rem] font-semibold ${
                    isActive ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {entry.label}
                </span>
                <span className="text-[0.5rem] text-muted-foreground/50 font-mono">
                  {entry.elementId}
                </span>
              </div>
              <div className="pl-3.5 space-y-0.5">
                <p className="text-xs text-foreground leading-relaxed">
                  {entry.script.text}
                </p>
                {entry.script.notes && (
                  <p className="text-[0.625rem] text-muted-foreground italic leading-snug">
                    <span className="font-medium not-italic text-muted-foreground/70">Notes: </span>
                    {entry.script.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
