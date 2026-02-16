# Slide Visuals

> **Status:** `in-progress`
> **MVP:** Yes

## Purpose

Slide Visuals contains the fundamental visual building blocks used across both the Slide Editor (authoring) and Slide Player (presentation) modes. These are not specific to editing workflows -- they define what visual elements exist, how they are structured, and how slides are spatially arranged.

## Contents

| Folder | Description | Status |
|--------|-------------|--------|
| [visual-items/](./visual-items/) | Five-tier component system: atoms, molecules, smart widgets, layout molecules, interactive layouts | `in-progress` |
| [content-layouts/](./content-layouts/) | Slide layout templates -- columns, grids, cards, navigation patterns, slide header | `in-progress` |
| [layouts-and-templates/](./layouts-and-templates/) | Layout template picker, slide backgrounds, alignment, grid/snap | `ToDo` |

## Relationship to Other Modules

- **[Slide Editor](../slide-editor/)** -- uses visual items on the canvas for authoring; references content-layouts for slide structure
- **[Slide Player](../slide-player/)** -- renders visual items during presentation playback
- **[Slide Editor / Element Editing](../slide-editor/element-editing/)** -- editing workflows for visual items (select, style, position)
- **[Slide Editor / Animation & Timing](../slide-editor/animation-and-timing/)** -- animation behaviors applied to visual items
