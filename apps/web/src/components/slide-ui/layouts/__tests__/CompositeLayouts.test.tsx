import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TitleSlide } from '../TitleSlide';
import { StatDashboard } from '../StatDashboard';
import type { DashboardStat } from '../StatDashboard';
import { StackOfCards } from '../StackOfCards';
import type { StackCardItem } from '../StackOfCards';
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

// =============================================================================
// TitleSlide
// =============================================================================

describe('TitleSlide', () => {
  it('renders the title text', () => {
    render(<TitleSlide title="Welcome to VisualFlow" />);
    expect(screen.getByText('Welcome to VisualFlow')).toBeTruthy();
  });

  it('renders the subtitle when provided', () => {
    render(<TitleSlide title="Main Title" subtitle="Subtitle text" />);
    expect(screen.getByText('Subtitle text')).toBeTruthy();
  });

  it('renders children content', () => {
    render(
      <TitleSlide title="Title">
        <div data-testid="child-content">Child content here</div>
      </TitleSlide>,
    );
    expect(screen.getByTestId('child-content')).toBeTruthy();
    expect(screen.getByText('Child content here')).toBeTruthy();
  });

  it('renders the right slot content', () => {
    render(
      <TitleSlide
        title="Title"
        right={<div data-testid="right-slot">Right content</div>}
      />,
    );
    expect(screen.getByTestId('right-slot')).toBeTruthy();
    expect(screen.getByText('Right content')).toBeTruthy();
  });
});

// =============================================================================
// StatDashboard
// =============================================================================

describe('StatDashboard', () => {
  // Use unique labels to avoid duplicate text issues
  const mockStats: DashboardStat[] = [
    { value: '1,234', label: 'Active Users', color: '#3b82f6' },
    { value: '5,678', label: 'Revenue Total', color: '#10b981' },
    { value: '90%', label: 'System Uptime', color: '#f59e0b' },
    { value: '42', label: 'Open Projects', color: '#8b5cf6' },
  ];

  it('renders all stat values', () => {
    render(<StatDashboard stats={mockStats} />);
    expect(screen.getByText('1,234')).toBeTruthy();
    expect(screen.getByText('5,678')).toBeTruthy();
    expect(screen.getByText('90%')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders stat labels when provided', () => {
    const { container } = render(<StatDashboard stats={mockStats} />);
    // Labels are uppercase in StatCard — check text content
    expect(container.textContent).toContain('Active Users');
    expect(container.textContent).toContain('Revenue Total');
    expect(container.textContent).toContain('System Uptime');
    expect(container.textContent).toContain('Open Projects');
  });

  it('auto-calculates column count (max 3)', () => {
    const { container } = render(<StatDashboard stats={mockStats} />);
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeTruthy();
    // With 4 stats, should use min(4, 3) = 3 columns
    expect((gridElement as HTMLElement).style.gridTemplateColumns).toBe(
      'repeat(3, minmax(0, 1fr))',
    );
  });

  it('uses explicit columns prop when provided', () => {
    const { container } = render(<StatDashboard stats={mockStats} columns={2} />);
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeTruthy();
    expect((gridElement as HTMLElement).style.gridTemplateColumns).toBe(
      'repeat(2, minmax(0, 1fr))',
    );
  });
});

// =============================================================================
// StackOfCards
// =============================================================================

describe('StackOfCards', () => {
  const mockItems: StackCardItem[] = [
    { icon: Rocket, title: 'First Card', subtitle: 'Sub One', color: '#3b82f6' },
    { icon: Shield, title: 'Second Card', subtitle: 'Sub Two', color: '#10b981' },
    { icon: Zap, title: 'Third Card', color: '#f59e0b' },
  ];

  it('renders all card titles', () => {
    render(<StackOfCards items={mockItems} />);
    expect(screen.getByText('First Card')).toBeTruthy();
    expect(screen.getByText('Second Card')).toBeTruthy();
    expect(screen.getByText('Third Card')).toBeTruthy();
  });

  it('renders subtitles when provided', () => {
    render(<StackOfCards items={mockItems} />);
    expect(screen.getByText('Sub One')).toBeTruthy();
    expect(screen.getByText('Sub Two')).toBeTruthy();
    // Third card has no subtitle — should not crash
  });

  it('clicking the stack cycles the top card', () => {
    const { container } = render(<StackOfCards items={mockItems} />);

    // The stack container has cursor-pointer
    const stackContainer = container.querySelector('[class*="cursor-pointer"]');
    expect(stackContainer).toBeTruthy();

    // Click to cycle — all cards remain in DOM, only z-index/opacity changes
    fireEvent.click(stackContainer!);

    // All cards still render after cycling
    expect(screen.getByText('First Card')).toBeTruthy();
    expect(screen.getByText('Second Card')).toBeTruthy();
    expect(screen.getByText('Third Card')).toBeTruthy();

    // Click again to cycle further
    fireEvent.click(stackContainer!);
    expect(screen.getByText('First Card')).toBeTruthy();
    expect(screen.getByText('Second Card')).toBeTruthy();
    expect(screen.getByText('Third Card')).toBeTruthy();
  });
});
