# Animation Engine — Module Overview

## Purpose

The Animation Engine is the core motion design system for VisualFlow. It handles three distinct layers of visual motion:

| Layer | Scope | What it Controls |
|-------|-------|------------------|
| **Element Animations** | Single element within a slide | How one text block, icon, or shape appears or is emphasized |
| **Grouped Animations** | Multiple related items within a slide | How a set of features, steps, or concepts are revealed together |
| **Slide Transitions** | Between two slides | How the visual change from Slide N to Slide N+1 is rendered |

## Directory Structure

```
animation-engine/
├── README.md                          ← You are here
├── catalog.md                         ← Consolidated catalog of all 25 animations
├── auto-animation.md                  ← AI-powered automatic animation selection
│
├── element-animations/                ← Layer 1: Single-element (atomic)
│   ├── README.md                      ← Overview, trigger modes, shared parameters
│   ├── smooth-fade.md
│   ├── staggered-wipe.md
│   ├── float-in.md
│   ├── pulse-emphasis.md
│   ├── typewriter-reveal.md
│   ├── pop-zoom.md
│   ├── path-follow.md
│   ├── color-shift.md
│   ├── masked-reveal.md
│   ├── shimmer.md
│   ├── slide-title.md                ← NEW: Structured slide header element
│   └── zoom-in-word.md               ← NEW: Word-by-word zoom-in reveal
│
├── grouped-animations/                ← Layer 2: Grouped items within a slide
│   ├── README.md                      ← Overview, trigger modes, interaction model
│   ├── list-accumulator.md
│   ├── carousel-focus.md
│   ├── bento-grid-expansion.md
│   ├── circular-satellite.md
│   ├── infinite-path.md
│   ├── stack-reveal.md
│   ├── fan-out.md
│   ├── molecular-bond.md
│   ├── perspective-pivot.md
│   ├── magnifying-glass.md
│   └── items-grid.md                 ← NEW: Configurable row/column grid
│
└── slide-transitions/                 ← Layer 3: Between slides
    ├── README.md                      ← Overview, trigger modes, sequencing
    ├── morph-smart-move.md
    ├── push-directional.md
    ├── pan-cinematic.md
    ├── zoom-focus.md
    └── cross-fade.md
```

---

## Trigger Modes — Core Architectural Requirement

Every animation and transition in VisualFlow **must support two trigger modes**, reflecting the two primary use cases of the product:

### 1. Auto Mode (Voice-Over / Timed)

Used when the presentation plays as a **self-running video**, synchronized to a voice-over or using calculated timing delays.

| Aspect | Behavior |
|--------|----------|
| **Activation** | Animation fires at a calculated timestamp or when a voice-over sync point is reached |
| **Pacing** | Determined by `duration` + `delay` parameters, or by voice-sync timestamps from the Audio Timeline Sync module |
| **Fallback timing** | When no voice-over exists, use word-count-based timing: `baseDuration + (wordCount × msPerWord)` |
| **Element animations** | Fire sequentially with stagger delays |
| **Grouped animations** | Step through items automatically with configurable `stepDuration` (default: 1.5–2.0s per item) |
| **Slide transitions** | Fire automatically when the slide's total duration expires |

### 2. Click Mode (Live Presentation)

Used when a **human presenter** advances the deck in real time, similar to PowerPoint or Keynote.

| Aspect | Behavior |
|--------|----------|
| **Activation** | Animation fires on explicit user action (click, spacebar, arrow key, remote clicker) |
| **Pacing** | Entirely controlled by the presenter |
| **Element animations** | Each click reveals the next element (or group of elements). Elements that have already appeared remain visible. |
| **Grouped animations** | Each click advances to the next item in the group sequence |
| **Slide transitions** | Clicking past the last animation step on a slide triggers the slide transition |

### Interaction Model for Grouped Animations

Grouped animations have the richest interaction model because they manage multiple items with distinct active/inactive/not-yet-shown states.

#### Interaction Modes

Each grouped animation has an **`interactionMode`** that determines how items respond to clicks:

| Mode | Relationship | Click on Shown Item | Example Animations |
|------|-------------|--------------------|--------------------|
| **`sequential-focus`** | Peer items (no parent-child) | Changes the hero/focus to the clicked item **without hiding other already-revealed items** | List Accumulator, Carousel Focus, Bento Grid, Infinite Path, Fan-Out, Magnifying Glass |
| **`hub-spoke`** | Parent-child (hub in center, children as satellites) | Toggles a detail popup for the clicked child; does not affect other children | Circular Satellite, Molecular Bond |

