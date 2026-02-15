'use client';

import { useState, createContext, useContext } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Moon, LayoutGrid, Columns2, Rows3 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Context — shared state for theme & grid columns
// ---------------------------------------------------------------------------

export type ThemeMode = 'dark' | 'light';

interface DemoPageContextValue {
  themeMode: ThemeMode;
  columns: 1 | 2 | 3;
}

const DemoPageContext = createContext<DemoPageContextValue>({
  themeMode: 'dark',
  columns: 3,
});

export function useDemoPage() {
  return useContext(DemoPageContext);
}

// ---------------------------------------------------------------------------
// Tab definition
// ---------------------------------------------------------------------------

export interface DemoTab {
  /** Unique value used as tab key. */
  value: string;
  /** Display label. */
  label: string;
  /** Optional count shown next to label. */
  count?: number;
  /** Tab panel content. */
  content: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DemoPageShellProps {
  /** Page title. */
  title: string;
  /** Page description. */
  description: string | React.ReactNode;
  /** Tab definitions. */
  tabs: DemoTab[];
  /** Default active tab value. Defaults to first tab. */
  defaultTab?: string;
  /** Extra controls rendered next to theme & column toggles. */
  extraControls?: React.ReactNode;
  /** Children rendered below the header (above tabs). */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Column selector icons
// ---------------------------------------------------------------------------

const COLUMN_OPTIONS: { value: 1 | 2 | 3; icon: React.ReactNode; label: string }[] = [
  { value: 1, icon: <Rows3 className="h-3.5 w-3.5" />, label: '1' },
  { value: 2, icon: <Columns2 className="h-3.5 w-3.5" />, label: '2' },
  { value: 3, icon: <LayoutGrid className="h-3.5 w-3.5" />, label: '3' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DemoPageShell({
  title,
  description,
  tabs,
  defaultTab,
  extraControls,
  children,
}: DemoPageShellProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [columns, setColumns] = useState<1 | 2 | 3>(3);

  return (
    <DemoPageContext.Provider value={{ themeMode, columns }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {typeof description === 'string' ? (
            <p className="text-muted-foreground text-sm max-w-2xl">{description}</p>
          ) : (
            description
          )}
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Theme toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Stage:</span>
            <div className="inline-flex items-center rounded-lg border bg-muted p-0.5">
              <button
                onClick={() => setThemeMode('light')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  themeMode === 'light'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Items per row selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Per row:</span>
            <div className="inline-flex items-center rounded-lg border bg-muted p-0.5">
              {COLUMN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setColumns(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    columns === opt.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={`${opt.value} per row`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Extra controls */}
          {extraControls}
        </div>

        {children}

        {/* Tabs */}
        <Tabs defaultValue={defaultTab ?? tabs[0]?.value} className="space-y-6">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {tab.count != null && (
                  <span className="ml-1.5 text-[0.625rem] opacity-60">({tab.count})</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DemoPageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// DemoGrid — responsive grid that respects the column setting
// ---------------------------------------------------------------------------

export function DemoGrid({ children }: { children: React.ReactNode }) {
  const { columns } = useDemoPage();

  const gridClass =
    columns === 1
      ? 'grid grid-cols-1 gap-6'
      : columns === 2
        ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
        : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';

  return <div className={gridClass}>{children}</div>;
}
