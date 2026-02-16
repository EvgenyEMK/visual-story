# Slide Editor

> **Status:** `in-progress`
> **MVP:** Yes

## Overview

The Slide Editor is the core authoring experience of VisualStory. It is where users create, edit, and refine animated presentations. The editor combines a visual canvas, timeline, script input, animation engine, voice synchronization, AI assistance, and export capabilities into a unified workspace.

This is the most complex product module and contains multiple feature sets organized into sub-modules.

## Feature Sets

| Sub-module | Description | Status |
|------------|-------------|--------|
| [canvas/](./canvas/) | Slide canvas workspace — visual editing, element selection, zoom, and element property panel | `in-progress` |
| [timeline/](./timeline/) | Horizontal timeline of all slides — reorder, navigate, and manage slide timing | `planned` |
| [script-input/](./script-input/) | Script text entry, section markers, and AI-powered script feedback | `planned` |
| [animations/](./animations/) | Animation engine — element animations, grouped animations, slide transitions, and auto-animation | `in-progress` |
| [voice-sync/](./voice-sync/) | Text-to-speech generation, multi-language support, and audio-timeline synchronization | `planned` |
| [ai-assistant/](./ai-assistant/) | AI-powered visual suggestions, script feedback, and asset generation | `planned` |
| [content-layouts/](./content-layouts/) | Slide layout templates — columns, grids, cards, navigation patterns | `in-progress` |
| [visual-items/](./visual-items/) | Visual building blocks — atoms (text, icons, images), molecules (cards, lists), and interactive layouts | `in-progress` |
| [export/](./export/) | Video export (MP4 via Remotion) and embed/sharing capabilities | `planned` |

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
