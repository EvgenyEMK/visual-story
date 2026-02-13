# StatDashboard

## What It Is
A grid layout designed for displaying multiple KPI metrics in a dashboard format. Arranges StatCard components in a responsive grid with configurable columns and staggered entrance animations.

## Visual Appearance
The layout displays a grid of stat cards, each showing a metric value with optional label, delta indicator, and progress bar. Cards are arranged in columns (typically 2-3 columns) with consistent spacing. Each card uses an accent color for visual distinction. When entrance animations are enabled, cards appear with staggered delays, creating a cascading reveal effect. The grid automatically adjusts column count based on the number of stats, maintaining optimal visual balance.

## When to Use
- For performance dashboards and KPI overviews
- When displaying multiple metrics in a single view
- In executive summaries and reports
- For financial dashboards and analytics displays
- When you need organized metric presentation
- In presentations that require comprehensive data views

## Configuration Options
- **Stats**: Array of metric data with values, labels, deltas, and progress (required)
- **Columns**: Optional fixed column count (defaults to auto-calculated, max 3)
- **Gap**: Adjustable spacing between cards in pixels
- **Staggered entrance**: Cards animate in with staggered delays for cascading effect
- **Entrance animation**: Optional animation effects when cards appear
- **Card styling**: Each card uses its own accent color for visual distinction

## Works Well With
- StatCard components (used internally)
- TitleBar for dashboard slide headers
- StatusLegend for explaining metric color schemes
- SlideText for dashboard context and notes
- MetricDisplay when used standalone
- ProgressBar when used independently
