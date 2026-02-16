# VisualStory — Project Rules

> Cross-tool AI rules consumed by Cursor, Claude Code, Codex, and Gemini CLI.
> Tool-specific configuration lives in `.cursor/rules/` and `CLAUDE.md`.

## Product

VisualStory is a SaaS platform for creating animated interactive presentations with synchronized voice-over. Users input a script, the system generates slides with professional animations, and exports to video (Remotion) or interactive web player (motion.dev).

- **Primary ICP:** Business users (project managers, team leads, analysts) at SMBs who create recurring presentations.
- **Secondary ICP:** Individual content creators building audiences on YouTube, online courses, social media.
- **Business model:** Freemium with Pro ($29-49/mo), Team ($99-199/mo), and Enterprise tiers.

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Monorepo | Turborepo 2.x + pnpm 10.x | Workspaces: `apps/*`, `packages/*` |
| Frontend | Next.js 16 (App Router) | Deployed on Vercel |
| Language | TypeScript 5 (strict) | Throughout the entire codebase |
| Styling | Tailwind CSS 4 | Utility-first, no custom CSS unless necessary |
| UI Components | shadcn/ui (Radix UI + Tailwind) | Accessible, customisable primitives |
| State | Zustand 5 | Lightweight stores by domain |
| Web Animation | motion.dev 12 | DOM animations, layout transitions, flights |
| Video Engine | Remotion 4 | React-based video rendering, lazy-loaded |
| Database | PostgreSQL via Supabase | RLS for multi-tenant isolation |
| Auth | Supabase Auth + `@supabase/ssr` | Email + Google OAuth |
| AI / LLM | OpenAI (GPT-4o) | Script analysis, slide generation |
| AI / TTS | ElevenLabs | Text-to-speech, word-level timestamps |
| Storage | Cloudflare R2 | Zero-egress media storage |
| Payments | Stripe | Subscriptions + webhook verification |
| i18n | next-intl | URL-based locale routing `[locale]/...` |
| Testing | Vitest + Testing Library | Unit + component tests |

## Monorepo Structure

```
visual-story/
├── apps/
│   └── web/                  # @visual-story/web — Next.js frontend
│       ├── src/
│       │   ├── app/          # App Router (pages, layouts, API routes)
│       │   ├── components/   # React components by feature
│       │   ├── hooks/        # Custom React hooks
│       │   ├── lib/          # Service integrations (supabase, ai, tts, stripe, storage)
│       │   ├── remotion/     # Remotion video compositions (lazy-loaded)
│       │   ├── services/     # Business logic services
│       │   ├── stores/       # Zustand state stores
│       │   ├── types/        # TypeScript type definitions
│       │   ├── config/       # App configuration
│       │   └── i18n/         # Internationalisation messages
│       └── ...config files
├── packages/
│   ├── shared/               # @visual-story/shared — shared types & utils (scaffold)
│   └── db/                   # @visual-story/db — database client layer (scaffold)
├── docs/                     # Product & technical documentation (131+ files)
└── ...root config
```

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps via Turborepo |
| `pnpm dev:web` | Start only the Next.js app |
| `pnpm build` | Build all packages (cached) |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm --filter @visual-story/web add <pkg>` | Add dependency to web app |

**Package manager:** pnpm is enforced via `preinstall` script. Never use npm or yarn.

## Core Architecture Concepts

### SlideItem Tree

The slide content model uses a recursive discriminated union:

```
SlideItem = LayoutItem | CardItem | AtomItem
```

- **LayoutItem** — container with `layoutType` (grid/flex/sidebar/split/stack) and `children: SlideItem[]`
- **CardItem** — styled container with `children` and optional `detailItems` for expandable detail
- **AtomItem** — leaf node with `atomType` (text/icon/shape/image) and `content`

All consumers use the `SlideItem` tree via `Slide.items`. The legacy `Slide.elements` flat array is deprecated.

### Scenes + Widget State Layers (ADR-001)

Content and animation are separated:
- **Scene** = a narrative content unit (what the presenter talks about)
- **WidgetStateLayer** = animation/interaction behaviour config (how widgets appear and react)

Changing animation mode only modifies the WidgetStateLayer — scene count, titles, and notes are preserved. Smart widget interactions (expand/collapse) are modelled as widget behaviour, not content units.

### Three-Layer Rendering (Web Player)

Inside `SlideFrame`:
1. **Layout Layer (z:0)** — DOM flex/grid via `ItemRenderer`, renders SlideItem tree recursively
2. **Animation Layer (z:50)** — motion.dev `AnimatePresence`, cross-boundary flight clones
3. **HUD Layer (z:100)** — controls, debug labels, badges

### Remotion Isolation

Remotion lives at `/slide-play-video` and is lazy-loaded via `next/dynamic({ ssr: false })`. It uses `flattenItemsAsElements()` to convert the SlideItem tree to a flat array for frame-based rendering. Never import Remotion in the web player; never import motion.dev in Remotion compositions.

## Documentation

Extensive product and technical documentation lives in `docs/`:

- `docs/product-summary/` — product vision, MVP, competitive analysis
- `docs/product-modules/` — feature specs by module (auth, editor, player, export, etc.)
- `docs/technical-architecture/` — architecture overview, ADRs, data models

Read relevant docs before making significant architectural changes.
