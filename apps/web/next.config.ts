import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const remoteImagePatterns: RemotePattern[] = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    pathname: '/**',
  },
];

if (supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl);
    remoteImagePatterns.push({
      protocol: 'https',
      hostname,
      pathname: '/**',
    });
  } catch (error) {
    console.warn('[next.config] Invalid NEXT_PUBLIC_SUPABASE_URL for image remote pattern:', error);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: remoteImagePatterns,
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default withNextIntl(nextConfig);
