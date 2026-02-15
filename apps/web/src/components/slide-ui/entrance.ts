/**
 * Entrance animation variants for motion (framer-motion).
 *
 * Each preset returns `initial` and `animate` objects compatible with
 * `<motion.div initial={...} animate={...} transition={...}>`.
 */

import type { Variants } from 'motion/react';
import type { EntranceType } from './types';

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

export const entranceVariants: Record<
  Exclude<EntranceType, 'none' | 'typewriter' | 'shimmer' | 'color-shift' | 'wipe'>,
  Variants
> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'float-in': {
    hidden: { opacity: 0, y: '1.5em' },
    visible: { opacity: 1, y: 0 },
  },
  'pop-zoom': {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: '1.25em' },
    visible: { opacity: 1, y: 0 },
  },
  'slide-down': {
    hidden: { opacity: 0, y: '-1.25em' },
    visible: { opacity: 1, y: 0 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: '1.875em' },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: '-1.875em' },
    visible: { opacity: 1, x: 0 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  pulse: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: [1, 1.05, 1] },
  },
};

// ---------------------------------------------------------------------------
// Helper to get motion props for a given entrance type
// ---------------------------------------------------------------------------

export interface MotionEntrance {
  initial: string;
  animate: string;
  transition: Record<string, unknown>;
}

const DEFAULT_EASE = [0.16, 1, 0.3, 1];

export function getEntranceMotion(
  entrance: EntranceType = 'none',
  delay = 0,
  duration?: number,
): MotionEntrance | null {
  if (entrance === 'none') return null;

  // Special presets handled via CSS or custom logic
  if (
    entrance === 'typewriter' ||
    entrance === 'shimmer' ||
    entrance === 'color-shift' ||
    entrance === 'wipe'
  ) {
    return null;
  }

  const variant = entranceVariants[entrance];
  if (!variant) return null;

  const dur =
    duration ??
    (entrance === 'pop-zoom' ? 0.6 : entrance === 'pulse' ? 1.2 : 0.7);

  return {
    initial: 'hidden',
    animate: 'visible',
    transition: {
      duration: dur,
      delay,
      ease: entrance === 'pop-zoom' ? [0.34, 1.56, 0.64, 1] : DEFAULT_EASE,
    },
  };
}
