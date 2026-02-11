/**
 * Slide, element, and canvas-related types for VisualStory.
 *
 * @source docs/modules/story-editor/element-properties.md
 * @source docs/product-summary/MVP-architecture.md
 */

// ---------------------------------------------------------------------------
// Enums & Union Types
// ---------------------------------------------------------------------------

/** Supported element types within a slide. */
export type ElementType = 'text' | 'icon' | 'shape' | 'image';

/** Available animation types for individual elements. */
export type AnimationType =
  | 'none'
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  | 'bounce'
  | 'typewriter';

/** Easing functions for element animations. */
export type EasingType =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring';

// ---------------------------------------------------------------------------
// Core Interfaces
// ---------------------------------------------------------------------------

/**
 * Configuration for an individual element's animation.
 * @source docs/modules/story-editor/element-properties.md — US-EP-003
 */
export interface AnimationConfig {
  /** Animation preset to apply. */
  type: AnimationType;
  /** Duration of the animation in seconds (0.3–3). */
  duration: number;
  /** Delay relative to slide start in seconds. */
  delay: number;
  /** Easing function. */
  easing: EasingType;
}

/**
 * Visual style properties for a slide element.
 * @source docs/modules/story-editor/element-properties.md — US-EP-004
 */
export interface ElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  width?: number;
  height?: number;
}

/**
 * A single element within a slide.
 * @source docs/product-summary/MVP-architecture.md — Data Models (Core)
 */
export interface SlideElement {
  id: string;
  type: ElementType;
  content: string;
  animation: AnimationConfig;
  position: { x: number; y: number };
  style: ElementStyle;
}

/**
 * A single slide in the project.
 * @source docs/product-summary/MVP-architecture.md — Data Models (Core)
 */
export interface Slide {
  id: string;
  order: number;
  content: string;
  animationTemplate: string;
  elements: SlideElement[];
  /** Slide duration in milliseconds. */
  duration: number;
  /** Transition type used when moving to the next slide. */
  transition: string;
}

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

/**
 * Props for the SlideCanvas component.
 * @source docs/modules/story-editor/slide-canvas.md
 */
export interface SlideCanvasProps {
  slide: Slide;
  /** ID of the currently selected element (if any). */
  selectedElementId?: string;
  /** Callback when an element is selected on the canvas. */
  onSelectElement: (elementId: string | null) => void;
  /** Callback when an element is moved via drag. */
  onMoveElement: (elementId: string, position: { x: number; y: number }) => void;
  /** Whether the canvas is in preview/playback mode. */
  isPreview?: boolean;
}

/**
 * Props for the ElementPropertiesPanel component.
 * @source docs/modules/story-editor/element-properties.md — Component
 */
export interface ElementPropertiesPanelProps {
  element: SlideElement;
  /** Callback when any property of the element changes. */
  onChange: (updated: Partial<SlideElement>) => void;
  /** Trigger a preview of the element animation. */
  onPreview: () => void;
  /** Reset element to default settings. */
  onReset: () => void;
}

/**
 * Props for the TimelineView component.
 * @source docs/modules/story-editor/timeline-view.md
 */
export interface TimelineViewProps {
  slides: Slide[];
  /** Index of the currently active slide. */
  currentSlideIndex: number;
  /** Callback when a slide is selected in the timeline. */
  onSelectSlide: (index: number) => void;
  /** Callback when slide order changes via drag-and-drop. */
  onReorderSlides: (fromIndex: number, toIndex: number) => void;
  /** Total project duration in milliseconds. */
  totalDuration: number;
}
