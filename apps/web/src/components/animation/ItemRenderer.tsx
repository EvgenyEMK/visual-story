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
 *
 * Cards with `detailItems` can show a DetailPopup overlay when expanded.
 * The popup grows from the card's position for a smooth visual connection.
 */

'use client';

import { type CSSProperties, type ReactNode, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import type {
  SlideItem,
  LayoutItem,
  CardItem,
  AtomItem,
  LayoutConfig,
  ElementStyle,
} from '@/types/slide';
import { em } from '@/components/slide-ui/units';
import { DetailPopup } from '@/components/slide-ui/molecules/DetailPopup';
import type { PopupOriginRect } from '@/components/slide-ui/molecules/DetailPopup';
import { InlineTextEditor } from '@/components/editor/inline-text-editor';
import { EmptyCardSlot, AddBlockButton, isEmptyCard } from '@/components/editor/slash-command-menu';

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

/** Editing context passed through the recursive renderer. */
interface EditingContext {
  selectedItemId?: string;
  editingItemId?: string;
  onItemSelect?: (itemId: string | null) => void;
  onItemUpdate?: (itemId: string, updates: Partial<SlideItem>) => void;
  onItemEditStart?: (itemId: string) => void;
  onItemEditEnd?: () => void;
  /** Append new child items to a card/layout (for adding blocks to filled cells). */
  onAppendBlock?: (parentId: string, children: SlideItem[]) => void;
  isPreview?: boolean;
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
  /**
   * ID of the card currently showing its detail popup.
   * When set, a DetailPopup is rendered for the matching card (if it has detailItems).
   */
  expandedCardId?: string | null;
  /**
   * Callback to open/close a card's detail popup.
   * Pass the card ID to open, or null to close.
   */
  onCardExpand?: (cardId: string | null) => void;
  /** Additional class names for the root wrapper. */
  className?: string;

  // --- Editing props (optional, enables edit mode) ---

  /** ID of the currently selected item (shows selection ring). */
  selectedItemId?: string;
  /** ID of the item in inline-edit mode (renders InlineTextEditor). */
  editingItemId?: string;
  /** Called when a user clicks an item to select it (or null to deselect). */
  onItemSelect?: (itemId: string | null) => void;
  /** Called when an item's content or style changes. */
  onItemUpdate?: (itemId: string, updates: Partial<SlideItem>) => void;
  /** Called when a user double-clicks a text atom to start editing. */
  onItemEditStart?: (itemId: string) => void;
  /** Called when inline text editing ends. */
  onItemEditEnd?: () => void;
  /** Called to append new block children to a card/layout. */
  onAppendBlock?: (parentId: string, children: SlideItem[]) => void;
  /** Whether in preview mode (disables editing). */
  isPreview?: boolean;
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
    if (s.width != null) style.width = typeof s.width === 'number' ? em(s.width) : s.width;
    if (s.height != null) style.height = typeof s.height === 'number' ? em(s.height) : s.height;
    if (s.backgroundColor) style.backgroundColor = s.backgroundColor;
    if (s.borderRadius != null) style.borderRadius = typeof s.borderRadius === 'number' ? em(s.borderRadius) : s.borderRadius;
    if (s.borderWidth != null) style.borderWidth = s.borderWidth;
    if (s.borderColor) style.borderColor = s.borderColor;
    if (s.borderWidth != null) style.borderStyle = 'solid';
    if (s.boxShadow) style.boxShadow = s.boxShadow;
    if (s.opacity != null) style.opacity = s.opacity;
    if (s.padding != null) style.padding = typeof s.padding === 'number' ? em(s.padding) : s.padding;
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
        style.gap = em(16);
        break;
      case 'stack':
        style.flexDirection = 'column';
        style.gap = em(8);
        break;
      case 'sidebar':
        style.flexDirection = 'row';
        break;
      case 'split':
        style.flexDirection = 'row';
        break;
      default:
        style.flexDirection = 'row';
        style.gap = em(16);
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

  if (cfg.gap != null) style.gap = typeof cfg.gap === 'number' ? em(cfg.gap) : cfg.gap;

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
  if (style.fontSize != null) css.fontSize = typeof style.fontSize === 'number' ? em(style.fontSize) : style.fontSize;
  if (style.fontWeight) css.fontWeight = style.fontWeight;
  if (style.fontStyle) css.fontStyle = style.fontStyle;
  if (style.color) css.color = style.color;
  if (style.textAlign) css.textAlign = style.textAlign;
  return css;
}

// ---------------------------------------------------------------------------
// Atom renderers
// ---------------------------------------------------------------------------

/** Detect whether a string contains HTML tags. */
export function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

function renderAtom(atom: AtomItem): ReactNode {
  const textStyle = buildTextStyle(atom.style);

  switch (atom.atomType) {
    case 'text':
      // Content may be plain text or HTML from the Tiptap rich-text editor.
      if (isHtmlContent(atom.content)) {
        return (
          <div
            style={textStyle}
            className="[&_p]:m-0 [&_p]:leading-[inherit]"
            dangerouslySetInnerHTML={{ __html: atom.content }}
          />
        );
      }
      return (
        <span style={{ ...textStyle, whiteSpace: 'pre-line' }}>
          {atom.content}
        </span>
      );
    case 'icon':
      return (
        <span
          style={{
            fontSize: em(atom.style?.fontSize ?? 24),
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
            width: atom.style?.width != null ? (typeof atom.style.width === 'number' ? em(atom.style.width) : atom.style.width) : em(40),
            height: atom.style?.height != null ? (typeof atom.style.height === 'number' ? em(atom.style.height) : atom.style.height) : em(40),
            backgroundColor: atom.style?.backgroundColor ?? '#94a3b8',
            borderRadius: atom.style?.borderRadius != null ? (typeof atom.style.borderRadius === 'number' ? em(atom.style.borderRadius) : atom.style.borderRadius) : em(0),
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
            width: atom.style?.width != null ? (typeof atom.style.width === 'number' ? em(atom.style.width) : atom.style.width) : '100%',
            height: atom.style?.height != null ? (typeof atom.style.height === 'number' ? em(atom.style.height) : atom.style.height) : 'auto',
            borderRadius: atom.style?.borderRadius != null ? (typeof atom.style.borderRadius === 'number' ? em(atom.style.borderRadius) : atom.style.borderRadius) : em(0),
            objectFit: 'cover',
          }}
        />
      );
    default:
      return <span>{atom.content}</span>;
  }
}

// ---------------------------------------------------------------------------
// Helper: extract card info for popup from detailItems
// ---------------------------------------------------------------------------

/** Extract icon and title from a card's children for the popup header. */
function extractCardMeta(card: CardItem): { icon: string; title: string; description?: string; color?: string } {
  let icon = '';
  let title = '';
  let description: string | undefined;
  let color: string | undefined;

  for (const child of card.children) {
    if (child.type === 'atom') {
      if (child.atomType === 'icon' && !icon) icon = child.content;
      if (child.atomType === 'text' && !title) title = child.content;
      if (child.atomType === 'text' && title && !description) description = child.content;
    }
  }

  // Try to extract color from card's style or first icon's style
  color = card.style?.borderColor ?? card.style?.backgroundColor;
  if (!color) {
    const iconChild = card.children.find(
      (c) => c.type === 'atom' && c.atomType === 'icon',
    );
    color = iconChild?.style?.color;
  }

  return { icon: icon || '📋', title: title || card.id, description, color };
}

// ---------------------------------------------------------------------------
// Selection ring class helper
// ---------------------------------------------------------------------------

function selectionClasses(
  itemId: string,
  editing: EditingContext,
  itemType?: SlideItem['type'],
): string {
  if (!editing.selectedItemId) return '';
  if (editing.selectedItemId !== itemId) return '';
  if (editing.editingItemId === itemId) return 'ring-2 ring-blue-500 ring-offset-1 rounded';
  // Cards/layouts use an orange ring to visually distinguish container selection
  // from child (atom) selection which uses the default primary ring.
  if (itemType === 'card' || itemType === 'layout')
    return 'ring-2 ring-orange-400 ring-offset-1 rounded';
  return 'ring-2 ring-primary ring-offset-1 rounded';
}

// ---------------------------------------------------------------------------
// Recursive item renderer
// ---------------------------------------------------------------------------

function RenderItem({
  item,
  getVisibility,
  onItemClick,
  editing,
  parentCardId,
}: {
  item: SlideItem;
  getVisibility?: (id: string) => ItemVisibility;
  onItemClick?: (id: string) => void;
  editing: EditingContext;
  /** When rendered inside a card, the parent card's ID (for drill-down click). */
  parentCardId?: string;
}) {
  const visibility = getVisibility?.(item.id) ?? DEFAULT_VISIBILITY;

  // Hidden items should not take up any layout space (e.g. inactive detail
  // panels in sidebar/tab navigation). Returning null removes them from
  // the DOM entirely, preventing scroll/overflow issues.
  if (visibility.hidden) {
    return null;
  }

  const baseStyle = buildBaseStyle(item, visibility);
  const ringClass = selectionClasses(item.id, editing, item.type);
  const isEditable = !editing.isPreview && !!editing.onItemSelect;

  // Click handler with drill-down for atoms inside a card:
  // If the parent card isn't selected yet, the first click selects the card.
  // Once the card is selected, clicking an atom selects the atom (drill-down).
  // Nested cards (item.type === 'card') always select themselves directly —
  // the user can reach the grid cell via Escape or clicking the cell padding.
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable) {
      if (
        parentCardId &&
        item.type !== 'card' &&
        editing.selectedItemId !== parentCardId
      ) {
        editing.onItemSelect?.(parentCardId);
      } else {
        editing.onItemSelect?.(item.id);
      }
    } else {
      onItemClick?.(item.id);
    }
  };

  // Double-click handler: start inline editing for text atoms.
  // Always goes directly to editing regardless of parent selection state.
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable && item.type === 'atom' && item.atomType === 'text') {
      editing.onItemEditStart?.(item.id);
    }
  };

  // --- Layout ---
  if (item.type === 'layout') {
    const layoutStyle = buildLayoutStyle(item.layoutConfig, item.layoutType);

    // Sidebar layout: first child gets fixed width, second gets flex:1
    if (item.layoutType === 'sidebar' && item.children.length >= 2) {
      const sidebarWidth = item.layoutConfig?.sidebarWidth ?? '30%';
      return (
        <motion.div
          data-item-id={item.id}
          className={ringClass}
          style={{ ...baseStyle, ...layoutStyle, width: '100%', height: '100%' }}
          initial={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
          animate={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={isEditable ? handleClick : undefined}
        >
          <div style={{ width: sidebarWidth, flexShrink: 0, overflow: 'auto' }}>
            <RenderItem
              item={item.children[0]}
              getVisibility={getVisibility}
              onItemClick={onItemClick}
              editing={editing}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {item.children.slice(1).map((child) => (
              <RenderItem
                key={child.id}
                item={child}
                getVisibility={getVisibility}
                onItemClick={onItemClick}
                editing={editing}
              />
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        data-item-id={item.id}
        className={ringClass}
        style={{ ...baseStyle, ...layoutStyle, width: '100%', height: '100%' }}
        initial={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
        animate={visibility.visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={isEditable ? handleClick : undefined}
      >
        {item.children.map((child) => (
          <RenderItem
            key={child.id}
            item={child}
            getVisibility={getVisibility}
            onItemClick={onItemClick}
            editing={editing}
          />
        ))}
      </motion.div>
    );
  }

  // --- Card ---
  if (item.type === 'card') {
    // Empty placeholder card: show slash-command slot in edit mode
    if (isEmptyCard(item.children) && isEditable && editing.onItemUpdate) {
      const handleInsertBlock = (
        cardId: string,
        children: SlideItem[],
        style?: Record<string, unknown>,
      ) => {
        const updates: Partial<SlideItem> & { children?: SlideItem[] } = { children };
        if (style) {
          updates.style = style as SlideItem['style'];
        }
        editing.onItemUpdate!(cardId, updates as Partial<SlideItem>);
      };

      return (
        <EmptyCardSlot
          cardId={item.id}
          cardStyle={baseStyle}
          onInsertBlock={handleInsertBlock}
        />
      );
    }

    const hasDetail = item.detailItems && item.detailItems.length > 0;
    const showAddBlock = isEditable && !!editing.onAppendBlock;
    // Nested card (inside another card): centre itself and don't stretch
    const isNestedCard = !!parentCardId;
    return (
      <motion.div
        data-item-id={item.id}
        data-has-detail={hasDetail ? 'true' : undefined}
        className={ringClass}
        style={{
          ...baseStyle,
          borderRadius: baseStyle.borderRadius ?? em(12),
          backgroundColor: baseStyle.backgroundColor ?? 'rgba(255,255,255,0.05)',
          padding: baseStyle.padding ?? em(16),
          display: 'flex',
          flexDirection: 'column',
          gap: em(8),
          ...(isNestedCard
            ? { alignSelf: 'center', width: 'auto', minWidth: '70%' }
            : {}),
          cursor: isEditable || hasDetail || onItemClick ? 'pointer' : undefined,
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
        onClick={isEditable ? handleClick : (onItemClick ? (e) => { e.stopPropagation(); onItemClick(item.id); } : undefined)}
      >
        {item.children.map((child) => (
          <RenderItem
            key={child.id}
            item={child}
            getVisibility={getVisibility}
            onItemClick={onItemClick}
            editing={editing}
            parentCardId={item.id}
          />
        ))}

        {/* "Add block" affordance at bottom of filled cards */}
        {showAddBlock && (
          <AddBlockButton
            cardId={item.id}
            onAppendBlock={(cardId, children) => {
              editing.onAppendBlock!(cardId, children);
            }}
          />
        )}
      </motion.div>
    );
  }

  // --- Atom ---
  const isTextAtom = item.atomType === 'text';
  const isBeingEdited = editing.editingItemId === item.id && isTextAtom;

  return (
    <motion.div
      data-item-id={item.id}
      className={ringClass}
      style={{
        ...baseStyle,
        cursor: isEditable ? 'pointer' : undefined,
      }}
      initial={visibility.visible ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={
        visibility.isFocused
          ? { opacity: 1, y: 0, scale: 1.02 }
          : visibility.visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 8, scale: 1 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={isEditable ? handleClick : (onItemClick ? () => onItemClick(item.id) : undefined)}
      onDoubleClick={handleDoubleClick}
    >
      {isBeingEdited ? (
        <InlineTextEditor
          content={item.content}
          onSave={(html) => {
            editing.onItemUpdate?.(item.id, { content: html } as Partial<SlideItem>);
          }}
          onExit={() => {
            editing.onItemEditEnd?.();
          }}
          style={buildTextStyle(item.style)}
        />
      ) : (
        renderAtom(item)
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Helper: find a card by ID in the items tree
// ---------------------------------------------------------------------------

function findCardById(items: SlideItem[], id: string): CardItem | null {
  for (const item of items) {
    if (item.type === 'card' && item.id === id) return item;
    if (item.type === 'layout' || item.type === 'card') {
      const found = findCardById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function ItemRenderer({
  items,
  getVisibility,
  onItemClick,
  expandedCardId,
  onCardExpand,
  className,
  // Editing props
  selectedItemId,
  editingItemId,
  onItemSelect,
  onItemUpdate,
  onItemEditStart,
  onItemEditEnd,
  onAppendBlock,
  isPreview,
}: ItemRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Build editing context once for the recursive tree
  const editing: EditingContext = {
    selectedItemId,
    editingItemId,
    onItemSelect,
    onItemUpdate,
    onItemEditStart,
    onItemEditEnd,
    onAppendBlock,
    isPreview,
  };

  // Compute origin rect for popup grow-from-card animation
  const getOriginRect = useCallback(
    (cardId: string): PopupOriginRect | undefined => {
      if (!rootRef.current) return undefined;
      const cardEl = rootRef.current.querySelector(`[data-item-id="${cardId}"]`);
      if (!cardEl) return undefined;

      const rootRect = rootRef.current.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      return {
        x: cardRect.left - rootRect.left,
        y: cardRect.top - rootRect.top,
        width: cardRect.width,
        height: cardRect.height,
      };
    },
    [],
  );

  // Find expanded card and its metadata
  const expandedCard = expandedCardId ? findCardById(items, expandedCardId) : null;
  const expandedMeta = expandedCard ? extractCardMeta(expandedCard) : null;
  const originRect = expandedCardId ? getOriginRect(expandedCardId) : undefined;

  // Render detail items as simple content inside the popup
  const renderDetailItems = (card: CardItem) => {
    if (!card.detailItems || card.detailItems.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: em(8) }}>
        {card.detailItems.map((detailItem) => (
          <RenderItem key={detailItem.id} item={detailItem} editing={editing} />
        ))}
      </div>
    );
  };

  // Click on empty canvas area deselects
  const handleRootClick = useCallback(() => {
    onItemSelect?.(null);
  }, [onItemSelect]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onClick={onItemSelect ? handleRootClick : undefined}
    >
      {items.map((item) => (
        <RenderItem
          key={item.id}
          item={item}
          getVisibility={getVisibility}
          onItemClick={onItemClick}
          editing={editing}
        />
      ))}

      {/* Detail popup overlay for expanded cards */}
      {expandedCard && expandedMeta && (
        <DetailPopup
          open={true}
          icon={expandedMeta.icon}
          title={expandedMeta.title}
          description={expandedMeta.description}
          color={expandedMeta.color}
          onClose={() => onCardExpand?.(null)}
          originRect={originRect}
          width="wide"
        >
          {renderDetailItems(expandedCard)}
        </DetailPopup>
      )}
    </div>
  );
}
