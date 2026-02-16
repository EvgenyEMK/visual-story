# Feature: Web Player

## Module
Export & Publish

## Overview
The Web Player provides an interactive, shareable web-based presentation viewer. Unlike video exports, the web player allows click-to-advance navigation and maintains the interactive qualities of the presentation.

## User Stories

### US-WP-001: Generate Shareable Link
**As a** content creator  
**I want to** get a shareable link to my presentation  
**So that** viewers can watch it in their browser

**Acceptance Criteria:**
- [ ] One-click to generate link
- [ ] Link format: visualflow.app/play/{id}
- [ ] Link works without login
- [ ] Can regenerate/invalidate link

### US-WP-002: View Presentation in Browser
**As a** viewer  
**I want to** watch the presentation in my browser  
**So that** I don't need to download anything

**Acceptance Criteria:**
- [ ] Presentation loads quickly
- [ ] Animations play smoothly
- [ ] Voice-over plays automatically (with user interaction)
- [ ] Works on desktop and mobile

### US-WP-003: Interactive Navigation
**As a** viewer  
**I want to** control playback  
**So that** I can watch at my own pace

**Acceptance Criteria:**
- [ ] Play/pause button
- [ ] Previous/next slide buttons
- [ ] Progress bar with scrubbing
- [ ] Keyboard shortcuts (space, arrows)

### US-WP-004: Auto-Play Mode
**As a** viewer  
**I want to** watch in auto-play mode  
**So that** I can sit back and watch like a video

**Acceptance Criteria:**
- [ ] Auto-advance slides at set timing
- [ ] Voice-over synced with auto-play
- [ ] Toggle between manual and auto mode
- [ ] Full-screen support

### US-WP-005: Embed in External Sites
**As a** content creator  
**I want to** embed my presentation on my website  
**So that** visitors can watch without leaving

**Acceptance Criteria:**
- [ ] Embed code provided (iframe)
- [ ] Responsive embed sizing
- [ ] Privacy options (unlisted vs public)
- [ ] Custom player dimensions

## Technical Specifications

### Player Page Architecture

> **Implementation**: See `src/app/[locale]/play/[shareId]/page.tsx` for the PlayerPage server component that fetches the public project and renders the WebPlayer

### Web Player Component

> **Implementation**: See `src/components/player/web-player.tsx` for the WebPlayer component (playback state, auto-advance logic, audio sync, slide rendering)

### Player Controls Component

> **Implementation**: See `src/components/player/player-controls.tsx` for the PlayerControls component (progress bar, play/pause, prev/next, auto-mode toggle, fullscreen, auto-hide behavior)

### Embed Code Generation

> **Implementation**: See `src/app/api/presentations/[id]/embed/route.ts` for the embed code generation endpoint (TODO)

## UI Components

### Share Dialog

```
┌─────────────────────────────────────────────────────────────┐
│  Share Presentation                                    [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📎 Share Link                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ https://visualflow.app/play/abc123xyz               │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Copy Link]                                                │
│                                                             │
│  ─────────────────────────────────────                      │
│                                                             │
│  📋 Embed Code                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ <iframe src="https://visualflow.app/embed/abc123"   │  │
│  │   width="800" height="450" frameborder="0"           │  │
│  │   allow="autoplay; fullscreen" allowfullscreen>      │  │
│  │ </iframe>                                             │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Copy Embed Code]                                          │
│                                                             │
│  ─────────────────────────────────────                      │
│                                                             │
│  Visibility: ○ Public  ● Unlisted (link only)              │
│                                                             │
│  [Regenerate Link]  [Disable Sharing]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Mobile Responsiveness

> **Implementation**: See `src/components/player/mobile-player-controls.tsx` for the MobilePlayerControls component (tap to show/hide, swipe navigation via react-swipeable)

## Dependencies
- Remotion Player for slide rendering
- react-swipeable for mobile gestures
- Screenfull.js for fullscreen API

## Related Features
- [Video Export](./video-export.md)
- [Embed & Sharing](./embed-sharing.md)
