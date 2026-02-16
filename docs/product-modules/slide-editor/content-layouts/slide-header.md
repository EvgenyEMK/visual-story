# Slide Header

The slide header is an optional region at the very top of a slide, visually separated from the content area below. It provides context — typically the slide's title, subtitle, and auxiliary information — while the content area holds the main visual material.

The header is **independent of the content layout** — any content layout can be used with or without a header.

## When to use a header

- **Most informational slides** benefit from a header — it anchors the viewer's attention and labels the content below.
- **Title slides, hero slides, full-bleed visuals** typically do NOT use a header — the title is part of the content itself (e.g., centered on screen).
- The header is **always optional**. Slides without a header display content edge-to-edge.

## Header variants

The header supports multiple visual layout variants:

### Title Bar (most common)

A horizontal bar containing:
- **Icon** (optional) — emoji or image before the title text.
- **Title** — the slide's heading, pulled from the slide-level `title` property.
- **Subtitle** (optional) — secondary text from the slide-level `subtitle` property.
- **Trailing section** (optional) — right-aligned content such as status indicators, legends, action buttons, or any other UI component.

This single variant covers the majority of use cases: title-only, title + subtitle, title + icon, and title + trailing section are all configurations of the same component.

### Tabs

Horizontal tab-like sections with no title text. Each tab section is a distinct content block placed horizontally across the header. Useful for slides that present multiple parallel views or categories without a traditional title.

### Custom

Fully custom header content. Any combination of visual items can be placed in the header region using the same component system as the content area. Use this when no pre-built variant fits — for example, a header with a logo, search bar, and user avatar.

## Data flow

The header does NOT own the title, subtitle, or icon. These are **slide-level metadata**:

- `slide.title` — the canonical title of the slide
- `slide.subtitle` — secondary heading
- `slide.icon` — emoji, icon name, or image URL

This design allows the same title to be consumed by different layouts. For example:
- In a slide with a header, the title appears in the header bar.
- In a "Two Columns" layout without a header, the title appears inside the left content pane.
- In a "Center Stage" layout without a header, the title is displayed large and centered.

The header's `variant` property tells the rendering system which visual component to use, and the renderer pulls title/subtitle/icon from the slide.

## Trailing section

The trailing section (right side of the title bar) can contain any visual items — status dots, legend entries, badges, buttons, or custom compositions. Common pre-built patterns include:
- **Status indicator** — a colored dot with a label (e.g., "Active", "Draft")
- **Legend** — icon+label pairs explaining color-coding in the content below
- **Period label** — text like "Q4 2025" or "Jan–Mar"

## Visual separation

The header and content area are visually separated by:
- An optional bottom border (enabled by default)
- Distinct overflow containment — animations in the content area do not bleed into the header
- The header height is determined by its content (shrink-to-fit), and the content area takes all remaining space
