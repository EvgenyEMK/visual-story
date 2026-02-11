/**
 * Export dialog — quality selection, options, and render progress tracking.
 * @source docs/modules/export-publish/video-export.md
 */
'use client';

import { useState, useCallback } from 'react';
import type {
  ExportRequest,
  ExportStatusResponse,
  UsageQuota,
} from '@/types/billing';
import { useExportProgress } from '@/hooks/use-export-progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** User's current plan tier — determines available quality options. */
  planTier: 'free' | 'creator' | 'pro';
  /** Current usage quota for displaying export count. */
  quota: UsageQuota;
  /** Callback to trigger the export on the server. Returns the export ID. */
  onExport: (request: ExportRequest) => Promise<string>;
  /** Callback when the user wants to upgrade. */
  onUpgrade: () => void;
}

// ---------------------------------------------------------------------------
// Quality option metadata
// ---------------------------------------------------------------------------

interface QualityOption {
  value: ExportRequest['quality'];
  label: string;
  description: string;
  estimatedSize: string;
  estimatedTime: string;
  requiresPro: boolean;
}

const QUALITY_OPTIONS: QualityOption[] = [
  {
    value: '720p',
    label: '720p (HD)',
    description: 'Good quality, smallest file',
    estimatedSize: '~50 MB',
    estimatedTime: '~30 seconds',
    requiresPro: false,
  },
  {
    value: '1080p',
    label: '1080p (Full HD)',
    description: 'Recommended for most uses',
    estimatedSize: '~100 MB',
    estimatedTime: '~45 seconds',
    requiresPro: false,
  },
  {
    value: '4k',
    label: '4K (Ultra HD)',
    description: 'Highest quality, largest file',
    estimatedSize: '~300 MB',
    estimatedTime: '~2 minutes',
    requiresPro: true,
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Render progress overlay. */
function ExportProgress({
  status,
  onCancel,
}: {
  status: ExportStatusResponse;
  onCancel: () => void;
}) {
  const pct = status.progress ?? 0;

  return (
    <div className="space-y-4 py-4">
      <div className="text-center">
        <p className="text-sm font-medium">
          {status.status === 'pending' && 'Queued — waiting for render slot...'}
          {status.status === 'rendering' && `Rendering... ${pct}%`}
          {status.status === 'encoding' && `Encoding... ${pct}%`}
          {status.status === 'complete' && 'Export complete!'}
          {status.status === 'failed' && 'Export failed'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Tip */}
      {status.status === 'rendering' && (
        <p className="text-center text-xs text-muted-foreground">
          You can close this dialog — we&apos;ll notify you when your video is
          ready.
        </p>
      )}

      {/* Download link */}
      {status.status === 'complete' && status.downloadUrl && (
        <div className="flex justify-center">
          <Button asChild>
            <a href={status.downloadUrl} download>
              Download Video
            </a>
          </Button>
        </div>
      )}

      {/* Error */}
      {status.status === 'failed' && (
        <p className="text-center text-sm text-destructive">
          {status.error ?? 'An unexpected error occurred. Please try again.'}
        </p>
      )}

      {/* Cancel */}
      {(status.status === 'pending' || status.status === 'rendering' || status.status === 'encoding') && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel Export
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ExportDialog({
  open,
  onOpenChange,
  planTier,
  quota,
  onExport,
  onUpgrade,
}: ExportDialogProps) {
  const [quality, setQuality] = useState<ExportRequest['quality']>('1080p');
  const [includeVoiceover, setIncludeVoiceover] = useState(true);
  const [exportId, setExportId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const { status } = useExportProgress(exportId);
  const isExporting = exportId !== null;
  const isFree = planTier === 'free';
  const atLimit = quota.exportsUsed >= quota.exportsLimit && isFree;

  const handleExport = useCallback(async () => {
    setIsStarting(true);
    try {
      const id = await onExport({ projectId: '', quality, includeVoiceOver: includeVoiceover });
      setExportId(id);
    } catch {
      // TODO: Show error toast
    } finally {
      setIsStarting(false);
    }
  }, [quality, includeVoiceover, onExport]);

  const handleCancel = useCallback(() => {
    // TODO: Call cancel export API endpoint
    setExportId(null);
  }, []);

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setExportId(null);
      setIsStarting(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isExporting ? 'Exporting...' : 'Export Video'}
          </DialogTitle>
          <DialogDescription>
            Render your presentation as an MP4 video file.
          </DialogDescription>
        </DialogHeader>

        {/* --- Export in progress --- */}
        {isExporting && status ? (
          <ExportProgress status={status} onCancel={handleCancel} />
        ) : (
          <>
            <div className="space-y-5 py-2">
              {/* Quality selection */}
              <div className="space-y-2">
                <Label>Quality</Label>
                <div className="space-y-2">
                  {QUALITY_OPTIONS.map((opt) => {
                    const locked = opt.requiresPro && planTier !== 'pro';
                    return (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                          quality === opt.value && !locked
                            ? 'border-primary bg-primary/5'
                            : locked
                              ? 'cursor-not-allowed border-border opacity-50'
                              : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="quality"
                          value={opt.value}
                          checked={quality === opt.value}
                          onChange={() => !locked && setQuality(opt.value)}
                          disabled={locked}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {opt.label}
                            </span>
                            {locked && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Pro only
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {opt.description} &middot; {opt.estimatedSize} &middot;{' '}
                            {opt.estimatedTime}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <Label>Options</Label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeVoiceover}
                    onChange={(e) => setIncludeVoiceover(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Include voice-over</span>
                </label>
              </div>

              {/* Usage info */}
              <div className="rounded-md border p-3 text-sm">
                <p className="text-muted-foreground">
                  Your exports this month:{' '}
                  <span className="font-medium text-foreground">
                    {quota.exportsUsed}/{quota.exportsLimit === -1 ? '∞' : quota.exportsLimit}
                  </span>
                </p>
              </div>

              {/* Free tier watermark warning */}
              {isFree && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-800 dark:bg-yellow-950">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Free tier exports include a watermark
                  </p>
                  <button
                    className="mt-1 text-xs text-primary underline"
                    onClick={onUpgrade}
                  >
                    Upgrade to Creator for watermark-free exports
                  </button>
                </div>
              )}

              {/* At-limit block */}
              {atLimit && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950">
                  <p className="font-medium text-red-800 dark:text-red-200">
                    You&apos;ve reached your monthly export limit
                  </p>
                  <Button size="sm" className="mt-2" onClick={onUpgrade}>
                    Upgrade for Unlimited Exports
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isStarting || atLimit}
              >
                {isStarting ? 'Starting...' : 'Export Video'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
