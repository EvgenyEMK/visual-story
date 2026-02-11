/**
 * Image placeholder component for MVP stock-image workflow.
 * Renders a styled placeholder that indicates where a final image should go.
 * @source docs/modules/ai-assistant/asset-generation.md
 */

import type { PlaceholderConfig } from '@/types/ai';
import { PLACEHOLDER_STYLES } from '@/config/placeholder-styles';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ImagePlaceholderProps {
  config: PlaceholderConfig;
  /** Optional click handler to open the stock-image picker. */
  onClick?: () => void;
  /** Whether the placeholder is currently selected in the canvas. */
  isSelected?: boolean;
  /** Optional CSS class name for sizing overrides. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Icon map — simple inline SVGs per placeholder type
// ---------------------------------------------------------------------------

const TYPE_ICONS: Record<PlaceholderConfig['style'], React.ReactNode> = {
  photo: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  illustration: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 2 20 20" />
      <path d="M12 2a10 10 0 0 1 0 20" />
      <path d="M12 2a10 10 0 0 0 0 20" />
    </svg>
  ),
  abstract: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" />
    </svg>
  ),
  pattern: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImagePlaceholder({
  config,
  onClick,
  isSelected = false,
  className = '',
}: ImagePlaceholderProps) {
  const placeholderStyle = PLACEHOLDER_STYLES[config.style];

  const aspectRatio = config.aspectRatio.replace(':', '/');

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
        isSelected
          ? 'border-primary ring-2 ring-primary/30'
          : 'border-gray-300 hover:border-gray-400'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: placeholderStyle.background,
        aspectRatio,
        minHeight: 80,
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex flex-col items-center gap-2 text-gray-500">
        {TYPE_ICONS[config.style]}
        <span className="text-sm font-medium">
          {config.label ?? placeholderStyle.label}
        </span>
        {onClick && (
          <span className="text-xs text-gray-400">Click to replace</span>
        )}
      </div>
    </div>
  );
}
