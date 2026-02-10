# Feature: Animation Templates

## Module
Animation Engine

## Overview
Animation templates are pre-built animation patterns that define how elements appear, move, and transition within a slide. Templates provide professional motion design without requiring animation expertise.

## User Stories

### US-AT-001: Browse Animation Templates
**As a** content creator  
**I want to** browse available animation templates  
**So that** I can choose an appropriate style for my slide

**Acceptance Criteria:**
- [ ] Template gallery with visual previews
- [ ] Categories: Minimal, Dynamic, Professional, Playful
- [ ] Search/filter by name or style
- [ ] Preview animation on hover

### US-AT-002: Apply Template to Slide
**As a** content creator  
**I want to** apply a template to my current slide  
**So that** all elements animate according to the template pattern

**Acceptance Criteria:**
- [ ] One-click apply template
- [ ] Template overrides individual element animations
- [ ] Undo support
- [ ] Keep content, change only animation

### US-AT-003: Preview Template Before Apply
**As a** content creator  
**I want to** preview how a template will look with my content  
**So that** I can make an informed choice

**Acceptance Criteria:**
- [ ] Preview modal shows template with actual slide content
- [ ] Play/pause preview animation
- [ ] Side-by-side comparison option

## Template Library (MVP)

### Category: Minimal
| Template | Description | Best For |
|----------|-------------|----------|
| `fade-simple` | Elements fade in sequentially | Clean, professional content |
| `slide-up` | Elements slide up from bottom | Lists, bullet points |
| `typewriter` | Text appears character by character | Quotes, emphasis |

### Category: Dynamic
| Template | Description | Best For |
|----------|-------------|----------|
| `bounce-in` | Elements bounce into position | Energetic, fun content |
| `scale-pop` | Elements scale from 0 with overshoot | Announcements, highlights |
| `slide-scatter` | Elements slide in from different directions | Complex diagrams |

### Category: Professional
| Template | Description | Best For |
|----------|-------------|----------|
| `corporate-fade` | Subtle fade with slight movement | Business presentations |
| `reveal-left` | Content reveals from left to right | Process flows |
| `stack-build` | Elements stack vertically with timing | Hierarchies, lists |

### Category: Storytelling
| Template | Description | Best For |
|----------|-------------|----------|
| `cinematic-fade` | Slow, dramatic fades | Emotional content |
| `focus-zoom` | Zoom into key element | Emphasis, callouts |
| `narrative-flow` | Connected element transitions | Story sequences |

## Technical Specifications

### Template Definition Schema
```typescript
interface AnimationTemplate {
  id: string;
  name: string;
  category: 'minimal' | 'dynamic' | 'professional' | 'storytelling';
  description: string;
  previewUrl: string;
  
  // Default timing
  defaultDuration: number; // seconds
  
  // Element animation rules
  elementAnimations: {
    // Apply to elements by type or role
    selector: ElementSelector;
    animation: AnimationSequence;
  }[];
  
  // Slide-level settings
  backgroundColor?: string;
  transition?: TransitionConfig;
}

interface ElementSelector {
  type?: 'text' | 'icon' | 'shape' | 'image';
  role?: 'title' | 'body' | 'accent' | 'background';
  index?: number; // nth element of type
}

interface AnimationSequence {
  keyframes: Keyframe[];
  duration: number;
  delay: number | 'stagger'; // 'stagger' = auto-calculate based on order
  easing: EasingFunction;
}

interface Keyframe {
  offset: number; // 0-1
  opacity?: number;
  transform?: string;
  filter?: string;
}
```

### Template Application Logic
```typescript
function applyTemplate(slide: Slide, template: AnimationTemplate): Slide {
  const updatedElements = slide.elements.map((element, index) => {
    // Find matching animation rule
    const rule = template.elementAnimations.find(rule => 
      matchesSelector(element, rule.selector, index)
    );
    
    if (!rule) return element;
    
    // Calculate actual delay if staggered
    const delay = rule.animation.delay === 'stagger'
      ? index * 0.15 // 150ms stagger
      : rule.animation.delay;
    
    return {
      ...element,
      animation: {
        ...rule.animation,
        delay,
      },
    };
  });
  
  return {
    ...slide,
    elements: updatedElements,
    duration: template.defaultDuration,
    transition: template.transition,
  };
}
```

### Remotion Implementation
```typescript
// Template rendered as Remotion composition
const FadeSimpleTemplate: React.FC<{ slide: Slide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;
  
  return (
    <AbsoluteFill>
      {slide.elements.map((element, i) => {
        const delay = i * 0.15 * fps;
        const opacity = interpolate(
          frame,
          [delay, delay + 15],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );
        
        return (
          <div key={element.id} style={{ opacity }}>
            <ElementRenderer element={element} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

## Dependencies
- Remotion for animation rendering
- Template preview generator
- Slide Canvas for application

## Related Features
- [Auto Animation](./auto-animation.md)
- [Transition Library](./transition-library.md)
- [Slide Canvas](../story-editor/slide-canvas.md)
