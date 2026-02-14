import { setRequestLocale } from 'next-intl/server';
import { DemoHubClient } from '@/components/demo/DemoHubClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DemoHubClient />;
}
