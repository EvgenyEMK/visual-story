'use client';

import './demo-animations.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { InSlideSection } from './InSlideSection';
import { SlideTransitionSection } from './SlideTransitionSection';
import { GroupedSection } from './GroupedSection';

export function TransitionsDemoClient() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Visual Transitions Library
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          A comprehensive collection of 25 animations and transitions for
          storytelling presentations. Each demo auto-plays on load — hover over
          any card and click the replay button to watch it again.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="in-slide" className="space-y-6">
        <TabsList>
          <TabsTrigger value="in-slide">
            In-Slide Animations
            <span className="ml-1.5 text-[10px] opacity-60">(10)</span>
          </TabsTrigger>
          <TabsTrigger value="transitions">
            Slide Transitions
            <span className="ml-1.5 text-[10px] opacity-60">(5)</span>
          </TabsTrigger>
          <TabsTrigger value="grouped">
            Grouped Items
            <span className="ml-1.5 text-[10px] opacity-60">(10)</span>
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
          <InSlideSection />
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
          <SlideTransitionSection />
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
          <GroupedSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
