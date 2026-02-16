/**
 * Animation template catalog for VisualFlow.
 *
 * Each entry corresponds to a row in the template library tables from the docs.
 * Full AnimationTemplate objects (with sequences/keyframes) are loaded at runtime.
 *
 * @source docs/modules/animation-engine/catalog.md
 */

import type { TemplateCategory } from '@/types/animation';

// ---------------------------------------------------------------------------
// Catalog Entry Type
// ---------------------------------------------------------------------------

/** Lightweight catalog entry used in the template gallery UI. */
export interface TemplateCatalogEntry {
  /** Unique template slug (e.g. "fade-simple"). */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Short description of the animation effect. */
  description: string;
  /** Category grouping. */
  category: TemplateCategory;
  /** What type of content this template works best for. */
  bestFor: string;
}

// ---------------------------------------------------------------------------
// Template Catalog
// ---------------------------------------------------------------------------

/**
 * MVP animation template catalog.
 * @source docs/modules/animation-engine/element-animations/README.md
 */
export const ANIMATION_TEMPLATE_CATALOG: readonly TemplateCatalogEntry[] = [
  // ── Minimal ──────────────────────────────────────────────────────────────
  {
    id: 'fade-simple',
    name: 'Fade Simple',
    description: 'Elements fade in sequentially',
    category: 'minimal',
    bestFor: 'Clean, professional content',
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    description: 'Elements slide up from bottom',
    category: 'minimal',
    bestFor: 'Lists, bullet points',
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    description: 'Text appears character by character',
    category: 'minimal',
    bestFor: 'Quotes, emphasis',
  },

  // ── Dynamic ──────────────────────────────────────────────────────────────
  {
    id: 'bounce-in',
    name: 'Bounce In',
    description: 'Elements bounce into position',
    category: 'dynamic',
    bestFor: 'Energetic, fun content',
  },
  {
    id: 'scale-pop',
    name: 'Scale Pop',
    description: 'Elements scale from 0 with overshoot',
    category: 'dynamic',
    bestFor: 'Announcements, highlights',
  },
  {
    id: 'slide-scatter',
    name: 'Slide Scatter',
    description: 'Elements slide in from different directions',
    category: 'dynamic',
    bestFor: 'Complex diagrams',
  },

  // ── Professional ─────────────────────────────────────────────────────────
  {
    id: 'corporate-fade',
    name: 'Corporate Fade',
    description: 'Subtle fade with slight movement',
    category: 'professional',
    bestFor: 'Business presentations',
  },
  {
    id: 'reveal-left',
    name: 'Reveal Left',
    description: 'Content reveals from left to right',
    category: 'professional',
    bestFor: 'Process flows',
  },
  {
    id: 'stack-build',
    name: 'Stack Build',
    description: 'Elements stack vertically with timing',
    category: 'professional',
    bestFor: 'Hierarchies, lists',
  },

  // ── Storytelling ─────────────────────────────────────────────────────────
  {
    id: 'cinematic-fade',
    name: 'Cinematic Fade',
    description: 'Slow, dramatic fades',
    category: 'storytelling',
    bestFor: 'Emotional content',
  },
  {
    id: 'focus-zoom',
    name: 'Focus Zoom',
    description: 'Zoom into key element',
    category: 'storytelling',
    bestFor: 'Emphasis, callouts',
  },
  {
    id: 'narrative-flow',
    name: 'Narrative Flow',
    description: 'Connected element transitions',
    category: 'storytelling',
    bestFor: 'Story sequences',
  },
] as const satisfies readonly TemplateCatalogEntry[];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All template categories in display order. */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'minimal',
  'dynamic',
  'professional',
  'storytelling',
];

/** Look up a catalog entry by ID. */
export function getTemplateCatalogEntry(
  id: string,
): TemplateCatalogEntry | undefined {
  return ANIMATION_TEMPLATE_CATALOG.find((t) => t.id === id);
}

/** Get all catalog entries for a given category. */
export function getTemplatesByCategory(
  category: TemplateCategory,
): TemplateCatalogEntry[] {
  return ANIMATION_TEMPLATE_CATALOG.filter((t) => t.category === category);
}
