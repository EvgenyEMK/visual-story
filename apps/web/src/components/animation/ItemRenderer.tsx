/**
 * ItemRenderer — recursively renders a SlideItem tree into DOM elements.
 *
 * - LayoutItem  → flex/grid/sidebar/split/stack container wrapping children
 * - CardItem    → styled card wrapper wrapping children
 * - AtomItem    → leaf DOM element (text, icon, shape, image)
 *
 * When an item has `position` set, it is absolutely positioned within its
 * parent container. Otherwise it participates in DOM flow (flex/grid).
 *
 * The optional `visibility` callback lets the parent (e.g. SlidePlayClient)
 * control which items are visible at the current animation step.
 */

'use client';

import { type CSSProperties, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type {
  SlideItem,
  LayoutItem,
  CardItem,
  AtomItem,
  LayoutConfig,
  ElementStyle,
} from '@/types/slide';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ItemVisibility {
  /** Whether the item should be visible. */
  visible: boolean;
  /** Whether the item is the current focus / active item. */
  isFocused: boolean;
  /** Whether the item should be hidden from the layout entirely (e.g. during flight). */
  hidden: boolean;
}

export interface ItemRendererProps {
  /** The item (or items) to render. */
  items: SlideItem[];
  /**
   * Optional callback to determine visibility for a given item ID.
   * When not provided, all items are visible.
   */
  getVisibility?: (itemId: string) => ItemVisibility;
  /**
   * Optional callback invoked when an item is clicked.
   */
  onItemClick?: (itemId: string) => void;
  /** Additional class names for the root wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Default visibility
// ---------------------------------------------------------------------------

const DEFAULT_VISIBILITY: ItemVisibility = {
  visible: true,
  isFocused: false,
  hidden: false,
};

// ---------------------------------------------------------------------------
// Style builders
// ---------------------------------------------------------------------------

function buildBaseStyle(
  item: SlideItem,
  visibility: ItemVisibility,
): CSSProperties {
  const style: CSSProperties = {};

  // Absolute positioning when position is set
  if (item.position) {
    style.position = 'absolute';
    style.left = item.position.x;
    style.top = item.position.y;
  }

  // Element style props
  if (item.style) {
    const s = item.style;
    if (s.width != null) style.width = s.width;
    if (s.height != null) style.height = s.height;
    if (s.backgroundColor) style.backgroundColor = s.backgroundColor;
    if (s.borderRadius != null) style.borderRadius = s.borderRadius;
    if (s.borderWidth != null) style.borderWidth = s.borderWidth;
    if (s.borderColor) style.borderColor = s.borderColor;
    if (s.borderWidth != null) style.borderStyle = 'solid';
    if (s.boxShadow) style.boxShadow = s.boxShadow;
    if (s.opacity != null) style.opacity = s.opacity;
    if (s.padding != null) style.padding = s.padding;
  }

  // Visibility control
  if (visibility.hidden) {
    style.visibility = 'hidden';
  }

  return style;
}

function buildLayoutStyle(layoutConfig?: LayoutConfig, layoutType?: string): CSSProperties {
  const style: CSSProperties = { display: 'flex' };

  if (!layoutConfig) {
    // Sensible defaults per layout type
    switch (layoutType) {
      case 'grid':
        style.display = 'grid';
        style.gridTemplateColumns = 'repeat(auto-fit, minmax(0, 1fr))';
        style.gap = 16;
        break;
      case 'stack':
        style.flexDirection = 'column';
        style.gap = 8;
        break;
      case 'sidebar':
        style.flexDirection = 'row';
        break;
      case 'split':
        style.flexDirection = 'row';
        break;
      default:
        style.flexDirection = 'row';
        style.gap = 16;
    }
    return style;
  }

  const cfg = layoutConfig;

  if (layoutType === 'grid') {
    style.display = 'grid';
    if (cfg.columns) {
      style.gridTemplateColumns = `repeat(${cfg.columns}, minmax(0, 1fr))`;
    }
    if (cfg.rows) {
      style.gridTemplateRows = `repeat(${cfg.rows}, minmax(0, 1fr))`;
    }
  } else {
    style.flexDirection = cfg.direction ?? 'row';
  }

  if (cfg.gap != null) style.gap = cfg.gap;

  // Align / justify
  const alignMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };
  const justifyMap: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  };

  if (cfg.align) style.alignItems = alignMap[cfg.align] ?? cfg.align;
  if (cfg.justify) style.justifyContent = justifyMap[cfg.justify] ?? cfg.justify;

  return style;
}

function buildTextStyle(style?: ElementStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.fontFamily) css.fontFamily = style.fontFamily;
  if (style.fontSize != null) css.fontSize = style.fontSize;
  if (style.fontWeight) css.fontWeight = style.fontWeight;
  if (style.fontStyle) css.fontStyle = style.fontStyle;
  if (style.color) css.color = style.color;
  if (style.textAlign) css.textAlign = style.textAlign;
  return css;
}

// ---------------------------------------------------------------------------
// Atom renderers
// ---------------------------------------------------------------------------

function renderAtom(atom: AtomItem, visibility: ItemVisibility): ReactNode {
  const textStyle = buildTextStyle(atom.style);

  switch (atom.atomType) {
    case 'text':
      return (
        <span style={{ ...textStyle, whiteSpace: 'pre-line' }}>
          {atom.content}
        </span>
      );
    case 'icon':
      return (
        <span
          style={{
            fontSize: atom.style?.fontSize ?? 24,
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {atom.content}
        </span>
      );
    case 'shape':
      return (
        <div
          style={{
            width: atom.style?.width ?? 40,
            height: atom.style?.height ?? 40,
            backgroundColor: atom.style?.backgroundColor ?? '#94a3b8',
            borderRadius: atom.style?.borderRadius ?? 0,
          }}
        />
      );
    case 'image':
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={atom.content}
          alt=""
          style={{
            width: atom.style?.width ?? '100%',
            height: atom.style?.height ?? 'auto',
            borderRadius: atom.style?.borderRadius ?? 0,
            objectFit: 'cover',
          }}
        />
      );
    default:
      return <span>{atom.content}</span>;
  }
}

// ---------------------------------------------------------------------------
// Recursive item renderer
// ---------------------------------------------------------------------------

function RenderItem({
  item,
  getVisibility,
  onItemClick,
}: {
  item: SlideItem;
  getVisibility?: (id: string) => ItemVisibility;
  onItemClick?: (id: string) => void;
}) {
  const visibility = getVisibility?.(item.id) ?? DEFAULT_VISIBILITY;
  const baseStyle = buildBaseStyle(item, visibility);

  // --- Layout ---
  if (item.type === 'layout') {
    const layoutStyle = buildLayoutStyle(item.layoutConfig, item.layoutType);

    // Sidebar layout: first child gets fixed width, second gets flex:1
    if (item.layoutType === 'sidebar' && item.children.length >= 2) {
      const sidebarWidth = item.layoutConfig?.sidebarWidth ?? '30%';
      return (
        <motion.div
          data-item-id={item.id}
          style={{ ...baseStyle, ...layoutStyle, width: '100%', height: '100%' }}
          initial={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
          animate={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ width: sidebarWidth, flexShrink: 0, overflow: 'auto' }}>
            <RenderItem
              item={item.children[0]}
              getVisibility={getVisibility}
              onItemClick={onItemClick}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {item.children.slice(1).map((child) => (
              <RenderItem
                key={child.id}
                item={child}
                getVisibility={getVisibility}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        data-item-id={item.id}
        style={{ ...baseStyle, ...layoutStyle }}
        initial={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
        animate={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {item.children.map((child) => (
          <RenderItem
            key={child.id}
            item={child}
            getVisibility={getVisibility}
            onItemClick={onItemClick}
          />
        ))}
      </motion.div>
    );
  }

  // --- Card ---
  if (item.type === 'card') {
    return (
      <motion.div
        data-item-id={item.id}
        style={{
          ...baseStyle,
          borderRadius: baseStyle.borderRadius ?? 12,
          backgroundColor: baseStyle.backgroundColor ?? 'rgba(255,255,255,0.05)',
          padding: baseStyle.padding ?? 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        initial={visibility.visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        animate={
          visibility.isFocused
            ? { opacity: 1, scale: 1.03 }
            : visibility.visible
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.95 }
        }
        whileHover={visibility.visible ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={onItemClick ? () => onItemClick(item.id) : undefined}
      >
        {item.children.map((child) => (
          <RenderItem
            key={child.id}
            item={child}
            getVisibility={getVisibility}
            onItemClick={onItemClick}
          />
        ))}
      </motion.div>
    );
  }

  // --- Atom ---
  return (
    <motion.div
      data-item-id={item.id}
      style={baseStyle}
      initial={visibility.visible ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={
        visibility.isFocused
          ? { opacity: 1, y: 0, scale: 1.02 }
          : visibility.visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 8, scale: 1 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onItemClick ? () => onItemClick(item.id) : undefined}
    >
      {renderAtom(item, visibility)}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function ItemRenderer({
  items,
  getVisibility,
  onItemClick,
  className,
}: ItemRendererProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {items.map((item) => (
        <RenderItem
          key={item.id}
          item={item}
          getVisibility={getVisibility}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}
