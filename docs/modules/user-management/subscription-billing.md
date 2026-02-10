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

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const PLANS = {
  creator_monthly: {
    priceId: 'price_creator_monthly_xxx',
    name: 'Creator',
    price: 2900, // cents
    interval: 'month',
    features: ['Unlimited exports', 'No watermark', 'All voices'],
  },
  creator_annual: {
    priceId: 'price_creator_annual_xxx',
    name: 'Creator (Annual)',
    price: 28800, // cents
    interval: 'year',
    features: ['Unlimited exports', 'No watermark', 'All voices'],
  },
  pro_monthly: {
    priceId: 'price_pro_monthly_xxx',
    name: 'Pro',
    price: 4900,
    interval: 'month',
    features: ['4K exports', 'Priority rendering', 'Custom voices'],
  },
  pro_annual: {
    priceId: 'price_pro_annual_xxx',
    name: 'Pro (Annual)',
    price: 49200,
    interval: 'year',
    features: ['4K exports', 'Priority rendering', 'Custom voices'],
  },
};
```

### Checkout Flow

```typescript
// app/api/billing/checkout/route.ts
export async function POST(req: Request) {
  const user = await getAuthUser(req);
  const { priceId } = await req.json();
  
  // Get or create Stripe customer
  let customerId = user.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    
    customerId = customer.id;
    
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?cancelled=true`,
    metadata: { userId: user.id },
  });
  
  return Response.json({ url: session.url });
}
```

### Customer Portal

```typescript
// app/api/billing/portal/route.ts
export async function POST(req: Request) {
  const user = await getAuthUser(req);
  
  if (!user.stripeCustomerId) {
    return Response.json({ error: 'No subscription found' }, { status: 400 });
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });
  
  return Response.json({ url: session.url });
}
```

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancelled(subscription);
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
  }
  
  return Response.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;
  
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  
  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);
  
  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });
  
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
  
  // Send welcome email
  await sendSubscriptionWelcomeEmail(userId, plan);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(
    subscription.customer as string
  ) as Stripe.Customer;
  
  const userId = customer.metadata.userId;
  
  await prisma.user.update({
    where: { id: userId },
    data: { plan: 'FREE' },
  });
  
  await prisma.subscription.update({
    where: { userId },
    data: { status: 'cancelled' },
  });
  
  await sendSubscriptionCancelledEmail(userId);
}
```

### Usage Tracking

```typescript
// lib/usage.ts
interface UsageQuota {
  exportsUsed: number;
  exportsLimit: number;
  storageUsed: number; // bytes
  storageLimit: number;
  projectsUsed: number;
  projectsLimit: number;
}

const PLAN_LIMITS = {
  FREE: {
    exports: 2,
    storage: 1 * 1024 * 1024 * 1024, // 1 GB
    projects: 5,
  },
  CREATOR: {
    exports: Infinity,
    storage: 10 * 1024 * 1024 * 1024, // 10 GB
    projects: Infinity,
  },
  PRO: {
    exports: Infinity,
    storage: 50 * 1024 * 1024 * 1024, // 50 GB
    projects: Infinity,
  },
};

export async function getUsageQuota(userId: string): Promise<UsageQuota> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { projects: true } },
      exports: {
        where: {
          createdAt: {
            gte: startOfMonth(new Date()),
          },
        },
      },
    },
  });
  
  const limits = PLAN_LIMITS[user.plan];
  
  // Calculate storage used
  const storageUsed = await calculateStorageUsed(userId);
  
  return {
    exportsUsed: user.exports.length,
    exportsLimit: limits.exports,
    storageUsed,
    storageLimit: limits.storage,
    projectsUsed: user._count.projects,
    projectsLimit: limits.projects,
  };
}

export async function checkExportQuota(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const quota = await getUsageQuota(userId);
  
  if (quota.exportsUsed >= quota.exportsLimit) {
    return {
      allowed: false,
      reason: 'Monthly export limit reached. Upgrade to continue.',
    };
  }
  
  return { allowed: true };
}

export async function incrementExportUsage(userId: string): Promise<void> {
  await prisma.export.create({
    data: {
      userId,
      createdAt: new Date(),
    },
  });
}
```

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

```typescript
interface UpgradePromptProps {
  reason: 'export_limit' | 'quality_4k' | 'no_watermark' | 'storage';
  onUpgrade: () => void;
  onDismiss: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  reason,
  onUpgrade,
  onDismiss,
}) => {
  const messages = {
    export_limit: {
      title: 'Export Limit Reached',
      description: 'You\'ve used all 2 free exports this month. Upgrade to continue creating.',
      cta: 'Upgrade for Unlimited Exports',
    },
    quality_4k: {
      title: '4K Quality',
      description: '4K exports are available on the Pro plan.',
      cta: 'Upgrade to Pro',
    },
    no_watermark: {
      title: 'Remove Watermark',
      description: 'Upgrade to export videos without the VisualStory watermark.',
      cta: 'Upgrade to Creator',
    },
    storage: {
      title: 'Storage Full',
      description: 'You\'ve reached your storage limit. Upgrade for more space.',
      cta: 'Upgrade for More Storage',
    },
  };
  
  const { title, description, cta } = messages[reason];
  
  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <div className="mt-4 flex gap-2">
        <Button onClick={onUpgrade}>{cta}</Button>
        <Button variant="outline" onClick={onDismiss}>
          Maybe Later
        </Button>
      </div>
    </Alert>
  );
};
```

## Database Schema

```prisma
model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique
  user                 User     @relation(fields: [userId], references: [id])
  stripeSubscriptionId String   @unique
  status               String   // active, cancelled, past_due, etc.
  priceId              String?
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

model Export {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  projectId String?
  type      String   // video, web
  createdAt DateTime @default(now())
}
```

## Dependencies
- Stripe SDK
- Stripe Webhooks
- Resend for transactional emails

## Related Features
- [Authentication](./authentication.md)
- [Video Export](../export-publish/video-export.md)
