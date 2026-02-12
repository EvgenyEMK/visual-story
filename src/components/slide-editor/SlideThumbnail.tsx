'use client';

import type { Slide } from '@/types/slide';
import { flattenItemsAsElements } from '@/lib/flatten-items';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  hasGroupedAnimation: boolean;
  transitionType: string;
  onClick: () => void;
}

export function SlideThumbnail({
  slide,
  index,
  isActive,
  hasGroupedAnimation,
  transitionType,
  onClick,
}: SlideThumbnailProps) {
  // Pick a label for the grouped animation type
  const groupLabel = slide.groupedAnimation?.type
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
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

        {/* Grouped animation badge */}
        {hasGroupedAnimation && (
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
          {slide.content.split('—')[0].trim()}
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
  );
}
