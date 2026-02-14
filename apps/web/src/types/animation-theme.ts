/**
 * Animation theme system — semantic color palette that adapts to
 * light mode, dark mode, and custom brand palettes.
 *
 * Every animation component references colors by ROLE (e.g. `focusItem`),
 * never by raw hex values. This allows the same animation template to
 * render correctly across any theme context.
 *
 * @source docs/modules/animation-engine/README.md — Animation Theme System
 */

// ---------------------------------------------------------------------------
// Semantic Color Palette
// ---------------------------------------------------------------------------

/**
 * Complete semantic color palette for the animation engine.
 * Every property maps to a CSS custom property (`--anim-*`).
 */
export interface AnimationThemePalette {
  /** Background of the currently active / hero item. */
  focusItem: string;
  /** Text/icon color on the focus item. */
  focusItemForeground: string;
  /** Background of items that have already been revealed and remain visible. */
  activeShownItem: string;
  /** Text color on already-shown items. */
  activeShownItemForeground: string;
  /** Background of items not yet revealed (placeholders). */
  inactiveUpcoming: string;
  /** Text color on not-yet-shown items (hint-level). */
  inactiveUpcomingForeground: string;
  /** Background of the animation stage area. */
  stageBg: string;
  /** Color for lines, bonds, paths connecting items. */
  connector: string;
  /** Border/glow color shown on hover over inactive items. */
  hoverHighlight: string;
}

// ---------------------------------------------------------------------------
// Default Palettes
// ---------------------------------------------------------------------------

/** Dark mode default palette — for slides with dark backgrounds. */
export const ANIMATION_THEME_DARK: Readonly<AnimationThemePalette> = {
  focusItem: 'hsl(214 100% 50%)',
  focusItemForeground: 'hsl(0 0% 100%)',
  activeShownItem: 'hsl(214 40% 35%)',
  activeShownItemForeground: 'hsl(0 0% 80%)',
  inactiveUpcoming: 'hsl(0 0% 20%)',
  inactiveUpcomingForeground: 'hsl(0 0% 45%)',
  stageBg: 'hsl(222 47% 11%)',
  connector: 'hsl(214 60% 40% / 0.5)',
  hoverHighlight: 'hsl(214 100% 50% / 0.4)',
};

/** Light mode default palette — for slides with light backgrounds. */
export const ANIMATION_THEME_LIGHT: Readonly<AnimationThemePalette> = {
  focusItem: 'hsl(214 100% 50%)',
  focusItemForeground: 'hsl(0 0% 100%)',
  activeShownItem: 'hsl(214 30% 85%)',
  activeShownItemForeground: 'hsl(0 0% 15%)',
  inactiveUpcoming: 'hsl(0 0% 93%)',
  inactiveUpcomingForeground: 'hsl(0 0% 65%)',
  stageBg: 'hsl(0 0% 100%)',
  connector: 'hsl(214 40% 60% / 0.4)',
  hoverHighlight: 'hsl(214 100% 50% / 0.25)',
};

// ---------------------------------------------------------------------------
// Theme Resolution
// ---------------------------------------------------------------------------

/** All levels where animation theme colors can be overridden. */
export interface AnimationThemeOverrides {
  /** Project-level brand palette (from project settings). */
  projectTheme?: Partial<AnimationThemePalette>;
  /** Slide-level override (e.g. a dark slide in a light deck). */
  slideTheme?: Partial<AnimationThemePalette>;
  /** AI-suggested palette based on content analysis. */
  aiSuggested?: Partial<AnimationThemePalette>;
}

/**
 * Resolve the final palette by layering overrides on top of the base palette.
 *
 * Priority (highest wins):
 *   slideTheme  >  aiSuggested  >  projectTheme  >  base (dark/light default)
 */
export function resolveAnimationTheme(
  mode: 'light' | 'dark',
  overrides?: AnimationThemeOverrides,
): AnimationThemePalette {
  const base = mode === 'dark' ? ANIMATION_THEME_DARK : ANIMATION_THEME_LIGHT;

  if (!overrides) return { ...base };

  return {
    ...base,
    ...overrides.projectTheme,
    ...overrides.aiSuggested,
    ...overrides.slideTheme,
  };
}

// ---------------------------------------------------------------------------
// CSS Variable Mapping
// ---------------------------------------------------------------------------

/** Map from AnimationThemePalette keys to CSS custom property names. */
export const ANIM_CSS_VAR_MAP: Record<keyof AnimationThemePalette, string> = {
  focusItem: '--anim-focus',
  focusItemForeground: '--anim-focus-fg',
  activeShownItem: '--anim-active',
  activeShownItemForeground: '--anim-active-fg',
  inactiveUpcoming: '--anim-inactive',
  inactiveUpcomingForeground: '--anim-inactive-fg',
  stageBg: '--anim-stage-bg',
  connector: '--anim-connector',
  hoverHighlight: '--anim-hover',
};

/**
 * Convert a resolved palette into a CSS variables object suitable for
 * setting as inline `style` on a container element.
 *
 * Usage:
 * ```tsx
 * <div style={paletteToStyleVars(resolvedPalette)}>
 *   {children}
 * </div>
 * ```
 */
export function paletteToStyleVars(
  palette: AnimationThemePalette,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(ANIM_CSS_VAR_MAP)) {
    vars[cssVar] = palette[key as keyof AnimationThemePalette];
  }
  return vars;
}
