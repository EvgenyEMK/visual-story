'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, ComponentSize, AccentColor } from '../types';
import { em } from '../units';
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
  /**
   * When `true` the card stretches to fill its parent container
   * (`w-full h-full`).  When `false` (default) the card uses intrinsic
   * sizing with minimum dimensions derived from the size preset — ideal
   * for grid cells where cards should be centred rather than stretched.
   */
  fillParent?: boolean;
  /** Additional class names. */
  className?: string;
  /** Click handler. */
  onClick?: () => void;
}

const sizeConfig: Record<ComponentSize, {
  icon: number; iconBox: number; title: string; desc: string;
  pad: string; gap: string;
  /** Minimum card width (em) for intrinsic sizing. */
  minW: number;
  /** Minimum card height (em) for intrinsic vertical sizing. */
  minH: number;
}> = {
  sm: { icon: 14, iconBox: 28, title: 'text-[0.625em] font-semibold', desc: 'text-[0.5em]', pad: 'p-[0.5em]', gap: 'gap-[0.375em]', minW: 120, minH: 100 },
  md: { icon: 20, iconBox: 40, title: 'text-[0.75em] font-semibold', desc: 'text-[0.625em]', pad: 'p-[0.75em]', gap: 'gap-[0.5em]', minW: 160, minH: 128 },
  lg: { icon: 28, iconBox: 52, title: 'text-[0.875em] font-bold', desc: 'text-[0.75em]', pad: 'p-[1em]', gap: 'gap-[0.75em]', minW: 200, minH: 164 },
  xl: { icon: 36, iconBox: 64, title: 'text-[1em] font-bold', desc: 'text-[0.875em]', pad: 'p-[1.25em]', gap: 'gap-[1em]', minW: 248, minH: 200 },
};

export function FeatureCard({
  icon,
  title,
  description,
  color = '#3b82f6',
  size = 'md',
  direction = 'vertical',
  fillParent = false,
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
        'rounded-[0.75em] bg-white/5 border border-white/10 flex',
        isVertical ? 'flex-col items-center text-center' : 'flex-row items-start',
        fillParent && 'w-full h-full',
        fillParent && isVertical && 'justify-center',
        s.pad,
        s.gap,
        onClick && 'cursor-pointer',
        className,
      )}
      style={{
        borderColor: `${color}20`,
        ...(!fillParent && isVertical ? { minWidth: em(s.minW), minHeight: em(s.minH) } : {}),
      }}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
      whileHover={onClick ? { scale: 1.02, borderColor: `${color}50` } : undefined}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center shrink-0 rounded-[0.75em]"
        style={{
          width: em(s.iconBox),
          height: em(s.iconBox),
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        {renderIcon(icon, { size: em(s.icon), color: `${color}cc` })}
      </div>
      <div className={cn('flex flex-col', isVertical ? 'items-center' : 'items-start', 'gap-[0.125em] min-w-0')}>
        <span className={cn(s.title, 'text-white/90')}>{title}</span>
        {description && (
          <span className={cn(s.desc, 'text-white/50 leading-relaxed')}>{description}</span>
        )}
      </div>
    </motion.div>
  );
}
