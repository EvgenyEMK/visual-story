'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { em } from '../units';
import { renderIcon } from '../render-icon';
import type { IconSet } from '@/types/smart-list';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface IconQuickPickProps {
  /** The icon set to display. */
  iconSet: IconSet;
  /** Currently selected icon ID (highlighted). */
  currentIconId?: string;
  /** Called when an icon is selected. */
  onSelect: (iconId: string) => void;
  /** Called to close the popover. */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IconQuickPick({
  iconSet,
  currentIconId,
  onSelect,
  onClose,
}: IconQuickPickProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    function handleClickOutside(e: globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      className="absolute z-50 top-full left-0 mt-[0.25em]"
      initial={{ opacity: 0, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      transition={{ duration: 0.12 }}
    >
      <div
        className="rounded-[0.5em] bg-[#1e293b] border border-white/15 shadow-xl p-[0.375em] flex flex-col gap-[0.125em]"
        style={{ minWidth: em(140) }}
      >
        {/* Set name */}
        <div className="text-[0.5em] text-white/40 font-medium uppercase tracking-wider px-[0.375em] py-[0.125em]">
          {iconSet.name}
        </div>

        {/* Icon entries */}
        {iconSet.entries.map((entry) => {
          const isSelected = entry.id === currentIconId;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(entry.id);
              }}
              className={cn(
                'flex items-center gap-[0.375em] rounded-[0.375em] px-[0.375em] py-[0.25em] transition-colors w-full text-left',
                isSelected
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              <div
                className="flex items-center justify-center shrink-0 rounded-[0.25em]"
                style={{
                  width: em(22),
                  height: em(22),
                  backgroundColor: `${entry.color}15`,
                  border: `1px solid ${entry.color}25`,
                }}
              >
                {renderIcon(entry.icon, { size: em(14), color: `${entry.color}cc` })}
              </div>
              <span className="text-[0.5625em] font-medium truncate">
                {entry.label}
              </span>
              {isSelected && (
                <span className="ml-auto text-[0.5em] text-white/40">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
