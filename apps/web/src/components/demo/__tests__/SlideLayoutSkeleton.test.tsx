import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SlideLayoutSkeleton } from '../SlideLayoutSkeleton';
import { LAYOUT_TEMPLATES } from '@/config/layout-templates';
import type { SlideLayoutMeta } from '@/types/slide';

// Cleanup after each test to prevent DOM pollution
afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// Helper: Build minimal layout metadata fixture
// ---------------------------------------------------------------------------

/**
 * Creates a minimal SlideLayoutMeta fixture for testing.
 * Uses the provided layout as a base, ensuring all required fields are present.
 */
function createLayoutFixture(layout: SlideLayoutMeta): SlideLayoutMeta {
  return {
    id: layout.id,
    name: layout.name,
    description: layout.description,
    columns: layout.columns,
    isGrid: layout.isGrid,
    hasSidebar: layout.hasSidebar,
    tags: layout.tags,
    regions: layout.regions,
    bestFor: layout.bestFor,
    itemCount: layout.itemCount,
    aiHints: layout.aiHints,
    gridSize: layout.gridSize,
  };
}

// ---------------------------------------------------------------------------
// Rendering basics
// ---------------------------------------------------------------------------

describe('SlideLayoutSkeleton', () => {
  describe('Rendering basics', () => {
    it('renders without crashing for content layout', () => {
      const layout = createLayoutFixture(LAYOUT_TEMPLATES[0]); // 'content'
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });

    it('contains the expected aspect-video container', () => {
      const layout = createLayoutFixture(LAYOUT_TEMPLATES[0]); // 'content'
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      const rootElement = container.firstChild as HTMLElement;
      expect(rootElement).toBeTruthy();
      expect(rootElement.classList.contains('aspect-video')).toBe(true);
      expect(rootElement.classList.contains('rounded-md')).toBe(true);
      expect(rootElement.classList.contains('flex')).toBe(true);
      expect(rootElement.classList.contains('flex-col')).toBe(true);
    });

    it('renders without crashing for two-column layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'two-column')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });

    it('renders without crashing for grid-2x2 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'grid-2x2')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });

    it('renders without crashing for sidebar-detail layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'sidebar-detail')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });

    it('renders without crashing for center-stage layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-stage')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });

    it('renders without crashing for blank layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'blank')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });

    it('renders without crashing for custom layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'custom')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // Header visibility
  // ---------------------------------------------------------------------------

  describe('Header visibility', () => {
    it('shows header skeleton when showHeader is true', () => {
      const layout = createLayoutFixture(LAYOUT_TEMPLATES[0]); // 'content'
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={true} />
      );
      // Header skeleton contains placeholder elements
      const header = container.querySelector('.rounded-md.border-2.border-dashed');
      expect(header).toBeTruthy();
      // Check for icon placeholder
      const iconPlaceholder = container.querySelector('.h-3.w-3.rounded-sm');
      expect(iconPlaceholder).toBeTruthy();
    });

    it('hides header skeleton when showHeader is false', () => {
      const layout = createLayoutFixture(LAYOUT_TEMPLATES[0]); // 'content'
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      // Header skeleton should not be present
      const header = container.querySelector('.rounded-md.border-2.border-dashed');
      // The header skeleton has specific classes, but we should check that
      // the icon placeholder is not present when showHeader is false
      const iconPlaceholder = container.querySelector('.h-3.w-3.rounded-sm');
      expect(iconPlaceholder).toBeFalsy();
    });
  });

  // ---------------------------------------------------------------------------
  // Region labels
  // ---------------------------------------------------------------------------

  describe('Region labels', () => {
    it('renders "Content" label for content layout', () => {
      const layout = createLayoutFixture(LAYOUT_TEMPLATES[0]); // 'content'
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container.textContent).toContain('Content');
    });

    it('renders "Left (50%)" and "Right (50%)" labels for two-column layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'two-column')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container.textContent).toContain('Left (50%)');
      expect(container.textContent).toContain('Right (50%)');
    });

    it('renders 4 region labels for grid-2x2 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'grid-2x2')!
      );
      const { container } = render(
        <SlideLayoutSkeleton layout={layout} showHeader={false} />
      );
      expect(container.textContent).toContain('Top Left');
      expect(container.textContent).toContain('Top Right');
      expect(container.textContent).toContain('Bottom Left');
      expect(container.textContent).toContain('Bottom Right');
    });

    it('renders correct labels for two-column-25-75 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'two-column-25-75')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Left (25%)')).toBeTruthy();
      expect(screen.getByText('Right (75%)')).toBeTruthy();
    });

    it('renders correct labels for two-column-75-25 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'two-column-75-25')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Left (75%)')).toBeTruthy();
      expect(screen.getByText('Right (25%)')).toBeTruthy();
    });

    it('renders correct labels for two-column-33-67 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'two-column-33-67')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Left (33%)')).toBeTruthy();
      expect(screen.getByText('Right (67%)')).toBeTruthy();
    });

    it('renders correct labels for two-column-67-33 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'two-column-67-33')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Left (67%)')).toBeTruthy();
      expect(screen.getByText('Right (33%)')).toBeTruthy();
    });

    it('renders correct labels for three-column layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'three-column')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Left (33%)')).toBeTruthy();
      expect(screen.getByText('Middle (33%)')).toBeTruthy();
      expect(screen.getByText('Right (33%)')).toBeTruthy();
    });

    it('renders correct labels for four-column layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'four-column')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Col 1 (25%)')).toBeTruthy();
      expect(screen.getByText('Col 2 (25%)')).toBeTruthy();
      expect(screen.getByText('Col 3 (25%)')).toBeTruthy();
      expect(screen.getByText('Col 4 (25%)')).toBeTruthy();
    });

    it('renders "Sidebar" and "Detail" labels for sidebar-detail layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'sidebar-detail')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Sidebar')).toBeTruthy();
      expect(screen.getByText('Detail')).toBeTruthy();
    });

    it('renders correct labels for center-band layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-band')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Center Band')).toBeTruthy();
    });

    it('renders correct labels for center-stage layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-stage')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Center Stage')).toBeTruthy();
    });

    it('renders correct labels for center-stage-2 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-stage-2')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Card 1')).toBeTruthy();
      expect(screen.getByText('Card 2')).toBeTruthy();
    });

    it('renders correct labels for center-stage-2x2 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-stage-2x2')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Card 1')).toBeTruthy();
      expect(screen.getByText('Card 2')).toBeTruthy();
      expect(screen.getByText('Card 3')).toBeTruthy();
      expect(screen.getByText('Card 4')).toBeTruthy();
    });

    it('renders correct labels for center-stage-3 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-stage-3')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Card 1')).toBeTruthy();
      expect(screen.getByText('Card 2')).toBeTruthy();
      expect(screen.getByText('Card 3')).toBeTruthy();
    });

    it('renders correct labels for center-stage-4 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'center-stage-4')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Card 1')).toBeTruthy();
      expect(screen.getByText('Card 2')).toBeTruthy();
      expect(screen.getByText('Card 3')).toBeTruthy();
      expect(screen.getByText('Card 4')).toBeTruthy();
    });

    it('renders correct labels for grid-3x2 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'grid-3x2')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Top Left')).toBeTruthy();
      expect(screen.getByText('Top Mid')).toBeTruthy();
      expect(screen.getByText('Top Right')).toBeTruthy();
      expect(screen.getByText('Bot Left')).toBeTruthy();
      expect(screen.getByText('Bot Mid')).toBeTruthy();
      expect(screen.getByText('Bot Right')).toBeTruthy();
    });

    it('renders correct labels for grid-2-3 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'grid-2-3')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Top Left')).toBeTruthy();
      expect(screen.getByText('Top Right')).toBeTruthy();
      expect(screen.getByText('Bot Left')).toBeTruthy();
      expect(screen.getByText('Bot Mid')).toBeTruthy();
      expect(screen.getByText('Bot Right')).toBeTruthy();
    });

    it('renders correct labels for grid-3-2 layout', () => {
      const layout = createLayoutFixture(
        LAYOUT_TEMPLATES.find((t) => t.id === 'grid-3-2')!
      );
      render(<SlideLayoutSkeleton layout={layout} showHeader={false} />);
      expect(screen.getByText('Top Left')).toBeTruthy();
      expect(screen.getByText('Top Mid')).toBeTruthy();
      expect(screen.getByText('Top Right')).toBeTruthy();
      expect(screen.getByText('Bot Left')).toBeTruthy();
      expect(screen.getByText('Bot Right')).toBeTruthy();
    });
  });

  // ---------------------------------------------------------------------------
  // All layout templates render
  // ---------------------------------------------------------------------------

  describe('All layout templates render', () => {
    it('renders all layout templates without crashing', () => {
      LAYOUT_TEMPLATES.forEach((template) => {
        const layout = createLayoutFixture(template);
        const { container, unmount } = render(
          <SlideLayoutSkeleton layout={layout} showHeader={false} />
        );
        expect(container).toBeTruthy();
        unmount();
      });
    });

    it('all layout templates produce at least one region or placeholder', () => {
      LAYOUT_TEMPLATES.forEach((template) => {
        const layout = createLayoutFixture(template);
        const { container, unmount } = render(
          <SlideLayoutSkeleton layout={layout} showHeader={false} />
        );

        // For blank and custom layouts, they render special placeholders
        // For all other layouts, they should render at least one Region component
        // Regions have the class "rounded-md border-2 border-dashed"
        const regions = container.querySelectorAll('.rounded-md.border-2.border-dashed');
        const hasFreeformPlaceholder = container.querySelector('.opacity-30');

        // Either we have regions, or we have a freeform placeholder (blank/custom)
        expect(
          regions.length > 0 || hasFreeformPlaceholder !== null
        ).toBe(true);

        unmount();
      });
    });

    it('all layout templates render with correct structure', () => {
      LAYOUT_TEMPLATES.forEach((template) => {
        const layout = createLayoutFixture(template);
        const { container, unmount } = render(
          <SlideLayoutSkeleton layout={layout} showHeader={false} />
        );

        // Root should have aspect-video
        const root = container.firstChild as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.classList.contains('aspect-video')).toBe(true);

        // Should have flex-col structure
        expect(root.classList.contains('flex-col')).toBe(true);

        unmount();
      });
    });

    it('all layout templates render correctly with header', () => {
      LAYOUT_TEMPLATES.forEach((template) => {
        const layout = createLayoutFixture(template);
        const { container, unmount } = render(
          <SlideLayoutSkeleton layout={layout} showHeader={true} />
        );

        // Should have header skeleton (icon placeholder)
        const iconPlaceholder = container.querySelector('.h-3.w-3.rounded-sm');
        expect(iconPlaceholder).toBeTruthy();

        unmount();
      });
    });

    it('all layout templates render correctly without header', () => {
      LAYOUT_TEMPLATES.forEach((template) => {
        const layout = createLayoutFixture(template);
        const { container, unmount } = render(
          <SlideLayoutSkeleton layout={layout} showHeader={false} />
        );

        // Should NOT have header skeleton icon placeholder
        const iconPlaceholder = container.querySelector('.h-3.w-3.rounded-sm');
        expect(iconPlaceholder).toBeFalsy();

        unmount();
      });
    });
  });
});
