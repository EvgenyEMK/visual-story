'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { routing } from '@/lib/i18n-routing';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={cn(
            'px-2 py-1 text-xs rounded transition-colors',
            locale === loc
              ? 'bg-muted'
              : 'hover:bg-muted'
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
