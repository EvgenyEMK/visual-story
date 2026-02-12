import { setRequestLocale } from 'next-intl/server';
import { SlidePlayClient } from '@/components/slide-play/SlidePlayClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SlidePlayPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SlidePlayClient />;
}
