# Color Shift

## Overview
A grayed-out element transitions to full brand color by animating from `grayscale(100%)` to `grayscale(0%)`, visually "activating" the element as if switching it from off to on.

## Visual Behavior

### Stages
1. **Initial state**: The element is already visible on the slide but rendered in full grayscale (`filter: grayscale(100%)`), appearing muted and inactive.
2. **Animation**: The grayscale filter smoothly decreases from 100% to 0%, allowing the element's original colors to bloom into view. Optionally, brightness adjusts simultaneously for added vibrancy.
3. **Final state**: The element displays its full, original colors (`filter: grayscale(0%)`) and remains in this activated state for the rest of the slide.

### CSS Properties Animated
- `filter` (`grayscale`, `brightness`)

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 0.8s)
- Works well with stagger: a row of feature icons can "light up" one after another, creating a sequential activation effect

### Click Mode
- Fires on presenter click/spacebar/arrow
- Element is visible in grayscale from the start — it is already on screen, just not yet "activated"
- Animation plays at configured duration; trigger timing is human-controlled
- Particularly effective in click mode for before/after reveals — the presenter can narrate the "before" state, then click to activate the "after"

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'color-shift'` | — | Animation identifier |
| `duration` | `number` | `0.8` | 0.3–2.0s | Animation duration in seconds |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'ease-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |

> **Note:** Like [Pulse Emphasis](./pulse-emphasis.md), the element is already visible in its grayed-out state. The animation "activates" it rather than revealing it. Do not pair with an entrance animation on the same trigger.

## Best For
- Before/after scenarios (grayscale "before" → colorful "after")
- Feature activation — showing a feature "turning on"
- Progress indicators where completed steps gain color
- Icon grids where each icon activates as it is discussed
- Comparison slides showing inactive vs. active states

## Storytelling Value
The Color Shift is perfect for "Before vs. After" scenarios. It signals that a solution has been activated, a feature has been turned on, or a transformation has occurred. The shift from gray to color is universally understood as "going from off to on" — it requires no explanation. When synced with voice-over, it creates a powerful moment: the narrator says "and then we enabled X" while the element blooms into color. Simple, effective, and immediately understood by any audience.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-color-shift` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `ColorShiftDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[7]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Pulse Emphasis](./pulse-emphasis.md) — another emphasis animation that draws attention via scale instead of color
- [Smooth Fade](./smooth-fade.md) — entrance animation using opacity; use Smooth Fade to reveal, Color Shift to activate
- [Shimmer](./shimmer.md) — post-activation attention effect using a moving gradient overlay
