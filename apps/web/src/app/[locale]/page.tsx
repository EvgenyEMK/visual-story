import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  // Use locale-specific metadata, fallback to English
  const metadata = siteMetadata[locale as keyof typeof siteMetadata] || siteMetadata.en;

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">VisualStory</h1>
      <p className="text-muted-foreground">
        Transform your scripts into engaging visual presentations.
      </p>
    </div>
  );
}
