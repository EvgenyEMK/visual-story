// i18n configuration placeholder
// TODO: User will copy i18n configuration from existing project
//
// Expected setup:
// - URL-based locale routing: /{locale}/...
// - Default locale: 'en'
// - Supported locales: ['en'] (extensible without code changes)
// - Message files in src/i18n/messages/{locale}.json
// - next-intl or equivalent library

export const defaultLocale = 'en';
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
