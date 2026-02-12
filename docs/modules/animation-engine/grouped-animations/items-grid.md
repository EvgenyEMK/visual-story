# Items Grid (Row / Column)

## Overview
A configurable grid of 2–8 items arranged in rows and columns, primarily used for slides that introduce the structure of a section or topic. Each item can be an icon with optional text or a short text with optional subtitle. Multiple animation modes allow gradual content introduction, and a built-in transition can transform the grid into a sidebar layout (List Accumulator style) for detailed exploration.

## Visual Behavior

### Layout

Items are arranged in a responsive grid with predefined default layouts for each count:

| Item Count | Default Layout | Description |
|-----------|---------------|-------------|
| 2 | 1 row × 2 columns | Side by side |
| 3 | 1 row × 3 columns | Three across |
| 4 | 2 rows × 2 columns | 2×2 grid |
| 5 | 2 rows (2 + 3) | First row with 2, second with 3 |
| 6 | 2 rows × 3 columns | 3×3 balanced |
| 7 | 2 rows (3 + 4) | First row with 3, second with 4 |
| 8 | 2 rows × 4 columns | 4×4 balanced |

Custom layouts can override the defaults by specifying the number of items per row.

### Item Types

Each item supports two display modes:

**(a) Icon + Text**
```
  ┌───────┐
  │  🚀   │
  │ Label  │
  │ subtitle│
  └───────┘
```

**(b) Short Text + Subtitle** (similar to Pulse Emphasis)
```
  ┌───────────┐
  │  Label    │
  │  subtitle │
  └───────────┘
```

### Animation Modes

#### 1. One-by-One (Default)
Items appear sequentially with a selectable entrance effect:
- **Fade-in** — smooth opacity transition
- **Slide from left/right** — items enter from the side
- **Pop zoom** — items scale from 0 with bounce

Each item's appearance can be voice-synced or timed by `stepDuration`.

#### 2. Opacity Highlight
All items are shown from the start at low opacity (0.3). The current "focus" item is displayed at full opacity with a subtle zoom (scale 1.06), while other items remain dimmed and slightly desaturated. Focus advances through items sequentially.

#### 3. Callout Context Box (Optional)
When an item is the active/focus item, an optional callout box appears near it with additional context (a short description). The callout fades in when the item becomes active and fades out when focus moves to the next item.

### Visual Layout Diagram

```
┌──────────────────────────────────────┐
│    🚀          📊          🔒       │
│   Launch     Analytics   Security    │
│                                      │
│    ⚡          🎯                    │
│   Speed     Targeting                │
│                                      │
│   ┌─────────────────────────┐        │
│   │ Callout: Precision...   │ ← optional
│   └─────────────────────────┘        │
└──────────────────────────────────────┘
```

## Transition: Items Grid → Sidebar Layout

A key transition transforms the Items Grid into a List Accumulator–style layout with a sidebar and main detail panel. This is used when transitioning from an overview slide (introducing topics) to a detail slide (expanding on each topic).

### Transition Sequence
1. **Grid slide** (current): All items are displayed in the grid layout with icons and short labels.
2. **Transition starts**: Each item simultaneously and gradually:
   - Moves from its grid position to its target position in the sidebar
   - Decreases in size from grid-item size to sidebar-item size
   - Items may stagger slightly (80ms between each) for visual polish
3. **Sidebar layout** (next slide): Items are now listed vertically in a 30% sidebar. The first item's detail content fades in to the main 70% panel.

### Implementation Notes
- The transition requires the Morph (Smart Move) engine to track each item across slides
- Each item must have a matching `morphId` on both the grid slide and the sidebar slide
- The sidebar slide typically uses the List Accumulator grouped animation for further item-by-item exploration
- The `showAllFromStart` option on the target List Accumulator should be enabled so all items are visible in the sidebar immediately

## Trigger Modes

### Auto Mode
- **One-by-one**: Items appear every `stepDuration` ms (default: 1400ms)
- **Opacity highlight**: Focus advances every `stepDuration` ms
- After the final item, the grid remains visible for a dwell time before the slide transition

### Click Mode
- Each click reveals the next item (one-by-one) or shifts focus (opacity highlight)
- Clicking on a shown item sets it as the focus without hiding others
- Keyboard: → / Space = next, ← = back, ↑ = reset, ↓ = show all

## Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `type` | `GroupedAnimationType` | `'items-grid'` | — | Animation type identifier |
| `items` | `GroupedItem[]` | — | 2–8 items | Ordered list of items to display |
| `layout` | `number[]` | *auto* | — | Items per row (e.g., `[2, 3]` for 5 items). Defaults to predefined layout. |
| `animMode` | `GridAnimMode` | `'one-by-one'` | `one-by-one`, `opacity-highlight` | How items are introduced |
| `entranceEffect` | `string` | `'fade-in'` | `fade-in`, `slide-left`, `slide-right`, `pop-zoom` | Entrance effect for one-by-one mode |
| `stepDuration` | `number` | `1400` | 800–3000ms | Time between steps in auto mode |
| `showCallout` | `boolean` | `true` | — | Show callout context box for active item |
| `calloutPosition` | `string` | `'bottom'` | `top`, `bottom`, `left`, `right` | Position of callout relative to item |
| `itemDisplayMode` | `string` | `'icon-text'` | `icon-text`, `text-subtitle` | How each item is rendered |
| `hoverPreview` | `boolean` | `true` | — | Show tooltip on hover in click mode |
| `allowOutOfOrder` | `boolean` | `true` | — | Allow clicking any shown item to focus it |
| `triggerMode` | `TriggerMode` | *inherited* | auto, click | Override slide/project default |

## Best For
- Section/topic overview slides introducing structure
- Feature introductions before diving into detail
- Agenda slides with visual representations
- Process overviews (2–8 steps) with icons
- Any situation where items need initial overview before detail exploration

## Storytelling Value
The Items Grid serves as the "table of contents" for a section. By showing all items in a clean, organized layout, it sets expectations and provides a mental map. The animation modes allow the presenter to either build suspense (one-by-one) or provide context (opacity highlight). The transition to a sidebar layout creates a seamless bridge from "here's what we'll cover" to "let's dive into each topic," maintaining spatial consistency as items move from overview to detail positions.

## Implementation

| Artifact | Path |
|----------|------|
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` → `vs-callout-enter`, `vs-item-highlight` |
| Demo component | `src/components/transitions-demo/GroupedSection.tsx` → `ItemsGridDemo` |
| Catalog entry | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[10]` |

## Related Animations
- [List Accumulator](./list-accumulator.md) — the typical target layout for the grid-to-sidebar transition
- [Carousel Focus](./carousel-focus.md) — alternative detail exploration with horizontal shelf
- [Bento Grid Expansion](./bento-grid-expansion.md) — similar grid but with expand-to-detail within a single slide
- [Zoom-In Word Reveal](../element-animations/zoom-in-word.md) — often precedes Items Grid as section title
