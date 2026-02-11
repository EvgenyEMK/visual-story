# Slide Transitions (Between Slides)

## Overview

Slide transitions animate the visual change from **Slide N to Slide N+1**. They connect "Key Messages" into a continuous visual thread, making the deck feel like a cohesive story rather than a series of static screens.

## Catalog

| # | Transition | ID | Description | Best For |
|---|-----------|-----|-------------|----------|
| 1 | [Morph (Smart Move)](./morph-smart-move.md) | `morph-smart-move` | Shared elements glide to new positions | Continuous narratives |
| 2 | [Push (Directional)](./push-directional.md) | `push-directional` | Slide A pushes Slide B in | Timelines, progress |
| 3 | [Pan (Cinematic)](./pan-cinematic.md) | `pan-cinematic` | Camera moves across canvas | Landscape overviews |
| 4 | [Zoom (Focus)](./zoom-focus.md) | `zoom-focus` | Camera dives into detail | Big-picture → detail |
| 5 | [Cross-Fade](./cross-fade.md) | `cross-fade` | Opacity blend between slides | Chapter changes |

## Trigger Modes

### Auto Mode (Voice-Over / Timed)

| Aspect | Behavior |
|--------|----------|
| Trigger | Fires when the current slide's total duration expires |
| Duration | Configurable per transition (0.3–2.0 seconds) |
| Voice sync | When voice-over exists, transition starts at the voice cue for the next slide's content |
| Overlap | The transition overlaps the end of Slide N and the start of Slide N+1 |

### Click Mode (Live Presentation)

| Aspect | Behavior |
|--------|----------|
| Trigger | Fires when the presenter clicks/presses after all in-slide animations are complete |
| Duration | Same as auto mode |
| Visual hint | A subtle "→" indicator appears at the bottom-right corner when the transition is ready |
| Back navigation | ← arrow reverses the last transition (plays it backwards) |
| Skip | Double-click or rapid press skips the transition animation and shows the next slide instantly |

### Sequencing with In-Slide Animations

```
Slide N                          Transition          Slide N+1
┌────────────────────────────┐  ┌──────────────┐  ┌─────────────────────────┐
│ Elem 1 → Elem 2 → Elem 3  │──│  Push / Fade  │──│ Elem 1 → Elem 2 → ...  │
│     (element animations)    │  │  (0.3–2.0s)  │  │   (element animations)  │
└────────────────────────────┘  └──────────────┘  └─────────────────────────┘

Auto mode:  Timing is continuous — transition starts after last element anim
Click mode: Each → advances: elem1, elem2, elem3, [transition], elem1, elem2...
```

## Shared Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `TransitionType` | `'cross-fade'` | See catalog | Which transition to use |
| `duration` | `number` | `0.6` | 0.3–2.0s | Transition duration |
| `easing` | `EasingFunction` | `'ease-in-out'` | linear, ease-in, ease-out, ease-in-out, spring | Easing curve |
| `direction` | `Direction` | `'right'` | left, right, up, down | For directional transitions (Push) |

## User Stories

### US-ST-001: Apply Slide Transition
**As a** content creator
**I want to** add a transition effect between slides
**So that** the presentation flows smoothly

**Acceptance Criteria:**
- [ ] Select transition from visual gallery (not just dropdown)
- [ ] Preview transition in editor with actual slide content
- [ ] Apply to single slide or all slides
- [ ] Transition duration configurable (0.3s–2s)
- [ ] Shows mini-preview animation on hover in gallery

### US-ST-002: Consistent Transition Style
**As a** content creator
**I want to** apply the same transition to all slides
**So that** my presentation has visual consistency

**Acceptance Criteria:**
- [ ] "Apply to all" button
- [ ] Option to exclude specific slides
- [ ] Bulk transition change via timeline context menu

### US-ST-003: Auto-Selected Transitions
**As a** content creator
**I want** transitions to be auto-selected based on content
**So that** I don't have to choose manually

**Acceptance Criteria:**
- [ ] AI selects transitions during generation (see [Auto Animation](../auto-animation.md))
- [ ] Transitions match content flow
- [ ] Can override auto-selection per slide

## Implementation References

| Artifact | Path |
|----------|------|
| Transition types | `src/types/animation.ts` → `TransitionType`, `TransitionConfig` |
| Remotion transition | `src/remotion/transitions/SlideTransition.tsx` |
| Presentation sequencer | `src/remotion/compositions/Presentation.tsx` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |
| Demo components | `src/components/transitions-demo/SlideTransitionSection.tsx` |
| Catalog config | `src/config/transition-catalog.ts` → `SLIDE_TRANSITIONS` |

## Related
- [Animation Engine Overview](../README.md)
- [Full Catalog](../catalog.md)
- [Element Animations](../element-animations/) — what happens inside each slide
- [Grouped Animations](../grouped-animations/) — multi-item sequences within slides
- [Timeline View](../../story-editor/timeline-view.md) — where transitions are visualized
