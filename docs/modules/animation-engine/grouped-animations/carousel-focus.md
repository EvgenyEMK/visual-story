# The "Carousel Focus" (Horizontal)

## Overview

A horizontal "shelf" of small, grayed-out icons at the bottom of the slide with a dynamic center "stage" where the active item is displayed at full size and color. Items lift from the shelf to take center stage, then drop back down when replaced — creating a dynamic, browsable showcase.

## Visual Behavior

### Layout

The slide is divided into two zones: a **center stage** (upper ~75% of the slide) where the active item is displayed large and in full color, and a **bottom shelf** (lower ~25%) showing a horizontal row of 3–5 small, desaturated item icons. The shelf acts as a persistent visual "table of contents" with the currently active item indicated by a filled dot or highlighted border.

### Animation Sequence

1. **Initial state**: All items are visible on the bottom shelf as small, grayed-out icons (or shown as faint placeholders if `showAllFromStart` is enabled). The center stage is empty or shows the first item.
2. **Step 1 (Item 1 appears)**: Item 1 lifts from its shelf position, grows in size, gains full color and opacity, and settles into the center stage. Its shelf position shows a filled indicator (●).
3. **Step 2 (Item 1 transitions, Item 2 appears)**: The current hero **visually shrinks and drops toward the shelf** (scale 1.0 → 0.35, translateY toward bottom) with smooth `cubic-bezier(0.16, 1, 0.3, 1)` easing. Simultaneously, Item 2 appears in center stage.
4. **Step N (Item N-1 transitions, Item N appears)**: The previous active item drops to the shelf with the shrinking animation. The next item takes center stage.
5. **Final state**: The last item is displayed on center stage. All items remain visible on the shelf with the last item's position highlighted.

### Click on Shelf Item (Reverse Animation)

When a user clicks a **previously revealed item** in the shelf:
- The clicked item rises from its shelf position to the center stage, growing in size
- The CSS transition handles the smooth movement from shelf to center
- The previously displayed hero item fades out
- All other revealed items remain visible in the shelf with full color
- This is a **non-destructive review** — no items are hidden by this action

### Visual Layout Diagram

```
┌────────────────────────────────────┐
│                                    │
│         ★ ACTIVE ITEM              │
│         (3x size, color)           │
│                                    │
├───┬───┬───┬───┬───────────────────┤
│ ○ │ ○ │ ● │ ○ │ ○   ← shelf      │
└───┴───┴───┴───┴───────────────────┘
         ● = active item
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1600ms)
- Each step consists of a paired animation: the current item drops to the shelf while the next item lifts to center stage
- Transitions overlap slightly (the drop and lift happen concurrently) for smooth visual flow
- Voice-sync timestamps (when available) trigger each step transition
- After the final item, it remains on stage for the remainder of the slide duration

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a shelf item brightens it slightly (opacity 0.4 → 0.7) and shows its title in a tooltip above the icon
- **Click on inactive item**: Clicking any shelf item lifts it directly to center stage, skipping intermediate items
- **Keyboard**: → or Space = next, ← = previous
- After all items have been shown, the next click triggers the slide transition

## Parameters

| Parameter        | Type                  | Default  | Range       | Description                                           |
|------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`           | `GroupedAnimationType` | `carousel-focus` | — | Animation type identifier                             |
| `items`          | `GroupedItem[]`       | —        | 3–5 items   | Ordered list of items to showcase                     |
| `stepDuration`   | `number`              | `1600`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`   | `boolean`             | `true`   | —           | Show tooltip on hover in click mode                   |
| `allowOutOfOrder`| `boolean`             | `true`   | —           | Allow clicking any shelf item to jump to it           |
| `triggerMode`    | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `liftScale`      | `number`              | `3.0`    | 2.0–4.0     | Scale multiplier when item lifts to center stage      |
| `shelfHeight`    | `string`              | `25%`    | 15%–35%     | Height of the bottom shelf zone                       |
| `desaturation`   | `number`              | `100`    | 50–100%     | Grayscale percentage for inactive shelf items         |
| `showAllFromStart`| `boolean`            | `false`  | —           | Show all items in shelf as faint placeholders from the start (20% opacity) |

## Best For

- Product features where all options should be visible at once
- Plan comparisons (e.g., Basic / Pro / Enterprise)
- Tool showcases with icon-driven navigation
- Portfolio highlights with visual thumbnails
- Any collection where the audience benefits from seeing all options upfront

## Storytelling Value

The shelf acts as a visual "table of contents" — the audience always sees all options, creating **anticipation** for what's coming next. Unlike the List Accumulator (which builds a list over time), the Carousel Focus reveals the full scope immediately. This works well when the number of items is known and finite. The lift-and-drop animation creates a sense of **selection**, as if the presenter is picking items from a display case.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `CarouselFocusDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[1]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

## Related Animations

- [List Accumulator](./list-accumulator.md) — similar "one active item" model but with a growing sidebar instead of a static shelf
- [Fan-Out](./fan-out.md) — arc-based layout where items fan out from a single point
- [Stack Reveal](./stack-reveal.md) — 3D card stack alternative with depth perspective