Animations that don't support out-of-order navigation (Stack Reveal, Perspective Pivot) set `allowOutOfOrder: false` and ignore item-level clicks entirely.

#### Two Navigation Channels

In Click mode, navigation is split into two independent channels:

| Channel | Controls | What it Drives | State Affected |
|---------|----------|----------------|----------------|
| **Sequence flow** (keyboard) | `→` / Space, `←`, `↑`, `↓` | Progressive reveal — which items are shown/hidden | `step` (reveal progress) |
| **Review focus** (mouse click) | Click on a **previously shown** item | Which item is the hero — without changing what is revealed | `focusOverride` (hero position) |

**Key principle**: Keyboard left/right arrows drive the visual flow to progressively show or hide content. Clicking on a shown item is to come back and review it without hiding already-shown information. This is particularly important when the final state (all items shown) is reached and the presenter wants to revisit one of them.

When a review focus is active and any keyboard action is taken, the focus override is cleared and the keyboard action drives the sequence flow as usual.

#### Full Keyboard & Mouse Controls

| Interaction | Behavior | Purpose |
|-------------|----------|---------|
| **Click on active area / Space / →** | Clears any focus override; advances to the next item in the group sequence (reveals the next item) | Primary forward navigation (sequence flow) |
| **← (Back)** | Clears any focus override; goes back — hides the most recently revealed item | Backward navigation within group (sequence flow) |
| **↑ (Jump to Start)** | Clears any focus override; resets the group to its **initial state** — all items hidden, hero area empty | `toGroupAnimationStartState` — start the sequence over |
| **↓ (Jump to End)** | Clears any focus override; instantly reveals **all items** in their final state — full list visible, no hero | `toGroupAnimationEndState` — skip to completed state |
| **Hover on inactive (small) item** | Configurable hover effect (see below) | Allows presenter to preview items |
| **Click on shown (revealed) item** | Sets focus override to that item — it becomes the hero; all other revealed items remain visible in their "small" positions | Non-destructive review — presenter can spotlight any shown item without losing progress |

#### Configurable Hover Effects on Inactive Items

The default hover effect is a **subtle zoom-in** (scale 1.0 → 1.08 over 150ms), but each grouped animation type may offer additional hover options depending on how inactive items are displayed:

| Inactive Item Display | Default Hover Effect | Alternative Options |
|----------------------|---------------------|---------------------|
| **Icon only** (no text) | Zoom-in (1.08x) | Zoom + show text label (below / right / left / top) |
| **Icon + short label** | Zoom-in (1.08x) + border highlight | Zoom + show full description tooltip |
| **Thumbnail card** | Lift shadow + border glow | Expand card slightly + show preview content |
| **Dot / minimal marker** | Scale up (1.5x) + show label tooltip | Pulse + show label |
| **Grayed-out full item** | Brighten (grayscale 100% → 50%) | Brighten + subtle color tint |

The hover effect is configured via the `hoverEffect` property on `GroupedAnimationConfig`:

```typescript
interface HoverEffect {
  /** Base effect applied to all inactive items on hover. */
  type: 'zoom' | 'lift' | 'brighten' | 'pulse' | 'none';
  /** Scale factor for zoom effect. Default: 1.08 */
  scale?: number;
  /** Whether to show a text label on hover (for icon-only items). */
  showLabel?: boolean;
  /** Position of the label relative to the item. */
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
  /** Whether to show a tooltip with the item description. */
  showTooltip?: boolean;
  /** Duration of the hover transition in ms. Default: 150 */
  transitionMs?: number;
}
```

### Trigger Mode Configuration

The trigger mode is configured at three levels:

```
Project Level  →  Slide Level  →  Animation Level
(default)         (override)      (override)
```

- **Project level**: `project.triggerMode` — sets the default for the entire deck.
- **Slide level**: `slide.triggerMode` — overrides project default for a specific slide.
- **Animation level**: `animation.triggerMode` — overrides slide default for a specific animation step (rare, for advanced users).

---

## Animation Theme System

All animation UI components render inside user-created presentations that may use **light themes, dark themes, or custom brand color palettes**. The animation engine uses a universal semantic color system that adapts to any context.

### Semantic Color Roles

Every grouped animation and element animation references colors by **role**, not by specific hex values:

