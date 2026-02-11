// Extracted from docs/modules/user-management/subscription-billing.md

import type Stripe from 'stripe';
import { stripe } from './client';
import { getPlanFromPriceId } from './plans';
import { supabase } from '@/lib/db/supabase';

/**
 * Handle successful checkout session completion.
 * Creates or updates the user's subscription record and upgrades their plan.
 */
export async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  ) as Stripe.Subscription;

  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);

  // Update user plan in profiles table
  await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId);

  // Upsert subscription record
  const periodStart = (subscription as unknown as Record<string, number>).current_period_start;
  const periodEnd = (subscription as unknown as Record<string, number>).current_period_end;

  await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        current_period_start: periodStart
          ? new Date(periodStart * 1000).toISOString()
          : new Date().toISOString(),
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  // TODO: Send subscription confirmation email via Resend
}

/**
 * Handle subscription updates (plan changes, renewals).
 * Syncs the latest subscription state from Stripe to the database.
 */
export async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription
) {
  const customer = (await stripe.customers.retrieve(
    subscription.customer as string
  )) as Stripe.Customer;

  const userId = customer.metadata.userId;
  if (!userId) return;

  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);

  // Update user plan
  await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId);

  // Update subscription record
  const periodStart = (subscription as unknown as Record<string, number>).current_period_start;
  const periodEnd = (subscription as unknown as Record<string, number>).current_period_end;

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : new Date().toISOString(),
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : new Date().toISOString(),
    })
    .eq('user_id', userId);
}

/**
 * Handle subscription cancellation.
 * Downgrades the user back to the free plan.
 */
export async function handleSubscriptionCancelled(
  subscription: Stripe.Subscription
) {
  const customer = (await stripe.customers.retrieve(
    subscription.customer as string
  )) as Stripe.Customer;

  const userId = customer.metadata.userId;
  if (!userId) return;

  // Downgrade user to free plan
  await supabase
    .from('profiles')
    .update({ plan: 'free' })
    .eq('id', userId);

  // Mark subscription as cancelled
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', userId);

  // TODO: Send cancellation confirmation email via Resend
}

/**
 * Handle failed payment.
 * Logs the failure and can trigger notification to the user.
 */
export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const customer = (await stripe.customers.retrieve(
    customerId
  )) as Stripe.Customer;

  const userId = customer.metadata.userId;
  if (!userId) return;

  // Update subscription status to past_due
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('user_id', userId);

  // TODO: Send payment failed notification email via Resend
  console.warn('Payment failed for user:', userId, 'invoice:', invoice.id);
}
