# FeatureCard

## What It Is
A card component that showcases a feature, capability, or item with an icon, title, and optional description. Provides a consistent card-based presentation format for grouped content.

## Visual Appearance
The component displays a rounded card with a semi-transparent background and subtle border. The card contains an icon badge at the top (or left in horizontal layout), followed by a title and optional description text. The icon badge uses an accent color for background and border, creating visual emphasis. Cards can be arranged vertically (icon above text) or horizontally (icon beside text). The card has subtle hover effects when clickable, and scales through size presets.

## When to Use
- In feature showcases and capability presentations
- For displaying categorized items in grids
- When you need consistent card-based content presentation
- In product feature lists and comparisons
- For service offerings or benefit displays
- When grouping related items with icons and descriptions

## Configuration Options
- **Icon**: Emoji, Lucide icon, or custom icon (required)
- **Title**: Card heading text (required)
- **Description**: Optional descriptive text below the title
- **Accent color**: Custom color for icon background and card border
- **Size presets**: Small, medium, large, or extra-large card sizing
- **Layout direction**: Vertical (icon above) or horizontal (icon beside) arrangement
- **Click action**: Optional handler for clickable cards
- **Entrance animation**: Optional animation effects when the card appears

## Works Well With
- GridOfCards for organized feature grids
- SlideTitle for section headings above card grids
- SlideText for additional context around cards
- BentoLayout for interactive feature exploration
- StatCard when mixing features with metrics
