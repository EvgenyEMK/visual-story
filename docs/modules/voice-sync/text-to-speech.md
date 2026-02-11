# Feature: Text-to-Speech

## Module
Voice Sync

## Overview
Text-to-Speech (TTS) converts the script text into natural-sounding voice-over audio using ElevenLabs API. This enables automatic narration of presentations without requiring users to record their own voice.

## User Stories

### US-TTS-001: Generate Voice-Over from Script
**As a** content creator  
**I want to** generate voice-over audio from my script  
**So that** my presentation has professional narration

**Acceptance Criteria:**
- [ ] One-click voice generation
- [ ] Progress indicator during generation
- [ ] Audio plays in preview immediately after generation
- [ ] Generated audio saved to project

### US-TTS-002: Select Voice
**As a** content creator  
**I want to** choose from different voice options  
**So that** I can match the voice to my brand/content

**Acceptance Criteria:**
- [ ] Voice selector dropdown
- [ ] Preview voice samples before selection
- [ ] 5 voice options minimum (varied gender, tone)
- [ ] Voice selection persists per project

### US-TTS-003: Regenerate Partial Audio
**As a** content creator  
**I want to** regenerate voice for specific slides  
**So that** I don't have to regenerate the entire presentation

**Acceptance Criteria:**
- [ ] Regenerate button per slide
- [ ] New audio seamlessly replaces old
- [ ] Maintains timing sync with other slides
- [ ] Shows which slides have generated audio

## Voice Options (MVP)

| Voice ID | Name | Gender | Tone | Best For |
|----------|------|--------|------|----------|
| `adam` | Adam | Male | Professional, calm | Business, educational |
| `rachel` | Rachel | Female | Warm, friendly | Marketing, storytelling |
| `antoni` | Antoni | Male | Energetic, young | Promotional, tech |
| `bella` | Bella | Female | Clear, authoritative | Training, corporate |
| `josh` | Josh | Male | Conversational | Casual, tutorials |

## Technical Specifications

### ElevenLabs Integration

> **Implementation**: See `src/lib/tts/elevenlabs.ts` for the ElevenLabs client setup and `generateSpeech` function (TTS with word timestamps, R2 upload)

### API Endpoint

> **Implementation**: See `src/types/voice.ts` for GenerateVoiceRequest and GenerateVoiceResponse interfaces, and the voice generation handler logic (per-slide TTS, database persistence)

### Voice Preview Component

> **Implementation**: See `src/components/` for the VoiceSelector component (voice list with preview playback) — TODO

## Cost Considerations

| Plan | Characters/month | Cost | Notes |
|------|------------------|------|-------|
| Free | 10,000 | $0 | Development only |
| Starter | 30,000 | $5/mo | ~30 min audio |
| Creator | 100,000 | $22/mo | ~100 min audio |
| Pro | 500,000 | $99/mo | ~500 min audio |

**Estimation**: Average project = 1,500 characters = ~1.5 min audio

**Cost per video**: ~$0.22 on Creator plan

## Dependencies
- ElevenLabs API
- Cloudflare R2 for audio storage
- Audio Timeline Sync for synchronization

## Related Features
- [Audio Timeline Sync](./audio-timeline-sync.md)
- [Multi-Language](./multi-language.md)
