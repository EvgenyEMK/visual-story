/**
 * Demo slide deck — 5 slides showcasing the slide-ui Layout patterns.
 *
 * Each slide demonstrates one layout composition from /en/ui-components:
 *   1. TitleSlide       — Title bar + body content
 *   2. GridOfCards      — Header + 2×2 grid of feature cards (items-grid)
 *   3. SidebarDetail    — Sidebar thumbnails + detail hero (sidebar-detail)
 *   4. HubSpoke         — Central hub + radial nodes
 *   5. StatDashboard    — Title bar + grid of stat cards (items-grid)
 *
 * Used by the Slide Editor and Slide Play dev pages.
 */

import type { Slide, SlideItem, AtomItem, LayoutItem, CardItem } from '@/types/slide';
import type { SlideScript } from '@/types/script';
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
// Slide 1 — TitleSlide Layout
// Title bar + body metric + progress bar representation
// ---------------------------------------------------------------------------

const s1TitleId = eid();
const s1SubtitleId = eid();
const s1MetricId = eid();
const s1LabelId = eid();
const s1DeltaId = eid();

const slide1Elements = [
  { id: s1TitleId, type: 'text' as const, content: 'Market Analysis 2025', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0.2, easing: 'ease-out' as const }, position: { x: 80, y: 40 }, style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: s1SubtitleId, type: 'text' as const, content: 'Quarterly performance & growth metrics', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.5, easing: 'ease-out' as const }, position: { x: 80, y: 90 }, style: { fontSize: 16, color: '#64748b' } },
  { id: s1MetricId, type: 'text' as const, content: '+34.7%', animation: { type: 'scale-in' as const, duration: 0.8, delay: 1.0, easing: 'spring' as const }, position: { x: 340, y: 220 }, style: { fontSize: 64, fontWeight: 'bold' as const, color: '#3b82f6', textAlign: 'center' as const } },
  { id: s1LabelId, type: 'text' as const, content: 'Revenue Growth', animation: { type: 'fade-in' as const, duration: 0.5, delay: 1.4, easing: 'ease-out' as const }, position: { x: 370, y: 310 }, style: { fontSize: 14, color: '#94a3b8', textAlign: 'center' as const } },
  { id: s1DeltaId, type: 'text' as const, content: '▲ On Track  •  Q4', animation: { type: 'fade-in' as const, duration: 0.4, delay: 1.6, easing: 'ease-out' as const }, position: { x: 370, y: 340 }, style: { fontSize: 12, color: '#22c55e', textAlign: 'center' as const } },
];

const slide1Items: SlideItem[] = slide1Elements.map((el) =>
  atom(el.id, el.type as AtomItem['atomType'], el.content, {
    animation: el.animation,
    position: el.position,
    style: el.style,
  }),
);

// ---------------------------------------------------------------------------
// Slide 2 — GridOfCards Layout (items-grid grouped)
// Header + 2×2 grid of feature cards
// ---------------------------------------------------------------------------

const s2Items = FEATURE_ITEMS.slice(0, 4).map((fi) => ({
  ...fi,
  elementIds: [] as string[],
}));

const slide2Group: GroupedAnimationConfig = {
  type: 'items-grid',
  items: s2Items,
  stepDuration: 1400,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide2Elements = [
  { id: eid(), type: 'text' as const, content: 'Grid of Cards', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Auto-grid of FeatureCards with staggered entrance', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#64748b' } },
];

