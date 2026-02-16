'use client';

import {
  type KeyboardEvent,
  type MouseEvent,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { em } from '../units';
import { renderIcon } from '../render-icon';
import { getEntranceMotion, entranceVariants } from '../entrance';
import type { ComponentSize, EntranceType, AccentColor } from '../types';
import type {
  SmartListItem,
  SmartListConfig,
  SmartListData,
  IconRef,
  FlatSmartListItem,
  NumberingFormat,
  CollapseDefault,
  ConditionalFormatIntensity,
} from '@/types/smart-list';
import { getIconSet, resolveIconRef } from '@/config/icon-sets';
import { IconQuickPick } from './IconQuickPick';

// ---------------------------------------------------------------------------
// Size presets
// ---------------------------------------------------------------------------

const sizeConfig: Record<ComponentSize, {
  icon: number; iconBox: number;
  title: string; desc: string; header: string;
  gap: string; indent: number; pad: string;
  numberWidth: number;
  chevronSize: number;
}> = {
  sm: { icon: 12, iconBox: 22, title: 'text-[0.5625em]', desc: 'text-[0.4375em]', header: 'text-[0.625em] font-bold', gap: 'gap-[0.25em]', indent: 20, pad: 'py-[0.25em] px-[0.375em]', numberWidth: 20, chevronSize: 10 },
  md: { icon: 16, iconBox: 28, title: 'text-[0.6875em]', desc: 'text-[0.5625em]', header: 'text-[0.75em] font-bold', gap: 'gap-[0.375em]', indent: 28, pad: 'py-[0.375em] px-[0.5em]', numberWidth: 26, chevronSize: 14 },
  lg: { icon: 20, iconBox: 34, title: 'text-[0.75em]', desc: 'text-[0.625em]', header: 'text-[0.875em] font-bold', gap: 'gap-[0.5em]', indent: 36, pad: 'py-[0.5em] px-[0.75em]', numberWidth: 32, chevronSize: 16 },
  xl: { icon: 24, iconBox: 40, title: 'text-[0.875em]', desc: 'text-[0.75em]', header: 'text-[1em] font-bold', gap: 'gap-[0.625em]', indent: 44, pad: 'py-[0.625em] px-[1em]', numberWidth: 38, chevronSize: 18 },
};

// ---------------------------------------------------------------------------
// Numbering helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number, format: NumberingFormat): string {
  switch (format) {
    case '1.': return `${n}.`;
    case '01.': return `${String(n).padStart(2, '0')}.`;
    case 'a.': return `${String.fromCharCode(96 + ((n - 1) % 26) + 1)}.`;
    case 'a)': return `${String.fromCharCode(96 + ((n - 1) % 26) + 1)})`;
    case 'i.': {
      const romans = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
      return `${romans[n] ?? n}.`;
    }
    case 'Step N': return `Step ${n}`;
    default: return `${n}.`;
  }
}

/** Derive child numbering format from the parent format. */
function defaultChildFormat(parentFormat: NumberingFormat): NumberingFormat {
  switch (parentFormat) {
    case '1.': case '01.': case 'Step N': return 'a)';
    case 'a.': case 'a)': return 'i.';
    case 'i.': return 'a)';
    default: return 'a)';
  }
}

// ---------------------------------------------------------------------------
// Conditional formatting
// ---------------------------------------------------------------------------

const FORMAT_OPACITY: Record<ConditionalFormatIntensity, string> = {
  subtle: '0D',   // ~5%
  medium: '1A',   // ~10%
  strong: '26',   // ~15%
};

// ---------------------------------------------------------------------------
// Progress summary
// ---------------------------------------------------------------------------

interface ProgressSegment {
  iconId: string;
  label: string;
  color: string;
  count: number;
}

function computeProgress(
  items: SmartListItem[],
  iconSetId: string,
  getIconSet: (id: string) => import('@/types/smart-list').IconSet | undefined,
): { segments: ProgressSegment[]; total: number } {
  const counts = new Map<string, number>();
  let total = 0;

  function walk(list: SmartListItem[]) {
    for (const item of list) {
      if (item.isHeader) continue;
      total++;
      const key = item.primaryIcon?.iconId ?? '__none__';
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (item.children) walk(item.children);
    }
  }
  walk(items);

  const set = getIconSet(iconSetId);
  const segments: ProgressSegment[] = [];
  if (set) {
    for (const entry of set.entries) {
      const count = counts.get(entry.id) ?? 0;
      if (count > 0) {
        segments.push({ iconId: entry.id, label: entry.label, color: entry.color, count });
      }
    }
  }
  const noIcon = counts.get('__none__') ?? 0;
  if (noIcon > 0) {
    segments.push({ iconId: '__none__', label: 'No status', color: '#6b7280', count: noIcon });
  }
  return { segments, total };
}

