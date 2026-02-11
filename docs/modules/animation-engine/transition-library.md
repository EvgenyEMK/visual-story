# Feature: Transition Library

## Module
Animation Engine

## Overview
The transition library provides slide-to-slide transition effects. Unlike element animations (within a slide), transitions animate the change from one slide to the next.

## User Stories

### US-TL-001: Apply Slide Transition
**As a** content creator  
**I want to** add a transition effect between slides  
**So that** the presentation flows smoothly

**Acceptance Criteria:**
- [ ] Select transition from dropdown
- [ ] Preview transition in editor
- [ ] Apply to single slide or all slides
- [ ] Transition duration configurable (0.3s - 2s)

### US-TL-002: Consistent Transition Style
**As a** content creator  
**I want to** apply the same transition to all slides  
**So that** my presentation has visual consistency

**Acceptance Criteria:**
- [ ] "Apply to all" button
- [ ] Option to exclude specific slides
- [ ] Bulk transition change

### US-TL-003: Auto-Selected Transitions
**As a** content creator  
**I want** transitions to be auto-selected based on content  
**So that** I don't have to choose manually

**Acceptance Criteria:**
- [ ] AI selects transitions during generation
- [ ] Transitions match content flow
- [ ] Can override auto-selection

## Transition Library (MVP)

### Basic Transitions
| Transition | Description | Duration | Best For |
|------------|-------------|----------|----------|
| `none` | Instant cut | 0s | Fast-paced content |
| `fade` | Crossfade | 0.5s | Universal, professional |
| `fade-black` | Fade through black | 0.8s | Section breaks |

### Directional Transitions
| Transition | Description | Duration | Best For |
|------------|-------------|----------|----------|
| `slide-left` | New slide enters from right | 0.4s | Forward progression |
| `slide-right` | New slide enters from left | 0.4s | Backward reference |
| `slide-up` | New slide enters from bottom | 0.4s | Building up content |
| `slide-down` | New slide enters from top | 0.4s | Revealing content |

### Dynamic Transitions
| Transition | Description | Duration | Best For |
|------------|-------------|----------|----------|
| `zoom-in` | Zoom into new slide | 0.5s | Focus, drill-down |
| `zoom-out` | Zoom out to new slide | 0.5s | Overview, context |
| `morph` | Shared elements animate between slides | 0.6s | Connected content |

## Technical Specifications

### Transition Schema

> **Implementation**: See `src/types/animation.ts` for TransitionConfig interface and TransitionType union type (none, fade, fade-black, slide, zoom, morph)

### Remotion Implementation

> **Implementation**: See `src/remotion/transitions/SlideTransition.tsx` for the transition wrapper component handling fade, slide, and other transition effects using Remotion's `interpolate` and `Easing`

### Transition Sequencing

> **Implementation**: See `src/remotion/compositions/Presentation.tsx` for the full presentation composition that calculates frame ranges and sequences slides with their transitions

### Morph Transition (Advanced)

> **Implementation**: See `src/types/animation.ts` for MorphConfig interface and shared element identification logic

## Dependencies
- Remotion for transition rendering
- Timeline View for transition visualization
- Slide data model

## Related Features
- [Animation Templates](./animation-templates.md)
- [Timeline View](../story-editor/timeline-view.md)
