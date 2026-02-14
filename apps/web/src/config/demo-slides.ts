/**
 * Demo slide deck — 7 slides showcasing layout patterns and smart widgets.
 *
 * All slides use the new data model exclusively:
 *   - slide.items  — content region item tree
 *   - slide.scenes — animation scenes with widget state layers
 *   - NO deprecated elements[] or groupedAnimation
 *
 * Slides:
 *   1. Grid 2×2          — Title bar + 2×2 feature card grid (sequential reveal)
 *   2. Sidebar + Detail  — Title bar + sidebar navigation + detail (sequential reveal)
 *   3. Static Grid       — Header + 2×2 grid, no animation
 *   4. Menu Widget       — Sidebar-detail with multiple scenes (one per menu item)
 *   5. Center Popup      — Smart Card expand widget, center-popup variant
 *   6. Grid to Overlay   — Smart Card expand widget, grid-to-overlay variant
 *   7. Row to Split      — Smart Card expand widget, row-to-split variant
 *
 * Used by the Slide Editor and Slide Play dev pages.
 */

import type { Slide, SlideItem, AtomItem, LayoutItem, CardItem, SlideHeader } from '@/types/slide';
import type { SlideScript } from '@/types/script';
import type { SlideSection, Scene } from '@/types/scene';

// ---------------------------------------------------------------------------
// Shared Helpers
// ---------------------------------------------------------------------------

function atom(
  id: string,
  atomType: AtomItem['atomType'],
  content: string,
  opts?: Partial<Omit<AtomItem, 'id' | 'type' | 'atomType' | 'content'>>,
): AtomItem {
  return { id, type: 'atom', atomType, content, ...opts };
}

function card(
  id: string,
  children: SlideItem[],
  opts?: Partial<Omit<CardItem, 'id' | 'type' | 'children'>>,
): CardItem {
  return { id, type: 'card', children, ...opts };
}

function layout(
  id: string,
  layoutType: LayoutItem['layoutType'],
  children: SlideItem[],
  opts?: Partial<Omit<LayoutItem, 'id' | 'type' | 'layoutType' | 'children'>>,
): LayoutItem {
  return { id, type: 'layout', layoutType, children, ...opts };
}

function titleBarHeader(
  id: string,
  extra?: { statusColor?: string; statusLabel?: string },
): SlideHeader {
  const trailing: SlideItem[] = [];
  if (extra?.statusColor) {
    trailing.push(
      atom(`${id}-dot`, 'shape', '', {
        style: { width: 8, height: 8, borderRadius: 4, backgroundColor: extra.statusColor },
      }),
      atom(`${id}-label`, 'text', extra.statusLabel ?? 'Active', {
        style: { fontSize: 10, color: '#94a3b8' },
      }),
    );
  }
  return { id, variant: 'title-bar', trailing, size: 'md', bordered: true };
}

// ---------------------------------------------------------------------------
// Shared item data
// ---------------------------------------------------------------------------

/** Feature items used across layout slides (1-3). */
const FEATURE_ITEMS = [
  { id: 'fi-launch', icon: '🚀', title: 'Launch', description: 'Ship features faster with streamlined deployment pipelines', color: '#3b82f6' },
  { id: 'fi-analytics', icon: '📊', title: 'Analytics', description: 'Real-time insights and dashboards for data-driven decisions', color: '#8b5cf6' },
  { id: 'fi-security', icon: '🔒', title: 'Security', description: 'Enterprise-grade encryption and compliance built in', color: '#14b8a6' },
  { id: 'fi-speed', icon: '⚡', title: 'Speed', description: '10x faster processing with optimized infrastructure', color: '#f59e0b' },
  { id: 'fi-targeting', icon: '🎯', title: 'Targeting', description: 'Precision audience segmentation and personalization', color: '#ef4444' },
];

/**
 * Smart Card metadata — IDs match SMART_CARD_ITEMS in config/smart-card-items.tsx.
 * CardExpandLayout uses SMART_CARD_ITEMS for rich content (JSX detailContent);
 * these lightweight records provide the data for item trees and scenes.
 */
