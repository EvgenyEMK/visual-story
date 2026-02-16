/**
 * Scene & Widget State Layer types for VisualFlow.
 *
 * Scenes are the content-level children of a Slide. Each Scene represents
 * a meaningful narrative unit that the presenter walks through.
 *
 * Widget State Layers define how widgets behave within a scene:
 * enter/exit animations, interaction behaviors, and visual states.
 *
 * @source docs/product-summary/ux-requirements-scenes.md
 * @source docs/technical-architecture/adr-001-scenes-widget-state-layers.md
 */

import type { TriggerMode, AnimationType, EasingType } from '@/types/slide';

// ---------------------------------------------------------------------------
// Widget Visual State
// ---------------------------------------------------------------------------

/**
 * Display mode for a widget within a scene.
 * Extensible — new states can be added without structural changes.
 */
export type WidgetDisplayMode =
  | 'normal'     // Default compact display
  | 'expanded'   // Full detail view (e.g., smart card expanded)
  | 'minimized'  // Collapsed/icon-only (post-MVP)
  | 'hidden';    // Not visible in this scene

/**
 * The visual state of a single widget at a point in time within a scene.
 */
export interface WidgetVisualState {
  /** Reference to the widget/item ID on the parent Slide. */
  widgetId: string;
  /** Whether the widget is visible at this point. */
  visible: boolean;
  /** Whether the widget has input focus / visual emphasis. */
  isFocused: boolean;
  /** Current display mode. */
  displayMode: WidgetDisplayMode;
}

// ---------------------------------------------------------------------------
// Widget Behavior — Enter / Exit / Interaction
// ---------------------------------------------------------------------------

/**
 * How a group of widgets enters/exits the scene.
 *
 * - 'all-at-once': All widgets animate in simultaneously (with optional stagger).
 *   Produces 1 animation step.
 * - 'sequential': Widgets animate one-by-one, each triggered by an event.
 *   Produces N animation steps (one per widget).
 */
export type RevealMode = 'all-at-once' | 'sequential';

/**
 * Describes how widgets animate into or out of a scene.
 */
export interface AnimationBehavior {
  /** How widgets are grouped for animation. */
  revealMode: RevealMode;
  /** The animation type applied to each widget. */
  animationType: AnimationType;
  /** Duration of each widget's animation in seconds. */
  duration: number;
  /** Easing function. */
  easing: EasingType;
  /**
   * Stagger delay between widgets in seconds.
   * For 'all-at-once': delay between each widget's start.
   * For 'sequential': ignored (event-driven timing).
   */
  staggerDelay?: number;
  /** What triggers advancement to the next widget (for 'sequential' mode). */
  triggerMode?: TriggerMode;
  /** Auto-mode: time between steps in ms (for 'sequential' + 'auto' trigger). */
  stepDuration?: number;
  /**
   * When true and `revealMode` is `'sequential'`, an overview step is
   * prepended where all widgets are visible but none are focused/expanded.
   *
   * Step 0 = overview, Steps 1..N = widget 0..N-1 focused.
   * Combine with `exitBehavior` on the parent layer to add a final
   * return-to-overview step at the end (total = 1 + N + 1).
   */
  includeOverviewStep?: boolean;
}

/**
 * Defines interactive behavior for a widget within a scene.
 * These are NOT animation steps — they are user-triggered reactions.
 */
export interface InteractionBehavior {
  /** What user action triggers this behavior. */
  trigger: 'click' | 'hover';
  /** What happens to the widget when triggered. */
  action: 'expand' | 'collapse' | 'toggle-expand' | 'show-detail' | 'highlight';
  /** Target display mode after the interaction. */
  targetDisplayMode?: WidgetDisplayMode;
  /** Whether only one widget can be in this state at a time (auto-collapse others). */
  exclusive?: boolean;
  /**
   * Whether this interaction is available during auto-present mode.
   * Default: false (only available in click/manual mode).
   */
  availableInAutoMode?: boolean;
}

// ---------------------------------------------------------------------------
// Widget State Layer
// ---------------------------------------------------------------------------

/**
 * The Widget State Layer defines all animation and interaction behavior
 * for widgets within a Scene. This is the "how" to the Scene's "what."
 *
 * Changing the layer does NOT change the scene's content structure.
 * This separation ensures robustness when users change animation config.
 */
export interface WidgetStateLayer {
  /**
   * Initial visual states for all widgets when the scene begins.
   * Widgets not listed here inherit their state from the previous scene
   * (or default to visible + normal).
   */
  initialStates: WidgetVisualState[];

  /** How widgets animate into this scene (enter animation). */
  enterBehavior: AnimationBehavior;

  /**
   * How widgets animate out when leaving this scene (exit animation).
   * Optional — if omitted, the exit is instant.
   * Exit is almost always 'all-at-once' in practice.
   */
  exitBehavior?: AnimationBehavior;

