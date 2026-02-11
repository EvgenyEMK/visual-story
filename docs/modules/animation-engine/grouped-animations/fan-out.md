# The "Fan-Out" (Hand of Cards)

## Overview

A single icon in the center of the slide "splits" and fans out into an arc of 3–5 items, like a hand of playing cards being spread. Once fanned, a glowing highlighter moves from card to card as the narration progresses, drawing focus to each item in turn while all remain visible.

## Visual Behavior

### Layout

The slide starts with a **single consolidated icon** at center. On the first advance, it splits into multiple items arranged in a **semi-circular arc** (like a hand of playing cards fanned out). Items are evenly distributed across a configurable arc angle (default 60°). Each card is slightly rotated to follow the arc's curvature. A **highlighter** (glowing ring, scale-up, or color pulse) indicates the currently active card.

### Animation Sequence

1. **Initial state**: A single icon or logo is displayed at the center of the slide, representing the unified concept that the items belong to.
2. **Step 1 (Fan-out)**: The single icon "splits" — it scales down and duplicates into 3–5 individual cards that fan out into an arc formation. Each card rotates to its arc position with a staggered timing (50ms between each). Item 1 receives the highlighter (glowing ring).
3. **Step 2 (Item 2 highlighted)**: The highlighter smoothly transitions from Item 1 to Item 2 — the glowing ring slides along the arc, Item 1 dims slightly, Item 2 brightens and may scale up 10%.
4. **Step N (Item N highlighted)**: The highlighter continues moving through the arc to each successive card.
5. **Final state**: All cards remain in the fanned arc. The highlighter may cycle back to show all items equally, or the last item remains highlighted.

### Visual Layout Diagram

```
      ╱ Card1 ╲
    ╱   Card2   ╲
  ╱     Card3     ╲
╱      [Card4]      ╲  ← highlighted
        Card5
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1000ms)
- The initial fan-out animation takes ~800ms, then the highlighter begins moving
- Each subsequent step moves the highlighter to the next card
- The short default duration (1000ms) keeps the spotlight moving quickly since all items are already visible
- Voice-sync timestamps (when available) trigger each highlight shift

### Click Mode

- Each click advances to the next item
- **Hover on inactive items**: Hovering a card in the fan enlarges it slightly (scale 1.0 → 1.08) and shows its description in a tooltip positioned above the card
- **Click on inactive item**: Clicking any card in the fan immediately highlights it, moving the glowing ring to that card
- **Keyboard**: → or Space = next, ← = previous
- After all items have been highlighted, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `fan-out` | —       | Animation type identifier                              |
| `items`             | `GroupedItem[]`       | —        | 3–5 items   | Ordered list of items in the fan                      |
| `stepDuration`      | `number`              | `1000`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show hover enlargement and tooltip in click mode      |
| `allowOutOfOrder`   | `boolean`             | `true`   | —           | Allow clicking any card to highlight it directly      |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `fanAngle`          | `number`              | `60`     | 30–120°     | Total arc angle across which the cards fan out        |
| `highlightStyle`    | `string`              | `ring`   | ring, glow, scale | Visual style of the active card highlighter     |
| `fanRadius`         | `number`              | `180`    | 100–300px   | Radius of the fan arc from the pivot point            |
| `staggerDelay`      | `number`              | `50`     | 20–100ms    | Delay between each card's fan-out animation           |

## Best For

- Feature suites branching from a single product or concept
- Tool collections that belong to one platform
- Options or variants derived from one source
- "One thing, many facets" narratives
- Quick visual overviews of related capabilities

## Storytelling Value

Ideal for showing a **"Suite" of features from a single concept**. The fan metaphor communicates that these items all **belong together** — they're different faces of the same idea, literally fanning out from one source. The initial "split" moment is visually dramatic and immediately signals "this one thing is actually many things." The persistent arc layout keeps all items visible, and the moving highlighter provides guided narration without losing context.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `FanOutDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[6]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

## Related Animations

- [Circular Satellite](./circular-satellite.md) — full 360° radial layout with a persistent core, compared to Fan-Out's semi-circular arc
- [Stack Reveal](./stack-reveal.md) — sequential card reveal with 3D depth instead of a fanned arc
- [Carousel Focus](./carousel-focus.md) — horizontal shelf with one active item at a time
