---
description: "Web animation layer: three-layer SlideFrame architecture, motion.dev patterns, ItemRenderer, AnimationLayer"
globs: ["**/animation/**", "**/slide-play/**"]
alwaysApply: false
---

# Web Animation Architecture

## Three-Layer Rendering

The web player uses a three-layer architecture inside `SlideFrame`:

1. **Layout Layer (z-index: 0)** — DOM flex/grid rendered by `ItemRenderer`. Walks the `SlideItem` tree recursively, rendering layouts as CSS containers, cards as styled wrappers, and atoms as content elements.

2. **Animation Layer (z-index: 50)** — Handles cross-boundary "flight" animations using motion.dev's `AnimatePresence` and absolute positioning within the slide frame. Renders flight clones for items transitioning between layout positions.

3. **HUD Layer (z-index: 100)** — Controls overlay, debug labels, progress badges. Non-interactive display layer.

## motion.dev Usage

This project uses **motion.dev** (the `motion` package) for all web animations. This is the successor to Framer Motion.

```typescript
import { motion, AnimatePresence } from 'motion/react';

// Element entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

### Key motion.dev patterns used:
- `motion.div` with `initial` / `animate` / `exit` for entrance/exit animations
- `AnimatePresence` for mount/unmount transitions
- `layoutId` for shared-layout animations (element flights between positions)
- `useMotionValue` / `useTransform` for physics-based interactions
- `spring` transitions for natural-feeling animations

## SlideAnimationProvider

React context that exposes animation control to the entire slide tree:

- `promote(flight)` — initiates a cross-boundary flight animation
- `dismiss(id)` — removes a flight animation

Components anywhere in the tree can request flights without prop drilling.

## ItemRenderer

Recursive component that renders the `SlideItem` tree:

- `LayoutItem` → CSS flex/grid container with children rendered recursively
- `CardItem` → styled container, children rendered recursively, optional detail popup
- `AtomItem` → leaf content (text, icon, shape, image)

Each item gets micro-animations (entrance, focus highlight) via motion.dev.

## Rules

- **Never import Remotion** in web player or animation components. The web player uses motion.dev exclusively.
- Use `AnimatePresence` for any conditional rendering that should animate in/out.
- Prefer `layout` animations for position changes over manual `x`/`y` animations.
- Keep animation durations consistent: 200-400ms for micro-interactions, 400-800ms for slide transitions.
- Use CSS variables from Tailwind for animation-related colours and spacing.
- Test animations at both 1x and 0.5x speed to catch timing issues.

## Scene-Based Playback

The player navigates two levels:
1. **Scene index** — which content unit is active (vertical sidebar)
2. **Step index** — which animation step within the current scene (horizontal strip)

The `usePlayerStore` tracks both `currentSceneIndex` and `currentStepIndex`. Animation steps are derived from the current scene's `WidgetStateLayer`.
