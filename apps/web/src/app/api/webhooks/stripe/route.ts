// Purpose: Handle incoming Stripe webhook events (subscription lifecycle, payment events)
// Doc: docs/modules/user-management/subscription-billing.md
// Services: @/lib/stripe/webhooks
// TODO: Implement with Supabase queries and service calls
//
// IMPORTANT: This route needs raw body parsing for Stripe signature verification.
// In Next.js App Router, use request.text() or request.arrayBuffer() to get the raw body.
// Do NOT use request.json() — Stripe requires the raw body to verify the webhook signature.
// Example:
//   const body = await request.text();
//   const signature = request.headers.get('stripe-signature')!;
//   const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement — verify Stripe signature, parse event,
  // handle events: checkout.session.completed, customer.subscription.updated,
  // customer.subscription.deleted, invoice.payment_failed, etc.
  // Update user/tenant subscription status in Supabase accordingly.
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
