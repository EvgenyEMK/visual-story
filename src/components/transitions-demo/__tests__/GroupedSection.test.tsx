import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import {
  useStepper,
  handleGroupedKeyDown,
  ListAccumulatorDemo,
  CarouselFocusDemo,
} from '../GroupedSection';

// =============================================================================
// useStepper hook — unit tests
// =============================================================================

describe('useStepper', () => {
  describe('initial state', () => {
    it('starts at step 0 with focus 0 and no override', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      expect(result.current.step).toBe(0);
      expect(result.current.focus).toBe(0);
      expect(result.current.hasFocusOverride).toBe(false);
    });
  });

  describe('advance (click / →)', () => {
    it('increments step and moves focus forward', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance());
      expect(result.current.step).toBe(1);
      expect(result.current.focus).toBe(1);
      expect(result.current.hasFocusOverride).toBe(false);
    });

    it('wraps around when reaching totalSteps', () => {
      const { result } = renderHook(() => useStepper(3, 1800, 'click'));
      act(() => result.current.advance()); // step 1
      act(() => result.current.advance()); // step 2
      act(() => result.current.advance()); // step 3 (= totalSteps)
      act(() => result.current.advance()); // wraps to 0
      expect(result.current.step).toBe(0);
    });
  });

  describe('goBack (←)', () => {
    it('decrements step', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance()); // 1
      act(() => result.current.advance()); // 2
      act(() => result.current.goBack());  // 1
      expect(result.current.step).toBe(1);
      expect(result.current.focus).toBe(1);
    });

    it('does not go below 0', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.goBack());
      expect(result.current.step).toBe(0);
    });
  });

  describe('toStart (↑) / toEnd (↓)', () => {
    it('toStart resets to step 0', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance()); // 1
      act(() => result.current.advance()); // 2
      act(() => result.current.toStart());
      expect(result.current.step).toBe(0);
      expect(result.current.focus).toBe(0);
    });

    it('toEnd jumps to totalSteps', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.toEnd());
      expect(result.current.step).toBe(5);
      expect(result.current.focus).toBe(5);
    });
  });

  describe('setFocus (click on shown item — review mode)', () => {
    it('changes focus without changing step', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance()); // step 1
      act(() => result.current.advance()); // step 2
      act(() => result.current.setFocus(0));
      expect(result.current.step).toBe(2);   // step unchanged
      expect(result.current.focus).toBe(0);   // focus overridden
      expect(result.current.hasFocusOverride).toBe(true);
    });

    it('preserves step when clicking different items', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance()); // step 1
      act(() => result.current.advance()); // step 2
      act(() => result.current.advance()); // step 3
      act(() => result.current.setFocus(0));
      expect(result.current.step).toBe(3);
      expect(result.current.focus).toBe(0);
      act(() => result.current.setFocus(2));
      expect(result.current.step).toBe(3);
      expect(result.current.focus).toBe(2);
    });
  });

  describe('keyboard clears focus override', () => {
    it('advance clears override and advances step', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance()); // step 1
      act(() => result.current.advance()); // step 2
      act(() => result.current.setFocus(0)); // override to 0
      expect(result.current.hasFocusOverride).toBe(true);
      act(() => result.current.advance());
      expect(result.current.hasFocusOverride).toBe(false);
      expect(result.current.step).toBe(3);
      expect(result.current.focus).toBe(3);
    });

    it('goBack clears override and decrements step', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance()); // step 1
      act(() => result.current.advance()); // step 2
      act(() => result.current.setFocus(0));
      act(() => result.current.goBack());
      expect(result.current.hasFocusOverride).toBe(false);
      expect(result.current.step).toBe(1);
    });

    it('toStart clears override and resets', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance());
      act(() => result.current.setFocus(0));
      act(() => result.current.toStart());
      expect(result.current.hasFocusOverride).toBe(false);
      expect(result.current.step).toBe(0);
    });

    it('toEnd clears override and jumps', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance());
      act(() => result.current.setFocus(0));
      act(() => result.current.toEnd());
      expect(result.current.hasFocusOverride).toBe(false);
      expect(result.current.step).toBe(5);
    });
  });

  describe('replay', () => {
    it('resets step, focus, and override', () => {
      const { result } = renderHook(() => useStepper(5, 1800, 'click'));
      act(() => result.current.advance());
      act(() => result.current.advance());
      act(() => result.current.setFocus(0));
      act(() => result.current.replay());
      expect(result.current.step).toBe(0);
      expect(result.current.focus).toBe(0);
      expect(result.current.hasFocusOverride).toBe(false);
    });
  });
});

