# Staggered Wipe

## Overview
Text or bars reveal from one direction (usually left-to-right) using a `clip-path` animation, creating the visual impression of content being "wiped" into existence.

## Visual Behavior

### Stages
1. **Initial state**: The element is fully clipped — invisible behind an invisible boundary defined by `clip-path: inset(0 100% 0 0)` (for left-to-right).
2. **Animation**: The clip boundary slides across the element, progressively revealing its content from the leading edge to the trailing edge.
3. **Final state**: The element is fully unclipped (`clip-path: inset(0 0 0 0)`) and remains visible for the rest of the slide.

### CSS Properties Animated
- `clip-path`

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 0.8s)
- Works well with stagger: multiple elements can use this animation with increasing delays — ideal for bar charts where each bar wipes in sequentially

### Click Mode
- Fires on presenter click/spacebar/arrow
- Element is invisible until triggered
- Animation plays at configured duration; trigger timing is human-controlled
- Wipe direction remains consistent regardless of click timing, ensuring a professional look even with rapid clicks

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'staggered-wipe'` | — | Animation identifier |
| `duration` | `number` | `0.8` | 0.3–1.5s | Animation duration in seconds |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'ease-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `direction` | `WipeDirection` | `'left-to-right'` | left-to-right, right-to-left, top-to-bottom, bottom-to-top | Direction of the wipe reveal |

## Best For
- Bar charts where each bar wipes in to represent growth
- Statistics and progress bars filling to their target value
- Data visualizations that should "build up" over time
- Text headlines revealed in a dramatic, directional sweep
- Timeline elements appearing in chronological order

## Storytelling Value
The Staggered Wipe mimics the way we read — left to right — making numbers and data feel like they are "growing" in real time. It is perfect for revealing bar charts, progress bars, or text headlines where the directionality of the reveal carries meaning. When paired with voice-over narration like "revenue grew by 40%," the wipe visually reinforces the growth narrative, making the data feel alive and dynamic.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-staggered-wipe` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `StaggeredWipeDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[1]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Masked Reveal](./masked-reveal.md) — similar clip-path technique with more cinematic "curtain" directions
- [Smooth Fade](./smooth-fade.md) — non-directional alternative using opacity
- [Path Follow](./path-follow.md) — another directional animation that draws along a path
