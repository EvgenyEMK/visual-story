# Element Animations (In-Slide, Atomic Level)

## Overview

Element animations control how a **single element** — a text block, icon, shape, or image — appears, is emphasized, or exits within a slide. They are the most granular level of motion in VisualStory.

These 12 animations are the building blocks. They can be used standalone or as part of a [Grouped Animation](../grouped-animations/) sequence.

## Catalog

| # | Animation | ID | Description | Best For |
|---|-----------|-----|-------------|----------|
| 1 | [The Smooth Fade](./smooth-fade.md) | `smooth-fade` | 0 → 100% opacity | Professional content |
| 2 | [Staggered Wipe](./staggered-wipe.md) | `staggered-wipe` | Left-to-right clip reveal | Charts, data |
| 3 | [Float In](./float-in.md) | `float-in` | Upward drift + fade | Feature cards |
| 4 | [Pulse Emphasis](./pulse-emphasis.md) | `pulse-emphasis` | Scale 5–10% then return | Key metrics |
| 5 | [Typewriter Reveal](./typewriter-reveal.md) | `typewriter-reveal` | Character-by-character | Quotes |
| 6 | [Pop Zoom](./pop-zoom.md) | `pop-zoom` | Scale from 0 + bounce | Highlights |
| 7 | [Path Follow](./path-follow.md) | `path-follow` | Line draws itself | Process flows |
| 8 | [Color Shift](./color-shift.md) | `color-shift` | Gray → full color | Before/after |
| 9 | [Masked Reveal](./masked-reveal.md) | `masked-reveal` | Curtain-style reveal | Hero visuals |
| 10 | [The Shimmer](./shimmer.md) | `shimmer` | Light streak over element | CTAs |
| 11 | [Slide Title](./slide-title.md) | `slide-title` | Structured slide header with title + subtitle + status | Slide headers, section openers |
| 12 | [Zoom-In Word Reveal](./zoom-in-word.md) | `zoom-in-word` | Words zoom in one by one from behind | Section openers, dramatic statements |

## Trigger Modes

### Auto Mode
- Animation fires at `slide.startTime + element.delay`
- Duration is fixed at `element.duration`
- Multiple elements stagger by their individual `delay` values
- When voice-over exists, delays are replaced by voice-sync timestamps

### Click Mode
- Each click (or spacebar/arrow) reveals the next element in order
- Elements are ordered by their `delay` value (lowest first)
- Animation duration plays as configured; only the **trigger** changes
- Already-revealed elements remain visible
- Visual indicator: subtle "next" arrow or pulsing dot shows where the next element will appear

## Shared Parameters

All element animations share these configurable parameters:

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'smooth-fade'` | See catalog | Which animation to use |
| `duration` | `number` | `0.6` | 0.1–3.0s | How long the animation plays |
| `delay` | `number` | `0.0` | 0.0–10.0s | Delay from slide start (auto mode) or order rank (click mode) |
| `easing` | `EasingType` | `'ease-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `triggerMode` | `TriggerMode` | *inherited* | auto, click | Override slide/project default |

## Implementation References

| Artifact | Path |
|----------|------|
| Animation types | `src/types/slide.ts` → `AnimationType`, `AnimationConfig` |
| Remotion wrapper | `src/remotion/elements/AnimatedElement.tsx` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |
| Demo components | `src/components/transitions-demo/InSlideSection.tsx` |
| Catalog config | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS` |

## Related
- [Animation Engine Overview](../README.md)
- [Full Catalog](../catalog.md)
- [Grouped Animations](../grouped-animations/) — use element animations as building blocks
- [Auto Animation](../auto-animation.md) — automatic selection
