/**
 * Animated element wrapper — applies frame-based animation driven by sync points.
 * Used inside Remotion compositions to animate individual slide elements.
 * @source docs/modules/voice-sync/audio-timeline-sync.md
 */

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import type { SlideElement, AnimationType } from '@/types/slide';
import type { SyncPoint } from '@/types/voice';
import { ElementRenderer } from './ElementRenderer';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AnimatedElementProps {
  element: SlideElement;
  /** Optional sync point from voice-over timing. */
  syncPoint?: SyncPoint;
  /** Slide start time in frames (offset within sequence). */
  slideStartFrame?: number;
}

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

/** Convert seconds to frames. */
function secToFrames(sec: number, fps: number): number {
  return Math.round(sec * fps);
}

/** Get animation style based on element's animation config and current progress. */
function getAnimationStyle(
  type: AnimationType,
  progress: number, // 0 → 1
): React.CSSProperties {
  switch (type) {
    case 'fade-in':
      return { opacity: progress };

    case 'fade-out':
      return { opacity: 1 - progress };

    case 'slide-up':
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px)`,
      };

    case 'slide-down':
      return {
        opacity: progress,
        transform: `translateY(${(1 - progress) * -30}px)`,
      };

    case 'slide-left':
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * 30}px)`,
      };

    case 'slide-right':
      return {
        opacity: progress,
        transform: `translateX(${(1 - progress) * -30}px)`,
      };

    case 'scale-in':
      return {
        opacity: progress,
        transform: `scale(${0.5 + progress * 0.5})`,
      };

    case 'scale-out':
      return {
        opacity: 1 - progress,
        transform: `scale(${1 - progress * 0.5})`,
      };

    case 'bounce':
      // Simple bounce approximation using Easing.bounce
      return {
        opacity: Math.min(progress * 2, 1),
        transform: `translateY(${(1 - progress) * -20}px) scale(${
          0.8 + progress * 0.2
        })`,
      };

    case 'typewriter':
      // For typewriter, the parent text should be clipped
      return { opacity: 1 };

    case 'none':
    default:
      return { opacity: 1 };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnimatedElement({
  element,
  syncPoint,
  slideStartFrame = 0,
}: AnimatedElementProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animConfig = element.animation;

  // Determine when this element should start animating
  let triggerFrame: number;

  if (syncPoint) {
    // Voice-sync driven: trigger at the sync point time
    triggerFrame = secToFrames(syncPoint.timestamp, fps) - slideStartFrame;
  } else {
    // Delay-based: use the animation config delay
    triggerFrame = secToFrames(animConfig.delay, fps);
  }

  const durationFrames = secToFrames(animConfig.duration, fps);

  // Easing function
  const easingMap: Record<string, (t: number) => number> = {
    linear: Easing.linear,
    'ease-in': Easing.in(Easing.cubic),
    'ease-out': Easing.out(Easing.cubic),
    'ease-in-out': Easing.inOut(Easing.cubic),
    spring: Easing.out(Easing.back(1.4)),
  };

  const easing = easingMap[animConfig.easing] ?? Easing.out(Easing.cubic);

  // Calculate animation progress (0 to 1)
  const progress = interpolate(
    frame,
    [triggerFrame, triggerFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing,
    },
  );

  const animStyle = getAnimationStyle(animConfig.type, progress);

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        ...animStyle,
      }}
    >
      <ElementRenderer element={element} />
    </div>
  );
}
