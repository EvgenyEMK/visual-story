# The "List Accumulator" (Left Sidebar)

## Overview

A growing vertical list on the left sidebar paired with a large hero focus area in the center. Each new item appears as the hero, then gracefully migrates to the sidebar list, building a visible record of everything covered while keeping the audience focused on the current item.

## Visual Behavior

### Layout

The slide is divided into two zones: a **left sidebar** (30% width) that holds accumulated items as a vertical list, and a **center hero area** (70% width) where the active item is displayed at full size. As items are revealed and then displaced, the sidebar list grows from top to bottom, providing a persistent visual "receipt" of progress.

### Animation Sequence

1. **Initial state**: The slide is empty — no sidebar items, no hero.
2. **Step 1 (Item 1 appears)**: Item 1 fades in and pops into the center hero area at full size with a subtle scale-up (0.9 → 1.0) and opacity (0 → 1) transition.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: Item 1 glides from the center to the top of the left sidebar, shrinking from hero size to compact list size (30% width). Simultaneously, Item 2 fades and pops into the center hero area.
4. **Step N (Item N-1 transitions, Item N appears)**: The previous hero glides to the next open slot in the sidebar list. The new item takes the center stage.
5. **Final state**: All items are visible in the left sidebar as a complete vertical list. The last item remains displayed as the hero in the center.

### Visual Layout Diagram

```
┌──────────┬──────────────────────┐
│ ✓ Item 1 │                      │
│ ✓ Item 2 │    ★ HERO ITEM 3     │
│          │    (large, centered)  │
│          │                      │
└──────────┴──────────────────────┘
   30%              70%
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1800ms)
- Each step consists of a paired animation: the current hero migrates to the sidebar while the next item appears as the new hero
- Voice-sync timestamps (when available) trigger each step transition
- After the final item, the complete list remains visible for the remainder of the slide duration

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a sidebar item highlights it with a subtle border glow and shows its description in a tooltip positioned to the right of the sidebar
- **Click on inactive item**: Clicking a sidebar item jumps back to it, re-expanding it as the hero in the center area while keeping all accumulated sidebar items visible
- **Keyboard**: → or Space = next, ← = previous
- After all items are revealed, the next click triggers the slide transition

## Parameters

| Parameter        | Type                  | Default  | Range       | Description                                           |
|------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`           | `GroupedAnimationType` | `list-accumulator` | —   | Animation type identifier                             |
| `items`          | `GroupedItem[]`       | —        | 3–10 items  | Ordered list of items to reveal                       |
| `stepDuration`   | `number`              | `1800`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`   | `boolean`             | `true`   | —           | Show tooltip on hover in click mode                   |
| `allowOutOfOrder`| `boolean`             | `true`   | —           | Allow clicking sidebar items to jump to them          |
| `triggerMode`    | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `sidebarWidth`   | `string`              | `30%`    | 20%–40%     | Width of the left sidebar zone                        |
| `heroScale`      | `number`              | `1.0`    | 0.8–1.2     | Scale factor for the hero item in the center          |
| `migrateDuration`| `number`              | `600`    | 300–1000ms  | Duration of the hero-to-sidebar migration animation   |

## Best For

- Feature lists where each feature deserves a moment of focus
- Agenda items at the start of a presentation
- Product capabilities and selling points
- Onboarding flows and step-by-step guides
- Any ordered list where progress tracking matters

## Storytelling Value

The List Accumulator shows progress while maintaining focus. The growing sidebar acts as a visual "checklist" — the audience always knows **where they are** in the sequence and **how many items remain**. This creates a satisfying sense of momentum and completion. The large hero area ensures each item gets its moment of full attention before being filed away, preventing information overload.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `ListAccumulatorDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[0]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

## Related Animations

- [Carousel Focus](./carousel-focus.md) — similar "one active item at a time" model but with a horizontal shelf instead of a growing list
- [Bento Grid Expansion](./bento-grid-expansion.md) — grid-based alternative where all items are visible from the start
- [Infinite Path](./infinite-path.md) — timeline-based progression with horizontal scrolling
