// Extracted from docs/modules/user-management/subscription-billing.md

import { supabase } from '@/lib/db/supabase';
import { PLAN_LIMITS } from '@/config/plans';
import type { UsageQuota, Plan } from '@/types/billing';

/**
 * Get the current usage quota for a user.
 * Queries profiles for plan, exports for monthly count, presentations for total count.
 *
 * @param userId - The user's ID
 * @returns Current usage and limits based on the user's plan
 */
export async function getUsageQuota(userId: string): Promise<UsageQuota> {
  // Get user profile with plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  const plan = (profile?.plan || 'free') as Plan;
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  // Count exports this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: exportsCount } = await supabase
    .from('exports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  // Count presentations
  const { count: presentationsCount } = await supabase
    .from('presentations')
    .select('*', { count: 'exact', head: true })
    .eq('created_by_user_id', userId);

  // Calculate period reset date (first of next month)
  const periodResetAt = new Date();
  periodResetAt.setMonth(periodResetAt.getMonth() + 1);
  periodResetAt.setDate(1);
  periodResetAt.setHours(0, 0, 0, 0);

  return {
    plan,
    exportsUsed: exportsCount || 0,
    exportsLimit: limits.exportsPerMonth,
    storageUsed: 0, // TODO: Calculate actual storage usage from R2
    storageLimit: limits.storageGb * 1024 * 1024 * 1024,
    presentationsUsed: presentationsCount || 0,
    presentationsLimit: limits.maxPresentations,
    periodResetAt,
  };
}

/**
 * Check if a user has remaining export quota.
 *
 * @param userId - The user's ID
 * @returns Whether the user can export, with reason if not
 */
export async function checkExportQuota(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const quota = await getUsageQuota(userId);

  if (quota.exportsLimit !== -1 && quota.exportsUsed >= quota.exportsLimit) {
    return {
      allowed: false,
      reason: 'Monthly export limit reached. Upgrade your plan to continue exporting.',
    };
  }

  return { allowed: true };
}

/**
 * Record an export usage for a user.
 * Inserts a new row into the exports table.
 *
 * @param userId - The user's ID
 * @param presentationId - Optional presentation ID associated with the export
 */
export async function incrementExportUsage(
  userId: string,
  presentationId?: string
): Promise<void> {
  await supabase.from('exports').insert({
    user_id: userId,
    presentation_id: presentationId,
    type: 'video',
    created_at: new Date().toISOString(),
  });
}
