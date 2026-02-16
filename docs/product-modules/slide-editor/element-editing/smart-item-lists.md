# Smart Item Lists

> **Parent module:** [Element Editing](./README.md) > [Slide Editor](../README.md)
> **Status:** `InProgress`
> **MVP:** Partial (Phase 1 features)

## Purpose

Smart Item Lists are configurable, interactive list widgets for business presentations. They go far beyond basic bullet points -- supporting hierarchical items with status icons, collapse/expand behavior, gradual disclosure in presentation mode, linked legends, expandable per-item detail, snapshot comparison for progress reviews, and external data source integration.

This is the most frequently used element type in business presentations (project task lists, feature lists, agendas, status updates, action items, checklists). The Smart Item Lists widget system is designed to be a key differentiator for VisualFlow, addressing pain points that no existing presentation tool solves well.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Canvas** | **Primary** | List widget rendering, inline item editing, icon quick-pick dropdown, collapse/expand interaction |
| **Side Panel** | **Primary** | List configuration (icon set, reveal mode, legend linking, snapshot management), item properties, detail content editor |
| **Bottom Panel** | Secondary | Animation steps update to reflect gradual disclosure configuration |
| **Top Bar** | Secondary | Insert Smart List from insert menu; undo/redo |

## Features

| ID | Feature | Description | Phase | Status |
|----|---------|-------------|-------|--------|
| SL-F01 | [Hierarchical Bullet List](#sl-f01-hierarchical-bullet-list) | Items with indent to sub-bullets, section headers, configurable bullet styles | 1 | `InProgress` |
| SL-F02 | [Predefined Icon Sets](#sl-f02-predefined-icon-sets) | Built-in icon vocabularies: bullets, todo/done, priority, risk/warning, custom emoji | 1 | `InProgress` |
| SL-F03 | [Dual Icon Slots](#sl-f03-dual-icon-slots) | Primary status icon + secondary flag icon per item | 2 | `InProgress` |
| SL-F04 | [Collapse / Expand Sub-Items](#sl-f04-collapse--expand-sub-items) | Configurable defaults for sub-item visibility (all-expanded, all-collapsed, first-expanded) | 1 | `InProgress` |
| SL-F05 | [Icon Quick-Pick Interaction](#sl-f05-icon-quick-pick-interaction) | Click icon to open preset dropdown; "More..." for full picker | 1 | `InProgress` |
| SL-F06 | [Gradual Disclosure in Presentation](#sl-f06-gradual-disclosure-in-presentation) | Multiple reveal modes with visual focus on current item — all 4 modes implemented | 1 (basic), 2 (full) | `InProgress` |
| SL-F07 | [Linked Legend Widget](#sl-f07-linked-legend-widget) | SmartLegend component with auto-link, visibility modes (always/edit-only/expandable) | 2 | `InProgress` |
| SL-F08 | [Expandable Detail per Item](#sl-f08-expandable-detail-per-item) | Hidden content per item revealed on click (inline mode implemented) | 2 | `InProgress` |
| SL-F09 | [Edit Mode vs. Presentation Mode](#sl-f09-edit-mode-vs-presentation-mode) | Detailed fields in editor, simplified display on slide | 3 | `Done` |
| SL-F10 | [External Data Source Linking](#sl-f10-external-data-source-linking) | Connect to Jira/Asana/Linear, select items, sync status | 4 | `ToDo` |
| SL-F11 | [Status Field Mapping](#sl-f11-status-field-mapping) | Map external statuses to presentation statuses | 4 | `ToDo` |
| SL-F12 | [Numbered / Ordered Lists](#sl-f12-numbered--ordered-lists) | Auto-numbering with custom prefixes (1., a., i., Step N) | 1 | `InProgress` |
| SL-F13 | [Auto-Progress Summary](#sl-f13-auto-progress-summary) | Segmented progress bar + text summary auto-calculated from status icons | 2 | `InProgress` |
| SL-F14 | [Conditional Formatting](#sl-f14-conditional-formatting) | Item rows auto-tinted by status accent color (3 intensities) | 2 | `InProgress` |
| SL-F15 | [Drag-to-Reorder in Edit Mode](#sl-f15-drag-to-reorder-in-edit-mode) | Reorder items by dragging; keyboard indent/outdent | 1 | `InProgress` |
| SL-F16 | [Smart Filtering / Grouping](#sl-f16-smart-filtering--grouping) | Toggle to group by status or filter visible items | 3 | `Done` |
| SL-F17 | [Assignee Indicators](#sl-f17-assignee-indicators) | Small avatar/initials chip per item | 3 | `ToDo` |
| SL-F18 | [AI Auto-Categorization](#sl-f18-ai-auto-categorization) | AI suggests status icon based on item text | 3 | `ToDo` |
| SL-F19 | [Cross-Slide Item Aggregator](#sl-f19-cross-slide-item-aggregator) | Summary widget collecting items from multiple lists across the deck | 3 | `ToDo` |
| SL-F20 | [Keyboard-First Editing](#sl-f20-keyboard-first-editing) | Enter, Tab, Shift+Tab, arrow keys, / for icon change | 1 | `InProgress` |
| SL-F21 | [Snapshot Comparison](#sl-f21-snapshot-comparison) | Timestamped snapshots with visual diff for progress reviews | 3 (manual), 4 (auto-sync) | `ToDo` |

## Implementation Phases

### Phase 1 -- MVP Core

Features: SL-F01, SL-F02, SL-F04, SL-F05, SL-F06 (basic), SL-F12, SL-F15, SL-F20

Includes the foundational architecture change: introducing `WidgetItem` as a 4th `SlideItem` variant. See [Architecture Evolution](#architecture-evolution) below.

### Phase 2 -- Interactive Features

Features: SL-F03, SL-F06 (all modes), SL-F07, SL-F08, SL-F13, SL-F14

### Phase 3 -- Advanced / Editor Intelligence

Features: SL-F09, SL-F16, SL-F17, SL-F18, SL-F19, SL-F21 (manual snapshots)

### Phase 4 -- External Integration (Post-MVP)

Features: SL-F10, SL-F11, SL-F21 (auto-snapshot on external sync)

---

## User Stories

### SL-F01: Hierarchical Bullet List

#### US-SL-001: Create a List with Nested Sub-Items -- `ToDo`
**As a** business user,
**I want to** create a bullet list with items that can be indented into sub-items,
**so that** I can organize related items under a parent heading.

**Acceptance Criteria:**
- [ ] Insert "Smart List" from the insert menu or side panel
- [ ] Each item has a text field and an icon slot on the left
- [ ] Items can be indented to create child items (up to 3 levels deep)
- [ ] Indentation is visually clear with progressive left padding
- [ ] Sub-items inherit the parent's icon set by default

#### US-SL-002: Add Section Headers to a List -- `ToDo`
**As a** business user,
**I want to** add section headers between groups of items,
**so that** I can visually separate logical groups (e.g., "Frontend", "Backend").

**Acceptance Criteria:**
- [ ] Section headers appear as bold text rows without an icon slot
- [ ] Headers can have an optional accent color bar on the left
- [ ] Items below a header are visually grouped with that header
- [ ] Headers are not counted in numbering (for numbered lists)

#### US-SL-003: Configure Bullet Style -- `ToDo`
**As a** business user,
**I want to** choose from different bullet styles (filled circle, hollow circle, dash, arrow, none),
**so that** I can match the visual style of my presentation.

**Acceptance Criteria:**
- [ ] Bullet style selector in the side panel when a smart list is selected
- [ ] At least 5 bullet styles: filled circle, hollow circle, dash, arrow, checkmark
- [ ] Bullet style can be set at the list level (applies to all items) or per item
- [ ] Sub-items can use a different bullet style than their parent

---

### SL-F02: Predefined Icon Sets

#### US-SL-004: Select an Icon Set for the List -- `ToDo`
**As a** business user,
**I want to** choose from predefined icon sets (e.g., todo/inProgress/done, priority P1-P4),
**so that** I can quickly set up a status-tracking list without configuring each icon individually.

**Acceptance Criteria:**
- [ ] Icon set selector in the side panel with visual previews
- [ ] Built-in sets include at minimum:
  - **Bullets**: filled, hollow, dash, arrow, checkmark
  - **Task status**: ToDo, In Progress, Done, Blocked
  - **Priority**: P1 (critical), P2 (high), P3 (medium), P4 (low)
  - **Risk/Warning**: OK, Warning, Issue, Risk, Critical
  - **Custom emoji**: user picks any emoji as icon
- [ ] Selecting an icon set populates the quick-pick dropdown for all items in the list
- [ ] Each icon in the set has a label, icon graphic, and default accent color

#### US-SL-005: Create Custom Icon Set -- `ToDo`
**As a** business user,
**I want to** create a custom icon set from available icons,
**so that** I can define a vocabulary specific to my project (e.g., "Designed", "Developed", "Tested", "Deployed").

**Acceptance Criteria:**
- [ ] "Custom" option in the icon set selector
- [ ] User can add 2-8 icons from the icon library or emoji picker
- [ ] Each entry has: icon, label, accent color
- [ ] Custom icon sets are saved with the presentation and can be reused across slides

---

### SL-F03: Dual Icon Slots

#### US-SL-006: Assign Two Icons per Item -- `ToDo`
**As a** business user,
**I want to** have two icon columns per item (e.g., task status + risk flag),
**so that** I can convey two dimensions of information at a glance.

**Acceptance Criteria:**
- [ ] Toggle "Dual Icons" in the list configuration panel
- [ ] When enabled, each item shows two icon slots: primary (left) and secondary (right of primary)
- [ ] Primary and secondary icon sets are configured independently
- [ ] Secondary icon is optional per item (can be left empty)
- [ ] Both icons are clickable for quick-pick changes

---

### SL-F04: Collapse / Expand Sub-Items

#### US-SL-007: Configure Default Collapse State -- `ToDo`
**As a** business user,
**I want to** set whether sub-items start expanded or collapsed,
**so that** I can control how much detail is visible by default.

**Acceptance Criteria:**
- [ ] Collapse default selector in the side panel with options:
  - `all-expanded` -- all sub-items visible
  - `all-collapsed` -- all sub-items hidden (only top-level items shown)
  - `first-expanded` -- first group expanded, rest collapsed
  - `top-level-only` -- only top-level items shown, all children collapsed
- [ ] Collapse/expand toggle (chevron icon) appears next to items that have children
- [ ] Clicking the toggle expands/collapses that item's children with a smooth animation
- [ ] Collapse state persists per item during the editing session

#### US-SL-008: Expand/Collapse in Presentation Mode -- `ToDo`
**As a** business user,
**I want to** expand and collapse sub-items during a live presentation,
**so that** I can drill into details on demand without showing everything upfront.

**Acceptance Criteria:**
- [ ] Collapse/expand toggles are interactive in presentation mode (click trigger)
- [ ] Expand animation: children slide down with staggered fade-in
- [ ] Collapse animation: children slide up with fade-out
- [ ] When an item is expanded, the list auto-scrolls to keep the expanded content visible

---

### SL-F05: Icon Quick-Pick Interaction

#### US-SL-009: Change Icon via Quick-Pick Dropdown -- `ToDo`
**As a** business user,
**I want to** click an item's icon to see a small dropdown with preset icon choices,
**so that** I can quickly change an item's status without navigating away.

**Acceptance Criteria:**
- [ ] Clicking an icon opens a compact popover positioned adjacent to the icon
- [ ] Popover shows all icons from the active icon set (e.g., 4 status icons)
- [ ] Clicking an icon in the popover immediately updates the item
- [ ] Popover includes a "More..." button that opens the full icon picker in the side panel
- [ ] Popover dismisses on click outside or Escape key
- [ ] In presentation mode, the quick-pick is available only if the list is configured as interactive

#### US-SL-010: Quick-Pick Constrained by Legend -- `ToDo`
**As a** business user,
**I want** the quick-pick to show icons from the linked legend by default,
**so that** I maintain consistent icon vocabulary across the slide.

**Acceptance Criteria:**
- [ ] When a StatusLegend is linked (SL-F07), quick-pick shows legend icons first
- [ ] Two modes (configurable on the legend link):
  - **Strict**: only legend icons are available in quick-pick
  - **Default with override**: legend icons shown first, "More..." allows any icon (default mode)
- [ ] Mode is set via the legend link configuration in the side panel

---

### SL-F06: Gradual Disclosure in Presentation

#### US-SL-011: One-by-One Reveal with Focus -- `ToDo`
**As a** business user,
**I want** list items to appear one at a time with the current item highlighted,
**so that** my audience focuses on one point at a time.

**Acceptance Criteria:**
- [ ] Reveal mode "one-by-one-focus" in the list configuration
- [ ] Items not yet revealed are hidden (opacity 0)
- [ ] The current item is displayed at full opacity with a subtle highlight (glow or accent border)
- [ ] Previously revealed items are dimmed (opacity 40-60%)
- [ ] Keyboard: Right arrow or Space advances to next item; Left arrow goes back
- [ ] In auto-play mode, items advance on a configurable timer (default 2s per item)
- [ ] Voice-over timestamps can drive advancement when available

#### US-SL-012: Progressive Accumulation Reveal -- `ToDo`
**As a** business user,
**I want** items to appear one by one but all previously shown items remain fully visible,
**so that** my audience can see the growing list as context.

**Acceptance Criteria:**
- [ ] Reveal mode "one-by-one-accumulate" in the list configuration
- [ ] Each newly revealed item enters with the configured entrance animation (fade, float-in, etc.)
- [ ] The current item has a subtle focus indicator (accent border or background)
- [ ] All previously revealed items remain at full opacity
- [ ] Items not yet revealed are hidden

#### US-SL-013: Section-by-Section Reveal -- `ToDo`
**As a** business user,
**I want** items to be revealed one section at a time (grouped by section headers),
**so that** I can present topic-by-topic rather than item-by-item.

**Acceptance Criteria:**
- [ ] Reveal mode "by-section" in the list configuration
- [ ] A section header and all its child items appear together as one step
- [ ] Items within a section enter with staggered animation
- [ ] Previously revealed sections remain visible; current section is highlighted

#### US-SL-014: All-at-Once Staggered Reveal -- `ToDo`
**As a** business user,
**I want** all items to appear simultaneously with a staggered animation,
**so that** the list builds visually without requiring multiple clicks.

**Acceptance Criteria:**
- [ ] Reveal mode "all-at-once" in the list configuration
- [ ] All items animate in with configurable stagger delay (default 80ms between items)
- [ ] This produces a single animation step (not sequential)
- [ ] Sub-items animate after their parent item

---

### SL-F07: Linked Legend Widget

#### US-SL-015: Auto-Link Legend to List -- `ToDo`
**As a** business user,
**I want** a StatusLegend widget to automatically link to a SmartItemsList when both are on the same slide,
**so that** the legend explains the icons used in the list without manual configuration.

**Acceptance Criteria:**
- [ ] When a StatusLegend and SmartItemsList are on the same slide, they auto-link
- [ ] The legend automatically displays the icons from the list's active icon set
- [ ] If the list's icon set changes, the legend updates accordingly
- [ ] Auto-link can be manually overridden (unlink or link to a different list)
- [ ] Link is visible in the side panel as a "Linked to: [list name]" indicator

#### US-SL-016: Legend Visibility Modes -- `ToDo`
**As a** business user,
**I want** to control when the legend is visible (always, edit-only, expandable-on-click),
**so that** the legend doesn't take up slide space when it's not needed.

**Acceptance Criteria:**
- [ ] Visibility mode selector on the legend widget:
  - **Always visible**: shown in both edit and presentation mode
  - **Edit-only**: visible in editor, hidden during presentation
  - **Expandable**: collapsed to a small icon in presentation mode, expands on click
- [ ] In "expandable" mode, clicking the legend icon shows a floating popover with the full legend
- [ ] In "edit-only" mode, the legend has a dashed border in the editor to indicate it won't be shown

#### US-SL-017: Legend Constrains Quick-Pick -- `ToDo`
**As a** business user,
**I want** the linked legend to define which icons appear in the quick-pick dropdown,
**so that** my team uses a consistent visual vocabulary.

**Acceptance Criteria:**
- [ ] Two constraint modes on the legend link:
  - **Strict**: quick-pick only shows legend icons (no "More..." option)
  - **Default with override**: legend icons shown first, "More..." available for full picker
- [ ] Default mode is "Default with override"
- [ ] Mode is configurable in the side panel legend link settings

---

### SL-F08: Expandable Detail per Item

#### US-SL-018: Inline Expandable Detail -- `ToDo`
**As a** business user,
**I want to** add hidden detail content to a list item that expands below the item when clicked,
**so that** I can provide supplementary information without cluttering the default view.

**Acceptance Criteria:**
- [ ] Detail mode "inline" in the list configuration
- [ ] Each item can have optional detail content (formatted text)
- [ ] In edit mode, a "Add detail" button appears on hover for items without detail
- [ ] Detail content is edited in the side panel with rich text controls
- [ ] In presentation mode, clicking the item (or a detail icon) expands the detail below with slide-down animation
- [ ] Clicking again collapses it; optionally only one item's detail is expanded at a time (exclusive mode)
- [ ] Detail is NOT shown during auto-play unless explicitly triggered by user click

#### US-SL-019: Callout Card Detail -- `ToDo`
**As a** business user,
**I want** clicking a list item to show a detail card positioned to the side of the list,
**so that** I can show rich supplementary content (sub-items, images, metrics) without disrupting the list layout.

**Acceptance Criteria:**
- [ ] Detail mode "callout" in the list configuration
- [ ] Detail content is a full SlideItem tree (can contain text, icons, images, even nested lists)
- [ ] When triggered, a card appears adjacent to the selected item (right side if list is left-aligned, left side otherwise)
- [ ] The card has a subtle connector line or arrow pointing to the source item
- [ ] Only one callout is visible at a time (selecting another item moves the callout)
- [ ] Card animates in with scale + fade; animates out when dismissed
- [ ] In auto-play, callouts are not triggered unless the user explicitly clicks

---

### SL-F09: Edit Mode vs. Presentation Mode

#### US-SL-020: Show/Hide Items per Mode -- `ToDo`
**As a** business user,
**I want** to maintain a detailed item list in the editor but show only selected items on the slide,
**so that** I can keep full context while presenting a simplified view.

**Acceptance Criteria:**
- [ ] Each item has a "visible in presentation" toggle (eye icon)
- [ ] Hidden items appear dimmed with a strikethrough in the editor
- [ ] Hidden items are not rendered on the canvas in presentation mode
- [ ] Bulk actions: "Show all", "Hide all", "Show only [status]" in the side panel
- [ ] Item count indicator: "Showing 5 of 12 items"

---

### SL-F10: External Data Source Linking

#### US-SL-021: Connect List to Jira Project -- `ToDo`
**As a** business user,
**I want to** connect my smart list to a Jira project and import issues,
**so that** my presentation stays synchronized with real project data.

**Acceptance Criteria:**
- [ ] "Connect data source" button in the side panel for smart list widgets
- [ ] OAuth flow to authenticate with Jira (also Asana, Linear, Notion)
- [ ] Project/board selector after authentication
- [ ] Filter selector (JQL for Jira, filter views for Asana/Linear)
- [ ] Selected issues populate the smart list as items
- [ ] Each imported item shows an external link icon (clickable to open in source)
- [ ] Manual "Sync now" button to pull latest status
- [ ] User can manually add/remove items alongside imported ones

---

### SL-F11: Status Field Mapping

#### US-SL-022: Map External Statuses to Presentation Statuses -- `ToDo`
**As a** business user,
**I want to** map Jira statuses (e.g., "coding", "code-review", "QA") to simplified presentation statuses ("In Progress"),
**so that** my audience sees a clear, high-level view rather than internal workflow details.

**Acceptance Criteria:**
- [ ] Status mapping editor appears after connecting a data source
- [ ] Left column: all unique statuses from the external source
- [ ] Right column: dropdown to map each to a presentation icon/status
- [ ] Multiple external statuses can map to the same presentation status
- [ ] Mapping is saved with the list widget and applied on each sync
- [ ] Unmapped statuses default to a configurable "Other" icon

---

### SL-F12: Numbered / Ordered Lists

#### US-SL-023: Auto-Number List Items -- `ToDo`
**As a** business user,
**I want to** display numbered items with automatic numbering,
**so that** I can show ordered steps, agendas, or ranked items.

**Acceptance Criteria:**
- [ ] "Show numbering" toggle in the list configuration
- [ ] Numbering formats: `1.`, `a.`, `i.`, `Step 1`, `01.`
- [ ] Numbers appear to the left of the icon (or replace the icon if no icon set is selected)
- [ ] Numbering restarts at each section header
- [ ] Sub-items use nested numbering (e.g., 1.1, 1.2) or independent numbering (configurable)
- [ ] Hidden items (SL-F09) are excluded from numbering

---

### SL-F13: Auto-Progress Summary

#### US-SL-024: Display Calculated Progress Bar -- `ToDo`
**As a** business user,
**I want** a progress summary bar above or below the list that auto-calculates from item statuses,
**so that** my audience immediately sees the overall completion level.

**Acceptance Criteria:**
- [ ] "Show progress summary" toggle in the list configuration
- [ ] Summary bar shows: segmented bar (colored by status) + text (e.g., "5/12 done, 3 in progress, 4 blocked")
- [ ] Colors match the icon set's accent colors for each status
- [ ] Summary updates automatically when item statuses change
- [ ] Position: above list, below list, or floating (configurable)
- [ ] In presentation mode, the bar animates to reflect changes during gradual disclosure

---

### SL-F14: Conditional Formatting

#### US-SL-025: Auto-Color Items by Status -- `ToDo`
**As a** business user,
**I want** item rows to automatically tint their background based on status (e.g., green for done, red for blocked),
**so that** status is immediately visible without reading the icon.

**Acceptance Criteria:**
- [ ] "Conditional formatting" toggle in the list configuration
- [ ] When enabled, each item row gets a subtle background tint matching its status icon's accent color
- [ ] Tint intensity is configurable (subtle 5%, medium 10%, strong 15%)
- [ ] Works with both single and dual icon slots (based on primary icon)
- [ ] Section headers are not tinted
- [ ] Can be combined with accent bars for additional visual emphasis

---

### SL-F15: Drag-to-Reorder in Edit Mode

#### US-SL-026: Reorder Items by Dragging -- `ToDo`
**As a** business user,
**I want to** drag items to reorder them within the list,
**so that** I can arrange items in the order I want to present them.

**Acceptance Criteria:**
- [ ] Drag handle appears on the left side of each item on hover
- [ ] Dragging an item shows a ghost preview and a drop indicator line
- [ ] Items can be dropped between other items, under a section header, or at the top/bottom
- [ ] Dragging a parent item moves all its children together
- [ ] Drop into a different indent level changes the item's parent
- [ ] Undo/redo works with drag operations

---

### SL-F16: Smart Filtering / Grouping

#### US-SL-027: Filter and Group Items by Status -- `ToDo`
**As a** business user,
**I want to** filter the list to show only items with a specific status, or group items by status,
**so that** I can create focused views for different audiences (e.g., "show only blocked items" for a risk review).

**Acceptance Criteria:**
- [ ] "Filter" dropdown in the side panel showing all statuses from the icon set
- [ ] Multi-select: user checks which statuses to show
- [ ] "Group by status" toggle: reorganizes the list into sections by status
- [ ] Filter is a presentation-mode setting (different from edit-mode show/hide in SL-F09)
- [ ] Filter indicator shows on the list widget when a filter is active

---

### SL-F17: Assignee Indicators

#### US-SL-028: Show Assignee per Item -- `ToDo`
**As a** business user,
**I want** to display a small avatar or initials chip next to each item,
**so that** ownership is clear in project status presentations.

**Acceptance Criteria:**
- [ ] "Show assignees" toggle in the list configuration
- [ ] Each item has an optional assignee field (name + optional avatar URL)
- [ ] Assignee displays as a small circular avatar or initials chip to the right of the text
- [ ] Multiple assignees per item show stacked (max 3 visible, +N overflow)
- [ ] When linked to an external source (SL-F10), assignees sync automatically

---

### SL-F18: AI Auto-Categorization

#### US-SL-029: AI Suggests Status Icons -- `ToDo`
**As a** business user,
**I want** the AI to suggest appropriate status icons based on item text,
**so that** I can quickly categorize items without manual icon selection.

**Acceptance Criteria:**
- [ ] "Auto-categorize" button in the side panel for smart list widgets
- [ ] AI analyzes each item's text and suggests an icon from the active icon set
- [ ] Suggestions appear as ghost icons (dimmed) that the user can accept or reject
- [ ] Accept-all and reject-all bulk actions
- [ ] Works with any icon set (AI maps text semantics to icon labels)

---

### SL-F19: Cross-Slide Item Aggregator

#### US-SL-030: Summary List Across Multiple Slides -- `ToDo`
**As a** business user,
**I want** a summary slide that aggregates items from smart lists on other slides,
**so that** I can create an "All Action Items" or "All Risks" summary view.

**Acceptance Criteria:**
- [ ] "Aggregator" variant of SmartItemsList widget
- [ ] Configuration: select which slides/lists to aggregate from
- [ ] Optional filter: aggregate only items with specific statuses
- [ ] Aggregated items show their source slide name as a label
- [ ] Changes to source items are reflected in the aggregator in real-time
- [ ] Aggregator is read-only (editing happens on the source slide)

---

### SL-F20: Keyboard-First Editing

#### US-SL-031: Keyboard Shortcuts for List Editing -- `ToDo`
**As a** business user,
**I want** efficient keyboard shortcuts for editing list items,
**so that** I can build and modify lists quickly without using the mouse.

**Acceptance Criteria:**
- [ ] **Enter**: create a new item below the current item
- [ ] **Tab**: indent the current item (make it a child of the item above)
- [ ] **Shift+Tab**: outdent the current item (move it up one level)
- [ ] **Up/Down arrows**: move focus between items
- [ ] **/** (slash): open the icon quick-pick dropdown for the current item
- [ ] **Backspace** on empty item: delete the item and move focus to the item above
- [ ] **Ctrl/Cmd+Shift+Up/Down**: move the current item up/down in the list
- [ ] **Escape**: exit list editing, deselect the list widget

---

### SL-F21: Snapshot Comparison

#### US-SL-032: Capture List Snapshot -- `ToDo`
**As a** business user,
**I want to** save the current state of a list as a named snapshot (e.g., "Week 5", "Sprint 12 end"),
**so that** I can later compare it with a future state to show progress.

**Acceptance Criteria:**
- [ ] "Save snapshot" button in the side panel for smart list widgets
- [ ] Dialog to enter a snapshot label (auto-suggested: current date, sprint name if linked)
- [ ] Snapshot captures: item IDs, text, primary icon, secondary icon
- [ ] Snapshots are stored as part of the widget data (persisted with the presentation)
- [ ] Snapshot list viewable in the side panel with labels and timestamps
- [ ] Snapshots can be renamed or deleted

#### US-SL-033: Compare Two Snapshots -- `ToDo`
**As a** business user,
**I want to** select two snapshots and see a visual diff showing what changed,
**so that** I can present progress in weekly/monthly review meetings.

**Acceptance Criteria:**
- [ ] "Compare" button in the snapshot list; select "before" and "after" snapshots
- [ ] Diff view shows change indicators per item:
  - **New**: green "NEW" badge -- item exists in "after" but not "before"
  - **Removed**: struck-through / dimmed with "REMOVED" badge -- item in "before" but not "after"
  - **Status changed**: directional arrow icon (e.g., "ToDo -> Done") with color coding
    - Improvement (forward progress): green arrow
    - Regression (backward progress): red arrow
  - **Unchanged**: neutral display, no extra indicator
- [ ] Summary delta bar: "3 completed, 2 new, 1 regressed, 4 unchanged"
- [ ] Diff indicators can be toggled on/off for presentation

#### US-SL-034: Animated Snapshot Transition in Presentation -- `ToDo`
**As a** business user,
**I want** the presentation to animate from the "before" snapshot to the "after" state,
**so that** my audience sees the progress visually unfold.

**Acceptance Criteria:**
- [ ] When snapshot comparison is active, the list initially shows the "before" state
- [ ] Advancing to the next step triggers the transition animation:
  - Status icons morph/cross-fade to their new state
  - New items fade in and slide into position
  - Removed items fade out and collapse
  - The summary delta bar counts up
- [ ] Transition duration is configurable (default 1.5s)
- [ ] After transition, diff indicators (badges, arrows) appear with a staggered entrance

#### US-SL-035: Auto-Snapshot on External Sync -- `ToDo`
**As a** business user,
**I want** snapshots to be captured automatically each time the list syncs with an external data source,
**so that** I have a history of changes without manually saving.

**Acceptance Criteria:**
- [ ] When external data source is connected (SL-F10), each sync creates an auto-snapshot
- [ ] Auto-snapshots are labeled with the sync timestamp and source (e.g., "Jira sync - Feb 16, 2026")
- [ ] Auto-snapshots are marked as "auto" and can be distinguished from manual snapshots
- [ ] Auto-snapshot creation can be disabled in the external source settings
- [ ] Old auto-snapshots can be auto-pruned (configurable: keep last N, default 10)

---

## Architecture Evolution

### WidgetItem -- New SlideItem Variant

Smart Item Lists require introducing `WidgetItem` as a 4th variant of the `SlideItem` discriminated union. This is necessary because:

1. Smart lists have complex internal configuration (icon sets, reveal modes, collapse defaults) that doesn't fit `AtomItem`, `CardItem`, or `LayoutItem`
2. The list's internal items need IDs that the Scene/WidgetStateLayer system can reference for gradual disclosure
3. Cross-widget linking (legend <-> list) needs to be persisted in the data model
4. Snapshot data and external source config require serializable widget-specific storage

See [visual-items/README.md](../../slide-visuals/visual-items/README.md) for how Smart Widgets fit in the component hierarchy.

### Key Type Definitions

```typescript
interface WidgetItem extends SlideItemBase {
  type: 'widget';
  widgetType: 'smart-list' | 'smart-legend';
  config: SmartListConfig | SmartLegendConfig;
  data: SmartListData | SmartLegendData;
  linkedWidgetIds?: string[];
}
```

For full type definitions, see the implementation plan.

## Technical References

- [visual-items/](../../slide-visuals/visual-items/) -- Visual building blocks and Smart Widgets tier
- [visual-items/molecules/items-list.md](../../slide-visuals/visual-items/molecules/items-list.md) -- Existing ItemsList molecule (base for Phase 1)
- [visual-items/molecules/status-legend.md](../../slide-visuals/visual-items/molecules/status-legend.md) -- Existing StatusLegend molecule
- [animations/grouped-animations/list-accumulator.md](../_reference/animations/grouped-animations/list-accumulator.md) -- List Accumulator animation pattern
- ADR-001: Scenes + Widget State Layers -- how interaction behaviors are modeled

## Dependencies

- Zustand `editor-store` (selected element, list editing state)
- Zustand `project-store` (widget CRUD, item mutations, snapshot storage)
- Zustand `undo-redo-store` (undo/redo for list operations)
- Scene/WidgetStateLayer system (gradual disclosure, interaction behaviors)
- Side panel tab system (list configuration, detail content editor)
- Icon library (Lucide icons, emoji picker)
