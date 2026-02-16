# Narration and Voice

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `ToDo`
> **MVP:** Yes

## Purpose

Narration and Voice covers everything related to the spoken dimension of a presentation — writing speaker notes, generating text-to-speech voice-over, selecting voices, and synchronizing audio with slide animations. This is a core differentiator for VisualStory, enabling users to produce narrated presentations without recording their own voice.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Bottom Panel** | **Primary** | Speaker notes editor, voice-over controls, audio preview |
| **Canvas** | — | Plays synchronized animation during voice-over preview |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| NV-F01 | [Speaker Notes](#nv-f01-speaker-notes) | Per-slide text area for presenter notes and TTS source text | Yes | `ToDo` |
| NV-F02 | [Voice Selection](#nv-f02-voice-selection) | Choose a TTS voice from available options | Yes | `ToDo` |
| NV-F03 | [Voice-Over Generation](#nv-f03-voice-over-generation) | Generate TTS audio from speaker notes | Yes | `ToDo` |
| NV-F04 | [Audio-Animation Sync](#nv-f04-audio-animation-sync) | Synchronize generated voice-over with slide animation timing | Yes | `ToDo` |
| NV-F05 | [Voice-Over Preview](#nv-f05-voice-over-preview) | Play voice-over with synchronized animation on canvas | Yes | `ToDo` |
| NV-F06 | [Voice Upload](#nv-f06-voice-upload) | Upload custom voice recording instead of TTS | No | `ToDo` |
| NV-F07 | [Per-Scene Notes](#nv-f07-per-scene-notes) | Edit scene-level notes in addition to per-slide notes | No | `ToDo` |

---

## User Stories

### NV-F01: Speaker Notes

#### US-NV-001: Write Speaker Notes for Current Slide — `ToDo`
**As a** business user,
**I want to** write presenter notes for the current slide,
**so that** I have talking points for live presentations and source text for TTS.

**Acceptance Criteria:**
- [ ] Text area in the bottom panel shows notes for the current slide
- [ ] Notes auto-save on change (debounced)
- [ ] Basic formatting: bold, italic, bullet lists
- [ ] Notes persist when navigating between slides
- [ ] Word count displayed (used for TTS timing estimation)

#### US-NV-002: Script Input for Initial Content — `ToDo`
**As a** business user,
**I want to** paste or type a full script that the system distributes across slides,
**so that** I can populate speaker notes for all slides at once.

**Acceptance Criteria:**
- [ ] Script input area (separate from per-slide notes)
- [ ] Section markers (e.g., `---`) to indicate slide boundaries
- [ ] System distributes script text to speaker notes of corresponding slides
- [ ] Manual edits to individual slide notes take precedence

> **Cross-reference:** Script input feature absorbed from the previous `script-input/` module.

---

### NV-F02: Voice Selection

#### US-NV-003: Select Voice for TTS — `ToDo`
**As a** business user,
**I want to** choose a voice for text-to-speech generation,
**so that** I can select a voice that fits my presentation style.

**Acceptance Criteria:**
- [ ] Dropdown with 3-5 voice options (ElevenLabs)
- [ ] Preview button to hear a sample of each voice
- [ ] Selected voice applies to the entire presentation (default) or per-slide (override)
- [ ] Voice selection persists in project settings

---

### NV-F03: Voice-Over Generation

#### US-NV-004: Generate Voice-Over from Notes — `ToDo`
**As a** business user,
**I want to** generate a voice-over from my speaker notes,
**so that** the presentation can play with narration.

**Acceptance Criteria:**
- [ ] "Generate Voice" button in the bottom panel voice tab
- [ ] Progress indicator during generation (2-5 seconds per slide)
- [ ] Generated audio auto-associates with the current slide
- [ ] Regenerate button to re-generate if unsatisfied
- [ ] Batch generate option to process all slides at once

---

### NV-F04: Audio-Animation Sync

#### US-NV-005: Auto-Sync Voice-Over with Animation — `ToDo`
**As a** business user,
**I want** the system to automatically synchronize voice-over timing with slide animations,
**so that** visual reveals happen in time with the narration.

**Acceptance Criteria:**
- [ ] Word-level timestamps from TTS (ElevenLabs word-level sync)
- [ ] Animation step timing auto-adjusted to match voice-over pacing
- [ ] Sync markers shown in the animation step list
- [ ] Warning if voice-over duration mismatches configured animation duration

---

### NV-F05: Voice-Over Preview

#### US-NV-006: Preview Voice with Animation — `ToDo`
**As a** business user,
**I want to** play the voice-over synchronized with slide animation on the canvas,
**so that** I can verify the timing and feel.

**Acceptance Criteria:**
- [ ] Play button starts synchronized voice + animation preview
- [ ] Audio and animation play in sync on the canvas
- [ ] Pause/stop controls available
- [ ] Scrubber allows seeking through the preview

---

### NV-F06: Voice Upload

#### US-NV-007: Upload Custom Voice Recording — `ToDo`
**As a** business user,
**I want to** upload my own voice recording for a slide,
**so that** I can use my real voice instead of TTS.

**Acceptance Criteria:**
- [ ] Upload button accepts common audio formats (MP3, WAV, M4A)
- [ ] Uploaded audio replaces TTS for that slide
- [ ] System attempts to auto-sync animation to uploaded audio timing
- [ ] Option to manually adjust sync points

---

### NV-F07: Per-Scene Notes

#### US-NV-008: Edit Scene-Level Notes — `ToDo`
**As a** business user,
**I want to** write notes at the scene level in addition to per-slide notes,
**so that** I can manage high-level narrative sections.

**Acceptance Criteria:**
- [ ] Scene name displayed above the slide notes in the bottom panel
- [ ] Scene-level notes editable in a separate section
- [ ] Clear visual separation between scene notes and slide notes

---

## Technical References

- Previous module docs (absorbed into this cluster):
  - `voice-sync/` — TTS integration, multi-language, audio-timeline sync
  - `script-input/` — Script text entry and section markers
- ElevenLabs API — word-level timestamp sync

## Dependencies

- Animation and timing (voice sync adjusts animation step durations)
- Deck management (speaker notes are per-slide)
- Zustand `project-store` (speaker notes data)
- ElevenLabs API (TTS generation)
- Cloudflare R2 (audio file storage)
