'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { EntranceProps, AccentColor } from '../types';

interface ProgressBarProps extends EntranceProps {
  /** Current value (0–100). */
  value: number;
  /** Maximum value. Default: 100 */
  max?: number;
  /** Bar color. */
  color?: AccentColor;
  /** Optional label on the left. */
  label?: string;
  /** Show percentage text on the right. */
  showValue?: boolean;
  /** Bar height in pixels. */
  height?: number;
  /** Additional class names. */
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = '#3b82f6',
  label,
  showValue = false,
  height = 20,
  entrance = 'none',
  delay = 0,
  duration = 0.8,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const isAnimated = entrance !== 'none';

  return (
    <div className={cn('flex items-center gap-3 w-full', className)}>
      {label && (
        <span className="text-white/60 text-[10px] w-16 text-right shrink-0">{label}</span>
      )}
      <div
        className="flex-1 bg-white/5 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={isAnimated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={
            isAnimated
              ? { duration, delay, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
        />
      </div>
      {showValue && (
        <motion.span
          className="text-white/80 text-xs font-mono w-10 tabular-nums text-right"
          initial={isAnimated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={isAnimated ? { duration: 0.4, delay: delay + duration * 0.7 } : { duration: 0 }}
        >
          {Math.round(pct)}%
        </motion.span>
      )}
    </div>
  );
}
