/**
 * Demo slide deck — 7 slides showcasing the slide-ui Layout patterns.
 *
 * Each slide demonstrates a layout template and uses the new data model:
 *   - slide.title / subtitle / icon — slide-level metadata
 *   - slide.header — optional SlideHeader for the title-bar region
 *   - slide.layoutTemplate — which layout template the slide uses
 *   - slide.items — content region item tree (separate from header)
 *
 * Slides:
 *   1. Grid 2×2          — Title bar + 2×2 feature card grid (items-grid grouped animation)
 *   2. Sidebar + Detail  — Title bar + sidebar navigation + detail (list-accumulator grouped)
 *   3. Static Grid       — Header + 2×2 grid of 4 cards (icon+title only, no animation, no smart card)
 *   4. Grid to Overlay   — Smart Card — CardExpandLayout grid-to-overlay variant
 *   5. Center Popup      — Smart Card — CardExpandLayout center-popup variant
 *   6. Sidebar Detail    — Smart Card — CardExpandLayout sidebar-detail variant
 *   7. Row to Split      — Smart Card — CardExpandLayout row-to-split variant
 *
 * Used by the Slide Editor and Slide Play dev pages.
 */

import type { Slide, SlideItem, AtomItem, LayoutItem, CardItem, SlideHeader } from '@/types/slide';
import type { SlideScript } from '@/types/script';
import type { SlideSection } from '@/types/scene';
import type { GroupedAnimationConfig, HoverEffect } from '@/types/animation';

// ---------------------------------------------------------------------------
// Shared Helpers
// ---------------------------------------------------------------------------

const defaultHover: HoverEffect = {
  type: 'zoom',
  scale: 1.08,
  showLabel: false,
  labelPosition: 'bottom',
  showTooltip: true,
  transitionMs: 150,
};

let _elemId = 0;
function eid(): string {
  return `el-${++_elemId}`;
}

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

// ---------------------------------------------------------------------------
// Shared item data (matching /en/ui-components demo)
// ---------------------------------------------------------------------------

const FEATURE_ITEMS = [
  { id: eid(), icon: '🚀', title: 'Launch', description: 'Ship features faster with streamlined deployment pipelines', color: '#3b82f6' },
  { id: eid(), icon: '📊', title: 'Analytics', description: 'Real-time insights and dashboards for data-driven decisions', color: '#8b5cf6' },
  { id: eid(), icon: '🔒', title: 'Security', description: 'Enterprise-grade encryption and compliance built in', color: '#14b8a6' },
  { id: eid(), icon: '⚡', title: 'Speed', description: '10× faster processing with optimized infrastructure', color: '#f59e0b' },
  { id: eid(), icon: '🎯', title: 'Targeting', description: 'Precision audience segmentation and personalization', color: '#ef4444' },
];

// ---------------------------------------------------------------------------
// Slide 1 — Header + Grid 2×2 (items-grid grouped)
// Title bar + 2×2 grid of feature cards
// (previously Slide 2)
// ---------------------------------------------------------------------------

const s1Items = FEATURE_ITEMS.slice(0, 4).map((fi) => ({
  ...fi,
  elementIds: [] as string[],
}));

