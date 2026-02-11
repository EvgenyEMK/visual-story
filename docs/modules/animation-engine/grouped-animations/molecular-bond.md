# The "Molecular Bond" (Network)

## Overview

A central large bubble acts as the nucleus while child bubbles "bud" outward from it, connected by growing lines (bonds) that visually link each new concept to the core. The result is an organic, expanding mind map that reveals how ideas are interconnected, with each new node growing naturally from the center.

## Visual Behavior

### Layout

The slide features a **central large bubble** (the core concept) positioned at the center, with **child bubbles** (secondary concepts) budding outward from it in various directions. Each child bubble is connected to the core by an **SVG line** (bond) that grows from the core to the child during the reveal animation. The layout is organic and non-uniform — child bubbles are positioned to balance the visual weight, not locked to rigid grid positions.

### Animation Sequence

1. **Initial state**: One large bubble is visible at the center of the slide containing the core concept's icon and title. The bubble has a subtle breathing animation (gentle scale pulse).
2. **Step 1 (Item 1 appears)**: Item 1 "buds" from the core — a new, smaller bubble grows outward from the core's edge (scale 0 → 1). Simultaneously, a connection line (SVG path) draws from the core to the new bubble. Item 1's content (icon, title) appears inside the bubble.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: Item 1's bubble remains visible but shrinks slightly (90% size) and its connection line dims to a subtle state. Item 2 buds from a different side of the core with a new growing connection line.
4. **Step N (Item N-1 transitions, Item N appears)**: Previous bubbles remain connected but dimmed. The new bubble buds from the core with an animated connection line.
5. **Final state**: All child bubbles are visible around the core, connected by bond lines, forming a complete network/mind map. All elements return to full opacity.

### Visual Layout Diagram

```
     ○ Item1
      \
  ○Item5 — ●CORE — ○ Item2
      /         \
     ○ Item4    ○ Item3
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1200ms)
- Each step consists of a new child bubble budding from the core with a growing connection line
- The budding animation (~400ms) is followed by a brief hold before the next step
- Voice-sync timestamps (when available) trigger each bubble's emergence
- After the final item, all connections and bubbles brighten to full opacity for the complete network view

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a child bubble highlights its connection line (line pulses with a glow effect) and brightens the bubble to full opacity, showing its full content
- **Click on inactive item**: Clicking any bubble makes it the active focus — the bubble brightens, its connection line glows, and its full content (description) is revealed. Other bubbles dim slightly.
- **Keyboard**: → or Space = next, ← = previous
- After all bubbles are revealed, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `molecular-bond` | — | Animation type identifier                              |
| `items`             | `GroupedItem[]`       | —        | 3–8 items   | Ordered list of child bubble items                    |
| `stepDuration`      | `number`              | `1200`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show hover highlight in click mode                    |
| `allowOutOfOrder`   | `boolean`             | `true`   | —           | Allow clicking any bubble to focus on it              |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `bondStyle`         | `string`              | `solid`  | solid, dashed, gradient | Visual style of the connection lines         |
| `bondColor`         | `string`              | `auto`   | CSS color   | Color of connection lines (auto = match item color)   |
| `coreSize`          | `number`              | `120`    | 80–200px    | Diameter of the central core bubble                   |
| `childSize`         | `number`              | `80`     | 50–120px    | Diameter of child bubbles                             |
| `spreadRadius`      | `number`              | `180`    | 120–300px   | Average distance from core to child bubbles           |

## Best For

- Mind maps and brainstorming visualizations
- Concept relationships and idea clusters
- Interconnected ideas where peer-to-peer relationships matter
- Dependency diagrams and system component maps
- "How things connect" narratives

## Storytelling Value

An organic, growing "Mind Map" that visualizes how ideas are **interconnected**. Unlike the Circular Satellite layout (which implies hierarchy with a dominant center), the Molecular Bond implies **equal, interconnected relationships** — each bubble is a peer node in the network, and the bonds show how they relate. The organic growth pattern feels natural and exploratory, as if the presenter is mapping out ideas in real time. This creates a collaborative, discovery-oriented tone.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `MolecularBondDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[7]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

**SVG Note**: Connection lines (bonds) are rendered as SVG `<path>` or `<line>` elements overlaid on the slide. The SVG layer is positioned absolutely to match the bubble positions. Line growth is animated using `stroke-dasharray` and `stroke-dashoffset` techniques.

## Related Animations

- [Circular Satellite](./circular-satellite.md) — radial alternative with a more hierarchical core-to-satellite relationship
- [Magnifying Glass](./magnifying-glass.md) — canvas-based alternative for exploring complex interconnected diagrams
- [Bento Grid Expansion](./bento-grid-expansion.md) — grid-based alternative for structured, non-networked content
