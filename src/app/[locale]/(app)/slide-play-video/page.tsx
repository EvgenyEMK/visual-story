/**
 * Video player page — lazy-loads Remotion for video preview/export.
 *
 * This route is separate from the main slide-play page so that Remotion's
 * heavy bundle (~200KB+) is only loaded when the user explicitly wants
 * video preview. The main web player at /slide-play never imports Remotion.
 */

import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

const VideoPlayerClient = dynamic(
  () => import('@/components/slide-play-video/VideoPlayerClient').then((m) => m.VideoPlayerClient),
  { ssr: false, loading: () => <VideoPlayerSkeleton /> },
);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SlidePlayVideoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VideoPlayerClient />;
}

function VideoPlayerSkeleton() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-black">
      <div className="text-white/40 text-sm animate-pulse">Loading video player...</div>
    </div>
  );
}
