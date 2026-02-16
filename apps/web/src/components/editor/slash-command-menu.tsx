'use client';

/**
 * Slash Command Menu — Notion/Gamma-style "/" block picker.
 *
 * When a user types "/" inside an empty grid cell, a floating menu appears
 * with available block types. Selecting one replaces the cell's placeholder
 * content with the chosen block's SlideItem tree.
 *
 * Exports:
 *   - `SlashCommandMenu`  — The dropdown menu UI (rendered as a portal)
 *   - `EmptyCardSlot`     — Empty cell overlay with "/" interaction
 *   - `createBlockItems`  — Factory: block type → SlideItem children
 *   - `SLASH_COMMAND_OPTIONS` — Available block definitions
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import type { SlideItem, AtomItem, CardItem } from '@/types/slide';
import { em } from '@/components/slide-ui/units';

// ---------------------------------------------------------------------------
// Block Type Definitions
// ---------------------------------------------------------------------------

export interface SlashCommandOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  category: string;
}

export const SLASH_COMMAND_OPTIONS: SlashCommandOption[] = [
  // Cards
  { id: 'icon-card', icon: '🎴', label: 'Icon Card', description: 'Card with icon and title', category: 'Cards' },
  { id: 'stat-card', icon: '📊', label: 'Stat Card', description: 'Metric with value and trend', category: 'Cards' },
  // Lists
  { id: 'task-list', icon: '☑️', label: 'Task List', description: 'Checklist of tasks', category: 'Lists' },
  // Text
  { id: 'heading', icon: '🔤', label: 'Heading', description: 'Large section heading', category: 'Text' },
  { id: 'text', icon: '📝', label: 'Text', description: 'Body text paragraph', category: 'Text' },
  { id: 'quote', icon: '💬', label: 'Quote', description: 'Styled quote with attribution', category: 'Text' },
];

// ---------------------------------------------------------------------------
// Block Item Factories
// ---------------------------------------------------------------------------

function makeAtom(
  id: string,
  atomType: AtomItem['atomType'],
  content: string,
  style?: AtomItem['style'],
): AtomItem {
  return { id, type: 'atom', atomType, content, style };
}

function makeCard(
  id: string,
  children: SlideItem[],
  style?: CardItem['style'],
): CardItem {
  return { id, type: 'card', children, style };
}

/**
 * Create the SlideItem children for a given block type.
 * These replace the placeholder content inside the grid cell card.
 *
 * Compound blocks (icon-card, stat-card, quote, task-list) are wrapped
 * in their own CardItem so they render as a bounded, centred widget
 * inside the cell — not raw atoms stretching to fill the cell.
 *
 * Simple blocks (heading, text) remain as bare atoms.
 */
