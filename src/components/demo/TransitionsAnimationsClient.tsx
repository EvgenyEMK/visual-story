'use client';

import { useState } from 'react';
import { DemoPageShell, DemoGrid, useDemoPage } from './DemoPageShell';
import { Play, MousePointerClick } from 'lucide-react';
import { InSlideSection } from '../transitions-demo/InSlideSection';
import { SlideTransitionSection } from '../transitions-demo/SlideTransitionSection';
import { GroupedSection } from '../transitions-demo/GroupedSection';
import '../transitions-demo/demo-animations.css';
import type { TriggerMode } from '../transitions-demo/DemoStage';

// ---------------------------------------------------------------------------
// Grid class helper
// ---------------------------------------------------------------------------

function useGridClassName() {
  const { columns } = useDemoPage();
  return columns === 1
    ? 'grid grid-cols-1 gap-6'
    : columns === 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
}

// ---------------------------------------------------------------------------
// Wrapper sections that read themeMode from DemoPageShell context
// ---------------------------------------------------------------------------

function InSlideTab() {
  const { themeMode } = useDemoPage();
  const gridClassName = useGridClassName();
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">In-Slide Animations (Element Level)</h2>
        <p className="text-sm text-muted-foreground">
          Used to introduce or emphasize specific items (text, icons, charts) within a single slide.
        </p>
      </div>
      <InSlideSection themeMode={themeMode} gridClassName={gridClassName} />
    </div>
  );
}

function TransitionsTab() {
  const { themeMode } = useDemoPage();
  const gridClassName = useGridClassName();
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Slide-to-Slide Transitions</h2>
        <p className="text-sm text-muted-foreground">
          {`Connect your "Key Messages" into a continuous visual thread between slides.`}
        </p>
      </div>
      <SlideTransitionSection themeMode={themeMode} gridClassName={gridClassName} />
    </div>
  );
}

function GroupedTab({ triggerMode }: { triggerMode: TriggerMode }) {
  const { themeMode } = useDemoPage();
  const gridClassName = useGridClassName();
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Grouped Item Animations</h2>
        <p className="text-sm text-muted-foreground">
          Highly appealing animations for presenting multiple items with engaging visual layouts and transition logic.
        </p>
      </div>
      <GroupedSection themeMode={themeMode} triggerMode={triggerMode} gridClassName={gridClassName} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function TransitionsAnimationsClient() {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>('auto');

  const triggerControl = (
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
  );

  return (
    <DemoPageShell
      title="Transitions & Animations"
      description="A comprehensive collection of 28 animations and transitions for storytelling presentations. Each demo auto-plays on load — hover over any card and click the replay button to watch it again."
      tabs={[
        { value: 'in-slide', label: 'In-Slide Animations', count: 12, content: <InSlideTab /> },
        { value: 'transitions', label: 'Slide Transitions', count: 5, content: <TransitionsTab /> },
        { value: 'grouped', label: 'Grouped Items', count: 11, content: <GroupedTab triggerMode={triggerMode} /> },
      ]}
      extraControls={triggerControl}
    />
  );
}
