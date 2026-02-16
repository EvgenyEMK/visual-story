/**
 * Smart Lists service — public API.
 *
 * All consumers import from this barrel. The underlying repository
 * implementation can be swapped without changing consumer code.
 */

// Repository interface and aggregation
export type { SmartListRepository, AggregatedList } from './smart-list-repository';
export { aggregateFromSources } from './smart-list-repository';

// Default implementation (in-memory / Zustand)
export { InMemorySmartListRepository } from './in-memory-repository';

// Singleton provider
export { getSmartListRepository } from './provider';