export function createBlockItems(blockType: string, cellId: string): SlideItem[] {
  const p = `${cellId}-${Date.now().toString(36)}`;

  switch (blockType) {
    case 'icon-card':
      return [
        makeCard(`${p}-card`, [
          makeAtom(`${p}-icon`, 'icon', '🚀', { fontSize: 28 }),
          makeAtom(`${p}-title`, 'text', 'Card Title', {
            fontSize: 13, fontWeight: 'bold', color: '#e2e8f0',
          }),
          makeAtom(`${p}-desc`, 'text', 'Short description text', {
            fontSize: 10, color: '#94a3b8',
          }),
        ], {
          backgroundColor: '#3b82f610',
          borderColor: '#3b82f625',
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        }),
      ];

    case 'task-list':
      return [
        makeCard(`${p}-card`, [
          makeAtom(`${p}-title`, 'text', 'Tasks', {
            fontSize: 12, fontWeight: 'bold', color: '#e2e8f0',
          }),
          makeAtom(`${p}-t1`, 'text', '☐ Task one', { fontSize: 10, color: '#e2e8f0' }),
          makeAtom(`${p}-t2`, 'text', '☐ Task two', { fontSize: 10, color: '#e2e8f0' }),
          makeAtom(`${p}-t3`, 'text', '☐ Task three', { fontSize: 10, color: '#e2e8f0' }),
        ], {
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          padding: 16,
        }),
      ];

    case 'stat-card':
      return [
        makeCard(`${p}-card`, [
          makeAtom(`${p}-value`, 'text', '42K', {
            fontSize: 26, fontWeight: 'bold', color: '#e2e8f0',
          }),
          makeAtom(`${p}-label`, 'text', 'Metric Label', {
            fontSize: 10, color: '#94a3b8',
          }),
          makeAtom(`${p}-delta`, 'text', '↑ +12%', {
            fontSize: 10, color: '#22c55e',
          }),
        ], {
          backgroundColor: '#8b5cf610',
          borderColor: '#8b5cf625',
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        }),
      ];

    case 'quote':
      return [
        makeCard(`${p}-card`, [
          makeAtom(`${p}-mark`, 'text', '\u201C', {
            fontSize: 36, fontWeight: 'bold', color: '#3b82f640',
          }),
          makeAtom(`${p}-text`, 'text', 'Your quote text here', {
            fontSize: 12, fontStyle: 'italic', color: '#e2e8f0',
          }),
          makeAtom(`${p}-attr`, 'text', '— Attribution', {
            fontSize: 9, color: '#64748b',
          }),
        ], {
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        }),
      ];

    case 'heading':
      return [
        makeAtom(`${p}-heading`, 'text', 'Section Heading', {
          fontSize: 20, fontWeight: 'bold', color: '#e2e8f0',
        }),
      ];

    case 'text':
      return [
        makeAtom(`${p}-text`, 'text', 'Start typing your text here…', {
          fontSize: 11, color: '#cbd5e1',
        }),
      ];

    default:
      return [
        makeAtom(`${p}-text`, 'text', 'Content', { fontSize: 11, color: '#cbd5e1' }),
      ];
  }
}

/**
 * Optional card-level style overrides applied when a specific block type
 * is inserted. Compound blocks now carry their own CardItem styling,
 * so this returns undefined for most types.
 */
export function getBlockCardStyle(_blockType: string): Record<string, unknown> | undefined {
  return undefined;
}

// ---------------------------------------------------------------------------
// SlashCommandMenu — Floating dropdown (rendered as a portal)
// ---------------------------------------------------------------------------

interface SlashCommandMenuProps {
  open: boolean;
  filter: string;
  anchorRect: DOMRect | null;
  selectedIndex: number;
  onSelect: (option: SlashCommandOption) => void;
  onClose: () => void;
}

