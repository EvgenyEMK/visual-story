---
description: "Git conventions: conventional commits, branch naming, PR process, commit hygiene"
alwaysApply: true
---

# Git Workflow

## Commit Messages

Use Conventional Commits format:

```
type(scope): short description

Optional longer body explaining the why, not the what.
```

**Types:**
- `feat` — new feature or capability
- `fix` — bug fix
- `refactor` — code change that neither fixes a bug nor adds a feature
- `docs` — documentation only
- `test` — adding or updating tests
- `chore` — tooling, config, dependencies
- `perf` — performance improvement
- `ci` — CI/CD changes
- `style` — formatting, whitespace (no logic change)

**Scopes** (optional but recommended):
- `editor`, `player`, `animation`, `remotion`, `auth`, `billing`, `api`, `types`, `stores`, `i18n`, `ui`

**Examples:**
```
feat(editor): add scene reordering via drag-and-drop
fix(player): prevent animation flash on scene transition
refactor(stores): extract slide tree update helpers
docs: update ADR-001 with migration notes
test(stores): add undo-redo edge case coverage
chore: upgrade motion.dev to 12.35
```

## Branch Naming

```
type/short-description
```

Examples: `feat/scene-drag-reorder`, `fix/player-transition-flash`, `refactor/slide-tree-helpers`

## Commit Hygiene

- **Small, focused commits.** Each commit should be a single logical change.
- **Don't mix** refactoring with feature work in the same commit.
- **Don't commit** generated files, build artifacts, or `.env` files.
- **Don't commit** `console.log` debug statements or commented-out code.

## Pull Request Process

1. Create a branch from `main` with conventional naming.
2. Make focused commits.
3. Write a PR description that includes:
   - **Summary:** 1-3 bullet points explaining what and why.
   - **Test plan:** how to verify the changes work.
4. Self-review the diff before requesting review.
5. Squash-merge to `main` (PR title becomes the commit message).

## Before Committing

- Run `pnpm lint` — fix all errors.
- Run `pnpm test` — all tests pass.
- Run `pnpm build` — build succeeds.
- Check for hardcoded secrets, debug logs, and TODO comments without issue references.
