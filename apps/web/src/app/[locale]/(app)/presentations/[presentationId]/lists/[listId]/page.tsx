import { setRequestLocale } from 'next-intl/server';
import { SmartListEditorClient } from '@/components/smart-list-editor/SmartListEditorClient';

interface Props {
  params: Promise<{ locale: string; presentationId: string; listId: string }>;
}

export default async function SmartListEditorPage({ params }: Props) {
  const { locale, presentationId, listId } = await params;
  setRequestLocale(locale);

  return (
    <SmartListEditorClient presentationId={presentationId} listId={listId} />
  );
}
