import { setRequestLocale } from 'next-intl/server';
import { ContentBuildingBlocksClient } from '@/components/demo/ContentBuildingBlocksClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContentBuildingBlocksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContentBuildingBlocksClient />;
}
