// Extracted from docs/modules/user-management/presentations-library.md

import { supabase } from '@/lib/db/supabase';
import { uploadToR2 } from '@/lib/storage/r2';

const DEFAULT_THUMBNAIL_URL = '/images/default-thumbnail.png';

/**
 * Generate and store a thumbnail for a presentation.
 *
 * Uses Remotion's renderStill to capture the first slide as a PNG,
 * then uploads to R2 and updates the presentation record.
 *
 * TODO: Implement with Remotion renderStill when @remotion/renderer is installed:
 * ```
 * import { renderStill } from '@remotion/renderer';
 * import { bundle } from '@remotion/bundler';
 *
 * const bundled = await bundle(path.resolve('./src/remotion/index.ts'));
 * const thumbnailPath = `/tmp/thumb-${presentationId}.png`;
 * await renderStill({
 *   composition: 'Thumbnail',
 *   serveUrl: bundled,
 *   output: thumbnailPath,
 *   inputProps: { presentationId },
 * });
 * const buffer = fs.readFileSync(thumbnailPath);
 * const url = await uploadToR2(buffer, `thumbnails/${presentationId}.png`, 'image/png');
 * ```
 *
 * @param presentationId - The presentation to generate a thumbnail for
 * @returns URL of the generated thumbnail
 */
export async function generateThumbnail(
  presentationId: string
): Promise<string> {
  // TODO: Replace with actual Remotion renderStill + R2 upload
  const url = DEFAULT_THUMBNAIL_URL;

  // Update the presentation's thumbnail URL in the database
  await supabase
    .from('presentations')
    .update({ thumbnail_url: url })
    .eq('id', presentationId);

  return url;
}
