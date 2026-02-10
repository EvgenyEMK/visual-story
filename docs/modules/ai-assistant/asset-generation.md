# Feature: Asset Generation

## Module
AI Assistant

## Overview
Asset Generation covers AI-powered creation of visual assets for slides, including background images, illustrations, and decorative elements. For MVP, this feature is scoped to placeholder images and stock library integration, with full AI generation planned for Phase 2.

## Status
**MVP**: Stock library + placeholders only
**Phase 2**: Full AI image generation

## User Stories

### US-AG-001: Add Placeholder Image (MVP)
**As a** content creator  
**I want to** add placeholder images to my slides  
**So that** I can visualize the layout before final assets

**Acceptance Criteria:**
- [ ] Placeholder with appropriate aspect ratio
- [ ] Label indicating "Replace with image"
- [ ] Easy to swap with final image later
- [ ] Multiple placeholder styles (photo, illustration, abstract)

### US-AG-002: Search Stock Images (MVP)
**As a** content creator  
**I want to** search for stock images  
**So that** I can find relevant visuals quickly

**Acceptance Criteria:**
- [ ] Search input with keyword search
- [ ] Results from free stock library (Unsplash/Pexels)
- [ ] Preview before adding
- [ ] Automatic attribution handling

### US-AG-003: Generate Custom Image (Phase 2)
**As a** content creator  
**I want to** generate custom images from a description  
**So that** I can get unique visuals that match my content

**Acceptance Criteria:**
- [ ] Text prompt input
- [ ] Style selection (realistic, illustration, abstract)
- [ ] 2-4 variations generated
- [ ] Edit/regenerate options

### US-AG-004: Generate Slide Background (Phase 2)
**As a** content creator  
**I want to** generate a custom background for my slide  
**So that** it matches my content theme

**Acceptance Criteria:**
- [ ] Auto-suggest based on slide content
- [ ] Subtle/non-distracting by default
- [ ] Color scheme matching
- [ ] Gradient and pattern options

## MVP Implementation

### Stock Image Integration

```typescript
interface StockImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  source: 'unsplash' | 'pexels';
  width: number;
  height: number;
}

// Unsplash API integration
async function searchUnsplash(query: string): Promise<StockImageResult[]> {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  );
  
  const data = await response.json();
  
  return data.results.map((photo: any) => ({
    id: photo.id,
    url: photo.urls.regular,
    thumbnailUrl: photo.urls.thumb,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    source: 'unsplash',
    width: photo.width,
    height: photo.height,
  }));
}
```

### Placeholder System

```typescript
interface PlaceholderConfig {
  type: 'photo' | 'illustration' | 'abstract' | 'pattern';
  aspectRatio: '16:9' | '4:3' | '1:1' | 'auto';
  label?: string;
}

const placeholderStyles = {
  photo: {
    background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
    icon: 'image',
    label: 'Add photo',
  },
  illustration: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    icon: 'palette',
    label: 'Add illustration',
  },
  abstract: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    icon: 'shapes',
    label: 'Add graphic',
  },
  pattern: {
    background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #ffffff 10px, #ffffff 20px)',
    icon: 'grid',
    label: 'Add pattern',
  },
};

const ImagePlaceholder: React.FC<{ config: PlaceholderConfig }> = ({ config }) => {
  const style = placeholderStyles[config.type];
  
  return (
    <div 
      className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
      style={{ 
        background: style.background,
        aspectRatio: config.aspectRatio === 'auto' ? undefined : config.aspectRatio.replace(':', '/'),
      }}
    >
      <div className="text-center text-gray-500">
        <Icon name={style.icon} className="w-8 h-8 mx-auto mb-2" />
        <span className="text-sm">{config.label || style.label}</span>
      </div>
    </div>
  );
};
```

## Phase 2: AI Image Generation

### Planned Features

