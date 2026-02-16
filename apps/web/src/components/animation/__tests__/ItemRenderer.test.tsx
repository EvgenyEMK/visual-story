import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { isHtmlContent, ItemRenderer } from '../ItemRenderer';
import type { SlideItem, AtomItem, CardItem, LayoutItem } from '@/types/slide';

// =============================================================================
// isHtmlContent — unit tests
// =============================================================================

describe('isHtmlContent', () => {
  it('returns false for plain text', () => {
    expect(isHtmlContent('Hello World')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isHtmlContent('')).toBe(false);
  });

  it('returns false for text with special chars but no HTML', () => {
    expect(isHtmlContent('Price: $50 & tax < 10%')).toBe(false);
  });

  it('returns true for a simple <p> wrapper', () => {
    expect(isHtmlContent('<p>Hello World</p>')).toBe(true);
  });

  it('returns true for bold text in paragraph', () => {
    expect(isHtmlContent('<p><strong>Hello</strong> World</p>')).toBe(true);
  });

  it('returns true for italic text', () => {
    expect(isHtmlContent('<em>emphasized</em>')).toBe(true);
  });

  it('returns true for nested HTML from Tiptap', () => {
    expect(
      isHtmlContent(
        '<p><strong>Title</strong></p><p>Body text with <em>italic</em></p>',
      ),
    ).toBe(true);
  });

  it('returns true for a <br> tag', () => {
    expect(isHtmlContent('Line one<br>Line two')).toBe(true);
  });

  it('returns true for underline tag', () => {
    expect(isHtmlContent('<u>underlined</u>')).toBe(true);
  });
});

// =============================================================================
// Helpers — build minimal AtomItem fixtures
// =============================================================================

function makeTextAtom(
  content: string,
  overrides?: Partial<AtomItem>,
): AtomItem {
  return {
    id: overrides?.id ?? 'text-1',
    type: 'atom',
    atomType: 'text',
    content,
    ...overrides,
  } as AtomItem;
}

// =============================================================================
// ItemRenderer — text atom rendering (HTML vs plain text)
// =============================================================================

describe('ItemRenderer — text atom rendering', () => {
  it('renders plain text content as-is (no dangerouslySetInnerHTML)', () => {
    const items: SlideItem[] = [makeTextAtom('Hello World')];

    const { container } = render(<ItemRenderer items={items} />);

    // Should render the text in a <span> element (plain text path)
    const span = container.querySelector('span');
    expect(span).toBeTruthy();
    expect(span!.textContent).toBe('Hello World');
    // Should NOT have inner HTML with tags
    expect(span!.innerHTML).toBe('Hello World');
  });

  it('renders HTML content using dangerouslySetInnerHTML', () => {
    const htmlContent = '<p><strong>Bold Title</strong></p>';
    const items: SlideItem[] = [makeTextAtom(htmlContent)];

    const { container } = render(<ItemRenderer items={items} />);

    // Should render HTML inside a <div> (HTML path uses div, not span)
    const strong = container.querySelector('strong');
    expect(strong).toBeTruthy();
    expect(strong!.textContent).toBe('Bold Title');

    // The <p> tag should be present (rendered as HTML, not as text)
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeTruthy();
  });

  it('does NOT show raw HTML tags as visible text', () => {
    const htmlContent = '<p><strong>Styled</strong> text</p>';
    const items: SlideItem[] = [makeTextAtom(htmlContent)];

    const { container } = render(<ItemRenderer items={items} />);

    // The visible text should be "Styled text", not "<p><strong>Styled</strong> text</p>"
    const textContent = container.textContent;
    expect(textContent).toContain('Styled');
    expect(textContent).toContain('text');
    expect(textContent).not.toContain('<p>');
    expect(textContent).not.toContain('<strong>');
    expect(textContent).not.toContain('</p>');
  });

  it('renders Tiptap italic output correctly', () => {
    const htmlContent = '<p><em>Italic text</em></p>';
    const items: SlideItem[] = [makeTextAtom(htmlContent)];

    const { container } = render(<ItemRenderer items={items} />);

    const em = container.querySelector('em');
    expect(em).toBeTruthy();
    expect(em!.textContent).toBe('Italic text');
  });

  it('renders multi-paragraph Tiptap output correctly', () => {
    const htmlContent = '<p>First paragraph</p><p>Second paragraph</p>';
    const items: SlideItem[] = [makeTextAtom(htmlContent)];

    const { container } = render(<ItemRenderer items={items} />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].textContent).toBe('First paragraph');
    expect(paragraphs[1].textContent).toBe('Second paragraph');
  });

  it('renders plain text with newlines using pre-line whitespace', () => {
    const items: SlideItem[] = [makeTextAtom('Line one\nLine two')];

    const { container } = render(<ItemRenderer items={items} />);

    const span = container.querySelector('span');
    expect(span).toBeTruthy();
    expect(span!.style.whiteSpace).toBe('pre-line');
    expect(span!.textContent).toBe('Line one\nLine two');
  });

  it('HTML text atom applies paragraph margin reset class', () => {
    const htmlContent = '<p>Hello</p>';
    const items: SlideItem[] = [makeTextAtom(htmlContent, { id: 'html-atom' })];

    const { container } = render(<ItemRenderer items={items} />);

    // The wrapping motion.div contains a child div for the HTML content.
    // That child div should have the Tailwind class that resets <p> margins.
    const atomEl = container.querySelector('[data-item-id="html-atom"]') as HTMLElement;
    const htmlDiv = atomEl.querySelector('div');
    expect(htmlDiv).toBeTruthy();
    expect(htmlDiv!.className).toContain('[&_p]:m-0');
  });
});

