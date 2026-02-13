# ProgressBar

## What It Is
A horizontal progress indicator that visually represents completion percentage or progress toward a goal. Displays a filled bar that animates from 0% to the target value.

## Visual Appearance
The component shows a horizontal bar with a semi-transparent background track. The filled portion uses a customizable accent color and animates smoothly from left to right when the component appears. An optional label can appear on the left side of the bar, and an optional percentage value can be displayed on the right. The bar height is adjustable, and the fill animation can be smooth or instant depending on animation settings.

## When to Use
- In dashboards showing completion status
- For data visualizations showing progress toward goals
- When displaying percentage-based metrics
- In stat cards that combine metrics with progress indicators
- For skill assessments or capability ratings
- When showing project milestones or task completion

## Configuration Options
- **Value**: Current progress value (0-100, or custom max range)
- **Maximum value**: Upper bound for the progress calculation (defaults to 100)
- **Color**: Custom color for the filled portion of the bar
- **Label**: Optional text label displayed on the left side
- **Show value**: Toggle to display percentage text on the right
- **Height**: Adjustable bar height in pixels
- **Entrance animation**: Optional animated fill effect when the bar appears

## Works Well With
- StatCard for cards that combine metrics with progress
- StatDashboard for dashboard progress views
- MetricDisplay when showing both value and progress
- ItemsList for task completion indicators
- FeatureCard when showing feature adoption or usage
