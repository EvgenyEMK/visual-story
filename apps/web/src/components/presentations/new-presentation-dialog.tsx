/**
 * New presentation creation dialog with name input and content type selection.
 * @source docs/modules/user-management/presentations-library.md
 */
'use client';

import { useState } from 'react';
import type { ContentIntent } from '@/types/presentation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NewPresentationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, intent: ContentIntent) => void;
}

// ---------------------------------------------------------------------------
// Intent option metadata
// ---------------------------------------------------------------------------

const INTENT_OPTIONS: {
  value: ContentIntent;
  label: string;
  description: string;
}[] = [
  {
    value: 'educational',
    label: 'Educational',
    description: 'Tutorials, courses, and learning content',
  },
  {
    value: 'promotional',
    label: 'Promotional',
    description: 'Marketing, product launches, and ads',
  },
  {
    value: 'storytelling',
    label: 'Storytelling',
    description: 'Narratives, case studies, and brand stories',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NewPresentationDialog({
  open,
  onOpenChange,
  onCreate,
}: NewPresentationDialogProps) {
  const [name, setName] = useState('');
  const [intent, setIntent] = useState<ContentIntent>('educational');

  const handleCreate = () => {
    const presentationName = name.trim() || 'Untitled';
    onCreate(presentationName, intent);

    // Reset form
    setName('');
    setIntent('educational');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Presentation</DialogTitle>
          <DialogDescription>
            Start a new presentation. Choose a name and content type.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Presentation name */}
          <div className="space-y-2">
            <Label htmlFor="presentation-name">Presentation Name</Label>
            <Input
              id="presentation-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Presentation"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              autoFocus
            />
          </div>

          {/* Content type */}
          <div className="space-y-2">
            <Label>Content Type</Label>
            <RadioGroup
              value={intent}
              onValueChange={(v) => setIntent(v as ContentIntent)}
              className="space-y-2"
            >
              {INTENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                    intent === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <RadioGroupItem
                    value={option.value}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium">{option.label}</span>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Presentation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
