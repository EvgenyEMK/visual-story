/**
 * Catalogue of pre-built slide content layout templates.
 *
 * Each entry describes the spatial arrangement of the content area within
 * a slide — how columns, grids, or other regions are arranged. The slide
 * header is orthogonal: any content layout works with or without a header.
 *
 * This catalogue is the single source of truth used by:
 *   1. AI assistant — `bestFor`, `aiHints`, `itemCount`, and `tags`
 *      guide automatic layout selection.
 *   2. Skeleton renderer — `regions` define the rectangles to draw.
 *   3. Template picker UI — `name`, `description`, `tags` for search.
 */

import type { SlideLayoutTemplate, SlideLayoutMeta, LayoutRegion } from '@/types/slide';

// ---------------------------------------------------------------------------
// Layout Template Catalogue
// ---------------------------------------------------------------------------

export const LAYOUT_TEMPLATES: SlideLayoutMeta[] = [
  // --- Single content area ---
  {
    id: 'content',
    name: 'Content',
    description: 'Full-width single content area. The most versatile layout for general informational slides.',
    columns: 1,
    isGrid: false,
    hasSidebar: false,
    tags: ['general', 'versatile', 'content', 'full-width'],
    regions: [
      { id: 'content', label: 'Content', area: { row: 0, col: 0 } },
    ],
    bestFor: ['general', 'mixed-media', 'text-heavy', 'flexible'],
    itemCount: 1,
    aiHints: 'Use for general-purpose slides with a single full-width content area. Works well for text blocks, charts, images, or any mixed content that does not need to be split into columns or grids.',
  },

  // --- Two-column layouts ---
  {
    id: 'two-column',
    name: 'Two Columns (50/50)',
    description: 'Two equal vertical panes. Ideal for comparisons, before/after, or text + visual pairs.',
    columns: 2,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'comparison', 'split', '50-50'],
    regions: [
      { id: 'left', label: 'Left (50%)', area: { row: 0, col: 0 } },
      { id: 'right', label: 'Right (50%)', area: { row: 0, col: 1 } },
    ],
    bestFor: ['comparison', 'before-after', 'text-visual', 'pros-cons'],
    itemCount: 2,
    aiHints: 'Use when presenting two items of equal importance side by side — comparisons, before/after, text alongside an image or chart, pros vs. cons.',
  },
  {
    id: 'two-column-25-75',
    name: 'Two Columns (25/75)',
    description: 'Narrow left pane (25%) and wide right pane (75%). Good for navigation list + detail content.',
    columns: 2,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'asymmetric', '25-75', 'navigation'],
    regions: [
      { id: 'left', label: 'Left (25%)', area: { row: 0, col: 0 } },
      { id: 'right', label: 'Right (75%)', area: { row: 0, col: 1 } },
    ],
    bestFor: ['navigation-list', 'legend', 'metadata-sidebar', 'filter-panel'],
    itemCount: 2,
    aiHints: 'Use when a narrow left column holds navigation items, a legend, filters, or metadata, while the wide right column shows the primary content.',
  },
  {
    id: 'two-column-75-25',
    name: 'Two Columns (75/25)',
    description: 'Wide left pane (75%) and narrow right pane (25%). Good for main content + side notes or legend.',
    columns: 2,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'asymmetric', '75-25', 'side-notes'],
    regions: [
      { id: 'left', label: 'Left (75%)', area: { row: 0, col: 0 } },
      { id: 'right', label: 'Right (25%)', area: { row: 0, col: 1 } },
    ],
    bestFor: ['main-content', 'side-notes', 'metrics-sidebar', 'annotations'],
    itemCount: 2,
    aiHints: 'Use when the left column holds primary content and a narrow right column shows supplementary notes, quick stats, callouts, or metadata.',
  },
  {
    id: 'two-column-33-67',
    name: 'Two Columns (33/67)',
    description: 'One-third left pane (33%) and two-thirds right pane (67%). Classic 12-column grid split (4+8).',
    columns: 2,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'asymmetric', '33-67', 'sidebar-context'],
    regions: [
      { id: 'left', label: 'Left (33%)', area: { row: 0, col: 0 } },
      { id: 'right', label: 'Right (67%)', area: { row: 0, col: 1 } },
    ],
    bestFor: ['sidebar-context', 'table-of-contents', 'index', 'category-list'],
    itemCount: 2,
    aiHints: 'Use when the left column provides structural context (categories, steps, table of contents) and the right column holds the main detailed content. Wider than 25/75, giving more room for labels and short descriptions.',
  },
  {
    id: 'two-column-67-33',
    name: 'Two Columns (67/33)',
    description: 'Two-thirds left pane (67%) and one-third right pane (33%). Classic 12-column grid split (8+4).',
    columns: 2,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'asymmetric', '67-33', 'main-aside'],
    regions: [
      { id: 'left', label: 'Left (67%)', area: { row: 0, col: 0 } },
      { id: 'right', label: 'Right (33%)', area: { row: 0, col: 1 } },
    ],
    bestFor: ['main-aside', 'key-takeaways', 'highlights-panel', 'related-items'],
    itemCount: 2,
    aiHints: 'Use when the left column holds primary narrative content and a meaningful right column shows key takeaways, stats, highlights, or related items. The right column is wider than 25%, suitable for substantial supplementary content.',
  },

  // --- Three columns ---
  {
    id: 'three-column',
    name: 'Three Columns',
    description: 'Three equal vertical panes. Good for comparing three options, pillars, or categories.',
    columns: 3,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'three', 'comparison', 'pillars'],
    regions: [
      { id: 'left', label: 'Left (33%)', area: { row: 0, col: 0 } },
      { id: 'middle', label: 'Middle (33%)', area: { row: 0, col: 1 } },
      { id: 'right', label: 'Right (33%)', area: { row: 0, col: 2 } },
    ],
    bestFor: ['three-options', 'pillars', 'categories', 'three-step-process'],
    itemCount: 3,
    aiHints: 'Use when presenting exactly three items of equal importance — three options, pillars, principles, categories, or a three-step process.',
  },

  // --- Four columns ---
  {
    id: 'four-column',
    name: 'Four Columns',
    description: 'Four equal vertical panes. Good for comparing four options, quarterly data, or four-category overviews.',
    columns: 4,
    isGrid: false,
    hasSidebar: false,
    tags: ['columns', 'four', 'comparison', 'quarters'],
    regions: [
      { id: 'col-1', label: 'Col 1 (25%)', area: { row: 0, col: 0 } },
      { id: 'col-2', label: 'Col 2 (25%)', area: { row: 0, col: 1 } },
      { id: 'col-3', label: 'Col 3 (25%)', area: { row: 0, col: 2 } },
      { id: 'col-4', label: 'Col 4 (25%)', area: { row: 0, col: 3 } },
    ],
    bestFor: ['four-options', 'quarterly', 'four-categories', 'four-step-process'],
    itemCount: 4,
    aiHints: 'Use when presenting exactly four items of equal importance in a single row — four options, quarterly summaries, four categories, or a four-step process. Each column gets 25% width.',
  },

  // --- Sidebar + detail ---
  {
    id: 'sidebar-detail',
    name: 'Sidebar + Detail',
    description: 'Left sidebar for navigation and a main detail area. Best for drill-down content with multiple sections.',
    columns: 2,
    isGrid: false,
    hasSidebar: true,
    tags: ['sidebar', 'navigation', 'detail', 'drill-down'],
    regions: [
      { id: 'sidebar', label: 'Sidebar', area: { row: 0, col: 0 } },
      { id: 'detail', label: 'Detail', area: { row: 0, col: 1 } },
    ],
    bestFor: ['drill-down', 'multi-section', 'feature-tour', 'chapter-navigation'],
    itemCount: undefined,
    aiHints: 'Use when the slide has 3-8 distinct sections that the user can navigate between. The sidebar lists section names and the detail area shows the selected section content. Good for feature tours, multi-part explanations, or tabbed content.',
  },

  // --- Grid layouts ---
  {
    id: 'grid-2x2',
    name: 'Grid 2×2',
    description: 'Four equal quadrants for showing 4 items at once — features, stats, categories, or images.',
    columns: 2,
    isGrid: true,
    gridSize: '2x2',
    hasSidebar: false,
    tags: ['grid', '4-items', 'quadrant', 'dashboard'],
    regions: [
      { id: 'cell-0-0', label: 'Top Left', area: { row: 0, col: 0 } },
      { id: 'cell-0-1', label: 'Top Right', area: { row: 0, col: 1 } },
      { id: 'cell-1-0', label: 'Bottom Left', area: { row: 1, col: 0 } },
      { id: 'cell-1-1', label: 'Bottom Right', area: { row: 1, col: 1 } },
    ],
    bestFor: ['4-features', 'kpi-dashboard', 'four-categories', 'team-members'],
    itemCount: 4,
    aiHints: 'Use when presenting exactly 4 items of equal importance — feature cards, KPI metrics, product options, team members, or process steps.',
  },
  {
    id: 'grid-3x2',
    name: 'Grid 3×2',
    description: 'Six cells arranged in 3 columns and 2 rows. Good for feature showcases, icon grids, or team profiles.',
    columns: 3,
    isGrid: true,
    gridSize: '3x2',
    hasSidebar: false,
    tags: ['grid', '6-items', 'showcase'],
    regions: [
      { id: 'cell-0-0', label: 'Top Left', area: { row: 0, col: 0 } },
      { id: 'cell-0-1', label: 'Top Middle', area: { row: 0, col: 1 } },
      { id: 'cell-0-2', label: 'Top Right', area: { row: 0, col: 2 } },
      { id: 'cell-1-0', label: 'Bottom Left', area: { row: 1, col: 0 } },
      { id: 'cell-1-1', label: 'Bottom Middle', area: { row: 1, col: 1 } },
      { id: 'cell-1-2', label: 'Bottom Right', area: { row: 1, col: 2 } },
    ],
    bestFor: ['6-features', 'icon-grid', 'team-profiles', 'six-step-process'],
    itemCount: 6,
    aiHints: 'Use when presenting exactly 6 items of equal importance — feature icons, team profiles, product options, or a six-step workflow.',
  },
  {
    id: 'grid-2-3',
    name: 'Grid 2+3',
    description: 'Five items: 2 in the top row, 3 in the bottom row. Top items get more horizontal space.',
    columns: 3,
    isGrid: true,
    gridSize: '2-3',
    hasSidebar: false,
    tags: ['grid', '5-items', 'uneven', 'hero-pair'],
    regions: [
      { id: 'cell-0-0', label: 'Top Left', area: { row: 0, col: 0, colSpan: 3 } },
      { id: 'cell-0-1', label: 'Top Right', area: { row: 0, col: 3, colSpan: 3 } },
      { id: 'cell-1-0', label: 'Bottom Left', area: { row: 1, col: 0, colSpan: 2 } },
      { id: 'cell-1-1', label: 'Bottom Middle', area: { row: 1, col: 2, colSpan: 2 } },
      { id: 'cell-1-2', label: 'Bottom Right', area: { row: 1, col: 4, colSpan: 2 } },
    ],
    bestFor: ['5-features', 'hero-pair-plus-details', 'primary-secondary-items'],
    itemCount: 5,
    aiHints: 'Use when presenting 5 items where the top 2 are primary (wider) and the bottom 3 are secondary (narrower). Good for hero pair + supporting details.',
  },
  {
    id: 'grid-3-2',
    name: 'Grid 3+2',
    description: 'Five items: 3 in the top row, 2 in the bottom row. Bottom items get more horizontal space.',
    columns: 3,
    isGrid: true,
    gridSize: '3-2',
    hasSidebar: false,
    tags: ['grid', '5-items', 'uneven', 'overview-detail'],
    regions: [
      { id: 'cell-0-0', label: 'Top Left', area: { row: 0, col: 0, colSpan: 2 } },
      { id: 'cell-0-1', label: 'Top Middle', area: { row: 0, col: 2, colSpan: 2 } },
      { id: 'cell-0-2', label: 'Top Right', area: { row: 0, col: 4, colSpan: 2 } },
      { id: 'cell-1-0', label: 'Bottom Left', area: { row: 1, col: 0, colSpan: 3 } },
      { id: 'cell-1-1', label: 'Bottom Right', area: { row: 1, col: 3, colSpan: 3 } },
    ],
    bestFor: ['5-features', 'overview-then-detail', 'categories-plus-expanded'],
    itemCount: 5,
    aiHints: 'Use when presenting 5 items where the top 3 are compact overview items and the bottom 2 are larger detailed items. Good for three quick stats + two deep-dive cards.',
  },

  // --- Center band & center stage ---
  {
    id: 'center-band',
    name: 'Center Band',
    description: 'A full-width horizontal content bar centred vertically on the slide. Ideal for section title slides, process flow summaries, or any content that should span the full width as a single prominent strip.',
    columns: 1,
    isGrid: false,
    hasSidebar: false,
    tags: ['center', 'band', 'section-title', 'process-flow', 'full-width'],
    regions: [
      { id: 'band', label: 'Center Band', area: { row: 0, col: 0 } },
    ],
    bestFor: ['section-title', 'process-flow', 'workflow-stages', 'chapter-divider', 'horizontal-strip'],
    itemCount: 1,
    aiHints: 'Use for a full-width horizontal strip centred vertically on the slide. Best for section/chapter title slides without a header, process flow summaries showing workflow stages in a horizontal line, or any single-row content that should stretch edge to edge while remaining vertically centred.',
  },
  {
    id: 'center-stage',
    name: 'Center Stage',
    description: 'Full-slide centred content. Ideal for title slides, hero statements, quotes, or single metrics.',
    columns: 0,
    isGrid: false,
    hasSidebar: false,
    tags: ['center', 'hero', 'title-slide', 'quote', 'metric'],
    regions: [
      { id: 'center', label: 'Center Stage', area: { row: 0, col: 0 } },
    ],
    bestFor: ['title-slide', 'hero-statement', 'big-metric', 'quote', 'call-to-action'],
    itemCount: 1,
    aiHints: 'Use for high-impact single-element slides — title/cover pages, hero statements, big metrics, impactful quotes, product announcements, or calls to action. The centered content commands full attention.',
  },
  {
    id: 'center-stage-2',
    name: 'Center Stage (2 items)',
    description: 'Two centred content cards side by side. Like Center Stage but for a pair of items with equal emphasis.',
    columns: 2,
    isGrid: false,
    hasSidebar: false,
    tags: ['center', 'cards', '2-items', 'pair', 'comparison'],
    regions: [
      { id: 'card-0', label: 'Card 1', area: { row: 0, col: 0 } },
      { id: 'card-1', label: 'Card 2', area: { row: 0, col: 1 } },
    ],
    bestFor: ['two-metrics', 'pair-comparison', 'dual-feature', 'before-after'],
    itemCount: 2,
    aiHints: 'Use when presenting exactly 2 items centred on the slide — a pair of metrics, two featured products, before/after, or two complementary elements that should share the spotlight equally.',
  },
  {
    id: 'center-stage-2x2',
    name: 'Center Stage (2×2)',
    description: 'Four centred content cards in a 2×2 grid — two rows of two. Like Center Stage (2 items) but doubled vertically for four items with equal emphasis.',
    columns: 2,
    isGrid: true,
    gridSize: '2x2',
    hasSidebar: false,
    tags: ['center', 'cards', '4-items', '2x2', 'grid', 'balanced'],
    regions: [
      { id: 'card-0', label: 'Card 1', area: { row: 0, col: 0 } },
      { id: 'card-1', label: 'Card 2', area: { row: 0, col: 1 } },
      { id: 'card-2', label: 'Card 3', area: { row: 1, col: 0 } },
      { id: 'card-3', label: 'Card 4', area: { row: 1, col: 1 } },
    ],
    bestFor: ['four-metrics', 'four-features', 'quadrant-overview', 'two-by-two-matrix'],
    itemCount: 4,
    aiHints: 'Use when presenting exactly 4 items centred on the slide in a 2×2 arrangement — two rows of two cards. Best when items form a natural 2×2 matrix, quadrant overview, or four balanced categories. Gives each card more width than the single-row Center Stage (4 items) variant.',
  },
  {
    id: 'center-stage-3',
    name: 'Center Stage (3 items)',
    description: 'Three centred content cards in a row. Like Center Stage but for a trio of items with equal emphasis.',
    columns: 3,
    isGrid: false,
    hasSidebar: false,
    tags: ['center', 'cards', '3-items', 'trio', 'pillars'],
    regions: [
      { id: 'card-0', label: 'Card 1', area: { row: 0, col: 0 } },
      { id: 'card-1', label: 'Card 2', area: { row: 0, col: 1 } },
      { id: 'card-2', label: 'Card 3', area: { row: 0, col: 2 } },
    ],
    bestFor: ['three-metrics', 'three-pillars', 'triple-feature', 'three-step-flow'],
    itemCount: 3,
    aiHints: 'Use when presenting exactly 3 items centred on the slide — three key metrics, three pillars, three featured products, or a three-step overview. All items share the spotlight equally.',
  },
  {
    id: 'center-stage-4',
    name: 'Center Stage (4 items)',
    description: 'Four centred content cards in a row. Like Center Stage but for a quartet of items with equal emphasis.',
    columns: 4,
    isGrid: false,
    hasSidebar: false,
    tags: ['center', 'cards', '4-items', 'quartet', 'features'],
    regions: [
      { id: 'card-0', label: 'Card 1', area: { row: 0, col: 0 } },
      { id: 'card-1', label: 'Card 2', area: { row: 0, col: 1 } },
      { id: 'card-2', label: 'Card 3', area: { row: 0, col: 2 } },
      { id: 'card-3', label: 'Card 4', area: { row: 0, col: 3 } },
    ],
    bestFor: ['four-metrics', 'four-features', 'four-step-flow', 'key-stats'],
    itemCount: 4,
    aiHints: 'Use when presenting exactly 4 items centred on the slide — four key stats, four features, four products, or a four-step overview. All items receive equal visual weight in a single horizontal row.',
  },

  // --- Freeform layouts ---
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Empty slide — place items anywhere using absolute positioning. Full creative freedom.',
    columns: 0,
    isGrid: false,
    hasSidebar: false,
    tags: ['blank', 'custom', 'freeform', 'absolute'],
    regions: [],
    bestFor: ['creative', 'custom-composition', 'layered', 'artistic'],
    aiHints: 'Use when no pre-built layout fits — the user wants complete creative freedom to place items anywhere with absolute positioning. Overlapping elements, layered designs, or unique compositions.',
  },
  {
    id: 'custom',
    name: 'Custom Layout',
    description: 'Fully custom layout via the items tree. Build any structure using nested layouts, cards, and atoms.',
    columns: 0,
    isGrid: false,
    hasSidebar: false,
    tags: ['custom', 'advanced', 'freeform'],
    regions: [],
    bestFor: ['advanced', 'nested-structure', 'brand-specific', 'complex'],
    aiHints: 'Use for advanced layouts not covered by pre-built templates. The user builds a custom structure using nested flex, grid, sidebar, split, and stack containers.',
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Get layout template metadata by ID. */
export function getLayoutMeta(id: SlideLayoutTemplate): SlideLayoutMeta | undefined {
  return LAYOUT_TEMPLATES.find((t) => t.id === id);
}

/** Filter templates by search criteria. */
export function filterLayoutTemplates(opts: {
  isGrid?: boolean;
  hasSidebar?: boolean;
  columns?: number;
  tag?: string;
}): SlideLayoutMeta[] {
  return LAYOUT_TEMPLATES.filter((t) => {
    if (opts.isGrid !== undefined && t.isGrid !== opts.isGrid) return false;
    if (opts.hasSidebar !== undefined && t.hasSidebar !== opts.hasSidebar) return false;
    if (opts.columns !== undefined && t.columns !== opts.columns) return false;
    if (opts.tag && !t.tags.includes(opts.tag)) return false;
    return true;
  });
}
