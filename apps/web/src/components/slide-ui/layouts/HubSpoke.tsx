'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { em } from '../units';
import { renderIcon } from '../render-icon';
import { DetailPopup } from '../molecules/DetailPopup';

export interface SpokeItem {
  icon: IconProp;
  label: string;
  description?: string;
  color?: AccentColor;
}

interface HubSpokeProps {
  /** Central hub label. */
  hubLabel: string;
  /** Hub icon (optional). */
  hubIcon?: IconProp;
  /** Spoke items around the hub. */
  items: SpokeItem[];
  /** Radius of the spoke circle in pixels. */
  radius?: number;
  /** Node size in pixels. */
  nodeSize?: number;
  /** Show detail popup on click. */
  clickable?: boolean;
  /** Additional class names. */
  className?: string;
}

export function HubSpoke({
  hubLabel,
  hubIcon,
  items,
  radius = 80,
  nodeSize = 40,
  clickable = true,
  className,
}: HubSpokeProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <div className={cn('relative flex items-center justify-center w-full h-full', className)}>
      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {items.map((item, i) => {
          const pos = getPosition(i, items.length);
          const c = item.color ?? '#3b82f6';
          return (
            <line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${pos.x}px)`}
              y2={`calc(50% + ${pos.y}px)`}
              stroke={`${c}40`}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Central hub */}
      <div className="w-[3.5em] h-[3.5em] rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-10 shadow-lg shadow-blue-500/30">
        {hubIcon
          ? renderIcon(hubIcon, { size: em(20), color: '#ffffff' })
          : <span className="text-white text-[0.625em] font-bold">{hubLabel}</span>
        }
      </div>

      {/* Spoke nodes */}
      {items.map((item, i) => {
        const pos = getPosition(i, items.length);
        const c = item.color ?? '#3b82f6';
        const isSelected = selected === i;

        return (
          <motion.div
            key={`spoke-${i}`}
            className="absolute flex flex-col items-center gap-[0.25em]"
            style={{
              left: `calc(50% + ${em(pos.x)})`,
              top: `calc(50% + ${em(pos.y)})`,
              transform: 'translate(-50%, -50%)',
              cursor: clickable ? 'pointer' : 'default',
              zIndex: isSelected ? 15 : 5,
            }}
            whileHover={clickable ? { scale: 1.1 } : undefined}
            onClick={clickable ? () => setSelected(isSelected ? null : i) : undefined}
          >
            <div
              className="rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                width: em(nodeSize),
                height: em(nodeSize),
                backgroundColor: `${c}20`,
                border: `2px solid ${isSelected ? c : `${c}40`}`,
                boxShadow: isSelected ? `0 0 ${em(12)} ${c}40` : 'none',
              }}
            >
              {renderIcon(item.icon, { size: em(nodeSize * 0.45), color: `${c}cc` })}
            </div>
            <span className="text-[0.5em] text-white/50 font-medium whitespace-nowrap">
              {item.label}
            </span>
          </motion.div>
        );
      })}

      {/* Detail popup */}
      {selected !== null && items[selected] && (
        <DetailPopup
          open
          icon={items[selected].icon}
          title={items[selected].label}
          description={items[selected].description}
          color={items[selected].color}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
