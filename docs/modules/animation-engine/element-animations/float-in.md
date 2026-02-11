# Float In (Gentle)

## Overview
Elements move slightly upward while simultaneously fading in, creating an elegant, feather-light entrance that feels premium and polished.

## Visual Behavior

### Stages
1. **Initial state**: The element is fully transparent (`opacity: 0`) and offset downward by the configured distance (`transform: translateY(24px)`).
2. **Animation**: The element glides upward to its final position while fading in, driven by a gentle cubic-bezier curve that starts fast and decelerates smoothly.
3. **Final state**: The element is fully opaque (`opacity: 1`) and at its intended position (`transform: translateY(0)`) for the rest of the slide.

### CSS Properties Animated
- `opacity`
- `transform` (`translateY`)

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 0.7s)
- Works well with stagger: multiple elements can use this animation with increasing delays — perfect for a list of feature cards floating in one after another

### Click Mode
- Fires on presenter click/spacebar/arrow
- Element is invisible until triggered
- Animation plays at configured duration; trigger timing is human-controlled
- The subtle movement makes it visually forgiving if the presenter clicks quickly — the element settles naturally without feeling rushed

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'float-in'` | — | Animation identifier |
| `duration` | `number` | `0.7` | 0.3–1.5s | Animation duration in seconds |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'cubic-bezier(0.16, 1, 0.3, 1)'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `distance` | `number` | `24` | 8–80px | Distance in pixels the element travels upward during the animation |

## Best For
- Feature cards or product highlights that should feel "elevated"
- Testimonial blocks appearing one at a time
- List items building up sequentially with stagger
- Any content requiring a sense of elegance and lightness
- Pricing tiers or comparison columns entering the viewport

## Storytelling Value
The Float In adds a sense of elegance and lightness — like a leaf settling gently onto a surface. It feels more "premium" than a standard fly-in because the movement is subtle and the easing is gentle. The upward motion subconsciously suggests positivity and growth, making it an excellent choice for content that should feel aspirational or refined. When staggered across multiple elements, it creates a beautiful cascading effect that naturally guides the audience's eye down the page.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-float-in` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `FloatInDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[2]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Smooth Fade](./smooth-fade.md) — same opacity animation without the vertical movement
- [Pop Zoom](./pop-zoom.md) — higher-energy entrance using scale instead of translation
- [Masked Reveal](./masked-reveal.md) — directional reveal using clip-path for a more cinematic feel
