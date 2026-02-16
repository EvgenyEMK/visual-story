---
description: "VisualFlow monorepo structure, workspace packages, key directories, and dev commands"
alwaysApply: true
---

# Project Context

VisualFlow is a Turborepo monorepo with pnpm workspaces.

## Workspace Packages

| Package | Path | Purpose |
|---------|------|---------|
| `@visual-flow/web` | `apps/web` | Next.js 16 frontend (App Router) |
| `@visual-flow/shared` | `packages/shared` | Shared types and utilities (scaffold) |
| `@visual-flow/db` | `packages/db` | Database client layer (scaffold) |

## Key Directories (`apps/web/src/`)

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router — pages, layouts, API routes |
| `app/[locale]/(app)/` | Authenticated app routes (dashboard, editor, player) |
| `app/[locale]/(marketing)/` | Public marketing pages |
| `app/[locale]/auth/` | Authentication pages |
| `app/api/` | API route handlers |
| `components/` | React components organised by feature |
| `components/ui/` | shadcn/ui base components (Radix + Tailwind) |
| `components/slide-ui/` | Reusable slide UI library (atoms, molecules, layouts) |
| `components/animation/` | Slide animation architecture (SlideFrame, AnimationLayer, ItemRenderer) |
| `components/slide-play/` | Web player (motion.dev) |
| `components/slide-play-video/` | Video player (Remotion, lazy-loaded) |
| `lib/` | Service integrations (supabase, ai, tts, stripe, storage) |
| `stores/` | Zustand state stores (project, editor, player, undo-redo) |
| `types/` | TypeScript type definitions (slide, scene, animation, project, etc.) |
| `remotion/` | Remotion video compositions |
| `i18n/` | Internationalisation message files |

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps via Turborepo |
| `pnpm dev:web` | Start only the Next.js app |
| `pnpm build` | Build all packages (cached via Turbo) |
| `pnpm test` | Run all tests across workspace |
| `pnpm lint` | Lint all packages |

**pnpm is enforced.** Never use npm, yarn, or bun. To add a dependency to the web app:

```
pnpm --filter @visual-flow/web add <package>
```

## Documentation

Product and technical docs live in `docs/` (131+ markdown files). Read relevant docs before making significant changes:

- `docs/product-summary/` — product vision, MVP scope, competitive analysis
- `docs/product-modules/` — feature specs by module
- `docs/technical-architecture/` — architecture overview, ADRs, system design
