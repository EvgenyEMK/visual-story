/**
 * Full presentation Remotion composition — renders slides in sequence with
 * voice-over audio and optional watermark overlay.
 * @source docs/modules/export-publish/video-export.md
 * @source docs/modules/animation-engine/slide-transitions/README.md
 */

import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
} from 'remotion';
import type { Project } from '@/types/project';
import type { Slide } from '@/types/slide';
import type { VoiceConfig } from '@/types/voice';
import { flattenItemsAsElements } from '@/lib/flatten-items';
import { SlideTransition } from '../transitions/SlideTransition';
import { Watermark } from './Watermark';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PresentationProps {
  project: Project;
  voiceConfig: VoiceConfig | null;
  includeVoiceover: boolean;
  watermark: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert milliseconds to frames at the given FPS. */
function msToFrames(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps);
}

/** Calculate cumulative start frame for each slide. */
function getSlideFrameRanges(
  slides: Slide[],
  fps: number,
): { startFrame: number; durationFrames: number }[] {
  let cumulativeFrame = 0;
  return slides.map((slide) => {
    const durationFrames = msToFrames(slide.duration, fps);
    const range = { startFrame: cumulativeFrame, durationFrames };
    cumulativeFrame += durationFrames;
    return range;
  });
}

// ---------------------------------------------------------------------------
// Slide renderer (single slide within a Sequence)
// ---------------------------------------------------------------------------

function SlideRenderer({ slide }: { slide: Slide }) {
  // TODO: Use FadeSimpleTemplate or matched animation template
  // TODO: Render each element with AnimatedElement + sync points
  const elements = flattenItemsAsElements(slide.items);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        padding: 60,
      }}
    >
      <div
        style={{
          color: '#ffffff',
          fontSize: 48,
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {slide.content}
      </div>
      {elements.map((el) => (
        <div
          key={el.id}
          style={{
            color: el.style.color ?? '#e0e0e0',
            fontSize: el.style.fontSize ?? 24,
            textAlign: 'center',
          }}
        >
          {el.content}
        </div>
      ))}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

export function Presentation({
  project,
  voiceConfig,
  includeVoiceover,
  watermark,
}: PresentationProps) {
  const { fps } = useVideoConfig();
  const slides = project.slides;
  const frameRanges = getSlideFrameRanges(slides, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Slide sequences */}
      {slides.map((slide, index) => {
        const { startFrame, durationFrames } = frameRanges[index];

        return (
          <Sequence
            key={slide.id}
            from={startFrame}
            durationInFrames={durationFrames}
            name={`Slide ${index + 1}`}
          >
            <SlideTransition
              transition={{
                type: (slide.transition as 'none' | 'fade') || 'fade',
                duration: 0.5,
                easing: 'ease-in-out',
              }}
              entering={true}
            >
              <SlideRenderer slide={slide} />
            </SlideTransition>
          </Sequence>
        );
      })}

      {/* Voice-over audio track */}
      {includeVoiceover && voiceConfig?.fullAudioUrl && (
        <Audio src={voiceConfig.fullAudioUrl} />
      )}

      {/* Watermark overlay (free tier) */}
      {watermark && <Watermark />}
    </AbsoluteFill>
  );
}
