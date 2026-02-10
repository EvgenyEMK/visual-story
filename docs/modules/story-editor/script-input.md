# Feature: Script Input

## Module
Story Editor

## Overview
The script input feature allows users to enter their narrative content that will be transformed into animated slides. It serves as the primary entry point for content creation.

## User Stories

### US-SE-001: Enter Script Text
**As a** content creator  
**I want to** paste or type my script into a text editor  
**So that** I can transform it into an animated presentation

**Acceptance Criteria:**
- [ ] Text area accepts plain text input
- [ ] Supports copy/paste from external sources
- [ ] Auto-saves draft every 30 seconds
- [ ] Character count displayed
- [ ] Section markers (---) recognized for slide breaks

### US-SE-002: Select Content Intent
**As a** content creator  
**I want to** specify the intent/tone of my content  
**So that** the AI can generate appropriate animations and styling

**Acceptance Criteria:**
- [ ] Dropdown with options: Educational, Promotional, Storytelling
- [ ] Intent selection affects template recommendations
- [ ] Can change intent and regenerate

### US-SE-003: Import Script from File
**As a** content creator  
**I want to** upload a text file with my script  
**So that** I don't have to copy/paste long content

**Acceptance Criteria:**
- [ ] Accepts .txt and .md files
- [ ] File size limit: 100KB
- [ ] Preserves formatting and section breaks

## UI Components

```
┌─────────────────────────────────────────────────────────────┐
│  Script Input                                    [Intent ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Your script here...]                                      │
│                                                             │
│  Use --- to mark section breaks                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  1,234 characters │ Auto-saved │ [Upload File] [AI Assist]  │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Component: `ScriptInput`
```typescript
interface ScriptInputProps {
  projectId: string;
  initialValue?: string;
  onSave: (script: string) => Promise<void>;
  onIntentChange: (intent: ContentIntent) => void;
}

type ContentIntent = 'educational' | 'promotional' | 'storytelling';
```

### API Endpoints
- `PUT /api/projects/{id}` - Save script content
- `POST /api/projects/{id}/parse-sections` - Parse script into sections

### Data Model
```typescript
interface ScriptSection {
  id: string;
  order: number;
  content: string;
  wordCount: number;
  estimatedDuration: number; // seconds
}
```

## Dependencies
- None (standalone input component)

## Related Features
- [AI Script Feedback](../ai-assistant/script-feedback.md)
- [Slide Canvas](./slide-canvas.md)
