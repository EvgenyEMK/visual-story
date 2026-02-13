import { setRequestLocale } from 'next-intl/server';
import { ContentWidgetsClient } from '@/components/demo/ContentWidgetsClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContentWidgetsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContentWidgetsClient />;
}
