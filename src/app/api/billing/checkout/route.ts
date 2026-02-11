// Purpose: Create a Stripe Checkout session for plan subscription
// Doc: docs/modules/user-management/subscription-billing.md
// Services: @/lib/stripe/client
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement — accept priceId/planId, get or create Stripe customer,
  // create Checkout session with success/cancel URLs, return session URL
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
