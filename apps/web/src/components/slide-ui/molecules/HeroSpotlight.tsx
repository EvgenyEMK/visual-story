'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, ComponentSize, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';

interface HeroSpotlightProps extends EntranceProps {
  /** Main icon. */
  icon: IconProp;
  /** Title text. */
  title: string;
  /** Description text. */
  description?: string;
  /** Accent color. */
  color?: AccentColor;
  /** Size preset. */
  size?: ComponentSize;
  /** Additional class names. */
  className?: string;
}

const sizeConfig: Record<ComponentSize, { iconBox: number; icon: number; title: string; desc: string }> = {
  sm: { iconBox: 40, icon: 20, title: 'text-xs font-bold', desc: 'text-[9px]' },
  md: { iconBox: 56, icon: 28, title: 'text-sm font-bold', desc: 'text-[10px]' },
  lg: { iconBox: 72, icon: 36, title: 'text-lg font-bold', desc: 'text-xs' },
  xl: { iconBox: 96, icon: 48, title: 'text-2xl font-black', desc: 'text-sm' },
};

export function HeroSpotlight({
  icon,
  title,
  description,
  color = '#3b82f6',
  size = 'lg',
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: HeroSpotlightProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeConfig[size];

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-3 text-center', className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div
        className="rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          width: s.iconBox,
          height: s.iconBox,
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          border: `2px solid ${color}50`,
          boxShadow: `0 8px 24px ${color}20`,
        }}
      >
        {renderIcon(icon, { size: s.icon, color: `${color}dd` })}
      </div>
      <div className={cn(s.title, 'text-white/90')}>{title}</div>
      {description && (
        <p className={cn(s.desc, 'text-white/50 max-w-[240px] leading-relaxed')}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
