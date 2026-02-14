'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { IconProp, AccentColor } from '../types';
import { renderIcon } from '../render-icon';

interface ItemThumbnailProps {
  /** Icon. */
  icon: IconProp;
  /** Label text. */
  label: string;
  /** Accent color. */
  color?: AccentColor;
  /** Whether this thumbnail is currently active/selected. */
  active?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Additional class names. */
  className?: string;
}

export function ItemThumbnail({
  icon,
  label,
  color = '#3b82f6',
  active = false,
  onClick,
  className,
}: ItemThumbnailProps) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors duration-200',
        onClick && 'cursor-pointer',
        className,
      )}
      style={{
        backgroundColor: active ? `${color}20` : 'transparent',
        borderLeft: active ? `2px solid ${color}` : '2px solid transparent',
      }}
      whileHover={onClick ? { backgroundColor: `${color}15` } : undefined}
      onClick={onClick}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${active ? color : `${color}25`}`,
        }}
      >
        {renderIcon(icon, { size: 14, color: `${color}cc` })}
      </div>
      <span className={cn('text-[10px] font-medium truncate', active ? 'text-white/80' : 'text-white/50')}>
        {label}
      </span>
    </motion.div>
  );
}
