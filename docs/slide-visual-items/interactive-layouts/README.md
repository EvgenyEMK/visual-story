# Interactive Layouts

Interactive layouts are full-slide visual compositions with **stateful, navigational behavior**. They respond to user clicks — selecting an item in one area changes what's displayed in another, creating an interactive exploration experience.

Interactive layouts sit at the top of the component hierarchy:

```
Interactive Layouts  — Stateful, navigational full-slide experiences (this tier)
  ↑ composed of
Layout Molecules     — Spatial arrangements of molecules
  ↑ composed of
Molecules            — Multi-part components
  ↑ composed of
Atoms                — Single visual elements
```

## Key Characteristic

All interactive layouts share a common pattern: **user interaction changes the displayed content**. They maintain internal state (e.g., which item is selected) and transition between views with animations.

## Components

| Component | Pattern | Purpose |
|-----------|---------|---------|
| [SidebarDetail](./sidebar-detail.md) | Master–detail | Sidebar thumbnails → hero detail view |
| [BentoLayout](./bento-layout.md) | Master–detail | Sidebar grid → expanded main area |
| [CenterStageShelf](./center-stage-shelf.md) | Spotlight + nav | Bottom shelf thumbnails → center spotlight |
| [HorizontalTimeline](./horizontal-timeline.md) | Sequential | Click nodes to advance through a process |
| [HubSpoke](./hub-spoke.md) | Radial + popup | Click spoke nodes → detail popup |
