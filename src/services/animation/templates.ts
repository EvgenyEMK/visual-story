// Extracted from docs/modules/animation-engine/animation-templates.md

import {
  ANIMATION_TEMPLATE_CATALOG,
  getTemplateCatalogEntry,
  getTemplatesByCategory as getTemplatesByCategoryFromConfig,
} from '@/config/animation-templates';
import type { TemplateCatalogEntry } from '@/config/animation-templates';
import type { TemplateCategory } from '@/types/animation';

/**
 * Get a single animation template catalog entry by ID.
 *
 * @param id - Template ID (e.g., 'fade-simple', 'bounce-in')
 * @returns The template entry or undefined if not found
 */
export function getTemplate(id: string): TemplateCatalogEntry | undefined {
  return getTemplateCatalogEntry(id);
}

/**
 * Get all templates in a given category.
 *
 * @param category - Template category ('minimal' | 'dynamic' | 'professional' | 'storytelling')
 * @returns Array of templates matching the category
 */
export function getTemplatesByCategory(
  category: TemplateCategory
): TemplateCatalogEntry[] {
  return getTemplatesByCategoryFromConfig(category);
}

/**
 * Get all available animation templates.
 *
 * @returns Array of all templates in the catalog
 */
export function getAllTemplates(): readonly TemplateCatalogEntry[] {
  return ANIMATION_TEMPLATE_CATALOG;
}
