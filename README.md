# VisualFlow

AI-powered visual presentation builder. Create, animate, and export video presentations from scripts.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI, CVA
- **State**: Zustand
- **Animation**: motion.dev (web), Remotion (video export)
- **Backend**: Supabase (PostgreSQL, Auth), Stripe, Cloudflare R2
- **AI**: OpenAI (GPT-4o), ElevenLabs (TTS)

## Project Structure

```
visual-flow/
├── apps/
│   └── web/               # Next.js frontend
├── packages/
│   ├── shared/            # Shared types and utilities
│   └── db/                # Database client layer
├── docs/                  # Architecture and design docs
├── turbo.json             # Turborepo config
└── pnpm-workspace.yaml    # Workspace definition
```

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x (`npm install -g pnpm`)

### Setup

```bash
# Clone
git clone https://github.com/EvgenyEMK/visual-flow.git
cd visual-flow

# Install dependencies
pnpm install

# Configure environment
cp .env.example apps/web/.env.local
# Fill in your API keys (see .env.example for required variables)

# Start development
pnpm dev
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:web` | Start only the Next.js app |
| `pnpm build` | Build all packages (with Turbo caching) |
| `pnpm test` | Run tests across all packages |
| `pnpm lint` | Lint all packages |

### Adding Dependencies

```bash
# Add to the web app
pnpm --filter @visual-flow/web add <package>

# Add to a shared package
pnpm --filter @visual-flow/shared add <package>

# Add a dev dependency to the root
pnpm add -Dw <package>
```

## Documentation

See the [docs/](docs/) directory for detailed documentation:

- [Technical Architecture Overview](docs/technical-architecture/overview.md)
- [Architecture Decisions](docs/technical-architecture/architecture-decisions.md)
- [Product Summary](docs/product-summary/product-summary.md)

## License

Private.
