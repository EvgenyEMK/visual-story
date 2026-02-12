'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '../slide-ui/slide-ui.css';
import { AtomsSection } from './sections/AtomsSection';
import { MoleculesSection } from './sections/MoleculesSection';
import { LayoutsSection } from './sections/LayoutsSection';

export function UIComponentsClient() {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Slide UI Components</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Reusable presentation components organized in three tiers: <strong>Atoms</strong> (leaf elements),{' '}
          <strong>Molecules</strong> (common combinations), and <strong>Layouts</strong> (slide-level compositions).
          All support static and animated modes. Icons from{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">lucide-react</code>,{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">@phosphor-icons/react</code>, and{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">@tabler/icons-react</code>.
        </p>
      </div>

      {/* Theme toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Stage theme:</span>
        <button
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            themeMode === 'dark'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
          onClick={() => setThemeMode('dark')}
        >
          Dark
        </button>
        <button
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            themeMode === 'light'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
          onClick={() => setThemeMode('light')}
        >
          Light
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="atoms" className="w-full">
        <TabsList>
          <TabsTrigger value="atoms">Atoms (8)</TabsTrigger>
          <TabsTrigger value="molecules">Molecules (10)</TabsTrigger>
          <TabsTrigger value="layouts">Layouts (9)</TabsTrigger>
        </TabsList>

        <TabsContent value="atoms" className="mt-6">
          <AtomsSection themeMode={themeMode} />
        </TabsContent>

        <TabsContent value="molecules" className="mt-6">
          <MoleculesSection themeMode={themeMode} />
        </TabsContent>

        <TabsContent value="layouts" className="mt-6">
          <LayoutsSection themeMode={themeMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
