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

```typescript
interface IconSuggestion {
  elementId: string; // which element to enhance
  suggestions: SuggestedIcon[];
  reasoning: string;
}

interface SuggestedIcon {
  iconName: string;
  iconSet: 'lucide' | 'heroicons' | 'phosphor';
  relevanceScore: number;
  category: string;
}

async function suggestIcons(slide: Slide): Promise<IconSuggestion[]> {
  const suggestions: IconSuggestion[] = [];
  
  for (const element of slide.elements) {
    if (element.type === 'text' && !hasAssociatedIcon(element)) {
      // Extract keywords from text
      const keywords = extractKeywords(element.content);
      
      // Match against icon library
      const matches = await matchIconsToKeywords(keywords);
      
      if (matches.length > 0) {
        suggestions.push({
          elementId: element.id,
          suggestions: matches.slice(0, 5),
          reasoning: `Icons related to: ${keywords.join(', ')}`,
        });
      }
    }
  }
  
  return suggestions;
}
```

### Icon Matching with AI

```typescript
const iconMatchingPrompt = `
Given this text content from a presentation slide, suggest relevant icons.

Text: "${elementContent}"

Available icon categories: business, technology, communication, education, arrows, people, abstract

Return JSON:
{
  "suggestions": [
    {
      "iconName": "<lucide icon name>",
      "category": "<category>",
      "reasoning": "<why this icon fits>"
    }
  ]
}

Suggest 3-5 icons that visually represent the concept. Prefer specific over generic icons.
`;
```

### Icon Library Index

```typescript
// Pre-built searchable index
interface IconIndex {
  icons: IconEntry[];
}

interface IconEntry {
  name: string;
  set: string;
  category: string;
  tags: string[]; // searchable keywords
  svg: string; // SVG content
}

// Example entries
const iconLibrary: IconEntry[] = [
  {
    name: 'trending-up',
    set: 'lucide',
    category: 'business',
    tags: ['growth', 'increase', 'chart', 'progress', 'success', 'profit'],
    svg: '<svg>...</svg>',
  },
  {
    name: 'lightbulb',
    set: 'lucide',
    category: 'education',
    tags: ['idea', 'innovation', 'thinking', 'creative', 'insight'],
    svg: '<svg>...</svg>',
  },
  // ... 300+ icons
];

function searchIcons(query: string): IconEntry[] {
  const normalizedQuery = query.toLowerCase();
  
  return iconLibrary
    .filter(icon => 
      icon.name.includes(normalizedQuery) ||
      icon.tags.some(tag => tag.includes(normalizedQuery))
    )
    .sort((a, b) => {
      // Exact name match first
      const aNameMatch = a.name === normalizedQuery ? 1 : 0;
      const bNameMatch = b.name === normalizedQuery ? 1 : 0;
      return bNameMatch - aNameMatch;
    })
    .slice(0, 20);
}
```

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

```typescript
interface IconPanelProps {
  slide: Slide;
  onAddIcon: (elementId: string | null, icon: IconEntry) => void;
}

const IconPanel: React.FC<IconPanelProps> = ({ slide, onAddIcon }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IconSuggestion[]>([]);
  
  useEffect(() => {
    // Generate suggestions when slide changes
    suggestIcons(slide).then(setSuggestions);
  }, [slide]);
  
  const searchResults = searchQuery 
    ? searchIcons(searchQuery) 
    : [];
  
  return (
    <div className="space-y-4">
      <SearchInput 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search icons..."
      />
      
      {searchQuery ? (
        <IconGrid 
          icons={searchResults} 
          onSelect={(icon) => onAddIcon(null, icon)} 
        />
      ) : (
        <>
          {suggestions.map(suggestion => (
            <SuggestionGroup
              key={suggestion.elementId}
              suggestion={suggestion}
              onSelect={(icon) => onAddIcon(suggestion.elementId, icon)}
            />
          ))}
          <RecentIcons onSelect={(icon) => onAddIcon(null, icon)} />
        </>
      )}
    </div>
  );
};
```

## Phase 2: Image Generation

In Phase 2, we plan to add AI image generation:

```typescript
// Future: Image generation via DALL-E or Midjourney API
interface ImageGenerationRequest {
  prompt: string;
  style: 'realistic' | 'illustration' | 'abstract';
  aspectRatio: '16:9' | '1:1' | '4:3';
}

// Not in MVP - placeholder for future
async function generateImage(request: ImageGenerationRequest): Promise<string> {
  // TODO: Implement in Phase 2
  throw new Error('Image generation not available in MVP');
}
```

## Dependencies
- Lucide React for icon components
- Icon index/search system
- OpenAI API for smart suggestions

## Related Features
- [Script Feedback](./script-feedback.md)
- [Asset Generation](./asset-generation.md)
- [Element Properties](../story-editor/element-properties.md)
