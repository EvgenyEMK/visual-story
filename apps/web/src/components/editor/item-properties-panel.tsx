'use client';

import type { SlideItem, ElementStyle } from '@/types/slide';
import { ColorPicker } from '@/components/ui/color-picker';

/**
 * Properties panel for editing a selected SlideItem's style.
 *
 * Adapts displayed sections based on the item type:
 *   - AtomItem (text): Typography + Fill + Border
 *   - AtomItem (shape): Dimensions + Fill + Border + Shadow
 *   - AtomItem (icon): Font Size + Color
 *   - CardItem: Fill + Border + Shadow + Padding
 *   - LayoutItem: Fill + Border + Padding (structural containers)
 *
 * Does NOT include Position (items are flow-positioned) or Animation
 * (out of scope for this story).
 */

interface ItemPropertiesPanelProps {
  item: SlideItem | null;
  onUpdate: (itemId: string, updates: Partial<SlideItem>) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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
      <span className="text-[0.625rem] text-muted-foreground">{label}</span>
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
      <span className="text-[0.625rem] text-muted-foreground">{label}</span>
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

export function ItemPropertiesPanel({ item, onUpdate }: ItemPropertiesPanelProps) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Select an element to edit its properties
      </div>
    );
  }

  const style: ElementStyle = item.style ?? {};

  const updateStyle = (patch: Partial<ElementStyle>) => {
    onUpdate(item.id, { style: { ...style, ...patch } } as Partial<SlideItem>);
  };

  // Determine what sections to show based on item type
  const isTextAtom = item.type === 'atom' && item.atomType === 'text';
  const isShapeAtom = item.type === 'atom' && item.atomType === 'shape';
  const isIconAtom = item.type === 'atom' && item.atomType === 'icon';
  const isImageAtom = item.type === 'atom' && item.atomType === 'image';
  const isCard = item.type === 'card';
  const isLayout = item.type === 'layout';

  // Derive item type label
  let typeLabel: string = item.type;
  if (item.type === 'atom') typeLabel = item.atomType;

  return (
    <div className="space-y-5 p-4 overflow-y-auto">
      {/* --- Header --- */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Properties</h3>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground uppercase">
          {typeLabel}
        </span>
      </div>

      {/* --- Content (text atoms only, plain text fallback) --- */}
      {isTextAtom && (
        <section className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Content</label>
          <textarea
            className="w-full rounded-md border bg-background p-2 text-sm"
            value={item.content}
            rows={3}
            onChange={(e) =>
              onUpdate(item.id, { content: e.target.value } as Partial<SlideItem>)
            }
          />
          <p className="text-[0.625rem] text-muted-foreground">
            Tip: Double-click the element on the canvas for rich-text editing.
          </p>
        </section>
      )}

      {/* --- Typography (text and icon atoms) --- */}
      {(isTextAtom || isIconAtom) && (
        <section className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Typography</label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Font Size"
              value={style.fontSize}
              onChange={(v) => updateStyle({ fontSize: v })}
              min={8}
              max={200}
            />
            {isTextAtom && (
              <SelectInput
                label="Font Family"
                value={style.fontFamily ?? ''}
                options={FONT_FAMILIES}
                onChange={(v) => updateStyle({ fontFamily: v || undefined })}
              />
            )}
          </div>
          {isTextAtom && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <SelectInput
                  label="Font Weight"
                  value={style.fontWeight ?? 'normal'}
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
                  value={style.fontStyle ?? 'normal'}
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
                  value={style.textAlign ?? 'left'}
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
                  value={style.color ?? '#000000'}
                  onChange={(v) => updateStyle({ color: v })}
                />
              </div>
            </>
          )}
          {isIconAtom && (
            <ColorPicker
              label="Icon Color"
              value={style.color ?? '#000000'}
              onChange={(v) => updateStyle({ color: v })}
            />
          )}
        </section>
      )}

      {/* --- Dimensions (shape and image atoms) --- */}
      {(isShapeAtom || isImageAtom) && (
        <section className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Dimensions</label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Width"
              value={style.width}
              onChange={(v) => updateStyle({ width: v })}
              min={10}
              placeholder="Auto"
            />
            <NumberInput
              label="Height"
              value={style.height}
              onChange={(v) => updateStyle({ height: v })}
              min={10}
              placeholder="Auto"
            />
          </div>
        </section>
      )}

      {/* --- Fill & Background (all item types) --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Fill</label>
        <div className="grid grid-cols-2 gap-2">
          <ColorPicker
            label="Background"
            value={style.backgroundColor ?? '#ffffff'}
            onChange={(v) => updateStyle({ backgroundColor: v })}
          />
          <NumberInput
            label="Opacity %"
            value={style.opacity !== undefined ? Math.round(style.opacity * 100) : 100}
            onChange={(v) =>
              updateStyle({ opacity: v !== undefined ? v / 100 : undefined })
            }
            min={0}
            max={100}
            step={5}
          />
        </div>
      </section>

      {/* --- Border (all item types) --- */}
      <section className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Border</label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Width"
            value={style.borderWidth}
            onChange={(v) => updateStyle({ borderWidth: v })}
            min={0}
            max={20}
          />
          <NumberInput
            label="Radius"
            value={style.borderRadius}
            onChange={(v) => updateStyle({ borderRadius: v })}
            min={0}
            max={999}
          />
        </div>
        <ColorPicker
          label="Border Color"
          value={style.borderColor ?? '#e2e8f0'}
          onChange={(v) => updateStyle({ borderColor: v })}
        />
      </section>

      {/* --- Shadow (cards, shapes, images) --- */}
      {(isCard || isShapeAtom || isImageAtom) && (
        <section className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Shadow</label>
          <SelectInput
            label="Preset"
            value={style.boxShadow ?? ''}
            options={SHADOW_PRESETS}
            onChange={(v) => updateStyle({ boxShadow: v || undefined })}
          />
        </section>
      )}

      {/* --- Spacing (cards, layouts) --- */}
      {(isCard || isLayout) && (
        <section className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Spacing</label>
          <NumberInput
            label="Padding"
            value={style.padding}
            onChange={(v) => updateStyle({ padding: v })}
            min={0}
            max={100}
          />
        </section>
      )}
    </div>
  );
}
