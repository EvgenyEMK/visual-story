'use client';

import { useRef, useEffect } from 'react';
import type { SlideScript } from '@/types/script';

interface ScriptPanelProps {
  script?: SlideScript;
  /** Currently selected element ID — highlights matching script section. */
  activeElementId?: string;
  /** Called when user clicks an element script entry (to sync selection). */
  onElementClick: (elementId: string) => void;
}

/**
 * Bottom panel showing the structured script for the current slide.
 * Displays: opening script + per-element scripts.
 * Each part has "text to say" and "notes" sections.
 *
 * Clicking an element script entry can sync with canvas selection (and vice-versa).
 */
export function ScriptPanel({
  script,
  activeElementId,
  onElementClick,
}: ScriptPanelProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the active element's script when selection changes
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeElementId]);

  if (!script) {
    return (
      <div className="h-40 border-t bg-muted/20 flex items-center justify-center text-sm text-muted-foreground">
        No script available for this slide.
      </div>
    );
  }

  return (
    <div className="h-52 lg:h-56 border-t bg-muted/10 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-1.5 border-b bg-muted/30">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Script
        </span>
        <span className="text-[0.625rem] text-muted-foreground">
          {script.elements.length} element{script.elements.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {/* Opening script */}
        <div className="rounded-lg border bg-background p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-foreground">Opening</span>
          </div>
          <div className="pl-4 space-y-1">
            <p className="text-sm text-foreground leading-relaxed">
              {script.opening.text}
            </p>
            {script.opening.notes && (
              <p className="text-[0.6875rem] text-muted-foreground italic leading-snug">
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
              className={`rounded-lg border p-3 cursor-pointer transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'bg-background hover:border-primary/30 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isActive ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    isActive ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {entry.label}
                </span>
                <span className="text-[0.5625rem] text-muted-foreground/50 font-mono">
                  {entry.elementId}
                </span>
              </div>
              <div className="pl-4 space-y-1">
                <p className="text-sm text-foreground leading-relaxed">
                  {entry.script.text}
                </p>
                {entry.script.notes && (
                  <p className="text-[0.6875rem] text-muted-foreground italic leading-snug">
                    <span className="font-medium not-italic text-muted-foreground/70">Notes: </span>
                    {entry.script.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
