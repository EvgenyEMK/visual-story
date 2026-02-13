# Slide Content Layouts

Slide content layouts define the **spatial arrangement of the content area** within a slide — how the available space is divided into regions (columns, grids, centered, freeform, etc.).

Every slide has an optional `layoutTemplate` property that selects one of the pre-built content layouts below. When no template is set, the slide uses a freeform canvas where items can be positioned manually.

**Header is orthogonal to content layout.** Any content layout can be rendered with or without a [slide header](./slide-header.md). The slide's `header` property controls whether a header bar appears above the content area.

## How it works

1. The user picks a content layout from the catalogue (or the AI assistant selects one automatically).
2. The layout determines how the **content area** is divided (single pane, columns, grid, centered, etc.).
3. Separately, the user decides whether to include a **slide header** at the top.
4. The user fills each region with content — title/subtitle appear in the header (if present) or within the content area itself.

## Content Layout Catalogue

### Single Content Area

| Layout | Description | Best for |
|--------|-------------|----------|
| [Content](./content.md) | Full-width single content area | General informational slides |

### Center Band / Center Stage

| Layout | Description | Best for |
|--------|-------------|----------|
| [Center Band](./center-band.md) | Full-width bar centred vertically | Section titles, process flow summaries |
| [Center Stage](./center-stage.md) | Centred content box (1 item) | Title slides, hero, quote, big metric |
| [Center Stage (2 Items)](./center-stage-2.md) | Two centered cards side by side | Pair comparison, dual metrics |
| [Center Stage (3 Items)](./center-stage-3.md) | Three centered cards in a row | Pillars, triple metrics, three-step |
| [Center Stage (4 Items)](./center-stage-4.md) | Four centered cards in a row | Four stats, features, quarterly data |

### Two Columns

| Layout | Description | Best for |
|--------|-------------|----------|
| [Two Columns (50/50)](./two-column.md) | Two equal vertical panes | Comparisons, text + visual |
| [Two Columns (25/75)](./two-column-25-75.md) | Narrow left + wide right | Navigation list + detail |
| [Two Columns (75/25)](./two-column-75-25.md) | Wide left + narrow right | Main content + side notes |
| [Two Columns (33/67)](./two-column-33-67.md) | One-third left + two-thirds right | Sidebar context + primary content |
| [Two Columns (67/33)](./two-column-67-33.md) | Two-thirds left + one-third right | Primary content + supplementary panel |

### Three / Four Columns

| Layout | Description | Best for |
|--------|-------------|----------|
| [Three Columns](./three-column.md) | Three equal vertical panes | Pillars, categories, comparisons |
| [Four Columns](./four-column.md) | Four equal vertical panes | Quarterly data, four-way comparisons |

### Navigation

| Layout | Description | Best for |
|--------|-------------|----------|
| [Sidebar + Detail](./sidebar-detail.md) | Sidebar nav + main detail area | Drill-down multi-section |

### Grids

| Layout | Description | Best for |
|--------|-------------|----------|
| [Grid 2x2](./grid-2x2.md) | Four equal quadrants (2 rows, 2 cols) | 4 items: features, stats, images |
| [Grid 3x2](./grid-3x2.md) | Six cells (2 rows, 3 cols) | 6-item showcases, team profiles |
| [Grid 2+3](./grid-2-3.md) | Five items: 2 top row, 3 bottom row | 5-item showcases, uneven grids |
| [Grid 3+2](./grid-3-2.md) | Five items: 3 top row, 2 bottom row | 5-item showcases, top-heavy grids |

### Freeform

| Layout | Description | Best for |
|--------|-------------|----------|
| [Blank Canvas](./blank.md) | Empty slide, absolute positioning | Full creative freedom |
| [Custom](./custom.md) | Fully custom via nested item tree | Advanced, non-standard layouts |

## Searching and Filtering

Content layouts can be filtered by:
- **Number of columns** — 0, 1, 2, or 3
- **Is grid** — yes/no (+ grid size like "2x2", "3x2", "2-3", "3-2")
- **Has sidebar** — yes/no
- **Tags** — e.g. "comparison", "dashboard", "hero", "navigation"

## Relationship to Slide Header

The slide header is **independent** of the content layout. When a slide includes a header, the header bar appears above the content area, reducing the vertical space available to the content layout. The same content layout renders identically whether or not a header is present — only the available height changes.

See also: [Slide Header](./slide-header.md)
