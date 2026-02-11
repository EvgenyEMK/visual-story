# Feature: Slide Canvas

## Module
Story Editor

## Overview
The slide canvas is the main visual workspace where users view and edit individual slides. It displays slide elements with their animations and allows direct manipulation.

## User Stories

### US-SC-001: View Slide Preview
**As a** content creator  
**I want to** see a visual preview of my slide  
**So that** I can understand how it will look in the final output

**Acceptance Criteria:**
- [ ] Canvas displays slide at 16:9 aspect ratio
- [ ] Elements rendered with styling applied
- [ ] Zoom controls (fit, 50%, 100%, 150%)
- [ ] Grid/guides toggle for alignment

### US-SC-002: Select and Edit Elements
**As a** content creator  
**I want to** click on elements to select and edit them  
**So that** I can customize individual elements

**Acceptance Criteria:**
- [ ] Click to select element
- [ ] Selection shows bounding box with handles
- [ ] Double-click text to edit inline
- [ ] Multi-select with Shift+click

### US-SC-003: Play Slide Animation Preview
**As a** content creator  
**I want to** preview the animation for the current slide  
**So that** I can see how elements animate

**Acceptance Criteria:**
- [ ] Play button triggers animation preview
- [ ] Animation plays in real-time
- [ ] Scrubber allows seeking through animation
- [ ] Loop option for repeated preview

## UI Components

```
┌─────────────────────────────────────────────────────────────┐
│  [◀ Prev] Slide 3 of 12 [Next ▶]  │ [Zoom: 100% ▼] [Grid]  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │              ┌─────────────────┐                      │  │
│  │              │   Title Text    │ ← selected           │  │
│  │              └─────────────────┘                      │  │
│  │                                                       │  │
│  │    [Icon]        [Body text goes here]                │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  [▶ Play] ────────────●─────────────── 0:03 / 0:05 [🔁]    │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Component: `SlideCanvas`

> **Implementation**: See `src/components/editor/slide-canvas.tsx` for the SlideCanvas component (SlideCanvasProps) and its Remotion `<Player>` integration for animation preview

## Dependencies
- Remotion Player
- Element Properties panel
- Timeline View (for multi-slide context)

## Related Features
- [Element Properties](./element-properties.md)
- [Timeline View](./timeline-view.md)
- [Animation Templates](../animation-engine/animation-templates.md)
