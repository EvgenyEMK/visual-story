'use client';

import type { Slide } from '@/types/slide';
import type { Scene } from '@/types/scene';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  transitionType: string;
  onClick: () => void;
  /** Scenes for this slide. */
  scenes?: Scene[];
  /** Index of the currently active scene (-1 or undefined = no scene selected). */
  activeSceneIndex?: number;
  /** Callback when a scene is selected. */
  onSceneSelect?: (sceneIndex: number) => void;
  /** Whether to show scenes in the sidebar. */
  showScenes?: boolean;
}

export function SlideThumbnail({
  slide,
  index,
  isActive,
  transitionType,
  onClick,
  scenes,
  activeSceneIndex,
  onSceneSelect,
  showScenes = true,
}: SlideThumbnailProps) {
  const hasScenes = scenes && scenes.length > 1;

  // Derive a short label for the animation template
  const templateLabel = (() => {
    if (slide.animationTemplate === 'zoom-in-word') return 'Zoom Word';
    if (slide.animationTemplate === 'slide-title') return 'Slide Title';
    if (slide.animationTemplate === 'sidebar-detail') return 'Sidebar Detail';
    if (slide.animationTemplate === 'popup-callout') return 'Popup Callout';
    if (slide.animationTemplate === 'tab-navigation') return 'Tab Navigation';
    if (slide.animationTemplate === 'none') return null;
    return null;
  })();

  return (
    <div>
      <button
        onClick={onClick}
        className={`w-full text-left rounded-lg border-2 transition-all overflow-hidden ${
          isActive
            ? 'border-primary ring-2 ring-primary/30 shadow-md'
            : 'border-border hover:border-primary/40 hover:shadow-sm'
        }`}
      >
        {/* Miniature slide preview */}
        <div
          className="relative w-full bg-white dark:bg-zinc-900"
          style={{ aspectRatio: '16/9' }}
        >
          {/* Title and subtitle preview */}
          <div className="absolute inset-0 p-1.5 flex flex-col gap-0.5 overflow-hidden">
            {slide.title && (
              <span className="text-[0.3125rem] font-bold text-foreground/70 truncate">
                {slide.title}
              </span>
            )}
            {slide.subtitle && (
              <span className="text-[0.25rem] text-muted-foreground/60 truncate">
                {slide.subtitle}
              </span>
            )}
            {slide.icon && (
              <span className="text-[0.625rem] mt-auto self-center">{slide.icon}</span>
            )}
          </div>

          {/* Scenes count badge */}
          {hasScenes && (
            <div className="absolute top-0.5 right-0.5 px-1 py-0.5 rounded text-[0.3125rem] font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              {scenes.length} scenes
            </div>
          )}

          {/* Single scene widget count badge */}
          {scenes && scenes.length === 1 && scenes[0].widgetStateLayer.animatedWidgetIds.length > 0 && (
            <div className="absolute top-0.5 right-0.5 px-1 py-0.5 rounded text-[0.3125rem] font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              {scenes[0].widgetStateLayer.animatedWidgetIds.length} widgets
            </div>
          )}

          {/* Slide number overlay */}
          <div className="absolute bottom-0.5 left-0.5 text-[0.4375rem] font-bold text-muted-foreground/60">
            {index + 1}
          </div>
        </div>

        {/* Info bar */}
        <div className="px-2 py-1.5 bg-muted/30 border-t">
          <div className="text-[0.625rem] font-medium truncate text-foreground">
            {slide.title ?? slide.content.split('—')[0].trim()}
          </div>
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {templateLabel && (
              <span className="text-[0.5rem] px-1 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 font-medium">
                {templateLabel}
              </span>
            )}
            {transitionType !== 'none' && (
              <span className="text-[0.5rem] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium">
                {transitionType}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Scene children — shown when slide is active and has multiple scenes */}
      {isActive && hasScenes && showScenes && (
        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-primary/20 pl-2">
          {scenes.map((scene, sceneIdx) => {
            const isSceneActive = sceneIdx === activeSceneIndex;
            return (
              <button
                key={scene.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSceneSelect?.(sceneIdx);
                }}
                className={`w-full text-left px-2 py-1 rounded text-[0.5625rem] transition-all ${
                  isSceneActive
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {scene.icon && <span className="text-[0.625rem]">{scene.icon}</span>}
                  <span className="truncate">{scene.title}</span>
                  <span className="ml-auto text-[0.4375rem] text-muted-foreground/60 shrink-0">
                    {scene.widgetStateLayer.animatedWidgetIds.length} widgets
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