// =============================================================================
// handleGroupedKeyDown — unit tests
// =============================================================================

describe('handleGroupedKeyDown', () => {
  const createControls = () => ({
    advance: vi.fn(),
    goBack: vi.fn(),
    toStart: vi.fn(),
    toEnd: vi.fn(),
  });

  const fireKey = (key: string, controls: ReturnType<typeof createControls>) => {
    const event = {
      key,
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;
    handleGroupedKeyDown(event, controls);
    return event;
  };

  it('→ calls advance', () => {
    const c = createControls();
    const e = fireKey('ArrowRight', c);
    expect(c.advance).toHaveBeenCalledOnce();
    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('Space calls advance', () => {
    const c = createControls();
    fireKey(' ', c);
    expect(c.advance).toHaveBeenCalledOnce();
  });

  it('← calls goBack', () => {
    const c = createControls();
    fireKey('ArrowLeft', c);
    expect(c.goBack).toHaveBeenCalledOnce();
  });

  it('↑ calls toStart', () => {
    const c = createControls();
    fireKey('ArrowUp', c);
    expect(c.toStart).toHaveBeenCalledOnce();
  });

  it('↓ calls toEnd', () => {
    const c = createControls();
    fireKey('ArrowDown', c);
    expect(c.toEnd).toHaveBeenCalledOnce();
  });

  it('unrelated keys do nothing', () => {
    const c = createControls();
    const e = fireKey('a', c);
    expect(c.advance).not.toHaveBeenCalled();
    expect(c.goBack).not.toHaveBeenCalled();
    expect(c.toStart).not.toHaveBeenCalled();
    expect(c.toEnd).not.toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});

// =============================================================================
// Helpers for component integration tests
// =============================================================================

/** Get all sidebar items in the ListAccumulatorDemo (left panel items). */
function getSidebarItems(container: HTMLElement) {
  // Sidebar items contain the emoji + label spans inside the left panel
  const sidebar = container.querySelector('.bg-slate-800\\/50');
  if (!sidebar) throw new Error('Sidebar not found');
  // Each item is a direct child div of the sidebar
  return Array.from(sidebar.children) as HTMLElement[];
}

/** Get all hero items in the ListAccumulatorDemo center area. */
function getHeroItems(container: HTMLElement) {
  // Hero area is the flex-1 sibling after the sidebar
  const heroArea = container.querySelector('.flex-1.flex.items-center');
  if (!heroArea) throw new Error('Hero area not found');
  return Array.from(heroArea.querySelectorAll(':scope > div')) as HTMLElement[];
}

/** Get the stage (clickable area) inside a DemoStage. */
function getStage(container: HTMLElement) {
  const stage = container.querySelector('[data-demo-theme]') as HTMLElement;
  if (!stage) throw new Error('Stage not found');
  return stage;
}

/** Get all shelf items in the CarouselFocusDemo (bottom panel items). */
function getShelfItems(container: HTMLElement) {
  const shelf = container.querySelector('.h-14.bg-slate-800\\/50');
  if (!shelf) throw new Error('Shelf not found');
  return Array.from(shelf.children) as HTMLElement[];
}

/** Get all center stage items in the CarouselFocusDemo. */
function getCenterItems(container: HTMLElement) {
  const centerArea = container.querySelector('.flex-1.flex.items-center');
  if (!centerArea) throw new Error('Center area not found');
  return Array.from(centerArea.querySelectorAll(':scope > div')) as HTMLElement[];
}

// =============================================================================
// ListAccumulatorDemo — click mode integration tests
// =============================================================================

describe('ListAccumulatorDemo — click mode', () => {
  const renderDemo = () => {
    const result = render(
      <ListAccumulatorDemo themeMode="dark" triggerMode="click" />
    );
    return result;
  };

  it('initial state: item 0 is hero, no sidebar items visible', () => {
    const { container } = renderDemo();
    const sidebarItems = getSidebarItems(container);
    const heroItems = getHeroItems(container);

    // No sidebar items visible (all opacity 0)
    sidebarItems.forEach((item) => {
      expect(item.style.opacity).toBe('0');
    });

    // Item 0 is hero (opacity 1)
    expect(heroItems[0].style.opacity).toBe('1');
    // Others are hidden
    expect(heroItems[1].style.opacity).toBe('0');
    expect(heroItems[2].style.opacity).toBe('0');
    expect(heroItems[3].style.opacity).toBe('0');
  });

  it('clicking stage advances: item 1 becomes hero, item 0 in sidebar', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // advance to step 1

    const sidebarItems = getSidebarItems(container);
    const heroItems = getHeroItems(container);

    // Item 0 visible in sidebar
    expect(sidebarItems[0].style.opacity).toBe('1');
    // Item 1 not in sidebar (it's the hero)
    expect(sidebarItems[1].style.opacity).toBe('0');

    // Item 1 is hero
    expect(heroItems[1].style.opacity).toBe('1');
    expect(heroItems[0].style.opacity).toBe('0');
  });

  it('clicking stage twice: items 0,1 in sidebar, item 2 hero', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2

    const sidebarItems = getSidebarItems(container);
    const heroItems = getHeroItems(container);

    expect(sidebarItems[0].style.opacity).toBe('1');
    expect(sidebarItems[1].style.opacity).toBe('1');
    expect(sidebarItems[2].style.opacity).toBe('0');

    expect(heroItems[2].style.opacity).toBe('1');
  });

  it('BUG FIX: clicking sidebar item makes it hero WITHOUT removing it from sidebar', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    // Advance to step 2: items 0,1 in sidebar, item 2 hero
    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2

    const sidebarItems = getSidebarItems(container);

    // Click item 0 in sidebar
    fireEvent.click(sidebarItems[0]);

    // Re-query after state update
    const updatedSidebar = getSidebarItems(container);
    const heroItems = getHeroItems(container);

    // Item 0 STILL visible in sidebar (not removed)
    expect(updatedSidebar[0].style.opacity).toBe('1');
    // Item 1 STILL visible in sidebar
    expect(updatedSidebar[1].style.opacity).toBe('1');
    // Item 2 NOT in sidebar (it was at step position, not committed)
    expect(updatedSidebar[2].style.opacity).toBe('0');

    // Item 0 is now the hero
    expect(heroItems[0].style.opacity).toBe('1');
    // Item 2 is no longer hero
    expect(heroItems[2].style.opacity).toBe('0');
  });

  it('clicking different sidebar items keeps all committed items visible', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    // Advance to step 3: items 0,1,2 in sidebar, item 3 hero
    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2
    fireEvent.click(stage); // step 3

    const sidebarItems = getSidebarItems(container);

    // Click item 0 in sidebar
    fireEvent.click(sidebarItems[0]);
    expect(getSidebarItems(container)[0].style.opacity).toBe('1');
    expect(getSidebarItems(container)[1].style.opacity).toBe('1');
    expect(getSidebarItems(container)[2].style.opacity).toBe('1');

    // Click item 2 in sidebar
    fireEvent.click(getSidebarItems(container)[2]);
    expect(getSidebarItems(container)[0].style.opacity).toBe('1');
    expect(getSidebarItems(container)[1].style.opacity).toBe('1');
    expect(getSidebarItems(container)[2].style.opacity).toBe('1');
  });

  it('end state: all items in sidebar, clicking any shows it as hero', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    // Advance to end state (step 4 = items.length)
    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2
    fireEvent.click(stage); // step 3
    fireEvent.click(stage); // step 4

    const sidebarItems = getSidebarItems(container);

    // All 4 items visible in sidebar
    expect(sidebarItems[0].style.opacity).toBe('1');
    expect(sidebarItems[1].style.opacity).toBe('1');
    expect(sidebarItems[2].style.opacity).toBe('1');
    expect(sidebarItems[3].style.opacity).toBe('1');

    // Click item 2
    fireEvent.click(sidebarItems[2]);

    // Item 2 is hero AND still in sidebar
    expect(getSidebarItems(container)[2].style.opacity).toBe('1');
    expect(getHeroItems(container)[2].style.opacity).toBe('1');
  });

  it('step-position item does NOT appear in sidebar when focus overrides', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2

    // At step 2: sidebar [0,1], hero item 2
    // Click item 0: hero becomes 0, item 2 (step position) should NOT appear
    fireEvent.click(getSidebarItems(container)[0]);

    expect(getSidebarItems(container)[2].style.opacity).toBe('0');
  });
});

