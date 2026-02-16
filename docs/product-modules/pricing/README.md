# Pricing

> **Status:** `planned`
> **MVP:** Yes

## Overview

The pricing page presents the freemium plan structure and drives conversion from free to paid tiers. It must clearly communicate what's included in each plan and make the upgrade decision easy.

## Planned Features

| Feature | Status | Summary |
|---------|--------|---------|
| Plan comparison table | `planned` | Side-by-side comparison of Free, Pro, Team, and Enterprise tiers |
| Feature gating indicators | `planned` | Clear visual markers for which features are included in each plan |
| CTA buttons | `planned` | "Start Free", "Upgrade to Pro", "Contact Sales" per tier |
| FAQ section | `planned` | Common pricing questions (billing cycle, cancellation, team seats, etc.) |
| Annual vs monthly toggle | `planned` | Switch between billing frequencies with discount indicator |

## Plan Tiers (from product-summary)

| Tier | Price | Key Inclusions |
|------|-------|----------------|
| Free | $0 | 3 presentations, limited widgets, watermark, basic templates |
| Pro | $29-49/mo | Unlimited presentations, all widgets, no watermark, premium templates |
| Team | $99-199/mo | 5-10 seats, collaboration, shared templates, brand kit |
| Enterprise | Custom | SSO, data integrations, admin controls, SLA, dedicated support |

## Dependencies

- [user-profile/subscription-billing](../user-profile/subscription-billing.md) — Stripe integration and plan management logic
- [auth/](../auth/) — Sign-up flow triggered from pricing CTA

## Notes

- Pricing page content is derived from the business model in `docs/product-summary/product-summary.md`.
- A/B testing different price points is a post-launch activity.
