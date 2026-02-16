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
    } else if (item.type !== 'widget' && 'children' in item) {
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
    if (item.type !== 'atom' && item.type !== 'widget' && 'children' in item) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Find the parent ID of a given item in the tree.
 * Returns undefined if the item is at the root level or not found.
 */
export function findParentId(
  items: SlideItem[],
  targetId: string,
  parentId?: string,
): string | undefined {
  for (const item of items) {
    if (item.id === targetId) return parentId;
    if (item.type !== 'atom' && item.type !== 'widget' && 'children' in item) {
      const found = findParentId(item.children, targetId, item.id);
      if (found !== undefined) return found;
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
    if (item.type !== 'atom' && item.type !== 'widget' && 'children' in item) {
      ids.push(...collectItemIds(item.children));
    }
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Immutable tree updates
// ---------------------------------------------------------------------------

/**
 * Merge updates into a single SlideItem, preserving its discriminator type.
 * Handles nested `style` merging so callers can pass partial style objects.
 */
function mergeItem(item: SlideItem, updates: Partial<SlideItem>): SlideItem {
  const merged = { ...item, ...updates };

  // Deep-merge style if both exist
  if (updates.style && item.style) {
    merged.style = { ...item.style, ...updates.style };
  }

  // Deep-merge animation if both exist
  if (updates.animation && item.animation) {
    merged.animation = { ...item.animation, ...updates.animation };
  }

  return merged as SlideItem;
}

/**
 * Immutably update a single item in a SlideItem tree by ID.
 * Walks LayoutItem.children, CardItem.children, and CardItem.detailItems.
 * Returns a new array with the matching item merged with `updates`.
 * If the item is not found the original array is returned unchanged.
 */
export function updateItemInTree(
  items: SlideItem[],
  itemId: string,
  updates: Partial<SlideItem>,
): SlideItem[] {
  let changed = false;

  const result = items.map((item) => {
    // Direct match
    if (item.id === itemId) {
      changed = true;
      return mergeItem(item, updates);
    }

    // Recurse into children
    if (item.type === 'layout') {
      const newChildren = updateItemInTree(item.children, itemId, updates);
      if (newChildren !== item.children) {
        changed = true;
        return { ...item, children: newChildren };
      }
    } else if (item.type === 'card') {
      const newChildren = updateItemInTree(item.children, itemId, updates);
      let newDetailItems = item.detailItems;
      if (item.detailItems) {
        newDetailItems = updateItemInTree(item.detailItems, itemId, updates);
      }
      if (newChildren !== item.children || newDetailItems !== item.detailItems) {
        changed = true;
        return { ...item, children: newChildren, detailItems: newDetailItems };
      }
    }

    return item;
  });

  return changed ? result : items;
}

// ---------------------------------------------------------------------------
// Append child to a parent item
// ---------------------------------------------------------------------------

/**
 * Immutably append one or more children to a card or layout item in the tree.
 * The parent is identified by `parentId`. New children are appended after
 * existing children. Returns the original array unchanged if the parent is
 * not found or is an atom (atoms have no children).
 */
export function appendChildrenToItem(
  items: SlideItem[],
  parentId: string,
  newChildren: SlideItem[],
): SlideItem[] {
  let changed = false;

  const result = items.map((item) => {
    if (item.id === parentId && item.type !== 'atom' && item.type !== 'widget' && 'children' in item) {
      changed = true;
      return { ...item, children: [...item.children, ...newChildren] };
    }

    // Recurse into children
    if (item.type === 'layout') {
      const updated = appendChildrenToItem(item.children, parentId, newChildren);
      if (updated !== item.children) {
        changed = true;
        return { ...item, children: updated };
      }
    } else if (item.type === 'card') {
      const updated = appendChildrenToItem(item.children, parentId, newChildren);
      if (updated !== item.children) {
        changed = true;
        return { ...item, children: updated };
      }
    }

    return item;
  });

  return changed ? result : items;
}

// ---------------------------------------------------------------------------
// Deep clone with new IDs
// ---------------------------------------------------------------------------

/**
 * Deep-clone a SlideItem tree, assigning new UUIDs to every item.
 * Useful for duplicating slides without sharing item references.
 */
export function deepCloneItemsWithNewIds(items: SlideItem[]): SlideItem[] {
  return items.map((item) => {
    const newId = crypto.randomUUID();

    if (item.type === 'atom' || item.type === 'widget') {
      return { ...item, id: newId };
    }

    if (item.type === 'layout') {
      return {
        ...item,
        id: newId,
        children: deepCloneItemsWithNewIds(item.children),
      };
    }

    // CardItem
    return {
      ...item,
      id: newId,
      children: deepCloneItemsWithNewIds(item.children),
      detailItems: item.detailItems
        ? deepCloneItemsWithNewIds(item.detailItems)
        : undefined,
    };
  });
}