// =============================================================================
// ListAccumulatorDemo — keyboard mode integration tests
// =============================================================================

describe('ListAccumulatorDemo — keyboard mode', () => {
  const renderDemo = () => render(
    <ListAccumulatorDemo themeMode="dark" triggerMode="click" />
  );

  it('→ key advances the sequence', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    // Focus the stage for keyboard events
    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' });

    expect(getHeroItems(container)[1].style.opacity).toBe('1');
  });

  it('← key goes back in the sequence', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 2
    fireEvent.keyDown(stage, { key: 'ArrowLeft' });  // step 1

    expect(getHeroItems(container)[1].style.opacity).toBe('1');
    // Item 0 in sidebar, item 1 not in sidebar (it's the hero at step 1)
    expect(getSidebarItems(container)[0].style.opacity).toBe('1');
    expect(getSidebarItems(container)[1].style.opacity).toBe('0');
  });

  it('↑ key resets to start', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 2
    fireEvent.keyDown(stage, { key: 'ArrowUp' });    // reset to 0

    expect(getHeroItems(container)[0].style.opacity).toBe('1');
    expect(getSidebarItems(container)[0].style.opacity).toBe('0');
  });

  it('↓ key jumps to end state', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowDown' }); // jump to end

    // All items should be in sidebar (step = totalSteps = 5, items.length = 4)
    const sidebarItems = getSidebarItems(container);
    expect(sidebarItems[0].style.opacity).toBe('1');
    expect(sidebarItems[1].style.opacity).toBe('1');
    expect(sidebarItems[2].style.opacity).toBe('1');
    expect(sidebarItems[3].style.opacity).toBe('1');
  });

  it('keyboard clears focus override from click', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    // Advance and then click a sidebar item
    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 2
    fireEvent.click(getSidebarItems(container)[0]);   // override focus to 0

    // Verify override is active: item 0 is hero
    expect(getHeroItems(container)[0].style.opacity).toBe('1');

    // Press → to clear override and advance
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // clears override, step 3

    // Step 3: item 3 is hero, items 0-2 in sidebar
    expect(getHeroItems(container)[3].style.opacity).toBe('1');
    expect(getSidebarItems(container)[0].style.opacity).toBe('1');
    expect(getSidebarItems(container)[1].style.opacity).toBe('1');
    expect(getSidebarItems(container)[2].style.opacity).toBe('1');
  });
});

