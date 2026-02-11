import { redirect } from 'next/navigation';
import { routing } from '@/lib/i18n-routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NotFound({ params }: Props) {
  const locale = (await params)?.locale || routing.defaultLocale;

  // Ensure locale is valid, fallback to default if not
  const validLocale = routing.locales.includes(locale as typeof routing.locales[number])
    ? locale as typeof routing.locales[number]
    : routing.defaultLocale;

  // Redirect to home page for the current locale
  redirect(`/${validLocale}`);
}
