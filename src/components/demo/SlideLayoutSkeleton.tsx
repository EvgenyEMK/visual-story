'use client';

import type { SlideLayoutMeta } from '@/types/slide';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SlideLayoutSkeletonProps {
  /** Layout metadata — used for regions and layout id. */
  layout: SlideLayoutMeta;
  /** Whether to show a header bar skeleton at the top. */
  showHeader: boolean;
}

// ---------------------------------------------------------------------------
// Spacing constants
// ---------------------------------------------------------------------------

/**
 * Gap and padding classes for skeleton regions.
 *
 * At thumbnail scale (~300-400 px wide), these approximate the standard
 * UX card-spacing recommendations (16-24 px at full size):
 *
 *   gap-1.5  =  6 px — grid/column region gutters
 *   gap-2.5  = 10 px — center-stage 4-card
 *   gap-3    = 12 px — center-stage 3-card
 *   gap-4    = 16 px — center-stage 2-card (most room to breathe)
 */
const GRID_GAP = 'gap-1.5';
const GRID_PAD = 'p-1.5';

// ---------------------------------------------------------------------------
// Region block — a single placeholder rectangle
// ---------------------------------------------------------------------------

function Region({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-md border-2 border-dashed border-current/20 bg-current/[0.06] px-2 py-1 min-h-0 h-full w-full">
      <span className="text-[10px] font-medium opacity-50 text-center leading-tight truncate">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header bar skeleton
// ---------------------------------------------------------------------------

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-md border-2 border-dashed border-current/25 bg-current/[0.08] px-3 py-1.5 shrink-0">
      {/* Icon placeholder */}
      <div className="h-3 w-3 rounded-sm bg-current/20 shrink-0" />
      {/* Title placeholder */}
      <div className="h-2.5 w-20 rounded-sm bg-current/15" />
      {/* Subtitle placeholder */}
      <div className="h-2 w-12 rounded-sm bg-current/10" />
      <div className="flex-1" />
      {/* Trailing placeholder */}
      <div className="h-2.5 w-8 rounded-sm bg-current/10" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content layout renderers
// ---------------------------------------------------------------------------

function ContentLayout({ layout }: { layout: SlideLayoutMeta }) {
  const id = layout.id;

  // --- Single content area ---
  if (id === 'content') {
    return (
      <div className={`flex-1 min-h-0 ${GRID_PAD}`}>
        <Region label="Content" />
      </div>
    );
  }

  // --- Center band ---
  if (id === 'center-band') {
    return (
      <div className="flex-1 min-h-0 flex items-center px-1.5">
        <div className="w-full h-2/5">
          <Region label="Center Band" />
        </div>
      </div>
    );
  }

  // --- Center stage ---
  if (id === 'center-stage') {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-3">
        <div className="w-3/5 h-3/5">
          <Region label="Center Stage" />
        </div>
      </div>
    );
  }

  // --- Two columns ---
  if (id === 'two-column') {
    return (
      <div className={`flex-1 min-h-0 grid grid-cols-2 ${GRID_GAP} ${GRID_PAD}`}>
        <Region label="Left (50%)" />
        <Region label="Right (50%)" />
      </div>
    );
  }

  if (id === 'two-column-25-75') {
    return (
      <div className={`flex-1 min-h-0 grid ${GRID_GAP} ${GRID_PAD}`} style={{ gridTemplateColumns: '25% 1fr' }}>
        <Region label="Left (25%)" />
        <Region label="Right (75%)" />
      </div>
    );
  }

  if (id === 'two-column-75-25') {
    return (
      <div className={`flex-1 min-h-0 grid ${GRID_GAP} ${GRID_PAD}`} style={{ gridTemplateColumns: '1fr 25%' }}>
        <Region label="Left (75%)" />
        <Region label="Right (25%)" />
      </div>
    );
  }

  if (id === 'two-column-33-67') {
    return (
      <div className={`flex-1 min-h-0 grid ${GRID_GAP} ${GRID_PAD}`} style={{ gridTemplateColumns: '33% 1fr' }}>
        <Region label="Left (33%)" />
        <Region label="Right (67%)" />
      </div>
    );
  }

  if (id === 'two-column-67-33') {
    return (
      <div className={`flex-1 min-h-0 grid ${GRID_GAP} ${GRID_PAD}`} style={{ gridTemplateColumns: '1fr 33%' }}>
        <Region label="Left (67%)" />
        <Region label="Right (33%)" />
      </div>
    );
  }

  // --- Three columns ---
  if (id === 'three-column') {
    return (
      <div className={`flex-1 min-h-0 grid grid-cols-3 ${GRID_GAP} ${GRID_PAD}`}>
        <Region label="Left (33%)" />
        <Region label="Middle (33%)" />
        <Region label="Right (33%)" />
      </div>
    );
  }

  // --- Four columns ---
  if (id === 'four-column') {
    return (
      <div className={`flex-1 min-h-0 grid grid-cols-4 ${GRID_GAP} ${GRID_PAD}`}>
        <Region label="Col 1 (25%)" />
        <Region label="Col 2 (25%)" />
        <Region label="Col 3 (25%)" />
        <Region label="Col 4 (25%)" />
      </div>
    );
  }

  // --- Sidebar + detail ---
  if (id === 'sidebar-detail') {
    return (
      <div className={`flex-1 min-h-0 grid ${GRID_GAP} ${GRID_PAD}`} style={{ gridTemplateColumns: '28% 1fr' }}>
        <div className={`flex flex-col ${GRID_GAP} min-h-0 h-full`}>
          <div className="flex items-center rounded-md border-2 border-dashed border-current/20 bg-current/[0.08] px-2 py-1">
            <span className="text-[9px] font-medium opacity-40">Sidebar</span>
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded-sm border border-dashed border-current/15 bg-current/[0.04] px-1.5 py-0.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-current/20 shrink-0" />
              <div className="h-1.5 flex-1 rounded-sm bg-current/10" />
            </div>
          ))}
          <div className="flex-1" />
        </div>
        <Region label="Detail" />
      </div>
    );
  }

  // --- Grid 2x2 ---
  if (id === 'grid-2x2') {
    return (
      <div className={`flex-1 min-h-0 grid grid-cols-2 grid-rows-2 ${GRID_GAP} ${GRID_PAD}`}>
        <Region label="Top Left" />
        <Region label="Top Right" />
        <Region label="Bottom Left" />
        <Region label="Bottom Right" />
      </div>
    );
  }

  // --- Grid 3x2 ---
  if (id === 'grid-3x2') {
    return (
      <div className={`flex-1 min-h-0 grid grid-cols-3 grid-rows-2 ${GRID_GAP} ${GRID_PAD}`}>
        <Region label="Top Left" />
        <Region label="Top Mid" />
        <Region label="Top Right" />
        <Region label="Bot Left" />
        <Region label="Bot Mid" />
        <Region label="Bot Right" />
      </div>
    );
  }

  // --- Grid 2+3 (2 top, 3 bottom) ---
  if (id === 'grid-2-3') {
    return (
      <div className={`flex-1 min-h-0 grid grid-rows-2 ${GRID_GAP} ${GRID_PAD}`}>
        <div className={`grid grid-cols-2 ${GRID_GAP} min-h-0`}>
          <Region label="Top Left" />
          <Region label="Top Right" />
        </div>
        <div className={`grid grid-cols-3 ${GRID_GAP} min-h-0`}>
          <Region label="Bot Left" />
          <Region label="Bot Mid" />
          <Region label="Bot Right" />
        </div>
      </div>
    );
  }

  // --- Grid 3+2 (3 top, 2 bottom) ---
  if (id === 'grid-3-2') {
    return (
      <div className={`flex-1 min-h-0 grid grid-rows-2 ${GRID_GAP} ${GRID_PAD}`}>
        <div className={`grid grid-cols-3 ${GRID_GAP} min-h-0`}>
          <Region label="Top Left" />
          <Region label="Top Mid" />
          <Region label="Top Right" />
        </div>
        <div className={`grid grid-cols-2 ${GRID_GAP} min-h-0`}>
          <Region label="Bot Left" />
          <Region label="Bot Right" />
        </div>
      </div>
    );
  }

  // --- Center stage multi-item variants ---
  if (id === 'center-stage-2') {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center gap-4 p-4">
        <div className="w-[36%] h-3/5">
          <Region label="Card 1" />
        </div>
        <div className="w-[36%] h-3/5">
          <Region label="Card 2" />
        </div>
      </div>
    );
  }

  if (id === 'center-stage-3') {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center gap-3 p-4">
        <div className="w-[26%] h-3/5">
          <Region label="Card 1" />
        </div>
        <div className="w-[26%] h-3/5">
          <Region label="Card 2" />
        </div>
        <div className="w-[26%] h-3/5">
          <Region label="Card 3" />
        </div>
      </div>
    );
  }

  if (id === 'center-stage-4') {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center gap-2.5 p-4">
        <div className="w-[20%] h-3/5">
          <Region label="Card 1" />
        </div>
        <div className="w-[20%] h-3/5">
          <Region label="Card 2" />
        </div>
        <div className="w-[20%] h-3/5">
          <Region label="Card 3" />
        </div>
        <div className="w-[20%] h-3/5">
          <Region label="Card 4" />
        </div>
      </div>
    );
  }

  // --- Blank canvas ---
  if (id === 'blank') {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <div className="flex flex-col items-center gap-1 opacity-30">
          <div className="flex gap-2">
            <div className="h-4 w-6 rounded-sm border border-dashed border-current" />
            <div className="h-4 w-10 rounded-sm border border-dashed border-current" />
          </div>
          <div className="h-5 w-12 rounded-sm border border-dashed border-current" />
          <span className="text-[8px] font-medium mt-0.5">Freeform</span>
        </div>
      </div>
    );
  }

  // --- Custom ---
  if (id === 'custom') {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <div className="flex flex-col items-center gap-1 opacity-30">
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-sm border border-dashed border-current"
                style={{
                  width: `${8 + (i % 3) * 4}px`,
                  height: `${6 + (i % 2) * 4}px`,
                }}
              />
            ))}
          </div>
          <span className="text-[8px] font-medium mt-0.5">Custom</span>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className={`flex-1 min-h-0 ${GRID_PAD}`}>
      <Region label={layout.name} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SlideLayoutSkeleton({ layout, showHeader }: SlideLayoutSkeletonProps) {
  return (
    <div className="aspect-video rounded-md border border-current/15 bg-current/[0.02] flex flex-col overflow-hidden">
      {showHeader && <HeaderSkeleton />}
      <ContentLayout layout={layout} />
    </div>
  );
}
