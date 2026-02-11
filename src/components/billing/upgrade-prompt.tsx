/**
 * Upgrade prompt shown when user hits plan limits (exports, quality, watermark, storage).
 * @source docs/modules/user-management/subscription-billing.md
 */
'use client';

import type { UpgradePromptReason } from '@/types/billing';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface UpgradePromptProps {
  reason: UpgradePromptReason;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

// ---------------------------------------------------------------------------
// Message configuration keyed by reason
// ---------------------------------------------------------------------------

const MESSAGES: Record<
  UpgradePromptReason,
  { title: string; description: string; cta: string; icon: React.ReactNode }
> = {
  export_limit: {
    title: 'Export Limit Reached',
    description:
      "You've used all 2 free exports this month. Upgrade to Creator for unlimited exports.",
    cta: 'Upgrade for Unlimited Exports',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  quality_4k: {
    title: '4K Quality — Pro Plan',
    description:
      '4K Ultra HD exports are available exclusively on the Pro plan ($49/mo).',
    cta: 'Upgrade to Pro',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </svg>
    ),
  },
  no_watermark: {
    title: 'Remove Watermark',
    description:
      'Upgrade to Creator ($29/mo) or Pro to export videos without the VisualStory watermark.',
    cta: 'Upgrade to Creator',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  storage: {
    title: 'Storage Full',
    description:
      "You've reached your 1 GB storage limit. Upgrade for up to 50 GB of storage.",
    cta: 'Upgrade for More Storage',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
  },
  more_projects: {
    title: 'Project Limit Reached',
    description:
      "You've reached your project limit. Upgrade to create unlimited projects.",
    cta: 'Upgrade for More Projects',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
    ),
  },
  priority_rendering: {
    title: 'Priority Rendering',
    description:
      'Get faster export rendering with priority queue access. Available on the Pro plan.',
    cta: 'Upgrade to Pro',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m13 2-2 2.5h3L12 7" />
        <path d="M10 14v-3" />
        <path d="M14 14v-3" />
        <path d="M11 19c-1.7 0-3-1.3-3-3v-2h8v2c0 1.7-1.3 3-3 3Z" />
      </svg>
    ),
  },
  custom_voice: {
    title: 'Custom Voice',
    description:
      'Unlock custom voice cloning and all premium voice options with an upgraded plan.',
    cta: 'Upgrade for Custom Voices',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UpgradePrompt({
  reason,
  onUpgrade,
  onDismiss,
}: UpgradePromptProps) {
  const msg = MESSAGES[reason];

  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400">
          {msg.icon}
        </span>
        <div className="flex-1">
          <AlertTitle className="text-sm font-semibold">{msg.title}</AlertTitle>
          <AlertDescription className="mt-1 text-sm text-muted-foreground">
            {msg.description}
          </AlertDescription>

          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={onUpgrade}>
              {msg.cta}
            </Button>
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Maybe Later
              </Button>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
}
