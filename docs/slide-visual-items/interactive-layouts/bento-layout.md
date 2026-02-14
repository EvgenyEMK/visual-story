# BentoLayout

## What It Is
An interactive layout featuring a main expanded area next to a sidebar grid of small items. Clicking a sidebar item expands it in the main area, creating an interactive feature exploration experience with smooth transitions.

## Visual Appearance
The layout splits the slide into two sections. The left side (main area) displays a large expanded card showing the selected item's icon, title, and description with a colored background tinted to the item's accent color. The right side (sidebar) shows a vertical grid of compact items, each displaying an icon and label. The active sidebar item is highlighted with a brighter background and border. Clicking sidebar items smoothly transitions the main area with fade and scale animations, creating a dynamic exploration experience.

## When to Use
- For interactive feature exploration
- When you want users to discover features by clicking
- In product demonstrations with multiple features
- For showcasing capabilities with detailed views
- When space-efficient sidebar navigation is needed
- In presentations that require interactive engagement

## Configuration Options
- **Items**: Array of items with icons, titles, descriptions, and colors (required)
- **Default expanded**: Initially expanded item index
- **Sidebar width**: Adjustable width for the right sidebar (defaults to 28%)
- **Expansion transitions**: Smooth fade and scale animations when switching items
- **Sidebar item styling**: Active state highlighting for selected items

## Works Well With
- FeatureCard concepts (expanded in main area)
- IconBadge for sidebar item icons
- TitleBar for slide headers
- SlideText for additional context
- CTAButton for action prompts
