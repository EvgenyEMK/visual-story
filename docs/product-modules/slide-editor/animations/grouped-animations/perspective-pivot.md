# The "Perspective Pivot" (3D Flip)

## Overview

A 3D cube or prism sits at the center of the slide, with content displayed on each of its faces. The shape rotates 90° on each advance to reveal the next face, creating a clean, geometric transition that literally shows "different sides" of a concept. The 3D rotation is smooth and high-tech, making it ideal for multi-faceted topics.

## Visual Behavior

### Layout

The slide features a **3D shape** (cube or triangular prism) rendered at center stage using CSS 3D transforms. Each face of the shape displays one item's content (icon, title, description). Only the front-facing face is fully visible and readable at any time. The shape uses `perspective: 600px` and `transform-style: preserve-3d` for authentic 3D rendering. Back faces use `backface-visibility: hidden` to prevent reverse-text artifacts.

### Animation Sequence

1. **Initial state**: The cube/prism is displayed at center with Item 1's content on the front face. The 3D shape has subtle lighting/shadow to establish depth. Edges of adjacent faces may be slightly visible to hint at the 3D nature.
2. **Step 1 (Item 1 visible)**: Item 1 is displayed on the front face of the shape. Content is fully readable with icon, title, and description.
3. **Step 2 (Item 2 appears)**: The shape smoothly rotates 90° on the Y-axis (or X-axis, configurable), revealing Item 2 on the next face. The rotation uses an ease-in-out curve (~600ms) for a polished feel.
4. **Step N (Item N appears)**: The shape continues rotating to reveal each subsequent face.
5. **Final state**: The last face is displayed. For a cube (4 faces), up to 4 items can be shown. For a prism (3 faces), up to 3 items.

### Visual Layout Diagram

```
    ┌──────────┐
    │          │╲
    │  Face 1  │ │ ← Face 2 (hidden)
    │ (front)  │ │
    │          │╱
    └──────────┘
       rotates →
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 2000ms)
- Each step consists of a 90° rotation revealing the next face
- The longer default duration (2000ms) gives the audience time to read each face's content before the rotation
- Voice-sync timestamps (when available) trigger each rotation
- After the final face, the shape remains stationary for the rest of the slide duration

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering the shape shows a subtle rotation hint — a slight wobble (±3° oscillation) indicating the shape can be rotated
- **Click on inactive item**: Click rotates to the next face; on advanced/touch devices, drag can rotate the shape freely for exploration
- **Keyboard**: → or Space = next (rotates forward), ← = previous (rotates backward)
- After the last face is shown, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `perspective-pivot` | — | Animation type identifier                            |
| `items`             | `GroupedItem[]`       | —        | 3–4 items   | Ordered list of items (one per face)                  |
| `stepDuration`      | `number`              | `2000`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show wobble hint on hover in click mode               |
| `allowOutOfOrder`   | `boolean`             | `false`  | —           | Sequential rotation only (no face skipping)           |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `shape`             | `string`              | `cube`   | cube, prism | 3D shape type (cube = 4 faces, prism = 3 faces)      |
| `axis`              | `string`              | `Y`      | Y, X        | Rotation axis (Y = vertical/left-right, X = horizontal/top-bottom) |
| `perspective`       | `number`              | `600`    | 400–1000px  | CSS perspective value for 3D depth                    |
| `rotationDuration`  | `number`              | `600`    | 300–1000ms  | Duration of each 90° rotation animation               |

## Best For

- Multi-faceted concepts ("4 pillars of...," "3 perspectives on...")
- Comparisons where each option deserves full-screen focus
- Different perspectives on a single topic
- Product views (front, features, pricing, testimonials)
- Small collections (3–4 items) that benefit from dramatic reveals

## Storytelling Value

Clean, geometric center-stage focus that feels **"high-tech"** and polished. The rotation metaphor communicates "different facets of the same thing" — literally showing the **other sides**. This is uniquely powerful for content where the items are genuinely different perspectives or aspects of one unified concept (not just a list of unrelated items). The 3D effect adds visual sophistication and creates memorable transitions. The limited face count (3–4) ensures each item gets significant attention.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `PerspectivePivotDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[8]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

**CSS Note**: Uses `perspective: 600px`, `transform-style: preserve-3d`, `rotateY` (or `rotateX`), and `backface-visibility: hidden`. Each face is positioned using `translateZ` to form the cube/prism geometry. The rotation animation applies to the parent container, not individual faces.

## Related Animations

- [Stack Reveal](./stack-reveal.md) — 3D alternative using card stacking depth instead of face rotation
- [Carousel Focus](./carousel-focus.md) — 2D alternative with a horizontal shelf for more than 4 items
- [Fan-Out](./fan-out.md) — 2D arc layout where all items remain visible simultaneously
