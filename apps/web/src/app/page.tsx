import { redirect } from 'next/navigation';
import { routing } from '@/lib/i18n-routing';

// This page only renders when the user visits the root path
export default function RootPage() {
  // Redirect to the default locale
  redirect(`/${routing.defaultLocale}`);
}
