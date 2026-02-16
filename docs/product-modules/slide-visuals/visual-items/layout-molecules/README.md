# Layout Molecules

Layout molecules are spatial arrangement components that organize molecules and atoms into structured visual compositions. Unlike interactive layouts, these are **static** — they don't have click-to-navigate or state-changing behavior.

Layout molecules sit between molecules and interactive layouts in the component hierarchy:

```
Interactive Layouts  — Stateful, navigational full-slide experiences
  ↑ composed of
Layout Molecules     — Spatial arrangements of molecules (this tier)
  ↑ composed of
Molecules            — Multi-part components
  ↑ composed of
Atoms                — Single visual elements
```

## Key Characteristic

Layout molecules can be used at **any level** — as a full slide's content, or nested inside a card, region, or other container. They are reusable building blocks for arranging content in grids, stacks, or structured patterns.

## Components

| Component | Purpose |
|-----------|---------|
| [GridOfCards](./grid-of-cards.md) | Auto-grid of feature cards with responsive columns |
| [StatDashboard](./stat-dashboard.md) | Grid of KPI stat cards in a dashboard format |
| [StackOfCards](./stack-of-cards.md) | 3D perspective card stack with click-to-cycle |
| [TitleSlide](./title-slide.md) | TitleBar header + centered body content |
