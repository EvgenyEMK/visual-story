# Masked Reveal

## Overview
An image or content block appears from behind an invisible "curtain" using a `clip-path` animation, creating a sophisticated, cinematic unveiling effect reminiscent of high-end keynote presentations.

## Visual Behavior

### Stages
1. **Initial state**: The element is fully clipped and invisible, hidden behind a `clip-path: inset()` boundary. The exact initial clipping depends on the configured direction (e.g., `inset(0 0 0 100%)` for a left-to-right reveal).
2. **Animation**: The clip-path boundary smoothly expands, revealing the content from the configured direction. The gentle cubic-bezier easing creates a premium, decelerating motion.
3. **Final state**: The element is fully unclipped (`clip-path: inset(0 0 0 0)`) and remains visible for the rest of the slide.

### CSS Properties Animated
- `clip-path` (`inset`)

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 1.0s)
- Works well with stagger: multiple content blocks can reveal in sequence using different directions for visual variety

### Click Mode
- Fires on presenter click/spacebar/arrow
- Element is invisible until triggered
- Animation plays at configured duration; trigger timing is human-controlled
- The "curtain" effect creates a sense of anticipation in click mode — the audience knows something is about to be unveiled, making the presenter's click feel deliberate and impactful

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'masked-reveal'` | — | Animation identifier |
| `duration` | `number` | `1.0` | 0.5–2.0s | Animation duration in seconds |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'cubic-bezier(0.16, 1, 0.3, 1)'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `direction` | `RevealDirection` | `'left'` | left, right, top, bottom, center-out | Direction from which the content is revealed |

## Best For
- Product images and hero visuals deserving a premium entrance
- Large content blocks or full-bleed photography
- Apple-style keynote moments where the reveal itself is part of the story
- Video thumbnails or portfolio pieces
- Any content that should feel like it is being "unveiled" or "presented"

## Storytelling Value
The Masked Reveal creates a sophisticated, professional look used in high-end Apple-style keynotes. The "curtain" effect implies that something important is being unveiled — it elevates the content by treating the reveal itself as an event. Unlike a simple fade, the directional motion creates a sense of space and drama. The `center-out` direction is particularly powerful for hero images, as it draws the eye to the center of the content first, then expands outward to reveal the full picture.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-masked-reveal` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `MaskedRevealDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[8]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Smooth Fade](./smooth-fade.md) — simpler non-directional alternative using opacity
- [Staggered Wipe](./staggered-wipe.md) — similar clip-path technique optimized for text and bar elements
- [Float In (Gentle)](./float-in.md) — entrance animation combining opacity with subtle vertical movement
