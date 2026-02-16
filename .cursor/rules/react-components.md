---
description: "React/Next.js component patterns: shadcn/ui, Server Components, Radix UI, Tailwind CSS, motion.dev, next-intl"
globs: ["**/*.tsx"]
alwaysApply: false
---

# React Component Patterns

## Component Structure

- Use `function` declarations for components (hoisted, better stack traces, consistent style).
- One component per file. Co-locate its props interface in the same file.
- Separate logic from presentation — extract hooks for complex state/effects.

```typescript
interface SlideCardProps {
  slide: Slide;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function SlideCard({ slide, isSelected, onSelect }: SlideCardProps) {
  // ...
}
```

## Server Components vs Client Components

- **Server Components by default.** Only add `'use client'` when the component needs:
  - Event handlers (`onClick`, `onChange`, etc.)
  - React hooks (`useState`, `useEffect`, `useRef`, etc.)
  - Browser APIs (`window`, `document`, `localStorage`)
  - Third-party client-only libraries (Zustand stores, motion.dev, Tiptap)
- Keep `'use client'` boundaries as low in the tree as possible — wrap only the interactive part, not the entire page.
- Server Components can `await` data directly. Prefer this over `useEffect` + `fetch`.

## shadcn/ui + Radix UI

This project uses **shadcn/ui** (Radix UI primitives styled with Tailwind CSS) for all base UI components.

- Use existing shadcn/ui components from `components/ui/` before building custom ones.
- Add new shadcn/ui components via CLI: `pnpm dlx shadcn@latest add <component>`
- Compose shadcn/ui primitives with the `cn()` utility for conditional class merging.
- When extending a shadcn/ui component, wrap it — don't modify the generated file directly (makes future updates easier).
- Radix UI handles accessibility (focus management, ARIA, keyboard nav) — don't re-implement.

```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ActionButton({ className, ...props }: ButtonProps) {
  return <Button className={cn('gap-2', className)} {...props} />;
}
```

## Styling with Tailwind CSS

- Tailwind utility classes are the primary styling method. No custom CSS files unless absolutely necessary.
- Use `cn()` (clsx + tailwind-merge) for conditional and composable class names.
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints.
- Design tokens: use Tailwind theme values (`text-primary`, `bg-muted`, `border-border`) over hardcoded colors.
- Dark mode: use `dark:` variant when applicable. shadcn/ui components support it out of the box.

## State Management

- **Local UI state:** `useState` / `useReducer` for component-scoped state (form inputs, toggles, open/close).
- **Global app state:** Zustand stores for cross-component state (project, editor, player). Import from `@/stores/`.
- **Server state:** Fetch in Server Components or use API routes. No dedicated data-fetching library in MVP.
- **URL state:** Use Next.js `useSearchParams` / `usePathname` for shareable UI state (active tab, filters).

## Internationalisation (next-intl)

All user-facing text must go through `next-intl`. Never hardcode display strings.

```typescript
import { useTranslations } from 'next-intl';

export function WelcomeBanner() {
  const t = useTranslations('dashboard');
  return <h1>{t('welcome')}</h1>;
}
```

- Translation keys live in `src/i18n/messages/{locale}.json`.
- URL-based locale routing: `[locale]/...` (e.g., `/en/dashboard`, `/fr/editor`).

## Performance

- Lazy-load heavy components with `next/dynamic`: Remotion, Tiptap editor, complex chart components.
- Use `React.memo` only when profiling shows unnecessary re-renders — don't preemptively optimise.
- Prefer `useMemo` / `useCallback` for expensive computations or stable callback references passed to memoised children.
- Images: use `next/image` with appropriate `width`, `height`, and `priority` for above-the-fold.

## Patterns to Avoid

- No prop drilling beyond 2 levels — use Zustand stores or React context.
- No `useEffect` for data fetching — use Server Components or API routes.
- No `index.tsx` barrel files that re-export everything — they defeat tree-shaking.
- No inline styles — use Tailwind classes.
- No `any` in props — always type props explicitly.
