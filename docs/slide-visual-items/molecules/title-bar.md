# TitleBar

## What It Is
The standard header bar component for slides, providing a consistent header structure across presentations. Combines title text, optional subtitle, icon, and trailing content in a unified header layout.

## Visual Appearance
The component displays a horizontal bar at the top of the slide with padding and optional bottom border. The left side contains an optional icon (emoji or icon component) followed by the title text and optional subtitle stacked vertically. The right side can display custom content such as status indicators, legends, or other elements. The bar uses size presets that scale all text and spacing proportionally. The bottom border provides visual separation from the content area below.

## When to Use
- As the primary header for slides (used by the "title-bar" header variant)
- When you need consistent header styling across multiple slides
- For slides that require a title with optional context (subtitle, icon, status)
- When you want to display additional information in the header (status dots, legends)
- As a replacement for custom headers when standardization is needed
- In combination with content layouts that need a clear header section

## Configuration Options
- **Title**: Main heading text (required)
- **Subtitle**: Optional secondary text displayed below the title
- **Icon**: Optional icon or emoji displayed before the title text
- **Right section**: Optional custom content displayed on the right side (status dots, legends, etc.)
- **Size presets**: Small, medium, or large header sizing
- **Bottom border**: Toggle to show/hide the separator line below the bar
- **Entrance animation**: Optional animation effects when the header appears

## Works Well With
- StatusDot for header status indicators
- StatusLegend for header legends explaining visual conventions
- TitleSlide layout for complete title slide compositions
- All content layouts that need a consistent header structure
- Slide content that benefits from clear header separation
