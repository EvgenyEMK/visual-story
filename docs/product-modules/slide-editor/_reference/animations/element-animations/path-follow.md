# Path Follow (Lines)

## Overview
An arrow or line "draws itself" along a defined path using SVG `stroke-dashoffset` animation, visually connecting two points on the slide as if an invisible hand is drawing the connection in real time.

## Visual Behavior

### Stages
1. **Initial state**: The SVG path element is present in the DOM but invisible — `stroke-dasharray` is set to the total path length, and `stroke-dashoffset` equals the full length, hiding the stroke entirely.
2. **Animation**: `stroke-dashoffset` animates from the full path length to `0`, progressively revealing the stroke from start to end. If an arrowhead is enabled, it appears at the leading edge of the drawn line.
3. **Final state**: The full path is visible (`stroke-dashoffset: 0`), including any arrowhead at the terminus. The line remains on screen for the rest of the slide.

### CSS Properties Animated
- SVG `stroke-dasharray`
- SVG `stroke-dashoffset`

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: configurable (default 1.2s)
- Works well with stagger: multiple path segments can draw sequentially to build up a complete process flow or diagram

### Click Mode
- Fires on presenter click/spacebar/arrow
- In click mode, each click draws the **next segment** of a multi-point path
- Single-segment paths draw completely on one click
- Multi-segment paths allow the presenter to reveal each connection step by step, syncing with their narration of each process stage
- Partially drawn paths remain visible between clicks

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'path-follow'` | — | Animation identifier |
| `duration` | `number` | `1.2` | 0.5–3.0s | Animation duration in seconds (per segment in multi-segment mode) |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'ease-in-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `path` | `string` | — | Valid SVG path data | SVG path data string (e.g., `M 50 50 L 200 200`) |
| `strokeWidth` | `number` | `2` | 1–8px | Width of the drawn stroke |
| `arrowhead` | `boolean` | `true` | true, false | Whether to render an arrowhead at the end of the path |

## Best For
- Process flows showing step-by-step progression
- Connections between two elements (Point A → Point B)
- Timelines with events linked by drawn lines
- Diagrams showing relationships, dependencies, or data flow
- Animated arrows highlighting cause-and-effect relationships

## Storytelling Value
Path Follow is essential for process flows. It visually connects Point A to Point B as the story progresses, and the audience's eye naturally follows the line, which guides their attention exactly where you want it. The "drawing" motion implies a journey — a progression from one state to another — making it ideal for narratives about growth, change, or process. When used in click mode with multi-segment paths, the presenter controls the pacing of the story, revealing each connection at the perfect moment.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-draw-line` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `PathFollowDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[6]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Staggered Wipe](./staggered-wipe.md) — another directional reveal, but for rectangular content areas
- [Smooth Fade](./smooth-fade.md) — simpler reveal for path endpoints before the line draws between them
- [Color Shift](./color-shift.md) — can be combined to "activate" nodes after the path reaches them
