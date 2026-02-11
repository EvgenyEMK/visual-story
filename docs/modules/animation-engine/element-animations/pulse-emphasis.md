# The Pulse (Emphasis)

## Overview
An already-visible element grows 5–10% in size and then shrinks back to its original scale, drawing the audience's attention to it without displacing it from its position.

## Visual Behavior

### Stages
1. **Initial state**: The element is already fully visible at its normal size (`transform: scale(1)`). Unlike entrance animations, the element does not start hidden.
2. **Animation**: The element smoothly scales up to the configured intensity (e.g., `scale(1.08)`) and then returns to `scale(1)`, creating a rhythmic "breathing" effect.
3. **Final state**: The element returns to its original size (`transform: scale(1)`) and remains visible. The pulse can optionally repeat for sustained emphasis.

### CSS Properties Animated
- `transform` (`scale`)

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 1.8s)
- Works well with stagger: multiple elements can pulse in sequence to create a "wave" of emphasis across a data dashboard

### Click Mode
- Fires on presenter click/spacebar/arrow
- In click mode, the pulse fires **each time** the presenter clicks while pointing at this element — allowing repeated emphasis
- Can also auto-pulse when voice-over mentions a keyword associated with the element
- Useful for live Q&A scenarios where the presenter wants to re-emphasize a key metric

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'pulse-emphasis'` | — | Animation identifier |
| `duration` | `number` | `1.8` | 0.8–3.0s | Animation duration in seconds (full grow-and-shrink cycle) |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'ease-in-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `intensity` | `number` | `1.08` | 1.02–1.25 | Scale factor at peak of pulse (1.08 = 8% growth) |

> **Note:** This is an **emphasis** animation — the element is already visible on the slide. It is used to draw attention, not to reveal. Do not combine it with an entrance animation on the same trigger.

## Best For
- Key metrics and KPIs ($2.4M revenue, +27% growth)
- Statistics that the narrator is currently discussing
- Important numbers or callouts that need momentary spotlight
- Dashboard elements during data-driven storytelling
- Highlighting a specific item in a comparison or list

## Storytelling Value
The Pulse draws the eye to exactly what the AI voice is talking about right now. It is subtle enough not to distract from surrounding content but powerful enough to command attention in the moment. Think of it as a visual "underline" — it says "this number matters" without shouting. When synced to voice-over timestamps, it creates a seamless connection between what the audience hears and what they see emphasized on screen.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-pulse-emphasis` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `PulseDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[3]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Pop Zoom](./pop-zoom.md) — entrance animation using scale; use Pop Zoom to reveal, Pulse to emphasize after reveal
- [Color Shift](./color-shift.md) — another emphasis animation that "activates" color instead of size
- [Shimmer](./shimmer.md) — attention-drawing overlay effect using a moving gradient
