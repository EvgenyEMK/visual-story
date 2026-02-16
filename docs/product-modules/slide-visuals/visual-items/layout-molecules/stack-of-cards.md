# StackOfCards

## What It Is
A 3D perspective card stack layout that displays multiple items layered with depth effects. Cards are stacked with 3D transforms, and clicking cycles through the stack, bringing the next card to the front.

## Visual Appearance
The layout displays cards stacked in 3D space with perspective effects. The top card appears at full size and opacity, while cards below are progressively smaller, more transparent, and offset to create depth. Cards show icons, titles, and optional subtitles. When clicked, the stack rotates, bringing the next card to the front with smooth animations. The 3D effect creates a sense of depth and layering, making it visually engaging while maintaining compact space usage.

## When to Use
- For showcasing multiple items in a compact, interactive way
- When space is limited but multiple items need display
- In product showcases with multiple options
- For feature highlights with interactive exploration
- When you want an engaging, interactive presentation element
- For presentations that benefit from 3D visual effects

## Configuration Options
- **Items**: Array of cards with icons, titles, subtitles, and colors (required)
- **Card width**: Adjustable width for cards in pixels (defaults to 160px)
- **Card height**: Adjustable height for cards in pixels (defaults to 100px)
- **3D perspective**: Built-in perspective transforms for depth
- **Stack rotation**: Clicking cycles through cards with smooth animations
- **Depth effects**: Progressive scaling, opacity, and offset for stacked cards

## Works Well With
- IconBadge for card icons
- SlideText for card descriptions
- TitleBar for slide headers
- CTAButton for action prompts
- IconTitleCard concepts (similar card-based content)
