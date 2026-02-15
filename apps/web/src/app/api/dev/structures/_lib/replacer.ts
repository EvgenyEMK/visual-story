/**
 * Custom JSON replacer for dev structure dumps.
 *
 * Handles non-serializable values:
 * - React components / Lucide icons (functions) → "[Component: Name]"
 * - React elements (JSX / $$typeof) → "[JSX]"
 * - Undefined → skipped by JSON.stringify (standard behaviour)
 */

export function devJsonReplacer(_key: string, value: unknown): unknown {
  // Lucide icons and other React components are functions
  if (typeof value === 'function') {
    const name =
      (value as { displayName?: string }).displayName ||
      (value as { name?: string }).name ||
      'Anonymous';
    return `[Component: ${name}]`;
  }

  // React elements created by JSX (ReactElement objects have $$typeof)
  if (
    value !== null &&
    typeof value === 'object' &&
    '$$typeof' in (value as Record<string, unknown>)
  ) {
    return '[JSX]';
  }

  return value;
}
