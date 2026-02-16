# VisualStory — Claude Code Configuration

See AGENTS.md for all project rules, architecture, and conventions.

## Deep Context

For detailed understanding of specific areas, read these docs:

- @docs/technical-architecture/overview.md — full technical architecture
- @docs/technical-architecture/adr-001-scenes-widget-state-layers.md — Scenes + Widget State Layers
- @docs/product-summary/product-summary.md — product vision and ICP
- @docs/product-summary/MVP-Minimum-Viable-Product.md — MVP scope and features

## Claude-Specific Guidelines

- Use Sonnet for most coding tasks. Switch to Opus for complex architecture, debugging, or deep reasoning.
- Use `/compact` at logical task breakpoints (after research, after completing a milestone, after failed approach).
- Use `/clear` between unrelated tasks.
- Keep subagent tasks focused and small — prefer sequential subagents over broad parallel ones for this codebase size.

## Package Manager

This project uses pnpm. All dependency commands must use pnpm:

```bash
pnpm install
pnpm --filter @visual-story/web add <package>
pnpm dev
pnpm build
pnpm test
```
