# UX Requirements: Scenes & Animation Steps Architecture

> **Created:** 2026-02-13 — Documents the user experience requirements for the Scenes + Widget State Layers architecture (Option C).

## 1. Presentation Structure & Navigation

### 1.1. Sections and Sub-sections (Organizational Hierarchy)

Users can organize slides into sections, similar to PowerPoint, with these differences:

- **Collapsible groups**: Sections collapse/expand in the vertical slide sidebar
- **Up to 3 nesting levels**: Presentation root → Section → Sub-section
- Slides within one section can be completely different from each other (no visual constraint)

**Example hierarchy in the vertical sidebar:**

```
Presentation: "Q1 Product Roadmap"
├── Section: "Introduction" (collapsible)
│   ├── Slide: "Welcome"
│   └── Slide: "Agenda"
├── Section: "Product Features" (collapsible)
│   ├── Sub-section: "Core Platform" (collapsible)
│   │   ├── Slide: "Feature Grid"
│   │   │   ├── Scene: "Overview" (auto-generated)
│   │   │   └── Scene: "Detail View" (auto-generated)
│   │   └── Slide: "Architecture"
│   ├── Sub-section: "Integrations" (collapsible)
│   │   └── Slide: "API Partners"
│   └── Slide: "Roadmap Timeline"
├── Section: "Metrics" (collapsible)
│   └── Slide: "KPI Dashboard"
└── Section: "Closing" (collapsible)
    └── Slide: "Next Steps"
```

### 1.2. Scenes (Content Children of Slides)

Scenes are auto-generated content units within a slide. They represent meaningful content divisions that the presenter walks through sequentially.

- **Shown in vertical sidebar** as children of their parent slide (compact text items, not thumbnails)
- **Auto-generated and auto-maintained** based on the slide/widget template selected by the user
- The user does NOT manually create scenes — the template defines them
- Users can change scene configuration from available options (or later via AI natural language prompts)
- All scenes within a slide share the same canvas background/layout (MVP)

**Naming rationale:** "Scene" was chosen over alternatives because:
- It evokes visual storytelling — perfect for a product called "VisualStory"
- Immediately understood as "a unit within a larger narrative"
- Doesn't carry the baggage of "sub-slide" (sounds lesser) or "chapter" (too document-oriented)

### 1.3. Animation Steps (Horizontal Strip)

Animation steps are the individual progression states within a scene. They appear in the horizontal strip below the canvas.

**Key rule for step granularity:**

| Animation pattern | Steps in horizontal strip |
|---|---|
| "All at once" (e.g., all cards fly in together with stagger delay) | **1 step** |
| "Event-driven sequential" (e.g., each card appears on click/TTS completion) | **N steps** (one per item) |
| Exit animations (almost always "all at once") | **1 step** (or 0 if instant) |

**Example: Grid of 4 cards with sequential reveal:**
```
Horizontal strip: [Card 1] [Card 2] [Card 3] [Card 4]  ← 4 steps
```

**Example: Grid of 4 cards with "all at once" fly-in:**
```
Horizontal strip: [Grid Appears]  ← 1 step
```

**Widget interactions (e.g., smart card expand/collapse) are NOT steps** — they are widget behaviors configured in the Widget State Layer. During presentation, if an interactive widget is already visible, the presenter can click it at any time to trigger its interaction (e.g., expand to show details).

## 2. Auto-Generation & Template-Driven Behavior

### 2.1. Core Principle

The main value proposition of this SaaS is **automating animation** for the user. Users should NOT need to micro-manage scenes or animation steps. The system:

1. User selects a slide/widget template (e.g., "Grid of Cards with Sequential Reveal")
2. System auto-generates scenes and their animation configuration
3. User can adjust configuration from available options
4. Future: User asks AI in natural language to change settings

### 2.2. Animation Template Variants

A single widget can offer multiple animation templates. Example for "Grid of Simple Cards (icon+text)":

| Variant | Behavior | Steps generated |
|---|---|---|
| **Fly-in together** | All cards appear at once with stagger delay between items. Various fly-in direction options. | 1 step (enter) |
| **Sequential reveal** | First card appears (fly-in), then next card appears on event (user click or completed TTS speech for current card) | N steps (one per card) |

**Exit animations** are optional and can differ from enter animations (for visual variety). In practice, exit is almost always "all at once."

### 2.3. Robustness Against Config Changes

When a user changes the animation mode (e.g., from "sequential" to "all at once"), only the animation behavior changes — the scene structure and any user notes/voice-over text are preserved.

## 3. Widget-to-Widget Dependencies

### 3.1. Cross-Slide Widget Transitions

AI can detect that Widget A in Slide 1 and Widget B in Slide 2 show related data (e.g., matching item titles) and automatically create morph/transition animations between them.

**Example:** Slide 1 has a "Feature Grid" with 4 cards. Slide 2 has a "Feature Detail" showing one of those cards expanded. AI detects the title match and creates a morph transition where the card visually flies from its grid position to the detail view.

### 3.2. Data-Driven Dependencies

Widgets can be logically linked for interactive behavior:

**Example:** A "Task List with Status" widget is linked to a "Status Icons Legend" widget. When the user clicks a status icon on a task, they can select from choices defined in the legend. The legend defines the available statuses (icon, color, label), and the task list references it.

### 3.3. Widget Visual States

Widgets can have multiple visual states (MVP: normal and expanded):

- **Normal state**: Compact display (e.g., icon + title)
- **Expanded state**: Full detail view (e.g., icon + title + description + nested content)

Visual state changes are widget behaviors, not separate scenes or steps. They are triggered by user interaction (click) or automatically during presentation (after TTS completion).

### 3.4. Template Widgets with Instances (Post-MVP)

A widget can be defined as a "template" (either outside of any slide, or marked within a slide as "template"). The template defines properties that all instances inherit, with control over whether instances can override specific properties.

**Example:** A "Feature Card" template defines the card layout, color scheme, and animation behavior. Each slide that uses a feature card creates an instance that inherits the template's formatting but has its own title and description content.

## 4. Interactive Presentation Behavior

### 4.1. Non-Linear Scene Navigation via Widget Interaction

During live presentation, if an interactive widget (e.g., a card that can expand) is already visible on screen, the presenter can click it at any time to show more details. This does NOT require advancing to a different scene — it's a widget interaction within the current scene.

**Example:** A grid of 4 feature cards is fully visible. The presenter clicks "Security" card → it expands to show details. Presenter clicks "Analytics" card → Security collapses, Analytics expands. This all happens within the same scene.

### 4.2. Trigger Modes

- **Auto mode**: Steps advance automatically based on timer or TTS completion
- **Click mode**: Steps advance on presenter click
- **Mixed**: Auto-advance for reveal steps, click for widget interactions

## 5. Widget Scope & Ownership

All widgets are owned by the Slide. Scenes configure widget visibility and state, but do not own widgets exclusively. This means:

- A widget defined in Scene 1 is accessible from Scene 2 (can be shown/hidden/transformed)
- Data bindings between widgets work across scene boundaries within the same slide
- Widget visual states persist across scenes (if a card was expanded in Scene 1 and Scene 2 shows the same card, it remembers its state)

Post-MVP: Some widget properties may be inherited from "global widget templates" defined at the presentation level (e.g., title text formatting, color themes).