| Role | Purpose | Typical Visual |
|------|---------|----------------|
| `focusItem` | The currently active/hero item | Bright, saturated, with glow/shadow |
| `focusItemForeground` | Text/icon color on the focus item | High contrast against focusItem |
| `activeShownItem` | Items that have already been revealed and remain visible | Medium brightness, desaturated vs. focus |
| `activeShownItemForeground` | Text on already-shown items | Legible but not dominant |
| `inactiveUpcoming` | Items not yet revealed (visible as placeholders) | Muted, grayed, low opacity |
| `inactiveUpcomingForeground` | Text on not-yet-shown items | Very low contrast, hint-level |
| `stageBg` | Background of the animation stage area | Usually dark (slate-900) or light (white) |
| `connector` | Lines, bonds, paths connecting items | Subtle, matches theme accent |
| `hoverHighlight` | Border/glow shown on hover | Accent color at ~40% opacity |

### Default Color Palettes

Two built-in palettes are provided. Users or AI can override any or all values.

**Dark mode defaults** (used when slide background is dark):

| Role | Default Value | CSS Variable |
|------|---------------|--------------|
| `focusItem` | `hsl(214 100% 50%)` — brand blue | `--anim-focus` |
| `focusItemForeground` | `hsl(0 0% 100%)` — white | `--anim-focus-fg` |
| `activeShownItem` | `hsl(214 40% 35%)` — muted blue | `--anim-active` |
| `activeShownItemForeground` | `hsl(0 0% 80%)` — light gray | `--anim-active-fg` |
| `inactiveUpcoming` | `hsl(0 0% 20%)` — dark gray | `--anim-inactive` |
| `inactiveUpcomingForeground` | `hsl(0 0% 45%)` — medium gray | `--anim-inactive-fg` |
| `stageBg` | `hsl(222 47% 11%)` — slate-900 | `--anim-stage-bg` |
| `connector` | `hsl(214 60% 40% / 0.5)` — semi-transparent blue | `--anim-connector` |
| `hoverHighlight` | `hsl(214 100% 50% / 0.4)` — blue glow | `--anim-hover` |

**Light mode defaults** (used when slide background is light):

| Role | Default Value | CSS Variable |
|------|---------------|--------------|
| `focusItem` | `hsl(214 100% 50%)` — brand blue | `--anim-focus` |
| `focusItemForeground` | `hsl(0 0% 100%)` — white | `--anim-focus-fg` |
| `activeShownItem` | `hsl(214 30% 85%)` — light blue | `--anim-active` |
| `activeShownItemForeground` | `hsl(0 0% 15%)` — dark gray | `--anim-active-fg` |
| `inactiveUpcoming` | `hsl(0 0% 93%)` — near-white gray | `--anim-inactive` |
| `inactiveUpcomingForeground` | `hsl(0 0% 65%)` — medium gray | `--anim-inactive-fg` |
| `stageBg` | `hsl(0 0% 100%)` — white | `--anim-stage-bg` |
| `connector` | `hsl(214 40% 60% / 0.4)` — light blue | `--anim-connector` |
| `hoverHighlight` | `hsl(214 100% 50% / 0.25)` — subtle blue | `--anim-hover` |

### Color Override Mechanisms

Colors can be overridden at four levels (most general → most specific):

1. **Project theme** — user picks a brand palette in project settings; all animations inherit it.
2. **Per-slide override** — a specific slide can use a different palette (e.g., dark slide in a light deck).
3. **AI-generated** — the auto-animation engine may suggest colors based on slide content sentiment and brand analysis.
4. **Per-item accent** — each `GroupedItem` may carry an optional `color` field that acts as an **accent override** for that single item.

#### Per-Item Color Behavior

When `GroupedItem.color` is set:

| Item State | Color Used | Rationale |
|------------|-----------|-----------|
| **Active (hero)** | `item.color` directly | Item's accent is the focal point |
| **Already shown** | `color-mix(in srgb, item.color 35%, --anim-active)` | Tinted but dimmed — maintains brand identity without competing with the hero |
| **Upcoming / not yet shown** | `--anim-inactive` (theme neutral) | Upcoming items always stay muted so they don't draw premature attention |

When `GroupedItem.color` is **not** set, the item falls back to the theme CSS variables (`--anim-focus`, `--anim-active`, `--anim-inactive`).

**Example — feature list where each feature has a brand color:**

