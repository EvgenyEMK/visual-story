// Extracted from docs/modules/user-management/projects-library.md

import { supabase } from '@/lib/db/supabase';
import { uploadToR2 } from '@/lib/storage/r2';

const DEFAULT_THUMBNAIL_URL = '/images/default-thumbnail.png';

/**
 * Generate and store a thumbnail for a project.
 *
 * Uses Remotion's renderStill to capture the first slide as a PNG,
 * then uploads to R2 and updates the project record.
 *
 * TODO: Implement with Remotion renderStill when @remotion/renderer is installed:
 * ```
 * import { renderStill } from '@remotion/renderer';
 * import { bundle } from '@remotion/bundler';
 *
 * const bundled = await bundle(path.resolve('./src/remotion/index.ts'));
 * const thumbnailPath = `/tmp/thumb-${projectId}.png`;
 * await renderStill({
 *   composition: 'Thumbnail',
 *   serveUrl: bundled,
 *   output: thumbnailPath,
 *   inputProps: { projectId },
 * });
 * const buffer = fs.readFileSync(thumbnailPath);
 * const url = await uploadToR2(buffer, `thumbnails/${projectId}.png`, 'image/png');
 * ```
 *
 * @param projectId - The project to generate a thumbnail for
 * @returns URL of the generated thumbnail
 */
export async function generateThumbnail(
  projectId: string
): Promise<string> {
  // TODO: Replace with actual Remotion renderStill + R2 upload
  const url = DEFAULT_THUMBNAIL_URL;

  // Update the project's thumbnail URL in the database
  await supabase
    .from('projects')
    .update({ thumbnail_url: url })
    .eq('id', projectId);

  return url;
}
