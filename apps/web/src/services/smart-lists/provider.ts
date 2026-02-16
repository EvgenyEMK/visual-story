/**
 * Smart List Repository provider.
 *
 * Returns the active SmartListRepository implementation.
 * Currently uses InMemorySmartListRepository (Zustand-backed).
 *
 * To switch to a Supabase-backed implementation:
 * 1. Create `supabase-repository.ts` implementing SmartListRepository
 * 2. Change this provider to return the Supabase implementation
 * 3. No other code changes needed — all consumers use the abstract interface
 */

import type { SmartListRepository } from './smart-list-repository';
import { InMemorySmartListRepository } from './in-memory-repository';

let _instance: SmartListRepository | null = null;

/**
 * Get the active SmartListRepository instance (singleton).
 * Uses lazy initialization to avoid module-level side effects.
 */
export function getSmartListRepository(): SmartListRepository {
  if (!_instance) {
    _instance = new InMemorySmartListRepository();
  }
  return _instance;
}

/**
 * Override the repository implementation (for testing or runtime switching).
 */
export function setSmartListRepository(repo: SmartListRepository): void {
  _instance = repo;
}
