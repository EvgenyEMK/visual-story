# SidebarDetail

## What It Is
A two-pane interactive layout with a sidebar of item thumbnails on the left and a hero spotlight detail area on the right. Clicking items in the sidebar changes the detail view, creating an interactive browsing experience.

## Visual Appearance
The layout splits the slide into two sections. The left sidebar displays a vertical list of compact item thumbnails with icons and labels. The selected item is highlighted with a background tint and colored left border. The right side shows a large hero spotlight display with the selected item's icon, title, and description centered prominently. The detail area smoothly transitions when different items are selected, with fade animations between changes.

## When to Use
- For browsing collections of items with detailed views
- When you need interactive item exploration
- In product catalogs and feature browsers
- For showcasing multiple items with individual detail focus
- When space-efficient navigation is needed alongside detailed content
- In presentations that require interactive item selection

## Configuration Options
- **Items**: Array of items with icons, titles, descriptions, and colors (required)
- **Sidebar width**: Adjustable width for the left sidebar (defaults to 180px)
- **Default active**: Initially selected item index
- **Detail transitions**: Smooth fade animations when switching items
- **Thumbnail styling**: Active state highlighting for selected items

## Works Well With
- ItemThumbnail components (used in sidebar)
- HeroSpotlight component (used for detail view)
- TitleBar for slide headers
- SlideText for additional context
- StatusLegend for sidebar legends
