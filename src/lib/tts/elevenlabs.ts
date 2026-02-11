// Extracted from docs/modules/voice-sync/text-to-speech.md

import type { TTSRequest, TTSResponse, WordTimestamp } from '@/types/voice';

// TODO: Install elevenlabs package and use SDK client:
// import { ElevenLabsClient } from 'elevenlabs';
// const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

/**
 * Generate speech from text using ElevenLabs API.
 * Returns audio URL, duration, and word-level timestamps for sync.
 *
 * Uses the ElevenLabs TTS endpoint with word timestamps enabled.
 * Audio is returned as base64-encoded MP3 at 44.1kHz/128kbps.
 *
 * Cost: ~$0.22 per average project (~1,500 characters) on Creator plan
 *
 * @param request - TTS request with text, voiceId, and optional modelId
 * @param projectId - Project ID for storage path
 * @param slideId - Slide ID for storage path
 * @returns Generated audio URL, duration, and word timestamps
 */
export async function generateSpeech(
  request: TTSRequest,
  projectId: string,
  slideId: string
): Promise<TTSResponse> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${request.voiceId}/with-timestamps`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.modelId || 'eleven_turbo_v2_5',
        output_format: 'mp3_44100_128',
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.statusText}`);
  }

  const data = await response.json();

  // TODO: Upload audio buffer to R2 storage via uploadToR2()
  // import { uploadToR2 } from '@/lib/storage/r2';
  // const audioUrl = await uploadToR2(audioBuffer, `audio/${projectId}/${slideId}.mp3`, 'audio/mpeg');
  const audioUrl = `audio/${projectId}/${slideId}.mp3`;

  // Map character-level timestamps to word timestamps
  const wordTimestamps: WordTimestamp[] = (data.alignment?.characters || []).map(
    (char: { character: string; start_time_ms: number; end_time_ms: number }) => ({
      word: char.character,
      start: char.start_time_ms / 1000,
      end: char.end_time_ms / 1000,
    })
  );

  // Calculate total duration from last timestamp
  const lastTs = wordTimestamps[wordTimestamps.length - 1];
  const duration = lastTs ? lastTs.end : 0;

  return {
    audioUrl,
    duration,
    wordTimestamps,
  };
}