// =============================================================================
// CarouselFocusDemo — click mode integration tests
// =============================================================================

describe('CarouselFocusDemo — click mode', () => {
  const renderDemo = () => render(
    <CarouselFocusDemo themeMode="dark" triggerMode="click" />
  );

  it('initial state: item 0 in center, no shelf items are revealed', () => {
    const { container } = renderDemo();
    const centerItems = getCenterItems(container);
    const shelfItems = getShelfItems(container);

    // Item 0 is hero
    expect(centerItems[0].style.opacity).toBe('1');
    expect(centerItems[1].style.opacity).toBe('0');

    // All shelf items are dimmed (none revealed, active item dimmed)
    shelfItems.forEach((item) => {
      expect(item.style.opacity).toBe('0.3');
    });
  });

  it('clicking stage advances: item 1 becomes hero, item 0 revealed in shelf', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1

    const centerItems = getCenterItems(container);
    const shelfItems = getShelfItems(container);

    // Item 1 is hero
    expect(centerItems[1].style.opacity).toBe('1');

    // Item 0 is revealed (full color) in shelf
    expect(shelfItems[0].style.opacity).toBe('1');
    expect(shelfItems[0].style.filter).toBe('grayscale(0%)');

    // Item 1 is active → dimmed in shelf
    expect(shelfItems[1].style.opacity).toBe('0.3');
    expect(shelfItems[1].style.filter).toBe('grayscale(100%)');
  });

  it('BUG FIX: clicking shelf item keeps it enabled (not dimmed) in review mode', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2

    // At step 2: items 0,1 revealed, item 2 is hero (dimmed in shelf)
    const shelfItems = getShelfItems(container);
    expect(shelfItems[0].style.opacity).toBe('1');
    expect(shelfItems[1].style.opacity).toBe('1');

    // Click item 0 in shelf
    fireEvent.click(shelfItems[0]);

    const updatedShelf = getShelfItems(container);
    const centerItems = getCenterItems(container);

    // Item 0 is now hero in center
    expect(centerItems[0].style.opacity).toBe('1');

    // Item 0 STILL full-color in shelf (NOT dimmed — review mode)
    expect(updatedShelf[0].style.opacity).toBe('1');
    expect(updatedShelf[0].style.filter).toBe('grayscale(0%)');
    expect(updatedShelf[0].style.transform).not.toContain('scale(0.8)');

    // Item 1 also still full-color
    expect(updatedShelf[1].style.opacity).toBe('1');
    expect(updatedShelf[1].style.filter).toBe('grayscale(0%)');
  });

  it('clicking different shelf items keeps all revealed items enabled', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2
    fireEvent.click(stage); // step 3

    // Items 0,1,2 are revealed. Click item 1.
    fireEvent.click(getShelfItems(container)[1]);

    const shelf = getShelfItems(container);
    expect(shelf[0].style.opacity).toBe('1');
    expect(shelf[1].style.opacity).toBe('1');
    expect(shelf[2].style.opacity).toBe('1');

    // Click item 0
    fireEvent.click(getShelfItems(container)[0]);

    const shelf2 = getShelfItems(container);
    expect(shelf2[0].style.opacity).toBe('1');
    expect(shelf2[1].style.opacity).toBe('1');
    expect(shelf2[2].style.opacity).toBe('1');
  });

  it('review mode shows visual indicator on focused shelf item', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1
    fireEvent.click(stage); // step 2

    // Click item 0 — review mode
    fireEvent.click(getShelfItems(container)[0]);

    // The icon container of the active shelf item should have a bright border
    const shelfItems = getShelfItems(container);
    const activeIcon = shelfItems[0].querySelector('.rounded-lg') as HTMLElement;
    expect(activeIcon).toBeTruthy();
    // Active item in review mode has the item's own color as border (jsdom converts hex to rgb)
    expect(activeIcon.style.border).toContain('1px solid rgb(59, 130, 246)');
  });

  it('non-revealed items remain grayed and not clickable', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    fireEvent.click(stage); // step 1

    const shelfItems = getShelfItems(container);

    // Items 2-4 are not revealed
    expect(shelfItems[2].style.opacity).toBe('0.3');
    expect(shelfItems[2].style.filter).toBe('grayscale(100%)');
    expect(shelfItems[2].style.cursor).toBe('default');
  });
});

