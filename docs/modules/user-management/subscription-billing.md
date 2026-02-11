# Feature: Subscription Billing

## Module
User Management

## Overview
Subscription Billing handles the freemium model, plan management, and payment processing through Stripe. It manages export quotas, feature gating, and upgrade/downgrade flows.

## User Stories

### US-SB-001: View Current Plan
**As a** user  
**I want to** see my current plan and usage  
**So that** I know what features I have access to

**Acceptance Criteria:**
- [ ] Plan name displayed in settings
- [ ] Usage stats (exports, storage)
- [ ] Feature comparison with other plans
- [ ] Upgrade button if on free plan

### US-SB-002: Upgrade to Paid Plan
**As a** free user  
**I want to** upgrade to a paid plan  
**So that** I can access premium features

**Acceptance Criteria:**
- [ ] View available plans and pricing
- [ ] Select plan and billing cycle (monthly/annual)
- [ ] Secure Stripe checkout
- [ ] Immediate access after payment
- [ ] Confirmation email

### US-SB-003: Manage Subscription
**As a** paid user  
**I want to** manage my subscription  
**So that** I can update payment or cancel

**Acceptance Criteria:**
- [ ] Access Stripe customer portal
- [ ] Update payment method
- [ ] Change plan (upgrade/downgrade)
- [ ] Cancel subscription
- [ ] View invoices

### US-SB-004: Handle Export Limits
**As a** free user  
**I want to** see my export limit  
**So that** I know when to upgrade

**Acceptance Criteria:**
- [ ] Export counter shown (X/Y used)
- [ ] Warning at 80% usage
- [ ] Upgrade prompt when limit reached
- [ ] Counter resets monthly

### US-SB-005: Receive Payment Notifications
**As a** subscribed user  
**I want to** receive payment notifications  
**So that** I'm aware of billing events

**Acceptance Criteria:**
- [ ] Payment success email
- [ ] Payment failed email
- [ ] Subscription cancelled email
- [ ] Upcoming renewal reminder

## Plan Structure

| Feature | Free | Creator ($29/mo) | Pro ($49/mo) |
|---------|------|-----------------|--------------|
| Exports/month | 2 | Unlimited | Unlimited |
| Video quality | 1080p | 1080p | 4K |
| Watermark | Yes | No | No |
| Voice options | 3 | All | All + custom |
| Storage | 1 GB | 10 GB | 50 GB |
| Projects | 5 | Unlimited | Unlimited |
| Priority rendering | No | No | Yes |
| Support | Community | Email | Priority |

### Annual Discount
- Creator: $24/mo (billed $288/year) - 17% off
- Pro: $41/mo (billed $492/year) - 16% off

## Technical Specifications

### Stripe Configuration

> **Implementation**: See `src/lib/stripe/client.ts` for Stripe SDK initialization and `src/config/plans.ts` for PLANS configuration (price IDs, features, intervals)

### Checkout Flow

> **Implementation**: See `src/app/api/billing/checkout/route.ts` for the checkout session handler (Stripe customer creation, checkout session with subscription mode)

### Customer Portal

> **Implementation**: See `src/app/api/billing/portal/route.ts` for the billing portal session handler

### Webhook Handler

> **Implementation**: See `src/lib/stripe/webhooks.ts` for webhook event handlers (checkout complete, subscription update, subscription cancelled, payment failed) and `src/app/api/webhooks/stripe/route.ts` for the webhook route

### Usage Tracking

> **Implementation**: See `src/lib/usage/quota.ts` for UsageQuota interface, PLAN_LIMITS configuration, `getUsageQuota`, `checkExportQuota`, and `incrementExportUsage` functions

## UI Components

### Billing Settings Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Settings > Billing                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Current Plan                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🎨 Creator Plan                                     $29/month       │   │
│  │                                                                      │   │
│  │  ✓ Unlimited exports                                                 │   │
│  │  ✓ No watermark                                                      │   │
│  │  ✓ All voice options                                                 │   │
│  │  ✓ 10 GB storage                                                     │   │
│  │                                                                      │   │
│  │  Next billing: March 10, 2026                                        │   │
│  │                                                                      │   │
│  │  [Manage Subscription]  [Upgrade to Pro]                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Usage This Month                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Exports:  ████████████████████░░░░░░░░░░  15 (unlimited)           │   │
│  │  Storage:  ████████░░░░░░░░░░░░░░░░░░░░░░  2.3 GB / 10 GB           │   │
│  │  Projects: ████████████░░░░░░░░░░░░░░░░░░  12 (unlimited)           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Billing History                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Feb 10, 2026  │  Creator Plan (Monthly)  │  $29.00  │  [Invoice]   │   │
│  │  Jan 10, 2026  │  Creator Plan (Monthly)  │  $29.00  │  [Invoice]   │   │
│  │  Dec 10, 2025  │  Creator Plan (Monthly)  │  $29.00  │  [Invoice]   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pricing Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        Choose Your Plan                                     │
│                                                                             │
│      [Monthly]  [Annual - Save 17%]                                         │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │      Free       │  │     Creator     │  │       Pro       │             │
│  │                 │  │    POPULAR      │  │                 │             │
│  │      $0         │  │    $29/mo       │  │    $49/mo       │             │
│  │                 │  │                 │  │                 │             │
│  │  ✓ 2 exports    │  │  ✓ Unlimited    │  │  ✓ Everything   │             │
│  │  ✓ 1080p        │  │  ✓ No watermark │  │    in Creator   │             │
│  │  ✓ 3 voices     │  │  ✓ All voices   │  │  ✓ 4K exports   │             │
│  │  ✓ 5 projects   │  │  ✓ 10 GB        │  │  ✓ 50 GB        │             │
│  │  ✗ Watermark    │  │  ✓ Email support│  │  ✓ Priority     │             │
│  │                 │  │                 │  │  ✓ Custom voice │             │
│  │                 │  │                 │  │                 │             │
│  │  [Current]      │  │  [Upgrade]      │  │  [Upgrade]      │             │
│  │                 │  │                 │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│              All plans include: 7-day money-back guarantee                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Upgrade Prompt Component

> **Implementation**: See `src/components/billing/upgrade-prompt.tsx` for the UpgradePrompt component (reason-based messaging for export_limit, quality_4k, no_watermark, storage)

## Database Schema

> **Implementation**: See `supabase/migrations/00001_initial_schema.sql` for Subscription and Export tables

## Dependencies
- Stripe SDK
- Stripe Webhooks
- Resend for transactional emails

## Related Features
- [Authentication](./authentication.md)
- [Video Export](../export-publish/video-export.md)
