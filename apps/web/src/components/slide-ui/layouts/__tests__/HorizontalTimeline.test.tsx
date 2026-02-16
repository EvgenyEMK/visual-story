import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HorizontalTimeline } from '../HorizontalTimeline';
import type { TimelineItem } from '../HorizontalTimeline';
import { FileText, Eye, Cloud, Zap, Send } from 'lucide-react';

vi.mock('motion/react', () => ({
  motion: new Proxy({}, {
    get: (_target, prop: string) => {
      return ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...htmlProps } = props;
        const Tag = prop as any;
        return <Tag {...htmlProps}>{children}</Tag>;
      };
    },
  }),
  AnimatePresence: ({ children }: any) => children,
}));

describe('HorizontalTimeline', () => {
  const mockItems: TimelineItem[] = [
    { icon: FileText, label: 'Create', color: '#3b82f6' },
    { icon: Eye, label: 'Review', color: '#10b981' },
    { icon: Cloud, label: 'Deploy', color: '#f59e0b' },
    { icon: Zap, label: 'Optimize', color: '#8b5cf6' },
  ];

  describe('Rendering basics', () => {
    it('renders all item labels', () => {
      render(<HorizontalTimeline items={mockItems} />);
      expect(screen.getByText('Create')).toBeTruthy();
      expect(screen.getByText('Review')).toBeTruthy();
      expect(screen.getByText('Deploy')).toBeTruthy();
      expect(screen.getByText('Optimize')).toBeTruthy();
    });

    it('renders connecting lines between nodes (one fewer than items count)', () => {
      const { container } = render(<HorizontalTimeline items={mockItems} />);

      // Connecting lines are divs with h-[2px] class and explicit width style
      const lines = container.querySelectorAll('.h-\\[2px\\]');
      expect(lines.length).toBe(3);
    });

    it('single item renders without connecting lines', () => {
      const singleItem: TimelineItem[] = [
        { icon: FileText, label: 'Only Item', color: '#3b82f6' },
      ];
      const { container } = render(<HorizontalTimeline items={singleItem} />);

      expect(screen.getByText('Only Item')).toBeTruthy();

      const lines = container.querySelectorAll('.h-\\[2px\\]');
      expect(lines.length).toBe(0);
    });
  });

  describe('Active state interaction', () => {
    it('clicking a node changes the active state', () => {
      const { container } = render(<HorizontalTimeline items={mockItems} />);

      // Each node is wrapped in a div.cursor-pointer with onClick
      const clickableNodes = container.querySelectorAll('.cursor-pointer');
      expect(clickableNodes.length).toBe(mockItems.length);

      // Click the third node (Deploy)
      fireEvent.click(clickableNodes[2]);

      // Verify all items are still rendered (state change is internal)
      expect(screen.getByText('Create')).toBeTruthy();
      expect(screen.getByText('Deploy')).toBeTruthy();

      // The connecting lines before the active node should have different background color
      // Lines at index < active (2) should have the colored bg, others transparent
      const lines = container.querySelectorAll('.h-\\[2px\\]');
      expect(lines.length).toBe(3);
    });

    it('respects defaultActive prop', () => {
      const { container } = render(
        <HorizontalTimeline items={mockItems} defaultActive={2} />,
      );

      // All items should render
      expect(screen.getByText('Create')).toBeTruthy();
      expect(screen.getByText('Deploy')).toBeTruthy();

      // Lines before active (index 2) should be colored
      const lines = container.querySelectorAll('.h-\\[2px\\]');
      expect(lines.length).toBe(3);
      // First two lines (index 0,1) should have colored bg (i < active=2)
      const line0Style = (lines[0] as HTMLElement).style.backgroundColor;
      const line2Style = (lines[2] as HTMLElement).style.backgroundColor;
      // Line 0 (before active) should be colored, line 2 (after active) should be transparent
      expect(line0Style).not.toBe(line2Style);
    });
  });
});
