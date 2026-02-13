/**
 * Slide, element, and canvas-related types for VisualStory.
 *
 * The item model uses a recursive tree (SlideItem = LayoutItem | CardItem | AtomItem)
 * that mirrors DOM structure: layouts contain children, cards contain children,
 * atoms are leaf nodes (text, icon, shape, image).
 *
 * @source docs/modules/story-editor/element-properties.md
 * @source docs/product-summary/MVP-architecture.md
 */

// ---------------------------------------------------------------------------
// Enums & Union Types
// ---------------------------------------------------------------------------

/**
 * Supported element types within a slide.
 * @deprecated Use AtomType for new code. Kept for backward compatibility.
 */
export type ElementType = 'text' | 'icon' | 'shape' | 'image';

/** Trigger mode for animations and transitions. */
export type TriggerMode = 'auto' | 'click';

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
// SlideItem — Recursive Tree Model
// ---------------------------------------------------------------------------

/** Discriminator for the three SlideItem variants. */
export type SlideItemType = 'layout' | 'card' | 'atom';

/** Layout strategies for LayoutItem containers. */
export type LayoutType = 'grid' | 'flex' | 'sidebar' | 'split' | 'stack';

/** Leaf-level element types (mirrors the old ElementType). */
export type AtomType = 'text' | 'icon' | 'shape' | 'image';

/**
 * Configuration for a layout container's CSS behaviour.
 */
export interface LayoutConfig {
  /** Number of columns (for grid layout). */
  columns?: number;
  /** Number of rows (for grid layout). */
  rows?: number;
  /** Gap between children in pixels. */
  gap?: number;
  /** Main axis direction (for flex/stack layout). */
  direction?: 'row' | 'column';
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Sidebar width as a CSS value (for sidebar layout, e.g. '30%' or '200px'). */
  sidebarWidth?: string;
}

// ---------------------------------------------------------------------------
// Core Interfaces — Animation & Style (shared by all item types)
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
  /** Override trigger mode for this specific animation (inherits from slide/project if unset). */
  triggerMode?: TriggerMode;
}

/**
 * Visual style properties for a slide item.
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
  /** Padding in pixels (uniform). */
  padding?: number;
}

// ---------------------------------------------------------------------------
// SlideItem Variants
// ---------------------------------------------------------------------------

/**
 * Shared base fields present on every SlideItem variant.
 */
export interface SlideItemBase {
  /** Unique identifier for this item. */
  id: string;
  /** Visual style overrides. */
  style?: ElementStyle;
  /** Animation config for this item's entrance/emphasis. */
  animation?: AnimationConfig;
  /**
   * Optional absolute position within the parent container.
   * When present the item is positioned absolutely (left/top in pixels
   * relative to the parent). When absent, DOM flow (flex/grid) applies.
   */
  position?: { x: number; y: number };
  /**
   * Reference to a global item definition. When set, the item's content
   * values are sourced from the global item registry and stay consistent
   * across all slides where this global item appears.
   * (Not yet implemented — reserved for future use.)
   */
  globalItem?: { id: string };
}

/**
 * A layout container — organises children using CSS flex, grid, or
 * specialised layout strategies (sidebar, split, stack).
 */
export interface LayoutItem extends SlideItemBase {
  type: 'layout';
  /** Which CSS layout strategy to use. */
  layoutType: LayoutType;
  /** Child items rendered inside this layout container. */
  children: SlideItem[];
  /** CSS layout configuration (columns, gap, direction, etc.). */
  layoutConfig?: LayoutConfig;
}

/**
 * A card — a visually grouped container (border, shadow, background)
 * that wraps child items. Children can be layouts, other cards, or atoms.
 */
export interface CardItem extends SlideItemBase {
  type: 'card';
  /** Child items rendered inside the card. */
  children: SlideItem[];
}

/**
 * An atom — a leaf-level content element (text, icon, shape, image).
 * Atoms have no children.
 */
