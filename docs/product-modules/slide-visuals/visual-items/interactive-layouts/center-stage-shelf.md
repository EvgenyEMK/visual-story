# CenterStageShelf

## What It Is
A layout that combines a center spotlight area above a bottom shelf of item thumbnails. The selected item displays large in the center, while the shelf provides navigation. Clicking shelf items changes the center spotlight.

## Visual Appearance
The layout divides the slide into two sections. The upper section (center stage) displays a large hero spotlight with the selected item's icon, title, and description centered prominently. The lower section (shelf) shows a horizontal row of compact item thumbnails. The selected thumbnail is highlighted, and clicking different thumbnails smoothly transitions the center spotlight with scale and fade animations. The shelf has a subtle background and top border for visual separation.

## When to Use
- For focused item presentations with navigation
- When you want to emphasize one item at a time
- In product showcases with multiple options
- For interactive feature demonstrations
- When the center stage should be the primary focus
- In presentations that benefit from bottom navigation

## Configuration Options
- **Items**: Array of items with icons, titles, descriptions, and colors (required)
- **Default active**: Initially selected item index
- **Shelf height**: Adjustable height for the bottom shelf (defaults to 56px)
- **Spotlight transitions**: Smooth scale and fade animations when switching items
- **Thumbnail styling**: Active state highlighting for selected items

## Works Well With
- HeroSpotlight component (used for center stage)
- ItemThumbnail components (used in shelf)
- TitleBar for slide headers
- SlideText for additional context
- CTAButton for action prompts
