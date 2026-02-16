# The Pan (Cinematic)

## Overview
Similar to a camera moving across a large canvas, all slides exist on a virtual "canvas" and the viewport pans/scrolls to show different areas. The transition feels like the audience is touring a "Map of Ideas," creating a sense of scale and interconnection.

## Visual Behavior

### Stages
1. **Slide A visible**: The viewport is positioned over Slide A's region on the virtual canvas. Only Slide A's content is in view; adjacent slides may be partially visible at the edges depending on canvas density.
2. **Transition begins**: The viewport starts panning — smoothly translating across the canvas toward Slide B's region. The movement feels like a camera dolly or drone shot.
3. **Mid-transition**: The viewport is between Slide A and Slide B. Depending on the canvas layout, intermediate content (other slides, empty space, or decorative canvas elements) may scroll through view, reinforcing the "large world" feeling.
4. **Slide B visible**: The viewport has arrived at Slide B's region on the canvas. The pan decelerates smoothly to a stop. Slide B is now fully in view.

### CSS Properties / Techniques
- All slides rendered on an oversized canvas (e.g., 3× width, 2× height depending on layout)
- `transform: translate(x, y)` — viewport movement across the canvas with smooth easing
- CSS keyframe: `vs-pan-canvas`
- `overflow: hidden` on the viewport container to clip content outside the visible area
- Optional: subtle parallax layers for depth (background moves slower than foreground)

## Trigger Modes

### Auto Mode
- Fires when Slide A's total duration expires
- Transition duration: 1.2s (default)
- Overlaps the end of Slide A and start of Slide B
- Camera pans smoothly between slide positions on the canvas following the configured `viewportPath`

### Click Mode
- Fires after all in-slide animations on Slide A are complete, on the next click
- Visual hint: cursor changes to a "grab" hand icon during the pan; a subtle directional arrow or minimap indicator shows the next slide's location
- Back navigation: ← reverses the pan — camera moves back to Slide A's position
- Skip: double-click skips the animation, shows Slide B instantly
- Advanced: in some modes, the user can drag to explore the canvas freely (like a map)

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `TransitionType` | `'pan-cinematic'` | — | Transition identifier |
| `duration` | `number` | `1.2` | 0.5–3.0s | Transition duration in seconds |
| `easing` | `EasingFunction` | `cubic-bezier(0.45, 0, 0.55, 1)` | Any valid easing | Easing curve for the camera movement |
| `canvasLayout` | `CanvasLayout` | `'grid'` | `'grid'`, `'horizontal'`, `'vertical'`, `'freeform'` | How slides are arranged on the virtual canvas |
| `viewportPath` | `{x: number, y: number}[]` | `[]` | — | Array of coordinates defining each slide's position on the canvas |

### Canvas Layout Modes
| Layout | Description |
|--------|-------------|
| `grid` | Slides arranged in a grid (e.g., 3×2). Panning moves horizontally and vertically. |
| `horizontal` | Slides in a single row. Panning is left-to-right only. |
| `vertical` | Slides in a single column. Panning is top-to-bottom only. |
| `freeform` | Slides placed at arbitrary coordinates. Panning follows the `viewportPath` array. |

## Best For
- Landscape overviews and "big picture" presentations
- Concept maps and mind maps where topics are spatially related
- Campus tours, city plans, or any geographically-oriented content
- Story maps where the narrative has a spatial component
- Presentations that want to feel like an interactive exhibit or infographic

## Storytelling Value
The Pan makes the presentation feel **larger than the screen**, as if the audience is touring a "Map of Ideas." It creates a sense of scale and interconnection that individual slides cannot achieve. When the camera pans from one region to another, the audience implicitly understands that these topics coexist in the same "world" — they are related, adjacent, part of a larger whole. This is uniquely powerful for presentations that need to convey systems, ecosystems, or any content where spatial relationships matter.

## Implementation

| Artifact | Path |
|----------|------|
| Remotion component | `src/remotion/transitions/SlideTransition.tsx` |
| Demo component | `src/components/transitions-demo/SlideTransitionSection.tsx` → `PanDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `SLIDE_TRANSITIONS[2]` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |

## Related Transitions
- [Push (Directional)](./push-directional.md) — a simpler version where only two slides are involved and movement is in one direction
- [Zoom (Focus)](./zoom-focus.md) — zooms into a specific point rather than panning across a canvas
