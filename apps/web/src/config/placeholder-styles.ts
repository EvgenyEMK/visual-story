/**
 * Placeholder image style definitions for VisualFlow.
 *
 * Used by the ImagePlaceholder component to render styled placeholder
 * elements before final assets are placed.
 *
 * @source docs/modules/ai-assistant/asset-generation.md — Placeholder System
 */

import type { PlaceholderConfig, PlaceholderStyle } from '@/types/ai';

// ---------------------------------------------------------------------------
// Placeholder Style Definitions
// ---------------------------------------------------------------------------

/**
 * Pre-defined placeholder styles available in the MVP.
 *
 * Each style maps to a background gradient, an icon (Lucide name),
 * and a label displayed on the placeholder element.
 *
 * @source docs/modules/ai-assistant/asset-generation.md — Placeholder System
 */
export const PLACEHOLDER_STYLES: Record<PlaceholderStyle, Omit<PlaceholderConfig, 'aspectRatio'>> = {
  photo: {
    style: 'photo',
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    icon: 'camera',
    label: 'Photo placeholder',
  },
  illustration: {
    style: 'illustration',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    icon: 'palette',
    label: 'Illustration placeholder',
  },
  abstract: {
    style: 'abstract',
    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    icon: 'hexagon',
    label: 'Abstract placeholder',
  },
  pattern: {
    style: 'pattern',
    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    icon: 'grid',
    label: 'Pattern placeholder',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All available placeholder style keys. */
export const PLACEHOLDER_STYLE_KEYS: PlaceholderStyle[] = [
  'photo',
  'illustration',
  'abstract',
  'pattern',
];

/**
 * Build a complete PlaceholderConfig for a given style and optional aspect ratio.
 */
export function buildPlaceholderConfig(
  style: PlaceholderStyle,
  aspectRatio: PlaceholderConfig['aspectRatio'] = '16:9',
): PlaceholderConfig {
  return {
    ...PLACEHOLDER_STYLES[style],
    aspectRatio,
  };
}

/**
 * Get the default placeholder config (photo style, 16:9).
 */
export function getDefaultPlaceholder(): PlaceholderConfig {
  return buildPlaceholderConfig('photo', '16:9');
}
