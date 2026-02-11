# The Zoom (Focus)

## Overview
The camera dives into a detail on Slide A, which expands to become Slide B. It is the visual equivalent of "Let me zoom in on that" — creating a natural visual hierarchy between overview and detail content.

## Visual Behavior

### Stages
1. **Slide A visible**: Slide A is fully rendered at normal scale (`scale: 1`). The focus point (e.g., an icon, chart element, or region) is visible among other content on the slide.
2. **Transition begins**: Slide A starts scaling up from the focus point origin. The focus point element grows as the camera "dives in." Simultaneously, Slide B begins appearing at a small scale (`scale: 0.3`), centered on the same focus point.
3. **Mid-transition**: Slide A is scaled to approximately `1.75×` and partially faded out. Slide B is scaled to approximately `0.65×` and fading in. The focus point is the visual anchor — both slides share it as their transform origin.
4. **Slide B visible**: Slide A has fully scaled up and faded out. Slide B has arrived at normal scale (`scale: 1`) and full opacity. The "dive" is complete — the audience is now looking at the detail.

### CSS Properties / Techniques
- `transform: scale()` — Slide A scales up (1 → 2.5+), Slide B scales up (0.3 → 1)
- `transform-origin` — set to the focus point coordinates so scaling radiates from that point
- `opacity` — Slide A fades out (1 → 0), Slide B fades in (0 → 1) during the scale
- CSS keyframes: `vs-zoom-dive` (Slide A exit), `vs-zoom-arrive` (Slide B enter)
- Focus point expressed as normalized 0–1 coordinates (e.g., `{x: 0.75, y: 0.3}` for upper-right area)

## Trigger Modes

### Auto Mode
- Fires when Slide A's total duration expires
- Transition duration: 0.8s (default)
- Overlaps the end of Slide A and start of Slide B
- AI determines the focus point based on the element that connects Slide A to Slide B's topic

### Click Mode
- Fires after all in-slide animations on Slide A are complete, on the next click
- Visual hint: a subtle pulsing/highlighting of the focus point element, suggesting "click here to dive in"
- Back navigation: ← zooms back out — Slide B scales down while Slide A scales back to normal, reversing the dive
- Skip: double-click skips the animation, shows Slide B instantly

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `TransitionType` | `'zoom-focus'` | — | Transition identifier |
| `duration` | `number` | `0.8` | 0.4–2.0s | Transition duration in seconds |
| `easing` | `EasingFunction` | `cubic-bezier(0.45, 0, 0.55, 1)` | Any valid easing | Easing curve for the zoom motion |
| `focusPoint` | `{x: number, y: number}` | `{x: 0.5, y: 0.5}` | 0–1 (normalized) | The point on Slide A to zoom into, as normalized coordinates |
| `zoomScale` | `number` | `2.5` | 1.5–5.0 | Maximum scale factor during the zoom dive |

## Best For
- Detail drill-downs — overview slide → specific data point
- Big-picture → detail narrative structure
- Data exploration — zooming into a chart region, map area, or diagram node
- Educational content — "now let's look more closely at this part"
- Product demos — overview of UI → zooming into a specific feature

## Storytelling Value
The Zoom is the ultimate way to show **"The Big Picture" vs. "The Details."** It creates a visual hierarchy that mirrors how experts explain things: "Here's the overview... now let me zoom in on this specific part." The physical metaphor of zooming in is universally understood — it signals increasing focus, importance, and depth. When the audience sees a zoom, they instinctively prepare for more detailed information, making the transition itself a cognitive primer for the content that follows.

## Implementation

| Artifact | Path |
|----------|------|
| Remotion component | `src/remotion/transitions/SlideTransition.tsx` |
| Demo component | `src/components/transitions-demo/SlideTransitionSection.tsx` → `ZoomDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `SLIDE_TRANSITIONS[3]` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |

## Related Transitions
- [Morph (Smart Move)](./morph-smart-move.md) — morphs individual elements rather than zooming the entire slide
- [Pan (Cinematic)](./pan-cinematic.md) — moves the camera laterally across a canvas instead of diving in