  /**
   * Interactive behaviors available on widgets during this scene.
   * These are NOT animation steps — they are user-triggered widget reactions.
   * Example: "click to expand smart card and show details"
   */
  interactionBehaviors: InteractionBehavior[];

  /**
   * IDs of widgets that participate in this scene's animation steps.
   * Order determines the reveal/focus sequence for 'sequential' mode.
   * For 'all-at-once' mode, all listed widgets animate together.
   */
  animatedWidgetIds: string[];
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

/**
 * A Scene is a content-level child of a Slide. It represents a meaningful
 * narrative unit (e.g., "Overview", "Detail View", "Summary").
 *
 * Scenes are auto-generated from slide/widget templates and maintained
 * automatically. Users adjust configuration via options or AI prompts.
 *
 * All scenes within a slide share the same canvas background/layout (MVP).
 * Widgets are owned by the Slide — scenes configure widget visibility/state.
 */
export interface Scene {
  /** Unique identifier. */
  id: string;

  /** Display title shown in the vertical sidebar. */
  title: string;

  /** Optional icon or emoji. */
  icon?: string;

  /** Optional description (shown as tooltip or subtitle). */
  description?: string;

  /** Order within the parent slide (0-based). */
  order: number;

  /**
   * The widget state layer controlling animation and interaction
   * behavior for this scene.
   */
  widgetStateLayer: WidgetStateLayer;

  /**
   * Override trigger mode for this scene.
   * Inherits from slide/project if unset.
   */
  triggerMode?: TriggerMode;

  /**
   * Duration of this scene in milliseconds (for auto-play).
   * If not set, calculated from widget state layer + step durations.
   */
  duration?: number;

  /**
   * Widget IDs that activate this scene when clicked in presentation mode.
   *
   * Used for **menu / tab navigation**: clicking a menu item (identified by
   * its widget ID) jumps directly to this scene, enabling non-linear
   * navigation within a slide.
   *
   * When absent, the scene is reached only via linear step advancement.
   */
  activatedByWidgetIds?: string[];
}

// ---------------------------------------------------------------------------
// Section (Organizational Hierarchy)
// ---------------------------------------------------------------------------

/**
 * A section groups slides in the vertical sidebar.
 * Supports up to 3 nesting levels: root → section → sub-section.
 */
export interface SlideSection {
  /** Unique identifier. */
  id: string;

  /** Display title. */
  title: string;

  /** Optional icon or emoji. */
  icon?: string;

  /** Whether this section is collapsed in the sidebar UI. */
  collapsed?: boolean;

  /** Child sections (sub-sections). Maximum 1 level of nesting. */
  children?: SlideSection[];

  /** IDs of slides belonging to this section (in order). */
  slideIds: string[];
}

// ---------------------------------------------------------------------------
// Helpers — Scene Step Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the total number of animation steps for a scene.
 *
 * - 'all-at-once' enter = 1 step
 * - 'sequential' enter = N steps (one per animated widget)
 * - When `includeOverviewStep` is true, +1 overview step at the start
 * - Exit is always 1 step (or 0 if no exit behavior)
 */
export function calcSceneSteps(scene: Scene): number {
  const { enterBehavior, exitBehavior, animatedWidgetIds } = scene.widgetStateLayer;

  let enterSteps: number;
  if (enterBehavior.revealMode === 'all-at-once') {
    enterSteps = animatedWidgetIds.length > 0 ? 1 : 0;
  } else {
    enterSteps = animatedWidgetIds.length;
  }

  // Overview step prepended when flag is set (sequential mode only)
  if (enterBehavior.includeOverviewStep && enterBehavior.revealMode === 'sequential') {
    enterSteps += 1;
  }

  const exitSteps = exitBehavior ? 1 : 0;

  return Math.max(enterSteps + exitSteps, 1);
}

/**
 * Generate labels for animation steps within a scene.
 *
 * @param scene The scene to generate labels for
 * @param widgetTitles Map of widget IDs to their display titles
 */
export function generateSceneStepLabels(
  scene: Scene,
  widgetTitles: Record<string, string>,
): string[] {
  const { enterBehavior, exitBehavior, animatedWidgetIds } = scene.widgetStateLayer;
  const labels: string[] = [];

  if (enterBehavior.revealMode === 'all-at-once') {
    if (animatedWidgetIds.length > 0) {
      labels.push(scene.title || 'Enter');
    }
  } else {
    // Overview step at the start when flag is set
    if (enterBehavior.includeOverviewStep) {
      labels.push('Overview');
    }
    // Sequential: one label per widget
    for (const widgetId of animatedWidgetIds) {
      labels.push(widgetTitles[widgetId] ?? `Widget ${widgetId}`);
    }
  }

  if (exitBehavior) {
    labels.push('Exit');
  }

  // Ensure at least one label
  if (labels.length === 0) {
    labels.push(scene.title || 'Scene');
  }

  return labels;
}
