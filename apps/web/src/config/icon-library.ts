/**
 * Icon library categories and example entries for VisualStory.
 *
 * The full icon index is built at build-time from Lucide, Heroicons, and
 * Phosphor metadata. This file contains the category definitions and a
 * representative set of entries for search seeding and tests.
 *
 * @source docs/modules/ai-assistant/visual-suggestions.md — Icon Library (MVP)
 */

import type { IconEntry, IconIndex } from '@/types/ai';

// ---------------------------------------------------------------------------
// Icon Categories
// ---------------------------------------------------------------------------

/** Category metadata for the icon gallery UI. */
export interface IconCategory {
  /** Internal slug. */
  id: string;
  /** Display name. */
  label: string;
  /** Approximate number of icons in this category. */
  iconCount: string;
  /** Example icon names. */
  examples: string[];
}

/**
 * Icon categories available in the MVP.
 * @source docs/modules/ai-assistant/visual-suggestions.md — Icon Library (MVP)
 */
export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: 'business',
    label: 'Business',
    iconCount: '50+',
    examples: ['chart', 'briefcase', 'handshake', 'growth'],
  },
  {
    id: 'technology',
    label: 'Technology',
    iconCount: '50+',
    examples: ['code', 'cloud', 'device', 'security'],
  },
  {
    id: 'communication',
    label: 'Communication',
    iconCount: '30+',
    examples: ['email', 'chat', 'phone', 'video'],
  },
  {
    id: 'education',
    label: 'Education',
    iconCount: '30+',
    examples: ['book', 'graduation', 'lightbulb', 'brain'],
  },
  {
    id: 'arrows-indicators',
    label: 'Arrows & Indicators',
    iconCount: '40+',
    examples: ['direction', 'progress', 'checkmark'],
  },
  {
    id: 'people',
    label: 'People',
    iconCount: '30+',
    examples: ['user', 'team', 'community'],
  },
  {
    id: 'abstract',
    label: 'Abstract',
    iconCount: '40+',
    examples: ['shapes', 'patterns', 'decorative'],
  },
];

// ---------------------------------------------------------------------------
// Example Icon Entries (seed data / reference)
// ---------------------------------------------------------------------------

/**
 * Representative icon entries from the library.
 * In production, the full index is generated from Lucide/Heroicons metadata.
 *
 * @source docs/modules/ai-assistant/visual-suggestions.md — Icon Library Index
 */
export const ICON_LIBRARY_ENTRIES: IconEntry[] = [
  // Business
  { name: 'trending-up', category: 'business', tags: ['chart', 'growth', 'increase', 'analytics'], source: 'lucide' },
  { name: 'briefcase', category: 'business', tags: ['work', 'job', 'business', 'professional'], source: 'lucide' },
  { name: 'bar-chart-2', category: 'business', tags: ['chart', 'data', 'analytics', 'statistics'], source: 'lucide' },
  { name: 'dollar-sign', category: 'business', tags: ['money', 'finance', 'price', 'revenue'], source: 'lucide' },
  { name: 'target', category: 'business', tags: ['goal', 'aim', 'focus', 'objective'], source: 'lucide' },

  // Technology
  { name: 'code', category: 'technology', tags: ['programming', 'development', 'software', 'engineer'], source: 'lucide' },
  { name: 'cloud', category: 'technology', tags: ['storage', 'server', 'hosting', 'saas'], source: 'lucide' },
  { name: 'smartphone', category: 'technology', tags: ['device', 'mobile', 'phone', 'app'], source: 'lucide' },
  { name: 'shield', category: 'technology', tags: ['security', 'protection', 'safe', 'guard'], source: 'lucide' },
  { name: 'cpu', category: 'technology', tags: ['processor', 'hardware', 'chip', 'computing'], source: 'lucide' },

  // Communication
  { name: 'mail', category: 'communication', tags: ['email', 'message', 'inbox', 'send'], source: 'lucide' },
  { name: 'message-circle', category: 'communication', tags: ['chat', 'conversation', 'comment', 'discuss'], source: 'lucide' },
  { name: 'phone', category: 'communication', tags: ['call', 'contact', 'telephone', 'dial'], source: 'lucide' },
  { name: 'video', category: 'communication', tags: ['camera', 'record', 'stream', 'meeting'], source: 'lucide' },

  // Education
  { name: 'book-open', category: 'education', tags: ['book', 'read', 'learn', 'study'], source: 'lucide' },
  { name: 'graduation-cap', category: 'education', tags: ['graduation', 'school', 'degree', 'academic'], source: 'lucide' },
  { name: 'lightbulb', category: 'education', tags: ['idea', 'insight', 'innovation', 'creative'], source: 'lucide' },
  { name: 'brain', category: 'education', tags: ['think', 'intelligence', 'mind', 'smart'], source: 'lucide' },

  // Arrows & Indicators
  { name: 'arrow-right', category: 'arrows-indicators', tags: ['direction', 'next', 'forward', 'go'], source: 'lucide' },
  { name: 'check-circle', category: 'arrows-indicators', tags: ['checkmark', 'done', 'complete', 'success'], source: 'lucide' },
  { name: 'arrow-up-right', category: 'arrows-indicators', tags: ['progress', 'improve', 'increase', 'grow'], source: 'lucide' },
  { name: 'chevrons-right', category: 'arrows-indicators', tags: ['fast-forward', 'skip', 'advance', 'progress'], source: 'lucide' },

  // People
  { name: 'user', category: 'people', tags: ['person', 'profile', 'account', 'individual'], source: 'lucide' },
  { name: 'users', category: 'people', tags: ['team', 'group', 'community', 'people'], source: 'lucide' },
  { name: 'heart-handshake', category: 'people', tags: ['partnership', 'collaboration', 'deal', 'agreement'], source: 'lucide' },

  // Abstract
  { name: 'hexagon', category: 'abstract', tags: ['shape', 'geometric', 'pattern', 'decorative'], source: 'lucide' },
  { name: 'sparkles', category: 'abstract', tags: ['magic', 'highlight', 'special', 'star'], source: 'lucide' },
  { name: 'circle-dot', category: 'abstract', tags: ['point', 'marker', 'node', 'focus'], source: 'lucide' },
];

// ---------------------------------------------------------------------------
// Build a searchable index from the example entries
// ---------------------------------------------------------------------------

/**
 * Build an IconIndex from the provided entries.
 * In production this would be generated at build time from the full icon set.
 */
export function buildIconIndex(entries: IconEntry[] = ICON_LIBRARY_ENTRIES): IconIndex {
  const categories = [...new Set(entries.map((e) => e.category))];
  return {
    icons: entries,
    categories,
    totalCount: entries.length,
  };
}

/** Pre-built index from the example entries. */
export const ICON_INDEX: IconIndex = buildIconIndex();

/**
 * Simple client-side search over the icon library.
 * Matches against name, category, and tags.
 */
export function searchIcons(query: string, entries: IconEntry[] = ICON_LIBRARY_ENTRIES): IconEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return entries;
  return entries.filter(
    (entry) =>
      entry.name.includes(q) ||
      entry.category.includes(q) ||
      entry.tags.some((tag) => tag.includes(q)),
  );
}
