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
```typescript
interface TransitionConfig {
  type: TransitionType;
  duration: number; // seconds
  easing: EasingType;
  direction?: 'left' | 'right' | 'up' | 'down';
}

type TransitionType = 
  | 'none'
  | 'fade'
  | 'fade-black'
  | 'slide'
  | 'zoom'
  | 'morph';
```

### Remotion Implementation
```typescript
// Transition wrapper component
const SlideTransition: React.FC<{
  transition: TransitionConfig;
  children: React.ReactNode;
  entering: boolean;
}> = ({ transition, children, entering }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = transition.duration * fps;
  
  switch (transition.type) {
    case 'fade':
      return (
        <div style={{
          opacity: entering
            ? interpolate(frame, [0, durationFrames], [0, 1])
            : interpolate(frame, [0, durationFrames], [1, 0]),
        }}>
          {children}
        </div>
      );
      
    case 'slide':
      const offset = entering ? 100 : 0;
      const translateX = interpolate(
        frame,
        [0, durationFrames],
        [offset, 0],
        { easing: Easing.out(Easing.cubic) }
      );
      return (
        <div style={{ transform: `translateX(${translateX}%)` }}>
          {children}
        </div>
      );
      
    // ... other transitions
  }
};
```

### Transition Sequencing
```typescript
// Full presentation composition
const PresentationComposition: React.FC<{ project: Project }> = ({ project }) => {
  const { fps } = useVideoConfig();
  
  // Calculate frame ranges for each slide
  const slideFrames = project.slides.map((slide, index) => {
    const startFrame = project.slides
      .slice(0, index)
      .reduce((acc, s) => acc + (s.duration * fps) + (s.transition.duration * fps), 0);
    
    return {
      slide,
      startFrame,
      endFrame: startFrame + (slide.duration * fps),
      transitionFrames: slide.transition.duration * fps,
    };
  });
  
  return (
    <AbsoluteFill>
      {slideFrames.map(({ slide, startFrame, endFrame, transitionFrames }) => (
        <Sequence
          key={slide.id}
          from={startFrame}
          durationInFrames={endFrame - startFrame + transitionFrames}
        >
          <SlideTransition transition={slide.transition} entering>
            <SlideComposition slide={slide} />
          </SlideTransition>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

### Morph Transition (Advanced)
```typescript
// Morph identifies shared elements and animates them
interface MorphConfig {
  sharedElements: {
    fromElementId: string;
    toElementId: string;
  }[];
}

function identifySharedElements(
  fromSlide: Slide,
  toSlide: Slide
): MorphConfig {
  const shared: MorphConfig['sharedElements'] = [];
  
  // Match elements by similar content or explicit linking
  for (const fromEl of fromSlide.elements) {
    const match = toSlide.elements.find(toEl =>
      toEl.content === fromEl.content ||
      toEl.morphId === fromEl.morphId
    );
    
    if (match) {
      shared.push({
        fromElementId: fromEl.id,
        toElementId: match.id,
      });
    }
  }
  
  return { sharedElements: shared };
}
```

## Dependencies
- Remotion for transition rendering
- Timeline View for transition visualization
- Slide data model

## Related Features
- [Animation Templates](./animation-templates.md)
- [Timeline View](../story-editor/timeline-view.md)
