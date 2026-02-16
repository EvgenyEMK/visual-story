# StatusLegend

## What It Is
A component that groups icon and label entries to explain color-coding, status meanings, or visual conventions. Helps users understand the visual language used throughout a slide or presentation.

## Visual Appearance
The component displays a group of legend entries, each consisting of a small icon badge and label text. Entries can be arranged vertically (stacked) or horizontally (side-by-side). An optional title appears above the entries. The component can be wrapped in a card with background and border for visual separation, or displayed without a card wrapper. Icons use accent colors to match the statuses they represent.

## When to Use
- In headers to explain status color meanings
- In sidebars to clarify visual conventions
- When color-coding needs explanation
- For status keys and legend references
- When icons represent specific meanings that need clarification
- In dashboards to explain metric color schemes

## Configuration Options
- **Entries**: Array of icon and label pairs (required)
- **Title**: Optional title text displayed above entries
- **Size presets**: Small, medium, large, or extra-large legend sizing
- **Layout direction**: Vertical (stacked) or horizontal (side-by-side) arrangement
- **Card wrapper**: Toggle to show/hide background card container
- **Staggered entrance**: Entries animate in with staggered delays
- **Entrance animation**: Optional animation effects when entries appear

## Works Well With
- TitleBar for header legends
- StatusDot for explaining dot color meanings
- MetricDisplay when explaining metric color schemes
- FlowNode for explaining node state meanings
- FeatureCard when explaining feature category colors
