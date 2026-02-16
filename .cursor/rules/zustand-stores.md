---
description: "Zustand store patterns: immutable updates, store separation, selectors, testing"
globs: ["**/stores/**"]
alwaysApply: false
---

# Zustand Store Patterns

## Store Structure

Each store is a single file exporting a typed hook created with `create`:

```typescript
import { create } from 'zustand';

interface EditorState {
  selectedSlideIndex: number;
  selectedElementId: string | null;
  // Actions
  selectSlide: (index: number) => void;
  selectElement: (id: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedSlideIndex: 0,
  selectedElementId: null,

  selectSlide: (index) => set({ selectedSlideIndex: index }),
  selectElement: (id) => set({ selectedElementId: id }),
}));
```

## Existing Stores

| Store | File | Domain |
|-------|------|--------|
| `useProjectStore` | `project-store.ts` | Project data, slides, CRUD |
| `useEditorStore` | `editor-store.ts` | Editor UI state, selection |
| `usePlayerStore` | `player-store.ts` | Playback state, current slide/scene |
| `useUndoRedoStore` | `undo-redo-store.ts` | Undo/redo history stack |

## Immutable Updates (Critical)

Zustand relies on reference equality for re-renders. ALWAYS return new objects:

```typescript
// WRONG — mutates state
set((state) => {
  state.slides[index].title = title;
  return state;
});

// CORRECT — creates new references
set((state) => ({
  slides: state.slides.map((slide, i) =>
    i === index ? { ...slide, title } : slide
  ),
}));
```

For deeply nested updates (e.g., updating a SlideItem inside a tree), create helper functions that return new trees:

```typescript
function updateItemInTree(items: SlideItem[], id: string, update: Partial<SlideItem>): SlideItem[] {
  return items.map((item) => {
    if (item.id === id) return { ...item, ...update };
    if ('children' in item) {
      return { ...item, children: updateItemInTree(item.children, id, update) };
    }
    return item;
  });
}
```

## Selectors

Use selectors to derive state and prevent unnecessary re-renders:

```typescript
// WRONG — subscribes to entire store, re-renders on any change
const { slides, selectedSlideIndex } = useProjectStore();

// CORRECT — subscribes only to needed slices
import { useShallow } from 'zustand/react/shallow';

const { slides, selectedSlideIndex } = useProjectStore(
  useShallow((state) => ({
    slides: state.slides,
    selectedSlideIndex: state.selectedSlideIndex,
  }))
);

// BEST for single values — no wrapper needed
const selectedSlideIndex = useEditorStore((s) => s.selectedSlideIndex);
```

## Store Boundaries

- **One store per domain.** Don't create a god store — keep stores focused.
- **Actions live inside the store**, not in external functions.
- **Stores don't import other stores.** If cross-store coordination is needed, do it in the component or a custom hook that reads from both stores.
- **Async actions** (API calls) belong in the store action that initiated them. Handle loading/error state within the store.

## Testing

Test stores in isolation using `getState()` and `setState()`:

```typescript
import { useProjectStore } from '../project-store';

describe('ProjectStore', () => {
  beforeEach(() => {
    useProjectStore.setState({ slides: [], selectedSlideIndex: 0 });
  });

  it('should add a slide', () => {
    useProjectStore.getState().addSlide(newSlide);
    expect(useProjectStore.getState().slides).toHaveLength(1);
  });
});
```

See `stores/__tests__/undo-redo.test.ts` for a working example.
