# Grouped Item Animations (In-Slide, Multi-Element)

## Overview

Grouped animations present **multiple related items** (features, steps, concepts) within a single slide using coordinated layout and sequential reveal logic. They combine layout design with transition choreography to create compelling visual narratives.

Unlike simple element animations (which animate one item at a time), grouped animations manage a **collection of items** with a defined spatial layout and a step-by-step reveal sequence.

## Catalog

| # | Animation | ID | Layout Type | Interaction Mode | Best For |
|---|-----------|-----|-------------|-----------------|----------|
| 1 | [List Accumulator](./list-accumulator.md) | `list-accumulator` | Sidebar + hero center | `sequential-focus` | Feature lists, agendas |
| 2 | [Carousel Focus](./carousel-focus.md) | `carousel-focus` | Bottom shelf + center stage | `sequential-focus` | Product features |
| 3 | [Bento Grid Expansion](./bento-grid-expansion.md) | `bento-grid-expansion` | Modular grid | `sequential-focus` | Dashboards, feature grids |
| 4 | [Circular Satellite](./circular-satellite.md) | `circular-satellite` | Orbital/radial | `hub-spoke` | Ecosystems, related concepts |
| 5 | [Infinite Path](./infinite-path.md) | `infinite-path` | Horizontal road/timeline | `sequential-focus` | Roadmaps, step-by-step |
| 6 | [Stack Reveal](./stack-reveal.md) | `stack-reveal` | 3D card stack | `sequential-focus` (no out-of-order) | Testimonials, cards |
| 7 | [Fan-Out](./fan-out.md) | `fan-out` | Arc / semi-circle | `sequential-focus` | Feature suites |
| 8 | [Molecular Bond](./molecular-bond.md) | `molecular-bond` | Network/mind map | `hub-spoke` | Concept relationships |
| 9 | [Perspective Pivot](./perspective-pivot.md) | `perspective-pivot` | 3D cube faces | `sequential-focus` (no out-of-order) | Multi-faceted concepts |
| 10 | [Magnifying Glass](./magnifying-glass.md) | `magnifying-glass` | Canvas + lens | `sequential-focus` | Complex diagrams |
| 11 | [Items Grid](./items-grid.md) | `items-grid` | Row/column grid | `sequential-focus` | Section overviews, topic structure |

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
| Step advance | On click on empty stage area, spacebar, or → arrow key |
| Hover on inactive item | Shows **tooltip preview** (item title) + subtle highlight (border glow or opacity change) |
| Click on **shown** (revealed) item | **`sequential-focus`**: Sets that item as the hero without hiding other revealed items (non-destructive review). **`hub-spoke`**: Toggles a detail popup for the child item. |
| Back navigation | ← arrow goes back — hides the most recently revealed item |
| Completion | After the last item, next click triggers the **slide transition** |

### Interaction Modes

Every grouped animation declares an `interactionMode` that governs click behavior on child items:

#### `sequential-focus` — Peer Items

Items have no parent-child relationship. One item is the "hero" (shown large/prominently), others are shown small or dimmed.

**Two independent navigation channels:**

| Channel | Controls | What Changes | What Stays |
|---------|----------|-------------|------------|
| **Sequence flow** (keyboard) | `→` / Space, `←`, `↑`, `↓` | Reveal progress — items are shown or hidden progressively | — |
| **Review focus** (mouse click on shown item) | Click on any already-revealed item | Which item is the hero | Reveal progress is preserved — **no items are hidden** |

**Key UX principle**: Keyboard drives the visual flow to progressively show content. Clicking on a shown item is to come back and review it without hiding already-shown information. This is particularly important when the final state (all items shown) is reached and the presenter wants to revisit one of them.

When a review focus override is active, any keyboard action clears the override first and then performs the sequence operation.

**Example flow:**
1. Presenter presses `→` four times — items A, B, C, D are all revealed, D is the hero.
2. Presenter presses `↓` — all items shown in end state (no hero).
3. Presenter clicks item B — B becomes the hero, items A, C, D remain visible in their small positions.
4. Presenter clicks item A — A becomes the hero, items B, C, D remain visible.
5. Presenter presses `→` — focus override is cleared, sequence advances (wraps to start or next step).

#### `hub-spoke` — Parent-Child Items

A central parent item with child items arranged around it. Clicking a child toggles a detail popup for that child without affecting other children or the reveal sequence.

### Interaction Model Detail

```
┌─────────────────────────────────────────────────────────────────┐
│  CLICK MODE — sequential-focus Interaction                      │
│                                                                 │
│  State after keyboard →→→→ (4 items revealed, item 4 = hero):  │
│                                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐                      │
│  │ Item 1  │   │ Item 2  │   │ Item 3  │  ← Shown (small)     │
│  │ (small) │   │ (small) │   │ (small) │                       │
│  └────┬────┘   └────┬────┘   └────┬────┘                      │
│       │click         │click        │click                       │
│       ▼              ▼             ▼                            │
│  ┌─────────────────────────────────────────┐                   │
│  │     CLICKED ITEM becomes HERO (big)     │                   │
│  │  Other revealed items STAY VISIBLE      │                   │
│  │  (no items are hidden by this action)   │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
│  Keyboard controls (always drive sequence flow):                │
│  → / Space = Advance sequence (reveal next item)                │
│  ← = Go back (hide last revealed item)                          │
│  ↑ = Reset to start state                                       │
│  ↓ = Jump to end state (all items shown)                        │
│                                                                 │
│  Mouse click on shown item = Review focus (non-destructive)     │
└─────────────────────────────────────────────────────────────────┘
```

## Shared Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `GroupedAnimationType` | — | See catalog | Which grouped animation to use |
| `interactionMode` | `GroupedInteractionMode` | — | `sequential-focus`, `hub-spoke` | How items respond to clicks (see Interaction Modes) |
| `items` | `GroupedItem[]` | — | 3–10 items | Ordered list of items |
| `stepDuration` | `number` | `1800` | 800–3000ms | Auto mode: time between steps |
| `hoverPreview` | `boolean` | `true` | — | Click mode: show preview on hover |
| `allowOutOfOrder` | `boolean` | `true` | — | Click mode: allow clicking shown items to change focus (sequential-focus) or toggle detail popup (hub-spoke) |
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
