/**
 * Demo slide deck — showcasing popup callouts, menu/tab navigation, and layouts.
 *
 * All slides use the data model exclusively:
 *   - slide.items  — content region item tree
 *   - slide.scenes — animation scenes with widget state layers
 *
 * Slides:
 *   1. Popup Callout (step-driven)  — Grid of cards with detail popup shown on each step
 *   2. Popup Callout (click-only)   — Same grid, popup only on direct card click
 *   3. Sidebar Menu                 — Side menu with scene-per-item navigation
 *   4. Tab Navigation               — Top tabs with scene-per-tab navigation
 *   5. Grid 2×2                     — Feature card grid with sequential reveal
 *   6. Sidebar + Detail             — Sidebar navigation with sequential reveal
 *   7. Static Grid                  — No animation
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

/** Feature items used across layout slides. */
const FEATURE_ITEMS = [
  { id: 'fi-launch', icon: '🚀', title: 'Launch', description: 'Ship features faster with streamlined deployment pipelines', color: '#3b82f6' },
  { id: 'fi-analytics', icon: '📊', title: 'Analytics', description: 'Real-time insights and dashboards for data-driven decisions', color: '#8b5cf6' },
  { id: 'fi-security', icon: '🔒', title: 'Security', description: 'Enterprise-grade encryption and compliance built in', color: '#14b8a6' },
  { id: 'fi-speed', icon: '⚡', title: 'Speed', description: '10x faster processing with optimized infrastructure', color: '#f59e0b' },
  { id: 'fi-targeting', icon: '🎯', title: 'Targeting', description: 'Precision audience segmentation and personalization', color: '#ef4444' },
];

/** Smart card metadata — used for popup and menu slides. */
const SC_META = [
  { id: 'sc-launch', icon: '🚀', title: 'Launch', description: 'Ship features faster', color: '#3b82f6' },
  { id: 'sc-analytics', icon: '📊', title: 'Analytics', description: 'Data-driven decisions', color: '#8b5cf6' },
  { id: 'sc-security', icon: '🔒', title: 'Security', description: 'Enterprise-grade protection', color: '#14b8a6' },
  { id: 'sc-speed', icon: '⚡', title: 'Speed', description: '10x faster processing', color: '#f59e0b' },
];

// ---------------------------------------------------------------------------
// Detail items for popup cards (replaces JSX detailContent)
// ---------------------------------------------------------------------------