const slide1Group: GroupedAnimationConfig = {
  type: 'items-grid',
  items: s1Items,
  stepDuration: 1400,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide1Header: SlideHeader = {
  id: 'h-slide-1',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' } }),
    atom(eid(), 'text', 'Active', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide1ItemTree: SlideItem[] = [
  layout('s1-grid', 'grid', s1Items.map((gi) =>
    card(gi.id, [
      atom(`${gi.id}-icon`, 'icon', gi.icon, { style: { fontSize: 30 } }),
      atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
    ], { style: { backgroundColor: `${gi.color}10`, borderRadius: 16, padding: 16 } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide1Elements = [
  { id: eid(), type: 'text' as const, content: 'Grid of Cards', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Auto-grid of FeatureCards with staggered entrance', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#64748b' } },
];

// ---------------------------------------------------------------------------
// Slide 2 — Header + Sidebar + Detail (sidebar-detail overlay)
// Left sidebar with thumbnails + right detail hero
// (previously Slide 3)
// ---------------------------------------------------------------------------

const s2Items = FEATURE_ITEMS.map((fi) => ({
  ...fi,
  elementIds: [] as string[],
}));

const slide2Group: GroupedAnimationConfig = {
  type: 'list-accumulator',
  items: s2Items,
  stepDuration: 2000,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide2Header: SlideHeader = {
  id: 'h-slide-2',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' } }),
    atom(eid(), 'text', 'Active', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide2ItemTree: SlideItem[] = [
  layout('s2-content', 'sidebar', [
    layout('s2-sidebar', 'stack', s2Items.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon, { style: { fontSize: 16 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
      ], { style: { padding: 8, borderRadius: 8 } }),
    ), { layoutConfig: { direction: 'column', gap: 6 } }),
    layout('s2-detail', 'flex', s2Items.map((gi) =>
      card(`${gi.id}-detail`, [
        atom(`${gi.id}-d-icon`, 'icon', gi.icon, { style: { fontSize: 24 } }),
        atom(`${gi.id}-d-title`, 'text', gi.title, { style: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${gi.id}-d-desc`, 'text', gi.description, { style: { fontSize: 14, color: '#64748b' } }),
      ], { style: { padding: 24, borderRadius: 12 } }),
    ), { layoutConfig: { direction: 'column', gap: 16 } }),
  ], { layoutConfig: { sidebarWidth: '180px' } }),
];

const slide2Elements = [
  { id: eid(), type: 'text' as const, content: 'Sidebar Detail', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 15 }, style: { fontSize: 24, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Click sidebar items to navigate detail view', animation: { type: 'fade-in' as const, duration: 0.4, delay: 0.2, easing: 'ease-out' as const }, position: { x: 80, y: 48 }, style: { fontSize: 13, color: '#94a3b8' } },
];

// ---------------------------------------------------------------------------
// Slide 3 — Static Grid (no animation, no smart card)
// Header + 2×2 grid of 4 cards (icon + title only)
// ---------------------------------------------------------------------------

const s3Cards = FEATURE_ITEMS.slice(0, 4);

const slide3Header: SlideHeader = {
  id: 'h-slide-3',
  variant: 'title-bar',
  size: 'md',
  bordered: true,
};

const slide3ItemTree: SlideItem[] = [
  layout('s3-grid', 'grid', s3Cards.map((fi) =>
    card(`s3-${fi.id}`, [
      atom(`s3-${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 30 } }),
      atom(`s3-${fi.id}-title`, 'text', fi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' } }),
    ], { style: { backgroundColor: `${fi.color}10`, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: `${fi.color}25` } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide3Elements = [
  { id: eid(), type: 'text' as const, content: 'Product Overview', animation: { type: 'none' as const, duration: 0, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#e2e8f0' } },
  { id: eid(), type: 'text' as const, content: 'Core capabilities at a glance', animation: { type: 'none' as const, duration: 0, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#94a3b8' } },
];

// ---------------------------------------------------------------------------
// Slides 4–7 — Smart Card variants (card-expand with CardExpandLayout)
//
// Each slide maps to one CardExpandLayout variant from the Demo page:
//   4. Grid to Overlay — default variant, 2×2 grid → expanded + stacked sidebar
//   5. Center Popup   — centred overlay with backdrop blur
//   6. Sidebar Detail — persistent sidebar + detail area
//   7. Row to Split   — row → two-column split with mini-tabs
//
// All four use the same 4 items (Launch, Analytics, Security, Speed)
// with rich JSX detailContent defined in config/smart-card-items.tsx.
// ---------------------------------------------------------------------------

const scCards = FEATURE_ITEMS.slice(0, 4).map((fi) => ({
  ...fi,
  elementIds: [] as string[],
}));

// -- Slide 4: Grid to Overlay --

const slide4Group: GroupedAnimationConfig = {
  type: 'card-expand',
  items: scCards,
  stepDuration: 2000,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'click',
  presentationMode: 'auto-and-manual',
  cardExpandVariant: 'grid-to-overlay',
};

const slide4Header: SlideHeader = {
  id: 'h-slide-4',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6' } }),
    atom(eid(), 'text', 'Interactive', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide4ItemTree: SlideItem[] = [];

const slide4Elements = [
  { id: eid(), type: 'text' as const, content: 'Grid to Overlay', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#e2e8f0' } },
  { id: eid(), type: 'text' as const, content: 'Click a card to expand — remaining cards stack to the right', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#94a3b8' } },
];

// -- Slide 5: Center Popup --

const slide5Group: GroupedAnimationConfig = {
  type: 'card-expand',
  items: scCards,
  stepDuration: 2000,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'click',
  presentationMode: 'auto-and-manual',
  cardExpandVariant: 'center-popup',
};

const slide5Header: SlideHeader = {
  id: 'h-slide-5',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8b5cf6' } }),
    atom(eid(), 'text', 'Interactive', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide5ItemTree: SlideItem[] = [];

const slide5Elements = [
  { id: eid(), type: 'text' as const, content: 'Center Popup', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#e2e8f0' } },
  { id: eid(), type: 'text' as const, content: 'Expanded card as centered overlay with backdrop blur', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#94a3b8' } },
];

// -- Slide 6: Sidebar Detail --

const slide6Group: GroupedAnimationConfig = {
  type: 'card-expand',
  items: scCards,
  stepDuration: 2000,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'click',
  presentationMode: 'auto-and-manual',
  cardExpandVariant: 'sidebar-detail',
};

const slide6Header: SlideHeader = {
  id: 'h-slide-6',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#14b8a6' } }),
    atom(eid(), 'text', 'Interactive', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide6ItemTree: SlideItem[] = [];

const slide6Elements = [
  { id: eid(), type: 'text' as const, content: 'Sidebar Detail', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#e2e8f0' } },
  { id: eid(), type: 'text' as const, content: 'Cards become a sidebar — click to show detail in main area', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#94a3b8' } },
];

// -- Slide 7: Row to Split --

const slide7Group: GroupedAnimationConfig = {
  type: 'card-expand',
  items: scCards,
  stepDuration: 2000,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'click',
  presentationMode: 'auto-and-manual',
  cardExpandVariant: 'row-to-split',
};

const slide7Header: SlideHeader = {
  id: 'h-slide-7',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' } }),
    atom(eid(), 'text', 'Interactive', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide7ItemTree: SlideItem[] = [];

const slide7Elements = [
  { id: eid(), type: 'text' as const, content: 'Row to Split', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#e2e8f0' } },
  { id: eid(), type: 'text' as const, content: 'Single row of cards — click to expand into two-column split', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#94a3b8' } },
];


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
  {
    id: 'slide-1',
    order: 0,
    sectionId: 'section-layouts',
    title: 'Grid of Cards',
    subtitle: 'Auto-grid of FeatureCards with staggered entrance',
    icon: '🔲',
    content: 'Header + Grid 2×2 — feature cards grid',
    layoutTemplate: 'grid-2x2',
    header: slide1Header,
    animationTemplate: 'slide-title',
    items: slide1ItemTree,
    elements: slide1Elements,
    duration: 10000,
    transition: 'fade',
    groupedAnimation: slide1Group,
  },
  {
    id: 'slide-2',
    order: 1,
    sectionId: 'section-layouts',
    title: 'Sidebar Detail',
    subtitle: 'Click sidebar items to navigate detail view',
    icon: '📋',
    content: 'Header + Sidebar + Detail — sidebar navigation',
    layoutTemplate: 'sidebar-detail',
    header: slide2Header,
    animationTemplate: 'sidebar-detail',
    items: slide2ItemTree,
    elements: slide2Elements,
    duration: 14000,
    transition: 'fade',
    groupedAnimation: slide2Group,
  },
  {
    id: 'slide-3',
    order: 2,
    sectionId: 'section-layouts',
    title: 'Product Overview',
    subtitle: 'Core capabilities at a glance',
    icon: '📦',
    content: 'Static grid — 4 cards, no animation, no smart card',
    layoutTemplate: 'grid-2x2',
    header: slide3Header,
    animationTemplate: 'none',
    items: slide3ItemTree,
    elements: slide3Elements,
    duration: 5000,
    transition: 'fade',
  },
  {
    id: 'slide-4',
    order: 3,
    sectionId: 'section-smart-cards',
    title: 'Grid to Overlay',
    subtitle: 'Click a card to expand — remaining cards stack to the right',
    icon: '🃏',
    content: 'Smart Card — grid-to-overlay variant',
    layoutTemplate: 'grid-2x2',
    header: slide4Header,
    animationTemplate: 'smooth-fade',
    items: slide4ItemTree,
    elements: slide4Elements,
    duration: 12000,
    transition: 'fade',
    groupedAnimation: slide4Group,
  },
  {
    id: 'slide-5',
    order: 4,
    sectionId: 'section-smart-cards',
    title: 'Center Popup',
    subtitle: 'Expanded card as centered overlay with backdrop blur',
    icon: '🎯',
    content: 'Smart Card — center-popup variant',
    layoutTemplate: 'grid-2x2',
    header: slide5Header,
    animationTemplate: 'smooth-fade',
    items: slide5ItemTree,
    elements: slide5Elements,
    duration: 12000,
    transition: 'fade',
    groupedAnimation: slide5Group,
  },
  {
    id: 'slide-6',
    order: 5,
    sectionId: 'section-smart-cards',
    title: 'Sidebar Detail',
    subtitle: 'Cards become a sidebar — click to show detail in main area',
    icon: '📋',
    content: 'Smart Card — sidebar-detail variant',
    layoutTemplate: 'sidebar-detail',
    header: slide6Header,
    animationTemplate: 'smooth-fade',
    items: slide6ItemTree,
    elements: slide6Elements,
    duration: 12000,
    transition: 'fade',
    groupedAnimation: slide6Group,
  },
  {
    id: 'slide-7',
    order: 6,
    sectionId: 'section-smart-cards',
    title: 'Row to Split',
    subtitle: 'Single row of cards — click to expand into two-column split',
    icon: '🔀',
    content: 'Smart Card — row-to-split variant',
    layoutTemplate: 'center-band',
    header: slide7Header,
    animationTemplate: 'smooth-fade',
    items: slide7ItemTree,
    elements: slide7Elements,
    duration: 12000,
    transition: 'fade',
    groupedAnimation: slide7Group,
  },
];

// ---------------------------------------------------------------------------
// Demo Scripts
// ---------------------------------------------------------------------------

export const DEMO_SCRIPTS: SlideScript[] = [
  {
    slideId: 'slide-1',
    opening: { text: 'The GridOfCards layout — items appear one by one in a structured grid.', notes: 'Items grid layout.' },
    elements: s1Items.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title} — ${item.description}.`, notes: 'Grid item.' },
    })),
  },
  {
    slideId: 'slide-2',
    opening: { text: 'SidebarDetail — a left navigation panel with detailed content on the right.', notes: 'Sidebar-detail layout.' },
    elements: s2Items.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Sidebar item with detail.' },
    })),
  },
  {
    slideId: 'slide-3',
    opening: { text: 'Product Overview — a static grid of feature cards with no animation. Great as a simple overview slide.', notes: 'Static grid, no grouped animation.' },
    elements: s3Cards.map((item) => ({
      elementId: `s3-${item.id}`,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Static card.' },
    })),
  },
  {
    slideId: 'slide-4',
    opening: { text: 'Grid to Overlay — click any card to expand it. Remaining cards stack as a compact sidebar on the right.', notes: 'Card-expand: grid-to-overlay variant.' },
    elements: scCards.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Card-expand item — expand for detail.' },
    })),
  },
  {
    slideId: 'slide-5',
    opening: { text: 'Center Popup — the expanded card floats as a centred overlay with a backdrop blur; the grid is dimmed behind.', notes: 'Card-expand: center-popup variant.' },
    elements: scCards.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Card-expand item — popup overlay.' },
    })),
  },
  {
    slideId: 'slide-6',
    opening: { text: 'Sidebar Detail — cards collapse into a persistent sidebar. Click any card to show its detail in the main area.', notes: 'Card-expand: sidebar-detail variant.' },
    elements: scCards.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Card-expand item — sidebar navigation.' },
    })),
  },
  {
    slideId: 'slide-7',
    opening: { text: 'Row to Split — a single row of cards. Clicking one expands it into a two-column split with mini-tabs above.', notes: 'Card-expand: row-to-split variant.' },
    elements: scCards.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Card-expand item — row split.' },
    })),
  },
];
