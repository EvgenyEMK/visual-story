import { describe, it, expect, beforeEach } from 'vitest';
import { useUndoRedoStore, MAX_HISTORY_SIZE } from '../undo-redo-store';
import { useProjectStore } from '../project-store';
import type { Slide } from '@/types/slide';

// =============================================================================
// Helpers — minimal slide fixtures
// =============================================================================

function makeSlide(id: string, title = `Slide ${id}`): Slide {
  return {
    id,
    order: 0,
    content: title,
    title,
    animationTemplate: 'none',
    items: [],
    duration: 5000,
    transition: 'none',
  };
}

function makeProject(slides: Slide[]) {
  return {
    id: 'test-project',
    tenantId: 'tenant',
    createdByUserId: 'user',
    name: 'Test Project',
    script: '',
    intent: 'educational' as const,
    slides,
    voiceSettings: { voiceId: '', syncPoints: [] },
    status: 'draft' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// =============================================================================
// Reset stores before each test
// =============================================================================

beforeEach(() => {
  useUndoRedoStore.setState({ past: [], future: [] });
  useProjectStore.setState({
    project: null,
    slides: [],
    isDirty: false,
    isLoading: false,
    lastSavedAt: null,
  });
});

// =============================================================================
// UndoRedoStore — isolated unit tests
// =============================================================================

describe('useUndoRedoStore', () => {
  it('starts with empty past and future', () => {
    const { past, future } = useUndoRedoStore.getState();
    expect(past).toEqual([]);
    expect(future).toEqual([]);
  });

  it('saveSnapshot pushes slides to past and clears future', () => {
    const slides = [makeSlide('a')];
    const store = useUndoRedoStore.getState();

    // Simulate an existing future (from a previous undo)
    useUndoRedoStore.setState({ future: [[makeSlide('x')]] });

    store.saveSnapshot(slides);

    const { past, future } = useUndoRedoStore.getState();
    expect(past).toHaveLength(1);
    expect(past[0]).toBe(slides);
    expect(future).toEqual([]);
  });

  it('undo returns the previous state and moves current to future', () => {
    const prev = [makeSlide('prev')];
    const current = [makeSlide('current')];

    useUndoRedoStore.setState({ past: [prev], future: [] });

    const restored = useUndoRedoStore.getState().undo(current);

    expect(restored).toBe(prev);
    expect(useUndoRedoStore.getState().past).toEqual([]);
    expect(useUndoRedoStore.getState().future).toEqual([current]);
  });

  it('undo returns null when past is empty', () => {
    const current = [makeSlide('current')];
    const restored = useUndoRedoStore.getState().undo(current);

    expect(restored).toBeNull();
    expect(useUndoRedoStore.getState().future).toEqual([]);
  });

  it('redo returns the future state and moves current to past', () => {
    const next = [makeSlide('next')];
    const current = [makeSlide('current')];

    useUndoRedoStore.setState({ past: [], future: [next] });

    const restored = useUndoRedoStore.getState().redo(current);

    expect(restored).toBe(next);
    expect(useUndoRedoStore.getState().past).toEqual([current]);
    expect(useUndoRedoStore.getState().future).toEqual([]);
  });

  it('redo returns null when future is empty', () => {
    const current = [makeSlide('current')];
    const restored = useUndoRedoStore.getState().redo(current);

    expect(restored).toBeNull();
    expect(useUndoRedoStore.getState().past).toEqual([]);
  });

  it('clear empties both stacks', () => {
    useUndoRedoStore.setState({
      past: [[makeSlide('a')], [makeSlide('b')]],
      future: [[makeSlide('c')]],
    });

    useUndoRedoStore.getState().clear();

    const { past, future } = useUndoRedoStore.getState();
    expect(past).toEqual([]);
    expect(future).toEqual([]);
  });

  it('history is capped at MAX_HISTORY_SIZE', () => {
    const store = useUndoRedoStore.getState();

    // Push MAX_HISTORY_SIZE + 10 snapshots
    for (let i = 0; i < MAX_HISTORY_SIZE + 10; i++) {
      store.saveSnapshot([makeSlide(`slide-${i}`)]);
    }

    const { past } = useUndoRedoStore.getState();
    expect(past.length).toBeLessThanOrEqual(MAX_HISTORY_SIZE);
    // The oldest entries should have been trimmed
    expect(past[0][0].id).not.toBe('slide-0');
  });

  it('multi-step undo walks backward through history', () => {
    const s1 = [makeSlide('s1')];
    const s2 = [makeSlide('s2')];
    const s3 = [makeSlide('s3')];
    const current = [makeSlide('current')];

    useUndoRedoStore.setState({ past: [s1, s2, s3], future: [] });

    // Undo once: should restore s3
    const r1 = useUndoRedoStore.getState().undo(current);
    expect(r1).toBe(s3);

    // Undo again: should restore s2
    const r2 = useUndoRedoStore.getState().undo(r1!);
    expect(r2).toBe(s2);

    // Undo again: should restore s1
    const r3 = useUndoRedoStore.getState().undo(r2!);
    expect(r3).toBe(s1);

    // No more undo
    const r4 = useUndoRedoStore.getState().undo(r3!);
    expect(r4).toBeNull();
  });

  it('multi-step redo walks forward through future', () => {
    const f1 = [makeSlide('f1')];
    const f2 = [makeSlide('f2')];
    const current = [makeSlide('current')];

    useUndoRedoStore.setState({ past: [], future: [f1, f2] });

    // Redo once: should restore f2 (most recent future)
    const r1 = useUndoRedoStore.getState().redo(current);
    expect(r1).toBe(f2);

    // Redo again: should restore f1
    const r2 = useUndoRedoStore.getState().redo(r1!);
    expect(r2).toBe(f1);

    // No more redo
    const r3 = useUndoRedoStore.getState().redo(r2!);
    expect(r3).toBeNull();
  });

  it('new snapshot after undo clears the redo (future) stack', () => {
    const s1 = [makeSlide('s1')];
    const current = [makeSlide('current')];

    useUndoRedoStore.setState({ past: [s1], future: [] });

    // Undo
    const restored = useUndoRedoStore.getState().undo(current);
    expect(restored).toBe(s1);

    // Now make a new change — future should be cleared
    useUndoRedoStore.getState().saveSnapshot(restored!);

    const { future } = useUndoRedoStore.getState();
    expect(future).toEqual([]);
  });
});

// =============================================================================
// Project Store — undo/redo integration tests
// =============================================================================

describe('useProjectStore — undo/redo integration', () => {
  const slide1 = makeSlide('slide-1', 'First');
  const slide2 = makeSlide('slide-2', 'Second');

  function initStore(slides: Slide[] = [slide1, slide2]) {
    useProjectStore.getState().setProject(makeProject(slides));
  }

  it('setProject clears undo/redo history', () => {
    // Create some history first
    useUndoRedoStore.setState({
      past: [[makeSlide('old')]],
      future: [[makeSlide('old2')]],
    });

    initStore();

    const { past, future } = useUndoRedoStore.getState();
    expect(past).toEqual([]);
    expect(future).toEqual([]);
  });

  it('clearProject clears undo/redo history', () => {
    initStore();
    useUndoRedoStore.setState({ past: [[makeSlide('old')]] });

    useProjectStore.getState().clearProject();

    const { past, future } = useUndoRedoStore.getState();
    expect(past).toEqual([]);
    expect(future).toEqual([]);
  });

  it('updateSlide creates a history entry', () => {
    initStore();

    useProjectStore.getState().updateSlide('slide-1', { title: 'Updated' });

    const { past } = useUndoRedoStore.getState();
    expect(past).toHaveLength(1);
    // The saved snapshot should contain the original title
    expect(past[0].find((s) => s.id === 'slide-1')?.title).toBe('First');
    // The current state should be updated
    expect(useProjectStore.getState().slides.find((s) => s.id === 'slide-1')?.title).toBe('Updated');
  });

  it('undo restores the previous slide state after updateSlide', () => {
    initStore();

    useProjectStore.getState().updateSlide('slide-1', { title: 'Changed' });
    expect(useProjectStore.getState().slides[0].title).toBe('Changed');

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('First');
  });

  it('redo restores the slide state after undo', () => {
    initStore();

    useProjectStore.getState().updateSlide('slide-1', { title: 'Changed' });
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('First');

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('Changed');
  });

  it('undo is a no-op when history is empty', () => {
    initStore();
    const slidesBefore = useProjectStore.getState().slides;

    useProjectStore.getState().undo();

    expect(useProjectStore.getState().slides).toBe(slidesBefore);
  });

  it('redo is a no-op when future is empty', () => {
    initStore();
    const slidesBefore = useProjectStore.getState().slides;

    useProjectStore.getState().redo();

    expect(useProjectStore.getState().slides).toBe(slidesBefore);
  });

  it('multiple undos walk back through changes step by step', () => {
    initStore();

    // Make 3 changes
    useProjectStore.getState().updateSlide('slide-1', { title: 'Change 1' });
    useProjectStore.getState().updateSlide('slide-1', { title: 'Change 2' });
    useProjectStore.getState().updateSlide('slide-1', { title: 'Change 3' });
    expect(useProjectStore.getState().slides[0].title).toBe('Change 3');

    // Undo step by step
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('Change 2');

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('Change 1');

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('First');

    // No more undo — stays at original
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('First');
  });

  it('multiple redos walk forward through undone changes', () => {
    initStore();

    useProjectStore.getState().updateSlide('slide-1', { title: 'A' });
    useProjectStore.getState().updateSlide('slide-1', { title: 'B' });
    useProjectStore.getState().updateSlide('slide-1', { title: 'C' });

    // Undo all 3
    useProjectStore.getState().undo();
    useProjectStore.getState().undo();
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('First');

    // Redo step by step
    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('A');

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('B');

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('C');

    // No more redo
    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('C');
  });

  it('new mutation after undo clears the redo stack', () => {
    initStore();

    useProjectStore.getState().updateSlide('slide-1', { title: 'A' });
    useProjectStore.getState().updateSlide('slide-1', { title: 'B' });

    // Undo one step
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('A');

    // New change — should fork the timeline
    useProjectStore.getState().updateSlide('slide-1', { title: 'Z' });

    // Redo should be impossible (future was cleared)
    const { future } = useUndoRedoStore.getState();
    expect(future).toEqual([]);

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('Z');
  });

  it('addSlide is undoable', () => {
    initStore();
    const newSlide = makeSlide('slide-3', 'Third');

    useProjectStore.getState().addSlide(newSlide);
    expect(useProjectStore.getState().slides).toHaveLength(3);

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides).toHaveLength(2);
  });

  it('removeSlide is undoable', () => {
    initStore();

    useProjectStore.getState().removeSlide('slide-1');
    expect(useProjectStore.getState().slides).toHaveLength(1);

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides).toHaveLength(2);
    expect(useProjectStore.getState().slides[0].title).toBe('First');
  });

  it('reorderSlides is undoable', () => {
    initStore();
    expect(useProjectStore.getState().slides[0].id).toBe('slide-1');

    useProjectStore.getState().reorderSlides(0, 1);
    expect(useProjectStore.getState().slides[0].id).toBe('slide-2');

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].id).toBe('slide-1');
  });

  it('duplicateSlide is undoable', () => {
    initStore();

    useProjectStore.getState().duplicateSlide('slide-1');
    expect(useProjectStore.getState().slides).toHaveLength(3);

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides).toHaveLength(2);
  });

  it('updateItem is undoable', () => {
    const slideWithItem = makeSlide('item-slide');
    slideWithItem.items = [
      {
        id: 'text-1',
        type: 'atom',
        atomType: 'text',
        content: 'Original',
      },
    ];
    initStore([slideWithItem]);

    useProjectStore.getState().updateItem('item-slide', 'text-1', { content: 'Modified' } as any);
    const updated = useProjectStore.getState().slides[0].items[0];
    expect(updated.type === 'atom' && updated.content).toBe('Modified');

    useProjectStore.getState().undo();
    const restored = useProjectStore.getState().slides[0].items[0];
    expect(restored.type === 'atom' && restored.content).toBe('Original');
  });

  it('undo sets isDirty to true', () => {
    initStore();
    expect(useProjectStore.getState().isDirty).toBe(false);

    useProjectStore.getState().updateSlide('slide-1', { title: 'X' });
    useProjectStore.getState().markSaved();
    expect(useProjectStore.getState().isDirty).toBe(false);

    useProjectStore.getState().undo();
    expect(useProjectStore.getState().isDirty).toBe(true);
  });

  it('redo sets isDirty to true', () => {
    initStore();

    useProjectStore.getState().updateSlide('slide-1', { title: 'X' });
    useProjectStore.getState().undo();
    useProjectStore.getState().markSaved();
    expect(useProjectStore.getState().isDirty).toBe(false);

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().isDirty).toBe(true);
  });

  it('interleaving different action types produces correct undo sequence', () => {
    initStore();

    // 1. Update slide title
    useProjectStore.getState().updateSlide('slide-1', { title: 'Renamed' });

    // 2. Add a new slide
    const newSlide = makeSlide('slide-3', 'Third');
    useProjectStore.getState().addSlide(newSlide);

    // 3. Remove slide-2
    useProjectStore.getState().removeSlide('slide-2');

    // Current: [Renamed slide-1, Third slide-3]
    expect(useProjectStore.getState().slides).toHaveLength(2);
    expect(useProjectStore.getState().slides[0].title).toBe('Renamed');

    // Undo remove
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides).toHaveLength(3);

    // Undo add
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides).toHaveLength(2);

    // Undo rename
    useProjectStore.getState().undo();
    expect(useProjectStore.getState().slides[0].title).toBe('First');

    // Redo all
    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides[0].title).toBe('Renamed');

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides).toHaveLength(3);

    useProjectStore.getState().redo();
    expect(useProjectStore.getState().slides).toHaveLength(2);
  });
});
