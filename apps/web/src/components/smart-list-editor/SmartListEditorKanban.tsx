'use client';

import type { SmartListItem } from '@/types/smart-list';
import type { IconSet } from '@/types/smart-list';
import { cn } from '@/lib/utils';

interface SmartListEditorKanbanProps {
  listId: string;
  items: SmartListItem[];
  iconSet: IconSet;
}

/** Flatten items (no children in Kanban for MVP - top-level only). */
function getTopLevelItems(items: SmartListItem[]): SmartListItem[] {
  return items.filter((i) => !i.isHeader);
}

/** Group items by their primaryIcon status. Items without primaryIcon go to "Unset". */
function groupByStatus(
  items: SmartListItem[],
  iconSet: IconSet,
): Map<string, SmartListItem[]> {
  const map = new Map<string, SmartListItem[]>();

  // One column per icon set entry + "Unset"
  for (const entry of iconSet.entries) {
    map.set(entry.id, []);
  }
  map.set('__unset', []);

  for (const item of items) {
    const key = item.primaryIcon?.iconId ?? '__unset';
    const list = map.get(key) ?? map.get('__unset')!;
    list.push(item);
  }

  return map;
}

export function SmartListEditorKanban({
  listId,
  items,
  iconSet,
}: SmartListEditorKanbanProps) {
  const topLevel = getTopLevelItems(items);
  const byStatus = groupByStatus(topLevel, iconSet);

  const columns = [
    ...iconSet.entries
      .sort((a, b) => a.order - b.order)
      .map((e) => ({ id: e.id, label: e.label, icon: e.icon })),
    { id: '__unset', label: 'Unset', icon: null as IconSet['entries'][number]['icon'] | null },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colItems = byStatus.get(col.id) ?? [];
        return (
          <div
            key={col.id}
            className="flex w-64 shrink-0 flex-col rounded-lg border border-border bg-muted/20"
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              {col.icon ? (
                typeof col.icon === 'string' ? (
                  <span className="text-base">{col.icon}</span>
                ) : (
                  (col.icon as React.ComponentType<{ className?: string }>)({
                    className: 'h-4 w-4',
                  })
                )
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
              <span className="text-sm font-semibold">{col.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {colItems.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-2">
              {colItems.map((item) => (
                <KanbanCard key={item.id} item={item} />
              ))}
              {colItems.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No items
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ item }: { item: SmartListItem }) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-card p-3 shadow-sm',
        'cursor-default transition-shadow hover:shadow',
      )}
    >
      <div className="text-sm font-medium text-foreground">{item.text}</div>
      {item.description && (
        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {item.description}
        </div>
      )}
    </div>
  );
}
