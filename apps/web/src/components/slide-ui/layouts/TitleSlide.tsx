'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { EntranceProps } from '../types';
import { TitleBar } from '../molecules/TitleBar';

interface TitleSlideProps extends EntranceProps {
  /** Slide title. */
  title: string;
  /** Subtitle. */
  subtitle?: string;
  /** Right slot for TitleBar. */
  right?: ReactNode;
  /** Body content below the title bar. */
  children?: ReactNode;
  /** Additional class names. */
  className?: string;
}

export function TitleSlide({
  title,
  subtitle,
  right,
  children,
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: TitleSlideProps) {
  return (
    <div className={cn('flex flex-col w-full h-full', className)}>
      <TitleBar
        title={title}
        subtitle={subtitle}
        right={right}
        size="lg"
        bordered
        entrance={entrance}
        delay={delay}
        duration={duration}
      />
      <div className="flex-1 flex items-center justify-center p-[1em]">
        {children}
      </div>
    </div>
  );
}
