/**
 * Slide-canvas relative unit helpers.
 *
 * The slide canvas sets a responsive `font-size` via the `.slide-canvas` CSS
 * class (see slide-ui.css).  At the design-space base width of 960 px the
 * font-size is 16 px, so **1 em = 16 design-space pixels**.
 *
 * Use the `em()` helper when setting inline styles on slide-ui components so
 * that all sizes scale proportionally with the canvas container.
 *
 * @example
 * ```tsx
 * import { em } from '../units';
 *
 * style={{ width: em(40), height: em(40), fontSize: em(14) }}
 * // → width: '2.5em', height: '2.5em', fontSize: '0.875em'
 * ```
 */

/** Font-size of the slide canvas at the 960 px design-space base (px). */
export const SLIDE_BASE_PX = 16;

/**
 * Convert a design-space pixel value to an `em` CSS string.
 *
 * The returned string is relative to the slide canvas `font-size`, so it
 * scales automatically with the container width.
 */
export function em(designPx: number): string {
  return `${designPx / SLIDE_BASE_PX}em`;
}
