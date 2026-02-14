// Purpose: Create a Stripe Customer Portal session for subscription management
// Doc: docs/modules/user-management/subscription-billing.md
// Services: @/lib/stripe/client
// TODO: Implement with Supabase queries and service calls

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement — get Stripe customer ID for authenticated user,
  // create portal session with return URL, return portal URL
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
