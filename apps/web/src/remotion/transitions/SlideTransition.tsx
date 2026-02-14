/**
 * Slide-to-slide transition wrapper — handles fade, slide, zoom, and other transitions.
 * @source docs/modules/animation-engine/slide-transitions/README.md
 */

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import type { TransitionConfig } from '@/types/animation';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SlideTransitionProps {
  transition: TransitionConfig;
  /** Whether this slide is entering (true) or exiting (false). */
  entering: boolean;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Easing map
// ---------------------------------------------------------------------------

const EASING_MAP: Record<string, (t: number) => number> = {
  linear: Easing.linear,
  'ease-in': Easing.in(Easing.cubic),
  'ease-out': Easing.out(Easing.cubic),
  'ease-in-out': Easing.inOut(Easing.cubic),
  spring: Easing.out(Easing.back(1.4)),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlideTransition({
  transition,
  entering,
  children,
}: SlideTransitionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durationFrames = Math.round(transition.duration * fps);
  const easing = EASING_MAP[transition.easing] ?? Easing.inOut(Easing.cubic);

  // For "none" transitions, just render children immediately
  if (transition.type === 'none' || durationFrames === 0) {
    return <>{children}</>;
  }

  // Base interpolation range
  const range = entering
    ? [0, durationFrames] // entering: animate from start
    : [0, durationFrames]; // exiting: animate toward end

  // --- Fade ---
  if (transition.type === 'fade') {
    const opacity = interpolate(
      frame,
      range,
      entering ? [0, 1] : [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing },
    );

    return <div style={{ opacity }}>{children}</div>;
  }

  // --- Fade through black ---
  if (transition.type === 'fade-black') {
    const halfDuration = Math.floor(durationFrames / 2);
    const opacity = entering
      ? interpolate(frame, [halfDuration, durationFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        })
      : interpolate(frame, [0, halfDuration], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        });

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ opacity }}>{children}</div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'black',
            opacity: 1 - opacity,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // --- Slide transitions ---
  const isSlideTransition =
    transition.type === 'slide-left' ||
    transition.type === 'slide-right' ||
    transition.type === 'slide-up' ||
    transition.type === 'slide-down';

  if (isSlideTransition) {
    const direction = transition.direction ?? transition.type.replace('slide-', '') as 'left' | 'right' | 'up' | 'down';

    let translateProp: 'translateX' | 'translateY' = 'translateX';
    let startValue = 0;

    switch (direction) {
      case 'left':
        translateProp = 'translateX';
        startValue = entering ? 100 : -100; // enters from right
        break;
      case 'right':
        translateProp = 'translateX';
        startValue = entering ? -100 : 100; // enters from left
        break;
      case 'up':
        translateProp = 'translateY';
        startValue = entering ? 100 : -100; // enters from bottom
        break;
      case 'down':
        translateProp = 'translateY';
        startValue = entering ? -100 : 100; // enters from top
        break;
    }

    const translate = interpolate(
      frame,
      range,
      entering ? [startValue, 0] : [0, startValue],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing },
    );

    return (
      <div
        style={{
          transform: `${translateProp}(${translate}%)`,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    );
  }

  // --- Zoom transitions ---
  if (transition.type === 'zoom-in' || transition.type === 'zoom-out') {
    const scale = interpolate(
      frame,
      range,
      entering ? [0.6, 1] : [1, 0.6],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing },
    );

    const opacity = interpolate(
      frame,
      range,
      entering ? [0, 1] : [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing },
    );

    return (
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    );
  }

  // --- Morph transition (stub) ---
  if (transition.type === 'morph') {
    // TODO: Implement shared-element morph transition
    // Requires matching elements between current and next slide
    const opacity = interpolate(
      frame,
      range,
      entering ? [0, 1] : [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing },
    );

    return <div style={{ opacity }}>{children}</div>;
  }

  // Fallback — render children directly
  return <>{children}</>;
}