// =============================================================================
// CarouselFocusDemo — keyboard mode integration tests
// =============================================================================

describe('CarouselFocusDemo — keyboard mode', () => {
  const renderDemo = () => render(
    <CarouselFocusDemo themeMode="dark" triggerMode="click" />
  );

  it('→ key advances: new item becomes hero', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1

    expect(getCenterItems(container)[1].style.opacity).toBe('1');
  });

  it('← key goes back: active item dimmed in shelf again', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 2
    fireEvent.keyDown(stage, { key: 'ArrowLeft' });  // step 1

    expect(getCenterItems(container)[1].style.opacity).toBe('1');
    expect(getShelfItems(container)[0].style.opacity).toBe('1'); // revealed
  });

  it('↑ resets to start', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 2
    fireEvent.keyDown(stage, { key: 'ArrowUp' });    // reset

    expect(getCenterItems(container)[0].style.opacity).toBe('1');
  });

  it('↓ jumps to end: all items revealed in shelf', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowDown' }); // end

    const shelf = getShelfItems(container);
    // All 5 items revealed (step >= items.length)
    shelf.forEach((item) => {
      expect(item.style.opacity).toBe('1');
    });
  });

  it('keyboard clears focus override and resumes sequence', () => {
    const { container } = renderDemo();
    const stage = getStage(container);

    stage.focus();
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 1
    fireEvent.keyDown(stage, { key: 'ArrowRight' }); // step 2

    // Click item 0 — enter review mode
    fireEvent.click(getShelfItems(container)[0]);
    expect(getCenterItems(container)[0].style.opacity).toBe('1');

    // Press → — clears override, advances to step 3
    fireEvent.keyDown(stage, { key: 'ArrowRight' });

    expect(getCenterItems(container)[3].style.opacity).toBe('1');
    // Items 0,1,2 all revealed in shelf
    expect(getShelfItems(container)[0].style.opacity).toBe('1');
    expect(getShelfItems(container)[1].style.opacity).toBe('1');
    expect(getShelfItems(container)[2].style.opacity).toBe('1');
    // Active item (3) is dimmed in shelf (back in sequence mode, not review)
    expect(getShelfItems(container)[3].style.opacity).toBe('0.3');
  });
});
