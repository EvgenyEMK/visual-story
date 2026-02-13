# Sidebar + Detail

## Overview
A navigation-focused layout with a fixed-width sidebar on the left containing navigation items, and a main detail area on the right that dynamically displays content based on the selected sidebar item. This pattern creates a drill-down experience where users can explore multiple sections or topics from a single slide. Ideal for content with 3-8 distinct sections that benefit from quick navigation. Can be used with or without a slide header.

## Visual Structure
```
┌──────────┬──────────────────────────┐
│          │                          │
│ SIDEBAR  │      DETAIL AREA         │
│ (Fixed)  │      (Main Content)      │
│          │                          │
│ • Item 1 │   Content for selected   │
│ • Item 2 │   item appears here      │
│ • Item 3 │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

## When to Use
- Slides with multiple sections (3-8 items) that need quick navigation
- Drill-down content where users explore related topics
- Product feature tours or capability showcases
- Multi-part explanations or tutorials
- Content organized into distinct categories or chapters
- Slides where users need to switch between related views quickly

## Content Recommendations
- **Sidebar**:
  - Navigation list with 3-8 items
  - Category labels or section names
  - Feature names or capability titles
  - Chapter or topic identifiers
  - Should be concise labels (1-3 words each)
- **Detail Area**:
  - Content specific to the selected sidebar item
  - Detailed descriptions, images, or charts
  - Feature explanations or specifications
  - Step-by-step instructions or processes
  - Interactive components or embedded media

## Related Templates
- [Two Columns (25/75)](two-column-25-75.md) - Similar structure but static content
- [Two Columns (33/67)](two-column-33-67.md) - For a wider left column without navigation
- [Content](content.md) - When navigation isn't needed
- [Custom](custom.md) - For more complex navigation patterns
