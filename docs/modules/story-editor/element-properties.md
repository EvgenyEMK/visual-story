# Feature: Element Properties

## Module
Story Editor

## Overview
The element properties panel allows users to configure styling, position, and animation settings for selected slide elements.

## User Stories

### US-EP-001: Edit Element Text Content
**As a** content creator  
**I want to** edit the text content of an element  
**So that** I can customize what appears on screen

**Acceptance Criteria:**
- [ ] Text input field for content
- [ ] Changes reflect immediately in canvas
- [ ] Supports basic formatting (bold, italic)
- [ ] Character limit warning

### US-EP-002: Adjust Element Position
**As a** content creator  
**I want to** position elements precisely  
**So that** I can create balanced layouts

**Acceptance Criteria:**
- [ ] X/Y coordinate inputs
- [ ] Drag to reposition on canvas
- [ ] Snap to grid option
- [ ] Alignment buttons (center, edges)

### US-EP-003: Configure Element Animation
**As a** content creator  
**I want to** select animation effects for elements  
**So that** I can control how they appear/move

**Acceptance Criteria:**
- [ ] Animation type dropdown (fade, slide, scale, etc.)
- [ ] Duration slider (0.3s - 3s)
- [ ] Delay input (relative to slide start)
- [ ] Easing function selector
- [ ] Preview animation button

### US-EP-004: Style Element Appearance
**As a** content creator  
**I want to** change element colors and fonts  
**So that** I can match my brand

**Acceptance Criteria:**
- [ ] Font family selector
- [ ] Font size slider
- [ ] Color picker for text/background
- [ ] Opacity slider
- [ ] Border/shadow options

## UI Components

```
┌─────────────────────────────┐
│  Element Properties         │
├─────────────────────────────┤
│  Type: Text                 │
│                             │
│  Content                    │
│  ┌───────────────────────┐  │
│  │ Your title here...    │  │
│  └───────────────────────┘  │
│                             │
│  Position                   │
│  X: [150] px  Y: [80] px    │
│  W: [400] px  H: [auto]     │
│                             │
│  Style                      │
│  Font: [Inter ▼] [24px]     │
│  Color: [■ #333] [Aa]       │
│  Align: [L] [C] [R]         │
│                             │
│  Animation                  │
│  Type: [Fade In ▼]          │
│  Duration: ───●─── 0.5s     │
│  Delay:    ─●───── 0.2s     │
│  Easing: [Ease Out ▼]       │
│                             │
│  [▶ Preview] [Reset]        │
└─────────────────────────────┘
```

## Technical Specifications

### Component: `ElementPropertiesPanel`

> **Implementation**: See `src/types/slide.ts` for SlideElement, AnimationConfig, AnimationType, and EasingType interfaces, and `src/components/editor/element-properties-panel.tsx` for the ElementPropertiesPanel component (ElementPropertiesPanelProps)

## Dependencies
- Color picker component
- Font selector with preview
- Animation preview system

## Related Features
- [Slide Canvas](./slide-canvas.md)
- [Auto Animation](../animation-engine/auto-animation.md)
