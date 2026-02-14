// Extracted from docs/modules/user-management/subscription-billing.md

import { STRIPE_PLANS, PLAN_LIMITS } from '@/config/plans';
import type { Plan } from '@/types/billing';

/**
 * Re-export plan configuration for convenience.
 * See src/config/plans.ts for full plan definitions.
 */
export { STRIPE_PLANS, PLAN_LIMITS };

/**
 * Resolve a Stripe price ID to a plan name.
 * Looks up the price ID across all configured plans.
 */
export function getPlanFromPriceId(priceId: string): Plan {
  for (const [planName, intervals] of Object.entries(STRIPE_PLANS)) {
    for (const interval of Object.values(intervals)) {
      if (interval.priceId === priceId) {
        return planName as Plan;
      }
    }
  }

  return 'free';
}
