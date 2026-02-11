# The Push (Directional)

## Overview
Slide A is pushed off-screen as Slide B pushes in from the opposite side, with both slides visible during the transition. The result is a "conveyor belt" effect that implies forward (or backward) progress through the content.

## Visual Behavior

### Stages
1. **Slide A visible**: Slide A occupies the full viewport. Slide B is positioned just off-screen in the push direction (e.g., to the right if pushing right).
2. **Transition begins**: Both slides start moving simultaneously — Slide A translates out of view while Slide B translates into the viewport from the opposite edge.
3. **Mid-transition**: Both slides are half-visible. Slide A occupies one half of the viewport and Slide B occupies the other, creating a split-screen moment where the audience can see both slides side by side.
4. **Slide B visible**: Slide B has fully entered the viewport. Slide A is completely off-screen. The transition is complete.

### CSS Properties / Techniques
- `transform: translateX()` — horizontal push (left/right directions)
- `transform: translateY()` — vertical push (up/down directions)
- Both slides animate simultaneously with synchronized timing
- CSS keyframes: `vs-push-exit-left`, `vs-push-enter-right`, `vs-push-exit-up`, `vs-push-enter-down`
- No opacity change — both slides remain fully opaque throughout, reinforcing the "physical" feel

## Trigger Modes

### Auto Mode
- Fires when Slide A's total duration expires
- Transition duration: 0.6s (default)
- Overlaps the end of Slide A and start of Slide B
- Direction is auto-selected based on content flow: forward = right, backward = left

### Click Mode
- Fires after all in-slide animations on Slide A are complete, on the next click
- Visual hint: a small arrow at the viewport edge indicating the push direction
- → key pushes right (forward), ← key pushes left (reverse)
- Back navigation: ← reverses the push direction — Slide B pushes out, Slide A pushes back in
- Skip: double-click skips the animation, shows Slide B instantly

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `TransitionType` | `'push-directional'` | — | Transition identifier |
| `duration` | `number` | `0.6` | 0.3–1.2s | Transition duration in seconds |
| `easing` | `EasingFunction` | `cubic-bezier(0.16, 1, 0.3, 1)` | Any valid easing | Easing curve for the push motion |
| `direction` | `Direction` | `'right'` | `'right'`, `'left'`, `'down'`, `'up'` | Push direction — determines where Slide B enters from |

### Direction Semantics
| Direction | Meaning | Use Case |
|-----------|---------|----------|
| `right` | Moving forward in the timeline | Default forward navigation |
| `left` | Going back / returning | Reverse navigation, "let's go back to..." |
| `down` | Deep-diving into a subtopic | Drilling into details |
| `up` | Rising to overview | Returning to a summary or parent topic |

## Best For
- Timelines and chronological sequences
- Step-by-step flows (setup → configuration → deployment)
- Progress sequences (Q1 → Q2 → Q3 → Q4)
- Sequential content where order matters
- Onboarding and tutorial slides

## Storytelling Value
The Push implies a **timeline or progress**. Pushing "right" feels like moving forward in time; pushing "down" feels like a deep dive into detail. The simultaneous visibility of both slides during the transition creates the impression of a continuous "conveyor belt" of content — as if the slides are panels on a long scroll and the audience is simply advancing through them. This physicality makes the presentation feel grounded and tangible, unlike fades which feel more abstract.

## Implementation

| Artifact | Path |
|----------|------|
| Remotion component | `src/remotion/transitions/SlideTransition.tsx` |
| Demo component | `src/components/transitions-demo/SlideTransitionSection.tsx` → `PushDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `SLIDE_TRANSITIONS[1]` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |

## Related Transitions
- [Pan (Cinematic)](./pan-cinematic.md) — a more expansive version where the "canvas" is larger and the camera moves freely
- [Morph (Smart Move)](./morph-smart-move.md) — individual elements transition instead of entire slides
