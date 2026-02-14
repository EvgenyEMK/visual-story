/**
 * Billing, subscription, and export types for VisualStory.
 *
 * @source docs/modules/user-management/subscription-billing.md
 * @source docs/modules/export-publish/video-export.md
 */

// ---------------------------------------------------------------------------
// Plan Types
// ---------------------------------------------------------------------------

/** Available subscription plans. */
export type Plan = 'free' | 'creator' | 'pro';

/** Billing interval. */
export type BillingInterval = 'monthly' | 'annual';

// ---------------------------------------------------------------------------
// Usage & Limits
// ---------------------------------------------------------------------------

/**
 * Current usage statistics for a tenant within the billing period.
 * @source docs/modules/user-management/subscription-billing.md — Usage Tracking
 */
export interface UsageQuota {
  /** Current plan. */
  plan: Plan;
  /** Number of exports used this month. */
  exportsUsed: number;
  /** Maximum exports allowed (-1 = unlimited). */
  exportsLimit: number;
  /** Storage used in bytes. */
  storageUsed: number;
  /** Storage limit in bytes. */
  storageLimit: number;
  /** Number of projects created. */
  projectsUsed: number;
  /** Maximum projects allowed (-1 = unlimited). */
  projectsLimit: number;
  /** When the current billing period resets. */
  periodResetAt: Date;
}

/**
 * Static plan limits used for quota checks and display.
 * @source docs/modules/user-management/subscription-billing.md — Plan Structure
 */
export interface PlanLimits {
  /** Exports allowed per month (-1 = unlimited). */
  exportsPerMonth: number;
  /** Maximum video quality. */
  maxQuality: '720p' | '1080p' | '4k';
  /** Whether exports include a watermark. */
  watermark: boolean;
  /** Number of voice options available. */
  voiceOptions: number | 'all' | 'all+custom';
  /** Storage limit in gigabytes. */
  storageGb: number;
  /** Maximum projects (-1 = unlimited). */
  maxProjects: number;
  /** Whether priority rendering is available. */
  priorityRendering: boolean;
  /** Support tier. */
  support: 'community' | 'email' | 'priority';
}

// ---------------------------------------------------------------------------
// Export — Request / Response
// ---------------------------------------------------------------------------

/** Video quality/resolution presets. */
export type VideoQuality = '720p' | '1080p' | '4k';

/** Export job lifecycle status. */
export type ExportStatus = 'pending' | 'rendering' | 'encoding' | 'complete' | 'failed';

/**
 * Request payload for starting a video export.
 * @source docs/modules/export-publish/video-export.md — API Endpoints
 */
export interface ExportRequest {
  projectId: string;
  quality: VideoQuality;
  /** Whether to include the voice-over audio track. */
  includeVoiceOver: boolean;
  /** Whether to notify the user via email when complete. */
  emailNotification?: boolean;
}

/**
 * Initial response after an export job is created.
 * @source docs/modules/export-publish/video-export.md — API Endpoints
 */
export interface ExportResponse {
  exportId: string;
  status: ExportStatus;
  /** Estimated render time in seconds. */
  estimatedDuration: number;
}

/**
 * Polling response for export status.
 * @source docs/modules/export-publish/video-export.md — API Endpoints
 */
export interface ExportStatusResponse {
  exportId: string;
  status: ExportStatus;
  /** Render progress (0–100). */
  progress: number;
  /** R2 download URL (available when status is 'complete'). */
  downloadUrl?: string;
  /** Error message (when status is 'failed'). */
  error?: string;
  /** Time elapsed since export started in seconds. */
  elapsedSeconds?: number;
}

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

/** Reasons that trigger the upgrade prompt. */
export type UpgradePromptReason =
  | 'export_limit'
  | 'quality_4k'
  | 'no_watermark'
  | 'storage'
  | 'more_projects'
  | 'priority_rendering'
  | 'custom_voice';

/**
 * Props for the UpgradePrompt component.
 * @source docs/modules/user-management/subscription-billing.md — Upgrade Prompt Component
 */
export interface UpgradePromptProps {
  /** The specific reason the upgrade prompt is shown. */
  reason: UpgradePromptReason;
  /** The user's current plan. */
  currentPlan: Plan;
  /** Callback when the user clicks "Upgrade". */
  onUpgrade: () => void;
  /** Callback when the user dismisses the prompt. */
  onDismiss: () => void;
}
