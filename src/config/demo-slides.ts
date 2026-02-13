/**
 * Demo slide deck — 5 slides showcasing the slide-ui Layout patterns.
 *
 * Each slide demonstrates a layout template and uses the new data model:
 *   - slide.title / subtitle / icon — slide-level metadata
 *   - slide.header — optional SlideHeader for the title-bar region
 *   - slide.layoutTemplate — which layout template the slide uses
 *   - slide.items — content region item tree (separate from header)
 *
 * Slides:
 *   1. Center Stage      — Big metric with no header (center-stage layout)
 *   2. Grid 2×2          — Title bar + 2×2 feature card grid (grid-2x2 + header)
 *   3. Sidebar + Detail  — Title bar + sidebar navigation + detail (sidebar-detail + header)
 *   4. Two Columns       — Title on left, hub-spoke diagram on right (two-column)
 *   5. Content           — Title bar + stat dashboard grid (content + header)
 *
 * Used by the Slide Editor and Slide Play dev pages.
 */

import type { Slide, SlideItem, AtomItem, LayoutItem, CardItem, SlideHeader } from '@/types/slide';
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
// Slide 1 — Center Stage Layout (no header)
// Big centered metric — title/subtitle shown inside content
// ---------------------------------------------------------------------------

const s1MetricId = eid();
const s1LabelId = eid();
const s1DeltaId = eid();

const slide1Items: SlideItem[] = [
  layout('s1-root', 'flex', [
    atom(s1MetricId, 'text', '+34.7%', {
      animation: { type: 'scale-in', duration: 0.8, delay: 0.6, easing: 'spring' },
      style: { fontSize: 64, fontWeight: 'bold', color: '#3b82f6', textAlign: 'center' },
    }),
    atom(s1LabelId, 'text', 'Revenue Growth', {
      animation: { type: 'fade-in', duration: 0.5, delay: 1.0, easing: 'ease-out' },
      style: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
    }),
    atom(s1DeltaId, 'text', '▲ On Track  •  Q4', {
      animation: { type: 'fade-in', duration: 0.4, delay: 1.2, easing: 'ease-out' },
      style: { fontSize: 12, color: '#22c55e', textAlign: 'center' },
    }),
  ], { layoutConfig: { direction: 'column', align: 'center', justify: 'center', gap: 12 } }),
];

// Legacy elements for backward compat
const slide1Elements = [
  { id: s1MetricId, type: 'text' as const, content: '+34.7%', animation: { type: 'scale-in' as const, duration: 0.8, delay: 0.6, easing: 'spring' as const }, position: { x: 340, y: 200 }, style: { fontSize: 64, fontWeight: 'bold' as const, color: '#3b82f6', textAlign: 'center' as const } },
  { id: s1LabelId, type: 'text' as const, content: 'Revenue Growth', animation: { type: 'fade-in' as const, duration: 0.5, delay: 1.0, easing: 'ease-out' as const }, position: { x: 370, y: 290 }, style: { fontSize: 14, color: '#94a3b8', textAlign: 'center' as const } },
  { id: s1DeltaId, type: 'text' as const, content: '▲ On Track  •  Q4', animation: { type: 'fade-in' as const, duration: 0.4, delay: 1.2, easing: 'ease-out' as const }, position: { x: 370, y: 320 }, style: { fontSize: 12, color: '#22c55e', textAlign: 'center' as const } },
];

