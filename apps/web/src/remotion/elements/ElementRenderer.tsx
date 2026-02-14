/**
 * Renders a slide element based on its type
 * TODO: Implement text, icon, shape, image element renderers
 */

import type { SlideElement } from '@/types/slide';

interface ElementRendererProps {
  element: SlideElement;
}

export function ElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    case 'text':
      return <div style={{ fontSize: element.style.fontSize }}>{element.content}</div>;
    case 'icon':
      return <div>{element.content}</div>;
    case 'shape':
      return <div>{element.content}</div>;
    case 'image':
      return <div>{element.content}</div>;
    default:
      return null;
  }
}
