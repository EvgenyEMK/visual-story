import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GridOfCards } from '../GridOfCards';
import type { GridItem } from '../GridOfCards';
import { Rocket, Shield, Zap, BarChart3 } from 'lucide-react';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: new Proxy({}, {
    get: (_target, prop: string) => {
      // Return a forwardRef component that renders the HTML element
      return ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...htmlProps } = props;
        const Tag = prop as any;
        return <Tag {...htmlProps}>{children}</Tag>;
      };
    },
  }),
  AnimatePresence: ({ children }: any) => children,
}));

describe('GridOfCards', () => {
  const mockItems: GridItem[] = [
    { icon: Rocket, title: 'Rocket Launch', description: 'Fast and powerful', color: '#3b82f6' },
    { icon: Shield, title: 'Security Shield', description: 'Protect your data', color: '#10b981' },
    { icon: Zap, title: 'Lightning Fast', description: 'Instant results', color: '#f59e0b' },
    { icon: BarChart3, title: 'Analytics', description: 'Track performance', color: '#8b5cf6' },
  ];

  describe('Rendering basics', () => {
    it('renders correct number of cards matching items count', () => {
      render(<GridOfCards items={mockItems} />);
      expect(screen.getByText('Rocket Launch')).toBeTruthy();
      expect(screen.getByText('Security Shield')).toBeTruthy();
      expect(screen.getByText('Lightning Fast')).toBeTruthy();
      expect(screen.getByText('Analytics')).toBeTruthy();
    });

    it('displays each item\'s title text', () => {
      const items: GridItem[] = [
        { icon: Rocket, title: 'First Item' },
        { icon: Shield, title: 'Second Item' },
      ];
      render(<GridOfCards items={items} />);
      expect(screen.getByText('First Item')).toBeTruthy();
      expect(screen.getByText('Second Item')).toBeTruthy();
    });

    it('renders with empty items array without crashing', () => {
      const { container } = render(<GridOfCards items={[]} />);
      expect(container).toBeTruthy();
    });
  });

  describe('Column calculation', () => {
    it('auto-calculates 2 columns for 2 items', () => {
      const items: GridItem[] = [
        { icon: Rocket, title: 'Item 1' },
        { icon: Shield, title: 'Item 2' },
      ];
      const { container } = render(<GridOfCards items={items} />);
      const gridElement = container.querySelector('.grid') as HTMLElement;
      expect(gridElement).toBeTruthy();
      // Check inline style attribute
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    });

    it('auto-calculates 2 columns for 4 items', () => {
      const items: GridItem[] = [
        { icon: Rocket, title: 'Item 1' },
        { icon: Shield, title: 'Item 2' },
        { icon: Zap, title: 'Item 3' },
        { icon: BarChart3, title: 'Item 4' },
      ];
      const { container } = render(<GridOfCards items={items} />);
      const gridElement = container.querySelector('.grid') as HTMLElement;
      expect(gridElement).toBeTruthy();
      // Check inline style attribute
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    });

    it('auto-calculates 3 columns for 6 items', () => {
      const items: GridItem[] = [
        { icon: Rocket, title: 'Item 1' },
        { icon: Shield, title: 'Item 2' },
        { icon: Zap, title: 'Item 3' },
        { icon: BarChart3, title: 'Item 4' },
        { icon: Rocket, title: 'Item 5' },
        { icon: Shield, title: 'Item 6' },
      ];
      const { container } = render(<GridOfCards items={items} />);
      const gridElement = container.querySelector('.grid') as HTMLElement;
      expect(gridElement).toBeTruthy();
      // Check inline style attribute
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    });

    it('uses explicit columns prop when provided', () => {
      const { container } = render(<GridOfCards items={mockItems} columns={5} />);
      const gridElement = container.querySelector('.grid') as HTMLElement;
      expect(gridElement).toBeTruthy();
      // Check inline style attribute
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(5, minmax(0, 1fr))');
    });
  });

  describe('Card variant', () => {
    it('passes cardVariant through - card variant adds bg/border classes', () => {
      const { container } = render(
        <GridOfCards items={mockItems.slice(0, 1)} cardVariant="card" />
      );
      // Find the card element - IconTitleCard with variant="card" should have bg-white/5 and border classes
      // The card variant adds: 'rounded-[0.75em] bg-white/5 border border-white/10'
      const cardElement = container.querySelector('.bg-white\\/5');
      expect(cardElement).toBeTruthy();
      expect(cardElement?.classList.contains('border')).toBe(true);
    });

    it('icon-title variant does not add card background/border', () => {
      const { container } = render(
        <GridOfCards items={mockItems.slice(0, 1)} cardVariant="icon-title" />
      );
      // icon-title variant should not have bg-white/5
      const cardElement = container.querySelector('.bg-white\\/5');
      expect(cardElement).toBeFalsy();
    });
  });
});
