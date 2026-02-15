/**
 * Utility to render any IconProp value into a React element.
 *
 * Supports:
 * - Lucide icon components (e.g. `Rocket`)
 * - Phosphor icon components (e.g. `RocketLaunch`)
 * - Tabler icon components (e.g. `IconRocket`)
 * - Emoji strings (e.g. '🚀')
 * - Arbitrary ReactNode
 */

import { type ReactNode, isValidElement, createElement } from 'react';
import type { IconProp } from './types';

interface RenderIconOptions {
  /**
   * Icon size — accepts a pixel number **or** a CSS length string (e.g. `'1.25em'`).
   * When a string is provided it is forwarded as-is to the icon component / CSS.
   */
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Determine if a value is an emoji string (starts with an emoji codepoint).
 */
function isEmojiString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  // Simple heuristic: emoji strings are short and don't start with ASCII
  return value.length <= 4 && /^\p{Emoji}/u.test(value);
}

/**
 * Determine if a value is a renderable React component.
 *
 * Icon libraries (Lucide, Phosphor, Tabler) wrap icons with React.forwardRef,
 * which returns an object with $$typeof — not a plain function. We need to
 * detect both plain function components and forwardRef/memo wrappers.
 */
function isIconComponent(
  value: unknown,
): value is React.ComponentType<{ size?: number | string; className?: string; color?: string }> {
  // Plain function components or class components
  if (typeof value === 'function') return true;
  // forwardRef / memo / lazy wrappers are objects with $$typeof symbol
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string | symbol, unknown>;
    if ('$$typeof' in obj) return true;
    // Some libraries export as { render: fn }
    if ('render' in obj && typeof (obj as { render: unknown }).render === 'function') return true;
  }
  return false;
}

export function renderIcon(
  icon: IconProp | undefined | null,
  options: RenderIconOptions = {},
): ReactNode {
  if (icon == null) return null;

  const { size = 24, className, color } = options;

  // Case 1: Emoji string
  if (isEmojiString(icon)) {
    return (
      <span
        className={className}
        style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        role="img"
      >
        {icon}
      </span>
    );
  }

  // Case 2: React component (Lucide, Phosphor, Tabler)
  if (isIconComponent(icon)) {
    return createElement(icon, { size, className, color });
  }

  // Case 3: Already a ReactNode (e.g. JSX element)
  if (isValidElement(icon)) {
    return icon;
  }

  // Case 4: Plain string (render as text)
  if (typeof icon === 'string') {
    const scaledFontSize =
      typeof size === 'number' ? size * 0.6 : `calc(${size} * 0.6)`;
    return (
      <span className={className} style={{ fontSize: scaledFontSize, lineHeight: 1 }}>
        {icon}
      </span>
    );
  }

  return null;
}
