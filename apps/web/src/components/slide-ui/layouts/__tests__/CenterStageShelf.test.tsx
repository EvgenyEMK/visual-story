import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CenterStageShelf } from '../CenterStageShelf';
import type { ShelfItem } from '../CenterStageShelf';
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

describe('CenterStageShelf', () => {
  const mockItems: ShelfItem[] = [
    { icon: Rocket, title: 'Rocket Launch', description: 'Fast and powerful', color: '#3b82f6' },
    { icon: Shield, title: 'Security Shield', description: 'Protect your data', color: '#10b981' },
    { icon: Zap, title: 'Lightning Fast', description: 'Instant results', color: '#f59e0b' },
    { icon: BarChart3, title: 'Analytics', description: 'Track performance', color: '#8b5cf6' },
  ];

  describe('Rendering basics', () => {
    it('renders all shelf item labels', () => {
      render(<CenterStageShelf items={mockItems} />);
      // Each item appears twice (shelf + center stage), so use getAllByText
      expect(screen.getAllByText('Rocket Launch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Security Shield').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Lightning Fast').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Analytics').length).toBeGreaterThan(0);
    });

    it('shows the first item\'s title in the center stage by default', () => {
      render(<CenterStageShelf items={mockItems} />);
      // The first item's title should appear in the HeroSpotlight component
      // Since there are multiple instances of "Rocket Launch" (one in shelf, one in center),
      // we check that it exists
      const titles = screen.getAllByText('Rocket Launch');
      expect(titles.length).toBeGreaterThan(0);
      // The center stage should show the first item's description
      const descriptions = screen.getAllByText('Fast and powerful');
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('Active item interaction', () => {
    it('clicking a shelf thumbnail changes the active spotlight', () => {
      const { container } = render(<CenterStageShelf items={mockItems} />);
      
      // Initially, first item should be active (Rocket Launch)
      const initialDescriptions = screen.getAllByText('Fast and powerful');
      expect(initialDescriptions.length).toBeGreaterThan(0);
      
      // Find the second item's label in the shelf - look for the one in the shelf (has cursor-pointer parent)
      const shieldLabels = screen.getAllByText('Security Shield');
      const shelfItem = shieldLabels.find(label => {
        const parent = label.closest('div.cursor-pointer');
        return parent !== null;
      });
      
      if (shelfItem) {
        const clickableDiv = shelfItem.closest('div.cursor-pointer');
        if (clickableDiv) {
          fireEvent.click(clickableDiv);
        } else {
          fireEvent.click(shelfItem);
        }
      } else {
        // Fallback: click the first label found
        fireEvent.click(shieldLabels[0]);
      }
      
      // After clicking, the center stage should show the second item's content
      const newDescriptions = screen.getAllByText('Protect your data');
      expect(newDescriptions.length).toBeGreaterThan(0);
    });

    it('respects defaultActive prop - renders the specified item initially', () => {
      render(<CenterStageShelf items={mockItems} defaultActive={2} />);
      
      // The third item (index 2) should be active initially
      const descriptions = screen.getAllByText('Instant results');
      expect(descriptions.length).toBeGreaterThan(0);
      // The title should also be visible in the center stage
      const titles = screen.getAllByText('Lightning Fast');
      expect(titles.length).toBeGreaterThan(0);
    });
  });
});
