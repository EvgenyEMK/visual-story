# User Profile

> **Status:** `planned`
> **MVP:** Yes

## Overview

The user profile module provides the authenticated user's dashboard experience — managing projects (presentations), account settings, and subscription/billing. This is the "home base" for logged-in users.

## Features

| Feature | File | Summary |
|---------|------|---------|
| Projects Library | [projects-library.md](./projects-library.md) | Dashboard listing all user projects with create, open, duplicate, delete, and search |
| Subscription & Billing | [subscription-billing.md](./subscription-billing.md) | Freemium plan management, Stripe integration, usage tracking, upgrade/downgrade flows |

## Future Features (Phase 2+)

- **Account settings** — Profile name, email, avatar, password change
- **Team management** — Invite members, assign roles, manage seats (Team/Enterprise tiers)
- **Workspace switching** — Switch between personal and team workspaces
- **Usage analytics** — Presentation view counts, export history, storage usage
- **Notification preferences** — Email notifications for sharing, comments, billing

## Related Modules

- [auth/](../auth/) — Authentication flows (login, register, password reset)
- [pricing/](../pricing/) — Plan comparison page that links to subscription management
- [slide-editor/](../slide-editor/) — Users open projects from the library into the editor
