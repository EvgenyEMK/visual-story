import { redirect } from 'next/navigation';
import { routing } from '@/lib/i18n-routing';

export default async function NotFound() {
  // For unmatched routes, redirect to default locale home
  redirect(`/${routing.defaultLocale}`);
}
