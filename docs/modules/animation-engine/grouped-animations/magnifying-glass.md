# The "Magnifying Glass" (Map/Canvas)

## Overview

A large, complex diagram or collage serves as a blurred background canvas while a sharp circular "lens" moves across it, enlarging and clarifying each item in turn. The audience always sees the full picture in the background while the lens provides focused, detailed views of individual areas — creating a powerful "overview + detail" narrative.

## Visual Behavior

### Layout

The slide displays a **full-canvas background** containing all items arranged in a spatial layout (diagram, collage, map, or architectural diagram). The background is rendered with a **CSS blur filter** and reduced opacity, making it visible but not readable. A **circular lens** (sharp, unblurred window with a visible border) is positioned over the canvas, showing the area beneath it at full clarity and optionally at a larger scale. The lens moves from item to item as the sequence progresses.

### Animation Sequence

1. **Initial state**: The full canvas is visible but blurred (`filter: blur(3px)`) and at reduced opacity (0.4). Items are positioned at their spatial locations on the canvas. No lens is visible yet.
2. **Step 1 (Item 1 appears)**: The lens fades in over Item 1's position on the canvas. The area inside the lens is sharp, full opacity, and slightly enlarged. Item 1's content (icon, title, description) is clearly readable within the lens.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: The lens glides smoothly from Item 1's position to Item 2's position. As the lens moves, the area it passes over is momentarily clarified. Item 2 becomes the focused content within the lens.
4. **Step N (Item N-1 transitions, Item N appears)**: The lens continues gliding to each item's position on the canvas.
5. **Final state**: The lens may fade out and the entire canvas de-blurs, revealing all items at full clarity. Alternatively, the last item remains focused in the lens.

### Visual Layout Diagram

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  (blurred canvas)
│  ○item1    ○item2          │
      ╭─────╮
│     │LENS │    ○item3      │
      │item2│
│     ╰─────╯                │
  ○item4         ○item5
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1800ms)
- Each step consists of the lens gliding to the next item's position on the canvas
- The lens movement uses a smooth ease-in-out curve, taking ~600ms to travel between positions
- Voice-sync timestamps (when available) trigger each lens movement
- After the final item, the canvas may optionally de-blur to reveal the complete picture

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a location on the canvas shows a small label of what's there — a floating tooltip with the item's title appears near the cursor
- **Click on inactive item**: Clicking anywhere on the canvas moves the lens to that location; if an item is nearby, the lens snaps to center on it
- **Keyboard**: → or Space = next, ← = previous
- After all items have been focused, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `magnifying-glass` | — | Animation type identifier                            |
| `items`             | `GroupedItem[]`       | —        | 3–8 items   | Ordered list of items with canvas positions           |
| `stepDuration`      | `number`              | `1800`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show hover labels on canvas in click mode             |
| `allowOutOfOrder`   | `boolean`             | `true`   | —           | Allow clicking anywhere on canvas to move the lens    |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `lensSize`          | `number`              | `96`     | 64–160px    | Diameter of the magnifying lens in pixels             |
| `blurAmount`        | `number`              | `3`      | 1–8px       | CSS blur filter value for the background canvas       |
| `canvasOpacity`     | `number`              | `0.4`    | 0.2–0.6     | Opacity of the blurred background canvas              |
| `lensZoom`          | `number`              | `1.5`    | 1.0–2.5     | Scale factor inside the lens (1.0 = no zoom)          |
| `lensBorder`        | `string`              | `3px solid rgba(255,255,255,0.8)` | CSS border | Border style for the lens circle |

## Best For

- Complex diagrams that need guided walkthroughs
- "Overview + detail" narratives for architectural diagrams
- Maps with points of interest
- Dense infographics where each section deserves focus
- System architecture or workflow diagrams

## Storytelling Value

A "Big Picture" canvas where the audience always knows **where they are** in the overall map. The lens metaphor communicates "let me zoom in on this specific part" while maintaining full context — the audience never loses sight of the whole. This is uniquely powerful for **complex, spatial content** where the relationships between items are positional (not just sequential). The blurred background creates visual intrigue, and the moving lens creates a guided tour experience.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `MagnifyingGlassDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[9]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

**CSS Note**: Uses `filter: blur()` on the background canvas layer, `border-radius: 50%` and `overflow: hidden` for the circular lens shape. The lens is implemented as an absolutely-positioned element with `clip-path` or overflow clipping that renders the same canvas content without the blur filter. Lens movement is animated with CSS `transform: translate()` transitions.

## Related Animations

- [Bento Grid Expansion](./bento-grid-expansion.md) — grid-based alternative where items expand in place rather than being viewed through a lens
- [Circular Satellite](./circular-satellite.md) — radial layout for relationship diagrams with a building reveal
- [Molecular Bond](./molecular-bond.md) — network layout alternative for interconnected concept maps
