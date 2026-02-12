/**
 * Utilities for converting between the recursive SlideItem tree
 * and the legacy flat SlideElement array.
 *
 * Use `flattenItems()` when you need all AtomItems from a tree.
 * Use `flattenItemsAsElements()` when legacy code expects SlideElement[].
 */

import type {
  SlideItem,
  AtomItem,
  SlideElement,
  AnimationConfig,
} from '@/types/slide';

// ---------------------------------------------------------------------------
// Core flatten
// ---------------------------------------------------------------------------

/**
 * Recursively collect all AtomItem leaf nodes from a SlideItem tree.
 * Layout and Card nodes are traversed but not included in the result.
 */
export function flattenItems(items: SlideItem[]): AtomItem[] {
  const result: AtomItem[] = [];

  for (const item of items) {
    if (item.type === 'atom') {
      result.push(item);
    } else {
      // LayoutItem and CardItem both have `children`
      result.push(...flattenItems(item.children));
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Legacy adapter
// ---------------------------------------------------------------------------

/** Default animation config used when an AtomItem has no animation. */
const DEFAULT_ANIMATION: AnimationConfig = {
  type: 'none',
  duration: 0.5,
  delay: 0,
  easing: 'ease-out',
};

/**
 * Convert a SlideItem tree into a flat SlideElement[] array.
 * Useful for legacy components and Remotion compositions that still
 * expect the old data shape.
 *
 * - Only AtomItems are included (layouts/cards are structural wrappers).
 * - Position defaults to `{ x: 0, y: 0 }` when not set on the atom.
 * - Animation defaults to a no-op config when not set.
 */
export function flattenItemsAsElements(items: SlideItem[]): SlideElement[] {
  return flattenItems(items).map((atom) => ({
    id: atom.id,
    type: atom.atomType,
    content: atom.content,
    animation: atom.animation ?? DEFAULT_ANIMATION,
    position: atom.position ?? { x: 0, y: 0 },
    style: atom.style ?? {},
  }));
}

// ---------------------------------------------------------------------------
// Tree traversal helpers
// ---------------------------------------------------------------------------

/**
 * Find a SlideItem by ID anywhere in the tree.
 * Returns undefined if not found.
 */
export function findItemById(
  items: SlideItem[],
  id: string,
): SlideItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.type !== 'atom') {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Collect all item IDs from a tree (all types, not just atoms).
 */
export function collectItemIds(items: SlideItem[]): string[] {
  const ids: string[] = [];
  for (const item of items) {
    ids.push(item.id);
    if (item.type !== 'atom') {
      ids.push(...collectItemIds(item.children));
    }
  }
  return ids;
}
