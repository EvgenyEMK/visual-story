/**
 * Voice, TTS, sync, and multi-language types for VisualStory.
 *
 * @source docs/modules/voice-sync/text-to-speech.md
 * @source docs/modules/voice-sync/audio-timeline-sync.md
 * @source docs/modules/voice-sync/multi-language.md
 */

// ---------------------------------------------------------------------------
// Voice Settings (project-level)
// ---------------------------------------------------------------------------

/**
 * Project-level voice configuration.
 * @source docs/product-summary/MVP-architecture.md — Data Models (Core)
 */
export interface VoiceSettings {
  /** ElevenLabs voice ID. */
  voiceId: string;
  /** URL of the generated audio file in R2. */
  audioUrl?: string;
  /** Timestamp → slide/element sync mapping. */
  syncPoints: SyncPoint[];
}

/**
 * Per-slide voice configuration.
 * @source docs/modules/voice-sync/audio-timeline-sync.md — Data Model
 */
export interface SlideVoiceConfig {
  slideId: string;
  /** URL of the audio segment for this slide. */
  audioUrl?: string;
  /** Whether audio has been generated for this slide. */
  hasAudio: boolean;
  /** Duration of the audio segment in seconds. */
  audioDuration?: number;
}

/**
 * Full voice configuration combining project + per-slide settings.
 * @source docs/modules/voice-sync/audio-timeline-sync.md — Data Model
 */
export interface VoiceConfig {
  /** Selected voice ID (ElevenLabs). */
  voiceId: string;
  /** Per-slide audio configurations. */
  slides: SlideVoiceConfig[];
  /** Combined full-project audio URL. */
  fullAudioUrl?: string;
  /** Total audio duration in seconds. */
  totalDuration?: number;
}

// ---------------------------------------------------------------------------
// TTS — Request / Response
// ---------------------------------------------------------------------------

/**
 * Request payload for generating TTS via ElevenLabs.
 * @source docs/modules/voice-sync/text-to-speech.md — ElevenLabs Integration
 */
export interface TTSRequest {
  /** Text to synthesise. */
  text: string;
  /** ElevenLabs voice ID. */
  voiceId: string;
  /** Optional model override. */
  modelId?: string;
}

/**
 * Response from TTS generation.
 * @source docs/modules/voice-sync/text-to-speech.md — ElevenLabs Integration
 */
export interface TTSResponse {
  /** R2 URL where the audio file was uploaded. */
  audioUrl: string;
  /** Duration of the generated audio in seconds. */
  duration: number;
  /** Word-level timestamps for sync. */
  wordTimestamps: WordTimestamp[];
}

/**
 * A single word's timing data returned by ElevenLabs.
 * @source docs/modules/voice-sync/text-to-speech.md
 */
export interface WordTimestamp {
  word: string;
  /** Start time in seconds. */
  start: number;
  /** End time in seconds. */
  end: number;
}

// ---------------------------------------------------------------------------
// Voice Generation API
// ---------------------------------------------------------------------------

/**
 * Request to generate voice-over for a project.
 * @source docs/modules/voice-sync/text-to-speech.md — API Endpoint
 */
export interface GenerateVoiceRequest {
  projectId: string;
  voiceId: string;
  /** If provided, regenerate only for these slide IDs. */
  slideIds?: string[];
}

/**
 * Response from voice generation.
 * @source docs/modules/voice-sync/text-to-speech.md — API Endpoint
 */
export interface GenerateVoiceResponse {
  /** Combined audio URL for the full project. */
  audioUrl: string;
  /** Total duration in seconds. */
  totalDuration: number;
  /** Per-slide audio details. */
  slides: {
    slideId: string;
    audioUrl: string;
    duration: number;
    wordTimestamps: WordTimestamp[];
  }[];
}

// ---------------------------------------------------------------------------
// Audio-Timeline Sync
// ---------------------------------------------------------------------------

/**
 * A sync point mapping a timestamp to a slide element.
 * @source docs/modules/voice-sync/audio-timeline-sync.md — Core Sync Logic
 */
export interface SyncPoint {
  /** ID of the target element. */
  elementId: string;
  /** ID of the slide containing the element. */
  slideId: string;
  /** Timestamp in seconds when the element should appear. */
  timestamp: number;
  /** Duration of the element's animation in seconds. */
  duration: number;
  /** The word or phrase that triggers this sync point. */
  triggerWord?: string;
}

/**
 * Aggregated sync data for a single slide.
 * @source docs/modules/voice-sync/audio-timeline-sync.md — Core Sync Logic
 */
export interface SlideSync {
  slideId: string;
  /** When this slide starts in the overall timeline (seconds). */
  startTime: number;
  /** When this slide ends (seconds). */
  endTime: number;
  /** Sync points for individual elements within this slide. */
  elementSyncPoints: SyncPoint[];
}

/**
 * Manual adjustment to a sync point made by the user.
 * @source docs/modules/voice-sync/audio-timeline-sync.md — Data Model
 */
export interface SyncAdjustment {
  /** The sync point being adjusted. */
  elementId: string;
  slideId: string;
  /** New timestamp after adjustment (seconds). */
  adjustedTimestamp: number;
  /** Whether to keep this manual override when re-syncing. */
  locked: boolean;
}

// ---------------------------------------------------------------------------
// Voice Options (for UI selectors)
// ---------------------------------------------------------------------------

/**
 * A selectable voice option displayed in the voice picker.
 * @source docs/modules/voice-sync/text-to-speech.md — Voice Options (MVP)
 */
export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  tone: string;
  bestFor: string;
  /** URL to a short sample audio clip. */
  sampleUrl?: string;
}

// ---------------------------------------------------------------------------
// Phase 2 — Multi-Language
// ---------------------------------------------------------------------------

/**
 * Request payload for translating a script to another language.
 * @source docs/modules/voice-sync/multi-language.md — Translation Pipeline
 */
// Phase 2
export interface TranslationRequest {
  projectId: string;
  /** BCP-47 language code (e.g. "es", "fr"). */
  targetLanguage: string;
  /** Optional: specific slide IDs to translate. */
  slideIds?: string[];
}

/**
 * A complete language version of a project.
 * @source docs/modules/voice-sync/multi-language.md — Multi-Language Data Model
 */
// Phase 2
export interface LanguageVersion {
  /** BCP-47 language code. */
  language: string;
  /** Display name (e.g. "Spanish"). */
  displayName: string;
  /** Translated content per slide. */
  slides: {
    slideId: string;
    translatedContent: string;
    audioUrl?: string;
    syncPoints?: SyncPoint[];
  }[];
  /** Whether a human has reviewed the translation. */
  reviewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
