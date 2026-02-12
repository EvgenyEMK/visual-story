/**
 * Structured script types for VisualStory.
 *
 * Each slide has an overall opening script and per-element scripts.
 * Each script part contains "text to say" (for voice-over) and
 * "notes" (for offline reading or AI content generation context).
 */

// ---------------------------------------------------------------------------
// Script Parts
// ---------------------------------------------------------------------------

/** A single script segment with spoken text and contextual notes. */
export interface ScriptPart {
  /** The text intended to be spoken (voice-over). */
  text: string;
  /** Additional notes for context — used for offline reading or AI generation. */
  notes: string;
}

/** Script for a specific element within a slide. */
export interface ElementScript {
  /** ID of the slide element this script maps to. */
  elementId: string;
  /** Human-readable label (derived from element content or grouped item title). */
  label: string;
  /** The script part for this element. */
  script: ScriptPart;
}

// ---------------------------------------------------------------------------
// Slide Script
// ---------------------------------------------------------------------------

/** Complete script for a single slide, including opening and per-element parts. */
export interface SlideScript {
  /** The slide ID this script belongs to. */
  slideId: string;
  /** Opening script — sets the stage for the slide before element-level scripts. */
  opening: ScriptPart;
  /** Per-element scripts in presentation order. */
  elements: ElementScript[];
}
