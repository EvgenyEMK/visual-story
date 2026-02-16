# GridOfCards

## What It Is
An auto-grid layout that arranges IconTitleCard components in a responsive grid pattern. Automatically determines optimal column count based on item quantity and supports staggered entrance animations.

## Visual Appearance
The component displays a grid of feature cards arranged in columns. The grid automatically calculates the optimal number of columns based on the item count (typically 2-4 columns). Cards are evenly spaced with configurable gaps between them. When entrance animations are enabled, cards appear with staggered delays, creating a cascading reveal effect. Cards maintain consistent sizing and can be arranged vertically (icon above text) or horizontally (icon beside text).

## When to Use
- For feature showcases with multiple items
- When displaying categorized content in an organized grid
- For product feature presentations
- In service offerings and capability displays
- When you need consistent card-based layouts
- For presentations that benefit from visual grid organization

## Configuration Options
- **Items**: Array of card items with icons, titles, descriptions, and colors (required)
- **Columns**: Optional fixed column count (defaults to auto-calculated based on item count)
- **Gap**: Adjustable spacing between cards in pixels
- **Card size**: Small, medium, large, or extra-large card sizing
- **Card direction**: Vertical (icon above) or horizontal (icon beside) card layout
- **Staggered entrance**: Cards animate in with staggered delays for cascading effect
- **Entrance animation**: Optional animation effects when cards appear

## Works Well With
- SlideTitle for section headings above grids
- IconTitleCard components (used internally)
- SlideText for context around the grid
- TitleBar for slide headers
- CTAButton for action prompts below grids