// =============================================================================
// ItemRenderer — editing interaction: selecting items
// =============================================================================

describe('ItemRenderer — editing: item selection', () => {
  it('calls onItemSelect when clicking on a text atom', () => {
    const onItemSelect = vi.fn();
    const items: SlideItem[] = [makeTextAtom('Click me', { id: 'atom-a' })];

    const { container } = render(
      <ItemRenderer
        items={items}
        onItemSelect={onItemSelect}
      />,
    );

    // Click the item
    const atomDiv = container.querySelector('[data-item-id="atom-a"]') as HTMLElement;
    expect(atomDiv).toBeTruthy();
    fireEvent.click(atomDiv);

    expect(onItemSelect).toHaveBeenCalledWith('atom-a');
  });

  it('calls onItemSelect(null) when clicking on the root (deselect)', () => {
    const onItemSelect = vi.fn();
    const items: SlideItem[] = [makeTextAtom('Hello')];

    const { container } = render(
      <ItemRenderer
        items={items}
        onItemSelect={onItemSelect}
      />,
    );

    // Click the root container (not on an item)
    const root = container.firstElementChild as HTMLElement;
    fireEvent.click(root);

    expect(onItemSelect).toHaveBeenCalledWith(null);
  });

  it('calls onItemEditStart on double-click of a text atom', () => {
    const onItemEditStart = vi.fn();
    const onItemSelect = vi.fn();
    const items: SlideItem[] = [makeTextAtom('Double click me', { id: 'atom-b' })];

    const { container } = render(
      <ItemRenderer
        items={items}
        onItemSelect={onItemSelect}
        onItemEditStart={onItemEditStart}
      />,
    );

    const atomDiv = container.querySelector('[data-item-id="atom-b"]') as HTMLElement;
    fireEvent.doubleClick(atomDiv);

    expect(onItemEditStart).toHaveBeenCalledWith('atom-b');
  });

  it('shows selection ring on the selected item', () => {
    const items: SlideItem[] = [
      makeTextAtom('A', { id: 'atom-a' }),
      makeTextAtom('B', { id: 'atom-b' }),
    ];

    const { container } = render(
      <ItemRenderer
        items={items}
        selectedItemId="atom-a"
        onItemSelect={() => {}}
      />,
    );

    const atomA = container.querySelector('[data-item-id="atom-a"]') as HTMLElement;
    const atomB = container.querySelector('[data-item-id="atom-b"]') as HTMLElement;

    expect(atomA.className).toContain('ring-2');
    expect(atomB.className).not.toContain('ring-2');
  });
});

// =============================================================================
// ItemRenderer — switching between elements preserves content display
// =============================================================================

