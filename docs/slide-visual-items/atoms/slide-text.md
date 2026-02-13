# SlideText

## What It Is
A flexible text paragraph component for displaying body text, descriptions, captions, and other written content on slides. Supports various typographic styles and formatting options.

## Visual Appearance
The component renders text in a clean, readable sans-serif font by default, with adjustable size presets. Text appears in white with controlled opacity for optimal readability against dark backgrounds. When serif mode is enabled, the text switches to a serif font family, ideal for quotes and formal content. The text can be styled with different weights (normal, medium, semibold, bold), italic emphasis, and custom colors. Maximum width constraints help maintain optimal reading line length.

## When to Use
- For body text paragraphs and descriptions
- As captions below images or charts
- For quotes (using serif font option)
- When you need consistent text styling across multiple text elements
- For explanatory text that accompanies visual elements
- In lists or structured content where individual text items need formatting

## Configuration Options
- **Text content**: The text string to display (required)
- **Size presets**: Small, medium, large, or extra-large font sizes
- **Alignment**: Left, center, or right text alignment
- **Font weight**: Normal, medium, semibold, or bold
- **Italic**: Toggle italic styling for emphasis
- **Serif font**: Switch to serif typography (ideal for quotes)
- **Maximum width**: Constrain text width for optimal reading line length
- **Color**: Custom text color (defaults to white with transparency)
- **Entrance animation**: Optional animation effects when the text appears

## Works Well With
- SlideTitle for complete text content sections
- SlideImage when providing captions or descriptions
- FeatureCard and StatCard for card descriptions
- QuoteBlock for styled quotations
- ItemsList for list item text content
