# Animation & Transition Catalog

> Consolidated reference of all 28 animations and transitions in VisualFlow.
> For detailed specifications, follow the link in each entry's name.

---

## Layer 1 — Element Animations (In-Slide, Atomic Level)

Used to introduce or emphasize a **single element** (text, icon, chart, image) within a slide.

| # | Animation | ID | Description | Best For | Trigger Modes |
|---|-----------|-----|-------------|----------|---------------|
| 1 | [The Smooth Fade](./element-animations/smooth-fade.md) | `smooth-fade` | Elements gradually appear from 0 → 100% opacity | Clean, professional content | Auto / Click |
| 2 | [Staggered Wipe](./element-animations/staggered-wipe.md) | `staggered-wipe` | Bars or text reveal left-to-right via clip-path | Charts, statistics, progress bars | Auto / Click |
| 3 | [Float In (Gentle)](./element-animations/float-in.md) | `float-in` | Elements drift upward while fading in | Feature cards, testimonials | Auto / Click |
| 4 | [The Pulse (Emphasis)](./element-animations/pulse-emphasis.md) | `pulse-emphasis` | Element scales 5–10% then shrinks back | Key metrics, stats, callouts | Auto / Click |
| 5 | [Typewriter Reveal](./element-animations/typewriter-reveal.md) | `typewriter-reveal` | Characters appear one-by-one as if typed | Quotes, problem statements | Auto / Click |
| 6 | [The "Pop" (Zoom)](./element-animations/pop-zoom.md) | `pop-zoom` | Icon scales from 0% with overshoot bounce | Feature highlights, announcements | Auto / Click |
| 7 | [Path Follow (Lines)](./element-animations/path-follow.md) | `path-follow` | Arrow or line draws itself along a path | Process flows, connections | Auto / Click |
| 8 | [Color Shift](./element-animations/color-shift.md) | `color-shift` | Grayed-out element turns full brand color | Before/after, feature activation | Auto / Click |
| 9 | [Masked Reveal](./element-animations/masked-reveal.md) | `masked-reveal` | Content appears from behind invisible curtain | Product images, hero visuals | Auto / Click |
| 10 | [The Shimmer](./element-animations/shimmer.md) | `shimmer` | Subtle light streak passes over element | CTAs, buttons, key terms | Auto / Click |
| 11 | [Slide Title](./element-animations/slide-title.md) | `slide-title` | Structured slide header: title + subtitle + right status | Slide headers, section openers | Auto / Click |
| 12 | [Zoom-In Word Reveal](./element-animations/zoom-in-word.md) | `zoom-in-word` | Words appear one by one zooming in from behind | Section openers, dramatic statements | Auto / Click |

---

## Layer 2 — Grouped Item Animations (In-Slide, Multi-Element)

Used to present **multiple related items** (features, steps, concepts) within a single slide using coordinated layout and sequencing.

| # | Animation | ID | Description | Best For | Trigger Modes |
|---|-----------|-----|-------------|----------|---------------|
| 1 | [The "List Accumulator"](./grouped-animations/list-accumulator.md) | `list-accumulator` | Hero item in center → shrinks to sidebar list → next hero | Feature lists, agenda items | Auto / Click / Hover |
| 2 | [The "Carousel Focus"](./grouped-animations/carousel-focus.md) | `carousel-focus` | Bottom shelf of items; one lifts to center stage | Product features, plan comparisons | Auto / Click / Hover |
| 3 | [The "Bento Grid Expansion"](./grouped-animations/bento-grid-expansion.md) | `bento-grid-expansion` | Grid of equal boxes; one expands to fill 70% | Feature grids, dashboards | Auto / Click / Hover |
| 4 | [The "Circular Satellite"](./grouped-animations/circular-satellite.md) | `circular-satellite` | Satellites emerge from core and orbit to positions | Ecosystem diagrams, related concepts | Auto / Click / Hover |
| 5 | [The "Infinite Path"](./grouped-animations/infinite-path.md) | `infinite-path` | Items assemble on scrolling horizontal road | Timelines, roadmaps, step-by-step | Auto / Click / Hover |
| 6 | [The "Stack Reveal"](./grouped-animations/stack-reveal.md) | `stack-reveal` | 3D card stack; top card flies forward then away | Testimonials, card-based content | Auto / Click / Hover |
| 7 | [The "Fan-Out"](./grouped-animations/fan-out.md) | `fan-out` | Single icon splits into arc of 3–5 cards | Feature suites, tool collections | Auto / Click / Hover |
| 8 | [The "Molecular Bond"](./grouped-animations/molecular-bond.md) | `molecular-bond` | Child bubbles bud from central node with growing lines | Mind maps, concept relationships | Auto / Click / Hover |
| 9 | [The "Perspective Pivot"](./grouped-animations/perspective-pivot.md) | `perspective-pivot` | 3D cube rotates to reveal content on each face | Multi-faceted concepts, comparisons | Auto / Click / Hover |
| 10 | [The "Magnifying Glass"](./grouped-animations/magnifying-glass.md) | `magnifying-glass` | Lens moves over blurred canvas, enlarging items | Complex diagrams, overview + detail | Auto / Click / Hover |
| 11 | [Items Grid](./grouped-animations/items-grid.md) | `items-grid` | Configurable row/column grid with one-by-one or opacity-highlight modes | Section overviews, topic structure | Auto / Click / Hover |