describe('ItemRenderer — content preserved across element switch', () => {
  it('after editing, HTML content is rendered properly (not as raw tags)', () => {
    // Simulate: atom-a was edited (content is now HTML), atom-b is selected
    const items: SlideItem[] = [
      makeTextAtom('<p><strong>Edited Bold</strong></p>', { id: 'atom-a' }),
      makeTextAtom('Plain text B', { id: 'atom-b' }),
    ];

    const { container } = render(
      <ItemRenderer
        items={items}
        selectedItemId="atom-b"
        onItemSelect={() => {}}
      />,
    );

    // atom-a should show rendered bold text, not raw HTML
    const atomA = container.querySelector('[data-item-id="atom-a"]') as HTMLElement;
    expect(atomA.textContent).toContain('Edited Bold');
    expect(atomA.textContent).not.toContain('<strong>');
    expect(atomA.textContent).not.toContain('<p>');

    // Should have a <strong> element inside
    expect(atomA.querySelector('strong')).toBeTruthy();

    // atom-b should show plain text
    const atomB = container.querySelector('[data-item-id="atom-b"]') as HTMLElement;
    expect(atomB.textContent).toBe('Plain text B');
  });

  it('mixed HTML and plain text atoms render correctly side by side', () => {
    const items: SlideItem[] = [
      makeTextAtom('<p><em>Italic</em> intro</p>', { id: 'html-item' }),
      makeTextAtom('Plain label', { id: 'plain-item' }),
      makeTextAtom('<p>Paragraph <u>underlined</u></p>', { id: 'html-item-2' }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    // HTML items render tags as DOM
    expect(container.querySelector('[data-item-id="html-item"] em')).toBeTruthy();
    expect(container.querySelector('[data-item-id="html-item-2"] u')).toBeTruthy();

    // Plain item has no HTML tags
    const plainEl = container.querySelector('[data-item-id="plain-item"]') as HTMLElement;
    expect(plainEl.querySelector('p')).toBeNull();
    expect(plainEl.textContent).toBe('Plain label');
  });
});

// =============================================================================
// Helpers — build layout & card fixtures
// =============================================================================

function makeCard(
  id: string,
  children: SlideItem[],
  overrides?: Partial<Omit<CardItem, 'id' | 'type' | 'children'>>,
): CardItem {
  return { id, type: 'card', children, ...overrides };
}

function makeLayout(
  id: string,
  layoutType: LayoutItem['layoutType'],
  children: SlideItem[],
  overrides?: Partial<Omit<LayoutItem, 'id' | 'type' | 'layoutType' | 'children'>>,
): LayoutItem {
  return { id, type: 'layout', layoutType, children, ...overrides };
}

// =============================================================================
// ItemRenderer — layout: flex-row equal distribution
// =============================================================================

describe('ItemRenderer — flex-row layouts force equal-width children', () => {
  it('two cards in a flex-row layout get flex: 1 1 0% wrappers', () => {
    const items: SlideItem[] = [
      makeLayout('row', 'flex', [
        makeCard('left', [makeTextAtom('Left', { id: 'left-text' })]),
        makeCard('right', [makeTextAtom('Right', { id: 'right-text' })]),
      ], { layoutConfig: { direction: 'row', gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;
    expect(layoutDiv).toBeTruthy();

    // Children should be wrapped in equal-flex divs
    const wrappers = layoutDiv.children;
    expect(wrappers.length).toBe(2);
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper = wrappers[i] as HTMLElement;
      expect(wrapper.style.flex).toBe('1 1 0%');
      expect(wrapper.style.minWidth).toBe('0');
    }
  });

  it('three cards in a flex-row layout each get 1/3 flex wrappers', () => {
    const items: SlideItem[] = [
      makeLayout('row-3', 'flex', [
        makeCard('c1', [makeTextAtom('A', { id: 'a' })]),
        makeCard('c2', [makeTextAtom('B', { id: 'b' })]),
        makeCard('c3', [makeTextAtom('C', { id: 'c' })]),
      ], { layoutConfig: { direction: 'row', gap: 20 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="row-3"]') as HTMLElement;
    const wrappers = layoutDiv.children;
    expect(wrappers.length).toBe(3);
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper = wrappers[i] as HTMLElement;
      expect(wrapper.style.flex).toBe('1 1 0%');
    }
  });

  it('flex-row with atom children does NOT apply equal-width wrappers', () => {
    // Utility layout: icon + text in a row — should NOT get flex:1
    const items: SlideItem[] = [
      makeLayout('icon-row', 'flex', [
        { id: 'icon', type: 'atom', atomType: 'icon', content: '🚀' } as AtomItem,
        makeTextAtom('Label', { id: 'label' }),
      ], { layoutConfig: { direction: 'row', gap: 6, align: 'center' } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="icon-row"]') as HTMLElement;
    // Children should be rendered directly (no flex-wrapper divs)
    // Check that the first child is the atom, not a wrapper
    const firstChild = layoutDiv.children[0] as HTMLElement;
    expect(firstChild.dataset.itemId).toBe('icon');
  });

  it('flex-column (stack) layout does NOT apply equal-width wrappers', () => {
    const items: SlideItem[] = [
      makeLayout('stack', 'stack', [
        makeCard('c1', [makeTextAtom('A', { id: 'a' })]),
        makeCard('c2', [makeTextAtom('B', { id: 'b' })]),
      ], { layoutConfig: { direction: 'column', gap: 8 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="stack"]') as HTMLElement;
    const firstChild = layoutDiv.children[0] as HTMLElement;
    // Should be the card directly, not a wrapper div
    expect(firstChild.dataset.itemId).toBe('c1');
  });
});

// =============================================================================
// ItemRenderer — grid layout
// =============================================================================

describe('ItemRenderer — grid layout', () => {
  it('grid layout uses CSS grid with repeat(N, minmax(0, 1fr))', () => {
    const items: SlideItem[] = [
      makeLayout('grid-2x2', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
        makeCard('g3', [makeTextAtom('3', { id: 't3' })]),
        makeCard('g4', [makeTextAtom('4', { id: 't4' })]),
      ], { layoutConfig: { columns: 2, gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid-2x2"]') as HTMLElement;
    expect(gridDiv.style.display).toBe('grid');
    expect(gridDiv.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('grid children are rendered directly (no wrapper div)', () => {
    const items: SlideItem[] = [
      makeLayout('grid', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
      ], { layoutConfig: { columns: 2 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid"]') as HTMLElement;
    const firstChild = gridDiv.children[0] as HTMLElement;
    expect(firstChild.dataset.itemId).toBe('g1');
  });
});

// =============================================================================
// ItemRenderer — card hover: NO scale zoom effect
// =============================================================================

describe('ItemRenderer — cards have no hover zoom', () => {
  it('card motion.div does not have whileHover scale property', () => {
    const items: SlideItem[] = [
      makeCard('card-1', [makeTextAtom('Content', { id: 'text' })]),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const cardDiv = container.querySelector('[data-item-id="card-1"]') as HTMLElement;
    expect(cardDiv).toBeTruthy();
    // motion.div applies whileHover styles via data attributes; the absence of
    // a scale transform when not focused verifies no hover zoom is configured.
    const transform = cardDiv.style.transform;
    expect(transform).not.toContain('scale');
  });
});

// =============================================================================
// ItemRenderer — sidebar layout
// =============================================================================

describe('ItemRenderer — sidebar layout', () => {
  it('first child gets fixed width, second child gets flex:1', () => {
    const items: SlideItem[] = [
      makeLayout('sidebar', 'sidebar', [
        makeLayout('nav', 'stack', [
          makeCard('n1', [makeTextAtom('Item 1', { id: 'n1t' })]),
        ]),
        makeCard('detail', [makeTextAtom('Detail', { id: 'dt' })]),
      ], { layoutConfig: { sidebarWidth: '200px' } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const sidebarDiv = container.querySelector('[data-item-id="sidebar"]') as HTMLElement;
    expect(sidebarDiv).toBeTruthy();

    // First direct child should have fixed width
    const firstChild = sidebarDiv.children[0] as HTMLElement;
    expect(firstChild.style.width).toBe('200px');
    expect(firstChild.style.flexShrink).toBe('0');

    // Second direct child should flex to fill remaining space
    const secondChild = sidebarDiv.children[1] as HTMLElement;
    expect(secondChild.style.flex).toContain('1');
  });
});

// =============================================================================
// ItemRenderer — flex-row wrapper uses CSS grid for content filling
// =============================================================================

describe('ItemRenderer — flex-row wrapper uses CSS grid', () => {
  it('equal-flex wrapper uses display:grid (default stretch fills cell)', () => {
    const items: SlideItem[] = [
      makeLayout('row', 'flex', [
        makeCard('left', [makeTextAtom('Left', { id: 'lt' })]),
        makeCard('right', [makeTextAtom('Right', { id: 'rt' })]),
      ], { layoutConfig: { direction: 'row', gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;
    const wrapper = layoutDiv.children[0] as HTMLElement;

    // Wrapper uses CSS grid — default grid placement is stretch so child fills cell
    expect(wrapper.style.display).toBe('grid');
    expect(wrapper.style.flex).toBe('1 1 0%');
    expect(wrapper.style.minWidth).toBe('0');
    expect(wrapper.style.minHeight).toBe('0');
    // No placeItems — CSS grid default stretch lets card fill the wrapper
    expect(wrapper.style.placeItems).toBe('');
  });

  it('card is direct child of grid wrapper (fills cell via grid stretch)', () => {
    const items: SlideItem[] = [
      makeLayout('row', 'flex', [
        makeCard('c1', [makeTextAtom('A', { id: 'a' })]),
        makeCard('c2', [makeTextAtom('B', { id: 'b' })]),
      ], { layoutConfig: { direction: 'row', gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;
    const wrapper = layoutDiv.children[0] as HTMLElement;
    const card = wrapper.querySelector('[data-item-id="c1"]') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.parentElement).toBe(wrapper);
  });
});

// =============================================================================
// ItemRenderer — Two-column 50/50 enforces equal width + full height
// =============================================================================

describe('ItemRenderer — two-column 50/50 layout enforcement', () => {
  const twoColItems = (): SlideItem[] => [
    makeLayout('row', 'flex', [
      makeCard('left', [makeTextAtom('Left content', { id: 'lt' })]),
      makeCard('right', [makeTextAtom('Right content', { id: 'rt' })]),
    ], { layoutConfig: { direction: 'row', gap: 20, align: 'stretch' } }),
  ];

  it('layout container has width:100%, height:100%, and align-items:stretch', () => {
    const { container } = render(<ItemRenderer items={twoColItems()} />);
    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;

    expect(layoutDiv.style.width).toBe('100%');
    expect(layoutDiv.style.height).toBe('100%');
    expect(layoutDiv.style.display).toBe('flex');
    expect(layoutDiv.style.flexDirection).toBe('row');
    // stretch = columns fill full available height
    expect(layoutDiv.style.alignItems).toBe('stretch');
  });

  it('both wrappers get flex:1 1 0% for exactly 50% width each', () => {
    const { container } = render(<ItemRenderer items={twoColItems()} />);
    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;

    const firstWrapper = layoutDiv.children[0] as HTMLElement;
    const secondWrapper = layoutDiv.children[1] as HTMLElement;

    // flex: 1 1 0% ensures equal distribution regardless of content
    expect(firstWrapper.style.flex).toBe('1 1 0%');
    expect(secondWrapper.style.flex).toBe('1 1 0%');
    // minWidth:0 prevents content from overriding the 50% split
    expect(firstWrapper.style.minWidth).toBe('0');
    expect(secondWrapper.style.minWidth).toBe('0');
  });

  it('wrappers use display:grid (CSS grid stretch fills card to full cell)', () => {
    const { container } = render(<ItemRenderer items={twoColItems()} />);
    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;

    const firstWrapper = layoutDiv.children[0] as HTMLElement;
    const secondWrapper = layoutDiv.children[1] as HTMLElement;

    // Grid with no placeItems → default stretch → card fills wrapper
    expect(firstWrapper.style.display).toBe('grid');
    expect(secondWrapper.style.display).toBe('grid');
    expect(firstWrapper.style.placeItems).toBe('');
    expect(secondWrapper.style.placeItems).toBe('');
  });

  it('cards are direct children of their wrappers', () => {
    const { container } = render(<ItemRenderer items={twoColItems()} />);
    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;

    const leftCard = container.querySelector('[data-item-id="left"]') as HTMLElement;
    const rightCard = container.querySelector('[data-item-id="right"]') as HTMLElement;

    expect(leftCard.parentElement).toBe(layoutDiv.children[0]);
    expect(rightCard.parentElement).toBe(layoutDiv.children[1]);
  });

  it('three cards in a flex-row each get equal flex:1 1 0% wrappers', () => {
    const items: SlideItem[] = [
      makeLayout('row3', 'flex', [
        makeCard('a', [makeTextAtom('A', { id: 'ta' })]),
        makeCard('b', [makeTextAtom('B', { id: 'tb' })]),
        makeCard('c', [makeTextAtom('C', { id: 'tc' })]),
      ], { layoutConfig: { direction: 'row', gap: 16, align: 'stretch' } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);
    const layoutDiv = container.querySelector('[data-item-id="row3"]') as HTMLElement;

    expect(layoutDiv.children).toHaveLength(3);
    for (let i = 0; i < 3; i++) {
      const w = layoutDiv.children[i] as HTMLElement;
      expect(w.style.flex).toBe('1 1 0%');
      expect(w.style.display).toBe('grid');
    }
  });
});

// =============================================================================
// ItemRenderer — flex-row with align:center centers children vertically
// =============================================================================

describe('ItemRenderer — flex-row vertical centering (center-stage)', () => {
  it('layout with align:center sets align-items:center on the container', () => {
    const items: SlideItem[] = [
      makeLayout('cs3', 'flex', [
        makeCard('p1', [makeTextAtom('A', { id: 'a' })]),
        makeCard('p2', [makeTextAtom('B', { id: 'b' })]),
        makeCard('p3', [makeTextAtom('C', { id: 'c' })]),
      ], { layoutConfig: { direction: 'row', gap: 20, align: 'center', justify: 'center' } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="cs3"]') as HTMLElement;
    expect(layoutDiv.style.alignItems).toBe('center');
    expect(layoutDiv.style.justifyContent).toBe('center');
  });

  it('layout without explicit align defaults to center alignment', () => {
    const items: SlideItem[] = [
      makeLayout('row', 'flex', [
        makeCard('c1', [makeTextAtom('A', { id: 'a' })]),
        makeCard('c2', [makeTextAtom('B', { id: 'b' })]),
      ], { layoutConfig: { direction: 'row', gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;
    // Default centering: alignItems should be 'center'
    expect(layoutDiv.style.alignItems).toBe('center');
    expect(layoutDiv.style.justifyContent).toBe('center');
  });

  it('layout with explicit align:stretch overrides default center', () => {
    const items: SlideItem[] = [
      makeLayout('row', 'flex', [
        makeCard('c1', [makeTextAtom('A', { id: 'a' })]),
        makeCard('c2', [makeTextAtom('B', { id: 'b' })]),
      ], { layoutConfig: { direction: 'row', gap: 16, align: 'stretch' } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const layoutDiv = container.querySelector('[data-item-id="row"]') as HTMLElement;
    expect(layoutDiv.style.alignItems).toBe('stretch');
  });
});

// =============================================================================
// ItemRenderer — grid layout distributes row height evenly
// =============================================================================

describe('ItemRenderer — grid rows fill available height', () => {
  it('grid layout sets gridAutoRows to distribute height evenly', () => {
    const items: SlideItem[] = [
      makeLayout('grid', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
        makeCard('g3', [makeTextAtom('3', { id: 't3' })]),
        makeCard('g4', [makeTextAtom('4', { id: 't4' })]),
      ], { layoutConfig: { columns: 2, gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid"]') as HTMLElement;
    expect(gridDiv.style.gridAutoRows).toBe('minmax(0, 1fr)');
  });

  it('grid layout with explicit rows also has gridAutoRows fallback', () => {
    const items: SlideItem[] = [
      makeLayout('grid', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
        makeCard('g3', [makeTextAtom('3', { id: 't3' })]),
        makeCard('g4', [makeTextAtom('4', { id: 't4' })]),
      ], { layoutConfig: { columns: 2, rows: 2, gap: 16 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid"]') as HTMLElement;
    expect(gridDiv.style.gridTemplateRows).toBe('repeat(2, minmax(0, 1fr))');
    expect(gridDiv.style.gridAutoRows).toBe('minmax(0, 1fr)');
  });

  it('grid layout container has height:100% and width:100%', () => {
    const items: SlideItem[] = [
      makeLayout('grid', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
      ], { layoutConfig: { columns: 2 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid"]') as HTMLElement;
    expect(gridDiv.style.width).toBe('100%');
    expect(gridDiv.style.height).toBe('100%');
  });

  it('grid layout defaults to center alignment within cells', () => {
    const items: SlideItem[] = [
      makeLayout('grid', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
      ], { layoutConfig: { columns: 2 } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid"]') as HTMLElement;
    expect(gridDiv.style.alignItems).toBe('center');
    expect(gridDiv.style.justifyItems).toBe('center');
  });

  it('grid layout with explicit align/justify overrides default center', () => {
    const items: SlideItem[] = [
      makeLayout('grid', 'grid', [
        makeCard('g1', [makeTextAtom('1', { id: 't1' })]),
        makeCard('g2', [makeTextAtom('2', { id: 't2' })]),
      ], { layoutConfig: { columns: 2, align: 'start', justify: 'end' } }),
    ];

    const { container } = render(<ItemRenderer items={items} />);

    const gridDiv = container.querySelector('[data-item-id="grid"]') as HTMLElement;
    expect(gridDiv.style.alignItems).toBe('flex-start');
    expect(gridDiv.style.justifyItems).toBe('flex-end');
  });
});
