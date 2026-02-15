import { setRequestLocale } from 'next-intl/server';
import { DataStructuresClient } from '@/components/dev/DataStructuresClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DataStructuresPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DataStructuresClient />;
}
