// Extracted from docs/modules/export-publish/video-export.md
// and docs/modules/voice-sync/text-to-speech.md

// TODO: Install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
// import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 storage helpers.
 * R2 is S3-compatible — uses AWS SDK under the hood.
 */

const CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT!;
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const CLOUDFLARE_R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'visual-flow';
const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || CLOUDFLARE_R2_ENDPOINT;

/**
 * Upload a file to Cloudflare R2 storage.
 *
 * TODO: Implement with actual S3Client when @aws-sdk/client-s3 is installed:
 * ```
 * const client = new S3Client({
 *   region: 'auto',
 *   endpoint: CLOUDFLARE_R2_ENDPOINT,
 *   credentials: {
 *     accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
 *     secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
 *   },
 * });
 * await client.send(new PutObjectCommand({
 *   Bucket: CLOUDFLARE_R2_BUCKET,
 *   Key: key,
 *   Body: data,
 *   ContentType: contentType,
 * }));
 * ```
 *
 * @param data - File buffer or string to upload
 * @param key - Storage key (path) within the bucket
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadToR2(
  data: Buffer | string,
  key: string,
  contentType?: string
): Promise<string> {
  // TODO: Implement with S3Client
  console.warn('R2 upload not yet implemented:', key);
  return getPublicUrl(key);
}

/**
 * Get the public URL for a stored file.
 *
 * @param key - Storage key (path) within the bucket
 * @returns Public URL for the file
 */
export function getPublicUrl(key: string): string {
  return `${CLOUDFLARE_R2_PUBLIC_URL}/${CLOUDFLARE_R2_BUCKET}/${key}`;
}

/**
 * Get a signed URL for temporary access to a private file.
 *
 * TODO: Implement with getSignedUrl from @aws-sdk/s3-request-presigner
 *
 * @param key - Storage key (path) within the bucket
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns Temporary signed URL
 */
export async function getSignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  // TODO: Implement with @aws-sdk/s3-request-presigner
  return `${CLOUDFLARE_R2_ENDPOINT}/${CLOUDFLARE_R2_BUCKET}/${key}?expires=${expiresIn}`;
}
