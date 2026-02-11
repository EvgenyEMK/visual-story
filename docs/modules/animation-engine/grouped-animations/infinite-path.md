# The "Infinite Path" (Timeline)

## Overview

A horizontal road or timeline spanning the slide, with items assembled at waypoints along the path. As the sequence progresses, the road scrolls left to bring the next waypoint into the center "sweet spot," creating the feeling of traveling through a continuous journey of content.

## Visual Behavior

### Layout

The slide features a **horizontal line or stylized road** running from left to right across the full width. Evenly-spaced **waypoints** (nodes/dots) sit on the line, each representing an item. The road extends beyond both edges of the slide, implying infinite continuation. A center "sweet spot" zone is visually emphasized — this is where the active item is displayed with full detail. Items to the left appear as "passed" (smaller, slightly faded), and items to the right appear as "coming" (hints or dots).

### Animation Sequence

1. **Initial state**: The road is visible spanning the slide. Waypoints are shown as small dots along the line. No items are assembled yet.
2. **Step 1 (Item 1 appears)**: Item 1 "assembles" at the first waypoint — its icon drops from above the slide and its text slides up from below, meeting at the waypoint in the center sweet spot.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: The entire road slides left, moving Item 1 out of the sweet spot to the left (where it shrinks and fades slightly as a "passed" milestone). Item 2's waypoint enters the sweet spot from the right, and its content assembles (icon drops, text slides up).
4. **Step N (Item N-1 transitions, Item N appears)**: The road continues sliding left. Previous items accumulate on the left as passed milestones. The new item assembles at center.
5. **Final state**: All items are assembled along the road. The road is positioned to show all items (or the last few items), with the entire journey visible as a completed timeline.

### Visual Layout Diagram

```
  ⬇icon     ⬇icon     ⬇icon
──●─────────●─────────●─────────●──→
  Item1     [Item2]   Item3     ...
  (passed)  (active)  (coming)
         ← scroll direction
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1600ms)
- Each step consists of the road scrolling left and the next item assembling at the center sweet spot
- The scroll animation uses an ease-in-out curve for smooth, natural movement
- Voice-sync timestamps (when available) trigger each scroll step
- After the final item, the road may zoom out slightly to show the complete timeline

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a waypoint on the road brightens its node dot and shows the item title in a small floating label
- **Click on inactive item**: Clicking any waypoint scrolls the road to center on that item, assembling it if not yet revealed
- **Keyboard**: → or Space = next, ← = previous
- After all items are revealed, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `infinite-path` | — | Animation type identifier                              |
| `items`             | `GroupedItem[]`       | —        | 3–10 items  | Ordered list of waypoint items                        |
| `stepDuration`      | `number`              | `1600`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show hover label on waypoints in click mode           |
| `allowOutOfOrder`   | `boolean`             | `true`   | —           | Allow clicking any waypoint to jump to it             |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `roadStyle`         | `string`              | `line`   | line, dashed, dotted | Visual style of the road/timeline line       |
| `assembleDirection` | `string`              | `vertical` | vertical, fade | How items assemble at waypoints                  |
| `passedOpacity`     | `number`              | `0.5`    | 0.3–0.7     | Opacity of passed milestone items                     |
| `scrollEasing`      | `string`              | `ease-in-out` | CSS easing | Easing function for the road scroll animation    |

## Best For

- Timelines showing chronological progression
- Roadmaps with milestones and upcoming features
- Step-by-step processes and workflows
- Historical sequences or "journey" narratives
- Onboarding flows that walk through sequential stages

## Storytelling Value

A continuous journey that implies **chronological or logical progression**. The scrolling road creates the feeling of "traveling through" the content — not just viewing static slides but experiencing a journey from start to finish. The passed milestones on the left provide a **sense of progress**, while the dots on the right create **anticipation** for what's ahead. This is the most naturally "narrative" grouped animation, perfectly suited for stories that have a beginning, middle, and end.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `InfinitePathDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[4]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

## Related Animations

- [List Accumulator](./list-accumulator.md) — vertical alternative that builds a list instead of scrolling a road
- [Circular Satellite](./circular-satellite.md) — radial alternative for non-linear relationship mapping
- [Stack Reveal](./stack-reveal.md) — depth-based alternative with 3D card stacking
