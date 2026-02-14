/**
 * Shared types for the slide-ui component library.
 *
 * These presentation-quality components are designed for use inside
 * slide canvases (960×540) but also work in regular page layouts.
 */

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

/**
 * Flexible icon prop — accepts:
 * - A Lucide icon component (e.g. `Rocket` from lucide-react)
 * - A Phosphor/Tabler icon component
 * - An emoji string (e.g. '🚀')
 * - A React node for full custom rendering
 */
export type IconProp = LucideIcon | string | ReactNode;

// ---------------------------------------------------------------------------
// Entrance Animations
// ---------------------------------------------------------------------------

/** Supported entrance animation presets. */
export type EntranceType =
  | 'none'
  | 'fade'
  | 'float-in'
  | 'pop-zoom'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'wipe'
  | 'pulse'
  | 'typewriter'
  | 'color-shift'
  | 'shimmer';

/** Animation configuration for any component. */
export interface EntranceProps {
  /** Entrance animation preset. Default: 'none' */
  entrance?: EntranceType;
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number;
  /** Animation duration (seconds). Default: varies by preset */
  duration?: number;
}

/** Props for staggered group animations. */
export interface StaggerProps extends EntranceProps {
  /** Delay between each item in a group (seconds). Default: 0.1 */
  stagger?: number;
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export type SlideTheme = 'dark' | 'light';

// ---------------------------------------------------------------------------
// Common component size
// ---------------------------------------------------------------------------

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

// ---------------------------------------------------------------------------
// Color accent
// ---------------------------------------------------------------------------

/** A hex color string like '#3b82f6' or a Tailwind-style token. */
export type AccentColor = string;
