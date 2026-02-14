/**
 * AI Script Feedback panel — displays score overview, category scores, and actionable suggestions.
 * @source docs/modules/ai-assistant/script-feedback.md
 */
'use client';

import { useState } from 'react';
import type {
  ScriptFeedbackResponse,
  FeedbackCategory,
  Suggestion,
} from '@/types/ai';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FeedbackPanelProps {
  feedback: ScriptFeedbackResponse | null;
  isLoading: boolean;
  onApplySuggestion: (suggestion: Suggestion) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  onViewInScript: (suggestion: Suggestion) => void;
  onRefresh: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Displays the overall feedback score with a radial ring. */
function ScoreOverview({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'text-green-500'
      : score >= 60
        ? 'text-yellow-500'
        : 'text-red-500';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Background ring */}
        <svg className="absolute inset-0" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={`${(score / 100) * 213.6} 213.6`}
            strokeLinecap="round"
            className={color}
            transform="rotate(-90 40 40)"
          />
        </svg>
        <span className="text-xl font-bold">{score}</span>
      </div>
      <span className="text-xs text-muted-foreground">Overall Score</span>
    </div>
  );
}

/** Renders horizontal bars for each feedback category. */
function CategoryScores({
  categoryScores,
}: {
  categoryScores: Record<FeedbackCategory, number>;
}) {
  const entries = Object.entries(categoryScores) as [FeedbackCategory, number][];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Category Scores</h4>
      {entries.map(([name, score]) => {
        const pct = score * 10;
        const needsImprovement = score <= 5;
        return (
          <div key={name} className="flex items-center gap-2 text-sm">
            <span className="w-24 shrink-0 capitalize">{name}</span>
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div
                className={`h-2 rounded-full transition-all ${
                  needsImprovement ? 'bg-yellow-500' : 'bg-primary'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs tabular-nums">
              {score}/10
            </span>
            {needsImprovement && (
              <span className="text-xs text-yellow-600">Needs work</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Renders the list of actionable suggestions with accept/dismiss controls. */
function SuggestionList({
  suggestions,
  onApply,
  onDismiss,
  onView,
}: {
  suggestions: Suggestion[];
  onApply: (s: Suggestion) => void;
  onDismiss: (id: string) => void;
  onView: (s: Suggestion) => void;
}) {
  const priorityColors: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  const priorityLabels: Record<string, string> = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Suggestions</h4>
      {suggestions.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No suggestions — your script looks great!
        </p>
      )}
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="rounded-lg border p-3 text-sm transition-colors hover:bg-muted/30"
        >
          {/* Header */}
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                priorityColors[suggestion.priority] ?? 'bg-gray-400'
              }`}
            />
            <span className="font-medium capitalize">
              {suggestion.category}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              {priorityLabels[suggestion.priority]}
            </span>
          </div>

          {/* Issue & suggestion text */}
          <p className="text-muted-foreground">{suggestion.issue}</p>
          <p className="mt-1">{suggestion.suggestion}</p>

          {/* Suggested rewrite preview */}
          {suggestion.replacementText && (
            <div className="mt-2 rounded border border-dashed border-green-300 bg-green-50 p-2 text-xs dark:border-green-800 dark:bg-green-950">
              <span className="font-medium">Suggested:</span>{' '}
              {suggestion.replacementText}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-2 flex gap-2">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => onView(suggestion)}
            >
              View in Script
            </Button>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => onApply(suggestion)}
            >
              Apply Suggestion
            </Button>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={() => onDismiss(suggestion.id)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function FeedbackPanel({
  feedback,
  isLoading,
  onApplySuggestion,
  onDismissSuggestion,
  onViewInScript,
  onRefresh,
}: FeedbackPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    onDismissSuggestion(id);
  };

  // --- Loading skeleton ---
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    );
  }

  // --- Empty state ---
  if (!feedback) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm text-muted-foreground">No feedback yet</p>
        <p className="text-xs text-muted-foreground">
          Click &quot;Get Feedback&quot; to analyze your script
        </p>
        <Button onClick={onRefresh}>Get Feedback</Button>
      </div>
    );
  }

  const visibleSuggestions = feedback.suggestions.filter(
    (s) => !dismissedIds.has(s.id),
  );

  return (
    <div className="space-y-6 p-4">
      <ScoreOverview score={feedback.overallScore} />
      <CategoryScores categoryScores={feedback.categoryScores} />
      <SuggestionList
        suggestions={visibleSuggestions}
        onApply={onApplySuggestion}
        onDismiss={handleDismiss}
        onView={onViewInScript}
      />
      <Button variant="outline" className="w-full" onClick={onRefresh}>
        Regenerate Feedback
      </Button>
    </div>
  );
}
