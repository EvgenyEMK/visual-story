'use client';

import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { renderIcon } from '../render-icon';

interface DetailPopupProps {
  /** Whether the popup is visible. */
  open: boolean;
  /** Icon to display. */
  icon: IconProp;
  /** Title text. */
  title: string;
  /** Description text. */
  description?: string;
  /** Accent color. */
  color?: AccentColor;
  /** Close handler. */
  onClose: () => void;
  /** Additional class names for the popup card. */
  className?: string;
}

export function DetailPopup({
  open,
  icon,
  title,
  description,
  color = '#3b82f6',
  onClose,
  className,
}: DetailPopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40" />
          {/* Card */}
          <motion.div
            className={cn(
              'relative rounded-xl p-5 shadow-2xl w-[200px] text-center backdrop-blur-md z-10',
              className,
            )}
            style={{
              backgroundColor: `${color}12`,
              border: `1.5px solid ${color}40`,
              boxShadow: `0 8px 32px ${color}25`,
            }}
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2">
              {renderIcon(icon, { size: 32, color: `${color}cc` })}
              <div className="text-sm font-bold" style={{ color }}>
                {title}
              </div>
              {description && (
                <p className="text-[10px] leading-relaxed text-white/50">
                  {description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
