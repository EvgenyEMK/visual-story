---
description: "Remotion video rendering: isolation rules, lazy loading, flattenItemsAsElements bridge, composition patterns"
globs: ["**/remotion/**", "**/slide-play-video/**"]
alwaysApply: false
---

# Remotion Video Rendering

## Isolation (Critical)

Remotion is strictly isolated from the main application bundle:

- **Route:** `/slide-play-video` is the only route that uses Remotion.
- **Lazy loading:** Always load via `next/dynamic({ ssr: false })` — Remotion cannot run server-side.
- **Never import Remotion** in web player components (`slide-play/`), animation components, or any other part of the app.
- **Never import motion.dev** in Remotion compositions — Remotion uses `interpolate()` for all animations.

## Data Bridge

Remotion uses a flat element array, not the SlideItem tree:

```typescript
import { flattenItemsAsElements } from '@/lib/flatten-items';

// Convert tree to flat array for Remotion's frame-based pipeline
const elements = flattenItemsAsElements(slide.items);
```

The `flattenItemsAsElements()` utility bridges the recursive `SlideItem` tree to the flat `SlideElement[]` format that Remotion compositions consume. It falls back to `slide.elements` for backward compatibility.

## Animation in Remotion

Remotion animations use `interpolate()` and `spring()` from `remotion`, not motion.dev:

```typescript
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export function AnimatedElement({ element }: { element: SlideElement }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      {/* ... */}
    </div>
  );
}
```

## Composition Structure

Remotion compositions live in `src/remotion/`:

- Each composition maps to a project/slide set.
- Compositions receive serialised slide data as `inputProps`.
- Frame-based rendering: calculate element visibility and animation based on the current frame number.
- Duration is set per-composition based on total slide durations + transitions.

## Performance

- Keep Remotion bundle size minimal — don't import shared UI components that pull in motion.dev or other client-only dependencies.
- Use `React.memo` for elements that don't change between frames.
- Pre-calculate animation parameters outside the render loop where possible.
- Video export happens via Remotion Lambda (serverless) for production, local CLI for development.

## Configuration

- `remotion.config.ts` in `apps/web/` configures the Remotion CLI.
- Video output: 1080p (1920x1080), configurable FPS.
- Audio integration: ElevenLabs-generated audio is passed as an asset URL to the composition.