const DETAIL_ITEMS: Record<string, SlideItem[]> = {
  'sc-launch': [
    atom('d-launch-h', 'text', 'Deployment Pipeline', { style: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8' } }),
    atom('d-launch-1', 'text', '✅ CI/CD setup', { style: { fontSize: 10, color: '#94a3b8' } }),
    atom('d-launch-2', 'text', '✅ Staging deploy', { style: { fontSize: 10, color: '#94a3b8' } }),
    atom('d-launch-3', 'text', '⬚ Prod release', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-launch-4', 'text', '⬚ Rollback plan', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-launch-f', 'text', '2 of 4 tasks complete', { style: { fontSize: 9, color: '#64748b' } }),
  ],
  'sc-analytics': [
    atom('d-analytics-h', 'text', 'Key Metrics', { style: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8' } }),
    atom('d-analytics-1', 'text', 'DAU: 12.4K (+8%)', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-analytics-2', 'text', 'Retention: 67% (+3%)', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-analytics-3', 'text', 'ARPU: $4.20 (+12%)', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-analytics-4', 'text', 'Churn: 2.1% (-0.5%)', { style: { fontSize: 10, color: '#e2e8f0' } }),
  ],
  'sc-security': [
    atom('d-security-h', 'text', 'Compliance Status', { style: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8' } }),
    atom('d-security-1', 'text', 'SOC 2 Type II — Certified ✅', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-security-2', 'text', 'GDPR — Compliant ✅', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-security-3', 'text', 'ISO 27001 — In Progress ⏳', { style: { fontSize: 10, color: '#fbbf24' } }),
  ],
  'sc-speed': [
    atom('d-speed-h', 'text', 'Performance', { style: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8' } }),
    atom('d-speed-1', 'text', 'API Latency: 42ms (95th pctl)', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-speed-2', 'text', 'Throughput: 8.2K req/s', { style: { fontSize: 10, color: '#e2e8f0' } }),
    atom('d-speed-3', 'text', 'Cache Hit Rate: 97.3%', { style: { fontSize: 10, color: '#e2e8f0' } }),
  ],
};

// ---------------------------------------------------------------------------
// Slide 1 — Popup Callout (step-driven)
//
// Grid of cards. Each step focuses a card and shows its DetailPopup.
// Clicking anywhere on the slide (or auto-play) advances to the next card.
// ---------------------------------------------------------------------------

function buildPopupCards(prefix: string): SlideItem[] {
  return [
    layout(`${prefix}-grid`, 'grid', SC_META.map((m) =>
      card(m.id, [
        atom(`${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 30 } }),
        atom(`${m.id}-title`, 'text', m.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' } }),
        atom(`${m.id}-desc`, 'text', m.description, { style: { fontSize: 11, color: '#94a3b8' } }),
      ], {
        style: { backgroundColor: `${m.color}10`, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: `${m.color}25` },
        detailItems: DETAIL_ITEMS[m.id],
      }),
    ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
  ];
}

const slide1Items = buildPopupCards('s1');

const slide1Scenes: Scene[] = [{
  id: 'slide-1-scene-0',
  title: 'Popup Callout',
  icon: '💬',
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
}];

// ---------------------------------------------------------------------------
// Slide 2 — Popup Callout (click-only)
//
// Same grid. Popup shown ONLY on direct card click, NOT via step advance.
// Clicking the slide background advances to next slide normally.
// ---------------------------------------------------------------------------

const slide2Items = buildPopupCards('s2');

const slide2Scenes: Scene[] = [{
  id: 'slide-2-scene-0',
  title: 'Click-Only Popup',
  icon: '🖱️',
  order: 0,
  widgetStateLayer: {
    initialStates: SC_META.map((m) => ({
      widgetId: m.id,
      visible: true,
      isFocused: false,
      displayMode: 'normal' as const,
    })),
    enterBehavior: {
      revealMode: 'all-at-once',
      animationType: 'fade-in',
      duration: 0.4,
      easing: 'ease-out',
    },
    interactionBehaviors: [{
      trigger: 'click',
      action: 'toggle-expand',
      targetDisplayMode: 'expanded' as const,
      exclusive: true,
      availableInAutoMode: false,
    }],
    animatedWidgetIds: SC_META.map((m) => m.id),
  },
}];

// ---------------------------------------------------------------------------
// Slide 3 — Sidebar Menu (scene-per-item navigation)
//
// Left sidebar = persistent menu. Right panel = content for selected item.
// Each menu item maps to a Scene via activatedByWidgetIds.
// Clicking a menu item jumps to that scene.
// ---------------------------------------------------------------------------

const slide3Items: SlideItem[] = [
  layout('s3-content', 'sidebar', [
    // Menu sidebar (always visible in every scene)
    layout('s3-menu', 'stack', SC_META.map((m) =>
      card(`s3-menu-${m.id}`, [
        atom(`s3-m-${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 18 } }),
        atom(`s3-m-${m.id}-title`, 'text', m.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
      ], { style: { padding: 10, borderRadius: 8, backgroundColor: `${m.color}10` } }),
    ), { layoutConfig: { direction: 'column', gap: 8 } }),
    // Detail panels (one per menu item — visibility controlled by scenes)
    ...SC_META.map((m) =>
      card(`s3-detail-${m.id}`, [
        atom(`s3-d-${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 36 } }),
        atom(`s3-d-${m.id}-title`, 'text', m.title, { style: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`s3-d-${m.id}-desc`, 'text', m.description, { style: { fontSize: 14, color: '#64748b' } }),
        ...(DETAIL_ITEMS[m.id] ?? []),
      ], { style: { padding: 32, borderRadius: 12 } }),
    ),
  ], { layoutConfig: { sidebarWidth: '160px' } }),
];

const slide3Scenes: Scene[] = SC_META.map((item, i) => ({
  id: `slide-3-scene-${i}`,
  title: item.title,
  icon: item.icon,
  description: item.description,
  order: i,
  activatedByWidgetIds: [`s3-menu-${item.id}`],
  widgetStateLayer: {
    initialStates: SC_META.map((m) => ({
      widgetId: `s3-detail-${m.id}`,
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
    animatedWidgetIds: [`s3-detail-${item.id}`],
  },
}));

// ---------------------------------------------------------------------------
// Slide 4 — Tab Navigation (scene-per-tab)
//
// Top tab bar = clickable tabs. Below = content for selected tab.
// Each tab maps to a Scene via activatedByWidgetIds.
// ---------------------------------------------------------------------------

const slide4Items: SlideItem[] = [
  layout('s4-content', 'stack', [
    // Tab bar at top — each tab is a card wrapping a row layout for icon + text in one line
    layout('s4-tabs', 'flex', SC_META.map((m) =>
      card(`s4-tab-${m.id}`, [
        layout(`s4-tab-${m.id}-row`, 'flex', [
          atom(`s4-t-${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 14 } }),
          atom(`s4-t-${m.id}-title`, 'text', m.title, { style: { fontSize: 11, fontWeight: 'bold' } }),
        ], { layoutConfig: { direction: 'row', gap: 6, align: 'center' } }),
      ], { style: { padding: 6, borderRadius: 8, backgroundColor: `${m.color}10` } }),
    ), { layoutConfig: { direction: 'row', gap: 8 } }),
    // Tab content panels (one per tab — visibility controlled by scenes)
    ...SC_META.map((m) =>
      card(`s4-panel-${m.id}`, [
        atom(`s4-p-${m.id}-icon`, 'icon', m.icon, { style: { fontSize: 36 } }),
        atom(`s4-p-${m.id}-title`, 'text', m.title, { style: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`s4-p-${m.id}-desc`, 'text', m.description, { style: { fontSize: 14, color: '#64748b' } }),
        ...(DETAIL_ITEMS[m.id] ?? []),
      ], { style: { padding: 32, borderRadius: 12, backgroundColor: `${m.color}08` } }),
    ),
  ], { layoutConfig: { direction: 'column', gap: 12 }, style: { padding: 16 } }),
];

const slide4Scenes: Scene[] = SC_META.map((item, i) => ({
  id: `slide-4-scene-${i}`,
  title: item.title,
  icon: item.icon,
  description: item.description,
  order: i,
  activatedByWidgetIds: [`s4-tab-${item.id}`],
  widgetStateLayer: {
    initialStates: SC_META.map((m) => ({
      widgetId: `s4-panel-${m.id}`,
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
    animatedWidgetIds: [`s4-panel-${item.id}`],
  },
}));

// ---------------------------------------------------------------------------
// Slide 5 — Grid 2×2 (sequential reveal)
// ---------------------------------------------------------------------------

const s5Cards = FEATURE_ITEMS.slice(0, 4);

const slide5Items: SlideItem[] = [
  layout('s5-grid', 'grid', s5Cards.map((fi) =>
    card(fi.id, [
      atom(`${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 30 } }),
      atom(`${fi.id}-title`, 'text', fi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
    ], { style: { backgroundColor: `${fi.color}10`, borderRadius: 16, padding: 16 } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide5Scenes: Scene[] = [{
  id: 'slide-5-scene-0',
  title: 'Grid of Cards',
  icon: '🔲',
  order: 0,
  widgetStateLayer: {
    initialStates: s5Cards.map((fi) => ({
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
    animatedWidgetIds: s5Cards.map((fi) => fi.id),
  },
  triggerMode: 'auto',
}];

// ---------------------------------------------------------------------------
// Slide 6 — Sidebar + Detail (sequential reveal)
// ---------------------------------------------------------------------------

const slide6Items: SlideItem[] = [
  layout('s6-content', 'sidebar', [
    layout('s6-sidebar', 'stack', FEATURE_ITEMS.map((fi) =>
      card(fi.id, [
        atom(`${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 16 } }),
        atom(`${fi.id}-title`, 'text', fi.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
      ], { style: { padding: 8, borderRadius: 8 } }),
    ), { layoutConfig: { direction: 'column', gap: 6 } }),
    layout('s6-detail', 'flex', FEATURE_ITEMS.map((fi) =>
      card(`${fi.id}-detail`, [
        atom(`${fi.id}-d-icon`, 'icon', fi.icon, { style: { fontSize: 24 } }),
        atom(`${fi.id}-d-title`, 'text', fi.title, { style: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${fi.id}-d-desc`, 'text', fi.description, { style: { fontSize: 14, color: '#64748b' } }),
      ], { style: { padding: 24, borderRadius: 12 } }),
    ), { layoutConfig: { direction: 'column', gap: 16 } }),
  ], { layoutConfig: { sidebarWidth: '180px' } }),
];

const slide6Scenes: Scene[] = [{
  id: 'slide-6-scene-0',
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
// Slide 7 — Static Grid (no animation)
// ---------------------------------------------------------------------------

const s7Cards = FEATURE_ITEMS.slice(0, 4);

const slide7Items: SlideItem[] = [
  layout('s7-grid', 'grid', s7Cards.map((fi) =>
    card(`s7-${fi.id}`, [
      atom(`s7-${fi.id}-icon`, 'icon', fi.icon, { style: { fontSize: 30 } }),
      atom(`s7-${fi.id}-title`, 'text', fi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0' } }),
    ], { style: { backgroundColor: `${fi.color}10`, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: `${fi.color}25` } }),
  ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide7Scenes: Scene[] = [{
  id: 'slide-7-scene-0',
  title: 'Product Overview',
  icon: '📦',
  order: 0,
  widgetStateLayer: {
    initialStates: s7Cards.map((fi) => ({
      widgetId: `s7-${fi.id}`,
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
// Slide 8 — Editable 2×2 Grid (slash-command ready)
//
// Four empty cells in a 2×2 grid. Each cell is a card with a single
// placeholder text atom (empty content). The ItemRenderer detects these
// as empty slots and renders the EmptyCardSlot component, which supports
// the "/" slash-command menu for inserting blocks.
// ---------------------------------------------------------------------------

const GRID_CELL_IDS = ['s8-cell-1', 's8-cell-2', 's8-cell-3', 's8-cell-4'];

const slide8Items: SlideItem[] = [
  layout('s8-grid', 'grid', GRID_CELL_IDS.map((cellId) =>
    card(cellId, [
      atom(`${cellId}-ph`, 'text', '', { style: { fontSize: 11, color: '#64748b' } }),
    ], { style: { borderRadius: 16, padding: 16 } }),
  ), { layoutConfig: { columns: 2, rows: 2, gap: 16 }, style: { padding: 24 } }),
];

const slide8Scenes: Scene[] = [{
  id: 'slide-8-scene-0',
  title: 'Editable Grid',
  icon: '✏️',
  order: 0,
  widgetStateLayer: {
    initialStates: GRID_CELL_IDS.map((cellId) => ({
      widgetId: cellId,
      visible: true,
      isFocused: false,
      displayMode: 'normal' as const,
    })),
    enterBehavior: {
      revealMode: 'all-at-once',
      animationType: 'fade-in',
      duration: 0.3,
      easing: 'ease-out',
    },
    interactionBehaviors: [],
    animatedWidgetIds: [],
  },
}];

// ---------------------------------------------------------------------------
// Demo Sections (organizational hierarchy for sidebar)
// ---------------------------------------------------------------------------

export const DEMO_SECTIONS: SlideSection[] = [
  {
    id: 'section-smart-cards',
    title: 'Smart Cards',
    icon: '🃏',
    slideIds: ['slide-1', 'slide-2'],
  },
  {
    id: 'section-menu-nav',
    title: 'Menu / Tab Navigation',
    icon: '📋',
    slideIds: ['slide-3', 'slide-4'],
  },
  {
    id: 'section-layouts',
    title: 'Layouts',
    icon: '📐',
    slideIds: ['slide-5', 'slide-6', 'slide-7'],
  },
  {
    id: 'section-editable',
    title: 'Editable Grid',
    icon: '✏️',
    slideIds: ['slide-8'],
  },
];

// ---------------------------------------------------------------------------
// Demo Slides Array
// ---------------------------------------------------------------------------

export const DEMO_SLIDES: Slide[] = [
  // -----------------------------------------------------------------------
  // Smart Card slides — popup callouts
  // -----------------------------------------------------------------------

  // Slide 1 — Popup Callout (step-driven)
  {
    id: 'slide-1',
    order: 0,
    sectionId: 'section-smart-cards',
    title: 'Popup Callout (Step)',
    subtitle: 'Each step focuses a card and shows its detail popup',
    icon: '💬',
    content: 'Smart Card — popup callout, step-driven',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-1', { statusColor: '#14b8a6', statusLabel: 'Interactive' }),
    animationTemplate: 'popup-callout',
    items: slide1Items,
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: slide1Scenes,
  },
  // Slide 2 — Popup Callout (click-only)
  {
    id: 'slide-2',
    order: 1,
    sectionId: 'section-smart-cards',
    title: 'Popup Callout (Click)',
    subtitle: 'Click a specific card to see its detail — slide click advances normally',
    icon: '🖱️',
    content: 'Smart Card — popup callout, click-only',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-2', { statusColor: '#8b5cf6', statusLabel: 'Click Card' }),
    animationTemplate: 'popup-callout',
    items: slide2Items,
    elements: [],
    duration: 12000,
    transition: 'fade',
    scenes: slide2Scenes,
  },

  // -----------------------------------------------------------------------
  // Menu / Tab Navigation slides
  // -----------------------------------------------------------------------

  // Slide 3 — Sidebar Menu
  {
    id: 'slide-3',
    order: 2,
    sectionId: 'section-menu-nav',
    title: 'Sidebar Menu',
    subtitle: 'Click menu items to navigate — each item is a sub-slide',
    icon: '📋',
    content: 'Smart Layout — sidebar menu with scene-per-item',
    layoutTemplate: 'sidebar-detail',
    header: titleBarHeader('h-slide-3', { statusColor: '#3b82f6', statusLabel: 'Interactive' }),
    animationTemplate: 'sidebar-detail',
    items: slide3Items,
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: slide3Scenes,
  },
  // Slide 4 — Tab Navigation
  {
    id: 'slide-4',
    order: 3,
    sectionId: 'section-menu-nav',
    title: 'Tab Navigation',
    subtitle: 'Click tabs to navigate — each tab is a sub-slide',
    icon: '📑',
    content: 'Smart Layout — tab navigation with scene-per-tab',
    layoutTemplate: 'content',
    animationTemplate: 'tab-navigation',
    items: slide4Items,
    elements: [],
    duration: 12000,
    transition: 'fade',
    triggerMode: 'click',
    scenes: slide4Scenes,
  },

  // -----------------------------------------------------------------------
  // Layout slides
  // -----------------------------------------------------------------------

  // Slide 5 — Grid 2×2 (sequential reveal)
  {
    id: 'slide-5',
    order: 4,
    sectionId: 'section-layouts',
    title: 'Grid of Cards',
    subtitle: 'Auto-grid of FeatureCards with staggered entrance',
    icon: '🔲',
    content: 'Header + Grid 2x2 — feature cards grid',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-5', { statusColor: '#22c55e' }),
    animationTemplate: 'slide-title',
    items: slide5Items,
    elements: [],
    duration: 10000,
    transition: 'fade',
    scenes: slide5Scenes,
  },
  // Slide 6 — Sidebar + Detail (sequential reveal)
  {
    id: 'slide-6',
    order: 5,
    sectionId: 'section-layouts',
    title: 'Sidebar Detail',
    subtitle: 'Click sidebar items to navigate detail view',
    icon: '📋',
    content: 'Header + Sidebar + Detail — sidebar navigation',
    layoutTemplate: 'sidebar-detail',
    header: titleBarHeader('h-slide-6', { statusColor: '#22c55e' }),
    animationTemplate: 'sidebar-detail',
    items: slide6Items,
    elements: [],
    duration: 14000,
    transition: 'fade',
    scenes: slide6Scenes,
  },
  // Slide 7 — Static Grid (no animation)
  {
    id: 'slide-7',
    order: 6,
    sectionId: 'section-layouts',
    title: 'Product Overview',
    subtitle: 'Core capabilities at a glance',
    icon: '📦',
    content: 'Static grid — 4 cards, no animation',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-7'),
    animationTemplate: 'none',
    items: slide7Items,
    elements: [],
    duration: 5000,
    transition: 'fade',
    scenes: slide7Scenes,
  },

  // -----------------------------------------------------------------------
  // Editable Grid slides — slash-command ready
  // -----------------------------------------------------------------------

  // Slide 8 — Editable 2×2 Grid
  {
    id: 'slide-8',
    order: 7,
    sectionId: 'section-editable',
    title: 'Editable Grid',
    subtitle: 'Click a cell and type / to insert blocks',
    icon: '✏️',
    content: 'Editable 2×2 grid — slash-command block insertion',
    layoutTemplate: 'grid-2x2',
    header: titleBarHeader('h-slide-8', { statusColor: '#f59e0b', statusLabel: 'Editable' }),
    animationTemplate: 'none',
    items: slide8Items,
    elements: [],
    duration: 5000,
    transition: 'fade',
    scenes: slide8Scenes,
  },
];

// ---------------------------------------------------------------------------
// Demo Scripts
// ---------------------------------------------------------------------------

export const DEMO_SCRIPTS: SlideScript[] = [
  // Smart Card slides
  {
    slideId: 'slide-1',
    opening: { text: 'Popup Callout — click or advance to expand each card with detailed information.', notes: 'Step-driven popup.' },
    elements: SC_META.map((m) => ({
      elementId: m.id,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Card popup detail.' },
    })),
  },
  {
    slideId: 'slide-2',
    opening: { text: 'Click-Only Popup — click a specific card to see its detail. Slide click advances normally.', notes: 'Click-only popup.' },
    elements: SC_META.map((m) => ({
      elementId: m.id,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Card popup detail.' },
    })),
  },
  // Menu / Tab slides
  {
    slideId: 'slide-3',
    opening: { text: 'Sidebar Menu — click any menu item to jump directly to its content.', notes: 'Menu scene navigation.' },
    elements: SC_META.map((m) => ({
      elementId: `s3-detail-${m.id}`,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Menu item detail.' },
    })),
  },
  {
    slideId: 'slide-4',
    opening: { text: 'Tab Navigation — click any tab to switch content. Each tab is a sub-slide.', notes: 'Tab scene navigation.' },
    elements: SC_META.map((m) => ({
      elementId: `s4-panel-${m.id}`,
      label: m.title,
      script: { text: `${m.title}: ${m.description}`, notes: 'Tab content.' },
    })),
  },
  // Layout slides
  {
    slideId: 'slide-5',
    opening: { text: 'The Grid of Cards layout — items appear one by one in a structured grid.', notes: 'Items grid layout.' },
    elements: s5Cards.map((fi) => ({
      elementId: fi.id,
      label: fi.title,
      script: { text: `${fi.title} — ${fi.description}.`, notes: 'Grid item.' },
    })),
  },
  {
    slideId: 'slide-6',
    opening: { text: 'Sidebar Detail — a left navigation panel with detailed content on the right.', notes: 'Sidebar-detail layout.' },
    elements: FEATURE_ITEMS.map((fi) => ({
      elementId: fi.id,
      label: fi.title,
      script: { text: `${fi.title}: ${fi.description}`, notes: 'Sidebar item with detail.' },
    })),
  },
  {
    slideId: 'slide-7',
    opening: { text: 'Product Overview — a static grid of feature cards. Great as a simple overview slide.', notes: 'Static grid.' },
    elements: s7Cards.map((fi) => ({
      elementId: `s7-${fi.id}`,
      label: fi.title,
      script: { text: `${fi.title}: ${fi.description}`, notes: 'Static card.' },
    })),
  },
  // Editable Grid
  {
    slideId: 'slide-8',
    opening: { text: 'Editable Grid — click any cell and type / to insert a block. Choose from Icon Cards, Task Lists, Stat Cards, Quotes, and more.', notes: 'Slash-command demo.' },
    elements: GRID_CELL_IDS.map((cellId, i) => ({
      elementId: cellId,
      label: `Cell ${i + 1}`,
      script: { text: `Empty cell — use slash command to fill.`, notes: 'Empty slot.' },
    })),
  },
];
