// Extracted from docs/modules/animation-engine/element-animations/README.md

import type { Slide, SlideElement } from '@/types/slide';
import type { AnimationTemplate, ElementSelector } from '@/types/animation';
import { flattenItemsAsElements } from '@/lib/flatten-items';

/**
 * Apply an animation template to a slide.
 * Matches template selectors to slide elements and applies animation rules.
 * Preserves element content and position — only modifies animation properties.
 *
 * Works with both the new `items` tree (via flattenItemsAsElements) and
 * the legacy `elements` array. Updates the `elements` array on the returned slide.
 *
 * @param slide - The slide to apply the template to
 * @param template - The animation template to apply
 * @returns A new slide with updated animation properties
 */
export function applyTemplate(
  slide: Slide,
  template: AnimationTemplate
): Slide {
  // Derive flat elements from the item tree when available
  const elements = slide.items.length > 0
    ? flattenItemsAsElements(slide.items)
    : slide.elements;

  const updatedElements = elements.map((element, index) => {
    // Find the first matching animation rule for this element
    const rule = template.sequences.find((seq) =>
      matchesSelector(element, seq.selector, index)
    );

    if (!rule) return element;

    // Resolve stagger delay to a numeric value based on element index
    const delay = rule.delay + index * 0.15;

    return {
      ...element,
      animation: {
        ...element.animation,
        type: rule.animation,
        duration: rule.duration,
        delay,
        easing: rule.easing,
      },
    };
  });

  return {
    ...slide,
    elements: updatedElements,
    duration: template.defaultDuration * 1000, // convert seconds to ms
  };
}

/**
 * Check if a slide element matches a template element selector.
 *
 * @param element - The slide element to check
 * @param selector - The selector criteria from the template
 * @param index - The element's index in the slide
 * @returns Whether the element matches the selector
 */
function matchesSelector(
  element: SlideElement,
  selector: ElementSelector,
  index: number
): boolean {
  if (selector.type && selector.type !== element.type) return false;
  if (selector.index !== undefined && selector.index !== index) return false;
  // TODO: Match on selector.role when element role property is available
  return true;
}
