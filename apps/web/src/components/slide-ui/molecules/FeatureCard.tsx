'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, ComponentSize, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';

interface FeatureCardProps extends EntranceProps {
  /** Icon to display. */
  icon: IconProp;
  /** Card title. */
  title: string;
  /** Optional description text. */
  description?: string;
  /** Accent color for icon background and border. */
  color?: AccentColor;
  /** Size preset. */
  size?: ComponentSize;
  /** Layout direction. */
  direction?: 'vertical' | 'horizontal';
  /** Additional class names. */
  className?: string;
  /** Click handler. */
  onClick?: () => void;
}

const sizeConfig: Record<ComponentSize, { icon: number; iconBox: number; title: string; desc: string; pad: string; gap: string }> = {
  sm: { icon: 14, iconBox: 28, title: 'text-[10px] font-semibold', desc: 'text-[8px]', pad: 'p-2', gap: 'gap-1.5' },
  md: { icon: 20, iconBox: 40, title: 'text-xs font-semibold', desc: 'text-[10px]', pad: 'p-3', gap: 'gap-2' },
  lg: { icon: 28, iconBox: 52, title: 'text-sm font-bold', desc: 'text-xs', pad: 'p-4', gap: 'gap-3' },
  xl: { icon: 36, iconBox: 64, title: 'text-base font-bold', desc: 'text-sm', pad: 'p-5', gap: 'gap-4' },
};

export function FeatureCard({
  icon,
  title,
  description,
  color = '#3b82f6',
  size = 'md',
  direction = 'vertical',
  entrance = 'none',
  delay = 0,
  duration,
  className,
  onClick,
}: FeatureCardProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeConfig[size];
  const isVertical = direction === 'vertical';

  return (
    <motion.div
      className={cn(
        'rounded-xl bg-white/5 border border-white/10 flex',
        isVertical ? 'flex-col items-center text-center' : 'flex-row items-start',
        s.pad,
        s.gap,
        onClick && 'cursor-pointer',
        className,
      )}
      style={{
        borderColor: `${color}20`,
      }}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
      whileHover={onClick ? { scale: 1.02, borderColor: `${color}50` } : undefined}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center shrink-0 rounded-xl"
        style={{
          width: s.iconBox,
          height: s.iconBox,
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        {renderIcon(icon, { size: s.icon, color: `${color}cc` })}
      </div>
      <div className={cn('flex flex-col', isVertical ? 'items-center' : 'items-start', 'gap-0.5 min-w-0')}>
        <span className={cn(s.title, 'text-white/90')}>{title}</span>
        {description && (
          <span className={cn(s.desc, 'text-white/50 leading-relaxed')}>{description}</span>
        )}
      </div>
    </motion.div>
  );
}
