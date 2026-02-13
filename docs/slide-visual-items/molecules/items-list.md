# ItemsList

## What It Is
A vertical list component for displaying structured lists of items with icons, text, descriptions, and nested children. Supports section headers, checked states, and hierarchical organization.

## Visual Appearance
The component displays a vertical list of items, each with an icon badge on the left and text content on the right. Items can have primary text and optional description text below. Section headers appear with bold text and optional colored accent bars. Nested children are indented to show hierarchy. Items can display checked/unchecked states with visual indicators. Optional left accent bars provide additional visual organization. The list uses consistent spacing and scales through size presets.

## When to Use
- For task lists and to-do items
- In feature lists with descriptions
- For hierarchical content with parent-child relationships
- When you need organized lists with icons and text
- In content that requires section grouping
- For checklists and completion tracking

## Configuration Options
- **Items**: Array of list items with icons, text, descriptions, and optional children (required)
- **Section headers**: Optional headers that group items visually
- **Size presets**: Small, medium, large, or extra-large list sizing
- **Accent bars**: Toggle to show colored left border bars on items
- **Checked states**: Support for checked/unchecked item states
- **Nested children**: Support for hierarchical indented sub-items
- **Staggered entrance**: Items animate in with staggered delays
- **Entrance animation**: Optional animation effects when items appear

## Works Well With
- SlideTitle for list section headings
- IconBadge for consistent icon presentation
- ProgressBar when showing list completion progress
- StatusDot for item status indicators
- QuoteBlock when mixing lists with quotes
