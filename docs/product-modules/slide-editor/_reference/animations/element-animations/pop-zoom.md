# The "Pop" (Zoom)

## Overview
An icon or element scales up from 0% with a slight overshoot bounce — going from invisible to slightly oversized, then settling into its final size — creating a high-energy moment of "arrival."

## Visual Behavior

### Stages
1. **Initial state**: The element is invisible and scaled to zero (`opacity: 0; transform: scale(0)`).
2. **Animation**: The element rapidly scales up past its final size (`scale(1.18)` by default), briefly compresses below normal (`scale(0.95)`), then settles at its final size (`scale(1)`). Opacity transitions from 0 to 1 in the first 30% of the duration.
3. **Final state**: The element is fully opaque (`opacity: 1`) and at its natural size (`transform: scale(1)`) for the rest of the slide.

### CSS Properties Animated
- `opacity`
- `transform` (`scale`) with spring-like overshoot

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 0.6s)
- Works well with stagger: icons or feature badges popping in one after another creates an exciting, rapid-fire reveal

### Click Mode
- Fires on presenter click/spacebar/arrow
- Element is invisible until triggered
- Animation plays at configured duration; trigger timing is human-controlled
- The bounce overshoot makes the pop feel satisfying even at fast click speeds — it has a natural "landing" quality

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'pop-zoom'` | — | Animation identifier |
| `duration` | `number` | `0.6` | 0.3–1.0s | Animation duration in seconds |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'cubic-bezier(0.34, 1.56, 0.64, 1)'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve (default includes overshoot) |
| `overshoot` | `number` | `1.18` | 1.05–1.5 | Maximum scale factor during the bounce (1.18 = 18% overshoot) |

## Best For
- Feature highlights and badge/icon reveals
- Announcement moments ("New!", "Updated!", checkmarks)
- Icon reveals in feature grids or comparison tables
- Moments of "arrival" where something important lands on screen
- Playful, energetic presentations that need personality

## Storytelling Value
The Pop creates a moment of high energy and "arrival." The overshoot bounce gives it personality — like something dropping into place with a satisfying "thud." It communicates confidence and excitement, making it perfect for announcements and feature highlights. The spring-like motion is rooted in physics (overshoot → settle), which makes it feel natural and satisfying to the human eye. Use it sparingly for maximum impact — too many pops dilute the effect.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-pop-zoom` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `PopZoomDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[5]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Float In (Gentle)](./float-in.md) — lower-energy entrance using translation instead of scale
- [Pulse Emphasis](./pulse-emphasis.md) — post-entrance emphasis using scale on an already-visible element
- [Shimmer](./shimmer.md) — post-entrance attention effect using a gradient overlay