const slide2ItemTree: SlideItem[] = [
  layout('s2-root', 'stack', [
    layout('s2-header', 'flex', [
      atom(slide2Elements[0].id, 'text', slide2Elements[0].content, { animation: slide2Elements[0].animation, style: slide2Elements[0].style }),
      atom(slide2Elements[1].id, 'text', slide2Elements[1].content, { animation: slide2Elements[1].animation, style: slide2Elements[1].style }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s2-grid', 'grid', s2Items.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon, { style: { fontSize: 30 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
      ], { style: { backgroundColor: `${gi.color}10`, borderRadius: 16, padding: 16 } }),
    ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];

// ---------------------------------------------------------------------------
// Slide 3 — SidebarDetail Layout (sidebar-detail overlay)
// Left sidebar with thumbnails + right detail hero
// ---------------------------------------------------------------------------

const s3Items = FEATURE_ITEMS.map((fi) => ({
  ...fi,
  elementIds: [] as string[],
}));

const slide3Group: GroupedAnimationConfig = {
  type: 'list-accumulator',
  items: s3Items,
  stepDuration: 2000,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide3Elements = [
  { id: eid(), type: 'text' as const, content: 'Sidebar Detail', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 15 }, style: { fontSize: 24, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Click sidebar items to navigate detail view', animation: { type: 'fade-in' as const, duration: 0.4, delay: 0.2, easing: 'ease-out' as const }, position: { x: 80, y: 48 }, style: { fontSize: 13, color: '#94a3b8' } },
];

const slide3ItemTree: SlideItem[] = [
  layout('s3-root', 'stack', [
    layout('s3-header', 'flex', [
      atom(slide3Elements[0].id, 'text', slide3Elements[0].content, { animation: slide3Elements[0].animation, style: slide3Elements[0].style }),
      atom(slide3Elements[1].id, 'text', slide3Elements[1].content, { animation: slide3Elements[1].animation, style: slide3Elements[1].style }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s3-content', 'sidebar', [
      layout('s3-sidebar', 'stack', s3Items.map((gi) =>
        card(gi.id, [
          atom(`${gi.id}-icon`, 'icon', gi.icon, { style: { fontSize: 16 } }),
          atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
        ], { style: { padding: 8, borderRadius: 8 } }),
      ), { layoutConfig: { direction: 'column', gap: 6 } }),
      layout('s3-detail', 'flex', s3Items.map((gi) =>
        card(`${gi.id}-detail`, [
          atom(`${gi.id}-d-icon`, 'icon', gi.icon, { style: { fontSize: 24 } }),
          atom(`${gi.id}-d-title`, 'text', gi.title, { style: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' } }),
          atom(`${gi.id}-d-desc`, 'text', gi.description, { style: { fontSize: 14, color: '#64748b' } }),
        ], { style: { padding: 24, borderRadius: 12 } }),
      ), { layoutConfig: { direction: 'column', gap: 16 } }),
    ], { layoutConfig: { sidebarWidth: '180px' } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];


// ---------------------------------------------------------------------------
// Slide 7 — HubSpoke Layout
// Central hub with radial spoke nodes (approximated with absolute pos)
// ---------------------------------------------------------------------------

const s7CenterId = eid();

const slide7Elements = [
  { id: eid(), type: 'text' as const, content: 'Hub & Spoke', animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 30 }, style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Central hub with radial spoke nodes', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 80 }, style: { fontSize: 16, color: '#64748b' } },
  { id: s7CenterId, type: 'shape' as const, content: 'Core', animation: { type: 'scale-in' as const, duration: 0.6, delay: 0.6, easing: 'spring' as const }, position: { x: 430, y: 240 }, style: { width: 80, height: 80, backgroundColor: '#3b82f6', borderRadius: 40, fontSize: 16, fontWeight: 'bold' as const, color: '#ffffff', textAlign: 'center' as const } },
];

// Spoke positions (absolute, arranged radially around center 470, 280)
const spokePositions = [
  { x: 310, y: 140 },
  { x: 570, y: 140 },
  { x: 260, y: 310 },
  { x: 620, y: 310 },
  { x: 440, y: 380 },
];

const slide7SpokeElements = FEATURE_ITEMS.map((fi, i) => ({
  id: fi.id,
  type: 'shape' as const,
  content: `${fi.icon}\n${fi.title}`,
  animation: { type: 'scale-in' as const, duration: 0.5, delay: 0.8 + i * 0.2, easing: 'spring' as const },
  position: spokePositions[i],
  style: { width: 90, height: 70, backgroundColor: `${fi.color}15`, borderRadius: 16, fontSize: 11, color: '#334155', textAlign: 'center' as const, borderWidth: 2, borderColor: `${fi.color}40` },
}));

const slide7AllElements = [...slide7Elements, ...slide7SpokeElements];

const slide7Items: SlideItem[] = slide7AllElements.map((el) =>
  atom(el.id, el.type as AtomItem['atomType'], el.content, {
    animation: el.animation,
    position: el.position,
    style: el.style,
  }),
);

// ---------------------------------------------------------------------------
// Slide 8 — StatDashboard Layout (items-grid grouped)
// Title bar + grid of stat metric cards
// ---------------------------------------------------------------------------

const s8Stats = [
  { id: eid(), icon: '💰', title: '$2.4M Revenue', description: '+27% YoY — exceeding targets', color: '#3b82f6', elementIds: [] as string[] },
  { id: eid(), icon: '👥', title: '1,247 Users', description: '+12% growth — strong acquisition', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '⬆️', title: '94% Uptime', description: 'On track — zero critical incidents', color: '#14b8a6', elementIds: [] as string[] },
  { id: eid(), icon: '⭐', title: '4.8 Rating', description: 'Customer satisfaction at all-time high', color: '#f59e0b', elementIds: [] as string[] },
];

const slide8Group: GroupedAnimationConfig = {
  type: 'items-grid',
  items: s8Stats,
  stepDuration: 1400,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide8Elements = [
  { id: eid(), type: 'text' as const, content: 'Stat Dashboard', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Grid of metric cards for KPI slides', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#64748b' } },
];

const slide8ItemTree: SlideItem[] = [
  layout('s8-root', 'stack', [
    layout('s8-header', 'flex', [
      atom(slide8Elements[0].id, 'text', slide8Elements[0].content, { animation: slide8Elements[0].animation, style: slide8Elements[0].style }),
      atom(slide8Elements[1].id, 'text', slide8Elements[1].content, { animation: slide8Elements[1].animation, style: slide8Elements[1].style }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s8-grid', 'grid', s8Stats.map((st) =>
      card(st.id, [
        atom(`${st.id}-icon`, 'icon', st.icon, { style: { fontSize: 28 } }),
        atom(`${st.id}-title`, 'text', st.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
      ], { style: { backgroundColor: `${st.color}10`, borderRadius: 16, padding: 16 } }),
    ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];


// ---------------------------------------------------------------------------
// Demo Slides Array
// ---------------------------------------------------------------------------

export const DEMO_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    order: 0,
    content: 'TitleSlide — Title bar with metric body content',
    animationTemplate: 'smooth-fade',
    items: slide1Items,
    elements: slide1Elements,
    duration: 6000,
    transition: 'fade',
  },
  {
    id: 'slide-2',
    order: 1,
    content: 'GridOfCards — 2×2 grid of feature cards',
    animationTemplate: 'slide-title',
    items: slide2ItemTree,
    elements: slide2Elements,
    duration: 10000,
    transition: 'fade',
    groupedAnimation: slide2Group,
  },
  {
    id: 'slide-3',
    order: 2,
    content: 'SidebarDetail — sidebar navigation with detail view',
    animationTemplate: 'sidebar-detail',
    items: slide3ItemTree,
    elements: slide3Elements,
    duration: 14000,
    transition: 'fade',
    groupedAnimation: slide3Group,
  },
  {
    id: 'slide-4',
    order: 3,
    content: 'HubSpoke — central hub with radial spoke nodes',
    animationTemplate: 'smooth-fade',
    items: slide7Items,
    elements: slide7AllElements,
    duration: 8000,
    transition: 'fade',
  },
  {
    id: 'slide-5',
    order: 4,
    content: 'StatDashboard — grid of metric KPI cards',
    animationTemplate: 'slide-title',
    items: slide8ItemTree,
    elements: slide8Elements,
    duration: 10000,
    transition: 'fade',
    groupedAnimation: slide8Group,
  },
];

// ---------------------------------------------------------------------------
// Demo Scripts
// ---------------------------------------------------------------------------

export const DEMO_SCRIPTS: SlideScript[] = [
  {
    slideId: 'slide-1',
    opening: { text: 'Welcome to the TitleSlide layout — a classic title bar with centered metrics.', notes: 'Title slide with metric display.' },
    elements: [
      { elementId: s1TitleId, label: 'Title', script: { text: 'Market Analysis 2025 — our quarterly performance report.', notes: 'Main heading.' } },
      { elementId: s1SubtitleId, label: 'Subtitle', script: { text: 'Quarterly performance and growth metrics at a glance.', notes: 'Subtitle.' } },
      { elementId: s1MetricId, label: 'Metric', script: { text: 'Revenue growth of 34.7 percent — a strong quarter.', notes: 'Big metric.' } },
      { elementId: s1LabelId, label: 'Label', script: { text: 'Revenue Growth — our north-star metric.', notes: 'Metric label.' } },
      { elementId: s1DeltaId, label: 'Delta', script: { text: 'On track, Q4 results are in.', notes: 'Status.' } },
    ],
  },
  {
    slideId: 'slide-2',
    opening: { text: 'The GridOfCards layout — items appear one by one in a structured grid.', notes: 'Items grid layout.' },
    elements: s2Items.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title} — ${item.description}.`, notes: 'Grid item.' },
    })),
  },
  {
    slideId: 'slide-3',
    opening: { text: 'SidebarDetail — a left navigation panel with detailed content on the right.', notes: 'Sidebar-detail layout.' },
    elements: s3Items.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}`, notes: 'Sidebar item with detail.' },
    })),
  },
  {
    slideId: 'slide-4',
    opening: { text: 'HubSpoke — a central hub with radial nodes for architecture or concept diagrams.', notes: 'Hub-spoke layout.' },
    elements: FEATURE_ITEMS.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title} — ${item.description}.`, notes: 'Spoke node.' },
    })),
  },
  {
    slideId: 'slide-5',
    opening: { text: 'StatDashboard — key performance indicators displayed in a clean grid.', notes: 'Stat dashboard.' },
    elements: s8Stats.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}.`, notes: 'KPI card.' },
    })),
  },
];