export interface AtomItem extends SlideItemBase {
  type: 'atom';
  /** Which kind of leaf element this is. */
  atomType: AtomType;
  /** The content value (text string, icon name, image URL, etc.). */
  content: string;
}

/**
 * Recursive union of all slide item types.
 * The slide's visual tree is composed of these nodes.
 */
export type SlideItem = LayoutItem | CardItem | AtomItem;

// ---------------------------------------------------------------------------
// Legacy SlideElement (deprecated — use SlideItem tree)
// ---------------------------------------------------------------------------

/**
 * A single element within a slide.
 * @deprecated Use the SlideItem tree (LayoutItem | CardItem | AtomItem) instead.
 *   Kept for backward compatibility with existing components during migration.
 *   An AtomItem with a required position and animation is functionally equivalent.
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

// ---------------------------------------------------------------------------
// Slide Header
// ---------------------------------------------------------------------------

/**
 * Available pre-built header layout variants.
 *
 * - 'title-bar'  — Classic title bar with optional subtitle, icon, and trailing section.
 *                   Consumes slide-level title/subtitle/icon.
 * - 'tabs'       — Horizontal tab-like sections rendered from `items`.
 *                   No title — each top-level item is one tab section.
 * - 'custom'     — Fully custom header rendered from `items` via ItemRenderer.
 */
export type SlideHeaderVariant = 'title-bar' | 'tabs' | 'custom';

/**
 * Configuration for the optional header region at the top of a slide.
 *
 * The header is a distinct visual zone separated from the content area.
 * Title/subtitle/icon data comes from the parent `Slide` — the header
 * controls *how* they are displayed, not *what* they contain.
 */
export interface SlideHeader {
  /** Unique identifier for this header instance. */
  id: string;

  /** Which pre-built header layout component to use. */
  variant: SlideHeaderVariant;

  /**
   * Right-side trailing section content for 'title-bar' variant.
   * Rendered via ItemRenderer — can contain StatusDot atoms,
   * legend cards, action buttons, etc.
   */
  trailing?: SlideItem[];

  /**
   * Custom content for 'tabs' and 'custom' variants.
   * When variant='custom', this IS the header content.
   * When variant='tabs', each top-level item = one tab section.
   */
  items?: SlideItem[];

  /** Visual style overrides for the header container. */
  style?: ElementStyle;

  /** Entrance animation for the header as a whole. */
  animation?: AnimationConfig;

  /** Size preset (controls padding, font sizes). Default: 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Show bottom border separating header from content. Default: true. */
  bordered?: boolean;
}

// ---------------------------------------------------------------------------
// Slide Layout Templates
// ---------------------------------------------------------------------------

/**
 * Catalogue of pre-built slide content layout templates.
 *
 * Each template defines the spatial arrangement of the **content area**
 * within a slide — how the available space is divided into regions
 * (columns, grids, centered, freeform, etc.).
 *
 * The slide header is orthogonal to the content layout: any layout can
 * be rendered with or without a header bar. Header presence is controlled
 * by the `Slide.header` property.
 */
export type SlideLayoutTemplate =
  | 'content'             // Full-width single content area
  | 'two-column'          // Two columns, 50/50 split
  | 'two-column-25-75'    // Narrow left (25%) + wide right (75%)
  | 'two-column-75-25'    // Wide left (75%) + narrow right (25%)
  | 'two-column-33-67'    // One-third left (33%) + two-thirds right (67%)
  | 'two-column-67-33'    // Two-thirds left (67%) + one-third right (33%)
  | 'three-column'        // Three equal vertical panes
  | 'four-column'         // Four equal vertical panes
  | 'sidebar-detail'      // Sidebar navigation + detail area
  | 'grid-2x2'            // 2×2 grid (4 items)
  | 'grid-3x2'            // 3×2 grid (6 items)
  | 'grid-2-3'            // 5 items: 2 top row, 3 bottom row
  | 'grid-3-2'            // 5 items: 3 top row, 2 bottom row
  | 'center-band'         // Full-width bar centred vertically (section title, process flow)
  | 'center-stage'        // Full-slide centred content (title slides, hero, quote)
  | 'center-stage-2'      // Two centred items side by side
  | 'center-stage-3'      // Three centred items in a row
  | 'center-stage-4'      // Four centred items in a row
  | 'blank'               // Empty canvas — user places items manually
  | 'custom';             // Fully custom layout via items tree

