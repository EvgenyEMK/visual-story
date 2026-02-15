'use client';

import { cn } from '@/lib/utils';
import type { AccentColor } from '../types';
import { em } from '../units';

interface StatusDotProps {
  /** Dot color. */
  color?: AccentColor;
  /** Label next to the dot. */
  label?: string;
  /** Pulse animation. */
  pulse?: boolean;
  /** Size in pixels. */
  size?: number;
  /** Additional class names. */
  className?: string;
}

export function StatusDot({
  color = '#22c55e',
  label,
  pulse = false,
  size = 8,
  className,
}: StatusDotProps) {
  return (
    <div className={cn('flex items-center gap-[0.375em]', className)}>
      <div className="relative flex items-center justify-center" style={{ width: em(size), height: em(size) }}>
        {pulse && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
        )}
        <div
          className="rounded-full"
          style={{ width: em(size), height: em(size), backgroundColor: color }}
        />
      </div>
      {label && (
        <span className="text-white/50 text-[0.5625em] font-medium">{label}</span>
      )}
    </div>
  );
}
