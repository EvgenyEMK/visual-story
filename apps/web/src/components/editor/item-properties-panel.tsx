'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SlideItem, WidgetItem, ElementStyle } from '@/types/slide';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  getWidgetSchema,
  getVisibleFields,
  type WidgetTypeDescriptor,
  type WidgetConfigFieldDescriptor,
  type WidgetFieldGroup,
} from '@/config/widget-schemas';

/**
 * Properties panel for editing a selected SlideItem's style or widget config.
 *
 * Adapts displayed sections based on the item type:
 *   - AtomItem (text): Typography + Fill + Border
 *   - AtomItem (shape): Dimensions + Fill + Border + Shadow
 *   - AtomItem (icon): Font Size + Color
 *   - CardItem: Fill + Border + Shadow + Padding
 *   - LayoutItem: Fill + Border + Padding (structural containers)
 *   - WidgetItem: Schema-driven config panel (auto-rendered from WidgetTypeDescriptor)
 *
 * For WidgetItems, the panel reads the widget's registered schema and renders
 * form controls for each config field automatically — no widget-specific UI
 * code is needed. See `@/config/widget-schemas.ts`.
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
// Schema-Driven Widget Config Field Renderer
// ---------------------------------------------------------------------------

/**
 * Renders a single config field based on its WidgetConfigFieldDescriptor.
 * Supports: select, toggle, number, slider, text, color, multi-select, icon-set.
 */
