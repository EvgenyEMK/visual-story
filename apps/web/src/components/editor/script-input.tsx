'use client';

import type { ContentIntent } from '@/types/presentation';

/**
 * Script input component for the story editor
 * See docs/modules/story-editor/script-input.md for full spec
 */

interface ScriptInputProps {
  presentationId: string;
  initialValue?: string;
  onSave: (script: string) => Promise<void>;
  onIntentChange: (intent: ContentIntent) => void;
}

export function ScriptInput({
  presentationId,
  initialValue = '',
  onSave,
  onIntentChange,
}: ScriptInputProps) {
  // TODO: Implement script input with auto-save, section markers, file upload
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="min-h-[300px] w-full rounded-md border p-4 font-mono text-sm"
        defaultValue={initialValue}
        placeholder="Paste or type your script here... Use --- to mark section breaks"
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>0 characters</span>
        <span>Auto-saved</span>
      </div>
    </div>
  );
}
