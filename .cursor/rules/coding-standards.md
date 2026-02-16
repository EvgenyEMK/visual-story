---
description: "Code quality standards: TypeScript strictness, immutability, file organisation, error handling, naming"
alwaysApply: true
---

# Coding Standards

## TypeScript

- Strict mode enabled — never use `any`. Use `unknown` and narrow with type guards.
- Prefer `interface` for object shapes, `type` for unions and intersections.
- Use discriminated unions for variant types (see `SlideItem` pattern in `types/slide.ts`).
- Export types and interfaces alongside the code that uses them.
- Use `as const` for literal tuples and object constants.

## Immutability

ALWAYS create new objects. NEVER mutate existing state:

```typescript
// WRONG — mutates in place
item.style.color = 'red';
items.push(newItem);

// CORRECT — returns new copy
const updated = { ...item, style: { ...item.style, color: 'red' } };
const updated = [...items, newItem];
```

This is critical for React rendering, Zustand state updates, and undo/redo.

## Imports

- Use absolute imports via the `@/` path alias: `import { Slide } from '@/types/slide'`
- Never use relative imports that go more than one level up (`../../` is the maximum).
- Group imports: 1) React/Next.js, 2) external packages, 3) internal `@/` imports, 4) relative imports.
- Use named exports. Default exports only for Next.js pages/layouts (App Router convention).

## File Organisation

- **200-400 lines typical, 800 max.** If a file exceeds 400 lines, look for extraction opportunities.
- **One component per file** for React components.
- **Feature-based organisation** over type-based: group by domain (`slide-editor/`, `slide-play/`), not by kind (`components/`, `hooks/`, `utils/`).
- Co-locate tests in `__tests__/` directories next to the code they test.

## Functions

- **< 50 lines per function.** Break larger functions into well-named helpers.
- **Single responsibility.** Each function does one thing.
- Use `function` declarations for React components (hoisted, better stack traces).
- Use arrow functions for callbacks, event handlers, and inline utilities.

## Naming

- **Components:** PascalCase (`SlideFrame`, `ItemRenderer`)
- **Functions/variables:** camelCase (`flattenItemsAsElements`, `currentSlideIndex`)
- **Types/interfaces:** PascalCase (`SlideItem`, `AnimationConfig`)
- **Constants:** UPPER_SNAKE_CASE for true constants (`MAX_SLIDES`, `DEFAULT_DURATION_MS`)
- **Files:** kebab-case for utilities (`flatten-items.ts`), PascalCase for components (`SlideFrame.tsx`)
- **Boolean variables:** prefix with `is`, `has`, `should`, `can` (`isPreview`, `hasVoice`)

## Error Handling

- Handle errors explicitly at every level — never silently swallow.
- UI-facing code: show user-friendly error messages via toast or inline feedback.
- Server-side: log detailed error context (request ID, user ID, operation) for debugging.
- API routes: return structured error responses `{ error: string }` with proper HTTP status codes.
- Use try/catch for async operations. Avoid `.catch()` chains — prefer async/await.

## Validation

- Validate all external input at API boundaries (route handlers, form submissions).
- Use Zod schemas for runtime validation where available.
- Fail fast with clear, actionable error messages.
- Never trust data from: user input, API responses, URL parameters, file content.

## No Magic

- No hardcoded values in logic — extract to named constants or config.
- No `console.log` in production code — use structured logging or remove before commit.
- No commented-out code — delete it; git preserves history.
- No `// TODO` without a linked issue or ticket reference.
