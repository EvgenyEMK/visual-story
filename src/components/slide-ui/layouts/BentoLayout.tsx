'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { renderIcon } from '../render-icon';

export interface BentoItem {
  icon: IconProp;
  title: string;
  description?: string;
  color?: AccentColor;
}

interface BentoLayoutProps {
  /** Items to display. */
  items: BentoItem[];
  /** Initially expanded index. */
  defaultExpanded?: number;
  /** Sidebar width (CSS value). */
  sidebarWidth?: string;
  /** Additional class names. */
  className?: string;
}

export function BentoLayout({
  items,
  defaultExpanded = 0,
  sidebarWidth = '28%',
  className,
}: BentoLayoutProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const current = items[expanded];

  return (
    <div className={cn('flex gap-2 w-full h-full p-3', className)}>
      {/* Main expanded area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={expanded}
              className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3"
              style={{
                backgroundColor: `${current.color ?? '#3b82f6'}15`,
                border: `1px solid ${current.color ?? '#3b82f6'}30`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderIcon(current.icon, { size: 40, color: `${current.color ?? '#3b82f6'}cc` })}
              <span className="text-white/90 text-sm font-bold">{current.title}</span>
              {current.description && (
                <span className="text-white/40 text-[10px] px-6 text-center leading-relaxed">
                  {current.description}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right sidebar grid */}
      <div className="flex flex-col gap-2" style={{ width: sidebarWidth }}>
        {items.map((item, i) => {
          const isActive = i === expanded;
          const c = item.color ?? '#3b82f6';
          return (
            <motion.div
              key={`${item.title}-${i}`}
              className="flex-1 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: isActive ? `${c}30` : `${c}10`,
                border: `1px solid ${isActive ? `${c}50` : `${c}15`}`,
              }}
              whileHover={{ scale: 1.03, borderColor: `${c}40` }}
              onClick={() => setExpanded(i)}
            >
              {renderIcon(item.icon, { size: 16, color: `${c}bb` })}
              <span className="text-white/60 text-[9px] font-medium">{item.title}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
