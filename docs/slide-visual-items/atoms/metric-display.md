# MetricDisplay

## What It Is
A large numeric value display component designed for showcasing key performance indicators, statistics, and metrics. Displays prominent numbers with optional labels and change indicators.

## Visual Appearance
The component features a large, bold numeric value displayed in a monospace-like font for consistent digit alignment. The value appears in a customizable accent color, making it stand out prominently. An optional label appears above the value in small uppercase text with wide letter spacing. When a delta (change indicator) is present, it appears below the value with a directional arrow (up/down) and color coding—green for positive changes, red for negative, neutral gray for no change. The entire component can be aligned left, center, or right.

## When to Use
- In KPI dashboards and performance reports
- For displaying key statistics and metrics
- When showing financial data, user counts, or growth percentages
- In stat cards and metric overviews
- For highlighting important numerical achievements
- When you need to show trends with delta indicators

## Configuration Options
- **Value**: The main numeric value to display (e.g., "$2.4M", "1,247", "+34.7%") (required)
- **Label**: Optional text label displayed above the value
- **Delta**: Optional change indicator text (e.g., "+27% YoY", "-3.2%")
- **Delta direction**: Up (positive/green), down (negative/red), or neutral (gray)
- **Accent color**: Custom color for the main value
- **Size presets**: Small, medium, large, or extra-large sizing
- **Alignment**: Left, center, or right alignment
- **Entrance animation**: Optional animation effects when the metric appears

## Works Well With
- StatCard for complete metric card displays
- StatDashboard for dashboard layouts
- ProgressBar when showing progress alongside metrics
- TitleBar for header metric displays
- GridOfCards when metrics are part of feature showcases
