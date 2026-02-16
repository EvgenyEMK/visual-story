---
description: "Testing standards: Vitest, Testing Library, AAA pattern, mocking, coverage targets"
globs: ["**/*.test.*", "**/__tests__/**"]
alwaysApply: false
---

# Testing Standards

## Framework

- **Test runner:** Vitest (configured in `apps/web/vitest.config.ts`)
- **Component testing:** @testing-library/react with jsdom environment
- **User interactions:** @testing-library/user-event (preferred over `fireEvent`)
- **Assertions:** Vitest built-in + @testing-library/jest-dom matchers

## Test Structure

Use the **Arrange-Act-Assert** pattern:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('flattenItemsAsElements', () => {
  it('should convert a nested item tree to a flat array', () => {
    // Arrange
    const items: SlideItem[] = [
      { type: 'layout', layoutType: 'flex', children: [
        { type: 'atom', atomType: 'text', content: 'Hello', id: '1' },
      ], id: 'root' },
    ];

    // Act
    const result = flattenItemsAsElements(items);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('Hello');
  });
});
```

## What to Test

- **Business logic:** Store actions, utility functions, data transformations (highest priority)
- **Component behaviour:** User interactions, conditional rendering, error states
- **API route handlers:** Input validation, error responses, auth checks (via mocked Supabase)
- **Type guards:** Discriminated union narrowing functions

## What NOT to Test

- Styling / visual appearance (use visual regression tools if needed, not unit tests)
- Third-party library internals (Radix UI, shadcn/ui, motion.dev)
- Implementation details (internal state, private methods, render counts)
- Next.js framework behaviour (routing, SSR, middleware)

## Mocking

Mock external services — never make real API calls in tests:

```typescript
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
  })),
}));

// Mock OpenAI
vi.mock('@/lib/ai', () => ({
  generateSlides: vi.fn().mockResolvedValue(mockSlides),
}));
```

## File Organisation

Co-locate tests next to the code they test:

```
components/
  slide-editor/
    SlideCanvas.tsx
    __tests__/
      SlideCanvas.test.tsx
stores/
  project-store.ts
  __tests__/
    project-store.test.ts
lib/
  flatten-items.ts
  __tests__/
    flatten-items.test.ts
```

## Coverage Target

- **80%+ for business logic** (stores, lib utilities, services)
- **60%+ for components** (focus on interactive behaviour, not layout)
- Run coverage: `pnpm test -- --coverage`

## Existing Tests

Reference these for patterns:
- `stores/__tests__/undo-redo.test.ts` — Zustand store testing
- `components/animation/__tests__/ItemRenderer.test.tsx` — component testing
- `components/transitions-demo/__tests__/GroupedSection.test.tsx` — component testing
