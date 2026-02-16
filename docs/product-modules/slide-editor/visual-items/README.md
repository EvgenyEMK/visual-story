# Slide Visual Items

VisualStory uses a four-tier component system for building slide content. Each tier builds on the one below, creating progressively richer visual elements.

## Component Hierarchy

```
Interactive Layouts  — Stateful, navigational full-slide experiences (SidebarDetail, BentoLayout, ...)
  ↑ composed of
Layout Molecules     — Spatial arrangements of molecules (GridOfCards, StatDashboard, ...)
  ↑ composed of
Molecules            — Multi-part components (FeatureCard, TitleBar, StatCard, ...)
  ↑ composed of
Atoms                — Single visual elements (SlideTitle, SlideText, IconBadge, ...)
```

## Atoms — Basic Building Blocks

The smallest visual units. Each atom renders one piece of content.

| Component | Purpose |
|-----------|---------|
| [SlideTitle](./atoms/slide-title.md) | Heading with optional subtitle |
| [SlideText](./atoms/slide-text.md) | Body text, descriptions, captions |
| [IconBadge](./atoms/icon-badge.md) | Colored icon in a shaped container |
| [MetricDisplay](./atoms/metric-display.md) | Large numeric value with delta indicator |
| [ProgressBar](./atoms/progress-bar.md) | Horizontal progress indicator |
| [StatusDot](./atoms/status-dot.md) | Small colored status indicator |
| [SlideImage](./atoms/slide-image.md) | Photo, illustration, or screenshot |
| [CTAButton](./atoms/cta-button.md) | Gradient call-to-action button |

## Molecules — Component Combinations

Molecules combine multiple atoms into meaningful visual units.

| Component | Purpose |
|-----------|---------|
| [TitleBar](./molecules/title-bar.md) | Header bar with title, subtitle, icon, and trailing section |
| [FeatureCard](./molecules/feature-card.md) | Icon + title + description card |
| [StatCard](./molecules/stat-card.md) | Metric value with label, delta, and progress |
| [HeroSpotlight](./molecules/hero-spotlight.md) | Large centered icon + title + description |
| [FlowNode](./molecules/flow-node.md) | Circular node for timelines and diagrams |
| [ItemThumbnail](./molecules/item-thumbnail.md) | Compact icon + label for navigation lists |
| [DetailPopup](./molecules/detail-popup.md) | Modal overlay for drill-down details |
| [ItemsList](./molecules/items-list.md) | Vertical list with icons, text, and nesting |
| [StatusLegend](./molecules/status-legend.md) | Color-coded legend entries |
| [QuoteBlock](./molecules/quote-block.md) | Styled quotation with attribution |

## Layout Molecules — Reusable Spatial Arrangements

Layout molecules arrange molecules and atoms into structured visual compositions. They can be used as full slide content **or** nested inside a card, region, or other container.

| Component | Purpose |
|-----------|---------|
| [GridOfCards](./layout-molecules/grid-of-cards.md) | Auto-grid of feature cards |
| [StatDashboard](./layout-molecules/stat-dashboard.md) | Grid of KPI stat cards |
| [StackOfCards](./layout-molecules/stack-of-cards.md) | 3D perspective card stack |
| [TitleSlide](./layout-molecules/title-slide.md) | Title bar + centered body content |

## Interactive Layouts — Navigational Slide Compositions

Interactive layouts are stateful, navigational full-slide experiences. User interaction (clicks) changes the displayed content with animated transitions.

| Component | Pattern | Purpose |
|-----------|---------|---------|
| [SidebarDetail](./interactive-layouts/sidebar-detail.md) | Master–detail | Sidebar thumbnails → hero detail view |
| [BentoLayout](./interactive-layouts/bento-layout.md) | Master–detail | Sidebar grid → expanded main area |
| [CenterStageShelf](./interactive-layouts/center-stage-shelf.md) | Spotlight + nav | Bottom shelf thumbnails → center spotlight |
| [HorizontalTimeline](./interactive-layouts/horizontal-timeline.md) | Sequential | Click nodes to advance through a process |
| [HubSpoke](./interactive-layouts/hub-spoke.md) | Radial + popup | Click spoke nodes → detail popup |

## Relationship to Slide Layout Templates

Visual items live inside the content region of a slide. The [Slide Content Layout](../slide-content-layouts/README.md) defines the spatial arrangement of the content area — how it is divided into columns, grids, or other regions — while visual items fill those regions with actual content.

For example:
- A "Header + 2x2 Grid" layout template provides a header and a content region.
- The header region uses a **TitleBar** molecule.
- The content region contains a **GridOfCards** layout filled with **FeatureCard** molecules.

## Entrance Animations

All visual items support optional entrance animations. Available presets include:
- **fade** — Simple opacity transition
- **float-in** — Fade + upward movement
- **pop-zoom** — Scale from zero with bounce
- **slide-up / slide-down / slide-left / slide-right** — Directional slides
- **scale-in** — Smooth scale-up
- **pulse** — Scale pulse effect

Animations can be staggered in groups for sequential reveal effects.

## Size Presets

Most components support four size presets: **sm**, **md**, **lg**, **xl**. These control padding, font sizes, icon dimensions, and spacing proportionally. The default size is typically **md**.

## Theming

Components are designed for dark-theme slide canvases (light text on dark backgrounds). Each component supports accent colors via a hex color string that controls icon tints, borders, and subtle backgrounds.