```typescript
// Phase 2 implementation
interface ImageGenerationRequest {
  prompt: string;
  style: 'photorealistic' | 'illustration' | 'abstract' | 'minimalist';
  colorScheme?: string[]; // hex colors to incorporate
  aspectRatio: '16:9' | '1:1' | '4:3';
  count: 1 | 2 | 4;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  revisedPrompt: string;
  style: string;
}

async function generateImage(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
  // Using OpenAI DALL-E 3
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: buildImagePrompt(request),
    n: request.count,
    size: aspectRatioToSize(request.aspectRatio),
    quality: 'standard',
    style: request.style === 'photorealistic' ? 'natural' : 'vivid',
  });
  
  // Upload to R2 and return URLs
  return Promise.all(
    response.data.map(async (image) => ({
      id: generateId(),
      url: await uploadToR2(image.url),
      prompt: request.prompt,
      revisedPrompt: image.revised_prompt,
      style: request.style,
    }))
  );
}

function buildImagePrompt(request: ImageGenerationRequest): string {
  let prompt = request.prompt;
  
  // Add style modifiers
  switch (request.style) {
    case 'illustration':
      prompt += ', digital illustration style, clean vector-like';
      break;
    case 'abstract':
      prompt += ', abstract geometric shapes, modern design';
      break;
    case 'minimalist':
      prompt += ', minimalist design, simple clean composition, lots of whitespace';
      break;
  }
  
  // Add color guidance
  if (request.colorScheme?.length) {
    prompt += `, color palette: ${request.colorScheme.join(', ')}`;
  }
  
  // Add quality modifiers
  prompt += ', high quality, professional, suitable for presentation';
  
  return prompt;
}
```

### Background Generation (Phase 2)

```typescript
interface BackgroundGenerationRequest {
  slideContent: string;
  style: 'gradient' | 'pattern' | 'abstract' | 'subtle-photo';
  colorScheme: string[];
}

async function generateBackground(request: BackgroundGenerationRequest): Promise<string> {
  if (request.style === 'gradient') {
    // Generate CSS gradient
    return generateGradient(request.colorScheme);
  }
  
  if (request.style === 'pattern') {
    // Generate SVG pattern
    return generatePattern(request.colorScheme);
  }
  
  // AI-generated background
  const prompt = `Abstract background for presentation about: ${request.slideContent}. 
    Style: ${request.style}, subtle and non-distracting, suitable as slide background`;
  
  const result = await generateImage({
    prompt,
    style: 'abstract',
    colorScheme: request.colorScheme,
    aspectRatio: '16:9',
    count: 1,
  });
  
  return result[0].url;
}
```

## UI Components

### Image Asset Panel (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│  Images & Backgrounds                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search stock images...                                  │
│                                                             │
│  Quick Add                                                  │
│  ┌────────┬────────┬────────┬────────┐                     │
│  │ 📷     │ 🎨     │ 🔷     │ ▦      │                     │
│  │ Photo  │ Illust │Abstract│Pattern │                     │
│  │ place- │ place- │ place- │ place- │                     │
│  │ holder │ holder │ holder │ holder │                     │
│  └────────┴────────┴────────┴────────┘                     │
│                                                             │
│  Recent Searches                                            │
│  [technology] [teamwork] [growth]                           │
│                                                             │
│  ─────────────────────────────────────                      │
│  Stock Results: "technology"                                │
│  ┌─────┬─────┬─────┬─────┐                                 │
│  │ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │                                 │
│  └─────┴─────┴─────┴─────┘                                 │
│  ┌─────┬─────┬─────┬─────┐                                 │
│  │ 🖼️  │ 🖼️  │ 🖼️  │ 🖼️  │                                 │
│  └─────┴─────┴─────┴─────┘                                 │
│  [Load more...]                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Cost Considerations

### MVP (Stock Images)
- **Unsplash API**: Free (with attribution)
- **Pexels API**: Free (with attribution)

### Phase 2 (AI Generation)
- **DALL-E 3**: $0.04-0.08 per image (standard quality)
- **Budget per video**: ~$0.20-0.40 for 5-10 custom images
- **Mitigation**: Cache common backgrounds, limit generations per project

## Dependencies
- Unsplash API
- Pexels API (backup)
- OpenAI DALL-E (Phase 2)
- Cloudflare R2 for storage

## Related Features
- [Visual Suggestions](./visual-suggestions.md)
- [Element Properties](../story-editor/element-properties.md)
- [Slide Canvas](../story-editor/slide-canvas.md)
