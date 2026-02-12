import { setRequestLocale } from 'next-intl/server';
import { UIComponentsClient } from '@/components/ui-components/UIComponentsClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function UIComponentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UIComponentsClient />;
}