// ---------------------------------------------------------------------------
// Visibility helpers (SL-F09)
// ---------------------------------------------------------------------------

/** Count visible vs total non-header items (recursive). */
function countVisibility(items: SmartListItem[]): { visible: number; total: number } {
  let visible = 0;
  let total = 0;
  for (const item of items) {
    if (item.isHeader) continue;
    total++;
    if (item.visible !== false) visible++;
    if (item.children) {
      const child = countVisibility(item.children);
      visible += child.visible;
      total += child.total;
    }
  }
  return { visible, total };
}

// ---------------------------------------------------------------------------
// Group-by-status helper (SL-F16)
// ---------------------------------------------------------------------------

function groupItemsByStatus(
  items: SmartListItem[],
  iconSetId: string,
  getIconSetFn: (id: string) => import('@/types/smart-list').IconSet | undefined,
): SmartListItem[] {
  const set = getIconSetFn(iconSetId);
  if (!set) return items;

  // Collect all non-header items (flattening section structure)
  const allItems: SmartListItem[] = [];
  for (const item of items) {
    if (!item.isHeader) allItems.push(item);
  }

  // Group by primaryIcon.iconId
  const groups = new Map<string, SmartListItem[]>();
  for (const entry of set.entries) {
    groups.set(entry.id, []);
  }
  groups.set('__none__', []);

  for (const item of allItems) {
    const key = item.primaryIcon?.iconId ?? '__none__';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  // Build grouped list with synthetic headers
  const result: SmartListItem[] = [];
  for (const entry of set.entries) {
    const group = groups.get(entry.id) ?? [];
    if (group.length === 0) continue;
    result.push({ id: `__group-header-${entry.id}`, text: `${entry.label} (${group.length})`, isHeader: true });
    result.push(...group);
  }
  const noStatus = groups.get('__none__') ?? [];
  if (noStatus.length > 0) {
    result.push({ id: '__group-header-none', text: `No status (${noStatus.length})`, isHeader: true });
    result.push(...noStatus);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Flatten items for rendering
// ---------------------------------------------------------------------------

function shouldStartCollapsed(
  item: SmartListItem,
  depth: number,
  collapseDefault: CollapseDefault,
  sectionIndex: number,
): boolean {
  if (!item.children?.length) return false;
  switch (collapseDefault) {
    case 'all-expanded': return false;
    case 'all-collapsed': return true;
    case 'first-expanded': return sectionIndex > 0;
    case 'top-level-only': return depth > 0;
    default: return false;
  }
}

function flattenItems(
  items: SmartListItem[],
  depth: number,
  numberFormat: NumberingFormat | undefined,
  childNumberFormat: NumberingFormat | undefined,
  showNumbering: boolean,
  collapsedMap: Map<string, boolean>,
): FlatSmartListItem[] {
  const result: FlatSmartListItem[] = [];
  let counter = 0;

  const activeFormat = depth === 0
    ? (numberFormat ?? '1.')
    : (childNumberFormat ?? defaultChildFormat(numberFormat ?? '1.'));

  for (const item of items) {
    if (!item.isHeader) counter++;
    const numberLabel = showNumbering && !item.isHeader
      ? formatNumber(counter, activeFormat)
      : undefined;

    result.push({
      item,
      depth,
      flatIndex: result.length,
      numberLabel,
    });

    const isCollapsed = collapsedMap.get(item.id) ?? false;
    if (item.children?.length && !isCollapsed) {
      const childFlat = flattenItems(
        item.children,
        depth + 1,
        numberFormat,
        childNumberFormat,
        showNumbering,
        collapsedMap,
      );
      for (const child of childFlat) {
        result.push({ ...child, flatIndex: result.length });
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Sortable item wrapper
// ---------------------------------------------------------------------------

function SortableItemWrapper({
  id,
  children,
  isEditing,
}: {
  id: string;
  children: React.ReactNode;
  isEditing: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {isEditing && (
        <div
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full px-[0.125em] cursor-grab opacity-0 group-hover/item:opacity-40 hover:!opacity-80 transition-opacity"
          style={{ width: em(14) }}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="text-white/50">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>
      )}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SmartItemsListProps {
  /** Widget configuration. */
  config: SmartListConfig;
  /** Widget data. */
  data: SmartListData;
  /** Whether in edit mode (enables editing interactions). */
  isEditing?: boolean;
  /** Called when items change (edit mode). */
  onDataChange?: (data: SmartListData) => void;
  /** Called when config changes (edit mode). */
  onConfigChange?: (config: SmartListConfig) => void;
  /** ID of the focused item in gradual disclosure (presentation mode). */
  focusedItemId?: string | null;
  /** Set of item IDs that are revealed (presentation mode, one-by-one). */
  revealedItemIds?: Set<string>;
  /** Additional class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SmartItemsList({
  config,
  data,
  isEditing = false,
  onDataChange,
  onConfigChange,
  focusedItemId,
  revealedItemIds,
  className,
}: SmartItemsListProps) {
  const s = sizeConfig[config.size ?? 'md'];
  const iconSet = getIconSet(config.iconSetId);

  // Collapse state (local for interactivity)
  const [collapsedMap, setCollapsedMap] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    let sectionIndex = 0;
    function initCollapse(items: SmartListItem[], depth: number) {
      for (const item of items) {
        if (item.isHeader) sectionIndex++;
        if (item.collapsed != null) {
          map.set(item.id, item.collapsed);
        } else if (item.children?.length) {
          map.set(item.id, shouldStartCollapsed(item, depth, config.collapseDefault, sectionIndex));
        }
        if (item.children) initCollapse(item.children, depth + 1);
      }
    }
    initCollapse(data.items, 0);
    return map;
  });

  // Quick-pick state
  const [quickPickItemId, setQuickPickItemId] = useState<string | null>(null);
  // Secondary icon quick-pick state (Phase 2)
  const [secondaryPickItemId, setSecondaryPickItemId] = useState<string | null>(null);

  // Expandable detail state (Phase 2)
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);

  // Self-managed disclosure state (Phase 2)
  const [revealStep, setRevealStep] = useState<number>(
    config.revealMode === 'all-at-once' ? Infinity : 0,
  );

  // Editing: focused item for keyboard nav
  const [editFocusId, setEditFocusId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Visibility counts (SL-F09)
  const visCounts = useMemo(() => countVisibility(data.items), [data.items]);

  // Effective items: apply visibility filter (SL-F09), status filter (SL-F16), grouping (SL-F16)
  const effectiveItems = useMemo(() => {
    let items = data.items;

    // SL-F09: In presentation mode, remove hidden items
    if (!isEditing) {
      function filterVisible(list: SmartListItem[]): SmartListItem[] {
        return list
          .filter((item) => item.visible !== false)
          .map((item) => item.children
            ? { ...item, children: filterVisible(item.children) }
            : item,
          );
      }
      items = filterVisible(items);
    }

    // SL-F16: Filter by statuses
    if (config.filterByStatuses && config.filterByStatuses.length > 0) {
      const allowed = new Set(config.filterByStatuses);
      function filterByStatus(list: SmartListItem[]): SmartListItem[] {
        return list
          .filter((item) => {
            if (item.isHeader) return true; // keep headers
            return item.primaryIcon ? allowed.has(item.primaryIcon.iconId) : false;
          })
          .map((item) => item.children
            ? { ...item, children: filterByStatus(item.children) }
            : item,
          );
      }
      items = filterByStatus(items);
    }

    // SL-F16: Group by status
    if (config.groupByStatus) {
      items = groupItemsByStatus(items, config.iconSetId, getIconSet);
    }

    return items;
  }, [data.items, isEditing, config.filterByStatuses, config.groupByStatus, config.iconSetId]);

  // Flatten for rendering
  const flat = useMemo(
    () => flattenItems(
      effectiveItems,
      0,
      config.numberingFormat,
      config.childNumberingFormat,
      config.showNumbering ?? false,
      collapsedMap,
    ),
    [effectiveItems, config.numberingFormat, config.childNumberingFormat, config.showNumbering, collapsedMap],
  );

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  // --- Handlers ---

  const toggleCollapse = useCallback((itemId: string) => {
    setCollapsedMap((prev) => {
      const next = new Map(prev);
      next.set(itemId, !prev.get(itemId));
      return next;
    });
  }, []);

  const handleIconClick = useCallback((e: MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (isEditing) {
      setQuickPickItemId((prev) => (prev === itemId ? null : itemId));
    }
  }, [isEditing]);

  const handleIconChange = useCallback((itemId: string, iconRef: IconRef) => {
    if (!onDataChange) return;
    function updateIcon(items: SmartListItem[]): SmartListItem[] {
      return items.map((item) => {
        if (item.id === itemId) return { ...item, primaryIcon: iconRef };
        if (item.children) return { ...item, children: updateIcon(item.children) };
        return item;
      });
    }
    onDataChange({ items: updateIcon(data.items) });
    setQuickPickItemId(null);
  }, [data.items, onDataChange]);

  const handleTextChange = useCallback((itemId: string, text: string) => {
    if (!onDataChange) return;
    function updateText(items: SmartListItem[]): SmartListItem[] {
      return items.map((item) => {
        if (item.id === itemId) return { ...item, text };
        if (item.children) return { ...item, children: updateText(item.children) };
        return item;
      });
    }
    onDataChange({ items: updateText(data.items) });
  }, [data.items, onDataChange]);

  // Keyboard handling for list editing
  const handleKeyDown = useCallback((e: KeyboardEvent, itemId: string) => {
    if (!isEditing || !onDataChange) return;

    const allIds = flat.map((f) => f.item.id);
    const currentIndex = allIds.indexOf(itemId);

    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        const newId = `item-${Date.now()}`;
        const newItem: SmartListItem = { id: newId, text: '' };
        function insertAfter(items: SmartListItem[]): SmartListItem[] {
          const result: SmartListItem[] = [];
          for (const item of items) {
            result.push(item);
            if (item.id === itemId) result.push(newItem);
            if (item.children) {
              result[result.length - (item.id === itemId ? 2 : 1)] = {
                ...result[result.length - (item.id === itemId ? 2 : 1)],
                children: insertAfter(item.children),
              };
            }
          }
          return result;
        }
        onDataChange({ items: insertAfter(data.items) });
        setTimeout(() => setEditFocusId(newId), 0);
        break;
      }
      case 'Tab': {
        e.preventDefault();
        if (e.shiftKey) {
          // Outdent: move item up one level (simplified — moves to parent's level)
        } else {
          // Indent: make item a child of the item above
        }
        break;
      }
      case 'ArrowUp': {
        if (currentIndex > 0) {
          e.preventDefault();
          setEditFocusId(allIds[currentIndex - 1]);
        }
        break;
      }
      case 'ArrowDown': {
        if (currentIndex < allIds.length - 1) {
          e.preventDefault();
          setEditFocusId(allIds[currentIndex + 1]);
        }
        break;
      }
      case '/': {
        e.preventDefault();
        setQuickPickItemId(itemId);
        break;
      }
      case 'Backspace': {
        const currentItem = flat.find((f) => f.item.id === itemId)?.item;
        if (currentItem && currentItem.text === '') {
          e.preventDefault();
          function removeItem(items: SmartListItem[]): SmartListItem[] {
            return items
              .filter((item) => item.id !== itemId)
              .map((item) =>
                item.children
                  ? { ...item, children: removeItem(item.children) }
                  : item,
              );
          }
          onDataChange({ items: removeItem(data.items) });
          if (currentIndex > 0) setEditFocusId(allIds[currentIndex - 1]);
        }
        break;
      }
      case 'Escape': {
        setEditFocusId(null);
        containerRef.current?.focus();
        break;
      }
    }
  }, [isEditing, onDataChange, data.items, flat]);

  // DnD handler
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onDataChange) return;

    const oldIndex = flat.findIndex((f) => f.item.id === active.id);
    const newIndex = flat.findIndex((f) => f.item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Simple reorder at the top level (flatten-based reorder)
    const topLevelIds = data.items.map((i) => i.id);
    const activeTopIdx = topLevelIds.indexOf(active.id as string);
    const overTopIdx = topLevelIds.indexOf(over.id as string);

    if (activeTopIdx !== -1 && overTopIdx !== -1) {
      const newItems = [...data.items];
      const [moved] = newItems.splice(activeTopIdx, 1);
      newItems.splice(overTopIdx, 0, moved);
      onDataChange({ items: newItems });
    }
  }, [flat, data.items, onDataChange]);

  // Secondary icon handler (Phase 2)
  const handleSecondaryIconChange = useCallback((itemId: string, iconRef: IconRef) => {
    if (!onDataChange) return;
    function updateIcon(items: SmartListItem[]): SmartListItem[] {
      return items.map((item) => {
        if (item.id === itemId) return { ...item, secondaryIcon: iconRef };
        if (item.children) return { ...item, children: updateIcon(item.children) };
        return item;
      });
    }
    onDataChange({ items: updateIcon(data.items) });
    setSecondaryPickItemId(null);
  }, [data.items, onDataChange]);

  // Toggle item visibility (SL-F09)
  const toggleVisibility = useCallback((itemId: string) => {
    if (!onDataChange) return;
    function toggle(items: SmartListItem[]): SmartListItem[] {
      return items.map((item) => {
        if (item.id === itemId) return { ...item, visible: item.visible === false ? true : false };
        if (item.children) return { ...item, children: toggle(item.children) };
        return item;
      });
    }
    onDataChange({ items: toggle(data.items) });
  }, [data.items, onDataChange]);

  // Bulk visibility (SL-F09)
  const setAllVisibility = useCallback((visible: boolean) => {
    if (!onDataChange) return;
    function setVis(items: SmartListItem[]): SmartListItem[] {
      return items.map((item) => ({
        ...item,
        visible: item.isHeader ? undefined : visible,
        children: item.children ? setVis(item.children) : undefined,
      }));
    }
    onDataChange({ items: setVis(data.items) });
  }, [data.items, onDataChange]);

  // Show only items with a specific status (SL-F09)
  const showOnlyStatus = useCallback((iconId: string) => {
    if (!onDataChange) return;
    function setVis(items: SmartListItem[]): SmartListItem[] {
      return items.map((item) => ({
        ...item,
        visible: item.isHeader ? undefined : (item.primaryIcon?.iconId === iconId),
        children: item.children ? setVis(item.children) : undefined,
      }));
    }
    onDataChange({ items: setVis(data.items) });
  }, [data.items, onDataChange]);

  // Toggle detail expansion (Phase 2)
  const toggleDetail = useCallback((itemId: string) => {
    setExpandedDetailId((prev) => (prev === itemId ? null : itemId));
  }, []);

  // Resolve secondary icon set (Phase 2)
  const secondaryIconSet = config.secondaryIconSetId
    ? getIconSet(config.secondaryIconSetId)
    : undefined;

  // Progress summary (Phase 2)
  const progress = useMemo(() => {
    if (!config.progressSummary || config.progressSummary === 'hidden') return null;
    return computeProgress(data.items, config.iconSetId, getIconSet);
  }, [data.items, config.iconSetId, config.progressSummary]);

  // Self-managed disclosure: compute revealed set (Phase 2)
  const selfManagedDisclosure = !revealedItemIds && config.revealMode !== 'all-at-once';
  const { effectiveRevealed, effectiveFocused } = useMemo(() => {
    if (!selfManagedDisclosure) {
      return { effectiveRevealed: revealedItemIds ?? null, effectiveFocused: focusedItemId ?? null };
    }

    const nonHeaderFlat = flat.filter((f) => !f.item.isHeader);
    if (revealStep >= nonHeaderFlat.length) {
      return { effectiveRevealed: null, effectiveFocused: null };
    }

    const revealed = new Set<string>();
    let focused: string | null = null;

    if (config.revealMode === 'by-section') {
      // Group items by section (items between headers)
      const sections: string[][] = [];
      let current: string[] = [];
      for (const f of flat) {
        if (f.item.isHeader) {
          if (current.length) sections.push(current);
          current = [];
          revealed.add(f.item.id); // headers always visible up to current section
        } else {
          current.push(f.item.id);
        }
      }
      if (current.length) sections.push(current);

      for (let si = 0; si <= Math.min(revealStep, sections.length - 1); si++) {
        for (const id of sections[si]) revealed.add(id);
        if (si === revealStep) focused = sections[si][0];
      }
      // Re-add headers for revealed sections
      let sectionIdx = -1;
      for (const f of flat) {
        if (f.item.isHeader) { sectionIdx++; if (sectionIdx <= revealStep) revealed.add(f.item.id); }
      }
    } else {
      // one-by-one modes
      for (let i = 0; i <= Math.min(revealStep, nonHeaderFlat.length - 1); i++) {
        revealed.add(nonHeaderFlat[i].item.id);
        // Also reveal parent headers
        for (const f of flat) {
          if (f.item.isHeader) revealed.add(f.item.id);
        }
      }
      if (revealStep < nonHeaderFlat.length) {
        focused = nonHeaderFlat[revealStep].item.id;
      }
    }

    return { effectiveRevealed: revealed, effectiveFocused: focused };
  }, [selfManagedDisclosure, revealedItemIds, focusedItemId, flat, revealStep, config.revealMode]);

  // Determine visibility for one-by-one-focus mode
  const getItemOpacity = useCallback((itemId: string): number => {
    if (!effectiveRevealed) return 1;
    if (!effectiveRevealed.has(itemId)) return 0;
    if (config.revealMode === 'one-by-one-focus') {
      return effectiveFocused === itemId ? 1 : 0.45;
    }
    return 1; // accumulate and by-section: all revealed items fully visible
  }, [effectiveRevealed, effectiveFocused, config.revealMode]);

  // Disclosure keyboard handler (Phase 2)
  const handleDisclosureKey = useCallback((e: globalThis.KeyboardEvent) => {
    if (!selfManagedDisclosure || isEditing) return;
    const maxStep = config.revealMode === 'by-section'
      ? flat.filter((f) => f.item.isHeader).length // section count approximation
      : flat.filter((f) => !f.item.isHeader).length;

    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      setRevealStep((prev) => Math.min(prev + 1, maxStep));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setRevealStep((prev) => Math.max(prev - 1, 0));
    }
  }, [selfManagedDisclosure, isEditing, flat, config.revealMode]);

  // Build entrance motion
  const entrance = config.entrance ?? 'none';
  const stagger = config.stagger ?? 0.08;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const sortableIds = flat.map((f) => f.item.id);

  const listContent = (
    <div
      ref={containerRef}
      className={cn('flex flex-col', s.gap, className)}
      tabIndex={isEditing ? 0 : undefined}
    >
      {flat.map(({ item, depth, flatIndex, numberLabel }) => {
        const itemDelay = flatIndex * stagger;
        const motion$ = getEntranceMotion(entrance, itemDelay);
        const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
          ? entranceVariants[entrance as keyof typeof entranceVariants]
          : undefined;

        const resolved = item.primaryIcon
          ? resolveIconRef(item.primaryIcon.setId, item.primaryIcon.iconId)
          : undefined;
        const resolvedSecondary = item.secondaryIcon
          ? resolveIconRef(item.secondaryIcon.setId, item.secondaryIcon.iconId)
          : undefined;
        const accentColor: AccentColor = resolved?.color ?? '#3b82f6';
        const hasChildren = !!(item.children && item.children.length > 0);
        // When numbering is enabled and item has no icon, the number IS the bullet
        const showIcon = !!(resolved || (!numberLabel && !item.isHeader));
        const isCollapsed = collapsedMap.get(item.id) ?? false;
        const isFocused = editFocusId === item.id;
        const opacity = getItemOpacity(item.id);
        const isDetailExpanded = expandedDetailId === item.id;

        // Conditional formatting background (Phase 2)
        const condFmtBg = config.conditionalFormatting && resolved
          ? `${accentColor}${FORMAT_OPACITY[config.conditionalFormatIntensity ?? 'subtle']}`
          : undefined;

        // --- Header row ---
        if (item.isHeader) {
          return (
            <motion.div
              key={item.id}
              className={cn('flex items-center gap-[0.375em]', s.pad, 'group/item')}
              style={{ paddingLeft: em(depth * s.indent), opacity }}
              variants={variants}
              initial={motion$?.initial}
              animate={motion$?.animate}
              transition={motion$?.transition}
            >
              {accentColor !== '#3b82f6' && (
                <div
                  className="rounded-[0.125em] shrink-0"
                  style={{ width: em(3), height: em(s.iconBox * 0.7), backgroundColor: accentColor }}
                />
              )}
              <span className={cn(s.header, 'text-white/90')}>{item.text}</span>
            </motion.div>
          );
        }

        // --- Item row ---
        return (
          <SortableItemWrapper key={item.id} id={item.id} isEditing={isEditing}>
            <motion.div
              className={cn(
                'flex items-center gap-[0.5em] rounded-[0.5em] group/item',
                s.pad,
                effectiveFocused === item.id && 'ring-1 ring-white/20 bg-white/[0.04]',
              )}
              style={{
                paddingLeft: em(depth * s.indent),
                opacity,
                backgroundColor: condFmtBg,
              }}
              variants={variants}
              initial={motion$?.initial}
              animate={motion$?.animate}
              transition={motion$?.transition}
            >
              {/* Collapse chevron for items with children */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleCollapse(item.id)}
                  className="shrink-0 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                  style={{ width: em(s.chevronSize), height: em(s.chevronSize), marginRight: em(2) }}
                >
                  <motion.span
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontSize: em(s.chevronSize), lineHeight: 1 }}
                  >
                    ▾
                  </motion.span>
                </button>
              ) : (
                <div style={{ width: em(s.chevronSize + 2), flexShrink: 0 }} />
              )}

              {/* Number label */}
              {numberLabel && (
                <span
                  className={cn(s.title, 'text-white/40 font-mono shrink-0 text-right')}
                  style={{ width: em(s.numberWidth), marginRight: em(4) }}
                >
                  {numberLabel}
                </span>
              )}

              {/* Icon / quick-pick area — hidden when numbering replaces icon */}
              {showIcon && (
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      'flex items-center justify-center shrink-0 transition-colors',
                      isEditing && 'cursor-pointer rounded-[0.25em] hover:bg-white/[0.06]',
                    )}
                    style={{
                      width: em(s.iconBox),
                      height: em(s.iconBox),
                    }}
                    onClick={(e) => handleIconClick(e, item.id)}
                  >
                    {resolved
                      ? renderIcon(resolved.icon, { size: em(s.icon), color: accentColor })
                      : (
                        <div
                          className="rounded-full"
                          style={{
                            width: em(s.icon * 0.5),
                            height: em(s.icon * 0.5),
                            backgroundColor: `${accentColor}60`,
                          }}
                        />
                      )}
                  </div>

                  {/* Icon quick-pick popover */}
                  {quickPickItemId === item.id && iconSet && (
                    <IconQuickPick
                      iconSet={iconSet}
                      currentIconId={item.primaryIcon?.iconId}
                      onSelect={(iconId) =>
                        handleIconChange(item.id, { setId: config.iconSetId, iconId })
                      }
                      onClose={() => setQuickPickItemId(null)}
                    />
                  )}
                </div>
              )}

              {/* Secondary icon (Phase 2 — SL-F03) */}
              {config.secondaryIconSetId && (
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      'flex items-center justify-center shrink-0 transition-colors',
                      isEditing && 'cursor-pointer rounded-[0.25em] hover:bg-white/[0.06]',
                    )}
                    style={{
                      width: em(s.iconBox * 0.8),
                      height: em(s.iconBox * 0.8),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isEditing) setSecondaryPickItemId((prev) => prev === item.id ? null : item.id);
                    }}
                  >
                    {resolvedSecondary
                      ? renderIcon(resolvedSecondary.icon, {
                          size: em(s.icon * 0.8),
                          color: resolvedSecondary.color,
                        })
                      : isEditing && (
                        <div
                          className="rounded-full border border-dashed border-white/15"
                          style={{ width: em(s.icon * 0.4), height: em(s.icon * 0.4) }}
                        />
                      )}
                  </div>
                  {secondaryPickItemId === item.id && secondaryIconSet && (
                    <IconQuickPick
                      iconSet={secondaryIconSet}
                      currentIconId={item.secondaryIcon?.iconId}
                      onSelect={(iconId) =>
                        handleSecondaryIconChange(item.id, { setId: config.secondaryIconSetId!, iconId })
                      }
                      onClose={() => setSecondaryPickItemId(null)}
                    />
                  )}
                </div>
              )}

              {/* Text area */}
              <div className="flex flex-col gap-[0.125em] min-w-0 flex-1">
                {config.showAccentBar && (
                  <div
                    className="absolute left-0 top-[0.25em] bottom-[0.25em] rounded-full"
                    style={{ width: em(2), backgroundColor: accentColor }}
                  />
                )}
                <div className="flex items-center gap-[0.375em]">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleTextChange(item.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      onFocus={() => setEditFocusId(item.id)}
                      autoFocus={isFocused}
                      className={cn(
                        s.title,
                        'font-medium bg-transparent border-none outline-none w-full',
                        'focus:bg-white/[0.03] rounded px-[0.25em] -mx-[0.25em]',
                        item.visible === false ? 'text-white/35 line-through' : 'text-white/85',
                      )}
                      placeholder="Type item text..."
                    />
                  ) : (
                    <span className={cn(s.title, 'font-medium text-white/85')}>
                      {item.text}
                    </span>
                  )}
                  {/* Detail expand affordance */}
                  {item.detail && config.detailMode !== 'none' && (
                    <button
                      type="button"
                      onClick={() => toggleDetail(item.id)}
                      className={cn(
                        'shrink-0 text-white/30 hover:text-white/60 transition-colors',
                        isDetailExpanded && 'text-white/60',
                      )}
                      style={{ fontSize: em(s.chevronSize) }}
                      title="Toggle detail"
                    >
                      <motion.span
                        animate={{ rotate: isDetailExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'inline-block', lineHeight: 1 }}
                      >
                        ›
                      </motion.span>
                    </button>
                  )}
                </div>
                {item.description && (
                  <span className={cn(s.desc, item.visible === false ? 'text-white/25' : 'text-white/45', 'leading-relaxed')}>
                    {item.description}
                  </span>
                )}
              </div>

              {/* Visibility toggle — edit mode only (SL-F09) */}
              {isEditing && !item.isHeader && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(item.id); }}
                  className={cn(
                    'shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity',
                    item.visible === false ? '!opacity-100 text-white/25' : 'text-white/40 hover:text-white/70',
                  )}
                  style={{ fontSize: em(s.icon * 0.75) }}
                  title={item.visible === false ? 'Show in presentation' : 'Hide from presentation'}
                >
                  {item.visible === false ? '◌' : '◉'}
                </button>
              )}
            </motion.div>

            {/* Expandable detail content (Phase 2 — SL-F08) */}
            <AnimatePresence>
              {isDetailExpanded && item.detail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                  style={{ paddingLeft: em(depth * s.indent + s.chevronSize + s.iconBox + 16) }}
                >
                  <div className={cn(
                    'rounded-[0.375em] bg-white/[0.03] border border-white/[0.06]',
                    'px-[0.75em] py-[0.5em] mt-[0.125em] mb-[0.25em]',
                  )}>
                    <span className={cn(s.desc, 'text-white/60 leading-relaxed whitespace-pre-wrap')}>
                      {item.detail}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SortableItemWrapper>
        );
      })}
    </div>
  );

  // Progress summary bar (Phase 2 — SL-F13)
  const progressBar = progress && progress.total > 0 ? (
    <div className={cn('flex flex-col gap-[0.25em]', s.pad)}>
      {/* Segmented bar */}
      <div className="flex h-[0.375em] rounded-full overflow-hidden bg-white/[0.06]">
        {progress.segments.map((seg) => (
          <motion.div
            key={seg.iconId}
            className="h-full"
            style={{ backgroundColor: seg.color, width: `${(seg.count / progress.total) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.count / progress.total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </div>
      {/* Text summary */}
      <div className="flex flex-wrap gap-x-[0.75em] gap-y-[0.125em]">
        {progress.segments.map((seg) => (
          <span key={seg.iconId} className={cn(s.desc, 'text-white/50')}>
            <span style={{ color: seg.color }} className="font-semibold">{seg.count}</span>
            {' '}{seg.label}
          </span>
        ))}
        <span className={cn(s.desc, 'text-white/30')}>
          of {progress.total} total
        </span>
      </div>
    </div>
  ) : null;

  // Disclosure controls (Phase 2 — keyboard hint)
  const disclosureHint = selfManagedDisclosure ? (
    <div className={cn('flex items-center gap-[0.5em]', s.pad, 'text-white/25')}>
      <span className={cn(s.desc)}>
        ← → to step through items
      </span>
    </div>
  ) : null;

  // Toolbar: visibility count + bulk actions + filter indicator (SL-F09 + SL-F16)
  const showToolbar = isEditing && (visCounts.visible < visCounts.total || config.filterByStatuses?.length || config.groupByStatus);
  const toolbar = showToolbar ? (
    <div className={cn('flex items-center flex-wrap gap-x-[0.75em] gap-y-[0.125em]', s.pad)}>
      {/* Visibility count */}
      {visCounts.visible < visCounts.total && (
        <span className={cn(s.desc, 'text-white/40')}>
          Showing <span className="text-white/60 font-semibold">{visCounts.visible}</span> of {visCounts.total} items
        </span>
      )}
      {/* Bulk actions */}
      {visCounts.visible < visCounts.total && (
        <button
          type="button"
          onClick={() => setAllVisibility(true)}
          className={cn(s.desc, 'text-blue-400/60 hover:text-blue-400 transition-colors')}
        >
          Show all
        </button>
      )}
      {visCounts.visible > 0 && visCounts.visible < visCounts.total && (
        <span className={cn(s.desc, 'text-white/20')}>·</span>
      )}
      {visCounts.visible > 0 && (
        <button
          type="button"
          onClick={() => setAllVisibility(false)}
          className={cn(s.desc, 'text-white/30 hover:text-white/50 transition-colors')}
        >
          Hide all
        </button>
      )}
      {/* Quick-filter by status */}
      {iconSet && (
        <>
          <span className={cn(s.desc, 'text-white/20')}>·</span>
          {iconSet.entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => showOnlyStatus(entry.id)}
              className={cn(s.desc, 'text-white/30 hover:text-white/50 transition-colors')}
              title={`Show only "${entry.label}"`}
            >
              {typeof entry.icon === 'string' ? entry.icon : entry.label.charAt(0)}
            </button>
          ))}
        </>
      )}
      {/* Filter indicator */}
      {config.filterByStatuses && config.filterByStatuses.length > 0 && (
        <span className={cn(s.desc, 'text-amber-400/60 ml-auto')}>
          ⚡ Filtered: {config.filterByStatuses.join(', ')}
        </span>
      )}
      {config.groupByStatus && (
        <span className={cn(s.desc, 'text-purple-400/60 ml-auto')}>
          ▤ Grouped by status
        </span>
      )}
    </div>
  ) : null;

  // Non-editing filter/group indicator
  const filterIndicator = !isEditing && (config.filterByStatuses?.length || config.groupByStatus) ? (
    <div className={cn('flex items-center gap-[0.5em]', s.pad)}>
      {config.filterByStatuses && config.filterByStatuses.length > 0 && (
        <span className={cn(s.desc, 'text-white/30')}>
          Filtered view
        </span>
      )}
      {config.groupByStatus && (
        <span className={cn(s.desc, 'text-white/30')}>
          Grouped by status
        </span>
      )}
    </div>
  ) : null;

  // Compose final output
  const composedContent = (
    <div
      onKeyDown={selfManagedDisclosure ? (e) => handleDisclosureKey(e as unknown as globalThis.KeyboardEvent) : undefined}
      tabIndex={selfManagedDisclosure ? 0 : undefined}
      className={selfManagedDisclosure ? 'outline-none' : undefined}
    >
      {toolbar}
      {filterIndicator}
      {config.progressSummary === 'above' && progressBar}
      {disclosureHint}
      {listContent}
      {config.progressSummary === 'below' && progressBar}
    </div>
  );

  if (isEditing) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          {composedContent}
        </SortableContext>
      </DndContext>
    );
  }

  return composedContent;
}
