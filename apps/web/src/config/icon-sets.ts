/**
 * Built-in icon set definitions for Smart Item Lists.
 *
 * Each icon set provides a vocabulary of icons that can be assigned to list items.
 * Icon sets are referenced by ID in SmartListConfig.iconSetId.
 */

import type { IconSet } from '@/types/smart-list';
import {
  Square,
  SquareCheck,
  SquareMinus,
  SquareX,
  Circle,
  CircleCheck,
  CircleDot,
  CircleX,
  CircleSlash,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Built-in Icon Sets
// ---------------------------------------------------------------------------

export const ICON_SET_BULLETS: IconSet = {
  id: 'bullets',
  name: 'Bullets',
  description: 'Simple bullet point styles',
  builtIn: true,
  entries: [
    { id: 'filled', label: 'Filled', icon: '●', color: '#94a3b8', order: 0 },
    { id: 'hollow', label: 'Hollow', icon: '○', color: '#94a3b8', order: 1 },
    { id: 'dash', label: 'Dash', icon: '—', color: '#94a3b8', order: 2 },
    { id: 'arrow', label: 'Arrow', icon: '→', color: '#94a3b8', order: 3 },
    { id: 'check', label: 'Check', icon: '✓', color: '#22c55e', order: 4 },
  ],
};

export const ICON_SET_TASK_STATUS: IconSet = {
  id: 'task-status',
  name: 'Task Status',
  description: 'To-do, in progress, done, blocked',
  builtIn: true,
  entries: [
    { id: 'todo', label: 'To Do', icon: '○', color: '#94a3b8', order: 0 },
    { id: 'in-progress', label: 'In Progress', icon: '◐', color: '#3b82f6', order: 1 },
    { id: 'done', label: 'Done', icon: '●', color: '#22c55e', order: 2 },
    { id: 'blocked', label: 'Blocked', icon: '⊘', color: '#ef4444', order: 3 },
  ],
};

export const ICON_SET_PRIORITY: IconSet = {
  id: 'priority',
  name: 'Priority',
  description: 'P1 critical through P4 low',
  builtIn: true,
  entries: [
    { id: 'p1', label: 'P1 Critical', icon: '🔴', color: '#ef4444', order: 0 },
    { id: 'p2', label: 'P2 High', icon: '🟠', color: '#f97316', order: 1 },
    { id: 'p3', label: 'P3 Medium', icon: '🟡', color: '#eab308', order: 2 },
    { id: 'p4', label: 'P4 Low', icon: '🟢', color: '#22c55e', order: 3 },
  ],
};

export const ICON_SET_RISK: IconSet = {
  id: 'risk',
  name: 'Risk / Warning',
  description: 'OK, warning, issue, risk, critical',
  builtIn: true,
  entries: [
    { id: 'ok', label: 'OK', icon: '✅', color: '#22c55e', order: 0 },
    { id: 'warning', label: 'Warning', icon: '⚠️', color: '#eab308', order: 1 },
    { id: 'issue', label: 'Issue', icon: '⛔', color: '#f97316', order: 2 },
    { id: 'risk', label: 'Risk', icon: '🔥', color: '#ef4444', order: 3 },
  ],
};

export const ICON_SET_CHECKBOX: IconSet = {
  id: 'checkbox',
  name: 'Checkbox',
  description: 'Square checkbox icons: unchecked, checked, partial, cancelled',
  builtIn: true,
  entries: [
    { id: 'unchecked', label: 'Unchecked', icon: Square, color: '#94a3b8', order: 0 },
    { id: 'checked', label: 'Checked', icon: SquareCheck, color: '#22c55e', order: 1 },
    { id: 'partial', label: 'Partial', icon: SquareMinus, color: '#3b82f6', order: 2 },
    { id: 'cancelled', label: 'Cancelled', icon: SquareX, color: '#ef4444', order: 3 },
  ],
};

export const ICON_SET_CIRCLE_CHECK: IconSet = {
  id: 'circle-check',
  name: 'Circle Status',
  description: 'Circle icons: empty, active, done, blocked, cancelled',
  builtIn: true,
  entries: [
    { id: 'empty', label: 'To Do', icon: Circle, color: '#94a3b8', order: 0 },
    { id: 'active', label: 'In Progress', icon: CircleDot, color: '#3b82f6', order: 1 },
    { id: 'done', label: 'Done', icon: CircleCheck, color: '#22c55e', order: 2 },
    { id: 'blocked', label: 'Blocked', icon: CircleSlash, color: '#ef4444', order: 3 },
    { id: 'cancelled', label: 'Cancelled', icon: CircleX, color: '#6b7280', order: 4 },
  ],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/** All built-in icon sets, indexed by ID. */
export const BUILT_IN_ICON_SETS: Record<string, IconSet> = {
  [ICON_SET_BULLETS.id]: ICON_SET_BULLETS,
  [ICON_SET_TASK_STATUS.id]: ICON_SET_TASK_STATUS,
  [ICON_SET_PRIORITY.id]: ICON_SET_PRIORITY,
  [ICON_SET_RISK.id]: ICON_SET_RISK,
  [ICON_SET_CHECKBOX.id]: ICON_SET_CHECKBOX,
  [ICON_SET_CIRCLE_CHECK.id]: ICON_SET_CIRCLE_CHECK,
};

/** Get an icon set by ID (built-in only for now). */
export function getIconSet(id: string): IconSet | undefined {
  return BUILT_IN_ICON_SETS[id];
}

/** Get all available icon sets. */
export function getAllIconSets(): IconSet[] {
  return Object.values(BUILT_IN_ICON_SETS);
}

/** Resolve an IconRef to the concrete IconSetEntry. */
export function resolveIconRef(
  setId: string,
  iconId: string,
): { icon: IconSet['entries'][number]['icon']; color: string; label: string } | undefined {
  const set = getIconSet(setId);
  if (!set) return undefined;
  const entry = set.entries.find((e) => e.id === iconId);
  if (!entry) return undefined;
  return { icon: entry.icon, color: entry.color, label: entry.label };
}
