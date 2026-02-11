'use client';

import type { SlideElement, AnimationType, EasingType, TriggerMode } from '@/types/slide';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

/**
 * Element properties panel — edit content, style, and animation for the selected element.
 * @source docs/modules/story-editor/element-properties.md
 * @source docs/modules/animation-engine/element-animations/README.md
 */

interface ElementPropertiesPanelProps {
  element: SlideElement | null;
  onUpdate: (updates: Partial<SlideElement>) => void;
  onPreviewAnimation: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ANIMATION_TYPES: { value: AnimationType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Smooth Fade' },
  { value: 'slide-up', label: 'Float In (Up)' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'scale-in', label: 'Pop Zoom' },
  { value: 'scale-out', label: 'Scale Out' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'typewriter', label: 'Typewriter' },
];

const EASING_TYPES: { value: EasingType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
  { value: 'spring', label: 'Spring' },
];

const TRIGGER_MODES: { value: TriggerMode | 'inherit'; label: string }[] = [
  { value: 'inherit', label: 'Inherit (from slide)' },
  { value: 'auto', label: 'Auto (timed / voice)' },
  { value: 'click', label: 'Click (presenter)' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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

  const updateAnimation = (patch: Partial<SlideElement['animation']>) => {
    onUpdate({ animation: { ...element.animation, ...patch } });
  };

  const updateStyle = (patch: Partial<SlideElement['style']>) => {
    onUpdate({ style: { ...element.style, ...patch } });
  };

  return (
    <div className="space-y-5 p-4 overflow-y-auto">
      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Element Properties</h3>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">
          {element.type}
        </span>
      </div>

      {/* --- Content --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Content</label>
        <textarea
          className="w-full rounded-md border bg-background p-2 text-sm"
          value={element.content}
          rows={3}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </section>

      {/* --- Position --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">X</span>
            <input
              type="number"
              className="w-full rounded-md border bg-background px-2 py-1 text-sm"
              value={element.position.x}
              onChange={(e) =>
                onUpdate({ position: { ...element.position, x: Number(e.target.value) } })
              }
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Y</span>
            <input
              type="number"
              className="w-full rounded-md border bg-background px-2 py-1 text-sm"
              value={element.position.y}
              onChange={(e) =>
                onUpdate({ position: { ...element.position, y: Number(e.target.value) } })
              }
            />
          </div>
        </div>
      </section>

      {/* --- Style --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Style</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Font Size</span>
            <input
              type="number"
              className="w-full rounded-md border bg-background px-2 py-1 text-sm"
              value={element.style.fontSize ?? 16}
              min={8}
              max={200}
              onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Color</span>
            <input
              type="color"
              className="h-8 w-full cursor-pointer rounded-md border bg-background"
              value={element.style.color ?? '#000000'}
              onChange={(e) => updateStyle({ color: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* --- Animation --- */}
      <section className="space-y-3 rounded-lg border bg-muted/30 p-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">Animation</label>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onPreviewAnimation}>
            <Play className="mr-1 h-3 w-3" /> Preview
          </Button>
        </div>

        {/* Animation type */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Type</span>
          <select
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            value={element.animation.type}
            onChange={(e) => updateAnimation({ type: e.target.value as AnimationType })}
          >
            {ANIMATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration + Delay */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Duration (s)</span>
            <input
              type="number"
              className="w-full rounded-md border bg-background px-2 py-1 text-sm"
              value={element.animation.duration}
              min={0.1}
              max={5}
              step={0.1}
              onChange={(e) => updateAnimation({ duration: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Delay (s)</span>
            <input
              type="number"
              className="w-full rounded-md border bg-background px-2 py-1 text-sm"
              value={element.animation.delay}
              min={0}
              max={10}
              step={0.1}
              onChange={(e) => updateAnimation({ delay: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Easing */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Easing</span>
          <select
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            value={element.animation.easing}
            onChange={(e) => updateAnimation({ easing: e.target.value as EasingType })}
          >
            {EASING_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Trigger mode override */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground">Trigger Mode</span>
          <select
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            value={element.animation.triggerMode ?? 'inherit'}
            onChange={(e) => {
              const val = e.target.value;
              updateAnimation({
                triggerMode: val === 'inherit' ? undefined : (val as TriggerMode),
              });
            }}
          >
            {TRIGGER_MODES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}
