'use client';

import * as React from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Preset color swatches
// ---------------------------------------------------------------------------

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#1e293b', '#475569', '#94a3b8', '#cbd5e1', '#f1f5f9',
  '#991b1b', '#9a3412', '#854d0e', '#166534', '#155e75',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ColorPickerProps {
  /** Current color value (hex string, e.g. '#ff0000'). */
  value: string;
  /** Callback when color changes. */
  onChange: (color: string) => void;
  /** Optional label displayed above the swatch. */
  label?: string;
  /** Optional class name for the trigger button. */
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <span className="text-[10px] text-muted-foreground">{label}</span>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-8 w-full items-center gap-2 rounded-md border bg-background px-2 text-sm hover:bg-accent/50 transition-colors"
          >
            <div
              className="h-4 w-4 shrink-0 rounded border"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs text-muted-foreground font-mono truncate">
              {value}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="space-y-3">
            <HexColorPicker color={value} onChange={onChange} />
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed
              className="w-full rounded-md border bg-background px-2 py-1 text-sm font-mono"
            />
            {/* Preset swatches */}
            <div className="grid grid-cols-10 gap-1">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={cn(
                    'h-5 w-5 rounded border transition-transform hover:scale-110',
                    value === preset && 'ring-2 ring-primary ring-offset-1',
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => onChange(preset)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
