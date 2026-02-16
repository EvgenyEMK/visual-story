# HubSpoke

## What It Is
A radial diagram layout with a central hub node surrounded by spoke nodes connected by lines. Clicking spoke nodes shows detail popups, creating an interactive relationship visualization.

## Visual Appearance
The layout displays a central hub node (typically larger and more prominent) in the center of the slide. Spoke nodes are arranged in a circle around the hub, evenly distributed. Connection lines extend from the hub to each spoke node. The hub uses a gradient background for visual emphasis. Spoke nodes show icons and labels, and when clicked, a detail popup appears with more information. The popup has a blurred backdrop and displays the spoke item's details in a centered card.

## When to Use
- For architecture diagrams showing relationships
- In concept maps and mind maps
- When displaying central concepts with related items
- For organizational charts and hierarchies
- In presentations that show connections and relationships
- For interactive relationship exploration

## Configuration Options
- **Hub label**: Text label for the central hub (required)
- **Hub icon**: Optional icon for the hub
- **Spoke items**: Array of items with icons, labels, descriptions, and colors (required)
- **Radius**: Distance from hub to spoke nodes in pixels
- **Node size**: Adjustable size for spoke nodes in pixels
- **Clickable**: Toggle to enable/disable click interactions
- **Detail popups**: Shows detail popup when spoke nodes are clicked

## Works Well With
- FlowNode concepts (for spoke nodes)
- DetailPopup component (for detail views)
- TitleBar for slide headers
- SlideText for additional context
- StatusLegend for explaining node meanings
