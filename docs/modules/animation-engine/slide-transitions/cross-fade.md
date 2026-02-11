# The Cross-Fade

## Overview
A simple, elegant opacity blend between slides. Slide A fades out while Slide B simultaneously fades in, creating a smooth cross-dissolve that signals a clean break between content sections.

## Visual Behavior

### Stages
1. **Slide A visible**: Slide A is fully rendered at full opacity (`opacity: 1`). Slide B is layered behind (or on top) at zero opacity.
2. **Transition begins**: Slide A's opacity starts decreasing while Slide B's opacity starts increasing. Both slides are partially visible, creating a momentary blend of the two.
3. **Mid-transition**: Both slides are at approximately 50% opacity. The visual result is a ghostly overlay of both slides' content — a classic film dissolve effect.
4. **Slide B visible**: Slide A has fully faded out (`opacity: 0`). Slide B is at full opacity (`opacity: 1`). The transition is complete — a clean, fresh start.

### CSS Properties / Techniques
- `opacity` — Slide A animates from 1 → 0, Slide B animates from 0 → 1
- CSS keyframes: `vs-cross-fade-out` (Slide A exit), `vs-cross-fade-in` (Slide B enter)
- Both slides are stacked in the same viewport space using `position: absolute`
- No transform properties are animated — pure opacity change for maximum simplicity and performance
- `pointer-events: none` on the exiting slide to prevent interaction during transition

## Trigger Modes

### Auto Mode
- Fires when Slide A's total duration expires
- Transition duration: 0.8s (default)
- Overlaps the end of Slide A and start of Slide B
- The simplest and most reliable transition — works with any content type

### Click Mode
- Fires after all in-slide animations on Slide A are complete, on the next click
- Visual hint: subtle dimming of the current slide edges (vignette effect) indicating the transition is ready
- Back navigation: ← reverses the cross-fade — Slide B fades out while Slide A fades back in
- Skip: double-click skips the animation, shows Slide B instantly

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `TransitionType` | `'cross-fade'` | — | Transition identifier |
| `duration` | `number` | `0.8` | 0.3–2.0s | Transition duration in seconds |
| `easing` | `EasingFunction` | `'ease-in-out'` | linear, ease-in, ease-out, ease-in-out | Easing curve for the opacity blend |

## Best For
- Chapter changes — signaling a shift to an entirely new topic
- Topic resets — "we're done with X, now let's talk about Y"
- Professional and corporate presentations where subtlety is key
- Default/fallback transition when no specific transition is assigned
- Emotional "pause" moments — the dissolve creates a brief contemplative beat

## Storytelling Value
The Cross-Fade is the **"reset button"** of transitions. Use it when you are switching to a completely new chapter of the story. It signals to the audience "we're moving on to something different" — there is no directional implication (unlike Push), no spatial relationship (unlike Pan), and no element continuity (unlike Morph). Its simplicity is its greatest strength: it does not add narrative meaning, so it works everywhere without conflicting with the content. Like a film dissolve, it creates a gentle emotional pause that gives the audience a moment to process what they just saw before receiving new information.

## Implementation

| Artifact | Path |
|----------|------|
| Remotion component | `src/remotion/transitions/SlideTransition.tsx` |
| Demo component | `src/components/transitions-demo/SlideTransitionSection.tsx` → `CrossFadeDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `SLIDE_TRANSITIONS[4]` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |

## Related Transitions
- [Morph (Smart Move)](./morph-smart-move.md) — adds element-level continuity on top of the transition
- [Push (Directional)](./push-directional.md) — adds directional meaning (forward/backward) to the slide change
