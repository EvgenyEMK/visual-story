import { setRequestLocale } from 'next-intl/server';
import { SlideEditorClient } from '@/components/slide-editor/SlideEditorClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SlideEditorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SlideEditorClient />;
}