export function SlashCommandMenu({
  open,
  filter,
  anchorRect,
  selectedIndex,
  onSelect,
  onClose,
}: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  const filtered = SLASH_COMMAND_OPTIONS.filter(
    (opt) =>
      opt.label.toLowerCase().includes(filter.toLowerCase()) ||
      opt.description.toLowerCase().includes(filter.toLowerCase()),
  );

  const categories = [...new Set(filtered.map((o) => o.category))];

  // Position below anchor, flip above if not enough space
  const top = anchorRect.bottom + 4;
  const flipUp = typeof window !== 'undefined' && top + 340 > window.innerHeight;

  const menuStyle: CSSProperties = {
    position: 'fixed',
    top: flipUp ? anchorRect.top - 340 : top,
    left: anchorRect.left,
    minWidth: 260,
    maxWidth: 320,
    maxHeight: 340,
    zIndex: 9999,
  };

  let flatIdx = 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-y-auto backdrop-blur-sm"
          style={menuStyle}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-zinc-800">
            <span className="text-[0.6875rem] text-zinc-400 font-medium">
              Insert block
            </span>
          </div>

          {/* Grouped options */}
          {categories.map((cat) => (
            <div key={cat}>
              <div className="px-3 pt-2.5 pb-1">
                <span className="text-[0.5625rem] uppercase tracking-wider text-zinc-500 font-semibold">
                  {cat}
                </span>
              </div>
              {filtered
                .filter((o) => o.category === cat)
                .map((option) => {
                  const idx = flatIdx++;
                  const isHighlighted = idx === selectedIndex;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      data-option-index={idx}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                        isHighlighted
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                      onClick={() => onSelect(option)}
                    >
                      <span className="text-base shrink-0 w-7 text-center leading-none">
                        {option.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[0.75rem] font-medium leading-tight">
                          {option.label}
                        </div>
                        <div className="text-[0.5625rem] text-zinc-500 leading-tight mt-0.5">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          ))}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-[0.6875rem] text-zinc-500">
              No matching blocks
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// EmptyCardSlot — Placeholder cell with "/" slash-command interaction
// ---------------------------------------------------------------------------

interface EmptyCardSlotProps {
  /** ID of the card this slot belongs to. */
  cardId: string;
  /** Base CSS styles from the card's item model. */
  cardStyle: CSSProperties;
  /**
   * Callback to insert block content into this card.
   * Receives the card ID, new children items, and optional style updates.
   */
  onInsertBlock: (
    cardId: string,
    children: SlideItem[],
    style?: Record<string, unknown>,
  ) => void;
}

export function EmptyCardSlot({
  cardId,
  cardStyle,
  onInsertBlock,
}: EmptyCardSlotProps) {
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  // Auto-focus input when activated
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Recompute anchor rect when menu opens or window scrolls
  const updateRect = useCallback(() => {
    if (containerRef.current) {
      setAnchorRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [menuOpen, updateRect]);

  // Filtered options based on text after "/"
  const filterText = menuOpen && inputValue.startsWith('/') ? inputValue.slice(1) : '';
  const filteredOptions = useMemo(
    () =>
      SLASH_COMMAND_OPTIONS.filter(
        (opt) =>
          opt.label.toLowerCase().includes(filterText.toLowerCase()) ||
          opt.description.toLowerCase().includes(filterText.toLowerCase()),
      ),
    [filterText],
  );

  // Reset selected index when filter changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [filterText]);

  const handleSelectOption = useCallback(
    (option: SlashCommandOption) => {
      const newChildren = createBlockItems(option.id, cardId);
      const styleUpdate = getBlockCardStyle(option.id);
      onInsertBlock(cardId, newChildren, styleUpdate ?? undefined);
      setMenuOpen(false);
      setIsActive(false);
      setInputValue('');
    },
    [cardId, onInsertBlock],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      if (val.startsWith('/')) {
        if (!menuOpen) {
          updateRect();
          setMenuOpen(true);
        }
      } else {
        setMenuOpen(false);
      }
    },
    [menuOpen, updateRect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (menuOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIdx((prev) =>
            Math.min(prev + 1, filteredOptions.length - 1),
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIdx((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const option = filteredOptions[selectedIdx];
          if (option) handleSelectOption(option);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setMenuOpen(false);
          setInputValue('');
        }
        return;
      }

      // Not in menu
      if (e.key === 'Escape') {
        setIsActive(false);
        setInputValue('');
      } else if (e.key === 'Enter' && inputValue.trim() && !inputValue.startsWith('/')) {
        e.preventDefault();
        const items = createBlockItems('text', cardId);
        const firstItem = items[0];
        if (firstItem && firstItem.type === 'atom') {
          (firstItem as AtomItem).content = inputValue.trim();
        }
        onInsertBlock(cardId, items);
        setIsActive(false);
        setInputValue('');
      }
    },
    [menuOpen, filteredOptions, selectedIdx, handleSelectOption, cardId, inputValue, onInsertBlock],
  );

  const handleBlur = useCallback(() => {
    // Delay to allow menu click to register before deactivating
    setTimeout(() => {
      setMenuOpen(false);
      setIsActive(false);
      setInputValue('');
    }, 150);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      data-item-id={cardId}
      className="flex flex-col items-center justify-center select-none"
      style={{
        ...cardStyle,
        borderRadius: cardStyle.borderRadius ?? em(12),
        backgroundColor: cardStyle.backgroundColor ?? 'rgba(255,255,255,0.02)',
        padding: cardStyle.padding ?? em(16),
        minHeight: em(80),
        border: '1.5px dashed rgba(255,255,255,0.12)',
        cursor: 'pointer',
      }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.04)' }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isActive) setIsActive(true);
      }}
    >
      {isActive ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Type / for commands…"
          className="w-full bg-transparent outline-none text-center text-white/60 placeholder:text-white/25"
          style={{ fontSize: em(11), caretColor: '#3b82f6' }}
        />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-white/20 transition-colors"
            style={{ fontSize: em(18) }}
          >
            +
          </span>
          <span style={{ fontSize: em(9), color: 'rgba(255,255,255,0.25)' }}>
            Type{' '}
            <span className="font-semibold text-white/40">/</span>
            {' '}for commands
          </span>
        </div>
      )}

      {/* Slash command dropdown */}
      <SlashCommandMenu
        open={menuOpen}
        filter={filterText}
        anchorRect={anchorRect}
        selectedIndex={selectedIdx}
        onSelect={handleSelectOption}
        onClose={() => {
          setMenuOpen(false);
          setInputValue('');
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AddBlockButton — Compact "+" affordance for filled cells
// ---------------------------------------------------------------------------

interface AddBlockButtonProps {
  /** ID of the parent card to append children to. */
  cardId: string;
  /**
   * Callback to append new block children to the card.
   * Unlike EmptyCardSlot (which replaces children), this appends.
   */
  onAppendBlock: (
    cardId: string,
    children: SlideItem[],
    style?: Record<string, unknown>,
  ) => void;
}

export function AddBlockButton({ cardId, onAppendBlock }: AddBlockButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const updateRect = useCallback(() => {
    if (containerRef.current) {
      setAnchorRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [menuOpen, updateRect]);

  const filterText = menuOpen && inputValue.startsWith('/') ? inputValue.slice(1) : '';
  const filteredOptions = useMemo(
    () =>
      SLASH_COMMAND_OPTIONS.filter(
        (opt) =>
          opt.label.toLowerCase().includes(filterText.toLowerCase()) ||
          opt.description.toLowerCase().includes(filterText.toLowerCase()),
      ),
    [filterText],
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [filterText]);

  const handleSelectOption = useCallback(
    (option: SlashCommandOption) => {
      const newChildren = createBlockItems(option.id, cardId);
      // Note: we don't pass style updates for appended blocks — only new items
      onAppendBlock(cardId, newChildren);
      setMenuOpen(false);
      setIsActive(false);
      setInputValue('');
    },
    [cardId, onAppendBlock],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      if (val.startsWith('/')) {
        if (!menuOpen) {
          updateRect();
          setMenuOpen(true);
        }
      } else {
        setMenuOpen(false);
      }
    },
    [menuOpen, updateRect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (menuOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIdx((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIdx((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const option = filteredOptions[selectedIdx];
          if (option) handleSelectOption(option);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setMenuOpen(false);
          setInputValue('');
        }
        return;
      }
      if (e.key === 'Escape') {
        setIsActive(false);
        setInputValue('');
      } else if (e.key === 'Enter' && inputValue.trim() && !inputValue.startsWith('/')) {
        e.preventDefault();
        const items = createBlockItems('text', cardId);
        const firstItem = items[0];
        if (firstItem && firstItem.type === 'atom') {
          (firstItem as AtomItem).content = inputValue.trim();
        }
        onAppendBlock(cardId, items);
        setIsActive(false);
        setInputValue('');
      }
    },
    [menuOpen, filteredOptions, selectedIdx, handleSelectOption, cardId, inputValue, onAppendBlock],
  );

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setMenuOpen(false);
      setIsActive(false);
      setInputValue('');
    }, 150);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {isActive ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Type / for blocks…"
          className="w-full bg-transparent outline-none text-center text-white/50 placeholder:text-white/20"
          style={{ fontSize: em(9), caretColor: '#3b82f6' }}
        />
      ) : (
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors text-white/20 hover:text-white/50 hover:bg-white/5"
          onClick={() => setIsActive(true)}
          style={{ fontSize: em(9) }}
        >
          <span style={{ fontSize: em(12), lineHeight: 1 }}>+</span>
          <span>Add block</span>
        </button>
      )}

      <SlashCommandMenu
        open={menuOpen}
        filter={filterText}
        anchorRect={anchorRect}
        selectedIndex={selectedIdx}
        onSelect={handleSelectOption}
        onClose={() => {
          setMenuOpen(false);
          setInputValue('');
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: detect whether a CardItem is an "empty" placeholder
// ---------------------------------------------------------------------------

/**
 * A card is considered "empty" when it has no children, or only a single
 * text atom whose content is empty.  Used by ItemRenderer to decide
 * whether to show the EmptyCardSlot overlay.
 */
export function isEmptyCard(children: SlideItem[]): boolean {
  if (children.length === 0) return true;
  if (children.length === 1) {
    const child = children[0];
    return (
      child.type === 'atom' &&
      child.atomType === 'text' &&
      child.content.trim() === ''
    );
  }
  return false;
}
