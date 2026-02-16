# The "Circular Satellite" (Orbital)

## Overview

A central "Core Idea" icon anchors the middle of the slide while satellite items emerge from behind it and glide to orbital positions arranged like clock positions around the core. Each satellite reveals text labels on arrival, building a complete radial ecosystem one piece at a time.

## Visual Behavior

### Layout

The slide features a **central core icon** (the primary concept) positioned at the exact center, surrounded by **satellite items** arranged at evenly-spaced positions around it (like numbers on a clock face). Connection lines radiate from the core to each satellite. The layout is inherently radial, emphasizing the relationship between each satellite and the central concept.

### Animation Sequence

1. **Initial state**: Only the core icon is visible in the center of the slide, displayed prominently with a subtle pulse or glow to draw attention.
2. **Step 1 (Item 1 appears)**: Item 1 emerges from behind the core icon (scale 0 → 1, opacity 0 → 1), glides outward to the 12 o'clock position, and reveals its text label. A connection line grows from the core to the satellite.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: Item 1's text label fades to 20% opacity (the satellite icon remains fully visible). Item 2 emerges from behind the core and glides to the 3 o'clock position (or next clock position). Its text label appears at full opacity.
4. **Step N (Item N-1 transitions, Item N appears)**: The previous satellite's text fades to 20% opacity. The new satellite emerges and takes its orbital position with a fully visible label.
5. **Final state**: All satellites are visible at their orbital positions with connection lines to the core. All text labels return to full opacity, revealing the complete ecosystem.

### Visual Layout Diagram

```
        ● Item5
       / 
  ●Item1 — ★CORE — ●Item2
       \
        ● Item4   ● Item3
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1200ms)
- Each step consists of a satellite emerging and gliding to its orbital position
- The shorter default duration (1200ms) keeps the build-up energetic and flowing
- Voice-sync timestamps (when available) trigger each satellite's emergence
- After the final item, all labels fade to full opacity for the complete view

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a satellite brightens its text label back to full opacity and shows a connecting line glow animation (pulse along the line from core to satellite)
- **Click on inactive item**: Clicking any satellite makes it the active focus — its text brightens to full opacity, its connection line glows, and other labels dim
- **Keyboard**: → or Space = next, ← = previous
- After all satellites are revealed, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `circular-satellite` | — | Animation type identifier                            |
| `items`             | `GroupedItem[]`       | —        | 3–8 items   | Ordered list of satellite items                       |
| `stepDuration`      | `number`              | `1200`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show hover brightening in click mode                  |
| `allowOutOfOrder`   | `boolean`             | `true`   | —           | Allow clicking any satellite to focus on it           |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `orbitRadius`       | `number`              | `200`    | 120–350px   | Distance from core center to satellite positions      |
| `startAngle`        | `number`              | `-90`    | -180–180°   | Angle of the first satellite (−90 = 12 o'clock)       |
| `inactiveOpacity`   | `number`              | `0.2`    | 0.1–0.5     | Text opacity for non-active satellites                |
| `showConnections`   | `boolean`             | `true`   | —           | Show connection lines from core to satellites         |

## Best For

- Ecosystem diagrams showing how parts relate to a central concept
- Related concepts branching from a core idea
- "Hub and spoke" relationship visualizations
- Product suites radiating from a platform
- Team structure with a central leader/department

## Storytelling Value

A "Sun and Planets" map that builds a complete ecosystem in real time. The audience sees the **relationships form** as each satellite emerges and connects to the core, understanding how each piece connects to the center. The radial layout inherently communicates **hierarchy** (core is primary, satellites are secondary) and **belonging** (everything connects back to the center). The gradual reveal creates a sense of a world being built around the central idea.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `CircularSatelliteDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[3]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

## Related Animations

- [Molecular Bond](./molecular-bond.md) — network-based alternative with equal peer relationships instead of hierarchy
- [Fan-Out](./fan-out.md) — arc-based layout that fans out from a single collapsed point
- [Infinite Path](./infinite-path.md) — linear alternative for sequential/chronological relationships
