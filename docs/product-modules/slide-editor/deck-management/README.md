# Deck Management

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `ToDo`
> **MVP:** Yes

## Purpose

Deck Management covers everything related to the overall presentation structure — creating, deleting, reordering, and navigating slides, as well as organizing them into scenes (narrative sections). These are the most frequent actions in any editing session and form the backbone of the editor experience.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Slide List** (left bar) | **Primary** | Thumbnail list, drag-to-reorder, add/delete, scene grouping |
| **Top Bar** | Secondary | Back navigation, presentation title editing |
| **Canvas** | — | Reflects the currently selected slide |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| DM-F01 | [Slide Thumbnail List](#dm-f01-slide-thumbnail-list) | Vertical list of miniature slide previews with slide numbers | Yes | `ToDo` |
| DM-F02 | [Slide Navigation](#dm-f02-slide-navigation) | Click a thumbnail to navigate; keyboard shortcuts for prev/next | Yes | `ToDo` |
| DM-F03 | [Slide Reorder](#dm-f03-slide-reorder) | Drag-and-drop to reorder slides within the presentation | Yes | `ToDo` |
| DM-F04 | [Add / Duplicate / Delete Slide](#dm-f04-add--duplicate--delete-slide) | Slide lifecycle management from the list bar | Yes | `ToDo` |
| DM-F05 | [Scene Grouping](#dm-f05-scene-grouping) | Organize slides into named, collapsible scene sections | Yes | `ToDo` |
| DM-F06 | [Presentation Title](#dm-f06-presentation-title) | Inline-editable title in the top bar | Yes | `ToDo` |
| DM-F07 | [Back Navigation](#dm-f07-back-navigation) | Return to the presentations dashboard from the editor | Yes | `ToDo` |
| DM-F08 | [Auto-Save Indicator](#dm-f08-auto-save-indicator) | Show save status — saved, saving, error | Yes | `ToDo` |
| DM-F09 | [Slide Status Indicators](#dm-f09-slide-status-indicators) | Visual badges showing completion status per slide | No | `ToDo` |
| DM-F10 | [Collapse / Resize Slide List](#dm-f10-collapse--resize-slide-list) | Collapse or resize the slide list bar | No | `ToDo` |

---

## User Stories

### DM-F01: Slide Thumbnail List

#### US-DM-001: View All Slides as Thumbnails — `ToDo`
**As a** business user,
**I want to** see all my slides as numbered thumbnails in a vertical list,
**so that** I have an overview of my entire presentation structure.

**Acceptance Criteria:**
- [ ] Each slide shown as a miniature preview with its slide number
- [ ] Thumbnails update in near-real-time when slide content changes
- [ ] List is scrollable when the deck has more slides than fit on screen
- [ ] Current slide is visually highlighted (border or background)

#### US-DM-002: See Slide Title in List — `ToDo`
**As a** business user,
**I want to** see slide titles below each thumbnail,
**so that** I can quickly identify slides by content.

**Acceptance Criteria:**
- [ ] Slide title (or first text element) displayed below thumbnail
- [ ] Title truncates gracefully for long text
- [ ] Title updates when slide content changes

---

### DM-F02: Slide Navigation

#### US-DM-003: Navigate to Slide by Click — `ToDo`
**As a** business user,
**I want to** click a slide thumbnail to navigate to it,
**so that** I can quickly jump to any slide in my presentation.

**Acceptance Criteria:**
- [ ] Clicking a thumbnail loads that slide on the canvas
- [ ] Side panel and bottom panel update to reflect the new current slide
- [ ] Keyboard shortcuts ↑/↓ cycle through the slide list

---

### DM-F03: Slide Reorder

#### US-DM-004: Drag to Reorder Slides — `ToDo`
**As a** business user,
**I want to** drag slides to new positions in the list,
**so that** I can reorganize my presentation flow.

**Acceptance Criteria:**
- [ ] Drag handle appears on hover over a thumbnail
- [ ] Visual drop indicator shows where the slide will land
- [ ] Slide order updates immediately on drop
- [ ] Undo/redo supports reorder operations

---

### DM-F04: Add / Duplicate / Delete Slide

#### US-DM-005: Add New Slide — `ToDo`
**As a** business user,
**I want to** add a new slide to my presentation,
**so that** I can extend my content.

**Acceptance Criteria:**
- [ ] "Add Slide" button at the bottom of the list or between slides
- [ ] New slide inserted after the currently selected slide
- [ ] Option to choose a layout template when adding
- [ ] Canvas navigates to the new slide automatically

#### US-DM-006: Duplicate Slide — `ToDo`
**As a** business user,
**I want to** duplicate an existing slide,
**so that** I can create variations without starting from scratch.

**Acceptance Criteria:**
- [ ] Duplicate action via context menu or hover button on thumbnail
- [ ] Duplicated slide inserted immediately after the original
- [ ] All content, animations, and properties are copied

#### US-DM-007: Delete Slide — `ToDo`
**As a** business user,
**I want to** delete a slide I no longer need,
**so that** I can keep my presentation focused.

**Acceptance Criteria:**
- [ ] Delete action via context menu or hover button on thumbnail
- [ ] Undo toast (or confirmation dialog) prevents accidental deletion
- [ ] Canvas navigates to the nearest remaining slide after deletion
- [ ] Cannot delete the last remaining slide

---

### DM-F05: Scene Grouping

#### US-DM-008: View Slides Grouped by Scene — `ToDo`
**As a** business user,
**I want to** see my slides organized into named scene groups,
**so that** I understand the narrative structure of my presentation.

**Acceptance Criteria:**
- [ ] Slides grouped under collapsible scene headers
- [ ] Scene name displayed as header text
- [ ] Collapse/expand toggle shows/hides slides within a scene
- [ ] Collapsed scene shows slide count badge

#### US-DM-009: Rename Scene — `ToDo`
**As a** business user,
**I want to** rename a scene section,
**so that** I can label my presentation sections meaningfully.

**Acceptance Criteria:**
- [ ] Double-click scene header to edit name inline
- [ ] Enter or click outside saves the new name

#### US-DM-010: Move Slide Between Scenes — `ToDo`
**As a** business user,
**I want to** drag a slide from one scene to another,
**so that** I can restructure my narrative flow.

**Acceptance Criteria:**
- [ ] Drag-and-drop works across scene boundaries
- [ ] Visual indicator shows which scene the slide will join

---

### DM-F06: Presentation Title

#### US-DM-011: Edit Presentation Title Inline — `ToDo`
**As a** business user,
**I want to** click on the presentation title in the top bar to rename it,
**so that** I can give my presentation a meaningful name.

**Acceptance Criteria:**
- [ ] Title displayed in the center of the top bar
- [ ] Click to enter edit mode (text input appears)
- [ ] Enter or click outside saves the title
- [ ] Title auto-saves and syncs to the projects library

---

### DM-F07: Back Navigation

#### US-DM-012: Return to Dashboard — `ToDo`
**As a** business user,
**I want to** click a back button to return to my projects dashboard,
**so that** I can navigate between presentations.

**Acceptance Criteria:**
- [ ] Back arrow or logo in the top-left corner
- [ ] Click navigates to the projects dashboard
- [ ] Relies on auto-save — no "unsaved changes" warning needed if auto-save is reliable

---

### DM-F08: Auto-Save Indicator

#### US-DM-013: See Save Status — `ToDo`
**As a** business user,
**I want to** see whether my work has been saved,
**so that** I know I will not lose changes.

**Acceptance Criteria:**
- [ ] Status indicator: "Saved" (checkmark), "Saving..." (spinner), "Error" (warning)
- [ ] Auto-save triggers on every change (debounced ~2 seconds)
- [ ] Timestamp: "Last saved: X seconds ago"
- [ ] Error state shows retry button

---

### DM-F09: Slide Status Indicators

#### US-DM-014: See Slide Completion Status — `ToDo`
**As a** business user,
**I want to** see visual indicators on each thumbnail showing its completion status,
**so that** I know which slides still need content, animation, or voice-over.

**Acceptance Criteria:**
- [ ] Status badges: content done, animation done, voice-over done
- [ ] Missing status shown as subtle empty indicators
- [ ] Status updates automatically as the user completes each aspect

---

### DM-F10: Collapse / Resize Slide List

#### US-DM-015: Collapse the Slide List — `ToDo`
**As a** business user,
**I want to** collapse the slide list bar to give more space to the canvas,
**so that** I can focus on editing.

**Acceptance Criteria:**
- [ ] Collapse toggle hides the bar to a thin strip with an expand button
- [ ] Drag handle allows resizing the bar width
- [ ] Preference persists across sessions

---

## Technical References

- [content-layouts/](../../slide-visuals/content-layouts/) — Layout templates used when adding new slides
- Architecture: Scenes + Widget State Layers (ADR-001) — Scene grouping model

## Dependencies

- Zustand `editor-store` (current slide index, scene structure)
- Zustand `project-store` (slide CRUD operations)
- Supabase (auto-save persistence)
