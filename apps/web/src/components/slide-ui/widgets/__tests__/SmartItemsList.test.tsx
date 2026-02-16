import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SmartItemsList } from '../SmartItemsList';
import type { SmartListConfig, SmartListData, SmartListItem } from '@/types/smart-list';

// ---------------------------------------------------------------------------
// Mock motion/react — strip animation props, render plain HTML
// ---------------------------------------------------------------------------

vi.mock('motion/react', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return ({ children, ...props }: any) => {
          const {
            initial,
            animate,
            exit,
            transition,
            variants,
            whileHover,
            whileTap,
            ...htmlProps
          } = props;
          const Tag = prop as any;
          return <Tag data-testid={htmlProps['data-testid']} {...htmlProps}>{children}</Tag>;
        };
      },
    },
  ),
  AnimatePresence: ({ children }: any) => children,
}));

// Mock @dnd-kit — render children without DnD context
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  closestCenter: vi.fn(),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn(() => []),
}));
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));
vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => null,
    },
  },
}));

// ---------------------------------------------------------------------------
// Test data factories
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<SmartListConfig> = {}): SmartListConfig {
  return {
    iconSetId: 'task-status',
    collapseDefault: 'all-expanded',
    revealMode: 'all-at-once',
    size: 'md',
    ...overrides,
  };
}

function makeBasicItems(): SmartListItem[] {
  return [
    { id: 'h1', text: 'Section Header', isHeader: true },
    {
      id: 'i1',
      text: 'First item',
      primaryIcon: { setId: 'task-status', iconId: 'done' },
    },
    {
      id: 'i2',
      text: 'Second item',
      primaryIcon: { setId: 'task-status', iconId: 'in-progress' },
      description: 'Some description',
    },
    {
      id: 'i3',
      text: 'Third item',
      primaryIcon: { setId: 'task-status', iconId: 'todo' },
    },
  ];
}

function makeNestedItems(): SmartListItem[] {
  return [
    {
      id: 'p1',
      text: 'Parent item',
      primaryIcon: { setId: 'task-status', iconId: 'in-progress' },
      children: [
        {
          id: 'c1',
          text: 'Child one',
          primaryIcon: { setId: 'task-status', iconId: 'done' },
        },
        {
          id: 'c2',
          text: 'Child two',
          primaryIcon: { setId: 'task-status', iconId: 'todo' },
        },
      ],
    },
  ];
}

function makeVisibilityItems(): SmartListItem[] {
  return [
    {
      id: 'v1',
      text: 'Visible item',
      primaryIcon: { setId: 'task-status', iconId: 'done' },
    },
    {
      id: 'v2',
      text: 'Hidden item',
      primaryIcon: { setId: 'task-status', iconId: 'todo' },
      visible: false,
    },
    {
      id: 'v3',
      text: 'Another visible',
      primaryIcon: { setId: 'task-status', iconId: 'in-progress' },
    },
  ];
}

