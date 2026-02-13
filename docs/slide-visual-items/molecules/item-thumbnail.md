# ItemThumbnail

## What It Is
A compact item display component designed for navigation lists, sidebars, and shelves. Shows a small icon and label text with active state highlighting for selected items.

## Visual Appearance
The component displays a horizontal row with a small icon badge on the left and label text on the right. The icon appears in a small rounded container with the accent color background. When active, the entire row highlights with a background tint and a colored left border accent. The component has subtle hover effects when clickable, and the text truncates if too long to maintain consistent sizing.

## When to Use
- In sidebars for navigation lists
- In bottom shelves for item navigation
- For compact item lists that need selection states
- When you need space-efficient item displays
- In interactive layouts where clicking items changes views
- For browsing collections with detailed views

## Configuration Options
- **Icon**: Emoji, Lucide icon, or custom icon (required)
- **Label**: Text label displayed next to the icon (required)
- **Accent color**: Custom color for icon background and active state
- **Active state**: Toggle to show selected/highlighted appearance
- **Click action**: Handler function for item selection
- **Entrance animation**: Optional animation effects when the thumbnail appears

## Works Well With
- SidebarDetail layout for sidebar navigation
- CenterStageShelf layout for bottom shelf navigation
- HeroSpotlight for the detail view that changes on selection
- ItemsList for more detailed list items
- DetailPopup for showing item details
