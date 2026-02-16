// Extracted from docs/modules/export-publish/video-export.md

import { supabase } from '@/lib/db/supabase';
import type { ExportRequest, ExportResponse } from '@/types/billing';

/**
 * Remotion Lambda configuration for serverless video rendering.
 *
 * TODO: Update with actual Lambda function name and serve URL after deployment.
 * See remotion.config.ts for full Remotion configuration.
 */
export const lambdaConfig = {
  region: 'us-east-1' as const,
  functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME || '',
  serveUrl: process.env.REMOTION_SERVE_URL || '',
  framesPerLambda: 20,
  memorySizeInMb: 2048,
  timeoutInMilliseconds: 240_000,
};

/**
 * Get video quality configuration for a given resolution.
 * Returns width, height, and CRF (Constant Rate Factor) for ffmpeg.
 * Lower CRF = higher quality = larger file size.
 *
 * @param quality - Resolution string ('720p' | '1080p' | '4k')
 * @returns Video dimensions and encoding quality settings
 */
export function getQualityConfig(quality: string) {
  switch (quality) {
    case '720p':
      return { width: 1280, height: 720, crf: 23 };
    case '1080p':
      return { width: 1920, height: 1080, crf: 20 };
    case '4k':
      return { width: 3840, height: 2160, crf: 18 };
    default:
      return { width: 1920, height: 1080, crf: 20 };
  }
}

/**
 * Estimate render time based on project complexity and quality.
 *
 * Rough estimates:
 * - 720p: ~5s per slide
 * - 1080p: ~10s per slide
 * - 4K: ~15s per slide
 *
 * @param slideCount - Number of slides in the project
 * @param quality - Video quality setting
 * @returns Estimated render time in seconds
 */
export function estimateRenderTime(
  slideCount: number,
  quality: string
): number {
  const baseTime = slideCount * 5; // 5 seconds per slide
  const qualityMultiplier =
    quality === '4k' ? 3 : quality === '1080p' ? 2 : 1;
  return baseTime * qualityMultiplier;
}

/**
 * Create an export record in the database.
 * Called at the start of the export pipeline to track progress.
 *
 * @param presentationId - The presentation being exported
 * @param userId - The user initiating the export
 * @param quality - Selected quality setting
 * @returns The created export record ID
 */
export async function createExportRecord(
  presentationId: string,
  userId: string,
  quality: string
): Promise<string> {
  const { data, error } = await supabase
    .from('exports')
    .insert({
      presentation_id: presentationId,
      user_id: userId,
      quality,
      status: 'queued',
      type: 'video',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

/**
 * Update an export record's status and optional download URL.
 * Called by the render pipeline and webhook handler.
 *
 * @param exportId - The export record ID
 * @param status - New status ('queued' | 'rendering' | 'complete' | 'failed')
 * @param downloadUrl - URL to the rendered video (when complete)
 */
export async function updateExportStatus(
  exportId: string,
  status: string,
  downloadUrl?: string
): Promise<void> {
  await supabase
    .from('exports')
    .update({
      status,
      download_url: downloadUrl,
      completed_at: status === 'complete' ? new Date().toISOString() : undefined,
    })
    .eq('id', exportId);
}
