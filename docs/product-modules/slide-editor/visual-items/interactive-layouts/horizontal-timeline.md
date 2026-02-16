# HorizontalTimeline

## What It Is
A horizontal sequence layout displaying flow nodes connected by lines, representing processes, timelines, or step-by-step flows. Clicking nodes advances the active step, with visual progression indicators.

## Visual Appearance
The layout displays a horizontal row of flow nodes connected by horizontal lines between them. Each node shows an icon and label. The active node is highlighted with brighter colors, increased scale, and a shadow effect. Connection lines before the active node are highlighted in the accent color, while lines after remain subdued. Nodes are evenly spaced, and the layout supports horizontal scrolling if needed. Clicking a node sets it as active and updates the visual progression.

## When to Use
- For process flows and workflows
- In timelines showing chronological steps
- For step-by-step guides and tutorials
- When displaying sequential processes
- In presentations that show progression through steps
- For interactive process demonstrations

## Configuration Options
- **Items**: Array of timeline items with icons, labels, and colors (required)
- **Default active**: Initially active step index
- **Node size**: Adjustable size for flow nodes in pixels
- **Connection lines**: Visual lines connecting nodes with color progression
- **Active state**: Visual highlighting for the current step
- **Click interaction**: Clicking nodes advances the active step

## Works Well With
- FlowNode components (used for each step)
- SlideText for step descriptions
- DetailPopup for showing step details
- TitleBar for slide headers
- ProgressBar for overall progress indication
