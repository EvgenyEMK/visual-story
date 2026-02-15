'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers,
  LayoutGrid,
  FileText,
  Puzzle,
  Download,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Endpoint {
  key: string;
  label: string;
  icon: React.ReactNode;
  url: string;
  description: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    key: 'slides',
    label: 'Slides',
    icon: <LayoutGrid className="h-4 w-4" />,
    url: '/api/dev/structures/slides',
    description:
      'DEMO_SLIDES — 7 slides with recursive item trees, headers, scenes, and widget state layers.',
  },
  {
    key: 'sections',
    label: 'Sections',
    icon: <Layers className="h-4 w-4" />,
    url: '/api/dev/structures/sections',
    description: 'DEMO_SECTIONS — Organisational hierarchy grouping slides.',
  },
  {
    key: 'scripts',
    label: 'Scripts',
    icon: <FileText className="h-4 w-4" />,
    url: '/api/dev/structures/scripts',
    description:
      'DEMO_SCRIPTS — Voice-over scripts with per-element speech text and notes.',
  },
  {
    key: 'widgets',
    label: 'Slide Items',
    icon: <Puzzle className="h-4 w-4" />,
    url: '/api/dev/structures/widgets',
    description:
      'Demo slide items tree — SlideItem data with detailItems and scene configuration.',
  },
];

// ---------------------------------------------------------------------------
// Collapsible JSON Node
// ---------------------------------------------------------------------------

function JsonValue({ value, depth }: { value: unknown; depth: number }) {
  if (value === null) return <span className="text-orange-400">null</span>;
  if (value === undefined) return <span className="text-gray-500">undefined</span>;
  if (typeof value === 'boolean')
    return <span className="text-amber-400">{String(value)}</span>;
  if (typeof value === 'number')
    return <span className="text-emerald-400">{String(value)}</span>;
  if (typeof value === 'string') {
    // Highlight special markers
    if (value.startsWith('[Component:') || value === '[JSX]') {
      return (
        <span className="text-pink-400 italic">&quot;{value}&quot;</span>
      );
    }
    // Truncate very long strings
    const display = value.length > 120 ? `${value.slice(0, 120)}…` : value;
    return <span className="text-sky-300">&quot;{display}&quot;</span>;
  }
  if (Array.isArray(value)) return <JsonArray arr={value} depth={depth} />;
  if (typeof value === 'object')
    return <JsonObject obj={value as Record<string, unknown>} depth={depth} />;
  return <span>{String(value)}</span>;
}

function JsonArray({ arr, depth }: { arr: unknown[]; depth: number }) {
  const [open, setOpen] = useState(depth < 2);

  if (arr.length === 0) return <span className="text-gray-500">{'[]'}</span>;

  return (
    <span>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-0.5 text-gray-400 hover:text-white transition-colors"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span className="text-gray-500">{'['}</span>
        {!open && (
          <span className="text-gray-500 text-xs ml-1">{arr.length} items</span>
        )}
      </button>
      {open && (
        <div className="ml-4 border-l border-white/5 pl-3">
          {arr.map((item, i) => (
            <div key={i} className="py-0.5">
              <span className="text-gray-600 text-xs mr-2 select-none">{i}</span>
              <JsonValue value={item} depth={depth + 1} />
              {i < arr.length - 1 && <span className="text-gray-600">,</span>}
            </div>
          ))}
        </div>
      )}
      {open && <span className="text-gray-500">{']'}</span>}
      {!open && <span className="text-gray-500">{']'}</span>}
    </span>
  );
}

function JsonObject({
  obj,
  depth,
}: {
  obj: Record<string, unknown>;
  depth: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const keys = Object.keys(obj);

  if (keys.length === 0) return <span className="text-gray-500">{'{}'}</span>;

  // Show a compact preview when collapsed
  const preview = keys.slice(0, 3).join(', ') + (keys.length > 3 ? ', …' : '');

  return (
    <span>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-0.5 text-gray-400 hover:text-white transition-colors"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span className="text-gray-500">{'{'}</span>
        {!open && (
          <span className="text-gray-500 text-xs ml-1">{preview}</span>
        )}
      </button>
      {open && (
        <div className="ml-4 border-l border-white/5 pl-3">
          {keys.map((key, i) => (
            <div key={key} className="py-0.5">
              <span className="text-violet-400">&quot;{key}&quot;</span>
              <span className="text-gray-500">: </span>
              <JsonValue value={obj[key]} depth={depth + 1} />
              {i < keys.length - 1 && <span className="text-gray-600">,</span>}
            </div>
          ))}
        </div>
      )}
      {open && <span className="text-gray-500">{'}'}</span>}
      {!open && <span className="text-gray-500">{'}'}</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Data Panel — fetches one endpoint and renders interactive JSON
// ---------------------------------------------------------------------------

function DataPanel({ endpoint }: { endpoint: Endpoint }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dev-only JSON viewer
  const [data, setData] = useState<Record<string, any> | any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [endpoint.url]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleCopy = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${endpoint.key}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Description + toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
          <code className="text-xs text-muted-foreground/60 font-mono">
            GET {endpoint.url}
          </code>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-md border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCopy}
            disabled={!data}
            className="inline-flex items-center gap-1.5 rounded-md border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!data}
            className="inline-flex items-center gap-1.5 rounded-md border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Download className="h-3 w-3" />
            .json
          </button>
        </div>
      </div>

      {/* Content */}
      {error != null ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          Error: {error}
        </div>
      ) : null}

      {loading && data == null ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : null}

      {data != null ? (
        <div className="rounded-lg border bg-[#0d1117] p-4 overflow-auto max-h-[70vh] font-mono text-xs leading-relaxed">
          <JsonValue value={data} depth={0} />
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function DataStructuresClient() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Data Structures
          </h1>
          <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
            DEV
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Inspect the resolved JSON for demo slides, sections, scripts, and
          smart card widgets. Click any node to expand/collapse. Use the
          toolbar to copy or download.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="slides" className="space-y-6">
        <TabsList>
          {ENDPOINTS.map((ep) => (
            <TabsTrigger key={ep.key} value={ep.key} className="gap-1.5">
              {ep.icon}
              {ep.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ENDPOINTS.map((ep) => (
          <TabsContent key={ep.key} value={ep.key} className="mt-6">
            <DataPanel endpoint={ep} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
