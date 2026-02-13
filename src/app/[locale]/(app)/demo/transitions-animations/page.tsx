import { setRequestLocale } from 'next-intl/server';
import { TransitionsAnimationsClient } from '@/components/demo/TransitionsAnimationsClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TransitionsAnimationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TransitionsAnimationsClient />;
}
