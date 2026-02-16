# FlowNode

## What It Is
A circular or rounded node component designed for process flows, timelines, and step-by-step visualizations. Displays an icon and label, with visual states for active/inactive steps.

## Visual Appearance
The component displays a rounded node container with an icon centered inside and a label below. The node has a semi-transparent background tinted with the accent color and a border. When active, the node scales up slightly, uses a brighter border, and displays a shadow effect. Inactive nodes appear more subdued with lower opacity borders. The node size is customizable, and the icon scales proportionally.

## When to Use
- In horizontal timelines showing process steps
- For hub-spoke diagrams showing relationships
- In process flows and workflow visualizations
- When displaying sequential steps with visual progression
- For step-by-step guides and tutorials
- When you need to show which step is currently active

## Configuration Options
- **Icon**: Emoji, Lucide icon, or custom icon (required)
- **Label**: Text label displayed below the node (required)
- **Accent color**: Custom color for node background and border
- **Node size**: Adjustable size in pixels (defaults to 40px)
- **Active state**: Toggle to show active/inactive visual states
- **Entrance animation**: Optional animation effects when the node appears

## Works Well With
- HorizontalTimeline layout for process flows
- HubSpoke layout for relationship diagrams
- DetailPopup for showing step details on click
- ProgressBar when showing overall progress alongside steps
- SlideText for step descriptions