function WidgetFieldControl({
  field,
  value,
  onChange,
}: {
  field: WidgetConfigFieldDescriptor;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const resolved = value ?? field.defaultValue;

  switch (field.type) {
    case 'select':
    case 'icon-set':
      return (
        <SelectInput
          label={field.label}
          value={String(resolved ?? '')}
          options={field.options ?? []}
          onChange={(v) => onChange(v || undefined)}
        />
      );

    case 'toggle':
      return (
        <div className="flex items-center justify-between py-1">
          <span className="text-[0.625rem] text-muted-foreground">{field.label}</span>
          <button
            type="button"
            role="switch"
            aria-checked={!!resolved}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border transition-colors ${
              resolved
                ? 'bg-primary border-primary'
                : 'bg-muted border-border'
            }`}
            onClick={() => onChange(!resolved)}
          >
            <span
              className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow ring-0 transition-transform ${
                resolved ? 'translate-x-4' : 'translate-x-0.5'
              }`}
              style={{ marginTop: 1 }}
            />
          </button>
        </div>
      );

    case 'number':
      return (
        <NumberInput
          label={field.label}
          value={resolved as number | undefined}
          onChange={(v) => onChange(v)}
          min={field.min}
          max={field.max}
          step={field.step}
          placeholder={field.placeholder}
        />
      );

    case 'slider':
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.625rem] text-muted-foreground">{field.label}</span>
            <span className="text-[0.625rem] text-muted-foreground tabular-nums">
              {typeof resolved === 'number' ? resolved.toFixed(2) : '—'}
              {field.suffix ? ` ${field.suffix}` : ''}
            </span>
          </div>
          <input
            type="range"
            className="w-full h-1.5 accent-primary cursor-pointer"
            value={typeof resolved === 'number' ? resolved : field.defaultValue as number ?? 0}
            min={field.min ?? 0}
            max={field.max ?? 1}
            step={field.step ?? 0.01}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );

    case 'text':
      return (
        <div className="space-y-1">
          <span className="text-[0.625rem] text-muted-foreground">{field.label}</span>
          <input
            type="text"
            className="w-full rounded-md border bg-background px-2 py-1 text-sm"
            value={String(resolved ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value || undefined)}
          />
        </div>
      );

    case 'color':
      return (
        <ColorPicker
          label={field.label}
          value={String(resolved ?? '#000000')}
          onChange={(v) => onChange(v)}
        />
      );

    case 'multi-select':
      return (
        <div className="space-y-1">
          <span className="text-[0.625rem] text-muted-foreground">{field.label}</span>
          {field.options && field.options.length > 0 ? (
            <div className="space-y-0.5">
              {field.options.map((opt) => {
                const selectedValues = Array.isArray(resolved) ? resolved as string[] : [];
                const isChecked = selectedValues.includes(opt.value);
                return (
                  <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border"
                      checked={isChecked}
                      onChange={() => {
                        const next = isChecked
                          ? selectedValues.filter((v) => v !== opt.value)
                          : [...selectedValues, opt.value];
                        onChange(next);
                      }}
                    />
                    <span className="text-[0.6875rem]">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="text-[0.625rem] text-muted-foreground italic">No options available</p>
          )}
        </div>
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Widget Config Group Section
// ---------------------------------------------------------------------------

function WidgetConfigGroupSection({
  group,
  fields,
  config,
  onConfigChange,
}: {
  group: WidgetFieldGroup;
  fields: WidgetConfigFieldDescriptor[];
  config: Record<string, unknown>;
  onConfigChange: (key: string, value: unknown) => void;
}) {
  const [collapsed, setCollapsed] = useState(group.defaultCollapsed ?? false);
  const canCollapse = group.collapsible !== false;

  if (fields.length === 0) return null;

  return (
    <section className="space-y-2">
      <button
        type="button"
        className={`flex items-center gap-2 w-full text-left ${canCollapse ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => canCollapse && setCollapsed(!collapsed)}
      >
        {canCollapse && (
          <span
            className="text-muted-foreground shrink-0 transition-transform duration-200 text-[0.5rem]"
            style={{ transform: collapsed ? 'rotate(-90deg)' : undefined }}
          >
            ▼
          </span>
        )}
        {group.icon && <span className="text-xs">{group.icon}</span>}
        <span className="text-xs font-medium text-muted-foreground flex-1">{group.label}</span>
      </button>
      {!collapsed && (
        <div className="space-y-2 pl-0.5">
          {fields.map((field) => (
            <WidgetFieldControl
              key={field.key}
              field={field}
              value={config[field.key]}
              onChange={(val) => onConfigChange(field.key, val)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Widget Config Panel (schema-driven)
// ---------------------------------------------------------------------------

function WidgetConfigPanel({
  widget,
  schema,
  onUpdate,
}: {
  widget: WidgetItem;
  schema: WidgetTypeDescriptor;
  onUpdate: (itemId: string, updates: Partial<SlideItem>) => void;
}) {
  const config = (widget.config ?? {}) as Record<string, unknown>;

  const handleConfigChange = useCallback(
    (key: string, value: unknown) => {
      const newConfig = { ...config, [key]: value };
      onUpdate(widget.id, { config: newConfig } as Partial<SlideItem>);
    },
    [config, widget.id, onUpdate],
  );

  // Pre-compute visible fields per group (respects visibleWhen conditions)
  const groupFields = useMemo(() => {
    const result: Map<string, WidgetConfigFieldDescriptor[]> = new Map();
    for (const group of schema.fieldGroups) {
      result.set(group.id, getVisibleFields(schema, group.id, config));
    }
    return result;
  }, [schema, config]);

  return (
    <>
      {/* Widget identity header */}
      <div className="flex items-center gap-2 pb-2 border-b mb-2">
        <span className="text-base">{schema.icon}</span>
        <div>
          <div className="text-sm font-medium">{schema.displayName}</div>
          <div className="text-[0.625rem] text-muted-foreground">{schema.description}</div>
        </div>
      </div>

      {/* Config groups */}
      {schema.fieldGroups.map((group) => {
        const fields = groupFields.get(group.id) ?? [];
        return (
          <WidgetConfigGroupSection
            key={group.id}
            group={group}
            fields={fields}
            config={config}
            onConfigChange={handleConfigChange}
          />
        );
      })}

      {/* Data summary */}
      <section className="space-y-2 pt-2 border-t">
        <label className="text-xs font-medium text-muted-foreground">Data</label>
        <div className="text-[0.6875rem] text-muted-foreground">
          {widget.data && typeof widget.data === 'object' && 'items' in widget.data
            ? `${(widget.data.items as unknown[]).length} items`
            : 'No data'
          }
        </div>
        <p className="text-[0.625rem] text-muted-foreground">
          Use the dedicated editor to manage list items, or open the data table view.
        </p>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ItemPropertiesPanel({ item, onUpdate }: ItemPropertiesPanelProps) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Select an element to edit its properties
      </div>
    );
  }

  // --- Widget items: use schema-driven config panel ---
  if (item.type === 'widget') {
    const widgetItem = item as WidgetItem;
    const schema = getWidgetSchema(widgetItem.widgetType);

    if (schema) {
      return (
        <div className="space-y-4 p-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Widget Config</h3>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-primary uppercase">
              {schema.displayName}
            </span>
          </div>
          <WidgetConfigPanel widget={widgetItem} schema={schema} onUpdate={onUpdate} />
        </div>
      );
    }

    // Fallback for unknown widget types
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-sm text-muted-foreground gap-2">
        <span className="text-2xl">🔧</span>
        <span>Widget: {widgetItem.widgetType}</span>
        <span className="text-[0.625rem]">No configuration schema registered.</span>
      </div>
    );
  }

  // --- Non-widget items: existing style editor ---
  const style: ElementStyle = item.style ?? {};

  const updateStyle = (patch: Partial<ElementStyle>) => {
    onUpdate(item.id, { style: { ...style, ...patch } } as Partial<SlideItem>);
  };

  const isTextAtom = item.type === 'atom' && item.atomType === 'text';
  const isShapeAtom = item.type === 'atom' && item.atomType === 'shape';
  const isIconAtom = item.type === 'atom' && item.atomType === 'icon';
  const isImageAtom = item.type === 'atom' && item.atomType === 'image';
  const isCard = item.type === 'card';
  const isLayout = item.type === 'layout';

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
