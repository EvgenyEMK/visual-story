# Feature: Visual Suggestions

## Module
AI Assistant

## Overview
Visual Suggestions provides AI-powered recommendations for icons, images, and visual elements to enhance slides. For MVP, this focuses on suggesting icons from a curated library rather than generating images.

## User Stories

### US-VS-001: Get Icon Suggestions for Slide
**As a** content creator  
**I want to** receive icon suggestions based on my slide content  
**So that** I can add relevant visual elements quickly

**Acceptance Criteria:**
- [ ] Automatic suggestions when slide is generated
- [ ] 3-5 icon options per suggestion
- [ ] One-click to add icon to slide
- [ ] Icons match content intent

### US-VS-002: Search Icon Library
**As a** content creator  
**I want to** search for icons by keyword  
**So that** I can find specific visuals

**Acceptance Criteria:**
- [ ] Search input in icon panel
- [ ] Results from curated library
- [ ] Category filtering
- [ ] Recent icons section

### US-VS-003: Replace Visual Element
**As a** content creator  
**I want to** replace an icon with an alternative  
**So that** I can find the best visual match

**Acceptance Criteria:**
- [ ] Right-click → "Suggest alternatives"
- [ ] AI suggests related icons
- [ ] Preview before replacing
- [ ] Maintains position and size

## Icon Library (MVP)

### Categories
| Category | Icon Count | Examples |
|----------|------------|----------|
| Business | 50+ | Chart, briefcase, handshake, growth |
| Technology | 50+ | Code, cloud, device, security |
| Communication | 30+ | Email, chat, phone, video |
| Education | 30+ | Book, graduation, lightbulb, brain |
| Arrows & Indicators | 40+ | Direction, progress, checkmark |
| People | 30+ | User, team, community |
| Abstract | 40+ | Shapes, patterns, decorative |

### Icon Sources
- **Primary**: Lucide Icons (open source, consistent style)
- **Supplementary**: Heroicons, Phosphor Icons
- **Style**: Outline style for consistency

## Technical Specifications

### Suggestion Algorithm

> **Implementation**: See `src/types/ai.ts` for interfaces (IconSuggestion, SuggestedIcon) and `src/lib/ai/icon-suggestions.ts` for the `suggestIcons` function and AI icon matching prompt

### Icon Library Index

> **Implementation**: See `src/types/ai.ts` for interfaces (IconIndex, IconEntry) and `src/config/icon-library.ts` for the searchable icon library and `searchIcons` function

## UI Components

### Icon Suggestion Panel

```
┌─────────────────────────────────────────────────────────────┐
│  Visual Suggestions                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search icons...                                         │
│                                                             │
│  📌 Suggested for "Increase your productivity"              │
│  ┌─────┬─────┬─────┬─────┬─────┐                           │
│  │ 📈  │ ⚡  │ 🎯  │ 🚀  │ ✓   │                           │
│  │trend│bolt │target│rocket│check│                          │
│  └─────┴─────┴─────┴─────┴─────┘                           │
│  [+ Add to slide]                                           │
│                                                             │
│  📌 Suggested for "Team collaboration"                      │
│  ┌─────┬─────┬─────┬─────┬─────┐                           │
│  │ 👥  │ 🤝  │ 💬  │ 🔗  │ 📋  │                           │
│  │users│hand │chat │link │clip │                            │
│  └─────┴─────┴─────┴─────┴─────┘                           │
│  [+ Add to slide]                                           │
│                                                             │
│  ─────────────────────────────────────                      │
│  Recent Icons                                               │
│  [📈] [💡] [🎯] [👤] [📊]                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Implementation

> **Implementation**: See `src/components/ai/icon-panel.tsx` for the IconPanel component (IconPanelProps, SearchInput, IconGrid, SuggestionGroup, RecentIcons)

## Phase 2: Image Generation

In Phase 2, we plan to add AI image generation.

> **Implementation**: See `src/types/ai.ts` for planned Phase 2 types (ImageGenerationRequest) — not implemented in MVP

## Dependencies
- Lucide React for icon components
- Icon index/search system
- OpenAI API for smart suggestions

## Related Features
- [Script Feedback](./script-feedback.md)
- [Asset Generation](./asset-generation.md)
- [Element Properties](../story-editor/element-properties.md)
