// Extracted from docs/modules/animation-engine/auto-animation.md

import type { Slide } from '@/types/slide';
import type { ContentAnalysis, ContentType } from '@/types/animation';

/**
 * Internal rule shape for auto-animation template matching.
 * Maps a (contentType, intent) condition to candidate templates with weights.
 */
interface InternalMatchingRule {
  conditions: { contentType?: ContentType; intent?: string };
  templates: string[];
  weight: number;
}

/**
 * Template matching rules for auto-animation.
 * Each rule maps a (contentType, intent) condition to candidate templates with weights.
 * Higher weight = more likely to be selected.
 */
const templateMatchingRules: InternalMatchingRule[] = [
  // Promotional templates — energetic, attention-grabbing
  {
    conditions: { contentType: 'title-only', intent: 'promotional' },
    templates: ['scale-pop', 'bounce-in'],
    weight: 1.0,
  },
  {
    conditions: { contentType: 'call-to-action', intent: 'promotional' },
    templates: ['scale-pop', 'focus-zoom'],
    weight: 1.0,
  },
  {
    conditions: { contentType: 'feature-grid', intent: 'promotional' },
    templates: ['slide-scatter', 'bounce-in'],
    weight: 0.8,
  },

  // Educational templates — clear, structured
  {
    conditions: { contentType: 'bullet-list', intent: 'educational' },
    templates: ['slide-up', 'stack-build'],
    weight: 0.9,
  },
  {
    conditions: { contentType: 'process-flow', intent: 'educational' },
    templates: ['reveal-left', 'stack-build'],
    weight: 0.9,
  },
  {
    conditions: { contentType: 'title-body', intent: 'educational' },
    templates: ['fade-simple', 'corporate-fade'],
    weight: 0.8,
  },

  // Storytelling templates — cinematic, emotional
  {
    conditions: { contentType: 'quote', intent: 'storytelling' },
    templates: ['typewriter', 'cinematic-fade'],
    weight: 1.0,
  },
  {
    conditions: { contentType: 'title-only', intent: 'storytelling' },
    templates: ['cinematic-fade', 'focus-zoom'],
    weight: 0.9,
  },
  {
    conditions: { contentType: 'title-body', intent: 'storytelling' },
    templates: ['narrative-flow', 'cinematic-fade'],
    weight: 0.8,
  },

  // General/fallback rules
  {
    conditions: { contentType: 'comparison' },
    templates: ['slide-scatter', 'reveal-left'],
    weight: 0.7,
  },
  {
    conditions: { contentType: 'title-only' },
    templates: ['fade-simple', 'scale-pop'],
    weight: 0.5,
  },

  // TODO: Add more matching rules for additional content type + intent combinations
];

/**
 * Select the best animation template based on content analysis and intent.
 * Filters matching rules, scores candidates, and uses weighted random selection
 * from the top 3 for variety.
 *
 * @param analysis - Content analysis of the slide
 * @param intent - The project's content intent
 * @returns Template ID to use (falls back to 'fade-simple')
 */
export function selectTemplate(
  analysis: ContentAnalysis,
  intent: string
): string {
  const matchedRules = templateMatchingRules.filter((rule) =>
    matchesConditions(analysis, intent, rule.conditions)
  );

  const scored = matchedRules
    .flatMap((rule) =>
      rule.templates.map((t) => ({ template: t, score: rule.weight }))
    )
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return 'fade-simple';

  // Pick from top 3 with weighted randomness for variety
  const topTemplates = scored.slice(0, 3);
  return weightedRandom(topTemplates);
}

/**
 * Calculate slide duration based on content length and voice-over.
 * When voice-over duration is available, it takes precedence.
 * Otherwise, estimates from word count + element count.
 *
 * Rules:
 * - Minimum: 3 seconds
 * - Maximum: 30 seconds
 * - Base reading speed: 150 words per minute
 * - Animation overhead: 0.5s per element
 *
 * @param slide - The slide to calculate duration for
 * @param voiceOverDuration - Optional voice-over duration in seconds
 * @returns Duration in seconds, clamped to [3, 30]
 */
export function calculateDuration(
  slide: Slide,
  voiceOverDuration?: number
): number {
  if (voiceOverDuration) {
    return Math.max(voiceOverDuration, 3);
  }

  const wordCount = slide.elements.reduce(
    (acc, el) => acc + el.content.split(/\s+/).length,
    0
  );
  const elementCount = slide.elements.length;

  // Base: 150 words per minute reading speed
  const readingTime = (wordCount / 150) * 60;
  const animationTime = elementCount * 0.5;

  const total = readingTime + animationTime;
  return Math.min(Math.max(total, 3), 30);
}

/**
 * Check if a content analysis matches a rule's conditions.
 */
function matchesConditions(
  analysis: ContentAnalysis,
  intent: string,
  conditions: InternalMatchingRule['conditions']
): boolean {
  if (conditions.contentType && conditions.contentType !== analysis.contentType)
    return false;
  if (conditions.intent && conditions.intent !== intent) return false;
  return true;
}

/**
 * Select a template from a list using weighted random selection.
 */
function weightedRandom(
  items: { template: string; score: number }[]
): string {
  const totalWeight = items.reduce((acc, item) => acc + item.score, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.score;
    if (random <= 0) return item.template;
  }

  return items[0].template;
}
