# Typewriter Reveal

## Overview
Characters appear one by one as if being typed on a keyboard, accompanied by a blinking cursor that follows the text — creating anticipation and forcing the audience to read at the speaker's pace.

## Visual Behavior

### Stages
1. **Initial state**: The text container is visible but empty (or shows only the blinking cursor). No characters are rendered yet.
2. **Animation**: Characters are revealed sequentially from left to right at the configured speed. A blinking cursor (optional) follows the last revealed character, creating the illusion of live typing.
3. **Final state**: The full text is visible. The blinking cursor either disappears after a brief pause or remains blinking (configurable), and the element stays visible for the rest of the slide.

### CSS Properties Animated
- JavaScript-driven character reveal (not pure CSS animation). Each character is added to the DOM progressively.
- `animation` — used solely for the blinking cursor effect (`vs-typewriter-blink`)

## Trigger Modes

### Auto Mode
- Fires at `element.delay` seconds after slide start (or at voice-sync timestamp)
- Duration: calculated from text length (default 45ms per character), configurable via `charDelay` or explicit `duration` override
- Works well with stagger: multiple text blocks can start their typewriter effect at increasing delays to simulate a "conversation" or sequential reveals

### Click Mode
- First click **starts** the typewriter effect
- Second click **pauses** it — text typed so far stays visible, cursor blinks in place
- Third click **resumes** from where it left off
- This start/pause/resume cycle allows the presenter to pace dramatic reveals, pausing at a key word for effect before continuing
- If the typewriter has finished, additional clicks have no effect

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'typewriter-reveal'` | — | Animation identifier |
| `duration` | `number` | *calculated* | 1.0–10.0s | Total animation duration (overrides `charDelay` if set) |
| `delay` | `number` | `0` | 0–10s | Delay from slide start (auto mode) |
| `easing` | `EasingType` | `'linear'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve (affects acceleration of character speed) |
| `charDelay` | `number` | `45` | 15–120ms | Milliseconds between each character reveal |
| `cursorBlink` | `boolean` | `true` | true, false | Whether to show a blinking cursor during and after typing |

## Best For
- Inspirational quotes that should land word by word
- Problem statements that build tension ("What if your data was… wrong?")
- Punchlines or taglines where every word counts
- Dramatic reveals where pacing is essential to the narrative
- Code snippets or terminal-style content for technical audiences

## Storytelling Value
The Typewriter Reveal forces the audience to read at the pace of the speaker. It is highly engaging because it creates anticipation — each character is a tiny reveal, and the audience's brain races ahead trying to predict the next word. This makes it ideal for quotes, problem statements, and punchlines where you want the audience leaning forward. The blinking cursor adds a sense of "liveness," as if the content is being created in real time just for this audience.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframe | `src/components/transitions-demo/demo-animations.css` → `@keyframes vs-typewriter-blink` (cursor only) |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `TypewriterDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[4]` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |

## Related Animations
- [Smooth Fade](./smooth-fade.md) — simpler alternative when text pacing is not critical
- [Staggered Wipe](./staggered-wipe.md) — directional reveal for text without per-character granularity
- [Shimmer](./shimmer.md) — post-reveal attention effect to highlight the completed text
