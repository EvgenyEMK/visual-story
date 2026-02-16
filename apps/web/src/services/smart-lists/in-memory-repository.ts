/**
 * In-memory implementation of SmartListRepository backed by Zustand.
 *
 * This is the default implementation for client-side editing.
 * It reads/writes from the useSmartListSourceStore and provides
 * the full repository interface.
 *
 * For server-side persistence, swap this with a Supabase implementation
 * that talks to the `smart_list_sources` table.
 */

import type {
  SmartListRepository,
} from './smart-list-repository';
import type {
  SmartListSource,
  SmartListSourceSummary,
  SmartListSnapshot,
  CreateSmartListSourceRequest,
  UpdateSmartListSourceRequest,
} from '@/types/smart-list-source';
import type { SmartListItem } from '@/types/smart-list';
import { useSmartListSourceStore } from '@/stores/smart-list-source-store';

// ---------------------------------------------------------------------------
// Helper: deep-clone an item tree with new IDs
// ---------------------------------------------------------------------------

function deepCloneItems(items: SmartListItem[]): SmartListItem[] {
  return items.map((item) => ({
    ...item,
    children: item.children ? deepCloneItems(item.children) : undefined,
  }));
}

// ---------------------------------------------------------------------------
// Item-tree utilities
// ---------------------------------------------------------------------------

function updateItemInTree(
  items: SmartListItem[],
  itemId: string,
  updates: Partial<SmartListItem>,
): SmartListItem[] {
  return items.map((item) => {
    if (item.id === itemId) return { ...item, ...updates };
    if (item.children) {
      const newChildren = updateItemInTree(item.children, itemId, updates);
      if (newChildren !== item.children) return { ...item, children: newChildren };
    }
    return item;
  });
}

function removeItemFromTree(
  items: SmartListItem[],
  itemId: string,
): SmartListItem[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) => {
      if (item.children) {
        const newChildren = removeItemFromTree(item.children, itemId);
        if (newChildren !== item.children) return { ...item, children: newChildren };
      }
      return item;
    });
}

// ---------------------------------------------------------------------------
// In-Memory Repository
// ---------------------------------------------------------------------------

export class InMemorySmartListRepository implements SmartListRepository {
  private get store() {
    return useSmartListSourceStore.getState();
  }

  async getSource(sourceId: string): Promise<SmartListSource | null> {
    return this.store.sources.find((s) => s.id === sourceId) ?? null;
  }

  async listSourcesByPresentation(presentationId: string): Promise<SmartListSourceSummary[]> {
    return this.store.sources
      .filter((s) => s.presentationId === presentationId)
      .map(toSummary);
  }

  async listSourcesByTenant(tenantId: string): Promise<SmartListSourceSummary[]> {
    return this.store.sources
      .filter((s) => s.tenantId === tenantId)
      .map(toSummary);
  }

  async createSource(
    tenantId: string,
    request: CreateSmartListSourceRequest,
  ): Promise<SmartListSource> {
    const now = new Date().toISOString();
    const source: SmartListSource = {
      id: crypto.randomUUID(),
      tenantId,
      presentationId: request.presentationId ?? null,
      name: request.name,
      description: request.description,
      iconSetId: request.iconSetId,
      secondaryIconSetId: request.secondaryIconSetId,
      items: request.items ?? [],
      snapshots: [],
      createdAt: now,
      updatedAt: now,
    };
    this.store.addSource(source);
    return source;
  }

  async updateSource(
    sourceId: string,
    request: UpdateSmartListSourceRequest,
  ): Promise<SmartListSource> {
    this.store.updateSource(sourceId, {
      ...request,
      updatedAt: new Date().toISOString(),
    } as Partial<SmartListSource>);
    const updated = this.store.sources.find((s) => s.id === sourceId);
    if (!updated) throw new Error(`Source ${sourceId} not found`);
    return updated;
  }

  async deleteSource(sourceId: string): Promise<void> {
    this.store.removeSource(sourceId);
  }

  async getItems(sourceId: string): Promise<SmartListItem[]> {
    const source = await this.getSource(sourceId);
    return source?.items ?? [];
  }

  async setItems(sourceId: string, items: SmartListItem[]): Promise<void> {
    this.store.updateSource(sourceId, {
      items,
      updatedAt: new Date().toISOString(),
    } as Partial<SmartListSource>);
  }

  async updateItem(
    sourceId: string,
    itemId: string,
    updates: Partial<SmartListItem>,
  ): Promise<void> {
    const source = await this.getSource(sourceId);
    if (!source) return;
    const newItems = updateItemInTree(source.items, itemId, updates);
    await this.setItems(sourceId, newItems);
  }

  async addItems(sourceId: string, items: SmartListItem[]): Promise<void> {
    const source = await this.getSource(sourceId);
    if (!source) return;
    await this.setItems(sourceId, [...source.items, ...items]);
  }

  async removeItem(sourceId: string, itemId: string): Promise<void> {
    const source = await this.getSource(sourceId);
    if (!source) return;
    const newItems = removeItemFromTree(source.items, itemId);
    await this.setItems(sourceId, newItems);
  }

  async reorderItems(
    sourceId: string,
    fromIndex: number,
    toIndex: number,
  ): Promise<void> {
    const source = await this.getSource(sourceId);
    if (!source) return;
    const items = [...source.items];
    const [moved] = items.splice(fromIndex, 1);
    if (!moved) return;
    items.splice(toIndex, 0, moved);
    await this.setItems(sourceId, items);
  }

  async createSnapshot(sourceId: string, name: string): Promise<SmartListSnapshot> {
    const source = await this.getSource(sourceId);
    if (!source) throw new Error(`Source ${sourceId} not found`);
    const snapshot: SmartListSnapshot = {
      id: crypto.randomUUID(),
      name,
      items: deepCloneItems(source.items),
      createdAt: new Date().toISOString(),
    };
    const snapshots = [...(source.snapshots ?? []), snapshot];
    this.store.updateSource(sourceId, { snapshots } as Partial<SmartListSource>);
    return snapshot;
  }

  async listSnapshots(sourceId: string): Promise<SmartListSnapshot[]> {
    const source = await this.getSource(sourceId);
    return source?.snapshots ?? [];
  }

  async deleteSnapshot(sourceId: string, snapshotId: string): Promise<void> {
    const source = await this.getSource(sourceId);
    if (!source) return;
    const snapshots = (source.snapshots ?? []).filter((s) => s.id !== snapshotId);
    this.store.updateSource(sourceId, { snapshots } as Partial<SmartListSource>);
  }

  async convertEmbeddedToShared(
    tenantId: string,
    presentationId: string,
    name: string,
    iconSetId: string,
    items: SmartListItem[],
    secondaryIconSetId?: string,
  ): Promise<string> {
    const source = await this.createSource(tenantId, {
      name,
      iconSetId,
      secondaryIconSetId,
      items: deepCloneItems(items),
      presentationId,
    });
    return source.id;
  }
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function toSummary(source: SmartListSource): SmartListSourceSummary {
  return {
    id: source.id,
    name: source.name,
    description: source.description,
    iconSetId: source.iconSetId,
    itemCount: countItems(source.items),
    presentationId: source.presentationId,
    updatedAt: source.updatedAt,
  };
}

function countItems(items: SmartListItem[]): number {
  let count = 0;
  for (const item of items) {
    if (!item.isHeader) count++;
    if (item.children) count += countItems(item.children);
  }
  return count;
}
