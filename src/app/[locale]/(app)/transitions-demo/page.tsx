import { setRequestLocale } from 'next-intl/server';
import { TransitionsDemoClient } from '@/components/transitions-demo/TransitionsDemoClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TransitionsDemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TransitionsDemoClient />;
}
