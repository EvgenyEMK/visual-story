'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { em } from '../units';
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
  sm: { iconBox: 40, icon: 20, title: 'text-[0.75em] font-bold', desc: 'text-[0.5625em]' },
  md: { iconBox: 56, icon: 28, title: 'text-[0.875em] font-bold', desc: 'text-[0.625em]' },
  lg: { iconBox: 72, icon: 36, title: 'text-[1.125em] font-bold', desc: 'text-[0.75em]' },
  xl: { iconBox: 96, icon: 48, title: 'text-[1.5em] font-black', desc: 'text-[0.875em]' },
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
      className={cn('flex flex-col items-center gap-[0.75em] text-center', className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div
        className="rounded-[1em] flex items-center justify-center shadow-lg"
        style={{
          width: em(s.iconBox),
          height: em(s.iconBox),
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          border: `2px solid ${color}50`,
          boxShadow: `0 ${em(8)} ${em(24)} ${color}20`,
        }}
      >
        {renderIcon(icon, { size: em(s.icon), color: `${color}dd` })}
      </div>
      <div className={cn(s.title, 'text-white/90')}>{title}</div>
      {description && (
        <p className={cn(s.desc, 'text-white/50 max-w-[15em] leading-relaxed')}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
