# Animation and Timing

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `InProgress`
> **MVP:** Yes

## Purpose

Animation and Timing covers the sequencing, orchestration, and timing of all animations within a slide and between slides. While individual element animation *assignment* is part of [element-editing/](../element-editing/), this cluster handles the *sequence* — what order things appear, how long each step lasts, grouped multi-element animations, slide transitions, and previewing the full animation flow.

This is where the "story flow" of each slide is designed — the choreography of how visual elements reveal information step by step.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Bottom Panel** | **Primary** | Animation step list, reorder steps, timing sliders, phase grouping |
| **Canvas** | Secondary | Animation preview playback with progress indicator |
| **Side Panel** | Secondary | Per-element animation config (delegated from element-editing) |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| AT-F01 | [Animation Step Sequence](#at-f01-animation-step-sequence) | View and reorder the ordered list of animation steps for the current slide | Yes | `ToDo` |
| AT-F02 | [Step Timing Controls](#at-f02-step-timing-controls) | Adjust duration and delay per animation step | Yes | `ToDo` |
| AT-F03 | [Animation Phase Grouping](#at-f03-animation-phase-grouping) | Group steps that play simultaneously into phases | Yes | `ToDo` |
| AT-F04 | [Slide Transition Selection](#at-f04-slide-transition-selection) | Choose and configure the transition between slides | Yes | `ToDo` |
| AT-F05 | [Animation Preview](#at-f05-animation-preview) | Play the full animation sequence on the canvas | Yes | `ToDo` |
| AT-F06 | [Overall Slide Duration](#at-f06-overall-slide-duration) | Set total slide duration for auto-play mode | Yes | `ToDo` |
| AT-F07 | [Grouped Animations](#at-f07-grouped-animations) | Configure multi-element grouped animation patterns (list accumulator, carousel, etc.) | Yes | `ToDo` |
| AT-F08 | [Auto-Animation](#at-f08-auto-animation) | AI-powered automatic animation selection based on content | Yes | `ToDo` |
| AT-F09 | [Trigger Mode Selection](#at-f09-trigger-mode-selection) | Choose between auto (timed) and click (presenter-driven) trigger modes | No | `ToDo` |
| AT-F10 | [Editor End State Step](#at-f10-editor-end-state-step) | Artificial "End state" step in the Animation Step Strip so the canvas defaults to showing all elements | Yes | `Done` |

---

## User Stories

### AT-F01: Animation Step Sequence

#### US-AT-001: View Animation Steps for Current Slide — `ToDo`
**As a** business user,
**I want to** see all animation steps as an ordered list in the bottom panel,
**so that** I understand the sequence of visual events on this slide.

**Acceptance Criteria:**
- [ ] Each step shown as a row: step number, element name/icon, animation type, duration
- [ ] Steps ordered by their trigger sequence
- [ ] Clicking a step highlights the corresponding element on the canvas
- [ ] Current step highlighted during animation preview playback

#### US-AT-002: Reorder Animation Steps — `ToDo`
**As a** business user,
**I want to** drag animation steps to reorder them,
**so that** I can control the sequence of visual reveals.

**Acceptance Criteria:**
- [ ] Drag handle on each step row
- [ ] Drop indicator shows target position
- [ ] Order updates immediately; animation preview reflects the new order

#### US-AT-003: Add and Remove Animation Steps — `ToDo`
**As a** business user,
**I want to** add or remove animation steps,
**so that** I can customize which elements animate and in what order.

**Acceptance Criteria:**
- [ ] "Add Step" button opens a picker for element + animation type
- [ ] Delete button on each step removes it (with undo)
- [ ] Steps can be added for any element on the current slide

---

### AT-F02: Step Timing Controls

#### US-AT-004: Adjust Step Duration — `ToDo`
**As a** business user,
**I want to** adjust how long each animation step takes,
**so that** I can fine-tune the pacing of visual reveals.

**Acceptance Criteria:**
- [ ] Duration slider (0.2s – 5.0s) on each step
- [ ] Total slide duration displayed and updates as steps change
- [ ] Changes reflected in animation preview immediately

#### US-AT-005: Set Step Delay — `ToDo`
**As a** business user,
**I want to** add a delay before an animation step begins,
**so that** I can create pauses between reveals.

**Acceptance Criteria:**
- [ ] Delay input on each step (0s – 5.0s)
- [ ] Delay affects the gap between the previous step finishing and this step starting

---

### AT-F03: Animation Phase Grouping

#### US-AT-006: Group Steps into Simultaneous Phases — `ToDo`
**As a** business user,
**I want to** group animation steps that should play at the same time,
**so that** I can create coordinated multi-element reveals.

**Acceptance Criteria:**
- [ ] Steps can be grouped into a "phase" (play together)
- [ ] Phases are visually grouped in the step list
- [ ] Phases can be reordered as a unit
- [ ] In click mode, one click advances by phase, not individual step

---

### AT-F04: Slide Transition Selection

#### US-AT-007: Choose Slide Transition — `ToDo`
**As a** business user,
**I want to** choose a transition effect between slides,
**so that** slide changes feel smooth and professional.

**Acceptance Criteria:**
- [ ] Transition picker with options: fade, slide, push, zoom, morph, cross-fade
- [ ] Transition duration slider (0.3s – 2.0s)
- [ ] Preview button shows the transition between current and next slide
- [ ] Default transition configurable at the project level

---

### AT-F05: Animation Preview

#### US-AT-008: Preview Slide Animation on Canvas — `ToDo`
**As a** business user,
**I want to** play the full animation sequence on the canvas,
**so that** I can see how elements will animate in the final output.

**Acceptance Criteria:**
- [ ] Play button triggers animation preview on the canvas
- [ ] Animation plays in real-time matching configured timing
- [ ] Progress indicator shows current position
- [ ] Stop button returns canvas to the default (all elements visible) state

#### US-AT-009: Scrub Through Animation — `ToDo`
**As a** business user,
**I want to** scrub through the animation timeline,
**so that** I can jump to specific moments in the sequence.

**Acceptance Criteria:**
- [ ] Scrubber bar below the canvas during preview
- [ ] Dragging the scrubber seeks to that point in the animation
- [ ] Canvas updates in real-time as the scrubber moves

---

### AT-F06: Overall Slide Duration

#### US-AT-010: Set Total Slide Duration — `ToDo`
**As a** business user,
**I want to** set the total duration for a slide in auto-play mode,
**so that** I can control pacing when the presentation plays automatically.

**Acceptance Criteria:**
- [ ] Total duration input (seconds) in the bottom panel
- [ ] Auto-calculate option based on voice-over length + buffer
- [ ] Warning if total duration is too short for all animation steps

---

### AT-F07: Grouped Animations

#### US-AT-011: Configure Grouped Animation Pattern — `ToDo`
**As a** business user,
**I want to** select a grouped animation pattern (like list accumulator or carousel) for a set of related elements,
**so that** they animate as a coordinated unit.

**Acceptance Criteria:**
- [ ] Grouped animation picker lists available patterns
- [ ] Each pattern has a preview thumbnail
- [ ] Selected elements are mapped to the group's items
- [ ] Step-through behavior configurable (sequential-focus, hub-spoke)

> **Cross-reference:** Full catalog of grouped animation patterns in [_reference/animations/grouped-animations/](../_reference/animations/grouped-animations/).

---

### AT-F08: Auto-Animation

#### US-AT-012: Auto-Generate Animation from Content — `ToDo`
**As a** business user,
**I want** the system to automatically suggest animations based on my slide content,
**so that** I get professional animation without manual configuration.

**Acceptance Criteria:**
- [ ] "Auto-Animate" button generates animation assignments for all elements
- [ ] AI selects from the animation catalog based on content type and layout
- [ ] User can accept, modify, or reject the suggestions
- [ ] Manual overrides are preserved when re-running auto-animation

---

### AT-F09: Trigger Mode Selection

#### US-AT-013: Switch Between Auto and Click Trigger Modes — `ToDo`
**As a** business user,
**I want to** choose whether animations trigger automatically (timed) or on click (presenter-driven),
**so that** I can optimize for self-running video or live presentation scenarios.

**Acceptance Criteria:**
- [ ] Trigger mode selector: Auto, Click
- [ ] Configurable at project level (default) and overridable per slide
- [ ] Click mode groups all steps as "per-click" advances
- [ ] Auto mode uses configured durations and delays

> **Cross-reference:** Trigger mode architecture documented in [_reference/animations/](../_reference/animations/).

---

### AT-F10: Editor End State Step

#### US-AT-014: Default Canvas to End State When Selecting a Slide — `Done`
**As a** business user editing slides,
**I want** the canvas to default to showing all elements visible (the "end state") when I select a slide,
**so that** I can immediately see the full slide content without clicking through every animation step first.

**Acceptance Criteria:**
- [x] When a slide or scene has multiple animation steps, an artificial "End state" step is prepended as the first item (index 0) in the Animation Step Strip
- [x] The "End state" step is selected by default when navigating to a slide or switching scenes (`currentStepIndex` defaults to 0)
- [x] When "End state" is selected, all slide elements are visible on the canvas and none are focused
- [x] The "End state" step is visually distinct from animation steps (emerald color scheme, smaller width, "All visible" preview label)
- [x] The animation step counter in the toolbar and strip shows "End state · N steps" when the end state is active
- [x] Clicking any numbered animation step after "End state" shows the progressive reveal state for that step
- [x] The "End state" step only appears when there are 2+ animation steps (i.e., not for single-step or all-at-once scenes with 1 step)
- [x] Popup/detail expansion is inactive during end state (no card auto-expanded)
- [x] Zoom-word slides show all words visible + morphed in end state

#### US-AT-015: Navigate Between End State and Animation Steps — `Done`
**As a** business user,
**I want to** click through animation steps in the strip to preview the progressive reveal sequence,
**so that** I can verify the animation order and then return to the end state to edit with full visibility.

**Acceptance Criteria:**
- [x] Clicking a numbered step in the strip shows the canvas at that point in the animation sequence
- [x] Clicking the "End state" step returns the canvas to the all-visible default
- [x] Sequential reveal counts on step buttons are correctly offset (e.g., step 1 shows "1/5", step 2 shows "2/5")
- [x] Step numbering in the strip starts at 1 for animation steps (End state has no number)

**Implementation Notes:**

The feature introduces a sentinel value (`currentSubStep === -1`) to signal "end state" through the existing step pipeline:

| Component | Change |
|-----------|--------|
| `SlideEditorClient` | Computes `hasEndStateStep` when `baseStepCount > 1`. Prepends "End state" label, adds +1 to display `totalSteps`. Maps `currentStepIndex === 0` to `currentSubStep = -1`. Passes `baseStepCount` (real count) to canvas, `totalSteps` (with end state) to strip. |
| `AnimationStepStrip` | New `hasEndStateStep` prop. End state button has emerald styling, smaller width (100px vs 140px), "All visible" preview text. Counter adjusts for offset. |
| `SlideMainCanvas` | `getItemVisibility` and `getElementVisibility` return all-visible / none-focused when `currentSubStep === -1`. Popup expansion and zoom-word overlay also handle the sentinel. |

**Key files:**
- `apps/web/src/components/slide-editor/SlideEditorClient.tsx` — step state logic, label generation
- `apps/web/src/components/slide-editor/AnimationStepStrip.tsx` — step strip UI
- `apps/web/src/components/slide-editor/SlideMainCanvas.tsx` — canvas visibility callbacks

---

## Technical References

- [_reference/animations/](../_reference/animations/) — Full animation engine docs: element animations, grouped animations, slide transitions, trigger modes, interaction model
- [_reference/animations/catalog.md](../_reference/animations/catalog.md) — Consolidated catalog of all animations

## Dependencies

- Zustand `editor-store` (animation step state)
- Zustand `player-store` (playback state for preview)
- Element editing (animation assignment per element)
- Narration and voice (timing sync with voice-over)
