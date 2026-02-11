// Extracted from docs/modules/voice-sync/audio-timeline-sync.md

/**
 * Sync calculation service.
 * Core sync algorithm lives in src/lib/tts/sync.ts.
 * Re-exported here for service-layer access.
 */
export { calculateSync } from '@/lib/tts/sync';
export type { SlideSync, SyncPoint, WordTimestamp } from '@/types/voice';
