'use client';

import { cn } from '@/lib/utils';
import { em } from '../units';
import type { StaggerProps, AccentColor } from '../types';
import { StatCard } from '../molecules/StatCard';

export interface DashboardStat {
  value: string;
  label?: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
  color?: AccentColor;
  progress?: number;
}

interface StatDashboardProps extends StaggerProps {
  /** Stats to display. */
  stats: DashboardStat[];
  /** Number of columns. Default: auto-fit. */
  columns?: number;
  /** Gap in pixels. */
  gap?: number;
  /** Additional class names. */
  className?: string;
}

export function StatDashboard({
  stats,
  columns,
  gap = 12,
  entrance = 'none',
  delay = 0,
  duration,
  stagger = 0.15,
  className,
}: StatDashboardProps) {
  const cols = columns ?? Math.min(stats.length, 3);

  return (
    <div
      className={cn('grid w-full', className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: em(gap),
      }}
    >
      {stats.map((stat, i) => (
        <StatCard
          key={`${stat.value}-${i}`}
          value={stat.value}
          label={stat.label}
          delta={stat.delta}
          deltaDirection={stat.deltaDirection}
          color={stat.color ?? '#3b82f6'}
          progress={stat.progress}
          entrance={entrance}
          delay={delay + i * stagger}
          duration={duration}
        />
      ))}
    </div>
  );
}
