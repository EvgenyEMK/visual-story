# Slide Title

## Overview
A structured slide header element designed for the top of a slide. It consists of three parts: a **title**, an optional **subtitle**, and an optional **right section** (placeholder for status, legend, or type indicators). The element animates in with staggered entrance effects.

## Visual Behavior

### Layout

```
┌──────────────────────────────────────────────────┐
│  Title Text                          [Status] Q4 │
│  Subtitle text (optional)                        │
├──────────────────────────────────────────────────┤
│                                                  │
│              Slide content area                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Stages
1. **Initial state**: All three parts are invisible (opacity 0).
2. **Animation**: Parts animate in with staggered delays:
   - **Title** — slides down from above + fades in (0.2s delay)
   - **Subtitle** — slides down from above + fades in (0.4s delay)
   - **Right section** — slides in from the right + fades in (0.6s delay)
3. **Final state**: All parts are fully visible and remain for the rest of the slide.

### CSS Properties Animated
- `opacity` — 0 → 1 for all parts
- `transform` — `translateY(-12px) → translateY(0)` for title/subtitle, `translateX(12px) → translateX(0)` for right section

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `AnimationType` | `'slide-title'` | — | Animation identifier |
| `title` | `string` | — | — | Main title text |
| `subtitle` | `string` | `undefined` | — | Optional subtitle text |
| `rightSection` | `SlideStatusConfig` | `undefined` | — | Optional right-side content (status icon, type label, legend) |
| `duration` | `number` | `0.6` | 0.3–1.5s | Duration of each part's entrance animation |
| `delay` | `number` | `0` | 0–10s | Delay from slide start |
| `staggerDelay` | `number` | `0.2` | 0.1–0.5s | Delay between each part's entrance |

### Right Section Configuration

The right section is a placeholder designed to accommodate various content types in future implementations:

```typescript
interface SlideStatusConfig {
  /** Status indicator: colored dot + label */
  status?: { color: string; label: string };
  /** Type or category label */
  type?: string;
  /** Legend items */
  legend?: { color: string; label: string }[];
}
```

## Best For
- Slide headers that need consistent framing
- Section opener slides
- Any slide that benefits from title + subtitle + contextual metadata
- Professional presentations with standardized layouts

## Storytelling Value
The Slide Title provides visual consistency across slides. By separating title, subtitle, and status/metadata into distinct zones, it creates professional hierarchy. The staggered entrance draws the eye through the information in order: title first (primary context), subtitle (supporting detail), then status (metadata). This mirrors how audiences naturally scan content.

## Transition: Section Name → Slide Title

One key transition use case is transforming a **Zoom-In Word Reveal** (section name displayed large) into a **Slide Title** on the next slide. The section name text:
- Moves from center to the top-left title position
- Decreases font size from display size to title size
- Collapses from multi-line to single-line display
- Subtitle and right section fade in after the title settles

This creates a seamless visual bridge between a section opener and its first content slide.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` → `vs-title-enter`, `vs-subtitle-enter`, `vs-title-right-enter` |
| Demo component | `src/components/transitions-demo/InSlideSection.tsx` → `SlideTitleDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `IN_SLIDE_ANIMATIONS[10]` |

## Related Animations
- [Zoom-In Word Reveal](./zoom-in-word.md) — often used as the preceding slide's section opener that transitions into Slide Title
- [Smooth Fade](./smooth-fade.md) — simpler alternative without the structured layout
- [Float In](./float-in.md) — similar entrance motion for individual elements
