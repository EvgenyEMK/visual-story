'use client';

import { useState } from 'react';
import type { SmartListItem } from '@/types/smart-list';
import type { IconRef } from '@/types/smart-list';
import { getSmartListRepository } from '@/services/smart-lists';
import { getIconSet, resolveIconRef } from '@/config/icon-sets';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { GripVertical, Plus } from 'lucide-react';

interface SmartListEditorTableProps {
  listId: string;
  items: SmartListItem[];
  iconSetId: string;
}

function flattenWithDepth(
  items: SmartListItem[],
  depth = 0,
): Array<{ item: SmartListItem; depth: number }> {
  const result: Array<{ item: SmartListItem; depth: number }> = [];
  for (const item of items) {
    result.push({ item, depth });
    if (item.children?.length) {
      result.push(...flattenWithDepth(item.children, depth + 1));
    }
  }
  return result;
}

export function SmartListEditorTable({
  listId,
  items,
  iconSetId,
}: SmartListEditorTableProps) {
  const repo = getSmartListRepository();
  const iconSet = getIconSet(iconSetId);
  const flatItems = flattenWithDepth(items);

  const handleUpdateItem = async (
    itemId: string,
    updates: Partial<SmartListItem>,
  ) => {
    await repo.updateItem(listId, itemId, updates);
  };

  const handleAddRow = async () => {
    const newItem: SmartListItem = {
      id: crypto.randomUUID(),
      text: 'New item',
      visible: true,
    };
    await repo.addItems(listId, [newItem]);
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="w-8 px-2 py-2 text-left font-semibold" />
            <th className="w-20 px-3 py-2 text-left font-semibold">Icon</th>
            <th className="px-3 py-2 text-left font-semibold">Text</th>
            <th className="px-3 py-2 text-left font-semibold">Description</th>
            <th className="px-3 py-2 text-left font-semibold">Detail</th>
            <th className="w-16 px-3 py-2 text-center font-semibold">
              Visible
            </th>
          </tr>
        </thead>
        <tbody>
          {flatItems.map(({ item, depth }) => (
            <TableRow
              key={item.id}
              item={item}
              depth={depth}
              iconSet={iconSet}
              iconSetId={iconSetId}
              onUpdate={(updates) => handleUpdateItem(item.id, updates)}
            />
          ))}
        </tbody>
      </table>
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddRow}
          className="h-8 gap-1.5 text-muted-foreground"
        >
          <Plus className="h-4 w-4" />
          Add row
        </Button>
      </div>
    </div>
  );
}

interface TableRowProps {
  item: SmartListItem;
  depth: number;
  iconSet: ReturnType<typeof getIconSet>;
  iconSetId: string;
  onUpdate: (updates: Partial<SmartListItem>) => void;
}

function TableRow({ item, depth, iconSet, iconSetId, onUpdate }: TableRowProps) {
  const [editingText, setEditingText] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingDetail, setEditingDetail] = useState(false);

  const resolved = item.primaryIcon
    ? resolveIconRef(iconSetId, item.primaryIcon.iconId)
    : undefined;

  const displayIcon = resolved?.icon;
  const iconDisplay =
    typeof displayIcon === 'string' ? (
      <span>{displayIcon}</span>
    ) : displayIcon ? (
      (displayIcon as React.ComponentType<{ className?: string }>)({
        className: 'h-4 w-4',
      })
    ) : (
      <span className="text-muted-foreground">—</span>
    );

  return (
    <tr
      className={cn(
        'border-b border-border/50 transition-colors hover:bg-muted/30',
        item.isHeader && 'bg-muted/30 font-semibold',
      )}
    >
      <td className="px-2 py-1.5">
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
      </td>
      <td className="px-3 py-1.5">
        {item.isHeader ? (
          <span className="text-muted-foreground">—</span>
        ) : iconSet ? (
          <IconPicker
            iconSetId={iconSetId}
            iconSet={iconSet}
            currentRef={item.primaryIcon}
            onSelect={(ref) => onUpdate({ primaryIcon: ref })}
          />
        ) : (
          iconDisplay
        )}
      </td>
      <td
        className="px-3 py-1.5"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {editingText ? (
          <input
            defaultValue={item.text}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== item.text) onUpdate({ text: v });
              setEditingText(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') setEditingText(false);
            }}
            className="w-full min-w-0 rounded border border-primary bg-transparent px-1.5 py-0.5 text-sm outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingText(true)}
            className="w-full min-w-0 truncate text-left hover:rounded hover:bg-muted/50"
          >
            {item.text || (
              <span className="text-muted-foreground italic">Empty</span>
            )}
          </button>
        )}
      </td>
      <td className="px-3 py-1.5">
        {editingDesc ? (
          <input
            defaultValue={item.description ?? ''}
            onBlur={(e) => {
              const v = e.target.value.trim() || undefined;
              if (v !== (item.description ?? '')) onUpdate({ description: v });
              setEditingDesc(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') setEditingDesc(false);
            }}
            className="w-full min-w-0 rounded border border-primary bg-transparent px-1.5 py-0.5 text-sm outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingDesc(true)}
            className="w-full min-w-0 truncate text-left text-muted-foreground hover:rounded hover:bg-muted/50"
          >
            {item.description || (
              <span className="italic">Add description</span>
            )}
          </button>
        )}
      </td>
      <td className="px-3 py-1.5">
        {editingDetail ? (
          <input
            defaultValue={item.detail ?? ''}
            onBlur={(e) => {
              const v = e.target.value.trim() || undefined;
              if (v !== (item.detail ?? '')) onUpdate({ detail: v });
              setEditingDetail(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') setEditingDetail(false);
            }}
            className="w-full min-w-0 rounded border border-primary bg-transparent px-1.5 py-0.5 text-sm outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingDetail(true)}
            className="w-full min-w-0 truncate text-left text-muted-foreground hover:rounded hover:bg-muted/50"
          >
            {item.detail || <span className="italic">Add detail</span>}
          </button>
        )}
      </td>
      <td className="px-3 py-1.5 text-center">
        {item.isHeader ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <Checkbox
            checked={item.visible !== false}
            onCheckedChange={(checked) =>
              onUpdate({ visible: checked === true })
            }
          />
        )}
      </td>
    </tr>
  );
}

function IconPicker({
  iconSetId,
  iconSet,
  currentRef,
  onSelect,
}: {
  iconSetId: string;
  iconSet: NonNullable<ReturnType<typeof getIconSet>>;
  currentRef?: IconRef;
  onSelect: (ref: IconRef) => void;
}) {
  const [open, setOpen] = useState(false);

  const current = currentRef
    ? resolveIconRef(iconSetId, currentRef.iconId)
    : undefined;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-muted"
      >
        {current ? (
          typeof current.icon === 'string' ? (
            <span>{current.icon}</span>
          ) : (
            (current.icon as React.ComponentType<{ className?: string }>)({
              className: 'h-4 w-4',
            })
          )
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-full z-20 mt-1 flex flex-wrap gap-1 rounded-lg border border-border bg-popover p-2 shadow-lg">
            {iconSet.entries.map((entry) => {
              const iconDisplay =
                typeof entry.icon === 'string' ? (
                  <span>{entry.icon}</span>
                ) : (
                  (entry.icon as React.ComponentType<{ className?: string }>)({
                    className: 'h-4 w-4',
                  })
                );
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    onSelect({ setId: iconSetId, iconId: entry.id });
                    setOpen(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
                  title={entry.label}
                >
                  {iconDisplay}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