---

## Layer 3 — Slide Transitions (Between Slides)

Used to visually connect **Slide N → Slide N+1** into a continuous narrative thread.

| # | Transition | ID | Description | Best For | Trigger Modes |
|---|-----------|-----|-------------|----------|---------------|
| 1 | [The "Morph" (Smart Move)](./slide-transitions/morph-smart-move.md) | `morph-smart-move` | Shared elements glide to new positions between slides | Continuous narratives | Auto / Click |
| 2 | [The Push (Directional)](./slide-transitions/push-directional.md) | `push-directional` | Slide A pushes Slide B in from the side | Timelines, progress sequences | Auto / Click |
| 3 | [The Pan (Cinematic)](./slide-transitions/pan-cinematic.md) | `pan-cinematic` | Camera pans across a large virtual canvas | Landscape overviews, concept maps | Auto / Click |
| 4 | [The Zoom (Focus)](./slide-transitions/zoom-focus.md) | `zoom-focus` | Camera dives into a detail, expanding to next slide | Detail drill-downs, big-picture → detail | Auto / Click |
| 5 | [The Cross-Fade](./slide-transitions/cross-fade.md) | `cross-fade` | Simple, elegant opacity blend between slides | Chapter changes, topic shifts | Auto / Click |

---

## Quick Reference — Choosing the Right Animation

### By Content Type

| Content | Recommended Element Anim. | Recommended Grouped Anim. | Recommended Slide Trans. |
|---------|--------------------------|---------------------------|--------------------------|
| Title slide | Slide Title, Smooth Fade, Masked Reveal | — | Cross-Fade |
| Section opener | Zoom-In Word Reveal, Slide Title | Items Grid | Cross-Fade, Morph |
| Feature list | Float In | List Accumulator, Carousel Focus | Push |
| Topic structure | — | Items Grid | Morph (grid → sidebar) |
| Data/charts | Staggered Wipe | Bento Grid | Morph |
| Process flow | Path Follow | Infinite Path | Push |
| Key stat | Pulse Emphasis | — | Zoom Focus |
| Quote | Typewriter Reveal | — | Cross-Fade |
| Product launch | Pop Zoom, Shimmer | Fan-Out, Stack Reveal | Zoom Focus |
| Ecosystem | Color Shift | Circular Satellite, Molecular Bond | Pan |
| Comparison | Color Shift | Perspective Pivot, Bento Grid | Morph |
| Complex diagram | — | Magnifying Glass | Pan |

### By Presentation Style

| Style | Element Animations | Grouped Animations | Slide Transitions |
|-------|-------------------|-------------------|-------------------|
| **Minimal / Corporate** | Slide Title, Smooth Fade, Float In | List Accumulator, Bento Grid, Items Grid | Cross-Fade, Push |
| **Dynamic / Energetic** | Zoom-In Word Reveal, Pop Zoom, Shimmer | Fan-Out, Stack Reveal, Items Grid | Zoom Focus, Push |
| **Storytelling / Cinematic** | Zoom-In Word Reveal, Masked Reveal, Path Follow | Infinite Path, Magnifying Glass | Pan, Morph |
| **Data-Heavy / Analytical** | Slide Title, Staggered Wipe, Color Shift | Carousel Focus, Bento Grid | Morph, Cross-Fade |

---

## Implementation References

| Artifact | Path |
|----------|------|
| Transition catalog (code) | `src/config/transition-catalog.ts` |
| CSS keyframes | `src/components/transitions-demo/demo-animations.css` |
| Demo page | `src/app/[locale]/(app)/transitions-demo/page.tsx` |
| Element animation demos | `src/components/transitions-demo/InSlideSection.tsx` |
| Grouped animation demos | `src/components/transitions-demo/GroupedSection.tsx` |
| Slide transition demos | `src/components/transitions-demo/SlideTransitionSection.tsx` |
| Remotion element wrapper | `src/remotion/elements/AnimatedElement.tsx` |
| Remotion slide transition | `src/remotion/transitions/SlideTransition.tsx` |
| Animation types | `src/types/animation.ts` |
