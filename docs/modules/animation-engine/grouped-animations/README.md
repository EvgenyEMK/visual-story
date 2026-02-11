# Grouped Item Animations (In-Slide, Multi-Element)

## Overview

Grouped animations present **multiple related items** (features, steps, concepts) within a single slide using coordinated layout and sequential reveal logic. They combine layout design with transition choreography to create compelling visual narratives.

Unlike simple element animations (which animate one item at a time), grouped animations manage a **collection of items** with a defined spatial layout and a step-by-step reveal sequence.

## Catalog

| # | Animation | ID | Layout Type | Best For |
|---|-----------|-----|-------------|----------|
| 1 | [List Accumulator](./list-accumulator.md) | `list-accumulator` | Sidebar + hero center | Feature lists, agendas |
| 2 | [Carousel Focus](./carousel-focus.md) | `carousel-focus` | Bottom shelf + center stage | Product features |
| 3 | [Bento Grid Expansion](./bento-grid-expansion.md) | `bento-grid-expansion` | Modular grid | Dashboards, feature grids |
| 4 | [Circular Satellite](./circular-satellite.md) | `circular-satellite` | Orbital/radial | Ecosystems, related concepts |
| 5 | [Infinite Path](./infinite-path.md) | `infinite-path` | Horizontal road/timeline | Roadmaps, step-by-step |
| 6 | [Stack Reveal](./stack-reveal.md) | `stack-reveal` | 3D card stack | Testimonials, cards |
| 7 | [Fan-Out](./fan-out.md) | `fan-out` | Arc / semi-circle | Feature suites |
| 8 | [Molecular Bond](./molecular-bond.md) | `molecular-bond` | Network/mind map | Concept relationships |
| 9 | [Perspective Pivot](./perspective-pivot.md) | `perspective-pivot` | 3D cube faces | Multi-faceted concepts |
| 10 | [Magnifying Glass](./magnifying-glass.md) | `magnifying-glass` | Canvas + lens | Complex diagrams |

## Trigger Modes

Grouped animations have the **richest interaction model** of the three animation layers because they manage multiple items with distinct active/inactive states.

### Auto Mode (Voice-Over / Timed)

| Aspect | Behavior |
|--------|----------|
| Step advance | Automatic, on timer (`stepDuration` per item) |
| Pacing | `stepDuration` = `slideDuration / itemCount` (min 1.2s, max 3.0s) |
| Voice sync | When available, each item's reveal is tied to a voice-sync timestamp |
| Inactive items | Remain in their "small" or "dimmed" state until their turn |
| Active item | Displayed prominently (center, enlarged, full color) |

### Click Mode (Live Presentation)

| Aspect | Behavior |
|--------|----------|
| Step advance | On click, spacebar, or arrow key |
| Hover on inactive item | Shows **tooltip preview** (item title) + subtle highlight (border glow or opacity change) |
| Click on inactive item | **Jumps directly** to that item (out-of-order navigation) |
| Click on active area / keyboard | Advances to the **next item** in sequence |
| Back navigation | ← arrow or click "Previous" goes to the previous item |
| Completion | After the last item, next click triggers the **slide transition** |

### Interaction Model Detail

```
┌─────────────────────────────────────────────────────────┐
│  CLICK MODE — Grouped Animation Interaction             │
│                                                         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐              │
│  │ Item 1  │   │ Item 2  │   │ Item 3  │  ← Inactive  │
│  │ (small) │   │ (small) │   │ (small) │    items      │
│  └────┬────┘   └────┬────┘   └────┬────┘              │
│       │hover         │hover        │hover              │
│       ▼              ▼             ▼                    │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐              │
│  │ Tooltip  │   │ Tooltip  │   │ Tooltip  │             │
│  │ Preview  │   │ Preview  │   │ Preview  │             │
│  └────┬────┘   └────┬────┘   └────┬────┘              │
│       │click         │click        │click               │
│       ▼              ▼             ▼                    │
│  ┌─────────────────────────────────────────┐           │
│  │          ACTIVE ITEM (enlarged)          │           │
│  │     Full color, center stage, detailed   │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  Click anywhere / Space / → = Next item                 │
│  ← = Previous item                                      │
│  Click on specific inactive item = Jump to it           │
└─────────────────────────────────────────────────────────┘
```

## Shared Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `GroupedAnimationType` | — | See catalog | Which grouped animation to use |
| `items` | `GroupedItem[]` | — | 3–10 items | Ordered list of items |
| `stepDuration` | `number` | `1800` | 800–3000ms | Auto mode: time between steps |
| `hoverPreview` | `boolean` | `true` | — | Click mode: show preview on hover |
| `allowOutOfOrder` | `boolean` | `true` | — | Click mode: allow clicking inactive items |
| `triggerMode` | `TriggerMode` | *inherited* | auto, click | Override slide/project default |

### GroupedItem Structure

Each item in a grouped animation has:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `icon` | `string` | Icon or emoji |
| `title` | `string` | Short title |
| `description` | `string` | Optional longer description |
| `color` | `string` | Brand color for the item |
| `elementIds` | `string[]` | Slide element IDs mapped to this group item |

## UI Component Requirements

### Grouped Animation Configurator (New Panel)

A new editor panel is required to configure grouped animations:

- [ ] **Animation type picker** — visual gallery of all 10 grouped animations with mini-previews
- [ ] **Item mapping** — drag slide elements into group item slots
- [ ] **Reorder items** — drag to reorder the reveal sequence
- [ ] **Step duration** — slider for auto-mode pacing
- [ ] **Hover preview toggle** — enable/disable hover tooltips in click mode
- [ ] **Out-of-order toggle** — enable/disable direct click on inactive items
- [ ] **Live preview** — preview the grouped animation in the slide canvas

### Canvas Enhancements

When a grouped animation is active on a slide:
- [ ] Show item boundaries with subtle outlines
- [ ] Show step numbers on each item
- [ ] In click-mode preview: enable hover/click interactions
- [ ] Show the layout skeleton (sidebar, shelf, grid, etc.) as a faint guide

## Implementation References

| Artifact | Path |
|----------|------|
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |
| Demo components | `src/components/transitions-demo/GroupedSection.tsx` |
| Catalog config | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS` |
| Demo stage | `src/components/transitions-demo/DemoStage.tsx` |

## Related
- [Animation Engine Overview](../README.md)
- [Full Catalog](../catalog.md)
- [Element Animations](../element-animations/) — atomic building blocks used within groups
- [Auto Animation](../auto-animation.md) — automatic group detection and selection
