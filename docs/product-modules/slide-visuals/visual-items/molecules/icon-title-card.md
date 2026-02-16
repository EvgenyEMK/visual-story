# IconTitleCard

## What It Is
A versatile component that presents an icon with an optional title and description. Supports multiple display variants — from a minimal icon-only display to a full card with background and border. Used as a building block for grids, menus, and interactive layouts.

## Visual Appearance
The component centers an icon badge (using accent color for background and border) alongside a title and optional description. Three visual variants control the surrounding chrome:

- **icon-title** (default) — Icon badge + title + optional description with no card background or border. Clean, minimal appearance.
- **icon-only** — Icon badge alone; title and description are hidden. Compact representation for dense grids.
- **card** — Rounded card with semi-transparent background (`bg-white/5`) and subtle accent-tinted border. Full card treatment with icon, title, and description.

In vertical layout, content is centered horizontally. In horizontal layout, the icon sits beside the text. Cards scale through size presets and support subtle hover effects when clickable.

## When to Use
- In feature showcases and capability presentations
- For displaying categorized items in grids
- As menu items in interactive layouts (SidebarDetail, BentoLayout)
- In product feature lists and comparisons
- For service offerings or benefit displays
- When grouping related items with icons and descriptions
- As icon-only badges in dense grid arrangements

## Configuration Options
- **Icon**: Emoji, Lucide icon, or custom icon (required)
- **Title**: Heading text (required, hidden in `icon-only` variant)
- **Description**: Optional descriptive text below the title (hidden in `icon-only` variant)
- **Variant**: `icon-title` (default), `icon-only`, or `card`
- **Accent color**: Custom color for icon background and card border
- **Size presets**: Small, medium, large, or extra-large sizing
- **Layout direction**: Vertical (icon above, content centered) or horizontal (icon beside) arrangement
- **Click action**: Optional handler for clickable items
- **Entrance animation**: Optional animation effects when the component appears

## Works Well With
- GridOfCards for organized feature grids
- SidebarDetail for interactive sidebar menu items
