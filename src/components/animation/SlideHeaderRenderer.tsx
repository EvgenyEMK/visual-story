/**
 * SlideHeaderRenderer — maps a SlideHeader data object to a React component.
 *
 * This component bridges the slide data model and the slide-ui component
 * library. It reads the header's `variant` to decide which UI component
 * to render, and pulls title/subtitle/icon from the parent `Slide`.
 *
 * Variants:
 *   - 'title-bar'  → <TitleBar> molecule (icon, title, subtitle, trailing)
 *   - 'tabs'       → renders header.items as horizontal tab sections
 *   - 'custom'     → renders header.items via <ItemRenderer>
 */

'use client';

import type { Slide, SlideHeader } from '@/types/slide';
import { TitleBar } from '@/components/slide-ui/molecules/TitleBar';
import { ItemRenderer } from './ItemRenderer';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SlideHeaderRendererProps {
  /** The header configuration from the slide. */
  header: SlideHeader;
  /** The parent slide — provides title, subtitle, icon. */
  slide: Slide;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlideHeaderRenderer({ header, slide }: SlideHeaderRendererProps) {
  const size = header.size ?? 'md';
  const bordered = header.bordered ?? true;

  switch (header.variant) {
    // ----- Title Bar (most common) -----
    case 'title-bar': {
      const trailingContent = header.trailing && header.trailing.length > 0
        ? <ItemRenderer items={header.trailing} />
        : undefined;

      return (
        <TitleBar
          title={slide.title ?? ''}
          subtitle={slide.subtitle}
          icon={slide.icon}
          right={trailingContent}
          size={size}
          bordered={bordered}
          entrance="none"
        />
      );
    }

    // ----- Tabs (horizontal sections from items) -----
    case 'tabs': {
      if (!header.items || header.items.length === 0) return null;

      return (
        <div
          className={`flex items-stretch gap-0 ${bordered ? 'border-b border-white/5' : ''}`}
        >
          {header.items.map((item) => (
            <div
              key={item.id}
              className="flex-1 flex items-center justify-center px-4 py-3 text-xs font-medium text-white/70 hover:text-white/90 hover:bg-white/5 transition-colors cursor-pointer border-r border-white/5 last:border-r-0"
            >
              <ItemRenderer items={[item]} />
            </div>
          ))}
        </div>
      );
    }

    // ----- Custom (freeform) -----
    case 'custom': {
      if (!header.items || header.items.length === 0) return null;

      return (
        <div className={bordered ? 'border-b border-white/5' : ''}>
          <ItemRenderer items={header.items} />
        </div>
      );
    }

    default:
      return null;
  }
}
