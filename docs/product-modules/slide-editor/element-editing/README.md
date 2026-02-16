# Element Editing

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `In Progress`
> **MVP:** Yes

## Purpose

Element Editing is the most frequent activity in the editor. It covers the full lifecycle of working with individual elements on a slide — selecting, creating, editing text, changing styles, adjusting size and position, and assigning entrance animations. This is a single coherent workflow even though it spans multiple UI zones simultaneously.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Canvas** | **Primary** | Click-to-select, selection ring, inline text editing, grid cell block insertion |
| **Side Panel** | **Primary** | Properties form — typography, fill/border, shadow, spacing per item type |
| **Bottom Panel** | Secondary | Animation steps list updates to reflect selected element |
| **Top Bar** | Secondary | Undo/redo buttons, Properties panel toggle |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| EE-F01 | [Element Selection](#ee-f01-element-selection) | Click to select elements; Escape to deselect | Yes | `Done` |
| EE-F02 | [Inline Text Editing](#ee-f02-inline-text-editing) | Double-click text to edit directly on canvas (TipTap) | Yes | `Done` |
| EE-F03 | [Element Properties Panel](#ee-f03-element-properties-panel) | Side panel form for typography, fill, border, shadow, spacing | Yes | `Done` |
| EE-F04 | [Create New Elements](#ee-f04-create-new-elements) | Slash command (/) to insert blocks inside grid cells; append to filled cells | Yes | `Done` |
| EE-F05 | [Element Animation Assignment](#ee-f05-element-animation-assignment) | Choose entrance animation for a selected element | Yes | `ToDo` |
| EE-F06 | [Drag to Move & Resize](#ee-f06-drag-to-move--resize) | Direct manipulation on canvas — move and resize elements | Yes | `ToDo` |
| EE-F07 | [Undo / Redo](#ee-f07-undo--redo) | Undo and redo editing actions (Ctrl+Z / Ctrl+Y) | Yes | `Done` |
| EE-F08 | [Context Menu](#ee-f08-context-menu) | Right-click for quick actions (copy, paste, delete, z-order) | No | `ToDo` |
| EE-F09 | [Multi-Element Operations](#ee-f09-multi-element-operations) | Align, distribute, or group multiple selected elements | No | `ToDo` |
| EE-F10 | [Smart Item Lists](./smart-item-lists.md) | Configurable list widget with icon sets, hierarchy, gradual disclosure, linked legend, snapshots | Partial | `ToDo` |

---

## User Stories

### EE-F01: Element Selection

#### US-EE-001: Select Element by Click — `Done`
**As a** business user,
**I want to** click on a slide element to select it,
**so that** I can view and edit its properties.

**Acceptance Criteria:**
- [x] Single click on canvas selects the element
- [x] Selected element shows a visible selection ring (blue ring for editing, primary ring for selected)
- [x] Side panel Properties tab populates with the element's data
- [x] Clicking empty canvas area deselects all elements
- [x] Pressing Escape deselects or exits editing mode

**Implementation notes:**
- Selection is managed via `selectedElementId` state in `SlideEditorClient`.
- The recursive `ItemRenderer` applies selection rings via `selectionClasses()` helper.
- Click on any item calls `editing.onItemSelect(item.id)` with `stopPropagation`.
- Click on root canvas fires `onItemSelect(null)` to deselect.
- Grid cell cards are also selectable — clicking empty padding area of a filled card selects the card for formatting.

#### US-EE-002: Multi-Select Elements — `ToDo`
**As a** business user,
**I want to** select multiple elements using Shift+click,
**so that** I can move or style them together.

**Acceptance Criteria:**
- [ ] Shift+click adds or removes element from current selection
- [ ] All selected elements show bounding boxes
- [ ] Side panel shows shared properties when multiple elements are selected

---

### EE-F02: Inline Text Editing

#### US-EE-003: Edit Text In-Place on Canvas — `Done`
**As a** business user,
**I want to** double-click a text element to edit it directly on the canvas,
**so that** I can change text quickly without switching to a form.

**Acceptance Criteria:**
- [x] Double-click enters inline editing mode (TipTap rich-text editor)
- [x] Text changes reflected immediately on canvas
- [x] Rich text editing: bold, italic, underline, color, font-family, text-align
- [x] Escape or clicking outside exits edit mode and saves changes
- [x] HTML content preserved and rendered via `dangerouslySetInnerHTML`

**Implementation notes:**
- `InlineTextEditor` component uses TipTap with `immediatelyRender: false` (prevents SSR hydration mismatch in Next.js).
- Extensions: StarterKit, Underline, TextStyle, Color, FontFamily, TextAlign.
- `TextFormattingToolbar` provides floating format controls above the editor.
- Content saved as HTML on every editor update via `onSave` callback.

---

### EE-F03: Element Properties Panel

#### US-EE-004: Edit Element Text via Side Panel — `Done`
**As a** business user,
**I want to** edit text content and style in the side panel,
**so that** I can make precise formatting changes.

**Acceptance Criteria:**
- [x] Panel dynamically adapts controls based on item type (atom text, atom icon, card, layout)
- [x] Typography section: font family, font size, font weight, text color, text alignment
- [x] Changes apply to the canvas in real-time
- [x] Panel shows "No selection" placeholder when nothing is selected

#### US-EE-005: Edit Element Style — `Done`
**As a** business user,
**I want to** change the visual style of a selected element (color, border, shadow),
**so that** I can customize how individual elements look.

**Acceptance Criteria:**
- [x] Color picker for fill/background color
- [x] Border controls: width, color, radius
- [x] Shadow presets (none, subtle, medium, strong)
- [x] Opacity slider (0-100%)

#### US-EE-006: Edit Element Size and Position — `Partial`
**As a** business user,
**I want to** set exact size and position values for a selected element,
**so that** I can achieve precise layout when drag-and-drop is not accurate enough.

**Acceptance Criteria:**
- [x] Numeric inputs for Width, Height
- [x] Padding control
- [ ] Numeric inputs for X, Y position (only applicable to absolutely positioned items)
- [ ] Lock aspect ratio toggle for proportional resizing

**Implementation notes:**
- `ItemPropertiesPanel` renders Dimensions section (width, height) and Spacing section (padding).
- Currently the properties panel is designed for the `SlideItem` tree model, not the legacy `SlideElement` flat array.

---

### EE-F04: Create New Elements

#### US-EE-007: Insert Block via Slash Command — `Done`
**As a** business user,
**I want to** type "/" inside a grid cell to insert content blocks,
**so that** I can build slide content without leaving the canvas.

**Acceptance Criteria:**
- [x] Empty grid cells show "Type / for commands" placeholder (`EmptyCardSlot`)
- [x] Typing "/" opens a floating `SlashCommandMenu` with categorized block types
- [x] Available blocks: Icon Card, Stat Card, Task List, Heading, Text, Quote
- [x] Arrow key navigation and Enter to select; Escape to close
- [x] Filter blocks by typing (e.g. "/icon" filters to Icon Card)
- [x] Selected block replaces the empty card's children
- [x] Typing plain text and pressing Enter inserts a text block directly

#### US-EE-016: Add Blocks to Filled Grid Cells — `Done`
**As a** business user,
**I want to** add more content to a grid cell that already has items,
**so that** I can build multi-block content inside a single cell (similar to Notion/Gamma).

**Acceptance Criteria:**
- [x] Filled cards show a compact "+ Add block" button at the bottom
- [x] Clicking the button activates slash command input
- [x] Selected block is **appended** to existing children (not replaced)
- [x] Items within the cell remain individually selectable and editable
- [x] Clicking the card's empty space (padding area) selects the card for formatting

**Technical design — grid cell as content container:**

The grid cell is a `CardItem` that acts as a content container. There is no extra wrapper div inside the cell; the CardItem div itself is the cell container. This is the correct approach because:

1. **The CardItem already has flex column layout** (`display: flex; flex-direction: column; gap`) — children stack naturally.
2. **The CardItem is the styling target** — users can format the cell's background, border, padding by selecting the card.
3. **Children are individually interactive** — each child atom/card handles its own click/double-click events.

```
LayoutItem (grid)
  ├── CardItem (cell 1) ← this IS the grid cell container
  │   ├── AtomItem (icon)
  │   ├── AtomItem (text)
  │   └── [+ Add block] ← append affordance
  ├── CardItem (cell 2)
  │   └── [EmptyCardSlot] ← shown when empty
  └── ...
```

**Data flow for appending:**
- `AddBlockButton.onAppendBlock(cardId, newChildren)`
- → `ItemRenderer.editing.onAppendBlock(cardId, newChildren)`
- → `SlideEditorClient.handleAppendBlock(parentId, newChildren)`
- → `projectStore.appendChildToItem(slideId, parentId, newChildren)`
- → `appendChildrenToItem()` in `flatten-items.ts` (immutable tree update)

#### US-EE-008: Insert Shape or Icon — `ToDo`
**As a** business user,
**I want to** insert shapes and icons from the insert menu,
**so that** I can add visual elements to my slides.

**Acceptance Criteria:**
- [ ] Shape options: rectangle, circle, arrow, line
- [ ] Icon option opens the icon browser in the side panel
- [ ] Shape inserted at center with default size and style

---

### EE-F05: Element Animation Assignment

#### US-EE-009: Choose Entrance Animation for Element — `ToDo`
**As a** business user,
**I want to** select an entrance animation for a selected element,
**so that** I can control how it appears during the presentation.

**Acceptance Criteria:**
- [ ] Animation dropdown in the side panel Properties tab
- [ ] Options: fade, slide, zoom, pop, typewriter, etc. (from animation catalog)
- [ ] Duration slider (0.2s – 3.0s)
- [ ] Preview button plays the animation on the canvas
- [ ] Changes reflected in the bottom panel animation step list

> **Cross-reference:** For managing the *sequence* of animation steps across all elements, see [animation-and-timing/](../animation-and-timing/).

---

### EE-F06: Drag to Move & Resize

#### US-EE-010: Move Element by Dragging — `ToDo`
**As a** business user,
**I want to** drag an element to reposition it on the canvas,
**so that** I can arrange the slide layout visually.

**Acceptance Criteria:**
- [ ] Click and drag moves the element
- [ ] Position updates in the side panel in real-time
- [ ] Snap guides appear when aligning with other elements

#### US-EE-011: Resize Element by Dragging Handles — `ToDo`
**As a** business user,
**I want to** drag resize handles to change an element's size,
**so that** I can make elements bigger or smaller visually.

**Acceptance Criteria:**
- [ ] Corner handles resize proportionally by default
- [ ] Edge handles resize in one dimension
- [ ] Hold Shift to force proportional resize from edge handles
- [ ] Size values update in the side panel in real-time

---

### EE-F07: Undo / Redo

#### US-EE-012: Undo Last Action — `Done`
**As a** business user,
**I want to** undo my last editing action,
**so that** I can recover from mistakes.

**Acceptance Criteria:**
- [x] Undo button in the top bar
- [x] Keyboard shortcut: Ctrl/Cmd+Z (skipped when inline text editing is active — TipTap handles its own undo)
- [x] Supports: text edits, style changes, element creation, block insertion/appending
- [x] Undo stack managed by `undo-redo-store` with snapshot history

#### US-EE-013: Redo Action — `Done`
**As a** business user,
**I want to** redo an action I just undid,
**so that** I can restore changes.

**Acceptance Criteria:**
- [x] Redo button next to undo in the top bar
- [x] Keyboard shortcut: Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z
- [x] Redo stack clears when a new action is performed after undo

---

### EE-F08: Context Menu

#### US-EE-014: Right-Click Context Actions — `ToDo`
**As a** business user,
**I want to** right-click an element for quick actions,
**so that** I can perform common operations without navigating menus.

**Acceptance Criteria:**
- [ ] Right-click shows: Copy, Paste, Duplicate, Delete, Bring to Front, Send to Back
- [ ] Keyboard shortcuts shown next to each action
- [ ] Menu items are contextual (Paste only when clipboard has content)

---

### EE-F09: Multi-Element Operations

#### US-EE-015: Align and Distribute Selected Elements — `ToDo`
**As a** business user,
**I want to** align or distribute multiple selected elements,
**so that** I can create clean, professional layouts.

**Acceptance Criteria:**
- [ ] Align options: left, center, right, top, middle, bottom
- [ ] Distribute options: horizontal spacing, vertical spacing
- [ ] Options appear in the side panel when 2+ elements are selected

---

## Technical Architecture

### Data Model

The editor operates on the **SlideItem tree** — a recursive data structure that is the primary source of truth for slide content:

```
SlideItem = LayoutItem | CardItem | AtomItem

LayoutItem  → flex/grid/sidebar/split/stack container wrapping children
CardItem    → styled card wrapper wrapping children (acts as grid cell)
AtomItem    → leaf DOM element (text, icon, shape, image)
```

A legacy flat `SlideElement[]` model still exists but is deprecated. New features use the tree model exclusively.

### Key Components

| Component | Path | Role |
|-----------|------|------|
| `SlideEditorClient` | `components/slide-editor/SlideEditorClient.tsx` | Main editor container; manages selection/editing state; wires store actions |
| `SlideMainCanvas` | `components/slide-editor/SlideMainCanvas.tsx` | Renders the current slide with editing overlays |
| `ItemRenderer` | `components/animation/ItemRenderer.tsx` | Recursively renders `SlideItem` tree; handles selection, inline editing, block insertion |
| `InlineTextEditor` | `components/editor/inline-text-editor.tsx` | TipTap-based rich text editor for inline text editing |
| `TextFormattingToolbar` | `components/editor/text-formatting-toolbar.tsx` | Floating toolbar for rich text formatting |
| `ItemPropertiesPanel` | `components/editor/item-properties-panel.tsx` | Side panel with per-type editing controls |
| `EmptyCardSlot` | `components/editor/slash-command-menu.tsx` | Slash command overlay for empty grid cells |
| `AddBlockButton` | `components/editor/slash-command-menu.tsx` | Compact "+" append affordance for filled grid cells |
| `SlashCommandMenu` | `components/editor/slash-command-menu.tsx` | Floating dropdown with categorized block types |

### Store Actions

| Store | Action | Purpose |
|-------|--------|---------|
| `project-store` | `updateItem(slideId, itemId, updates)` | Immutably update a single item in the tree (content, style, children replacement) |
| `project-store` | `appendChildToItem(slideId, parentId, newChildren)` | Append new child items to a card/layout (for adding blocks to filled cells) |
| `project-store` | `undo()` / `redo()` | Undo/redo with snapshot history |
| `editor-store` | `toggleProperties()` | Show/hide the properties side panel |

### Tree Utility Functions (`lib/flatten-items.ts`)

| Function | Purpose |
|----------|---------|
| `updateItemInTree(items, id, updates)` | Immutably merge partial updates into a single item by ID |
| `appendChildrenToItem(items, parentId, children)` | Immutably append children to a card/layout by parent ID |
| `findItemById(items, id)` | Locate any item in the tree by ID |
| `deepCloneItemsWithNewIds(items)` | Deep-clone a tree with fresh UUIDs (for slide duplication) |

## Technical References

- [canvas/slide-canvas.md](../_reference/canvas/slide-canvas.md) — SlideCanvas component technical spec
- [canvas/element-properties.md](../_reference/canvas/element-properties.md) — Element properties panel spec
- [_reference/visual-items/](../_reference/visual-items/) — Visual building blocks (atoms, molecules, smart widgets)
- [_reference/animations/](../_reference/animations/) — Animation catalog for element animation assignment
- [smart-item-lists.md](./smart-item-lists.md) — Smart Item Lists feature spec (21 features, 4 phases)
- [smart-item-lists-assessment.md](./smart-item-lists-assessment.md) — Business importance assessment

## Dependencies

- Zustand `editor-store` (selected element, selection state, panel visibility)
- Zustand `project-store` (element CRUD mutations: `updateItem`, `appendChildToItem`)
- Zustand `undo-redo-store` (undo/redo snapshot history)
- TipTap (`@tiptap/react`, `@tiptap/starter-kit`, extensions) for inline rich text editing
- Side panel Properties tab (toggleable via top bar button)
