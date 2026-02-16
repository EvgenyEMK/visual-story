# VisualStory — Product Modules

> Product documentation managed as code. Each module represents a user-facing feature set.

## Conventions

- **Module** = a top-level folder representing a major feature area from the user's perspective
- **README.md** in every folder — summarizes the module/feature and lists its contents
- **Feature specs** follow the template in [`_templates/feature-spec.md`](./_templates/feature-spec.md)
- **User stories** follow the template in [`_templates/user-story.md`](./_templates/user-story.md)
- Complex features get their own sub-folder with a `user-stories/` directory
- Simple features are documented in a single `.md` file

## Module Index

| Module | Description | MVP | Status |
|--------|-------------|-----|--------|
| [slide-editor/](./slide-editor/) | Core authoring experience — canvas, timeline, animations, voice sync, AI, and export | Yes | `in-progress` |
| [slide-visuals/](./slide-visuals/) | Visual building blocks — atoms, molecules, smart widgets, content layouts, layout templates | Yes | `in-progress` |
| [slide-player/](./slide-player/) | Interactive web-based presentation viewer with shareable URLs | Yes | `planned` |
| [home-page/](./home-page/) | Landing page for new visitors — value proposition, demo showcase, CTA | Yes | `planned` |
| [demo/](./demo/) | Interactive product demonstration and sample presentations | Yes | `planned` |
| [pricing/](./pricing/) | Plan comparison page with Free, Pro, Team, and Enterprise tiers | Yes | `planned` |
| [user-profile/](./user-profile/) | Logged-in user dashboard — projects library, subscription & billing management | Yes | `planned` |
| [auth/](./auth/) | Authentication flows — sign-up, login, password reset, OAuth | Yes | `planned` |
| [backoffice-admin/](./backoffice-admin/) | Internal admin panel for customer management and platform operations | No | `planned` |

## Templates

| Template | Purpose |
|----------|---------|
| [feature-spec.md](./_templates/feature-spec.md) | Standard structure for documenting a product feature |
| [user-story.md](./_templates/user-story.md) | Standard format for user stories with acceptance criteria |

## Folder Structure Overview

```
product-modules/
├── README.md                  ← you are here
├── _templates/
│   ├── feature-spec.md
│   └── user-story.md
├── slide-editor/              ★ Most complex module
│   ├── canvas/
│   ├── timeline/
│   ├── script-input/
│   ├── animations/
│   │   ├── element-animations/
│   │   ├── grouped-animations/
│   │   └── slide-transitions/
│   ├── voice-sync/
│   ├── ai-assistant/
│   └── export/
├── slide-visuals/             ★ Visual building blocks (shared across editor & player)
│   ├── visual-items/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── layout-molecules/
│   │   └── interactive-layouts/
│   ├── content-layouts/
│   │   ├── columns/
│   │   ├── grids/
│   │   ├── cards-slide/
│   │   ├── navigation/
│   │   └── other/
│   └── layouts-and-templates/
├── slide-player/
├── home-page/
├── demo/
├── pricing/
├── user-profile/
├── auth/
└── backoffice-admin/
```

## Related Documentation

- [Product Summary](../product-summary/product-summary.md) — Business context, vision, ICP, and competitive analysis
- [MVP Specification](../product-summary/MVP-Minimum-Viable-Product.md) — MVP scope, timeline, and success metrics
- [Technical Architecture](../technical-architecture/overview.md) — System design, tech stack, and architecture decisions
