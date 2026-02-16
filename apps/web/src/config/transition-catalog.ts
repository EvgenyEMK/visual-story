/**
 * Complete catalog of all visual transitions and animations for VisualFlow.
 *
 * Three categories:
 * 1. In-Slide Animations (element-level) — 10 templates
 * 2. Slide-to-Slide Transitions — 5 templates
 * 3. Grouped Item Animations — 10 templates
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TransitionCatalogCategory =
  | 'in-slide'
  | 'slide-transition'
  | 'grouped-item';

export interface TransitionCatalogEntry {
  id: string;
  index: number;
  name: string;
  description: string;
  whyGreat: string;
  category: TransitionCatalogCategory;
  bestFor: string;
}

// ---------------------------------------------------------------------------
// In-Slide Animations (Element Level)
// ---------------------------------------------------------------------------

export const IN_SLIDE_ANIMATIONS: readonly TransitionCatalogEntry[] = [
  {
    id: 'smooth-fade',
    index: 1,
    name: 'The Smooth Fade',
    description:
      'Elements gradually appear from 0% to 100% opacity.',
    whyGreat:
      'The "gold standard." Least distracting way to reveal information in sync with a voice-over.',
    category: 'in-slide',
    bestFor: 'Clean, professional content',
  },
  {
    id: 'staggered-wipe',
    index: 2,
    name: 'Staggered Wipe',
    description:
      'Text or bars reveal from one direction (usually left-to-right).',
    whyGreat:
      'Perfect for Data Visualization. Mimics the way we read, making numbers feel like they are "growing."',
    category: 'in-slide',
    bestFor: 'Charts, statistics, progress bars',
  },
  {
    id: 'float-in',
    index: 3,
    name: 'Float In (Gentle)',
    description:
      'Elements move slightly upward while fading in.',
    whyGreat:
      'Adds a sense of elegance and lightness. Feels more "premium" than a standard fly-in.',
    category: 'in-slide',
    bestFor: 'Feature cards, testimonials',
  },
  {
    id: 'pulse-emphasis',
    index: 4,
    name: 'The Pulse (Emphasis)',
    description:
      'An element grows 5–10% in size and then shrinks back.',
    whyGreat:
      'Draws the eye to exactly what the AI voice is talking about right now.',
    category: 'in-slide',
    bestFor: 'Key metrics, stats, callouts',
  },
  {
    id: 'typewriter-reveal',
    index: 5,
    name: 'Typewriter Reveal',
    description:
      'Characters appear one by one as if being typed.',
    whyGreat:
      'Forces the audience to read at the pace of the speaker. Highly engaging for Quotes.',
    category: 'in-slide',
    bestFor: 'Quotes, problem statements',
  },
  {
    id: 'pop-zoom',
    index: 6,
    name: 'The "Pop" (Zoom)',
    description:
      'An icon scales up from 0% with a slight "overshoot" bounce.',
    whyGreat:
      'Creates a moment of high energy and "arrival." Best for Feature Highlights.',
    category: 'in-slide',
    bestFor: 'Feature highlights, announcements',
  },
  {
    id: 'path-follow',
    index: 7,
    name: 'Path Follow (Lines)',
    description:
      'An arrow or line "draws itself" along a path.',
    whyGreat:
      'Essential for Process Flows. Visually connects Point A to Point B as the story progresses.',
    category: 'in-slide',
    bestFor: 'Process flows, connections, timelines',
  },
  {
    id: 'color-shift',
    index: 8,
    name: 'Color Shift',
    description:
      'A grayed-out icon turns into full brand color.',
    whyGreat:
      'Perfect for "Before vs. After" scenarios. Signals that a solution has been activated.',
    category: 'in-slide',
    bestFor: 'Before/after, feature activation',
  },
  {
    id: 'masked-reveal',
    index: 9,
    name: 'Masked Reveal',
    description:
      'An image appears from behind an invisible "curtain."',
    whyGreat:
      'Creates a sophisticated, professional look used in high-end Apple-style keynotes.',
    category: 'in-slide',
    bestFor: 'Product images, hero visuals',
  },
  {
    id: 'shimmer',
    index: 10,
    name: 'The Shimmer',
    description:
      'A subtle light streak passes over a button or key word.',
    whyGreat:
      'A "call to action" animation. Says "Look here" without moving the element.',
    category: 'in-slide',
    bestFor: 'CTAs, buttons, key terms',
  },
  {
    id: 'slide-title',
    index: 11,
    name: 'Slide Title',
    description:
      'A structured slide header with title, optional subtitle, and an optional right-side status/legend area.',
    whyGreat:
      'Provides consistent, professional slide framing — anchoring content with clear hierarchy.',
    category: 'in-slide',
    bestFor: 'Slide headers, section openers',
  },
  {
    id: 'zoom-in-word',
    index: 12,
    name: 'Zoom-In Word Reveal',
    description:
      'Text appears word by word, each zooming in from behind (small → full size) creating a dramatic reveal.',
    whyGreat:
      'Creates cinematic impact for section openers. The zoom adds weight to each word, making the audience feel the gravity of the statement.',
    category: 'in-slide',
    bestFor: 'Section openers, dramatic statements, topic titles',
  },
] as const;

// ---------------------------------------------------------------------------
// Slide-to-Slide Transitions
// ---------------------------------------------------------------------------

export const SLIDE_TRANSITIONS: readonly TransitionCatalogEntry[] = [
  {
    id: 'morph-smart-move',
    index: 1,
    name: 'The "Morph" (Smart Move)',
    description:
      'If an icon exists on both slides, it glides to its new position instead of disappearing.',
    whyGreat:
      'Creates "visual continuity," making the deck feel like one long scene.',
    category: 'slide-transition',
    bestFor: 'Continuous narratives',
  },
  {
    id: 'push-directional',
    index: 2,
    name: 'The Push (Directional)',
    description:
      'Slide A pushes Slide B in from the side.',
    whyGreat:
      'Implies a Timeline or Progress. Pushing "Right" = moving forward; "Down" = deep dive.',
    category: 'slide-transition',
    bestFor: 'Timelines, progress sequences',
  },
  {
    id: 'pan-cinematic',
    index: 3,
    name: 'The Pan (Cinematic)',
    description:
      'Similar to a camera moving across a large canvas.',
    whyGreat:
      'Makes the presentation feel larger than the screen, as if touring a "Map of Ideas."',
    category: 'slide-transition',
    bestFor: 'Landscape overviews, concept maps',
  },
  {
    id: 'zoom-focus',
    index: 4,
    name: 'The Zoom (Focus)',
    description:
      'The camera dives into a detail on Slide 1, which expands to become Slide 2.',
    whyGreat:
      'The ultimate way to show "The Big Picture" vs. "The Details."',
    category: 'slide-transition',
    bestFor: 'Detail drill-downs, big-picture → detail',
  },
  {
    id: 'cross-fade',
    index: 5,
    name: 'The Cross-Fade',
    description:
      'A simple, elegant blend between slides.',
    whyGreat:
      'The "reset button." Use it when switching to a completely new chapter of the story.',
    category: 'slide-transition',
    bestFor: 'Chapter changes, topic shifts',
  },
] as const;

// ---------------------------------------------------------------------------
// Grouped Item Animations
// ---------------------------------------------------------------------------

export const GROUPED_ANIMATIONS: readonly TransitionCatalogEntry[] = [
  {
    id: 'list-accumulator',
    index: 1,
    name: 'The "List Accumulator"',
    description:
      'Item appears as hero in center, then glides to a growing sidebar list. Next item takes center stage.',
    whyGreat:
      'Shows progress (growing list) while maintaining focus on the current hero item.',
    category: 'grouped-item',
    bestFor: 'Feature lists, agenda items',
  },
  {
    id: 'carousel-focus',
    index: 2,
    name: 'The "Carousel Focus"',
    description:
      'Items sit in a shelf at the bottom. One lifts up, grows, and gains color in center stage.',
    whyGreat:
      'A "Shelf" of options with a dynamic "Stage" — great for browsing through features.',
    category: 'grouped-item',
    bestFor: 'Product features, plan comparisons',
  },
  {
    id: 'bento-grid-expansion',
    index: 3,
    name: 'The "Bento Grid Expansion"',
    description:
      'A grid of equal boxes. One expands to fill 70% of the space while others stack aside.',
    whyGreat:
      'Modular, modern grid that feels organized and structural.',
    category: 'grouped-item',
    bestFor: 'Feature grids, dashboards',
  },
  {
    id: 'circular-satellite',
    index: 4,
    name: 'The "Circular Satellite"',
    description:
      'Satellites emerge from a core icon and orbit to their positions around it.',
    whyGreat:
      'A "Sun and Planets" map that builds a complete ecosystem of ideas.',
    category: 'grouped-item',
    bestFor: 'Ecosystem diagrams, related concepts',
  },
  {
    id: 'infinite-path',
    index: 5,
    name: 'The "Infinite Path"',
    description:
      'Items assemble on a horizontal road, then the road scrolls to reveal the next stop.',
    whyGreat:
      'Implies chronological or logical progression — a continuous journey.',
    category: 'grouped-item',
    bestFor: 'Timelines, roadmaps, step-by-step',
  },
  {
    id: 'stack-reveal',
    index: 6,
    name: 'The "Stack Reveal"',
    description:
      'A stack of cards in perspective. The top card flies toward the camera, then away.',
    whyGreat:
      'A 3D-depth layout that feels tactile and high-energy.',
    category: 'grouped-item',
    bestFor: 'Testimonials, card-based content',
  },
  {
    id: 'fan-out',
    index: 7,
    name: 'The "Fan-Out"',
    description:
      'A single icon splits into 3–5 items fanning out in an arc, like a hand of cards.',
    whyGreat:
      'Ideal for showing a "Suite" of features from a single concept.',
    category: 'grouped-item',
    bestFor: 'Feature suites, tool collections',
  },
  {
    id: 'molecular-bond',
    index: 8,
    name: 'The "Molecular Bond"',
    description:
      'Child bubbles bud out from a central bubble, connected by growing lines.',
    whyGreat:
      'An organic, growing "Mind Map" that visualizes interconnected ideas.',
    category: 'grouped-item',
    bestFor: 'Mind maps, concept relationships',
  },
  {
    id: 'perspective-pivot',
    index: 9,
    name: 'The "Perspective Pivot"',
    description:
      'A 3D cube rotates to reveal different content on each face.',
    whyGreat:
      'Clean, geometric center-stage focus that feels "high-tech."',
    category: 'grouped-item',
    bestFor: 'Multi-faceted concepts, comparisons',
  },
  {
    id: 'magnifying-glass',
    index: 10,
    name: 'The "Magnifying Glass"',
    description:
      'A lens moves over a blurred canvas, enlarging and clarifying items beneath it.',
    whyGreat:
      'A "Big Picture" canvas where the audience always knows their position in the overall map.',
    category: 'grouped-item',
    bestFor: 'Complex diagrams, overview + detail',
  },
  {
    id: 'items-grid',
    index: 11,
    name: 'Items Grid (Row / Column)',
    description:
      'A configurable grid of 2–8 items arranged in rows/columns. Each item is an icon with optional text or a short title with subtitle. Multiple animation modes: one-by-one reveal, opacity highlight, and optional callout boxes.',
    whyGreat:
      'The perfect "structure overview" slide — introduces topics, features, or agenda items with clear visual hierarchy before diving into details.',
    category: 'grouped-item',
    bestFor: 'Section overviews, topic structure, feature introductions',
  },
] as const;

// ---------------------------------------------------------------------------
// Combined catalog
// ---------------------------------------------------------------------------

export const FULL_TRANSITION_CATALOG: readonly TransitionCatalogEntry[] = [
  ...IN_SLIDE_ANIMATIONS,
  ...SLIDE_TRANSITIONS,
  ...GROUPED_ANIMATIONS,
] as const;

/** Look up a catalog entry by ID. */
export function getTransitionEntry(
  id: string,
): TransitionCatalogEntry | undefined {
  return FULL_TRANSITION_CATALOG.find((t) => t.id === id);
}
