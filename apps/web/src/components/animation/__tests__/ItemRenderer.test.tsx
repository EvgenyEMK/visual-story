import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { isHtmlContent, ItemRenderer } from '../ItemRenderer';
import type { SlideItem, AtomItem } from '@/types/slide';

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
