/**
 * Voice options and per-language voice configuration for VisualStory.
 *
 * @source docs/modules/voice-sync/text-to-speech.md — Voice Options (MVP)
 * @source docs/modules/voice-sync/multi-language.md — Voice Selection per Language
 */

import type { VoiceOption } from '@/types/voice';

// ---------------------------------------------------------------------------
// MVP Voice Options (ElevenLabs)
// ---------------------------------------------------------------------------

/**
 * Default voice options available in the MVP.
 * @source docs/modules/voice-sync/text-to-speech.md — Voice Options (MVP)
 */
export const VOICE_OPTIONS: readonly VoiceOption[] = [
  {
    id: 'adam',
    name: 'Adam',
    gender: 'male',
    tone: 'Professional, calm',
    bestFor: 'Business, educational',
  },
  {
    id: 'rachel',
    name: 'Rachel',
    gender: 'female',
    tone: 'Warm, friendly',
    bestFor: 'Marketing, storytelling',
  },
  {
    id: 'antoni',
    name: 'Antoni',
    gender: 'male',
    tone: 'Energetic, young',
    bestFor: 'Promotional, tech',
  },
  {
    id: 'bella',
    name: 'Bella',
    gender: 'female',
    tone: 'Clear, authoritative',
    bestFor: 'Training, corporate',
  },
  {
    id: 'josh',
    name: 'Josh',
    gender: 'male',
    tone: 'Conversational',
    bestFor: 'Casual, tutorials',
  },
] as const satisfies readonly VoiceOption[];

// ---------------------------------------------------------------------------
// Phase 2 — Per-Language Voice Mapping
// ---------------------------------------------------------------------------

/** A voice available for a specific language. */
export interface LanguageVoice {
  voiceId: string;
  name: string;
  gender: 'male' | 'female';
}

/**
 * Voice options keyed by BCP-47 language code.
 * @source docs/modules/voice-sync/multi-language.md — Voice Selection per Language
 */
// Phase 2
export const LANGUAGE_VOICES: Record<string, LanguageVoice[]> = {
  en: [
    { voiceId: 'adam', name: 'Adam', gender: 'male' },
    { voiceId: 'rachel', name: 'Rachel', gender: 'female' },
    { voiceId: 'antoni', name: 'Antoni', gender: 'male' },
    { voiceId: 'bella', name: 'Bella', gender: 'female' },
    { voiceId: 'josh', name: 'Josh', gender: 'male' },
  ],
  es: [
    { voiceId: 'es-carlos', name: 'Carlos', gender: 'male' },
    { voiceId: 'es-sofia', name: 'Sofia', gender: 'female' },
  ],
  fr: [
    { voiceId: 'fr-pierre', name: 'Pierre', gender: 'male' },
    { voiceId: 'fr-amelie', name: 'Amélie', gender: 'female' },
  ],
  de: [
    { voiceId: 'de-hans', name: 'Hans', gender: 'male' },
    { voiceId: 'de-anna', name: 'Anna', gender: 'female' },
  ],
  pt: [
    { voiceId: 'pt-lucas', name: 'Lucas', gender: 'male' },
    { voiceId: 'pt-maria', name: 'Maria', gender: 'female' },
  ],
  it: [
    { voiceId: 'it-marco', name: 'Marco', gender: 'male' },
    { voiceId: 'it-giulia', name: 'Giulia', gender: 'female' },
  ],
  ja: [
    { voiceId: 'ja-haruto', name: 'Haruto', gender: 'male' },
    { voiceId: 'ja-yuki', name: 'Yuki', gender: 'female' },
  ],
  ko: [
    { voiceId: 'ko-minjun', name: 'Minjun', gender: 'male' },
    { voiceId: 'ko-soyeon', name: 'Soyeon', gender: 'female' },
  ],
  zh: [
    { voiceId: 'zh-wei', name: 'Wei', gender: 'male' },
    { voiceId: 'zh-lin', name: 'Lin', gender: 'female' },
  ],
  hi: [
    { voiceId: 'hi-arjun', name: 'Arjun', gender: 'male' },
    { voiceId: 'hi-priya', name: 'Priya', gender: 'female' },
  ],
};

// ---------------------------------------------------------------------------
// Supported Languages (Phase 2)
// ---------------------------------------------------------------------------

/** Metadata for a supported language. */
export interface SupportedLanguage {
  code: string;
  name: string;
  elevenLabsSupport: 'native' | 'supported';
  priority: 'mvp' | 'high' | 'medium' | 'low';
}

/**
 * All languages planned for support.
 * @source docs/modules/voice-sync/multi-language.md — Supported Languages
 */
// Phase 2
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', elevenLabsSupport: 'native', priority: 'mvp' },
  { code: 'es', name: 'Spanish', elevenLabsSupport: 'native', priority: 'high' },
  { code: 'fr', name: 'French', elevenLabsSupport: 'native', priority: 'high' },
  { code: 'de', name: 'German', elevenLabsSupport: 'native', priority: 'high' },
  { code: 'pt', name: 'Portuguese', elevenLabsSupport: 'native', priority: 'medium' },
  { code: 'it', name: 'Italian', elevenLabsSupport: 'native', priority: 'medium' },
  { code: 'ja', name: 'Japanese', elevenLabsSupport: 'native', priority: 'medium' },
  { code: 'ko', name: 'Korean', elevenLabsSupport: 'native', priority: 'medium' },
  { code: 'zh', name: 'Chinese (Mandarin)', elevenLabsSupport: 'native', priority: 'medium' },
  { code: 'hi', name: 'Hindi', elevenLabsSupport: 'supported', priority: 'low' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Default voice ID used when no voice is explicitly selected. */
export const DEFAULT_VOICE_ID = 'adam';

/** Look up a voice option by ID. */
export function getVoiceOption(voiceId: string): VoiceOption | undefined {
  return VOICE_OPTIONS.find((v) => v.id === voiceId);
}

/** Get voices available for a given language code. */
export function getVoicesForLanguage(languageCode: string): LanguageVoice[] {
  return LANGUAGE_VOICES[languageCode] ?? LANGUAGE_VOICES['en'] ?? [];
}
