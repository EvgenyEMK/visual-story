# DetailPopup

## What It Is
A modal overlay card that appears on top of content to show detailed information about an item. Features a backdrop blur effect and smooth animations for a polished interaction experience.

## Visual Appearance
The component displays a centered card overlay with a blurred backdrop that dims the background content. The card has a rounded design with a semi-transparent background tinted with the accent color and a prominent border. Inside, a large icon appears at the top, followed by a bold title and optional description text. The card animates in with a scale and fade effect, and clicking the backdrop closes the popup.

## When to Use
- For drill-down details in interactive layouts
- When clicking items should show more information
- In hub-spoke diagrams for showing spoke item details
- For feature exploration where users can dive deeper
- When you need to show detailed information without navigating away
- In presentations that require interactive detail views

## Configuration Options
- **Open state**: Toggle to show/hide the popup (required)
- **Icon**: Emoji, Lucide icon, or custom icon (required)
- **Title**: Main heading text (required)
- **Description**: Optional descriptive text below the title
- **Accent color**: Custom color for card background and border
- **Close handler**: Function called when the popup is closed (required)
- **Entrance animation**: Built-in scale and fade animations

## Works Well With
- HubSpoke layout for showing spoke item details
- FlowNode when clicking nodes shows details
- ItemThumbnail for thumbnail-to-detail interactions
- IconTitleCard when cards trigger detail views
- GridOfCards for interactive feature exploration