const SC_META = [
  { id: 'sc-launch', icon: '🚀', title: 'Launch', description: 'Ship features faster', color: '#3b82f6' },
  { id: 'sc-analytics', icon: '📊', title: 'Analytics', description: 'Data-driven decisions', color: '#8b5cf6' },
  { id: 'sc-security', icon: '🔒', title: 'Security', description: 'Enterprise-grade protection', color: '#14b8a6' },
  { id: 'sc-speed', icon: '⚡', title: 'Speed', description: '10x faster processing', color: '#f59e0b' },
];

// ---------------------------------------------------------------------------
// Slide 1 — Grid 2×2 (sequential reveal)
// ---------------------------------------------------------------------------

const s1Cards = FEATURE_ITEMS.slice(0, 4);

const slide1Items: SlideItem[] = [
  layout('s1-grid', 'grid', s1Cards.map((fi) =>
    card(fi.id, [
      atom(`${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 30 } }),
      atom(`${fi.id}-title`, 'text', fi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
    ], { style: { backgroundColor: `${fi.color}10`, borderRadius: 16, padding: 16 } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide1Scenes: Scene[] = [{
  id: 'slide-1-scene-0',
  title: 'Grid of Cards',
  icon: '🔲',
  order: 0,
  widgetStateLayer: {
    initialStates: s1Cards.map((fi) => ({
      widgetId: fi.id,
      visible: false,
      isFocused: false,
      displayMode: 'normal' as const,
    })),
    enterBehavior: {
      revealMode: 'sequential',
      animationType: 'scale-in',
      duration: 0.4,
      easing: 'ease-out',
      triggerMode: 'auto',
      stepDuration: 1400,
    },
    interactionBehaviors: [],
    animatedWidgetIds: s1Cards.map((fi) => fi.id),
  },
  triggerMode: 'auto',
}];

// ---------------------------------------------------------------------------
// Slide 2 — Sidebar + Detail (sequential reveal)
// ---------------------------------------------------------------------------

const slide2Items: SlideItem[] = [
  layout('s2-content', 'sidebar', [
    layout('s2-sidebar', 'stack', FEATURE_ITEMS.map((fi) =>
      card(fi.id, [
        atom(`${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 16 } }),
        atom(`${fi.id}-title`, 'text', fi.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
      ], { style: { padding: 8, borderRadius: 8 } }),
    ), { layoutConfig: { direction: 'column', gap: 6 } }),
    layout('s2-detail', 'flex', FEATURE_ITEMS.map((fi) =>
      card(`${fi.id}-detail`, [
        atom(`${fi.id}-d-icon`, 'icon', fi.icon, { style: { fontSize: 24 } }),
        atom(`${fi.id}-d-title`, 'text', fi.title, { style: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${fi.id}-d-desc`, 'text', fi.description, { style: { fontSize: 14, color: '#64748b' } }),
      ], { style: { padding: 24, borderRadius: 12 } }),
    ), { layoutConfig: { direction: 'column', gap: 16 } }),
  ], { layoutConfig: { sidebarWidth: '180px' } }),
];

const slide2Scenes: Scene[] = [{
  id: 'slide-2-scene-0',
  title: 'Sidebar Detail',
  icon: '📋',
  order: 0,
  widgetStateLayer: {
    initialStates: FEATURE_ITEMS.map((fi) => ({
      widgetId: fi.id,
      visible: false,
      isFocused: false,
      displayMode: 'normal' as const,
    })),
    enterBehavior: {
      revealMode: 'sequential',
      animationType: 'fade-in',
      duration: 0.5,
      easing: 'ease-out',
      triggerMode: 'auto',
      stepDuration: 2000,
    },
    interactionBehaviors: [{
      trigger: 'click',
      action: 'show-detail',
      targetDisplayMode: 'expanded' as const,
      exclusive: true,
      availableInAutoMode: true,
    }],
    animatedWidgetIds: FEATURE_ITEMS.map((fi) => fi.id),
  },
  triggerMode: 'auto',
}];

// ---------------------------------------------------------------------------
// Slide 3 — Static Grid (no animation)
// ---------------------------------------------------------------------------

const s3Cards = FEATURE_ITEMS.slice(0, 4);

const slide3Items: SlideItem[] = [
  layout('s3-grid', 'grid', s3Cards.map((fi) =>
    card(`s3-${fi.id}`, [
      atom(`s3-${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 30 } }),
      atom(`s3-${fi.id}-title`, 'text', fi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' } }),
    ], { style: { backgroundColor: `${fi.color}10`, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: `${fi.color}25` } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide3Scenes: Scene[] = [{
  id: 'slide-3-scene-0',
  title: 'Product Overview',
  icon: '📦',
  order: 0,
  widgetStateLayer: {
    initialStates: s3Cards.map((fi) => ({
      widgetId: `s3-${fi.id}`,
      visible: true,
      isFocused: false,
      displayMode: 'normal' as const,
    })),
    enterBehavior: {
      revealMode: 'all-at-once',
      animationType: 'none',
      duration: 0,
      easing: 'ease-out',
    },
    interactionBehaviors: [],
    animatedWidgetIds: [],
  },
}];

// ---------------------------------------------------------------------------
// Slide 4 — Menu Widget (sidebar-detail, multiple scenes)
//
// Right panel = persistent menu (always visible).
// Left panel = content of selected menu item (one scene per item).
// ---------------------------------------------------------------------------

const slide4Items: SlideItem[] = [
  layout('s4-content', 'sidebar', [
    // Detail panels (one per menu item — visibility controlled by scenes)
    ...SC_META.map((m) =>
      card(`s4-detail-${m.id}`, [
        atom(`s4-d-${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 36 } }),
        atom(`s4-d-${m.id}-title`, 'text', m.title, { style: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`s4-d-${m.id}-desc`, 'text', m.description, { style: { fontSize: 14, color: '#64748b' } }),
      ], { style: { padding: 32, borderRadius: 12 } }),
    ),
    // Menu sidebar (always visible in every scene)
    layout('s4-menu', 'stack', SC_META.map((m) =>
      card(`s4-menu-${m.id}`, [
        atom(`s4-m-${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 18 } }),
        atom(`s4-m-${m.id}-title`, 'text', m.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
      ], { style: { padding: 10, borderRadius: 8, backgroundColor: `${m.color}10` } }),
    ), { layoutConfig: { direction: 'column', gap: 8 } }),
  ], { layoutConfig: { sidebarWidth: '160px' } }),
];

const slide4Scenes: Scene[] = SC_META.map((item, i) => ({
  id: `slide-4-scene-${i}`,
  title: item.title,
  icon: item.icon,
  description: item.description,
  order: i,
  widgetStateLayer: {
    initialStates: SC_META.map((m) => ({
      widgetId: `s4-detail-${m.id}`,
      visible: m.id === item.id,
      isFocused: m.id === item.id,
      displayMode: (m.id === item.id ? 'expanded' : 'hidden') as const,
    })),
    enterBehavior: {
      revealMode: 'all-at-once' as const,
      animationType: 'fade-in' as const,
      duration: 0.4,
      easing: 'ease-out' as const,
    },
    interactionBehaviors: [],
    animatedWidgetIds: [`s4-detail-${item.id}`],
  },
}));

// ---------------------------------------------------------------------------
// Slides 5–7 — Smart Card Expand Widgets
//
// Each slide uses a different CardExpandLayout variant.
// Single scene with includeOverviewStep: overview -> expand each card -> return.
// ---------------------------------------------------------------------------

/** Build a card-expand items tree using SC_META. */
function buildCardExpandItems(prefix: string): SlideItem[] {
  return [
    layout(`${prefix}-grid`, 'grid', SC_META.map((m) =>
      card(m.id, [
        atom(`${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 30 } }),
        atom(`${m.id}-title`, 'text', m.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' } }),
        atom(`${m.id}-desc`, 'text', m.description, { style: { fontSize: 11, color: '#94a3b8' } }),
      ], { style: { backgroundColor: `${m.color}10`, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: `${m.color}25` } }),
    ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
  ];
}

/** Build a single expand-widget scene with overview step. */
function buildExpandScene(slideId: string, title: string, icon: string): Scene {
  return {
    id: `${slideId}-scene-0`,
    title,
    icon,
    order: 0,
    widgetStateLayer: {
      initialStates: SC_META.map((m) => ({
        widgetId: m.id,
        visible: true,
        isFocused: false,
        displayMode: 'normal' as const,
      })),
      enterBehavior: {
        revealMode: 'sequential',
        animationType: 'scale-in',
        duration: 0.5,
        easing: 'ease-out',
        triggerMode: 'click',
        stepDuration: 2000,
        includeOverviewStep: true,
      },
      exitBehavior: {
        revealMode: 'all-at-once',
        animationType: 'scale-out',
        duration: 0.4,
        easing: 'ease-in-out',
      },
      interactionBehaviors: [{
        trigger: 'click',
        action: 'toggle-expand',
        targetDisplayMode: 'expanded' as const,
        exclusive: true,
        availableInAutoMode: true,
      }],
      animatedWidgetIds: SC_META.map((m) => m.id),
    },
    triggerMode: 'click',
  };
}

// ---------------------------------------------------------------------------
// Demo Sections (organizational hierarchy for sidebar)
// ---------------------------------------------------------------------------

export const DEMO_SECTIONS: SlideSection[] = [
  {
    id: 'section-layouts',
    title: 'Layouts',
    icon: '📐',
    slideIds: ['slide-1', 'slide-2', 'slide-3'],
  },
  {
    id: 'section-smart-cards',
    title: 'Smart Cards',
    icon: '🃏',
    slideIds: ['slide-4', 'slide-5', 'slide-6', 'slide-7'],
  },
];

// ---------------------------------------------------------------------------
// Demo Slides Array
// ---------------------------------------------------------------------------

export const DEMO_SLIDES: Slide[] = [
  // Slide 1 — Grid 2×2 (sequential reveal)
  {
    id: 'slide-1',
    order: 0,
    sectionId: 'section-layouts',
    title: 'Grid of Cards',
    subtitle: 'Auto-grid of FeatureCards with staggered entrance',
    icon: '🔲',
    content: 'Header + Grid 2x2 — feature cards grid',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-1', { statusColor: '#22c55e' }),
    animationTemplate: 'slide-title',
    items: slide1Items,
    elements: [],
    duration: 10000,
    transition: 'fade',
    scenes: slide1Scenes,
  },
  // Slide 2 — Sidebar + Detail (sequential reveal)
  {
    id: 'slide-2',
    order: 1,
    sectionId: 'section-layouts',
    title: 'Sidebar Detail',
    subtitle: 'Click sidebar items to navigate detail view',
    icon: '📋',
    content: 'Header + Sidebar + Detail — sidebar navigation',
    layoutTemplate: 'sidebar-detail',
    header: titleBarHeader('h-slide-2', { statusColor: '#22c55e' }),
    animationTemplate: 'sidebar-detail',
    items: slide2Items,
    elements: [],
    duration: 14000,
    transition: 'fade',
    scenes: slide2Scenes,
  },
  // Slide 3 — Static Grid (no animation)
  {
    id: 'slide-3',
    order: 2,
    sectionId: 'section-layouts',
    title: 'Product Overview',
    subtitle: 'Core capabilities at a glance',
    icon: '📦',
    content: 'Static grid — 4 cards, no animation',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-3'),
    animationTemplate: 'none',
    items: slide3Items,
    elements: [],
    duration: 5000,
    transition: 'fade',
    scenes: slide3Scenes,
  },
  // Slide 4 — Menu Widget (sidebar-detail, multiple scenes)
  {
    id: 'slide-4',
    order: 3,
    sectionId: 'section-smart-cards',
    title: 'Menu Widget',
    subtitle: 'Navigate menu items — each item is a scene',
    icon: '📋',
    content: 'Smart Widget — sidebar-detail menu with scene-per-item',
    layoutTemplate: 'sidebar-detail',
    header: titleBarHeader('h-slide-4', { statusColor: '#3b82f6', statusLabel: 'Interactive' }),
    animationTemplate: 'sidebar-detail',
    items: slide4Items,
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: slide4Scenes,
  },
  // Slide 5 — Center Popup (expand widget)
  {
    id: 'slide-5',
    order: 4,
    sectionId: 'section-smart-cards',
    title: 'Center Popup',
    subtitle: 'Expanded card as centered overlay with backdrop blur',
    icon: '🎯',
    content: 'Smart Card — center-popup variant',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-5', { statusColor: '#8b5cf6', statusLabel: 'Interactive' }),
    animationTemplate: 'card-expand:center-popup',
    items: buildCardExpandItems('s5'),
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: [buildExpandScene('slide-5', 'Center Popup', '🎯')],
  },
  // Slide 6 — Grid to Overlay (expand widget)
  {
    id: 'slide-6',
    order: 5,
    sectionId: 'section-smart-cards',
    title: 'Grid to Overlay',
    subtitle: 'Click a card to expand — remaining cards stack to the right',
    icon: '🃏',
    content: 'Smart Card — grid-to-overlay variant',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-6', { statusColor: '#14b8a6', statusLabel: 'Interactive' }),
    animationTemplate: 'card-expand:grid-to-overlay',
    items: buildCardExpandItems('s6'),
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: [buildExpandScene('slide-6', 'Grid to Overlay', '🃏')],
  },
  // Slide 7 — Row to Split (expand widget)
  {
    id: 'slide-7',
    order: 6,
    sectionId: 'section-smart-cards',
    title: 'Row to Split',
    subtitle: 'Single row of cards — click to expand into two-column split',
    icon: '🔀',
    content: 'Smart Card — row-to-split variant',
    layoutTemplate: 'center-band',
    header: titleBarHeader('h-slide-7', { statusColor: '#f59e0b', statusLabel: 'Interactive' }),
    animationTemplate: 'card-expand:row-to-split',
    items: buildCardExpandItems('s7'),
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: [buildExpandScene('slide-7', 'Row to Split', '🔀')],
  },
];

// ---------------------------------------------------------------------------
// Demo Scripts
// ---------------------------------------------------------------------------

export const DEMO_SCRIPTS: SlideScript[] = [
  {
    slideId: 'slide-1',
    opening: { text: 'The Grid of Cards layout — items appear one by one in a structured grid.', notes: 'Items grid layout.' },
    elements: s1Cards.map((fi) => ({
      elementId: fi.id,
      label: fi.title,
      script: { text: `${fi.title} — ${fi.description}.`, notes: 'Grid item.' },
    })),
  },
  {
    slideId: 'slide-2',
    opening: { text: 'Sidebar Detail — a left navigation panel with detailed content on the right.', notes: 'Sidebar-detail layout.' },
    elements: FEATURE_ITEMS.map((fi) => ({
      elementId: fi.id,
      label: fi.title,
      script: { text: `${fi.title}: ${fi.description}`, notes: 'Sidebar item with detail.' },
    })),
  },
  {
    slideId: 'slide-3',
    opening: { text: 'Product Overview — a static grid of feature cards. Great as a simple overview slide.', notes: 'Static grid.' },
    elements: s3Cards.map((fi) => ({
      elementId: `s3-${fi.id}`,
      label: fi.title,
      script: { text: `${fi.title}: ${fi.description}`, notes: 'Static card.' },
    })),
  },
  {
    slideId: 'slide-4',
    opening: { text: 'Menu Widget — a sidebar menu where each item reveals its own scene with unique content.', notes: 'Menu widget with scenes.' },
    elements: SC_META.map((m) => ({
      elementId: `s4-detail-${m.id}`,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Menu item detail.' },
    })),
  },
  {
    slideId: 'slide-5',
    opening: { text: 'Center Popup — the expanded card floats as a centred overlay with backdrop blur.', notes: 'Card-expand: center-popup.' },
    elements: SC_META.map((m) => ({
      elementId: m.id,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Card-expand item.' },
    })),
  },
  {
    slideId: 'slide-6',
    opening: { text: 'Grid to Overlay — click any card to expand it. Remaining cards stack to the right.', notes: 'Card-expand: grid-to-overlay.' },
    elements: SC_META.map((m) => ({
      elementId: m.id,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Card-expand item.' },
    })),
  },
  {
    slideId: 'slide-7',
    opening: { text: 'Row to Split — a single row of cards. Clicking one expands into a two-column split.', notes: 'Card-expand: row-to-split.' },
    elements: SC_META.map((m) => ({
      elementId: m.id,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Card-expand item.' },
    })),
  },
];
