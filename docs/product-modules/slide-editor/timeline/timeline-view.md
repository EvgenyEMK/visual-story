# Feature: Timeline View

## Module
Story Editor

## Overview
The timeline view provides a horizontal overview of all slides and their relative timing, allowing users to navigate, reorder, and understand the flow of their presentation.

## User Stories

### US-TV-001: View All Slides in Timeline
**As a** content creator  
**I want to** see all my slides in a horizontal timeline  
**So that** I can understand the overall flow of my presentation

**Acceptance Criteria:**
- [ ] Slides displayed as thumbnails in sequence
- [ ] Current slide highlighted
- [ ] Slide duration shown below each thumbnail
- [ ] Total presentation duration displayed

### US-TV-002: Navigate Between Slides
**As a** content creator  
**I want to** click on a slide thumbnail to navigate to it  
**So that** I can quickly jump to any slide

**Acceptance Criteria:**
- [ ] Single click selects and navigates to slide
- [ ] Keyboard shortcuts (← →) for prev/next
- [ ] Scroll timeline if many slides

### US-TV-003: Reorder Slides
**As a** content creator  
**I want to** drag slides to reorder them  
**So that** I can change the presentation structure

**Acceptance Criteria:**
- [ ] Drag and drop to reorder
- [ ] Visual indicator of drop position
- [ ] Undo support for reordering
- [ ] Order updates in database

### US-TV-004: Adjust Slide Duration
**As a** content creator  
**I want to** change how long a slide plays  
**So that** I can control pacing

**Acceptance Criteria:**
- [ ] Click to edit duration value
- [ ] Drag edge of slide block to resize
- [ ] Minimum 1 second, maximum 60 seconds
- [ ] Auto-adjust to voice-over length option

### US-TV-005: Add/Delete Slides
**As a** content creator  
**I want to** add new slides or delete existing ones  
**So that** I can modify my presentation content

**Acceptance Criteria:**
- [ ] "+" button to add slide after current
- [ ] Right-click context menu with delete option
- [ ] Confirm dialog before delete
- [ ] Duplicate slide option

## UI Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Timeline                                          Total: 2:34  [+ Add]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐       │
│  │  1  │   │  2  │   │ ●3● │   │  4  │   │  5  │   │  6  │   │  7  │ ...   │
│  │ 🖼️  │   │ 🖼️  │   │ 🖼️  │   │ 🖼️  │   │ 🖼️  │   │ 🖼️  │   │ 🖼️  │       │
│  └─────┘   └─────┘   └─────┘   └─────┘   └─────┘   └─────┘   └─────┘       │
│   0:05      0:08      0:12      0:06      0:10      0:08      0:05         │
│                         ▲                                                   │
│                      current                                                │
│                                                                             │
│  ◀ ════════════════════●════════════════════════════════════════════ ▶     │
│                      1:02 / 2:34                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Component: `TimelineView`

> **Implementation**: See `src/components/editor/timeline-view.tsx` for the TimelineView component (TimelineViewProps) with `@dnd-kit/core` drag-and-drop support

### Thumbnail Generation

> **Implementation**: See `src/services/presentations/thumbnail.ts` for server-side thumbnail generation using Remotion's `renderStill`

## Dependencies
- @dnd-kit/core for drag-drop
- Remotion for thumbnail generation
- Slide Canvas for preview

## Related Features
- [Slide Canvas](./slide-canvas.md)
- [Audio Timeline Sync](../voice-sync/audio-timeline-sync.md)
