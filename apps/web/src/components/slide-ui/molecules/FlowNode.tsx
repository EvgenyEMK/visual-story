'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, AccentColor } from '../types';
import { em } from '../units';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';

interface FlowNodeProps extends EntranceProps {
  /** Icon or step number. */
  icon: IconProp;
  /** Node label. */
  label: string;
  /** Accent color. */
  color?: AccentColor;
  /** Node size in pixels. */
  nodeSize?: number;
  /** Whether this node is the current/active one. */
  active?: boolean;
  /** Additional class names. */
  className?: string;
}

export function FlowNode({
  icon,
  label,
  color = '#3b82f6',
  nodeSize = 40,
  active = false,
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: FlowNodeProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-[0.375em]', className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div
        className="rounded-[0.75em] flex items-center justify-center transition-all duration-300"
        style={{
          width: em(nodeSize),
          height: em(nodeSize),
          backgroundColor: `${color}${active ? '30' : '15'}`,
          border: `2px solid ${color}${active ? '70' : '30'}`,
          boxShadow: active ? `0 ${em(4)} ${em(16)} ${color}30` : 'none',
          transform: active ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {renderIcon(icon, { size: em(nodeSize * 0.5), color: `${color}${active ? 'ee' : 'aa'}` })}
      </div>
      <span
        className={cn(
          'text-[0.5625em] font-medium transition-colors',
          active ? 'text-white/90' : 'text-white/50',
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}
