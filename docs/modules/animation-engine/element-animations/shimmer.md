# The Shimmer

## Overview
A subtle light streak passes over a button, key word, or call-to-action element using a moving linear gradient, creating an eye-catching flash of light that says "look here" without moving the element.

## Visual Behavior

### Stages
1. **Initial state**: The element is already fully visible on the slide. An invisible gradient overlay is positioned off-screen to the left of the element.
2. **Animation**: The gradient overlay sweeps across the element from left to right (at the configured angle), creating the visual impression of a light streak or "glint" passing over the surface.
3. **Final state**: The gradient overlay moves off-screen to the right, and the element returns to its normal appearance. The shimmer can optionally repeat for sustained attention.

### CSS Properties Animated
- `background-position` (linear-gradient animation)

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 1.5s)
- Works well with stagger: multiple CTAs or key terms can shimmer in sequence to guide the audience through a list of important points

### Click Mode
- Fires on presenter click/spacebar/arrow
- In click mode, the shimmer can **repeat on each click** as a "look here now" signal
- Useful for live presentations where the presenter wants to repeatedly draw attention to a CTA or pricing element
- The shimmer fires instantly on click, making it responsive and satisfying

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'shimmer'` | — | Animation identifier |
| `duration` | `number` | `1.5` | 0.8–3.0s | Animation duration in seconds (one full sweep) |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'ease-in-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `angle` | `number` | `105` | 0–360° | Angle of the gradient streak in degrees |
| `intensity` | `number` | `0.3` | 0.1–0.8 | Opacity of the light streak overlay |

> **Note:** The element is already visible. The shimmer is an attention-drawing overlay effect, not an entrance animation. Pair it with an entrance animation (like Smooth Fade) that fires first, then trigger the shimmer for emphasis.

## Best For
- Call-to-action buttons ("Sign Up Now", "Get Started")
- Pricing elements that need to stand out ($9.99/month)
- Key terms or branded words in a text block
- Links or interactive elements the audience should notice
- Any element that needs a "call to action" visual cue

## Storytelling Value
The Shimmer is a "call to action" animation. It says "Look here, this is the important part" without moving the element from its position. It is subtle but unmissable — like a flash of light catching your eye across a room. The shimmer carries connotations of premium quality (think of light glinting off a polished surface), making it ideal for pricing, CTAs, and branded elements. When used sparingly, it creates a clear visual hierarchy that tells the audience exactly where to focus.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-shimmer` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `ShimmerDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[9]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Pulse Emphasis](./pulse-emphasis.md) — attention animation using scale instead of a gradient overlay
- [Color Shift](./color-shift.md) — activation animation transitioning from grayscale to full color
- [Pop Zoom](./pop-zoom.md) — high-energy entrance animation; use Pop Zoom first, then Shimmer for sustained attention
