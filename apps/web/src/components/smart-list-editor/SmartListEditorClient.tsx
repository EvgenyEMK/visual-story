'use client';

import { useState, useEffect } from 'react';
import type { SmartListItem } from '@/types/smart-list';
import type { SmartListSource } from '@/types/smart-list-source';
import { useSmartListSourceStore, selectSourceById } from '@/stores/smart-list-source-store';
import { getSmartListRepository } from '@/services/smart-lists';
import { getIconSet, resolveIconRef } from '@/config/icon-sets';
import { Link } from '@/lib/navigation';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, LayoutGrid, LayoutList, Upload, Plus, Camera } from 'lucide-react';
import { SmartListEditorTable } from './SmartListEditorTable';
import { SmartListEditorKanban } from './SmartListEditorKanban';
import { SmartListEditorImport } from './SmartListEditorImport';

interface SmartListEditorClientProps {
  presentationId: string;
  listId: string;
}

function countItems(items: SmartListItem[]): number {
  let count = 0;
  for (const item of items) {
    if (!item.isHeader) count++;
    if (item.children) count += countItems(item.children);
  }
  return count;
}

export function SmartListEditorClient({
  presentationId,
  listId,
}: SmartListEditorClientProps) {
  const source = useSmartListSourceStore(selectSourceById(listId));
  const updateSource = useSmartListSourceStore((s) => s.updateSource);
  const [activeView, setActiveView] = useState<'table' | 'kanban' | 'import'>(
    'table',
  );

  const repo = getSmartListRepository();
  const iconSet = source ? getIconSet(source.iconSetId) : undefined;

  const handleRename = async (name: string) => {
    if (!listId) return;
    await repo.updateSource(listId, { name });
  };

  const handleSnapshot = async () => {
    if (!listId) return;
    const name = `Snapshot ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    await repo.createSnapshot(listId, name);
  };

  if (!source) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8">
        <h1 className="text-xl font-semibold text-foreground">
          List not found
        </h1>
        <p className="max-w-md text-center text-sm text-muted-foreground">
          This list may not be loaded yet. Open it from a presentation context,
          or ensure the list exists and you have access.
        </p>
        <Link href={`/presentations/${presentationId}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to presentation
          </Button>
        </Link>
      </div>
    );
  }

  const itemCount = countItems(source.items);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <Link href={`/presentations/${presentationId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
            <InlineEditableName
              value={source.name}
              onSave={handleRename}
              className="text-base font-semibold"
            />
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{itemCount} items</span>
              <span>·</span>
              <span>Updated {formatRelativeTime(source.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2">
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
            <TabsList className="h-8">
              <TabsTrigger value="table" className="h-7 gap-1.5 px-3 text-xs">
                <LayoutList className="h-3.5 w-3.5" />
                Table
              </TabsTrigger>
              <TabsTrigger value="kanban" className="h-7 gap-1.5 px-3 text-xs">
                <LayoutGrid className="h-3.5 w-3.5" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="import" className="h-7 gap-1.5 px-3 text-xs">
                <Upload className="h-3.5 w-3.5" />
                Import
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex-1" />
          {activeView !== 'import' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={async () => {
                  await repo.addItems(listId, [
                    { id: crypto.randomUUID(), text: 'New item', visible: true },
                  ]);
                }}
                className="h-8 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add item
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSnapshot}
                className="h-8 gap-1.5"
              >
                <Camera className="h-3.5 w-3.5" />
                Snapshot
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        {activeView === 'table' && (
          <SmartListEditorTable
            listId={listId}
            items={source.items}
            iconSetId={source.iconSetId}
          />
        )}
        {activeView === 'kanban' && iconSet && (
          <SmartListEditorKanban
            listId={listId}
            items={source.items}
            iconSet={iconSet}
          />
        )}
        {activeView === 'import' && (
          <SmartListEditorImport listId={listId} onImportComplete={() => setActiveView('table')} />
        )}
      </main>
    </div>
  );
}

function InlineEditableName({
  value,
  onSave,
  className,
}: {
  value: string;
  onSave: (name: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setDraft(value);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn('h-8 max-w-xs border-primary', className)}
        autoFocus
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        'rounded px-1 py-0.5 text-left hover:bg-muted/80',
        className,
      )}
    >
      {value}
    </button>
  );
}

