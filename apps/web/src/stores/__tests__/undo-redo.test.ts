import { describe, it, expect, beforeEach } from 'vitest';
import { useUndoRedoStore, MAX_HISTORY_SIZE } from '../undo-redo-store';
import { usePresentationStore } from '../presentation-store';
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

function makePresentation(slides: Slide[]) {
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
  usePresentationStore.setState({
    presentation: null,
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

describe('usePresentationStore - undo/redo integration', () => {
  const slide1 = makeSlide('slide-1', 'First');
  const slide2 = makeSlide('slide-2', 'Second');

  function initStore(slides: Slide[] = [slide1, slide2]) {
    usePresentationStore.getState().setPresentation(makePresentation(slides));
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

  it('clearPresentation clears undo/redo history', () => {
    initStore();
    useUndoRedoStore.setState({ past: [[makeSlide('old')]] });

    usePresentationStore.getState().clearPresentation();

    const { past, future } = useUndoRedoStore.getState();
    expect(past).toEqual([]);
    expect(future).toEqual([]);
  });

  it('updateSlide creates a history entry', () => {
    initStore();

    usePresentationStore.getState().updateSlide('slide-1', { title: 'Updated' });

    const { past } = useUndoRedoStore.getState();
    expect(past).toHaveLength(1);
    // The saved snapshot should contain the original title
    expect(past[0].find((s) => s.id === 'slide-1')?.title).toBe('First');
    // The current state should be updated
    expect(usePresentationStore.getState().slides.find((s) => s.id === 'slide-1')?.title).toBe('Updated');
  });

  it('undo restores the previous slide state after updateSlide', () => {
    initStore();

    usePresentationStore.getState().updateSlide('slide-1', { title: 'Changed' });
    expect(usePresentationStore.getState().slides[0].title).toBe('Changed');

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('First');
  });

  it('redo restores the slide state after undo', () => {
    initStore();

    usePresentationStore.getState().updateSlide('slide-1', { title: 'Changed' });
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('First');

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('Changed');
  });

  it('undo is a no-op when history is empty', () => {
    initStore();
    const slidesBefore = usePresentationStore.getState().slides;

    usePresentationStore.getState().undo();

    expect(usePresentationStore.getState().slides).toBe(slidesBefore);
  });

  it('redo is a no-op when future is empty', () => {
    initStore();
    const slidesBefore = usePresentationStore.getState().slides;

    usePresentationStore.getState().redo();

    expect(usePresentationStore.getState().slides).toBe(slidesBefore);
  });

  it('multiple undos walk back through changes step by step', () => {
    initStore();

    // Make 3 changes
    usePresentationStore.getState().updateSlide('slide-1', { title: 'Change 1' });
    usePresentationStore.getState().updateSlide('slide-1', { title: 'Change 2' });
    usePresentationStore.getState().updateSlide('slide-1', { title: 'Change 3' });
    expect(usePresentationStore.getState().slides[0].title).toBe('Change 3');

    // Undo step by step
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('Change 2');

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('Change 1');

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('First');

    // No more undo — stays at original
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('First');
  });

  it('multiple redos walk forward through undone changes', () => {
    initStore();

    usePresentationStore.getState().updateSlide('slide-1', { title: 'A' });
    usePresentationStore.getState().updateSlide('slide-1', { title: 'B' });
    usePresentationStore.getState().updateSlide('slide-1', { title: 'C' });

    // Undo all 3
    usePresentationStore.getState().undo();
    usePresentationStore.getState().undo();
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('First');

    // Redo step by step
    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('A');

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('B');

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('C');

    // No more redo
    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('C');
  });

  it('new mutation after undo clears the redo stack', () => {
    initStore();

    usePresentationStore.getState().updateSlide('slide-1', { title: 'A' });
    usePresentationStore.getState().updateSlide('slide-1', { title: 'B' });

    // Undo one step
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('A');

    // New change — should fork the timeline
    usePresentationStore.getState().updateSlide('slide-1', { title: 'Z' });

    // Redo should be impossible (future was cleared)
    const { future } = useUndoRedoStore.getState();
    expect(future).toEqual([]);

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('Z');
  });

  it('addSlide is undoable', () => {
    initStore();
    const newSlide = makeSlide('slide-3', 'Third');

    usePresentationStore.getState().addSlide(newSlide);
    expect(usePresentationStore.getState().slides).toHaveLength(3);

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides).toHaveLength(2);
  });

  it('removeSlide is undoable', () => {
    initStore();

    usePresentationStore.getState().removeSlide('slide-1');
    expect(usePresentationStore.getState().slides).toHaveLength(1);

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides).toHaveLength(2);
    expect(usePresentationStore.getState().slides[0].title).toBe('First');
  });

  it('reorderSlides is undoable', () => {
    initStore();
    expect(usePresentationStore.getState().slides[0].id).toBe('slide-1');

    usePresentationStore.getState().reorderSlides(0, 1);
    expect(usePresentationStore.getState().slides[0].id).toBe('slide-2');

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].id).toBe('slide-1');
  });

  it('duplicateSlide is undoable', () => {
    initStore();

    usePresentationStore.getState().duplicateSlide('slide-1');
    expect(usePresentationStore.getState().slides).toHaveLength(3);

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides).toHaveLength(2);
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

    usePresentationStore.getState().updateItem('item-slide', 'text-1', { content: 'Modified' } as any);
    const updated = usePresentationStore.getState().slides[0].items[0];
    expect(updated.type === 'atom' && updated.content).toBe('Modified');

    usePresentationStore.getState().undo();
    const restored = usePresentationStore.getState().slides[0].items[0];
    expect(restored.type === 'atom' && restored.content).toBe('Original');
  });

  it('undo sets isDirty to true', () => {
    initStore();
    expect(usePresentationStore.getState().isDirty).toBe(false);

    usePresentationStore.getState().updateSlide('slide-1', { title: 'X' });
    usePresentationStore.getState().markSaved();
    expect(usePresentationStore.getState().isDirty).toBe(false);

    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().isDirty).toBe(true);
  });

  it('redo sets isDirty to true', () => {
    initStore();

    usePresentationStore.getState().updateSlide('slide-1', { title: 'X' });
    usePresentationStore.getState().undo();
    usePresentationStore.getState().markSaved();
    expect(usePresentationStore.getState().isDirty).toBe(false);

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().isDirty).toBe(true);
  });

  it('interleaving different action types produces correct undo sequence', () => {
    initStore();

    // 1. Update slide title
    usePresentationStore.getState().updateSlide('slide-1', { title: 'Renamed' });

    // 2. Add a new slide
    const newSlide = makeSlide('slide-3', 'Third');
    usePresentationStore.getState().addSlide(newSlide);

    // 3. Remove slide-2
    usePresentationStore.getState().removeSlide('slide-2');

    // Current: [Renamed slide-1, Third slide-3]
    expect(usePresentationStore.getState().slides).toHaveLength(2);
    expect(usePresentationStore.getState().slides[0].title).toBe('Renamed');

    // Undo remove
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides).toHaveLength(3);

    // Undo add
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides).toHaveLength(2);

    // Undo rename
    usePresentationStore.getState().undo();
    expect(usePresentationStore.getState().slides[0].title).toBe('First');

    // Redo all
    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides[0].title).toBe('Renamed');

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides).toHaveLength(3);

    usePresentationStore.getState().redo();
    expect(usePresentationStore.getState().slides).toHaveLength(2);
  });
});
