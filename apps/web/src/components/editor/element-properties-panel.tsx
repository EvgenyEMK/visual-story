'use client';

import type { SlideElement, AnimationType, EasingType, TriggerMode } from '@/types/slide';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Play } from 'lucide-react';

/**
 * Element properties panel — edit content, style, and animation for the selected element.
 * Provides full ElementStyle controls including typography, background, border,
 * shadow, opacity, dimensions, and padding.
 *
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

const FONT_FAMILIES = [
  { value: '', label: 'Default' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'serif', label: 'Serif' },
  { value: 'system-ui', label: 'System' },
];

const SHADOW_PRESETS: { value: string; label: string }[] = [
  { value: '', label: 'None' },
  { value: '0 1px 2px rgba(0,0,0,0.05)', label: 'SM' },
  { value: '0 1px 3px rgba(0,0,0,0.1)', label: 'MD' },
  { value: '0 4px 6px rgba(0,0,0,0.1)', label: 'LG' },
  { value: '0 10px 15px rgba(0,0,0,0.1)', label: 'XL' },
  { value: '0 20px 25px rgba(0,0,0,0.15)', label: '2XL' },
];

// ---------------------------------------------------------------------------
// Reusable input components
// ---------------------------------------------------------------------------

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
}: {
  label: string;
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <input
        type="number"
        className="w-full rounded-md border bg-background px-2 py-1 text-sm"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? undefined : Number(v));
        }}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <select
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

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

  const isTextType = element.type === 'text';

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
        {isTextType && (
          <p className="text-[10px] text-muted-foreground">
            Tip: Double-click the element on the canvas for rich-text editing.
          </p>
        )}
      </section>

      {/* --- Position --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="X"
            value={element.position.x}
            onChange={(v) =>
              onUpdate({ position: { ...element.position, x: v ?? 0 } })
            }
          />
          <NumberInput
            label="Y"
            value={element.position.y}
            onChange={(v) =>
              onUpdate({ position: { ...element.position, y: v ?? 0 } })
            }
          />
        </div>
      </section>

      {/* --- Dimensions --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Width"
            value={element.style.width}
            onChange={(v) => updateStyle({ width: v })}
            min={10}
            placeholder="Auto"
          />
          <NumberInput
            label="Height"
            value={element.style.height}
            onChange={(v) => updateStyle({ height: v })}
            min={10}
            placeholder="Auto"
          />
        </div>
      </section>

      {/* --- Typography (shown for text elements) --- */}
      {isTextType && (
        <section className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Typography</label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Font Size"
              value={element.style.fontSize}
              onChange={(v) => updateStyle({ fontSize: v })}
              min={8}
              max={200}
            />
            <SelectInput
              label="Font Family"
              value={element.style.fontFamily ?? ''}
              options={FONT_FAMILIES}
              onChange={(v) => updateStyle({ fontFamily: v || undefined })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SelectInput
              label="Font Weight"
              value={element.style.fontWeight ?? 'normal'}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
              ]}
              onChange={(v) =>
                updateStyle({ fontWeight: v as 'normal' | 'bold' })
              }
            />
            <SelectInput
              label="Font Style"
              value={element.style.fontStyle ?? 'normal'}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Italic' },
              ]}
              onChange={(v) =>
                updateStyle({ fontStyle: v as 'normal' | 'italic' })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SelectInput
              label="Text Align"
              value={element.style.textAlign ?? 'left'}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
              onChange={(v) =>
                updateStyle({ textAlign: v as 'left' | 'center' | 'right' })
              }
            />
            <ColorPicker
              label="Text Color"
              value={element.style.color ?? '#000000'}
              onChange={(v) => updateStyle({ color: v })}
            />
          </div>
        </section>
      )}

      {/* --- Fill & Background --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Fill</label>
        <div className="grid grid-cols-2 gap-2">
          <ColorPicker
            label="Background"
            value={element.style.backgroundColor ?? '#ffffff'}
            onChange={(v) => updateStyle({ backgroundColor: v })}
          />
          <NumberInput
            label="Opacity"
            value={element.style.opacity !== undefined ? Math.round(element.style.opacity * 100) : 100}
            onChange={(v) =>
              updateStyle({ opacity: v !== undefined ? v / 100 : undefined })
            }
            min={0}
            max={100}
            step={5}
          />
        </div>
      </section>

      {/* --- Border --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Border</label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Width"
            value={element.style.borderWidth}
            onChange={(v) => updateStyle({ borderWidth: v })}
            min={0}
            max={20}
          />
          <NumberInput
            label="Radius"
            value={element.style.borderRadius}
            onChange={(v) => updateStyle({ borderRadius: v })}
            min={0}
            max={999}
          />
        </div>
        <ColorPicker
          label="Border Color"
          value={element.style.borderColor ?? '#e2e8f0'}
          onChange={(v) => updateStyle({ borderColor: v })}
        />
      </section>

      {/* --- Shadow --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Shadow</label>
        <SelectInput
          label="Preset"
          value={element.style.boxShadow ?? ''}
          options={SHADOW_PRESETS}
          onChange={(v) => updateStyle({ boxShadow: v || undefined })}
        />
      </section>

      {/* --- Spacing --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Spacing</label>
        <NumberInput
          label="Padding"
          value={element.style.padding}
          onChange={(v) => updateStyle({ padding: v })}
          min={0}
          max={100}
        />
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
        <SelectInput
          label="Type"
          value={element.animation.type}
          options={ANIMATION_TYPES}
          onChange={(v) => updateAnimation({ type: v as AnimationType })}
        />

        {/* Duration + Delay */}
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Duration (s)"
            value={element.animation.duration}
            onChange={(v) => updateAnimation({ duration: v ?? 0.5 })}
            min={0.1}
            max={5}
            step={0.1}
          />
          <NumberInput
            label="Delay (s)"
            value={element.animation.delay}
            onChange={(v) => updateAnimation({ delay: v ?? 0 })}
            min={0}
            max={10}
            step={0.1}
          />
        </div>

        {/* Easing */}
        <SelectInput
          label="Easing"
          value={element.animation.easing}
          options={EASING_TYPES}
          onChange={(v) => updateAnimation({ easing: v as EasingType })}
        />

        {/* Trigger mode override */}
        <SelectInput
          label="Trigger Mode"
          value={element.animation.triggerMode ?? 'inherit'}
          options={TRIGGER_MODES}
          onChange={(v) =>
            updateAnimation({
              triggerMode: v === 'inherit' ? undefined : (v as TriggerMode),
            })
          }
        />
      </section>
    </div>
  );
}
