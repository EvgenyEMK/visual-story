# Zoom-In Word Reveal

## Overview
Text appears word by word, each zooming in from behind (scaling up from a small, blurred state to full size), creating a cinematic, dramatic reveal. Ideal for section opener slides where the text introduces a new topic or chapter.

## Visual Behavior

### Stages
1. **Initial state**: The text container is visible but all words are invisible. The text may be multi-line.
2. **Animation**: Each word appears sequentially with a zoom-in effect:
   - Starts at `scale(0.3)` with `blur(4px)` — appears tiny and blurred, as if "behind the camera"
   - Zooms to `scale(1.05)` — slight overshoot for impact
   - Settles at `scale(1)` with `blur(0)` — crisp, final position
   - Each word has a configurable delay between reveals (default: 180ms)
3. **Final state**: All words are visible at full size, crisp, and the text remains for the rest of the slide (or transitions to the next slide's title).

### Multi-Line Behavior
- The text content can span multiple lines
- Each line is rendered as a centered flex row of words
- Words within each line appear sequentially; lines flow naturally from line 1 to line 2, etc.
- All words share a single global index for timing purposes

### CSS Properties Animated
- `opacity` — 0 → 1
- `transform` — `scale(0.3) translateZ(-50px)` → `scale(1.05)` → `scale(1)`
- `filter` — `blur(4px)` → `blur(0)`

## Trigger Modes

### Auto Mode
- Words appear at a configurable pace (default: 180ms per word)
- Voice-sync timestamps can override timing for each word
- After all words are shown, the text remains visible for a configurable dwell time

### Click Mode
- Each click reveals the next word
- Multiple clicks in quick succession queue the reveals
- After all words are shown, the next click triggers the slide transition

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'zoom-in-word'` | — | Animation identifier |
| `text` | `string` | — | — | The text to reveal (line breaks create multi-line layout) |
| `wordDelay` | `number` | `180` | 80–400ms | Milliseconds between each word's appearance |
| `duration` | `number` | *calculated* | 1.0–10.0s | Total animation duration (overrides `wordDelay` if set) |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'cubic-bezier(0.16, 1, 0.3, 1)'` | — | Easing curve for each word's zoom |
| `fontSize` | `string` | `'text-lg'` | — | Font size class (display, lg, xl, 2xl, etc.) |

## Best For
- Section opener slides introducing a new topic or chapter
- Dramatic statements that deserve cinematic weight
- Topic titles that will transition to the next slide's header
- Inspirational quotes (alternative to Typewriter Reveal with more visual impact)
- Any text where each word carries significance

## Storytelling Value
The zoom-in effect gives each word a sense of "arrival" — as if the words are literally materializing from the depth of the screen. This creates **cinematic gravity** and forces the audience to absorb each word individually. Unlike the Typewriter Reveal (which mimics typing), the Zoom-In Word Reveal feels more like a **movie title sequence** — bold, impactful, and memorable.

## Transition: Section Title → Slide Title

A key cross-slide transition transforms the Zoom-In Word Reveal into a Slide Title element on the next slide:

### Transition Sequence
1. **Current slide**: Multi-line text is displayed at full size (e.g., "The Future of / Digital Innovation")
2. **Transition starts**: The text container smoothly:
   - Moves from center to the top-left title position
   - Decreases font size from display to title size
   - Collapses multi-line text into a single line
   - Color may shift to match the slide title style
3. **Next slide appears**: The text is now positioned as the Slide Title. Subtitle and right section of the Slide Title element fade in.

### Implementation Notes
- This transition requires the Morph (Smart Move) slide transition engine to track the text element across slides
- The element must have a matching `morphId` on both slides
- CSS custom properties `--morph-tx`, `--morph-ty`, `--morph-scale` drive the motion

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` → `vs-word-zoom-in`, `vs-section-to-title` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `ZoomInWordDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[11]` |

## Related Animations
- [Slide Title](./slide-title.md) — the target element for the section-to-title transition
- [Typewriter Reveal](./typewriter-reveal.md) — alternative text reveal with per-character pacing
- [Smooth Fade](./smooth-fade.md) — simpler alternative for text appearance
- [Pop Zoom](./pop-zoom.md) — similar zoom mechanic but for single elements rather than word-by-word
