'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { em } from '../units';
import { FlowNode } from '../molecules/FlowNode';

export interface TimelineItem {
  icon: IconProp;
  label: string;
  color?: AccentColor;
}

interface HorizontalTimelineProps {
  /** Timeline nodes. */
  items: TimelineItem[];
  /** Initially active index. */
  defaultActive?: number;
  /** Node size in pixels. */
  nodeSize?: number;
  /** Additional class names. */
  className?: string;
}

export function HorizontalTimeline({
  items,
  defaultActive = 0,
  nodeSize = 44,
  className,
}: HorizontalTimelineProps) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className={cn('flex items-center w-full overflow-x-auto py-[1em]', className)}>
      {items.map((item, i) => {
        const c = item.color ?? '#3b82f6';
        const isLast = i === items.length - 1;

        return (
          <div key={`${item.label}-${i}`} className="flex items-center">
            <div
              className="cursor-pointer"
              onClick={() => setActive(i)}
            >
              <FlowNode
                icon={item.icon}
                label={item.label}
                color={c}
                nodeSize={nodeSize}
                active={i === active}
                entrance="none"
              />
            </div>
            {!isLast && (
              <div
                className="h-[2px] mx-[0.5em] rounded-full"
                style={{
                  width: em(48),
                  backgroundColor: i < active ? `${c}60` : 'rgba(255,255,255,0.1)',
                  transition: 'background-color 0.3s ease',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
