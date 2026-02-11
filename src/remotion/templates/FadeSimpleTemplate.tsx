/**
 * "Fade Simple" animation template — elements fade in sequentially with stagger.
 * Part of the "Minimal" template category.
 * @source docs/modules/animation-engine/element-animations/README.md
 */

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import type { Slide, SlideElement } from '@/types/slide';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FadeSimpleTemplateProps {
  slide: Slide;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Stagger delay between each element (in seconds). */
const STAGGER_DELAY_S = 0.3;

/** Duration of each element's fade-in (in seconds). */
const FADE_DURATION_S = 0.6;

// ---------------------------------------------------------------------------
// Single animated element
// ---------------------------------------------------------------------------

function FadeElement({
  element,
  index,
  fps,
  frame,
}: {
  element: SlideElement;
  index: number;
  fps: number;
  frame: number;
}) {
  const delayFrames = Math.round(STAGGER_DELAY_S * index * fps);
  const durationFrames = Math.round(FADE_DURATION_S * fps);

  const opacity = interpolate(
    frame,
    [delayFrames, delayFrames + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );

  const translateY = interpolate(
    frame,
    [delayFrames, delayFrames + durationFrames],
    [12, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        opacity,
        transform: `translateY(${translateY}px)`,
        color: element.style.color ?? '#ffffff',
        fontSize: element.style.fontSize ?? 24,
        fontWeight: element.style.fontWeight ?? 'normal',
        fontFamily:
          element.style.fontFamily ??
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: element.style.textAlign ?? 'left',
        width: element.style.width,
        height: element.style.height,
      }}
    >
      {element.content}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template component
// ---------------------------------------------------------------------------

export function FadeSimpleTemplate({ slide }: FadeSimpleTemplateProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        position: 'relative',
      }}
    >
      {slide.elements.map((element, index) => (
        <FadeElement
          key={element.id}
          element={element}
          index={index}
          fps={fps}
          frame={frame}
        />
      ))}
    </AbsoluteFill>
  );
}
