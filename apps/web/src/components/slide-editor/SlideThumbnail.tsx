'use client';

import type { Slide } from '@/types/slide';
import type { Scene } from '@/types/scene';
import { flattenItemsAsElements } from '@/lib/flatten-items';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  hasGroupedAnimation: boolean;
  transitionType: string;
  onClick: () => void;
  /** Scenes derived from this slide (via ensureScenes). */
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
  hasGroupedAnimation,
  transitionType,
  onClick,
  scenes,
  activeSceneIndex,
  onSceneSelect,
  showScenes = true,
}: SlideThumbnailProps) {
  // Pick a label for the grouped animation type
  const groupLabel = slide.groupedAnimation?.type
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const hasScenes = scenes && scenes.length > 1;

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
          {/* Render miniature elements */}
          {(slide.items.length > 0
            ? flattenItemsAsElements(slide.items)
            : slide.elements
          ).slice(0, 4).map((el) => (
            <div
              key={el.id}
              className="absolute text-[4px] leading-tight overflow-hidden"
              style={{
                left: `${(el.position.x / 960) * 100}%`,
                top: `${(el.position.y / 540) * 100}%`,
                maxWidth: '60%',
                color: el.style.color ?? undefined,
                fontWeight: el.style.fontWeight,
                fontSize: el.style.fontSize
                  ? `${Math.max(3, el.style.fontSize * 0.12)}px`
                  : undefined,
              }}
            >
              {el.content.slice(0, 30)}
            </div>
          ))}

          {/* Scenes count badge */}
          {hasScenes && (
            <div className="absolute top-0.5 right-0.5 px-1 py-0.5 rounded text-[5px] font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              {scenes.length} scenes
            </div>
          )}

          {/* Legacy grouped animation badge (no scenes yet) */}
          {!hasScenes && hasGroupedAnimation && (
            <div className="absolute top-0.5 right-0.5 px-1 py-0.5 rounded text-[5px] font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              {slide.groupedAnimation!.items.length} items
            </div>
          )}

          {/* Slide number overlay */}
          <div className="absolute bottom-0.5 left-0.5 text-[7px] font-bold text-muted-foreground/60">
            {index + 1}
          </div>
        </div>

        {/* Info bar */}
        <div className="px-2 py-1.5 bg-muted/30 border-t">
          <div className="text-[10px] font-medium truncate text-foreground">
            {slide.title ?? slide.content.split('—')[0].trim()}
          </div>
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {slide.animationTemplate === 'zoom-in-word' && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-medium">
                Zoom Word
              </span>
            )}
            {slide.animationTemplate === 'slide-title' && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-medium">
                Slide Title
              </span>
            )}
            {slide.animationTemplate === 'grid-to-sidebar' && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 font-medium">
                Grid→Sidebar
              </span>
            )}
            {slide.animationTemplate === 'sidebar-detail' && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium">
                Sidebar Detail
              </span>
            )}
            {hasGroupedAnimation && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 font-medium">
                {groupLabel}
              </span>
            )}
            {transitionType !== 'none' && (
              <span className="text-[8px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium">
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
                className={`w-full text-left px-2 py-1 rounded text-[9px] transition-all ${
                  isSceneActive
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {scene.icon && <span className="text-[10px]">{scene.icon}</span>}
                  <span className="truncate">{scene.title}</span>
                  <span className="ml-auto text-[7px] text-muted-foreground/60 shrink-0">
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
