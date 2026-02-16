'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DemoBoxProps {
  /** Title of the demo. */
  title: string;
  /** Optional description. */
  description?: string;
  /** Theme for the stage area. */
  themeMode: 'dark' | 'light';
  /** Aspect ratio of the stage. Default: 'video' (16:9). */
  aspect?: 'video' | 'square' | 'auto';
  /** Stage content. */
  children: ReactNode;
  /** Additional class names. */
  className?: string;
}

export function DemoBox({
  title,
  description,
  themeMode,
  aspect = 'video',
  children,
  className,
}: DemoBoxProps) {
  const aspectClass =
    aspect === 'video'
      ? 'aspect-video'
      : aspect === 'square'
        ? 'aspect-square'
        : '';

  return (
    <div className={cn('rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden', className)}>
      {/* Stage — slide-canvas enables container-query responsive em scaling */}
      <div
        className={cn(
          'slide-canvas relative overflow-hidden flex items-center justify-center',
          aspectClass,
          !aspectClass && 'min-h-[200px]',
        )}
        style={{
          backgroundColor: themeMode === 'dark' ? '#0f172a' : '#ffffff',
        }}
      >
        {children}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
