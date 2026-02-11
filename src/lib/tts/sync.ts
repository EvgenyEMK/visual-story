// Extracted from docs/modules/voice-sync/audio-timeline-sync.md

import type { Slide, SlideElement } from '@/types/slide';
import type { SyncPoint, SlideSync, WordTimestamp } from '@/types/voice';

/**
 * Calculate sync points between audio timestamps and slide elements.
 *
 * Algorithm:
 * 1. Order elements by priority (title first, then body text, etc.)
 * 2. Extract keywords from each element's content
 * 3. Match keywords to audio timestamps (word-level)
 * 4. Trigger animations slightly BEFORE the word is spoken (200ms anticipation)
 * 5. Fall back to staggered timing if no keyword match is found
 *
 * @param slide - The slide containing elements to sync
 * @param audioTimestamps - Word-level timestamps from TTS
 * @returns Sync data including per-element trigger times and total duration
 */
export function calculateSync(
  slide: Slide,
  audioTimestamps: WordTimestamp[]
): SlideSync {
  const syncPoints: SyncPoint[] = [];
  const orderedElements = orderElementsByPriority(slide.elements);

  const elementPhrases = orderedElements.map((el) => ({
    element: el,
    keywords: extractKeywords(el.content),
  }));

  let lastMatchedIndex = 0;

  for (const { element, keywords } of elementPhrases) {
    const matchIndex = findKeywordInTimestamps(
      keywords,
      audioTimestamps,
      lastMatchedIndex
    );

    if (matchIndex !== -1) {
      // Trigger element slightly BEFORE word is spoken (anticipation offset)
      const triggerTime = Math.max(
        0,
        audioTimestamps[matchIndex].start - 0.2
      );

      syncPoints.push({
        elementId: element.id,
        slideId: slide.id,
        timestamp: triggerTime,
        duration: element.animation.duration,
        triggerWord: audioTimestamps[matchIndex].word,
      });

      lastMatchedIndex = matchIndex;
    } else {
      // Fallback: stagger elements evenly when no keyword match
      const staggerTime =
        lastMatchedIndex * 0.5 + syncPoints.length * 0.3;
      syncPoints.push({
        elementId: element.id,
        slideId: slide.id,
        timestamp: staggerTime,
        duration: element.animation.duration,
      });
    }
  }

  // Calculate total duration: last word end time + 0.5s padding
  const lastTimestamp = audioTimestamps[audioTimestamps.length - 1];
  const endTime = lastTimestamp ? lastTimestamp.end + 0.5 : slide.duration / 1000;

  return {
    slideId: slide.id,
    startTime: 0,
    endTime,
    elementSyncPoints: syncPoints,
  };
}

/**
 * Find the first keyword match in audio timestamps starting from a given index.
 */
export function findKeywordInTimestamps(
  keywords: string[],
  timestamps: WordTimestamp[],
  startIndex: number
): number {
  for (let i = startIndex; i < timestamps.length; i++) {
    const word = timestamps[i].word.toLowerCase();
    if (keywords.some((kw) => word.includes(kw.toLowerCase()))) {
      return i;
    }
  }
  return -1;
}

/**
 * Order slide elements by visual priority for sync.
 * Titles appear first, then text, then other elements.
 *
 * TODO: Use element role (title/body/accent) when available on element model
 */
export function orderElementsByPriority(
  elements: SlideElement[]
): SlideElement[] {
  return [...elements].sort((a, b) => {
    // Text elements get higher priority than non-text
    const aP = a.type === 'text' ? 0 : 1;
    const bP = b.type === 'text' ? 0 : 1;
    return aP - bP;
  });
}

/**
 * Extract significant keywords from text for timestamp matching.
 * Filters out short words (3 chars or less).
 *
 * TODO: Improve with NLP-based keyword extraction for better matching
 */
export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);
}
