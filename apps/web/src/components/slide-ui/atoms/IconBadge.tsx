'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, EntranceProps, ComponentSize, AccentColor } from '../types';
import { entranceVariants, getEntranceMotion } from '../entrance';
import { renderIcon } from '../render-icon';
import { em } from '../units';

interface IconBadgeProps extends EntranceProps {
  /** Icon to display. */
  icon: IconProp;
  /** Accent color for background/border. */
  color?: AccentColor;
  /** Size preset. */
  size?: ComponentSize;
  /** Shape of the badge. */
  shape?: 'circle' | 'rounded' | 'square';
  /** Optional label below the icon. */
  label?: string;
  /** Additional class names. */
  className?: string;
}

const sizeMap: Record<ComponentSize, { box: number; icon: number; label: string }> = {
  sm: { box: 32, icon: 16, label: 'text-[0.4375em]' },
  md: { box: 48, icon: 24, label: 'text-[0.5625em]' },
  lg: { box: 64, icon: 32, label: 'text-[0.75em]' },
  xl: { box: 80, icon: 40, label: 'text-[0.875em]' },
};

const shapeRadius: Record<string, number> = {
  circle: 999,
  rounded: 12,
  square: 4,
};

export function IconBadge({
  icon,
  color = '#3b82f6',
  size = 'md',
  shape = 'rounded',
  label,
  entrance = 'none',
  delay = 0,
  duration,
  className,
}: IconBadgeProps) {
  const motion$ = getEntranceMotion(entrance, delay, duration);
  const variants = entrance !== 'none' && entranceVariants[entrance as keyof typeof entranceVariants]
    ? entranceVariants[entrance as keyof typeof entranceVariants]
    : undefined;
  const s = sizeMap[size];

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-[0.375em]', className)}
      variants={variants}
      initial={motion$?.initial}
      animate={motion$?.animate}
      transition={motion$?.transition}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: em(s.box),
          height: em(s.box),
          borderRadius: em(shapeRadius[shape]),
          backgroundColor: `${color}20`,
          border: `1.5px solid ${color}40`,
        }}
      >
        {renderIcon(icon, { size: em(s.icon), color: `${color}cc` })}
      </div>
      {label && (
        <span className={cn(s.label, 'font-medium text-white/70 text-center')}>{label}</span>
      )}
    </motion.div>
  );
}
