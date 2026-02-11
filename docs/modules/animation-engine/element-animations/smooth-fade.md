# The Smooth Fade

## Overview
Elements gradually appear from 0% to 100% opacity, creating a clean, distraction-free reveal that is universally appropriate for any content type.

## Visual Behavior

### Stages
1. **Initial state**: The element is fully transparent (`opacity: 0`) — invisible on the slide canvas.
2. **Animation**: Opacity increases smoothly from 0 to 1 over the configured duration, with an ease-out curve that decelerates toward the end.
3. **Final state**: The element is fully opaque (`opacity: 1`) and remains visible for the rest of the slide.

### CSS Properties Animated
- `opacity`

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 0.8s)
- Works well with stagger: multiple elements can use this animation with increasing delays

### Click Mode
- Fires on presenter click/spacebar/arrow
- Element is invisible until triggered
- Animation plays at configured duration; trigger timing is human-controlled
- Because the fade is subtle, it transitions smoothly even if the presenter clicks rapidly — no jarring jump

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'smooth-fade'` | — | Animation identifier |
| `duration` | `number` | `0.8` | 0.3–2.0s | Animation duration in seconds |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'ease-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |

## Best For
- Clean, professional presentations where content should not be upstaged by animation
- Any element type — text, images, icons, shapes, charts
- Voice-over synchronization: revealing a bullet point exactly when the narrator mentions it
- Building layered compositions where multiple elements fade in with staggered delays
- Default/fallback animation when no specific animation is chosen

## Storytelling Value
The Smooth Fade is the "gold standard" of element animations — the least distracting way to reveal information in sync with a voice-over. It is the animation equivalent of a calm, confident speaker who lets the content do the talking. By avoiding any spatial movement or scale change, the audience's focus lands squarely on the content itself rather than on the motion that delivered it.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-smooth-fade` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `SmoothFadeDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[0]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Float In (Gentle)](./float-in.md) — adds subtle vertical movement to the fade
- [Masked Reveal](./masked-reveal.md) — directional reveal using clip-path instead of opacity
- [Color Shift](./color-shift.md) — transitions from grayscale to full color instead of transparency
