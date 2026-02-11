import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export default async function CatchAll({ params }: Props) {
  // This catch-all route handles any unmatched paths within [locale]
  // It triggers the not-found.tsx handler
  await params; // Ensure params are consumed
  notFound();
}
