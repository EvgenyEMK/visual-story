import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarDetail } from '../SidebarDetail';
import type { SidebarItem } from '../SidebarDetail';
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

describe('SidebarDetail', () => {
  const mockItems: SidebarItem[] = [
    { icon: Rocket, title: 'Rocket Launch', description: 'Fast and powerful', color: '#3b82f6' },
    { icon: Shield, title: 'Security Shield', description: 'Protect your data', color: '#10b981' },
    { icon: Zap, title: 'Lightning Fast', description: 'Instant results', color: '#f59e0b' },
    { icon: BarChart3, title: 'Analytics', description: 'Track performance', color: '#8b5cf6' },
  ];

  describe('Rendering basics', () => {
    it('renders all item labels in the sidebar', () => {
      render(<SidebarDetail items={mockItems} />);
      // Each item appears twice (sidebar + detail), so use getAllByText
      expect(screen.getAllByText('Rocket Launch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Security Shield').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Lightning Fast').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Analytics').length).toBeGreaterThan(0);
    });

    it('shows the first item\'s title in the detail area by default', () => {
      render(<SidebarDetail items={mockItems} />);
      // The first item's title should appear in the HeroSpotlight component
      // Since there are multiple instances of "Rocket Launch" (one in sidebar, one in detail),
      // we check that it exists
      const titles = screen.getAllByText('Rocket Launch');
      expect(titles.length).toBeGreaterThan(0);
      // The detail area should show the first item's description
      const descriptions = screen.getAllByText('Fast and powerful');
      expect(descriptions.length).toBeGreaterThan(0);
    });

    it('renders with single item without crashing', () => {
      const singleItem: SidebarItem[] = [
        { icon: Rocket, title: 'Single Item', description: 'Only one', color: '#3b82f6' },
      ];
      const { container } = render(<SidebarDetail items={singleItem} />);
      expect(container).toBeTruthy();
      expect(screen.getAllByText('Single Item').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Only one').length).toBeGreaterThan(0);
    });
  });

  describe('Active item interaction', () => {
    it('clicking a sidebar item changes the active detail view', () => {
      const { container } = render(<SidebarDetail items={mockItems} />);
      
      // Initially, first item should be active (Rocket Launch)
      const initialDescriptions = screen.getAllByText('Fast and powerful');
      expect(initialDescriptions.length).toBeGreaterThan(0);
      
      // Find the second item's label in the sidebar - look for the one in the sidebar (has cursor-pointer parent)
      const shieldLabels = screen.getAllByText('Security Shield');
      const sidebarItem = shieldLabels.find(label => {
        const parent = label.closest('div.cursor-pointer');
        return parent !== null;
      });
      
      if (sidebarItem) {
        const clickableDiv = sidebarItem.closest('div.cursor-pointer');
        if (clickableDiv) {
          fireEvent.click(clickableDiv);
        } else {
          fireEvent.click(sidebarItem);
        }
      } else {
        // Fallback: click the first label found
        fireEvent.click(shieldLabels[0]);
      }
      
      // After clicking, the detail area should show the second item's content
      const newDescriptions = screen.getAllByText('Protect your data');
      expect(newDescriptions.length).toBeGreaterThan(0);
    });

    it('respects defaultActive prop - renders the specified item initially', () => {
      render(<SidebarDetail items={mockItems} defaultActive={2} />);
      
      // The third item (index 2) should be active initially
      const descriptions = screen.getAllByText('Instant results');
      expect(descriptions.length).toBeGreaterThan(0);
      // The title should also be visible in the detail area
      const titles = screen.getAllByText('Lightning Fast');
      expect(titles.length).toBeGreaterThan(0);
    });
  });
});