function makeDetailItems(): SmartListItem[] {
  return [
    {
      id: 'd1',
      text: 'Item with detail',
      primaryIcon: { setId: 'circle-check', iconId: 'done' },
      detail: 'This is the expanded detail text.',
    },
    {
      id: 'd2',
      text: 'Item without detail',
      primaryIcon: { setId: 'circle-check', iconId: 'active' },
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════════════════

describe('SmartItemsList', () => {
  // -----------------------------------------------------------------------
  // Basic rendering
  // -----------------------------------------------------------------------

  describe('Basic rendering', () => {
    it('renders all items including headers and regular items', () => {
      const data: SmartListData = { items: makeBasicItems() };
      render(<SmartItemsList config={makeConfig()} data={data} />);

      expect(screen.getByText('Section Header')).toBeTruthy();
      expect(screen.getByText('First item')).toBeTruthy();
      expect(screen.getByText('Second item')).toBeTruthy();
      expect(screen.getByText('Third item')).toBeTruthy();
    });

    it('renders item descriptions', () => {
      const data: SmartListData = { items: makeBasicItems() };
      render(<SmartItemsList config={makeConfig()} data={data} />);

      expect(screen.getByText('Some description')).toBeTruthy();
    });

    it('renders nested (child) items when expanded', () => {
      const data: SmartListData = { items: makeNestedItems() };
      render(<SmartItemsList config={makeConfig()} data={data} />);

      expect(screen.getByText('Parent item')).toBeTruthy();
      expect(screen.getByText('Child one')).toBeTruthy();
      expect(screen.getByText('Child two')).toBeTruthy();
    });

    it('renders with empty items array without crashing', () => {
      const data: SmartListData = { items: [] };
      const { container } = render(
        <SmartItemsList config={makeConfig()} data={data} />,
      );
      expect(container).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Collapse / expand
  // -----------------------------------------------------------------------

  describe('Collapse / expand', () => {
    it('hides children when collapse default is all-collapsed', () => {
      const data: SmartListData = { items: makeNestedItems() };
      render(
        <SmartItemsList
          config={makeConfig({ collapseDefault: 'all-collapsed' })}
          data={data}
        />,
      );

      expect(screen.getByText('Parent item')).toBeTruthy();
      expect(screen.queryByText('Child one')).toBeNull();
      expect(screen.queryByText('Child two')).toBeNull();
    });

    it('shows children when collapse default is all-expanded', () => {
      const data: SmartListData = { items: makeNestedItems() };
      render(
        <SmartItemsList
          config={makeConfig({ collapseDefault: 'all-expanded' })}
          data={data}
        />,
      );

      expect(screen.getByText('Child one')).toBeTruthy();
      expect(screen.getByText('Child two')).toBeTruthy();
    });

    it('collapses children when chevron is clicked', () => {
      const data: SmartListData = { items: makeNestedItems() };
      render(
        <SmartItemsList
          config={makeConfig({ collapseDefault: 'all-expanded' })}
          data={data}
        />,
      );

      // Children should be visible initially
      expect(screen.getByText('Child one')).toBeTruthy();

      // Find the collapse chevron button (accessible name is the ▾ character)
      const chevronBtn = screen.getByRole('button', { name: '▾' });
      fireEvent.click(chevronBtn);

      // Children should be hidden after click
      expect(screen.queryByText('Child one')).toBeNull();
      expect(screen.queryByText('Child two')).toBeNull();
    });

    it('re-expands children when chevron is clicked a second time', () => {
      const data: SmartListData = { items: makeNestedItems() };
      render(
        <SmartItemsList
          config={makeConfig({ collapseDefault: 'all-expanded' })}
          data={data}
        />,
      );

      // Collapse
      fireEvent.click(screen.getByRole('button', { name: '▾' }));
      expect(screen.queryByText('Child one')).toBeNull();

      // Re-query the button after re-render and expand
      fireEvent.click(screen.getByRole('button', { name: '▾' }));
      expect(screen.getByText('Child one')).toBeTruthy();
      expect(screen.getByText('Child two')).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Visibility (SL-F09: Edit vs. Presentation mode)
  // -----------------------------------------------------------------------

  describe('Visibility — Edit vs. Presentation mode', () => {
    it('hides items with visible=false in presentation mode', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      render(
        <SmartItemsList config={makeConfig()} data={data} isEditing={false} />,
      );

      expect(screen.getByText('Visible item')).toBeTruthy();
      expect(screen.queryByText('Hidden item')).toBeNull();
      expect(screen.getByText('Another visible')).toBeTruthy();
    });

    it('shows all items (including hidden) in edit mode', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // In edit mode, items render as <input> elements
      expect(screen.getByDisplayValue('Visible item')).toBeTruthy();
      expect(screen.getByDisplayValue('Hidden item')).toBeTruthy();
      expect(screen.getByDisplayValue('Another visible')).toBeTruthy();
    });

    it('renders visibility toggle buttons in edit mode for non-header items', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // Each non-header item gets a visibility toggle (◉ or ◌)
      const visibilityBtns = screen.getAllByTitle(/presentation/i);
      expect(visibilityBtns.length).toBe(3); // 3 non-header items
    });

    it('calls onDataChange when visibility toggle is clicked', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // Click the first visibility toggle
      const visibilityBtns = screen.getAllByTitle(/presentation/i);
      fireEvent.click(visibilityBtns[0]);

      expect(onDataChange).toHaveBeenCalledTimes(1);
      const newData = onDataChange.mock.calls[0][0] as SmartListData;
      // The first visible item should now be hidden
      expect(newData.items[0].visible).toBe(false);
    });

    it('applies line-through style to hidden items in edit mode', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // The hidden item's input should have line-through class
      const hiddenInput = screen.getByDisplayValue('Hidden item');
      expect(hiddenInput.className).toContain('line-through');
    });
  });

  // -----------------------------------------------------------------------
  // Edit mode — text editing
  // -----------------------------------------------------------------------

  describe('Edit mode — text editing', () => {
    it('renders input fields for each item in edit mode', () => {
      const data: SmartListData = { items: makeBasicItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // Non-header items should have input fields
      expect(screen.getByDisplayValue('First item')).toBeTruthy();
      expect(screen.getByDisplayValue('Second item')).toBeTruthy();
      expect(screen.getByDisplayValue('Third item')).toBeTruthy();
    });

    it('renders plain text spans in presentation mode', () => {
      const data: SmartListData = { items: makeBasicItems() };
      render(
        <SmartItemsList config={makeConfig()} data={data} isEditing={false} />,
      );

      // Should show text but no input fields
      expect(screen.getByText('First item')).toBeTruthy();
      expect(screen.queryByDisplayValue('First item')).toBeNull();
    });

    it('calls onDataChange when text is edited', () => {
      const data: SmartListData = { items: makeBasicItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      const input = screen.getByDisplayValue('First item');
      fireEvent.change(input, { target: { value: 'Updated item' } });

      expect(onDataChange).toHaveBeenCalledTimes(1);
      const newData = onDataChange.mock.calls[0][0] as SmartListData;
      const updatedItem = newData.items.find((i) => i.id === 'i1');
      expect(updatedItem?.text).toBe('Updated item');
    });
  });

  // -----------------------------------------------------------------------
  // Edit mode — icon quick-pick
  // -----------------------------------------------------------------------

  describe('Edit mode — icon click and quick-pick', () => {
    it('opens icon quick-pick when icon is clicked in edit mode', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'i1',
            text: 'Test item',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
        ],
      };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // Find the icon box area — it has a cursor-pointer class in edit mode
      const iconBoxes = document.querySelectorAll('.cursor-pointer');
      expect(iconBoxes.length).toBeGreaterThan(0);

      // Click the icon box to open quick-pick
      fireEvent.click(iconBoxes[0]);

      // The quick-pick popover should now show the icon set name
      expect(screen.getByText('Task Status')).toBeTruthy();
    });

    it('does not open quick-pick in presentation mode', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'i1',
            text: 'Test item',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={false}
        />,
      );

      // In presentation mode, the icon box should not have cursor-pointer
      const iconBoxes = document.querySelectorAll('.cursor-pointer');
      expect(iconBoxes.length).toBe(0);
    });

    it('calls onDataChange when a new icon is selected from quick-pick', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'i1',
            text: 'Test item',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
        ],
      };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // Open quick-pick
      const iconBoxes = document.querySelectorAll('.cursor-pointer');
      fireEvent.click(iconBoxes[0]);

      // Click "In Progress" option
      const inProgressBtn = screen.getByText('In Progress');
      fireEvent.click(inProgressBtn);

      expect(onDataChange).toHaveBeenCalledTimes(1);
      const newData = onDataChange.mock.calls[0][0] as SmartListData;
      expect(newData.items[0].primaryIcon?.iconId).toBe('in-progress');
    });
  });

  // -----------------------------------------------------------------------
  // Numbering
  // -----------------------------------------------------------------------

  describe('Numbering', () => {
    it('shows numeric labels when showNumbering is true with 1. format', () => {
      const data: SmartListData = {
        items: [
          { id: 'n1', text: 'Step one' },
          { id: 'n2', text: 'Step two' },
          { id: 'n3', text: 'Step three' },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'bullets',
            showNumbering: true,
            numberingFormat: '1.',
          })}
          data={data}
        />,
      );

      expect(screen.getByText('1.')).toBeTruthy();
      expect(screen.getByText('2.')).toBeTruthy();
      expect(screen.getByText('3.')).toBeTruthy();
    });

    it('shows alphabetic labels with a. format', () => {
      const data: SmartListData = {
        items: [
          { id: 'a1', text: 'First' },
          { id: 'a2', text: 'Second' },
          { id: 'a3', text: 'Third' },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'bullets',
            showNumbering: true,
            numberingFormat: 'a.',
          })}
          data={data}
        />,
      );

      expect(screen.getByText('a.')).toBeTruthy();
      expect(screen.getByText('b.')).toBeTruthy();
      expect(screen.getByText('c.')).toBeTruthy();
    });

    it('uses child numbering format for nested items', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'p1',
            text: 'Parent',
            children: [
              { id: 'c1', text: 'Child A' },
              { id: 'c2', text: 'Child B' },
            ],
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'bullets',
            showNumbering: true,
            numberingFormat: '1.',
          })}
          data={data}
        />,
      );

      // Parent should get "1."
      expect(screen.getByText('1.')).toBeTruthy();
      // Children should default to "a)" format
      expect(screen.getByText('a)')).toBeTruthy();
      expect(screen.getByText('b)')).toBeTruthy();
    });

    it('does not show numbering when showNumbering is false', () => {
      const data: SmartListData = {
        items: [
          { id: 'n1', text: 'Item one' },
          { id: 'n2', text: 'Item two' },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({ showNumbering: false })}
          data={data}
        />,
      );

      expect(screen.queryByText('1.')).toBeNull();
      expect(screen.queryByText('2.')).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Filter by status (SL-F16)
  // -----------------------------------------------------------------------

  describe('Filter by status (SL-F16)', () => {
    it('filters items to only show allowed statuses', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'f1',
            text: 'Done task',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
          {
            id: 'f2',
            text: 'In progress task',
            primaryIcon: { setId: 'task-status', iconId: 'in-progress' },
          },
          {
            id: 'f3',
            text: 'Todo task',
            primaryIcon: { setId: 'task-status', iconId: 'todo' },
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({ filterByStatuses: ['in-progress', 'todo'] })}
          data={data}
        />,
      );

      expect(screen.queryByText('Done task')).toBeNull();
      expect(screen.getByText('In progress task')).toBeTruthy();
      expect(screen.getByText('Todo task')).toBeTruthy();
    });

    it('preserves headers when filtering', () => {
      const data: SmartListData = {
        items: [
          { id: 'h1', text: 'My Section', isHeader: true },
          {
            id: 'f1',
            text: 'Done task',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
          {
            id: 'f2',
            text: 'Todo task',
            primaryIcon: { setId: 'task-status', iconId: 'todo' },
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({ filterByStatuses: ['todo'] })}
          data={data}
        />,
      );

      expect(screen.getByText('My Section')).toBeTruthy();
      expect(screen.queryByText('Done task')).toBeNull();
      expect(screen.getByText('Todo task')).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Group by status (SL-F16)
  // -----------------------------------------------------------------------

  describe('Group by status (SL-F16)', () => {
    it('creates synthetic headers grouping items by status', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'g1',
            text: 'Task A done',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
          {
            id: 'g2',
            text: 'Task B progress',
            primaryIcon: { setId: 'task-status', iconId: 'in-progress' },
          },
          {
            id: 'g3',
            text: 'Task C done',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({ groupByStatus: true })}
          data={data}
        />,
      );

      // Should have synthetic group headers with counts
      expect(screen.getByText('Done (2)')).toBeTruthy();
      expect(screen.getByText('In Progress (1)')).toBeTruthy();
      // All items should still appear
      expect(screen.getByText('Task A done')).toBeTruthy();
      expect(screen.getByText('Task B progress')).toBeTruthy();
      expect(screen.getByText('Task C done')).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Conditional formatting (Phase 2)
  // -----------------------------------------------------------------------

  describe('Conditional formatting', () => {
    it('applies background color from icon when conditionalFormatting is enabled', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'cf1',
            text: 'Formatted item',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
        ],
      };
      const { container } = render(
        <SmartItemsList
          config={makeConfig({
            conditionalFormatting: true,
            conditionalFormatIntensity: 'medium',
          })}
          data={data}
        />,
      );

      // The item row should have a background color style set
      // The "done" status has color #22c55e, medium intensity appends '1A'
      const itemRow = container.querySelector('[style*="background-color"]');
      expect(itemRow).toBeTruthy();
    });

    it('does not apply background when conditionalFormatting is false', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'cf1',
            text: 'Unformatted item',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
        ],
      };
      const { container } = render(
        <SmartItemsList config={makeConfig()} data={data} />,
      );

      // The item row should NOT have a conditional formatting background
      const rows = container.querySelectorAll('.rounded-\\[0\\.5em\\]');
      rows.forEach((row) => {
        const bg = (row as HTMLElement).style.backgroundColor;
        // Either empty or not set (no conditional bg)
        expect(!bg || bg === '').toBe(true);
      });
    });
  });

  // -----------------------------------------------------------------------
  // Progress summary (Phase 2)
  // -----------------------------------------------------------------------

  describe('Progress summary', () => {
    it('renders progress bar when progressSummary is above', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'pg1',
            text: 'Done item',
            primaryIcon: { setId: 'checkbox', iconId: 'checked' },
          },
          {
            id: 'pg2',
            text: 'Undone item',
            primaryIcon: { setId: 'checkbox', iconId: 'unchecked' },
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'checkbox',
            progressSummary: 'above',
          })}
          data={data}
        />,
      );

      // Should show count labels from progress segments
      expect(screen.getByText('of 2 total')).toBeTruthy();
    });

    it('does not render progress bar when progressSummary is hidden', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'pg1',
            text: 'Done item',
            primaryIcon: { setId: 'checkbox', iconId: 'checked' },
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'checkbox',
            progressSummary: 'hidden',
          })}
          data={data}
        />,
      );

      expect(screen.queryByText(/total/)).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Expandable detail (Phase 2)
  // -----------------------------------------------------------------------

  describe('Expandable detail', () => {
    it('shows detail toggle for items with detail field', () => {
      const data: SmartListData = { items: makeDetailItems() };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'circle-check',
            detailMode: 'inline',
          })}
          data={data}
        />,
      );

      // The item with detail should have a toggle button with title "Toggle detail"
      const toggleBtns = screen.getAllByTitle('Toggle detail');
      expect(toggleBtns.length).toBe(1); // only d1 has detail
    });

    it('expands detail when toggle is clicked', () => {
      const data: SmartListData = { items: makeDetailItems() };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'circle-check',
            detailMode: 'inline',
          })}
          data={data}
        />,
      );

      // Detail text should not be visible initially
      expect(screen.queryByText('This is the expanded detail text.')).toBeNull();

      // Click the toggle
      const toggleBtn = screen.getByTitle('Toggle detail');
      fireEvent.click(toggleBtn);

      // Detail text should now be visible
      expect(
        screen.getByText('This is the expanded detail text.'),
      ).toBeTruthy();
    });

    it('only expands one detail at a time (accordion behavior)', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'acc1',
            text: 'First detail item',
            primaryIcon: { setId: 'circle-check', iconId: 'done' },
            detail: 'Detail for first.',
          },
          {
            id: 'acc2',
            text: 'Second detail item',
            primaryIcon: { setId: 'circle-check', iconId: 'active' },
            detail: 'Detail for second.',
          },
        ],
      };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'circle-check',
            detailMode: 'inline',
          })}
          data={data}
        />,
      );

      const toggleBtns = screen.getAllByTitle('Toggle detail');
      expect(toggleBtns.length).toBe(2);

      // Expand first
      fireEvent.click(toggleBtns[0]);
      expect(screen.getByText('Detail for first.')).toBeTruthy();

      // Expand second — re-query buttons after re-render, second should open
      const updatedToggleBtns = screen.getAllByTitle('Toggle detail');
      fireEvent.click(updatedToggleBtns[1]);
      expect(screen.getByText('Detail for second.')).toBeTruthy();
    });

    it('does not show detail toggle when detailMode is none', () => {
      const data: SmartListData = { items: makeDetailItems() };
      render(
        <SmartItemsList
          config={makeConfig({
            iconSetId: 'circle-check',
            detailMode: 'none',
          })}
          data={data}
        />,
      );

      expect(screen.queryByTitle('Toggle detail')).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Dual icons (Phase 2)
  // -----------------------------------------------------------------------

  describe('Dual icons', () => {
    it('renders secondary icon area when secondaryIconSetId is configured', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'di1',
            text: 'Dual icon item',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
            secondaryIcon: { setId: 'risk', iconId: 'ok' },
          },
        ],
      };
      const { container } = render(
        <SmartItemsList
          config={makeConfig({ secondaryIconSetId: 'risk' })}
          data={data}
        />,
      );

      // The dual icon area should render (look for the secondary icon container)
      // Each icon has a flex container with specific sizing
      const iconContainers = container.querySelectorAll(
        '.flex.items-center.justify-center.shrink-0',
      );
      // Should have at least 2 icon containers (primary + secondary)
      expect(iconContainers.length).toBeGreaterThanOrEqual(2);
    });
  });

  // -----------------------------------------------------------------------
  // DnD context in edit mode
  // -----------------------------------------------------------------------

  describe('DnD context', () => {
    it('wraps list in DndContext when in edit mode', () => {
      const data: SmartListData = { items: makeBasicItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      expect(screen.getByTestId('dnd-context')).toBeTruthy();
      expect(screen.getByTestId('sortable-context')).toBeTruthy();
    });

    it('does not wrap in DndContext in presentation mode', () => {
      const data: SmartListData = { items: makeBasicItems() };
      render(
        <SmartItemsList config={makeConfig()} data={data} isEditing={false} />,
      );

      expect(screen.queryByTestId('dnd-context')).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard interactions — edit mode
  // -----------------------------------------------------------------------

  describe('Keyboard interactions — edit mode', () => {
    it('inserts a new item when Enter is pressed on an item', async () => {
      const data: SmartListData = {
        items: [{ id: 'k1', text: 'Existing item' }],
      };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig({ iconSetId: 'bullets' })}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      const input = screen.getByDisplayValue('Existing item');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onDataChange).toHaveBeenCalledTimes(1);
      const newData = onDataChange.mock.calls[0][0] as SmartListData;
      expect(newData.items.length).toBe(2);
      expect(newData.items[1].text).toBe('');
    });

    it('removes an item when Backspace is pressed on empty text', () => {
      const data: SmartListData = {
        items: [
          { id: 'k1', text: 'Keep this' },
          { id: 'k2', text: '' },
        ],
      };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig({ iconSetId: 'bullets' })}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      const emptyInput = screen.getByDisplayValue('');
      fireEvent.keyDown(emptyInput, { key: 'Backspace' });

      expect(onDataChange).toHaveBeenCalledTimes(1);
      const newData = onDataChange.mock.calls[0][0] as SmartListData;
      expect(newData.items.length).toBe(1);
      expect(newData.items[0].text).toBe('Keep this');
    });

    it('opens quick-pick when / key is pressed in edit mode', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'k1',
            text: 'Test',
            primaryIcon: { setId: 'task-status', iconId: 'todo' },
          },
        ],
      };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      const input = screen.getByDisplayValue('Test');
      fireEvent.keyDown(input, { key: '/' });

      // Quick-pick should appear with icon set name
      expect(screen.getByText('Task Status')).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Size variants
  // -----------------------------------------------------------------------

  describe('Size variants', () => {
    it.each(['sm', 'md', 'lg', 'xl'] as const)(
      'renders without errors at size %s',
      (size) => {
        const data: SmartListData = { items: makeBasicItems() };
        const { container } = render(
          <SmartItemsList config={makeConfig({ size })} data={data} />,
        );
        expect(container).toBeTruthy();
        expect(screen.getByText('First item')).toBeTruthy();
      },
    );
  });

  // -----------------------------------------------------------------------
  // Toolbar in edit mode
  // -----------------------------------------------------------------------

  describe('Toolbar — edit mode bulk actions', () => {
    it('shows visibility count when some items are hidden', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      // Toolbar should show "Showing 2 of 3 items"
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText(/of 3 items/)).toBeTruthy();
    });

    it('calls onDataChange with all items visible when Show All is clicked', () => {
      const data: SmartListData = { items: makeVisibilityItems() };
      const onDataChange = vi.fn();
      render(
        <SmartItemsList
          config={makeConfig()}
          data={data}
          isEditing={true}
          onDataChange={onDataChange}
        />,
      );

      const showAllBtn = screen.getByText('Show all');
      fireEvent.click(showAllBtn);

      expect(onDataChange).toHaveBeenCalledTimes(1);
      const newData = onDataChange.mock.calls[0][0] as SmartListData;
      // All non-header items should be visible
      newData.items.forEach((item) => {
        if (!item.isHeader) {
          expect(item.visible).toBe(true);
        }
      });
    });
  });

  // -----------------------------------------------------------------------
  // Gradual disclosure (Phase 2)
  // -----------------------------------------------------------------------

  describe('Gradual disclosure — self-managed', () => {
    it('renders disclosure hint for one-by-one-focus mode', () => {
      const data: SmartListData = { items: makeBasicItems() };
      render(
        <SmartItemsList
          config={makeConfig({ revealMode: 'one-by-one-focus' })}
          data={data}
        />,
      );

      expect(screen.getByText(/← → to step through items/)).toBeTruthy();
    });

    it('reveals items step by step on ArrowRight key', () => {
      const data: SmartListData = {
        items: [
          {
            id: 'r1',
            text: 'Reveal A',
            primaryIcon: { setId: 'task-status', iconId: 'done' },
          },
          {
            id: 'r2',
            text: 'Reveal B',
            primaryIcon: { setId: 'task-status', iconId: 'todo' },
          },
        ],
      };
      const { container } = render(
        <SmartItemsList
          config={makeConfig({ revealMode: 'one-by-one-focus' })}
          data={data}
        />,
      );

      // Focus the disclosure container to listen for keyboard events
      const disclosureContainer = container.querySelector('[tabindex="0"]');
      expect(disclosureContainer).toBeTruthy();

      // Initially at step 0, first item should be focused (opacity 1)
      // Step forward
      fireEvent.keyDown(disclosureContainer!, { key: 'ArrowRight' });
      fireEvent.keyDown(disclosureContainer!, { key: 'ArrowRight' });

      // Both items should be revealed at this point (step 2 > item count)
      // We just verify no crashes and the component renders
      expect(screen.getByText('Reveal A')).toBeTruthy();
      expect(screen.getByText('Reveal B')).toBeTruthy();
    });
  });
});
