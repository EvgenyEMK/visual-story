import { setRequestLocale } from 'next-intl/server';
import { SlideLayoutTemplatesClient } from '@/components/demo/SlideLayoutTemplatesClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SlideLayoutTemplatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SlideLayoutTemplatesClient />;
}