```typescript
const config: GroupedAnimationConfig = {
  type: 'list-accumulator',
  stepDuration: 2000,
  hoverEffect: { type: 'zoom', scale: 1.1, showTooltip: true },
  allowOutOfOrder: true,
  items: [
    { id: 'perf',  icon: '⚡', title: 'Performance', color: '#f59e0b', elementIds: ['e1'] },
    { id: 'sec',   icon: '🔒', title: 'Security',    color: '#10b981', elementIds: ['e2'] },
    { id: 'scale', icon: '📈', title: 'Scale',       color: '#6366f1', elementIds: ['e3'] },
    { id: 'ux',    icon: '🎨', title: 'Design',                        elementIds: ['e4'] }, // uses theme default
  ],
};
```

---

## Data Model

### Core Types

> **Implementation**: `src/types/slide.ts`, `src/types/animation.ts`, `src/types/animation-theme.ts`

```typescript
/** Trigger mode for animations and transitions. */
type TriggerMode = 'auto' | 'click';

/** Extended AnimationConfig with trigger mode. */
interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay: number;
  easing: EasingType;
  triggerMode?: TriggerMode;  // overrides slide/project default
}

/** Extended Slide with trigger mode and grouped animation config. */
interface Slide {
  // ...existing fields...
  triggerMode?: TriggerMode;
  groupedAnimation?: GroupedAnimationConfig;
}

/** Hover effect configuration for inactive items in grouped animations. */
interface HoverEffect {
  type: 'zoom' | 'lift' | 'brighten' | 'pulse' | 'none';
  scale?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
  showTooltip?: boolean;
  transitionMs?: number;
}

/** Interaction mode determines click behavior on child items. */
type GroupedInteractionMode = 'sequential-focus' | 'hub-spoke';

/** Configuration for grouped item animations. */
interface GroupedAnimationConfig {
  type: GroupedAnimationType;
  /** How items respond to clicks — see "Interaction Modes" above. */
  interactionMode: GroupedInteractionMode;
  items: GroupedItem[];
  stepDuration: number;
  hoverEffect: HoverEffect;
  allowOutOfOrder: boolean;
  triggerMode?: TriggerMode;
}

/** A single item in a grouped animation. */
interface GroupedItem {
  id: string;
  icon?: string;
  title: string;
  description?: string;
  color?: string;                 // override theme color for this item
  elementIds: string[];           // slide element IDs mapped to this group item
}

/** Semantic color palette for animations — adapts to light/dark/brand themes. */
interface AnimationThemePalette {
  focusItem: string;
  focusItemForeground: string;
  activeShownItem: string;
  activeShownItemForeground: string;
  inactiveUpcoming: string;
  inactiveUpcomingForeground: string;
  stageBg: string;
  connector: string;
  hoverHighlight: string;
}
```

---

## Implementation References

| Component | File Path | Status |
|-----------|-----------|--------|
| Animation theme types | `src/types/animation-theme.ts` | Exists |
| Animation types | `src/types/animation.ts` | Exists |
| Slide types | `src/types/slide.ts` | Exists |
| Transition catalog | `src/config/transition-catalog.ts` | Exists — 28 entries |
| Element animation demos | `src/components/transitions-demo/InSlideSection.tsx` | Exists |
| Grouped animation demos | `src/components/transitions-demo/GroupedSection.tsx` | Exists |
| Slide transition demos | `src/components/transitions-demo/SlideTransitionSection.tsx` | Exists |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` | Exists |
| Remotion transitions | `src/remotion/transitions/SlideTransition.tsx` | Exists |
| Remotion element animations | `src/remotion/elements/AnimatedElement.tsx` | Exists |
| Player store | `src/stores/player-store.ts` | Exists |
| Editor store | `src/stores/editor-store.ts` | Exists |
| Auto-animation service | `src/services/animation/auto-animation.ts` | Exists |
| Demo page | `src/app/[locale]/(app)/transitions-demo/page.tsx` | Exists |

---

## Related Modules

- [Story Editor — Element Properties](../story-editor/element-properties.md)
- [Story Editor — Timeline View](../story-editor/timeline-view.md)
- [Story Editor — Slide Canvas](../story-editor/slide-canvas.md)
- [Voice Sync — Audio Timeline Sync](../voice-sync/audio-timeline-sync.md)
- [Auto Animation](./auto-animation.md)
- [Full Catalog](./catalog.md)
