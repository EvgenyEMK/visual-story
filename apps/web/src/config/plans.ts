/**
 * Subscription plan definitions and Stripe configuration for VisualStory.
 *
 * @source docs/modules/user-management/subscription-billing.md — Plan Structure
 * @source docs/modules/user-management/subscription-billing.md — Stripe Configuration
 */

import type { Plan, PlanLimits, BillingInterval } from '@/types/billing';

// ---------------------------------------------------------------------------
// Plan Limits
// ---------------------------------------------------------------------------

/**
 * Static plan limits used for quota checks and UI display.
 * -1 means unlimited.
 *
 * @source docs/modules/user-management/subscription-billing.md — Plan Structure
 */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    exportsPerMonth: 2,
    maxQuality: '1080p',
    watermark: true,
    voiceOptions: 3,
    storageGb: 1,
    maxProjects: 5,
    priorityRendering: false,
    support: 'community',
  },
  creator: {
    exportsPerMonth: -1, // unlimited
    maxQuality: '1080p',
    watermark: false,
    voiceOptions: 'all',
    storageGb: 10,
    maxProjects: -1, // unlimited
    priorityRendering: false,
    support: 'email',
  },
  pro: {
    exportsPerMonth: -1, // unlimited
    maxQuality: '4k',
    watermark: false,
    voiceOptions: 'all+custom',
    storageGb: 50,
    maxProjects: -1, // unlimited
    priorityRendering: true,
    support: 'priority',
  },
};

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/** Pricing information for display in the UI. */
export interface PlanPricing {
  plan: Plan;
  displayName: string;
  /** Monthly price in USD (null = free). */
  monthlyPrice: number | null;
  /** Annual price per month in USD (null = free). */
  annualPricePerMonth: number | null;
  /** Annual total billed in USD (null = free). */
  annualTotal: number | null;
  /** Discount percentage for annual billing. */
  annualDiscount: number | null;
  /** Whether this plan is marked as "popular" in the UI. */
  isPopular: boolean;
  /** Feature highlights shown on the pricing card. */
  features: string[];
}

/**
 * Pricing data for all plans.
 * @source docs/modules/user-management/subscription-billing.md — Plan Structure / Pricing Page
 */
export const PLAN_PRICING: PlanPricing[] = [
  {
    plan: 'free',
    displayName: 'Free',
    monthlyPrice: null,
    annualPricePerMonth: null,
    annualTotal: null,
    annualDiscount: null,
    isPopular: false,
    features: [
      '2 exports/month',
      '1080p quality',
      '3 voice options',
      '5 projects',
      'Watermark on exports',
    ],
  },
  {
    plan: 'creator',
    displayName: 'Creator',
    monthlyPrice: 29,
    annualPricePerMonth: 24,
    annualTotal: 288,
    annualDiscount: 17,
    isPopular: true,
    features: [
      'Unlimited exports',
      'No watermark',
      'All voice options',
      '10 GB storage',
      'Email support',
    ],
  },
  {
    plan: 'pro',
    displayName: 'Pro',
    monthlyPrice: 49,
    annualPricePerMonth: 41,
    annualTotal: 492,
    annualDiscount: 16,
    isPopular: false,
    features: [
      'Everything in Creator',
      '4K exports',
      '50 GB storage',
      'Priority rendering',
      'Custom voice',
      'Priority support',
    ],
  },
];

// ---------------------------------------------------------------------------
// Stripe Configuration
// ---------------------------------------------------------------------------

/**
 * Stripe price IDs keyed by plan and interval.
 * Replace placeholder values with real Stripe price IDs from the dashboard.
 *
 * @source docs/modules/user-management/subscription-billing.md — Stripe Configuration
 */
export const STRIPE_PLANS: Record<
  Exclude<Plan, 'free'>,
  Record<BillingInterval, { priceId: string; features: string[] }>
> = {
  creator: {
    monthly: {
      priceId: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID ?? 'price_creator_monthly',
      features: ['Unlimited exports', 'No watermark', 'All voices', '10 GB storage'],
    },
    annual: {
      priceId: process.env.STRIPE_CREATOR_ANNUAL_PRICE_ID ?? 'price_creator_annual',
      features: ['Unlimited exports', 'No watermark', 'All voices', '10 GB storage', 'Save 17%'],
    },
  },
  pro: {
    monthly: {
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? 'price_pro_monthly',
      features: ['Everything in Creator', '4K exports', '50 GB', 'Priority rendering', 'Custom voice'],
    },
    annual: {
      priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? 'price_pro_annual',
      features: ['Everything in Creator', '4K exports', '50 GB', 'Priority rendering', 'Custom voice', 'Save 16%'],
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the PlanLimits for a given plan. */
export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

/** Check if a plan has unlimited exports. */
export function hasUnlimitedExports(plan: Plan): boolean {
  return PLAN_LIMITS[plan].exportsPerMonth === -1;
}

/** Get pricing info for a specific plan. */
export function getPlanPricing(plan: Plan): PlanPricing | undefined {
  return PLAN_PRICING.find((p) => p.plan === plan);
}

/** Convert storage GB to bytes. */
export function storageLimitBytes(plan: Plan): number {
  return PLAN_LIMITS[plan].storageGb * 1024 * 1024 * 1024;
}
