# Slide Player

> **Status:** `planned`
> **MVP:** Yes

## Overview

The Slide Player is the interactive, web-based presentation viewer. Unlike video exports, the player preserves interactivity — viewers can click to advance slides, pause, and (in future) drill into expandable card details. Presentations are accessed via shareable URLs.

## Features

| Feature | File | Summary |
|---------|------|---------|
| Web Player | [web-player.md](./web-player.md) | Browser-based viewer with click-to-advance navigation, playback controls, and responsive layout |

## Future Features (Phase 2+)

- **Interactive drill-down** — Click expandable cards to reveal detail panels during playback
- **Presenter mode** — Speaker notes view with timer and slide preview
- **Audience analytics** — Track views, time spent per slide, and engagement metrics
- **Offline playback** — Service worker-based offline support for shared presentations

## Related Modules

- [slide-editor/export/](../slide-editor/export/) — Export workflow that generates player links and video files
