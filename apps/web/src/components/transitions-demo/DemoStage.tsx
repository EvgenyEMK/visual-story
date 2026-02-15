'use client';

import { useCallback, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ThemeMode = 'dark' | 'light';
export type TriggerMode = 'auto' | 'click';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Simple hook to re-trigger CSS animations by changing a key. */
export function useReplay() {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);
  return { key, replay };
}

/** Stepped animation hook — advances `step` from 0..totalSteps on a timer. */
export function useSteppedAnimation(totalSteps: number, stepDurationMs: number) {
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => {
    setStep(0);
    setRunId((r) => r + 1);
  }, []);

  useEffect(() => {
    if (step >= totalSteps) return;
    const t = setTimeout(() => setStep((s) => s + 1), stepDurationMs);
    return () => clearTimeout(t);
  }, [step, totalSteps, stepDurationMs, runId]);

  return { step, replay, runId };
}

// ---------------------------------------------------------------------------
// DemoStage Component
// ---------------------------------------------------------------------------

interface DemoStageProps {
  /** Index number displayed as a badge (e.g. 1–10). */
  index: number;
  /** Animation title. */
  title: string;
  /** Short description of how the animation works. */
  description: string;
  /** Why this animation is effective (storytelling value). */
  whyGreat?: string;
  /** Category badge label. */
  category?: string;
  /** Replay callback. */
  onReplay: () => void;
  /** The animated content rendered inside the dark stage. */
  children: React.ReactNode;
  /** Optional extra class on the stage area. */
  stageClassName?: string;
  /** Theme mode for the stage background (default: 'dark'). */
  themeMode?: ThemeMode;
  /** Click handler for the stage area (used in click trigger mode). */
  onStageClick?: () => void;
  /** Keyboard handler for the stage area (arrow keys, etc.). */
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function DemoStage({
  index,
  title,
  description,
  whyGreat,
  category,
  onReplay,
  children,
  stageClassName,
  themeMode = 'dark',
  onStageClick,
  onKeyDown,
}: DemoStageProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden group">
      {/* Stage Area */}
      <div
        data-demo-theme={themeMode}
        className={`aspect-video relative overflow-hidden flex items-center justify-center ${onStageClick ? 'cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-inset' : ''} ${stageClassName ?? ''}`}
        style={{ backgroundColor: themeMode === 'dark' ? '#0f172a' : '#ffffff' }}
        onClick={onStageClick}
        onKeyDown={onKeyDown}
        tabIndex={onStageClick ? 0 : undefined}
      >
        {children}

        {/* Replay button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplay();
          }}
          className="demo-replay-btn absolute top-3 right-3 z-30 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          title="Replay animation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info Area */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              {index}
            </span>
            <h3 className="font-semibold text-sm leading-tight">{title}</h3>
          </div>
          {category && (
            <Badge variant="secondary" className="text-[0.625rem] shrink-0">
              {category}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
        {whyGreat && (
          <p className="text-xs text-blue-500 dark:text-blue-400 italic leading-relaxed">
            {whyGreat}
          </p>
        )}
      </div>
    </div>
  );
}
