# Layouts and Templates

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `ToDo`
> **MVP:** Yes

## Purpose

Layouts and Templates covers how users choose and apply structural arrangements to their slides — selecting from pre-built layout templates (columns, grids, cards), setting slide backgrounds, and using alignment tools. This feature set bridges content creation and visual design, ensuring slides look professional without requiring manual positioning.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Canvas** | **Primary** | Layout rendered visually; grid/snap guides for manual alignment |
| **Side Panel** | **Primary** | Layout template picker; slide background settings |
| **Top Bar** | — | — |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| LT-F01 | [Layout Template Picker](#lt-f01-layout-template-picker) | Browse and apply layout templates to the current slide | Yes | `ToDo` |
| LT-F02 | [Slide Background](#lt-f02-slide-background) | Set slide background color, gradient, or image | Yes | `ToDo` |
| LT-F03 | [Grid and Snap Guides](#lt-f03-grid-and-snap-guides) | Alignment grid and smart snap guides for manual positioning | No | `ToDo` |
| LT-F04 | [Slide Aspect Ratio](#lt-f04-slide-aspect-ratio) | View and configure the slide aspect ratio (16:9 default) | No | `ToDo` |

---

## User Stories

### LT-F01: Layout Template Picker

#### US-LT-001: Browse Layout Templates — `ToDo`
**As a** business user,
**I want to** browse available layout templates in the side panel,
**so that** I can quickly apply professional layouts to my slides.

**Acceptance Criteria:**
- [ ] Grid of layout template thumbnails grouped by category (columns, grids, cards, etc.)
- [ ] Hovering a template shows a larger preview
- [ ] Clicking a template applies it to the current slide
- [ ] "Recently used" section at the top for quick access

#### US-LT-002: Apply Layout to Current Slide — `ToDo`
**As a** business user,
**I want to** click a layout template to apply it to the current slide,
**so that** I can restructure my content arrangement.

**Acceptance Criteria:**
- [ ] Existing content is re-mapped to the new layout where possible
- [ ] Layout change reflected immediately on canvas
- [ ] Undo available if the layout change is undesirable

#### US-LT-003: Apply Layout When Adding New Slide — `ToDo`
**As a** business user,
**I want to** choose a layout template when adding a new slide,
**so that** I start with the right structure from the beginning.

**Acceptance Criteria:**
- [ ] "Add Slide" action shows layout picker before creating the slide
- [ ] Quick-add option uses the last-used layout as default
- [ ] Blank layout always available as an option

---

### LT-F02: Slide Background

#### US-LT-004: Set Slide Background Color — `ToDo`
**As a** business user,
**I want to** set the background color of the current slide,
**so that** I can create visually distinct sections in my presentation.

**Acceptance Criteria:**
- [ ] Color picker for solid background in the side panel (Slide Properties)
- [ ] Gradient option with two-color stops
- [ ] Background change reflected immediately on canvas

#### US-LT-005: Set Slide Background Image — `ToDo`
**As a** business user,
**I want to** upload or select a background image for my slide,
**so that** I can create visually rich slides.

**Acceptance Criteria:**
- [ ] Image upload button in slide background settings
- [ ] Image auto-scales to cover the slide area
- [ ] Opacity control to overlay content readably on top of the image

---

### LT-F03: Grid and Snap Guides

#### US-LT-006: Toggle Alignment Grid — `ToDo`
**As a** business user,
**I want to** toggle a visual grid overlay on the canvas,
**so that** I can align elements precisely.

**Acceptance Criteria:**
- [ ] Toggle button shows/hides a grid overlay
- [ ] Grid uses a sensible default spacing (e.g., 8px)
- [ ] Grid is visual-only unless snapping is enabled

#### US-LT-007: Smart Snap Guides — `ToDo`
**As a** business user,
**I want** elements to snap to alignment guides when I drag them,
**so that** I can quickly achieve clean layouts.

**Acceptance Criteria:**
- [ ] Dashed guide lines appear when an element aligns with another element's edge or center
- [ ] Elements snap to nearby guides within a configurable threshold
- [ ] Hold Alt to temporarily disable snapping

---

### LT-F04: Slide Aspect Ratio

#### US-LT-008: View Slide Aspect Ratio — `ToDo`
**As a** business user,
**I want to** see the current slide aspect ratio,
**so that** I know what output format I am designing for.

**Acceptance Criteria:**
- [ ] Aspect ratio displayed in canvas toolbar (e.g., "16:9")
- [ ] Default is 16:9 for all new projects
- [ ] Changing aspect ratio is a project-level setting (not per-slide)

---

## Technical References

- [_reference/content-layouts/](../_reference/content-layouts/) — Full catalog of layout templates (columns, grids, cards, navigation)
- [_reference/visual-items/](../_reference/visual-items/) — Visual building blocks that populate layouts

## Dependencies

- Zustand `editor-store` (grid toggle, zoom level)
- Zustand `project-store` (slide background, layout data)
- Element editing (elements are positioned within layouts)
