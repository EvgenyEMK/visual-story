/**
 * Shared SEO metadata constants
 *
 * Metadata Hierarchy in Next.js:
 * - Root layout (app/layout.tsx): Default/fallback metadata for all pages
 * - Page-level generateMetadata: Overrides root layout metadata for specific pages
 */

export const siteMetadata = {
  en: {
    title: 'VisualStory - Create Visual Stories from Scripts',
    description: 'Transform your scripts into engaging visual presentations with AI-powered animations and voiceover.',
  },
  fr: {
    title: 'VisualStory - Créez des Histoires Visuelles à partir de Scripts',
    description: 'Transformez vos scripts en présentations visuelles captivantes avec des animations et une voix off alimentées par l\'IA.',
  },
} as const;

/**
 * Default metadata for root layout (fallback)
 * Uses English as default since it's the defaultLocale
 */
export const defaultMetadata = {
  title: siteMetadata.en.title,
  description: siteMetadata.en.description,
};
