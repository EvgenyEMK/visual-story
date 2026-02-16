# Theming

> **Parent module:** [Slide Editor](../README.md)
> **Status:** `ToDo`
> **MVP:** Yes

## Purpose

Theming covers the visual identity of the entire presentation — choosing pre-built themes, customizing colors and fonts, and ensuring visual consistency across all slides. Theme changes propagate to every slide, every element, and every animation, providing a "one-click transformation" of the entire deck's look and feel.

## UI Touchpoints

| UI Zone | Role | What Happens Here |
|---------|------|-------------------|
| **Top Bar** | **Primary** | Theme selector dropdown, quick theme switch |
| **Side Panel** | Secondary | Theme customization (colors, fonts) when "Customize" is active |
| **Canvas** | Secondary | Real-time preview of theme changes across all elements |

## Features

| ID | Feature | Description | MVP | Status |
|----|---------|-------------|-----|--------|
| TH-F01 | [Theme Selection](#th-f01-theme-selection) | Choose from pre-built themes | Yes | `ToDo` |
| TH-F02 | [Theme Color Customization](#th-f02-theme-color-customization) | Customize primary, accent, background, and text colors | Yes | `ToDo` |
| TH-F03 | [Font Selection](#th-f03-font-selection) | Choose heading and body fonts for the presentation | Yes | `ToDo` |
| TH-F04 | [Dark / Light Mode](#th-f04-dark--light-mode) | Toggle between dark and light base modes for the presentation | No | `ToDo` |
| TH-F05 | [Brand Kit](#th-f05-brand-kit) | Save and reuse custom brand themes across projects (Phase 2) | No | `ToDo` |

---

## User Stories

### TH-F01: Theme Selection

#### US-TH-001: Choose a Pre-Built Theme — `ToDo`
**As a** business user,
**I want to** select a visual theme for my presentation from a gallery,
**so that** all slides get a consistent professional look with one click.

**Acceptance Criteria:**
- [ ] "Theme" dropdown in the top bar
- [ ] Theme gallery with 5-8 pre-built themes (light corporate, dark tech, creative, minimal, etc.)
- [ ] Clicking a theme applies it to all slides immediately
- [ ] Canvas updates in real-time to show the new theme
- [ ] Undo reverts the theme change

#### US-TH-002: Preview Theme Before Applying — `ToDo`
**As a** business user,
**I want to** preview how a theme will look before committing to it,
**so that** I can compare options without disrupting my current work.

**Acceptance Criteria:**
- [ ] Hovering over a theme thumbnail shows a preview on the canvas
- [ ] Preview is temporary — leaving the hover restores the current theme
- [ ] Click to apply permanently

---

### TH-F02: Theme Color Customization

#### US-TH-003: Customize Theme Colors — `ToDo`
**As a** business user,
**I want to** customize the primary and accent colors of the current theme,
**so that** the presentation matches my brand.

**Acceptance Criteria:**
- [ ] "Customize" option in the theme dropdown opens color settings in the side panel
- [ ] Color pickers for: primary, accent, background, text, heading
- [ ] Changes preview in real-time on the canvas
- [ ] Custom theme saved to the project

#### US-TH-004: Reset to Default Theme Colors — `ToDo`
**As a** business user,
**I want to** reset customized colors back to the theme defaults,
**so that** I can start over if my customizations don't look right.

**Acceptance Criteria:**
- [ ] "Reset" button restores the selected theme's default colors
- [ ] Reset is undoable

---

### TH-F03: Font Selection

#### US-TH-005: Choose Presentation Fonts — `ToDo`
**As a** business user,
**I want to** select heading and body fonts for my presentation,
**so that** the typography matches my brand or preferred style.

**Acceptance Criteria:**
- [ ] Font picker for heading font and body font
- [ ] 10-15 curated font pairs available (Google Fonts)
- [ ] Font change applies to all slides and elements globally
- [ ] Individual elements can override the global font

---

### TH-F04: Dark / Light Mode

#### US-TH-006: Toggle Presentation Base Mode — `ToDo`
**As a** business user,
**I want to** switch between a dark and light base mode for my presentation,
**so that** I can create presentations optimized for different viewing contexts.

**Acceptance Criteria:**
- [ ] Toggle: Light / Dark in the theme settings
- [ ] Switching mode updates background colors, text contrast, and animation theme palette
- [ ] All pre-built themes available in both modes

---

### TH-F05: Brand Kit

#### US-TH-007: Save Custom Brand Theme — `ToDo`
**As a** business user,
**I want to** save my customized theme as a reusable brand kit,
**so that** I can apply it consistently across all my presentations.

**Acceptance Criteria:**
- [ ] "Save as Brand" button in theme customization
- [ ] Brand kit includes: colors, fonts, logo placement rules
- [ ] Saved brand kits appear in the theme gallery for future projects
- [ ] Team tier: shared brand kits across workspace members

---

## Technical References

- [_reference/animations/](../_reference/animations/) — Animation theme system (semantic color roles, CSS variables, light/dark palettes)

## Dependencies

- Zustand `project-store` (theme configuration per project)
- Animation engine (theme colors propagate to animation palettes)
- All other feature clusters (theme affects every visual element)
