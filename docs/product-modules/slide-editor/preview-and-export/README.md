# Preview and Export

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `ToDo`
> **MVP:** Yes

## Purpose

Preview and Export covers how users view the finished presentation and produce shareable outputs. This includes launching a full-screen preview, rendering to MP4 video via Remotion, generating shareable web links, and copying embed codes. These features represent the final steps of the authoring workflow.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Top Bar** | **Primary** | Preview button, Export button, Share button |
| **Canvas** | — | Full-screen preview takes over the viewport |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| PE-F01 | [Full-Screen Preview](#pe-f01-full-screen-preview) | Launch presentation in full-screen preview mode | Yes | `ToDo` |
| PE-F02 | [Video Export (MP4)](#pe-f02-video-export-mp4) | Render presentation as MP4 video via Remotion | Yes | `ToDo` |
| PE-F03 | [Web Link Sharing](#pe-f03-web-link-sharing) | Generate a shareable web player URL | Yes | `ToDo` |
| PE-F04 | [Embed Code](#pe-f04-embed-code) | Generate an embeddable iframe code | No | `ToDo` |
| PE-F05 | [Export Settings](#pe-f05-export-settings) | Configure resolution, quality, and watermark for exports | No | `ToDo` |

---

## User Stories

### PE-F01: Full-Screen Preview

#### US-PE-001: Launch Full-Screen Preview — `ToDo`
**As a** business user,
**I want to** preview my presentation in full-screen mode,
**so that** I can see exactly how it will look to my audience.

**Acceptance Criteria:**
- [ ] "Preview" button in the top bar launches full-screen mode
- [ ] Presentation starts from the current slide
- [ ] Click or arrow keys advance through slides and animation steps
- [ ] Escape exits preview and returns to the editor
- [ ] Voice-over plays if generated

#### US-PE-002: Preview from Beginning — `ToDo`
**As a** business user,
**I want to** preview the entire presentation from the first slide,
**so that** I can experience the full flow as an audience member.

**Acceptance Criteria:**
- [ ] "Preview from Start" option (e.g., Shift+Preview button)
- [ ] Starts from slide 1 regardless of current editor position
- [ ] All slide transitions play between slides

---

### PE-F02: Video Export (MP4)

#### US-PE-003: Export as MP4 Video — `ToDo`
**As a** business user,
**I want to** export my presentation as an MP4 video,
**so that** I can share it on platforms that require video files.

**Acceptance Criteria:**
- [ ] "Export" button opens export dialog
- [ ] "Video (MP4)" option available
- [ ] Resolution: 1080p (1920x1080)
- [ ] Progress indicator during rendering (30-60 seconds)
- [ ] Download link provided when rendering completes
- [ ] Voice-over audio included in the video

#### US-PE-004: Free Tier Export Limitations — `ToDo`
**As a** free-tier user,
**I want to** understand the limitations of my free export,
**so that** I can decide whether to upgrade.

**Acceptance Criteria:**
- [ ] Free-tier exports include a VisualStory watermark
- [ ] Clear upgrade prompt shown before export begins
- [ ] Watermark-free preview available for comparison
- [ ] Export count tracked against free-tier limits

---

### PE-F03: Web Link Sharing

#### US-PE-005: Generate Shareable Web Link — `ToDo`
**As a** business user,
**I want to** generate a shareable URL for my presentation,
**so that** colleagues can view it in their browser.

**Acceptance Criteria:**
- [ ] "Share" or "Web Link" option in the export dialog or top bar
- [ ] Generates a URL (e.g., `vstory.app/p/{id}`)
- [ ] Link is copyable with one click
- [ ] Copy action shows a success toast notification

#### US-PE-006: Link Access Settings — `ToDo`
**As a** business user,
**I want to** control who can access my shared link,
**so that** I can protect confidential content.

**Acceptance Criteria:**
- [ ] Access options: public, unlisted (anyone with link), password-protected
- [ ] Default: unlisted
- [ ] Password-protected links prompt viewer for password before showing content

---

### PE-F04: Embed Code

#### US-PE-007: Generate Embed Code — `ToDo`
**As a** business user,
**I want to** get an iframe embed code for my presentation,
**so that** I can embed it in a website, blog, or LMS.

**Acceptance Criteria:**
- [ ] "Embed" option in the sharing/export dialog
- [ ] Generates an iframe HTML snippet
- [ ] Customizable embed dimensions
- [ ] Copy-to-clipboard button

---

### PE-F05: Export Settings

#### US-PE-008: Configure Export Quality — `ToDo`
**As a** business user,
**I want to** choose the resolution and quality of my video export,
**so that** I can optimize for file size vs. quality.

**Acceptance Criteria:**
- [ ] Resolution options: 720p, 1080p (default), 4K (Pro tier)
- [ ] Quality slider: draft (fast render) vs. high quality
- [ ] Estimated file size and render time displayed

---

## Technical References

- Previous module docs (absorbed into this cluster):
  - `export/video-export.md`
  - `export/embed-sharing.md`
- [slide-player/](../../slide-player/) — Web player experience for shared links
- Remotion Lambda — server-side video rendering

## Dependencies

- Remotion (video rendering engine, lazy-loaded)
- Cloudflare R2 (rendered video storage)
- Supabase (shareable link metadata, access control)
- Stripe (free-tier limits, watermark enforcement)
- Narration and voice (audio track for video export)
