# The "Morph" (Smart Move)

## Overview
If an element (icon, shape, image) exists on both Slide A and Slide B (matched by element ID or visual similarity), it glides smoothly to its new position, size, and style instead of disappearing and reappearing. Non-shared elements cross-fade between slides.

## Visual Behavior

### Stages
1. **Slide A visible**: All elements are in their Slide A positions, sizes, and styles. The slide is fully rendered and static.
2. **Transition begins**: Shared elements (matched by `morphId`) start interpolating toward their Slide B positions. Non-shared Slide A elements begin fading out (`opacity 1 → 0`).
3. **Mid-transition**: Shared elements are halfway between their Slide A and Slide B states — position, size, opacity, and style are all interpolated at 50%. The background cross-fades between Slide A and Slide B. Non-shared Slide B elements begin fading in.
4. **Slide B visible**: Shared elements have arrived at their Slide B positions, sizes, and styles. Non-shared Slide B elements are fully opaque. The transition is complete.

### CSS Properties / Techniques
- `transform: translate(x, y)` — interpolates position between Slide A and Slide B coordinates
- `width`, `height` — interpolates element dimensions
- `opacity` — cross-fades non-shared elements and the slide background
- `border-radius`, `background-color`, `font-size` — any differing style properties are interpolated
- Shared-element identification via `morphId` attribute on elements
- FLIP technique (First, Last, Invert, Play) for performant layout animation

## Trigger Modes

### Auto Mode
- Fires when Slide A's total duration expires
- Transition duration: 0.8s (default)
- Overlaps the end of Slide A and start of Slide B
- Shared elements interpolate simultaneously while the background cross-fades

### Click Mode
- Fires after all in-slide animations on Slide A are complete, on the next click
- Visual hint: a subtle glow on shared elements indicating they will "morph" to their new state
- Back navigation: ← reverses the transition — elements glide back to their Slide A positions
- Skip: double-click skips the animation, shows Slide B instantly

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `TransitionType` | `'morph-smart-move'` | — | Transition identifier |
| `duration` | `number` | `0.8` | 0.4–1.5s | Transition duration in seconds |
| `easing` | `EasingFunction` | `cubic-bezier(0.16, 1, 0.3, 1)` | Any valid easing | Easing curve for element interpolation |
| `morphElements` | `string[]` | `[]` | — | Array of element IDs shared between Slide A and Slide B (matched by `morphId`) |
| `fadeNonShared` | `boolean` | `true` | — | Whether non-shared elements cross-fade (if `false`, they appear/disappear instantly) |

## Best For
- Continuous narratives where elements persist across slides
- Dashboard drill-downs — a summary card morphs into a detailed view
- Before/after comparisons — the same element transforms between two states
- Product feature tours — an icon or image repositions to highlight different aspects
- Data visualizations where chart elements rearrange between views

## Storytelling Value
The Morph creates **visual continuity**, making the deck feel like one long scene rather than a series of discrete screens. When the audience sees an element persist across slides, they feel the narrative thread is unbroken — the story is evolving, not resetting. This is the most powerful transition for maintaining cognitive flow because it leverages the human visual system's ability to track moving objects, creating an implicit "this is still the same thing" connection that no other transition can match.

## Implementation

| Artifact | Path |
|----------|------|
| Remotion component | `src/remotion/transitions/SlideTransition.tsx` |
| Demo component | `src/components/transitions-demo/SlideTransitionSection.tsx` → `MorphDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `SLIDE_TRANSITIONS[0]` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |

> **Status**: Stubbed in `SlideTransition.tsx` (currently falls back to fade). Needs full shared-element interpolation using FLIP technique and `morphId` matching.

## Related Transitions
- [Zoom (Focus)](./zoom-focus.md) — zooms into a detail rather than morphing elements
- [Cross-Fade](./cross-fade.md) — a simpler opacity blend without element tracking
