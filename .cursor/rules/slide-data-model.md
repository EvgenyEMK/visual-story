---
description: "SlideItem tree architecture, Scenes + Widget State Layers, layout templates, type definitions"
globs: ["**/types/**", "**/slide-ui/**"]
alwaysApply: false
---

# Slide Data Model

## SlideItem Tree (Core)

The slide content model is a recursive discriminated union defined in `types/slide.ts`:

```
SlideItem = LayoutItem | CardItem | AtomItem
```

### LayoutItem (`type: 'layout'`)
- Container that organises children using CSS layout strategies.
- `layoutType`: `'grid' | 'flex' | 'sidebar' | 'split' | 'stack'`
- `children: SlideItem[]` — nested items rendered inside this container.
- `layoutConfig?: LayoutConfig` — columns, gap, direction, alignment.

### CardItem (`type: 'card'`)
- Styled container (border, shadow, background) grouping child items.
- `children: SlideItem[]` — content rendered inside the card.
- `detailItems?: SlideItem[]` — expanded view content shown via popup overlay on click/focus.

### AtomItem (`type: 'atom'`)
- Leaf-level content element with no children.
- `atomType`: `'text' | 'icon' | 'shape' | 'image'`
- `content: string` — the display value.

### Shared Base (`SlideItemBase`)
All variants share: `id`, `style?: ElementStyle`, `animation?: AnimationConfig`, `position?: {x, y}`, `globalItem?: {id}`.

## Slide Structure

```typescript
interface Slide {
  id: string;
  order: number;
  title?: string;
  subtitle?: string;
  icon?: string;
  layoutTemplate?: SlideLayoutTemplate;
  header?: SlideHeader;
  items: SlideItem[];           // Content tree (new model)
  elements?: SlideElement[];    // DEPRECATED — use items
  scenes?: Scene[];             // Content children (ADR-001)
  duration: number;
  transition: string;
  // ...
}
```

## Scenes + Widget State Layers (ADR-001)

See `docs/technical-architecture/adr-001-scenes-widget-state-layers.md` for full context.

**Scene** = a narrative content unit the presenter talks about. Persisted, ordered within a slide.
**WidgetStateLayer** = how widgets animate, interact, and transition within a scene.

Key principle: changing animation mode only modifies the WidgetStateLayer. Scene count, titles, and notes are preserved. Smart widget interactions (expand/collapse/show detail) are widget behaviours, not content units.

```typescript
interface Scene {
  id: string;
  title: string;
  icon?: string;
  order: number;
  widgetStateLayer: WidgetStateLayer;
  triggerMode?: TriggerMode;
  durationMs?: number;
}
```

## Layout Templates

`SlideLayoutTemplate` defines pre-built content layouts: `'content'`, `'two-column'`, `'sidebar-detail'`, `'grid-2x2'`, `'center-stage'`, `'blank'`, etc. Each has a `SlideLayoutMeta` with regions, AI hints, and best-for tags.

## Slide Header

`SlideHeader` is orthogonal to content layout. Three variants:
- `'title-bar'` — classic title bar consuming `Slide.title/subtitle/icon`
- `'tabs'` — horizontal tab sections from `items`
- `'custom'` — fully custom header via `items` + ItemRenderer

## Legacy Compatibility

- `Slide.elements` (flat `SlideElement[]`) is **deprecated**. Use `Slide.items` for all new code.
- `flattenItemsAsElements()` from `lib/flatten-items.ts` bridges the tree to a flat array for Remotion and any legacy consumers.
- During migration, components that still need flat access should call `flattenItemsAsElements(slide.items)`.

## Type Modification Rules

When adding new types or modifying existing ones:
1. Define in `types/` with JSDoc comments explaining purpose and linking to docs.
2. Use discriminated unions for variant types (follow `SlideItem` pattern).
3. Make optional fields explicit (`field?: Type`) — don't use `| undefined` in required positions.
4. Export from the relevant type file. The `types/index.ts` re-exports commonly used types.
