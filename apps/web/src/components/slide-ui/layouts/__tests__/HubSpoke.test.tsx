import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HubSpoke } from '../HubSpoke';
import type { SpokeItem } from '../HubSpoke';
import { Rocket, Shield, Zap, BarChart3 } from 'lucide-react';

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

describe('HubSpoke', () => {
  const mockItems: SpokeItem[] = [
    { icon: Rocket, label: 'Launch', description: 'Start your journey', color: '#3b82f6' },
    { icon: Shield, label: 'Protect', description: 'Secure your data', color: '#10b981' },
    { icon: Zap, label: 'Speed', description: 'Lightning fast', color: '#f59e0b' },
    { icon: BarChart3, label: 'Analyze', description: 'Track metrics', color: '#8b5cf6' },
  ];

  describe('Rendering basics', () => {
    it('renders the hub label text', () => {
      render(<HubSpoke hubLabel="Central Hub" items={mockItems} />);
      expect(screen.getByText('Central Hub')).toBeTruthy();
    });

    it('renders all spoke item labels', () => {
      render(<HubSpoke hubLabel="Hub" items={mockItems} />);
      // Each label appears once in the spoke
      expect(screen.getAllByText('Launch').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Protect').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Speed').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Analyze').length).toBeGreaterThanOrEqual(1);
    });

    it('renders SVG connection lines between hub and spokes', () => {
      const { container } = render(<HubSpoke hubLabel="Hub" items={mockItems} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();

      const lines = svg?.querySelectorAll('line');
      expect(lines?.length).toBe(mockItems.length);
    });
  });

  describe('Popup interaction', () => {
    it('clicking a spoke opens a detail popup', () => {
      const { container } = render(<HubSpoke hubLabel="Hub" items={mockItems} />);

      // Find spoke containers by their absolute positioning and cursor-pointer style
      const spokes = container.querySelectorAll('[style*="cursor: pointer"]');
      expect(spokes.length).toBe(mockItems.length);

      // Click the first spoke
      fireEvent.click(spokes[0]);

      // DetailPopup should render — check that description text appears
      // (descriptions only appear inside the popup, not in spoke labels)
      expect(screen.getByText('Start your journey')).toBeTruthy();
    });

    it('clicking the same spoke again closes the popup', () => {
      const { container } = render(<HubSpoke hubLabel="Hub" items={mockItems} />);

      // Click first spoke to open popup
      const spokes = container.querySelectorAll('[style*="cursor: pointer"]');
      fireEvent.click(spokes[0]);
      expect(screen.getByText('Start your journey')).toBeTruthy();

      // Re-query the same spoke after re-render and click again to close
      const spokesAfter = container.querySelectorAll('[style*="cursor: pointer"]');
      fireEvent.click(spokesAfter[0]);

      // Popup should be closed — description only exists inside DetailPopup
      expect(screen.queryByText('Start your journey')).toBeNull();
    });

    it('with clickable: false, spokes do not have pointer cursor', () => {
      const { container } = render(
        <HubSpoke hubLabel="Hub" items={mockItems} clickable={false} />,
      );

      // Spokes should have cursor: default instead of cursor: pointer
      const pointerSpokes = container.querySelectorAll('[style*="cursor: pointer"]');
      expect(pointerSpokes.length).toBe(0);

      const defaultSpokes = container.querySelectorAll('[style*="cursor: default"]');
      expect(defaultSpokes.length).toBe(mockItems.length);
    });
  });
});
