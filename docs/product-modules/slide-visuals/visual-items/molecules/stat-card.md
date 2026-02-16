# StatCard

## What It Is
A card component designed for displaying key performance indicators and metrics. Combines a metric value display with optional label, delta indicator, and progress bar in a unified card format.

## Visual Appearance
The component displays a rounded card with a semi-transparent background and subtle border tinted with the accent color. Inside, a MetricDisplay component shows the main value, optional label, and delta indicator. Below the metric, an optional ProgressBar can be displayed to show progress toward a goal. The card uses consistent spacing and typography, with the accent color providing visual cohesion between the metric and progress bar.

## When to Use
- In KPI dashboards and performance reports
- For displaying multiple metrics in a grid layout
- When you need to combine metrics with progress indicators
- In stat dashboards and metric overviews
- For financial data, user metrics, or growth statistics
- When showing performance data with visual progress context

## Configuration Options
- **Value**: The main metric value to display (e.g., "$2.4M", "1,247") (required)
- **Label**: Optional text label displayed above the value
- **Delta**: Optional change indicator (e.g., "+27% YoY")
- **Delta direction**: Up (positive), down (negative), or neutral
- **Accent color**: Custom color for metric value, border, and progress bar
- **Progress**: Optional progress bar value (0-100) displayed below the metric
- **Entrance animation**: Optional animation effects when the card appears

## Works Well With
- StatDashboard for dashboard grid layouts
- MetricDisplay when used standalone (without card wrapper)
- ProgressBar when used independently
- TitleBar for dashboard slide headers
- GridOfCards when mixing stats with features
