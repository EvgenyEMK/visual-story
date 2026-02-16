# Slide Editor

> **Status:** `ToDo`
> **MVP:** Yes

## Overview

The Slide Editor is the core authoring experience of VisualStory. It is where users create, edit, and refine animated interactive presentations. Features are organized by **functional task clusters** — each sub-folder represents a coherent user workflow (what the user is trying to accomplish), not a UI panel.

## Editor Layout

The editor workspace consists of five UI zones. Features in each task cluster may touch one or more zones.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            TOP BAR                                      │
│  [← Back] [Title ✎]  [Insert ▼] [Theme ▼]  [Preview] [Export] [Share] │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│          │                                              │               │
│  SLIDE   │                                              │    SIDE       │
│  LIST    │               CANVAS                         │    PANEL      │
│          │          (main editing area)                  │  (properties, │
│  [1] ■   │                                              │   AI, assets) │
│  [2] ■   │     ┌──────────────────────────────┐         │               │
│  [3] ■◄──│─────│     Current Slide Preview    │         │  ┌─────────┐  │
│  [4] ■   │     │     (16:9)                   │         │  │ Context │  │
│  [5] ■   │     │                              │         │  │ Panel   │  │
│          │     └──────────────────────────────┘         │  └─────────┘  │
│          │                                              │               │
├──────────┴──────────────────────────────────────────────┴───────────────┤
│                         BOTTOM PANEL                                    │
│  [Speaker Notes]  [Animation Steps]  [Voice-Over]                       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Feature Clusters

| Sub-module | Description | Status |
|------------|-------------|--------|
| [deck-management/](./deck-management/) | Slides CRUD, scenes, reorder, navigate between slides | `ToDo` |
| [element-editing/](./element-editing/) | Select, create, edit text/style/size/position, element animation assignment | `In Progress` |
| [layouts-and-templates/](./layouts-and-templates/) | Layout templates, slide backgrounds, alignment, grid/snap | `ToDo` |
| [animation-and-timing/](./animation-and-timing/) | Animation step sequence, grouped animations, transitions, timing, preview | `ToDo` |
| [narration-and-voice/](./narration-and-voice/) | Speaker notes, TTS generation, voice selection, audio-animation sync | `ToDo` |
| [theming/](./theming/) | Visual themes, colors, fonts, branding | `ToDo` |
| [ai-assistant/](./ai-assistant/) | AI prompts, script feedback, visual suggestions, regeneration | `ToDo` |
| [preview-and-export/](./preview-and-export/) | Full-screen preview, video export, web link, sharing | `ToDo` |

## Feature-to-UI-Zone Cross-Reference

Each feature cluster maps to one or more UI zones. **Primary** = the zone where the feature's main interaction occurs. **Secondary** = zones that update reactively or provide supporting controls.

| Feature Cluster | Slide List | Canvas | Side Panel | Bottom Panel | Top Bar |
|-----------------|:----------:|:------:|:----------:|:------------:|:-------:|
| Deck management | **primary** | | | | secondary |
| Element editing | | **primary** | **primary** | secondary | secondary |
| Layouts & templates | | **primary** | **primary** | | |
| Animation & timing | | secondary | secondary | **primary** | |
| Narration & voice | | | | **primary** | |
| Theming | | secondary | secondary | | **primary** |
| AI assistant | | secondary | **primary** | | |
| Preview & export | | | | | **primary** |

## Reference Documentation

Data-model catalogs and design-system docs that are referenced by multiple feature clusters:

| Reference | Description | Status |
|-----------|-------------|--------|
| [_reference/animations/](./_reference/animations/) | Animation engine — element animations, grouped animations, slide transitions, catalog | `in-progress` |
| [_reference/visual-items/](./_reference/visual-items/) | Visual building blocks — atoms, molecules, interactive layouts | `in-progress` |
| [_reference/content-layouts/](./_reference/content-layouts/) | Slide layout templates — columns, grids, cards, navigation patterns | `in-progress` |

## User Flow (Editor)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Script      │    │  Generate    │    │  Edit &      │    │  Preview &   │
│  Input       │───►│  Slides +    │───►│  Refine      │───►│  Export      │
│              │    │  Animations  │    │  (Canvas)    │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

1. **Script Input** — User enters narrative text, optionally uses AI to refine structure
2. **Generate** — System creates slides with auto-selected animation templates
3. **Edit** — User refines on the canvas: adjust elements, swap animations, edit text, tune timing
4. **Preview & Export** — Add voice-over, preview with audio sync, export as video or web link

## Related Modules

- [slide-player/](../slide-player/) — Presentation playback mode (viewer experience)
- [user-profile/](../user-profile/) — Projects library where saved presentations are managed
