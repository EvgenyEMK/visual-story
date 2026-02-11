'use client';

import { useCallback, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
}: DemoStageProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden group">
      {/* Stage Area */}
      <div
        className={`aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center ${stageClassName ?? ''}`}
      >
        {children}

        {/* Replay button overlay */}
        <button
          onClick={onReplay}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
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
            <Badge variant="secondary" className="text-[10px] shrink-0">
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
