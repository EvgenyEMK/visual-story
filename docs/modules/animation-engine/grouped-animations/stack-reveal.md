# The "Stack Reveal" (Z-Axis)

## Overview

A stack of "cards" arranged in 3D perspective, as if lying on a table with depth. Cards fly toward the camera one at a time, leveling out to face the audience with their content, then fly off-screen to reveal the next card in the stack. The 3D depth creates a tactile, high-energy experience.

## Visual Behavior

### Layout

The slide features a **stack of cards** rendered with CSS 3D perspective, positioned center-stage. The stack appears to have physical depth — back cards are slightly offset, smaller, and darker, creating a natural sense of thickness. Only the front card is fully visible and readable. The stack uses `perspective: 800px` for a convincing 3D effect without extreme distortion.

### Animation Sequence

1. **Initial state**: The stack of cards is visible in perspective at the center of the slide. The top card is slightly tilted to hint at 3D depth. Back cards peek out from behind at staggered offsets.
2. **Step 1 (Item 1 appears)**: The top card flies toward the camera (translateZ increases), levels out from its tilted position (rotateX: 15° → 0°), and settles face-on to the audience. Its full content (icon, title, description) is now readable.
3. **Step 2 (Item 1 transitions, Item 2 appears)**: Item 1's card flies off-screen to the left (or right), using a swift translateX + slight rotateY motion. The next card in the stack (Item 2) advances forward and levels out.
4. **Step N (Item N-1 transitions, Item N appears)**: The previous card flies off. The next card flies to front.
5. **Final state**: The last card is displayed face-on. The stack is depleted — all cards have been shown.

### Visual Layout Diagram

```
       ┌─────────┐
      ┌┤  Card 3  │  ← stack behind
     ┌┤├─────────┘
    ┌┤│ Card 2   │
    │├─────────┘
    │  Card 1    │  ← flies to front
    └────────────┘
```

## Trigger Modes

### Auto Mode

- Steps advance every `stepDuration` ms (default: 1600ms)
- Each step consists of the current front card flying off-screen and the next card advancing from the stack
- The fly-off and fly-forward animations slightly overlap for seamless transitions
- Voice-sync timestamps (when available) trigger each card reveal
- After the final card, it remains displayed for the rest of the slide duration

### Click Mode

- Each click advances to the next card
- **Hover on inactive items**: Hovering the stack area shows a subtle "peek" of the next card's title — the top of the next card slides up slightly to reveal its heading
- **Click on inactive item**: Click advances to the next card in sequence; swipe gestures are also supported on touch devices (swipe left = next, swipe right = previous)
- **Keyboard**: → or Space = next, ← = previous
- After the last card is shown, the next click triggers the slide transition

## Parameters

| Parameter           | Type                  | Default  | Range       | Description                                           |
|---------------------|-----------------------|----------|-------------|-------------------------------------------------------|
| `type`              | `GroupedAnimationType` | `stack-reveal` | — | Animation type identifier                              |
| `items`             | `GroupedItem[]`       | —        | 3–8 items   | Ordered list of cards in the stack                    |
| `stepDuration`      | `number`              | `1600`   | 800–3000ms  | Time between steps in auto mode                       |
| `hoverPreview`      | `boolean`             | `true`   | —           | Show peek of next card on hover in click mode         |
| `allowOutOfOrder`   | `boolean`             | `false`  | —           | Stack is sequential — cards are revealed in order     |
| `triggerMode`       | `TriggerMode`         | *inherited* | auto, click | Override slide/project default trigger mode         |
| `perspective`       | `number`              | `800`    | 400–1200px  | CSS perspective value for 3D depth                    |
| `tiltAngle`         | `number`              | `15`     | 5–30°       | Initial rotateX tilt of cards in the stack            |
| `flyDirection`      | `string`              | `left`   | left, right, alternate | Direction cards fly off-screen              |
| `stackOffset`       | `number`              | `4`      | 2–8px       | Pixel offset between stacked cards for depth effect   |

## Best For

- Testimonials and customer quotes
- Card-based content (tips, facts, stats)
- Portfolio pieces and project showcases
- Team member introductions
- "Did you know?" or trivia-style reveals

## Storytelling Value

A 3D-depth layout that feels **tactile and high-energy**. The "dealing cards" metaphor is universally understood and creates a sense of **anticipation** for what's on the next card. Each card gets the audience's full, undivided attention — unlike grid or list layouts, there's no visual competition from other items. The physical metaphor (a stack of cards) makes the interaction feel natural and even playful, which is ideal for lighter content like testimonials or team introductions.

## Implementation

| Artifact        | Path                                                              |
|-----------------|-------------------------------------------------------------------|
| Demo component  | `src/components/transitions-demo/GroupedSection.tsx` → `StackRevealDemo` |
| Catalog entry   | `src/config/transition-catalog.ts` → `GROUPED_ANIMATIONS[5]`     |
| CSS keyframes   | `src/components/transitions-demo/demo-animations.css`             |

**CSS Note**: Uses `perspective: 800px`, `rotateX`, `translateZ` for the 3D card stack effect. Card fly-off uses `translateX` combined with slight `rotateY` for a natural "flick" motion.

## Related Animations

- [Carousel Focus](./carousel-focus.md) — 2D alternative with a shelf metaphor instead of depth
- [Perspective Pivot](./perspective-pivot.md) — 3D alternative using cube rotation instead of card stacking
- [Fan-Out](./fan-out.md) — arc-based alternative where all items are visible simultaneously
