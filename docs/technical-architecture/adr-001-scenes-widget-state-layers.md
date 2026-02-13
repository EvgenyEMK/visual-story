# ADR-001: Scenes + Widget State Layers Architecture

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Product Owner, AI Architecture Assistant

## Context

The existing "sub-slides" system serves double duty as both a content concept and an animation concept. A single `currentSubStep` integer simultaneously controls:

- **Element visibility** (progressive reveal)
- **Element focus** (highlighting)
- **Smart card expansion** (which card is open)
- **Layout changes** (grid-to-sidebar migration)

This creates UX confusion: when a user sees "Sub-slides 3/7" in the horizontal strip, it's unclear whether they are navigating content pages or animation timeline keyframes. The answer is "both, depending on context."

Additionally, the current `GroupedAnimationConfig` model computes sub-slides at runtime — they are not persisted entities. This makes it fragile when animation configuration changes (e.g., switching from "sequential" to "all at once" would collapse multiple sub-slides into one, losing any associated user notes).

The system needs to cleanly separate:
1. **Content structure** (what the presenter talks about)
2. **Animation behavior** (how widgets appear, interact, and transition)
3. **Widget interactions** (expand/collapse, show detail — transient visual states)

## Options Considered

### Option A: Content SubSlides + Animation States (User's Initial Proposal)

**Model:**
```
Slide (top-level)
├── SubSlide[] (content children, persisted)     ← vertical sidebar as tree
│   ├── SubSlide "Overview"
│   ├── SubSlide "Launch Details"
│   └── SubSlide "Analytics Deep Dive"
└── Each SubSlide has:
    └── AnimationState[] (computed, ephemeral)    ← horizontal timeline
```

**Vertical sidebar** shows the content tree (Slide > SubSlides as titled children).
**Horizontal slider** becomes a pure animation timeline for the currently selected sub-slide.

**Pros:**
- Clean separation of content (what) vs animation (how)
- Sub-slides as children in sidebar is intuitive for authors
- Smart card expand stays on animation timeline, not as separate content unit
- Enables deeper nesting (sub-sub-slides for complex narratives)
- Vertical sidebar becomes a proper storyboard/outline view

**Cons:**
- When animation mode changes (sequential → all-at-once), SubSlides must be deleted and recreated because content partitioning changes. User customizations (titles, notes) are lost.
- SubSlides own their widgets, making cross-SubSlide data bindings an edge case
- No natural home for widget visual states in the model
- Template changes propagate destructively

### Option C: Scenes + Widget State Layers (Recommended)

**Model:**
```
Slide (top-level)
├── Scene[] (content units, persisted, ordered)   ← vertical sidebar as children
│   ├── Scene "Overview"    → has its own widget instances + layout
│   ├── Scene "Deep Dive"   → can inherit/reference parent widgets
│   └── Scene "Summary"     → can show subset of widgets
└── Each Scene has:
    └── WidgetStateLayer (animation config, persisted)
        ├── enterBehaviors: how widgets animate in
        ├── interactionBehaviors: hover/click expand behaviors
        └── exitBehaviors: how to transition to next scene
```

**Vertical sidebar:** Shows Slide > Scene tree.
**Horizontal strip:** Shows animation steps derived from the current scene's WidgetStateLayer.

**Pros:**
- Cleanest separation: Scenes = content (what to say), WidgetStateLayer = behavior (how it moves/reacts)
- Smart card expand is an interaction behavior, not a scene change
- Changing animation mode only modifies the layer — scene count and user notes are preserved
- Slide-level widget ownership makes data bindings natural across scenes
- Widget visual states are first-class in WidgetStateLayer (extensible enum)
- Cross-slide transitions have explicit widget state boundaries
- Template inheritance works naturally (content vs behavior separation)
- Scales well for complex slides

**Cons:**
- Most complex data model (Scene, WidgetStateLayer, WidgetVisualState, cross-scene widget refs)
- New concepts for users ("Scene" alongside Slide, Section)
- Significant migration from current computed-steps model
- Widget state layers need a good UI to avoid overwhelming users

## Decision

**Option C: Scenes + Widget State Layers** was chosen.

### Justification

Option C wins on 5 of 7 evaluation criteria and ties on 2:

| Requirement | Option A | Option C |
|---|---|---|
| Sections / nesting | Equal | Equal |
| Auto-generated, template-driven | Fragile — animation changes destroy content | **Robust — changes only affect layer** |
| Animation frame granularity | Widget interactions pollute step timeline | **Clean separation: steps vs behaviors** |
| Cross-slide widget transitions | Ambiguous exit state | **Explicit widget states at boundaries** |
| Data-driven widget dependencies | Cross-SubSlide bindings awkward | **Slide-level scope, natural bindings** |
| Widget visual states (normal/expanded) | No natural home | **First-class in WidgetStateLayer** |
| Template widget instances (post-MVP) | Destructive propagation | **Content/behavior separation enables clean inheritance** |

The critical differentiator is **robustness against configuration changes**: when a user changes animation mode from "sequential" to "all at once," Option A must restructure SubSlides (losing notes), while Option C only modifies the WidgetStateLayer.

The key architectural insight: **smart widget interactions (expand/collapse/show detail) should be modeled as widget behavior configurations, not as content units**. This is the single most impactful design principle.

## Consequences

### Data Model Changes
- New `Scene` interface added to types
- New `WidgetStateLayer` with `WidgetBehavior` and `WidgetVisualState` types
- `Slide.scenes: Scene[]` replaces `Slide.groupedAnimation`
- `GroupedAnimationConfig` deprecated (migration function provided)

### Store Changes
- `player-store` tracks `currentSceneIndex` + `currentStepIndex` (two-level navigation)
- `editor-store` tracks scene selection
- `project-store` adds scene CRUD operations

### Component Changes
- `SubSlideStrip` → `AnimationStepStrip` (horizontal, shows steps within a scene)
- `SlideThumbnail` updated to show scenes as children in vertical sidebar
- `SlideEditorClient` uses scenes + steps
- `SlideMainCanvas` + `SlidePlayClient` use scene-based rendering and visibility

### Migration
- `migrateGroupedToScenes()` converts existing `GroupedAnimationConfig` to `Scene[]`
- Demo data updated to use new model
- Backward compatibility during transition
