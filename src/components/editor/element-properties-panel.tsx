'use client';

import type { SlideElement } from '@/types/slide';

/**
 * Element properties panel
 * See docs/modules/story-editor/element-properties.md for full spec
 */

interface ElementPropertiesPanelProps {
  element: SlideElement | null;
  onUpdate: (updates: Partial<SlideElement>) => void;
  onPreviewAnimation: () => void;
}

export function ElementPropertiesPanel({
  element,
  onUpdate,
  onPreviewAnimation,
}: ElementPropertiesPanelProps) {
  if (!element) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Select an element to edit its properties
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-sm font-medium">Element Properties</h3>
      <p className="text-xs text-muted-foreground">Type: {element.type}</p>

      {/* TODO: Implement full property editors:
          - Text content input
          - Position X/Y inputs
          - Size W/H inputs
          - Font family/size selectors
          - Color picker
          - Animation type/duration/delay/easing controls
          - Preview animation button
      */}
      <div className="space-y-2">
        <label className="text-xs font-medium">Content</label>
        <textarea
          className="w-full rounded border p-2 text-sm"
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </div>
    </div>
  );
}
