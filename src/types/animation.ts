/**
 * Animation engine types — templates, transitions, auto-animation.
 *
 * @source docs/modules/animation-engine/animation-templates.md
 * @source docs/modules/animation-engine/auto-animation.md
 * @source docs/modules/animation-engine/transition-library.md
 */

import type { Slide, AnimationType, EasingType } from '@/types/slide';

// ---------------------------------------------------------------------------
// Animation Templates
// ---------------------------------------------------------------------------

/** Categories available in the template gallery. */
export type TemplateCategory =
  | 'minimal'
  | 'dynamic'
  | 'professional'
  | 'storytelling';

/**
 * A keyframe in an animation sequence.
 * @source docs/modules/animation-engine/animation-templates.md — Template Definition Schema
 */
export interface Keyframe {
  /** Offset within the animation (0–1). */
  offset: number;
  /** CSS/Remotion properties at this keyframe. */
  properties: Record<string, string | number>;
}

/**
 * Selector that targets specific elements on a slide for template application.
 * @source docs/modules/animation-engine/animation-templates.md — Template Definition Schema
 */
export interface ElementSelector {
  /** Target element type. */
  type?: 'text' | 'icon' | 'shape' | 'image';
  /** Target a specific element index (0-based). */
  index?: number;
  /** Match by a CSS-like role (e.g. "title", "body", "bullet"). */
  role?: string;
}

/**
 * A single animation step within a template — maps a selector to keyframes.
 * @source docs/modules/animation-engine/animation-templates.md — Template Definition Schema
 */
export interface AnimationSequence {
  /** Which elements this sequence targets. */
  selector: ElementSelector;
  /** Animation type to apply. */
  animation: AnimationType;
  /** Duration in seconds. */
  duration: number;
  /** Delay in seconds relative to slide start. */
  delay: number;
  /** Easing function. */
  easing: EasingType;
  /** Optional keyframe overrides. */
  keyframes?: Keyframe[];
}

/**
 * A complete animation template definition.
 * @source docs/modules/animation-engine/animation-templates.md — Template Definition Schema
 */
export interface AnimationTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  /** What content type this template works best for. */
  bestFor: string;
  /** Ordered list of animation sequences that make up this template. */
  sequences: AnimationSequence[];
  /** Default overall duration in seconds. */
  defaultDuration: number;
  /** Preview thumbnail or video URL. */
  previewUrl?: string;
}

// ---------------------------------------------------------------------------
// Transitions (slide-to-slide)
// ---------------------------------------------------------------------------

/** Available transition types between slides. */
export type TransitionType =
  | 'none'
  | 'fade'
  | 'fade-black'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'morph';

/** Easing function names available for transitions. */
export type EasingFunction =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring';

/**
 * Configuration for a slide-to-slide transition.
 * @source docs/modules/animation-engine/transition-library.md — Transition Schema
 */
export interface TransitionConfig {
  type: TransitionType;
  /** Duration in seconds (0.3–2). */
  duration: number;
  /** Easing for the transition curve. */
  easing: EasingFunction;
  /** Direction (for directional transitions). */
  direction?: 'left' | 'right' | 'up' | 'down';
}

/**
 * Config for the advanced morph transition.
 * Matches shared elements between consecutive slides and animates them.
 * @source docs/modules/animation-engine/transition-library.md — Morph Transition
 */
export interface MorphConfig {
  /** IDs of elements shared between the source and target slides. */
  sharedElementIds: string[];
  /** Duration of the morph animation in seconds. */
  duration: number;
  /** Easing function for the morph. */
  easing: EasingFunction;
}

// ---------------------------------------------------------------------------
// Auto-Animation — Content Analysis
// ---------------------------------------------------------------------------

/** Detected content types used by the auto-animation engine. */
export type ContentType =
  | 'title-only'
  | 'title-body'
  | 'bullet-list'
  | 'comparison'
  | 'process-flow'
  | 'feature-grid'
  | 'quote'
  | 'call-to-action';

/**
 * Result of AI content analysis on a slide's text.
 * @source docs/modules/animation-engine/auto-animation.md — Content Type Detection
 */
export interface ContentAnalysis {
  /** Detected content type. */
  contentType: ContentType;
  /** Number of text elements detected. */
  elementCount: number;
  /** Total word count in the slide. */
  wordCount: number;
  /** Detected sentiment/tone. */
  sentiment: 'neutral' | 'positive' | 'urgent' | 'emotional';
  /** Whether the slide has a dominant heading element. */
  hasTitle: boolean;
  /** Whether the slide contains a list/bullets. */
  hasBullets: boolean;
}

/**
 * A rule that maps content analysis results to a suitable template.
 * @source docs/modules/animation-engine/auto-animation.md — Template Matching Rules
 */
export interface MatchingRule {
  /** Content type(s) this rule applies to. */
  contentTypes: ContentType[];
  /** Content intent(s) this rule applies to. */
  intents: ('educational' | 'promotional' | 'storytelling')[];
  /** Template ID to select when this rule matches. */
  templateId: string;
  /** Priority — higher wins in case of multiple matches. */
  priority: number;
}

// ---------------------------------------------------------------------------
// Auto-Animation — API
// ---------------------------------------------------------------------------

/**
 * Request payload for the auto-generate endpoint.
 * @source docs/modules/animation-engine/auto-animation.md — API Endpoint
 */
export interface GenerateRequest {
  projectId: string;
  /** Override content intent (defaults to project intent). */
  intent?: 'educational' | 'promotional' | 'storytelling';
}

/**
 * A single generated slide returned by the auto-animation engine.
 * @source docs/modules/animation-engine/auto-animation.md — API Endpoint
 */
export interface GeneratedSlide {
  slideId: string;
  templateId: string;
  /** Calculated slide duration in milliseconds. */
  duration: number;
  /** Transition to use when entering this slide. */
  transition: TransitionConfig;
  /** Content analysis that informed template selection. */
  analysis: ContentAnalysis;
}

/**
 * Response from the auto-generate endpoint.
 * @source docs/modules/animation-engine/auto-animation.md — API Endpoint
 */
export interface GenerateResponse {
  slides: GeneratedSlide[];
  /** Total presentation duration in milliseconds. */
  totalDuration: number;
}
