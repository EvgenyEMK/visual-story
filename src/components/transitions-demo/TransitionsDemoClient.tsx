'use client';

import { useState } from 'react';
import './demo-animations.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InSlideSection } from './InSlideSection';
import { SlideTransitionSection } from './SlideTransitionSection';
import { GroupedSection } from './GroupedSection';
import { Sun, Moon, Play, MousePointerClick } from 'lucide-react';
import type { ThemeMode, TriggerMode } from './DemoStage';

export function TransitionsDemoClient() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [triggerMode, setTriggerMode] = useState<TriggerMode>('auto');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Visual Transitions Library
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          A comprehensive collection of 28 animations and transitions for
          storytelling presentations. Each demo auto-plays on load — hover over
          any card and click the replay button to watch it again.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Theme mode toggle */}
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

        {/* Trigger mode toggle (grouped only) */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Grouped:</span>
          <div className="inline-flex items-center rounded-lg border bg-muted p-0.5">
            <button
              onClick={() => setTriggerMode('auto')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                triggerMode === 'auto'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              Auto play
            </button>
            <button
              onClick={() => setTriggerMode('click')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                triggerMode === 'click'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MousePointerClick className="h-3.5 w-3.5" />
              Click transitions
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="in-slide" className="space-y-6">
        <TabsList>
          <TabsTrigger value="in-slide">
            In-Slide Animations
            <span className="ml-1.5 text-[10px] opacity-60">(12)</span>
          </TabsTrigger>
          <TabsTrigger value="transitions">
            Slide Transitions
            <span className="ml-1.5 text-[10px] opacity-60">(5)</span>
          </TabsTrigger>
          <TabsTrigger value="grouped">
            Grouped Items
            <span className="ml-1.5 text-[10px] opacity-60">(11)</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-slide" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              In-Slide Animations (Element Level)
            </h2>
            <p className="text-sm text-muted-foreground">
              Used to introduce or emphasize specific items (text, icons,
              charts) within a single slide.
            </p>
          </div>
          <InSlideSection themeMode={themeMode} />
        </TabsContent>

        <TabsContent value="transitions" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Slide-to-Slide Transitions
            </h2>
            <p className="text-sm text-muted-foreground">
              {`Connect your "Key Messages" into a continuous visual thread
              between slides.`}
            </p>
          </div>
          <SlideTransitionSection themeMode={themeMode} />
        </TabsContent>

        <TabsContent value="grouped" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Grouped Item Animations
            </h2>
            <p className="text-sm text-muted-foreground">
              Highly appealing animations for presenting multiple items with
              engaging visual layouts and transition logic.
            </p>
          </div>
          <GroupedSection themeMode={themeMode} triggerMode={triggerMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
