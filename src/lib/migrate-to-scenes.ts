/**
 * Migration helper: converts legacy GroupedAnimationConfig to the
 * Scenes + Widget State Layers model.
 *
 * Used during the transition period. Once all data is migrated,
 * this file can be removed.
 *
 * @source docs/technical-architecture/adr-001-scenes-widget-state-layers.md
 */

import type { Slide } from '@/types/slide';
import type { GroupedAnimationConfig, GroupedItem } from '@/types/animation';
import type {
  Scene,
  WidgetStateLayer,
  WidgetVisualState,
  AnimationBehavior,
  InteractionBehavior,
  RevealMode,
} from '@/types/scene';
import type { AnimationType, EasingType, TriggerMode } from '@/types/slide';
import { flattenItemsAsElements } from '@/lib/flatten-items';

// ---------------------------------------------------------------------------
// Main migration function
// ---------------------------------------------------------------------------

/**
 * Convert a slide's `groupedAnimation` config into the new `scenes` array.
 * Returns the scenes array, or an empty array if no migration is needed.
 */
export function migrateGroupedToScenes(slide: Slide): Scene[] {
  // Already has scenes — no migration needed
  if (slide.scenes && slide.scenes.length > 0) {
    return slide.scenes;
  }

  // No grouped animation — create a single default scene
  if (!slide.groupedAnimation) {
    return createDefaultScenes(slide);
  }

  const group = slide.groupedAnimation;

  // Route to specific migration strategy
  switch (group.type) {
    case 'card-expand':
      return migrateCardExpand(slide, group);

    case 'items-grid':
      return migrateItemsGrid(slide, group);

    case 'list-accumulator':
    case 'carousel-focus':
    case 'stack-reveal':
    case 'fan-out':
      return migrateSequentialGroup(slide, group);

    default:
      return migrateSequentialGroup(slide, group);
  }
}

// ---------------------------------------------------------------------------
// Default scene (no grouped animation)
// ---------------------------------------------------------------------------

function createDefaultScenes(slide: Slide): Scene[] {
  // Get animated elements from the item tree
  const elements = slide.items.length > 0
    ? flattenItemsAsElements(slide.items)
    : slide.elements;

  const animated = elements
    .filter((el) => el.animation.type !== 'none')
    .sort((a, b) => a.animation.delay - b.animation.delay);

  const revealMode: RevealMode = animated.length > 1 ? 'sequential' : 'all-at-once';

  const scene: Scene = {
    id: `${slide.id}-scene-0`,
    title: slide.title ?? 'Main',
    icon: slide.icon,
    order: 0,
    widgetStateLayer: {
      initialStates: elements.map((el) => ({
        widgetId: el.id,
        visible: el.animation.type === 'none',
        isFocused: false,
        displayMode: 'normal',
      })),
      enterBehavior: {
        revealMode,
        animationType: animated[0]?.animation.type ?? 'fade-in',
        duration: animated[0]?.animation.duration ?? 0.5,
        easing: animated[0]?.animation.easing ?? 'ease-out',
        staggerDelay: revealMode === 'all-at-once' ? 0.15 : undefined,
        triggerMode: slide.triggerMode,
        stepDuration: 1500,
      },
      interactionBehaviors: [],
      animatedWidgetIds: animated.map((el) => el.id),
    },
    triggerMode: slide.triggerMode,
    duration: slide.duration,
  };

  return [scene];
}

// ---------------------------------------------------------------------------
// Card-expand migration (smart cards)
// ---------------------------------------------------------------------------

function migrateCardExpand(slide: Slide, group: GroupedAnimationConfig): Scene[] {
  // Card-expand becomes a single scene with sequential reveal
  // and interactive expand behavior
  const items = group.items;

  const initialStates: WidgetVisualState[] = items.map((item) => ({
    widgetId: item.id,
    visible: false,
    isFocused: false,
    displayMode: 'normal',
  }));

  const interactionBehaviors: InteractionBehavior[] = [
    {
      trigger: 'click',
      action: 'toggle-expand',
      targetDisplayMode: 'expanded',
      exclusive: true, // Only one card expanded at a time
      availableInAutoMode: group.presentationMode === 'auto-and-manual',
    },
  ];

  const scene: Scene = {
    id: `${slide.id}-scene-0`,
    title: slide.title ?? 'Smart Cards',
    icon: slide.icon,
    order: 0,
    widgetStateLayer: {
      initialStates,
      enterBehavior: {
        revealMode: 'sequential',
        animationType: 'fade-in',
        duration: 0.5,
        easing: 'ease-out',
        triggerMode: group.triggerMode ?? 'click',
        stepDuration: group.stepDuration,
      },
      interactionBehaviors,
      animatedWidgetIds: items.map((item) => item.id),
    },
    triggerMode: group.triggerMode,
  };

  return [scene];
}

