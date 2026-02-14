// Extracted from docs/modules/export-publish/embed-sharing.md

import type { ShareData } from '@/types/sharing';

/**
 * Social sharing URL builders.
 * Generates platform-specific sharing URLs with pre-filled content.
 */
export const shareUrls = {
  twitter: (data: ShareData) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}`,

  linkedin: (data: ShareData) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,

  facebook: (data: ShareData) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
};

/**
 * Open a social sharing popup for the given platform.
 *
 * @param platform - Social media platform ('twitter' | 'linkedin' | 'facebook')
 * @param data - Share data including URL, title, and optional description
 */
export function shareToSocial(
  platform: 'twitter' | 'linkedin' | 'facebook',
  data: ShareData
) {
  const url = shareUrls[platform](data);
  window.open(url, '_blank', 'width=600,height=400');
}

/**
 * Use the native Web Share API (primarily for mobile devices).
 * Falls back silently if the Web Share API is not available.
 *
 * @param data - Share data including URL, title, and optional description
 */
export async function nativeShare(data: ShareData) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: data.url,
    });
  }
}
