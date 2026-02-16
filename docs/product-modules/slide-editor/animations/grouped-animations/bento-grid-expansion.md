# The "Bento Grid Expansion"

## Overview

A modular grid of 4–6 equal-sized rectangular boxes (inspired by the "Bento box" design trend) where each box can expand to fill the majority of the slide for a detailed view, then collapse back so the next box can take focus. All items remain visible at all times, maintaining context while diving deep into each.

## Visual Behavior

### Layout

The slide displays a **grid of 4–6 equal-sized rectangles** arranged in a 2×2, 2×3, or 3×2 layout. Each box contains an icon and a short title. When a box is active, it expands to occupy ~70% of the slide area, pushing the remaining boxes into a compact stack on the right or bottom edge. The grid maintains consistent spacing and rounded corners for a clean, modern aesthetic.

### Animation Sequence

1. **Initial state**: All boxes are visible at equal size in a balanced grid layout. Each box shows an icon and title. Boxes may have subtle color-coded borders or backgrounds.
2. **Step 1 (Item 1 appears)**: Item 1's box smoothly expands to fill 70% of the slide. Its content reveals a larger icon, full title, and description text. The remaining boxes smoothly compress and stack along the right or bottom edge.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: Item 1's box smoothly shrinks back to its compact size and rejoins the stack. Item 2's box expands to 70% with its detailed content.
4. **Step N (Item N-1 transitions, Item N appears)**: The previously expanded box contracts. The next box expands to reveal its detail view.
5. **Final state**: The last item remains expanded, or the grid returns to its original equal-size layout showing all items as a complete overview.

### Visual Layout Diagram

```
┌──────────────────────┬─────┐
│                      │  B  │
│     A (expanded)     ├─────┤
│     70% of space     │  C  │
│                      ├─────┤
│                      │  D  │
└──────────────────────┴─────┘
  A = active detail view
  B, C, D = stacked compact boxes
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 2000ms)
- Each step consists of the current expanded box contracting and the next box expanding
- The slightly longer default duration (2000ms) accounts for the more complex grid rearrangement animation
- Voice-sync timestamps (when available) trigger each step transition
- After the final item, the grid may optionally return to its equal-size overview state

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a grid box subtly enlarges it (5% scale increase) and brightens its border with a soft glow effect
- **Click on inactive item**: Clicking any grid box immediately expands it as the active detail view, regardless of sequence order
- **Keyboard**: → or Space = next, ← = previous
- After all items have been shown, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `bento-grid-expansion` | — | Animation type identifier                           |
| `items`             | `GroupedItem[]`       | —        | 4–6 items   | Ordered list of items in the grid                     |
| `stepDuration`      | `number`              | `2000`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show hover enlargement in click mode                  |
| `allowOutOfOrder`   | `boolean`             | `true`   | —           | Allow clicking any grid box to expand it              |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `gridColumns`       | `number`              | `auto`   | 2–3         | Number of columns in the grid layout                  |
| `expandRatio`       | `number`              | `0.70`   | 0.5–0.85    | Fraction of slide area the expanded box occupies      |
| `borderRadius`      | `number`              | `12`     | 0–24px      | Corner radius of grid boxes                           |
| `gapSize`           | `number`              | `8`      | 4–16px      | Gap between grid boxes                                |

## Best For

- Feature grids with icon-driven categories
- Dashboard overviews where each section has detail content
- Category overviews (e.g., "Our Services," "Product Modules")
- Landing page feature showcases
- Any structured content that benefits from a "see all, explore one" interaction

## Storytelling Value

Modular, modern grid that feels organized and structural — like an **Apple product page**. The Bento Grid communicates **completeness and structure**: the audience sees the "whole picture" at all times while deep-diving into each section. Unlike the List Accumulator (which builds over time), the Bento Grid says "here's everything — now let me walk you through each piece." This is ideal for content where the items are peers (no hierarchy) and the total count matters.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `BentoGridDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[2]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

## Related Animations

- [List Accumulator](./list-accumulator.md) — vertical sidebar alternative that builds a list over time
- [Magnifying Glass](./magnifying-glass.md) — canvas-based alternative with a roaming lens for detail views
- [Carousel Focus](./carousel-focus.md) — shelf-based alternative with lift/drop mechanics
