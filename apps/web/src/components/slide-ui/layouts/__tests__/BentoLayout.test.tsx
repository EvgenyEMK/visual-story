import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BentoLayout } from '../BentoLayout';
import type { BentoItem } from '../BentoLayout';
import { Rocket, Shield, Zap } from 'lucide-react';

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

describe('BentoLayout', () => {
  const mockItems: BentoItem[] = [
    { icon: Rocket, title: 'Rocket Launch', description: 'Fast and powerful', color: '#3b82f6' },
    { icon: Shield, title: 'Security Shield', description: 'Protect your data', color: '#10b981' },
    { icon: Zap, title: 'Lightning Fast', description: 'Instant results', color: '#f59e0b' },
  ];

  describe('Rendering basics', () => {
    it('renders all sidebar item titles', () => {
      render(<BentoLayout items={mockItems} />);
      expect(screen.getAllByText('Rocket Launch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Security Shield').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Lightning Fast').length).toBeGreaterThan(0);
    });

    it('shows the first item\'s title in the expanded area by default', () => {
      render(<BentoLayout items={mockItems} />);
      const descriptions = screen.getAllByText('Fast and powerful');
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('Interaction', () => {
    it('clicking a sidebar item calls onExpandChange with the new index', () => {
      const onExpandChange = vi.fn();
      const { container } = render(
        <BentoLayout items={mockItems} onExpandChange={onExpandChange} />,
      );

      // The sidebar items are motion.div elements with cursor-pointer class
      const sidebarCards = container.querySelectorAll('[class*="cursor-pointer"]');
      // Click the second sidebar item (index 1 = "Security Shield")
      expect(sidebarCards.length).toBe(3);
      fireEvent.click(sidebarCards[1]);

      expect(onExpandChange).toHaveBeenCalledWith(1);
    });

    it('clicking a sidebar item shows that item\'s title in the expanded area', () => {
      const { container } = render(<BentoLayout items={mockItems} />);

      // Click the second sidebar card
      const sidebarCards = container.querySelectorAll('[class*="cursor-pointer"]');
      fireEvent.click(sidebarCards[1]);

      // After clicking, the expanded area should show the second item's description
      const descriptions = screen.getAllByText('Protect your data');
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('Expanded layout variants', () => {
    it('with expandedLayout="two-column" and detailContent provided, renders the detail content', () => {
      const itemsWithDetail: BentoItem[] = [
        {
          icon: Rocket,
          title: 'Rocket Launch',
          description: 'Fast and powerful',
          color: '#3b82f6',
          detailContent: <div data-testid="detail-content">Custom detail content</div>,
        },
      ];

      render(<BentoLayout items={itemsWithDetail} expandedLayout="two-column" />);

      expect(screen.getByTestId('detail-content')).toBeTruthy();
      expect(screen.getByText('Custom detail content')).toBeTruthy();
    });

    it('with expandedLayout="simple" and no detailContent, renders description text', () => {
      render(<BentoLayout items={mockItems} expandedLayout="simple" />);

      const descriptions = screen.getAllByText('Fast and powerful');
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });
});
