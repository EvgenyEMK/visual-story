// Extracted from docs/modules/ai-assistant/visual-suggestions.md

import { openai } from './openai';
import type { Slide } from '@/types/slide';
import type { IconSuggestion, SuggestedIcon, IconEntry } from '@/types/ai';
import { searchIcons as searchIconLibrary } from '@/config/icon-library';
import { flattenItemsAsElements } from '@/lib/flatten-items';

/**
 * AI prompt template for icon matching.
 * Used to get intelligent icon suggestions based on slide content.
 */
const iconMatchingPrompt = (slideContent: string) => `
You are a visual design assistant. Given the following slide content, suggest relevant icon names
from the Lucide icon library that would visually enhance the presentation.

Slide content:
"""
${slideContent}
"""

Return a JSON array of icon suggestions:
{
  "suggestions": [
    {
      "icon_name": "<lucide icon name, e.g. trending-up>",
      "reasoning": "<why this icon fits>",
      "keywords": ["<matched keyword>"]
    }
  ]
}

Suggest 3-5 icons. Use only standard Lucide icon names.
`;

/**
 * Suggest icons for slide elements using AI + keyword matching.
 * Combines local keyword search with AI-powered suggestions.
 *
 * @param slide - The slide to generate icon suggestions for
 * @returns Array of icon suggestions per text element
 */
export async function suggestIcons(slide: Slide): Promise<IconSuggestion[]> {
  const suggestions: IconSuggestion[] = [];

  const elements = slide.items.length > 0
    ? flattenItemsAsElements(slide.items)
    : slide.elements;
  for (const element of elements) {
    if (element.type === 'text') {
      const keywords = extractKeywords(element.content);
      const matches = matchIconsToKeywords(keywords);

      if (matches.length > 0) {
        suggestions.push({
          forText: element.content,
          slideId: slide.id,
          icons: matches.slice(0, 5).map((icon) => ({
            iconName: icon.name,
            reason: `Icons related to: ${keywords.join(', ')}`,
            relevance: 1,
          })),
        });
      }
    }
  }

  return suggestions;
}

/**
 * Match icons to a list of keywords from the local icon library.
 * Searches each keyword and combines unique results.
 */
export function matchIconsToKeywords(keywords: string[]): IconEntry[] {
  const seen = new Set<string>();
  const results: IconEntry[] = [];

  for (const keyword of keywords) {
    const matches = searchIconLibrary(keyword);
    for (const match of matches) {
      if (!seen.has(match.name)) {
        seen.add(match.name);
        results.push(match);
      }
    }
  }

  return results;
}

/**
 * Search icons by query string.
 * Delegates to the icon library index.
 *
 * @param query - Search term (e.g., "growth", "team")
 * @returns Matching icon entries from the library
 */
export function searchIcons(query: string): IconEntry[] {
  return searchIconLibrary(query);
}

/**
 * Extract keywords from text by removing stop words.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in',
    'for', 'on', 'with', 'at', 'by', 'from', 'and', 'or', 'but', 'not',
    'this', 'that', 'it', 'its', 'your', 'my', 'we', 'our', 'you', 'they',
    'their',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}
