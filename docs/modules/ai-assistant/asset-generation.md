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

> **Implementation**: See `src/types/ai.ts` (StockImageResult interface) and `src/lib/ai/stock-images.ts` (Unsplash/Pexels search — TODO)

### Placeholder System

> **Implementation**: See `src/types/ai.ts` (PlaceholderConfig), `src/config/placeholder-styles.ts` (placeholder style definitions), and `src/components/ai/image-placeholder.tsx` (ImagePlaceholder component)

## Phase 2: AI Image Generation

### Planned Features

> **Implementation**: See `src/types/ai.ts` for Phase 2 types (ImageGenerationRequest, GeneratedImage) and image generation logic

### Background Generation (Phase 2)

> **Implementation**: See `src/types/ai.ts` for Phase 2 types (BackgroundGenerationRequest) and background generation logic

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
