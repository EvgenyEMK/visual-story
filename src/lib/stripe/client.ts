// Extracted from docs/modules/user-management/subscription-billing.md

import Stripe from 'stripe';

/**
 * Server-side Stripe client instance.
 * Uses STRIPE_SECRET_KEY from environment variables.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});