// ---------------------------------------------------------------------------
// Slide 2 — Header + Grid 2×2 (items-grid grouped)
// Title bar + 2×2 grid of feature cards
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
  layout('s2-grid', 'grid', s2Items.map((gi) =>
    card(gi.id, [
      atom(`${gi.id}-icon`, 'icon', gi.icon, { style: { fontSize: 30 } }),
      atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
    ], { style: { backgroundColor: `${gi.color}10`, borderRadius: 16, padding: 16 } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

// Legacy elements for backward compat
const slide2Elements = [
  { id: eid(), type: 'text' as const, content: 'Grid of Cards', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Auto-grid of FeatureCards with staggered entrance', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#64748b' } },
];

// ---------------------------------------------------------------------------
// Slide 3 — Header + Sidebar + Detail (sidebar-detail overlay)
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

const slide3Header: SlideHeader = {
  id: 'h-slide-3',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' } }),
    atom(eid(), 'text', 'Active', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide3ItemTree: SlideItem[] = [
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
];

// Legacy elements
const slide3Elements = [
  { id: eid(), type: 'text' as const, content: 'Sidebar Detail', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 15 }, style: { fontSize: 24, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Click sidebar items to navigate detail view', animation: { type: 'fade-in' as const, duration: 0.4, delay: 0.2, easing: 'ease-out' as const }, position: { x: 80, y: 48 }, style: { fontSize: 13, color: '#94a3b8' } },
];


// ---------------------------------------------------------------------------
// Slide 4 — Two-Column Layout (no header)
// Left pane: title + subtitle. Right pane: hub-spoke diagram.
// ---------------------------------------------------------------------------

const s4CenterId = eid();

// Spoke positions (relative to a 480×540 right pane, centered)
const spokePositions = [
  { x: 70, y: 120 },
  { x: 310, y: 120 },
  { x: 30, y: 290 },
  { x: 360, y: 290 },
  { x: 190, y: 380 },
];

const slide4LeftItems: SlideItem[] = [
  layout('s4-left-content', 'flex', [
    atom(eid(), 'text', '🌐', { style: { fontSize: 48 } }),
    atom(eid(), 'text', 'Hub & Spoke', {
      animation: { type: 'fade-in', duration: 0.8, delay: 0, easing: 'ease-out' },
      style: { fontSize: 32, fontWeight: 'bold', color: '#1e293b' },
    }),
    atom(eid(), 'text', 'Central hub with radial spoke nodes for architecture and concept diagrams', {
      animation: { type: 'fade-in', duration: 0.6, delay: 0.3, easing: 'ease-out' },
      style: { fontSize: 14, color: '#64748b' },
    }),
  ], { layoutConfig: { direction: 'column', align: 'start', justify: 'center', gap: 16 }, style: { padding: 40 } }),
];

const slide4RightItems: SlideItem[] = [
  // Center hub
  atom(s4CenterId, 'shape', 'Core', {
    animation: { type: 'scale-in', duration: 0.6, delay: 0.6, easing: 'spring' },
    position: { x: 170, y: 210 },
    style: { width: 80, height: 80, backgroundColor: '#3b82f6', borderRadius: 40, fontSize: 16, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
  }),
  // Spoke nodes
  ...FEATURE_ITEMS.map((fi, i) =>
    atom(fi.id, 'shape', `${fi.icon}\n${fi.title}`, {
      animation: { type: 'scale-in', duration: 0.5, delay: 0.8 + i * 0.2, easing: 'spring' },
      position: spokePositions[i],
      style: { width: 90, height: 70, backgroundColor: `${fi.color}15`, borderRadius: 16, fontSize: 11, color: '#334155', textAlign: 'center', borderWidth: 2, borderColor: `${fi.color}40` },
    }),
  ),
];

const slide4Items: SlideItem[] = [
  layout('s4-root', 'split', [
    layout('s4-left', 'flex', slide4LeftItems, { layoutConfig: { direction: 'column' } }),
    layout('s4-right', 'flex', slide4RightItems, { layoutConfig: { direction: 'column' } }),
  ], { layoutConfig: { direction: 'row' } }),
];

// Legacy elements
const slide4AllElements = [
  { id: eid(), type: 'text' as const, content: 'Hub & Spoke', animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 30 }, style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Central hub with radial spoke nodes', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 80 }, style: { fontSize: 16, color: '#64748b' } },
  { id: s4CenterId, type: 'shape' as const, content: 'Core', animation: { type: 'scale-in' as const, duration: 0.6, delay: 0.6, easing: 'spring' as const }, position: { x: 430, y: 240 }, style: { width: 80, height: 80, backgroundColor: '#3b82f6', borderRadius: 40, fontSize: 16, fontWeight: 'bold' as const, color: '#ffffff', textAlign: 'center' as const } },
  ...FEATURE_ITEMS.map((fi, i) => ({
    id: fi.id,
    type: 'shape' as const,
    content: `${fi.icon}\n${fi.title}`,
    animation: { type: 'scale-in' as const, duration: 0.5, delay: 0.8 + i * 0.2, easing: 'spring' as const },
    position: { x: spokePositions[i].x + 480, y: spokePositions[i].y },
    style: { width: 90, height: 70, backgroundColor: `${fi.color}15`, borderRadius: 16, fontSize: 11, color: '#334155', textAlign: 'center' as const, borderWidth: 2, borderColor: `${fi.color}40` },
  })),
];

// ---------------------------------------------------------------------------
// Slide 5 — Header + Content (stat dashboard, items-grid grouped)
// Title bar + grid of stat metric cards
// ---------------------------------------------------------------------------

const s5Stats = [
  { id: eid(), icon: '💰', title: '$2.4M Revenue', description: '+27% YoY — exceeding targets', color: '#3b82f6', elementIds: [] as string[] },
  { id: eid(), icon: '👥', title: '1,247 Users', description: '+12% growth — strong acquisition', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '⬆️', title: '94% Uptime', description: 'On track — zero critical incidents', color: '#14b8a6', elementIds: [] as string[] },
  { id: eid(), icon: '⭐', title: '4.8 Rating', description: 'Customer satisfaction at all-time high', color: '#f59e0b', elementIds: [] as string[] },
];

const slide5Group: GroupedAnimationConfig = {
  type: 'items-grid',
  items: s5Stats,
  stepDuration: 1400,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide5Header: SlideHeader = {
  id: 'h-slide-5',
  variant: 'title-bar',
  trailing: [
    atom(eid(), 'shape', '', { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' } }),
    atom(eid(), 'text', 'Q4 2025', { style: { fontSize: 10, color: '#94a3b8' } }),
  ],
  size: 'md',
  bordered: true,
};

const slide5ItemTree: SlideItem[] = [
  layout('s5-grid', 'grid', s5Stats.map((st) =>
    card(st.id, [
      atom(`${st.id}-icon`, 'icon', st.icon, { style: { fontSize: 28 } }),
      atom(`${st.id}-title`, 'text', st.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
    ], { style: { backgroundColor: `${st.color}10`, borderRadius: 16, padding: 16 } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

// Legacy elements
const slide5Elements = [
  { id: eid(), type: 'text' as const, content: 'Stat Dashboard', animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const }, position: { x: 80, y: 20 }, style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' } },
  { id: eid(), type: 'text' as const, content: 'Grid of metric cards for KPI slides', animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const }, position: { x: 80, y: 58 }, style: { fontSize: 14, color: '#64748b' } },
];


// ---------------------------------------------------------------------------
// Demo Slides Array
// ---------------------------------------------------------------------------

export const DEMO_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    order: 0,
    title: 'Market Analysis 2025',
    subtitle: 'Quarterly performance & growth metrics',
    icon: '📈',
    content: 'Center Stage — Big centered metric',
    layoutTemplate: 'center-stage',
    // No header — title is displayed by the center-stage content itself
    animationTemplate: 'smooth-fade',
    items: slide1Items,
    elements: slide1Elements,
    duration: 6000,
    transition: 'fade',
  },
  {
    id: 'slide-2',
    order: 1,
    title: 'Grid of Cards',
    subtitle: 'Auto-grid of FeatureCards with staggered entrance',
    icon: '🔲',
    content: 'Header + Grid 2×2 — feature cards grid',
    layoutTemplate: 'grid-2x2',
    header: slide2Header,
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
    title: 'Sidebar Detail',
    subtitle: 'Click sidebar items to navigate detail view',
    icon: '📋',
    content: 'Header + Sidebar + Detail — sidebar navigation',
    layoutTemplate: 'sidebar-detail',
    header: slide3Header,
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
    title: 'Hub & Spoke',
    subtitle: 'Central hub with radial spoke nodes',
    icon: '🌐',
    content: 'Two Columns — title on left, hub-spoke on right',
    layoutTemplate: 'two-column',
    // No header — title is shown in the left column
    animationTemplate: 'smooth-fade',
    items: slide4Items,
    elements: slide4AllElements,
    duration: 8000,
    transition: 'fade',
  },
  {
    id: 'slide-5',
    order: 4,
    title: 'Stat Dashboard',
    subtitle: 'Grid of metric cards for KPI slides',
    icon: '📊',
    content: 'Header + Content — stat dashboard grid',
    layoutTemplate: 'content',
    header: slide5Header,
    animationTemplate: 'slide-title',
    items: slide5ItemTree,
    elements: slide5Elements,
    duration: 10000,
    transition: 'fade',
    groupedAnimation: slide5Group,
  },
];

// ---------------------------------------------------------------------------
// Demo Scripts
// ---------------------------------------------------------------------------

export const DEMO_SCRIPTS: SlideScript[] = [
  {
    slideId: 'slide-1',
    opening: { text: 'Market Analysis 2025 — our quarterly performance report.', notes: 'Center-stage title slide with big metric.' },
    elements: [
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
    opening: { text: 'HubSpoke — a central hub with radial nodes for architecture or concept diagrams.', notes: 'Two-column layout: title left, diagram right.' },
    elements: FEATURE_ITEMS.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title} — ${item.description}.`, notes: 'Spoke node.' },
    })),
  },
  {
    slideId: 'slide-5',
    opening: { text: 'StatDashboard — key performance indicators displayed in a clean grid.', notes: 'Header + content stat dashboard.' },
    elements: s5Stats.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: { text: `${item.title}: ${item.description}.`, notes: 'KPI card.' },
    })),
  },
];
