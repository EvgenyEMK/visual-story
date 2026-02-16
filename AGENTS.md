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

**Mandatory:** When a new feature is added or an existing feature is enhanced, update the corresponding module documentation in `docs/product-modules/` before considering the work complete. Use templates from `docs/product-modules/_templates/` for consistency.

### Slide Editor Documentation Structure

The slide editor module (`docs/product-modules/slide-editor/`) is organized by **functional task clusters** — each sub-folder represents a coherent user workflow, not a UI panel. A single user action (e.g., "edit an element") may span multiple UI zones (canvas, side panel, bottom panel), so features are grouped by what the user accomplishes, not where it happens on screen.

| Task Cluster | What It Covers |
|--------------|----------------|
| `deck-management/` | Slides CRUD, scenes, reorder, navigate, presentation title, auto-save |
| `element-editing/` | Select, create, edit, style, position elements, element animation assignment |
| `layouts-and-templates/` | Layout templates, slide backgrounds, alignment, grid/snap |
| `animation-and-timing/` | Animation step sequence, grouped animations, transitions, timing, preview |
| `narration-and-voice/` | Speaker notes, TTS generation, voice selection, audio-animation sync |
| `theming/` | Visual themes, colors, fonts, branding |
| `ai-assistant/` | AI prompts, script feedback, visual suggestions, regeneration |
| `preview-and-export/` | Full-screen preview, video export, web link, sharing |
| `_reference/` | Data-model catalogs (animations, visual-items, content-layouts, canvas specs) |

The root `slide-editor/README.md` contains a **feature-to-UI-zone cross-reference matrix** mapping each cluster to the UI zones it touches.

### Documentation Status Tracking

Every README at each level of `docs/product-modules/` must track **status** per feature and per user story using these values:

| Status | Meaning |
|--------|---------|
| `ToDo` | Not started — defined but no implementation work begun |
| `InProgress` | Active development — implementation underway |
| `Done` | Complete — implemented, tested, and working in the product |

**Rules:**
- Feature tables in each README must include a **Status** column with one of the three values above.
- User stories must include the status inline in their heading (e.g., `#### US-CVS-001: View Slide Preview — `ToDo``).
- When implementation of a feature or user story begins, update its status to `InProgress`.
- When implementation is complete and verified, update its status to `Done`.
- Parent folder READMEs must reflect the aggregate status of their sub-features (e.g., if 2 of 5 features are `Done`, the parent shows `InProgress`).
