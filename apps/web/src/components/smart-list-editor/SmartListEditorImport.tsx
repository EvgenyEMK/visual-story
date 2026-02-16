'use client';

import { useState } from 'react';
import type { SmartListItem } from '@/types/smart-list';
import { getSmartListRepository } from '@/services/smart-lists';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SmartListEditorImportProps {
  listId: string;
  onImportComplete: () => void;
}

/**
 * Parse pasted text into SmartListItem[].
 * Heuristic: each line = item, indented lines (2+ spaces or tab) = children.
 */
function parsePastedContent(text: string): SmartListItem[] {
  const lines = text.split(/\r?\n/);
  type Node = { item: SmartListItem; children: Node[] };
  const root: Node[] = [];
  const stack: Node[] = [];

  for (const line of lines) {
    const match = line.match(/^(\s*)(.*)$/);
    const indent = match?.[1]?.replace(/\t/g, '  ').length ?? 0;
    const content = (match?.[2] ?? line).trim();
    if (!content) continue;

    const depth = Math.floor(indent / 2);
    const item: SmartListItem = {
      id: crypto.randomUUID(),
      text: content,
      visible: true,
    };
    const node: Node = { item, children: [] };

    while (stack.length > depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
      stack.push(node);
    } else {
      const parent = stack[stack.length - 1];
      parent.children.push(node);
      stack.push(node);
    }
  }

  function toItems(nodes: Node[]): SmartListItem[] {
    return nodes.map((n) => ({
      ...n.item,
      children: n.children.length > 0 ? toItems(n.children) : undefined,
    }));
  }
  return toItems(root);
}

export function SmartListEditorImport({
  listId,
  onImportComplete,
}: SmartListEditorImportProps) {
  const [pasteText, setPasteText] = useState('');
  const [preview, setPreview] = useState<SmartListItem[] | null>(null);
  const [importing, setImporting] = useState(false);

  const repo = getSmartListRepository();

  const handleParse = () => {
    const items = parsePastedContent(pasteText);
    setPreview(items);
  };

  const handleImport = async () => {
    if (!preview || preview.length === 0) return;
    setImporting(true);
    try {
      await repo.addItems(listId, preview);
      setPasteText('');
      setPreview(null);
      onImportComplete();
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium">
          Paste from clipboard or CSV
        </label>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={`One item per line. Indent with 2+ spaces or tab for sub-items.\nExample:\n  Item 1\n    Sub-item 1.1\n  Item 2`}
          rows={8}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <div className="mt-2 flex gap-2">
          <Button size="sm" onClick={handleParse} disabled={!pasteText.trim()}>
            Parse
          </Button>
        </div>
      </div>

      {preview !== null && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">
            Preview ({preview.length} items)
          </h3>
          <div className="max-h-48 overflow-y-auto rounded border border-border bg-muted/20 p-2">
            <PreviewList items={preview} depth={0} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={handleImport}
              disabled={importing || preview.length === 0}
            >
              {importing ? 'Importing…' : 'Import'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreview(null);
                setPasteText('');
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewList({
  items,
  depth,
}: {
  items: SmartListItem[];
  depth: number;
}) {
  return (
    <ul className="list-none space-y-0.5">
      {items.map((item) => (
        <li
          key={item.id}
          className={cn('text-sm', depth > 0 && 'pl-4')}
          style={{ paddingLeft: depth > 0 ? `${depth * 12}px` : undefined }}
        >
          <span className="text-foreground">{item.text}</span>
          {item.children && item.children.length > 0 && (
            <PreviewList items={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}