// ---------------------------------------------------------------------------
// Items-grid migration
// ---------------------------------------------------------------------------

function migrateItemsGrid(slide: Slide, group: GroupedAnimationConfig): Scene[] {
  const items = group.items;
  const isGridToSidebar = slide.animationTemplate === 'grid-to-sidebar';

  const scenes: Scene[] = [];

  // Scene 1: Grid reveal (sequential — one card at a time)
  const gridScene: Scene = {
    id: `${slide.id}-scene-0`,
    title: 'Grid Overview',
    icon: '🔲',
    order: 0,
    widgetStateLayer: {
      initialStates: items.map((item) => ({
        widgetId: item.id,
        visible: false,
        isFocused: false,
        displayMode: 'normal',
      })),
      enterBehavior: {
        revealMode: 'sequential',
        animationType: 'scale-in',
        duration: 0.4,
        easing: 'ease-out',
        triggerMode: group.triggerMode ?? 'auto',
        stepDuration: group.stepDuration,
      },
      interactionBehaviors: [],
      animatedWidgetIds: items.map((item) => item.id),
    },
    triggerMode: group.triggerMode,
  };
  scenes.push(gridScene);

  // Scene 2 (grid-to-sidebar only): Migration to sidebar layout
  if (isGridToSidebar) {
    const migrationScene: Scene = {
      id: `${slide.id}-scene-1`,
      title: 'Detail View',
      icon: '📋',
      order: 1,
      widgetStateLayer: {
        initialStates: items.map((item) => ({
          widgetId: item.id,
          visible: true,
          isFocused: false,
          displayMode: 'normal',
        })),
        enterBehavior: {
          revealMode: 'sequential',
          animationType: 'slide-left',
          duration: 0.5,
          easing: 'ease-in-out',
          triggerMode: group.triggerMode ?? 'auto',
          stepDuration: group.stepDuration,
        },
        interactionBehaviors: [
          {
            trigger: 'click',
            action: 'show-detail',
            targetDisplayMode: 'expanded',
            exclusive: true,
            availableInAutoMode: true,
          },
        ],
        animatedWidgetIds: items.map((item) => item.id),
      },
      triggerMode: group.triggerMode,
    };
    scenes.push(migrationScene);
  }

  return scenes;
}

// ---------------------------------------------------------------------------
// Generic sequential group migration
// ---------------------------------------------------------------------------

function migrateSequentialGroup(slide: Slide, group: GroupedAnimationConfig): Scene[] {
  const items = group.items;

  const scene: Scene = {
    id: `${slide.id}-scene-0`,
    title: slide.title ?? 'Main',
    icon: slide.icon,
    order: 0,
    widgetStateLayer: {
      initialStates: items.map((item) => ({
        widgetId: item.id,
        visible: false,
        isFocused: false,
        displayMode: 'normal',
      })),
      enterBehavior: {
        revealMode: 'sequential',
        animationType: 'fade-in',
        duration: 0.5,
        easing: 'ease-out',
        triggerMode: group.triggerMode ?? 'auto',
        stepDuration: group.stepDuration,
      },
      exitBehavior: undefined,
      interactionBehaviors: [],
      animatedWidgetIds: items.map((item) => item.id),
    },
    triggerMode: group.triggerMode,
  };

  return [scene];
}

// ---------------------------------------------------------------------------
// Utility: Ensure slide has scenes
// ---------------------------------------------------------------------------

/**
 * Returns the slide's scenes, performing migration if necessary.
 * This is the primary entry point for consumers during the transition period.
 */
export function ensureScenes(slide: Slide): Scene[] {
  if (slide.scenes && slide.scenes.length > 0) {
    return slide.scenes;
  }
  return migrateGroupedToScenes(slide);
}