// ---------------------------------------------------------------------------
// Layout Region (for skeleton rendering)
// ---------------------------------------------------------------------------

/**
 * Describes a single visual region within a content layout.
 * Used by skeleton renderers to draw placeholder rectangles.
 */
export interface LayoutRegion {
  /** Region identifier (e.g. 'left', 'top-right', 'cell-0-1'). */
  id: string;
  /** Display label shown inside the skeleton region. */
  label: string;
  /** Grid placement hints for CSS grid rendering. */
  area: { row: number; col: number; rowSpan?: number; colSpan?: number };
}

// ---------------------------------------------------------------------------
// Layout Meta
// ---------------------------------------------------------------------------

/**
 * Searchable metadata for a slide content layout template.
 * Used by the template picker / catalogue UI and AI assistant.
 */
export interface SlideLayoutMeta {
  /** Template identifier — matches SlideLayoutTemplate values. */
  id: SlideLayoutTemplate;
  /** Human-readable display name. */
  name: string;
  /** Short description of the layout. */
  description: string;
  /** Number of content columns (0 = not column-based, e.g. grid or center). */
  columns: number;
  /** Whether this template uses a grid layout for content. */
  isGrid: boolean;
  /** Grid dimensions if applicable (e.g. '2x2', '3x2', '2-3', '3-2'). */
  gridSize?: string;
  /** Whether this template includes a sidebar region. */
  hasSidebar: boolean;
  /** Tags for filtering/searching. */
  tags: string[];
  /** Region definitions for skeleton rendering. */
  regions: LayoutRegion[];
  /** Content types this layout is best suited for (AI selection hint). */
  bestFor: string[];
  /** Recommended number of content items for this layout. */
  itemCount?: number;
  /** Prose description for AI assistant to understand when to select this layout. */
  aiHints: string;
}

// ---------------------------------------------------------------------------
// Slide
// ---------------------------------------------------------------------------

/**
 * A single slide in the project.
 * @source docs/product-summary/MVP-architecture.md — Data Models (Core)
 */
export interface Slide {
  id: string;
  order: number;

  // --- Slide identity / metadata ---

  /** The slide's title text. Used by header, title layouts, navigation, accessibility. */
  title?: string;

  /** Secondary heading / subtitle text. */
  subtitle?: string;

  /** Icon or emoji for the slide (emoji string, icon name, or image URL). */
  icon?: string;

  /** Descriptive label for the slide template/content (tooling use, not user-facing). */
  content: string;

  // --- Layout & structure ---

  /**
   * Top-level layout template that defines the slide's visual structure.
   * Determines how header and content regions are arranged.
   */
  layoutTemplate?: SlideLayoutTemplate;

  /**
   * Optional header rendered above the content area.
   * When present, the slide frame splits into header + content regions.
   */
  header?: SlideHeader;

  // --- Animation ---

  animationTemplate: string;

  /**
   * Recursive item tree describing the slide's content region.
   * Does NOT include the header — header has its own data.
   */
  items: SlideItem[];

  /**
   * Flat element array.
   * @deprecated Use `items` for new code. During migration, components that
   *   still need a flat list can use `flattenItems(slide.items)`.
   */
  elements: SlideElement[];

  /** Slide duration in milliseconds. */
  duration: number;

  /** Transition type used when moving to the next slide. */
  transition: string;

  /** Override trigger mode for this slide (inherits from project if unset). */
  triggerMode?: TriggerMode;

  /** Grouped animation config — present when this slide uses a grouped layout. */
  groupedAnimation?: import('@/types/animation').GroupedAnimationConfig;
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
