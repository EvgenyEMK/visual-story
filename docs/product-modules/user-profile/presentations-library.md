# Feature: Presentations Library

## Module
User Management

## Overview
The Presentations Library is the user's dashboard for managing all their VisualFlow presentations. It provides presentation listing, creation, organization, and basic presentation management functions.

## User Stories

### US-PL-001: View All Presentations
**As a** user  
**I want to** see all my presentations in one place  
**So that** I can find and access them easily

**Acceptance Criteria:**
- [ ] Grid or list view of presentations
- [ ] Presentation thumbnail preview
- [ ] Presentation name and last modified date
- [ ] Sort by name, date created, date modified
- [ ] Search presentations by name

### US-PL-002: Create New Presentation
**As a** user  
**I want to** create a new presentation  
**So that** I can start building a new presentation

**Acceptance Criteria:**
- [ ] "New Presentation" button
- [ ] Presentation name input
- [ ] Optional: start from template
- [ ] Creates presentation and opens editor

### US-PL-003: Open Existing Presentation
**As a** user  
**I want to** open a presentation  
**So that** I can continue editing

**Acceptance Criteria:**
- [ ] Click presentation card to open
- [ ] Opens in editor view
- [ ] Loads presentation state

### US-PL-004: Rename Presentation
**As a** user  
**I want to** rename a presentation  
**So that** I can keep my library organized

**Acceptance Criteria:**
- [ ] Rename option in presentation menu
- [ ] Inline rename on presentation card
- [ ] Save on Enter or blur

### US-PL-005: Duplicate Presentation
**As a** user  
**I want to** duplicate a presentation  
**So that** I can create variations

**Acceptance Criteria:**
- [ ] Duplicate option in presentation menu
- [ ] Creates copy with "(Copy)" suffix
- [ ] Copies all slides and settings
- [ ] Does not copy published state

### US-PL-006: Delete Presentation
**As a** user  
**I want to** delete a presentation  
**So that** I can remove presentations I no longer need

**Acceptance Criteria:**
- [ ] Delete option in presentation menu
- [ ] Confirmation dialog
- [ ] Soft delete with 30-day recovery (Phase 2)
- [ ] Unpublishes if published

## Technical Specifications

### Presentation Data Model

> **Implementation**: See `src/types/presentation.ts` for Presentation, PresentationSettings, PresentationStatus, and ContentIntent interfaces/types

### API Endpoints

> **Implementation**: See `src/types/presentation.ts` for ListPresentationsRequest, ListPresentationsResponse, PresentationSummary, CreatePresentationRequest, UpdatePresentationRequest, and DuplicatePresentationResponse interfaces

### Presentation Handler

> **Implementation**: See `src/app/api/presentations/route.ts` for GET (list with pagination, sorting, search) and POST (create with optional template) handlers

### Thumbnail Generation

> **Implementation**: See `src/services/presentations/thumbnail.ts` for the `generateThumbnail` function (Remotion renderStill, R2 upload)

## UI Components

### Presentations Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VisualFlow                              [Search...]         [User Menu ▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  My Presentations                              Sort: [Last Modified ▼]     │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │             │  │             │  │             │  │      +      │        │
│  │   [thumb]   │  │   [thumb]   │  │   [thumb]   │  │             │        │
│  │             │  │             │  │             │  │    New      │        │
│  │─────────────│  │─────────────│  │─────────────│  │ Presentation│        │
│  │ Present. A  │  │ Present. B  │  │ Present. C  │  │             │        │
│  │ 5 slides    │  │ 12 slides   │  │ 3 slides    │  │             │        │
│  │ 2 days ago  │  │ 1 week ago  │  │ Just now    │  │             │        │
│  │ [⋮]         │  │ [⋮] 🌐      │  │ [⋮]         │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │             │  │             │                                          │
│  │   [thumb]   │  │   [thumb]   │                                          │
│  │             │  │             │                                          │
│  │─────────────│  │─────────────│                                          │
│  │ Present. D  │  │ Present. E  │                                          │
│  │ 8 slides    │  │ 6 slides    │                                          │
│  │ 2 weeks ago │  │ 1 month ago │                                          │
│  │ [⋮]         │  │ [⋮]         │                                          │
│  └─────────────┘  └─────────────┘                                          │
│                                                                             │
│  Showing 1-6 of 6 presentations                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Presentation Card Component

> **Implementation**: See `src/components/presentations/presentation-card.tsx` for the PresentationCard component (thumbnail, inline rename, dropdown menu with rename/duplicate/delete, published indicator)

### New Presentation Dialog

> **Implementation**: See `src/components/presentations/new-presentation-dialog.tsx` for the NewPresentationDialog component (name input, content type radio group)

## Dependencies
- Prisma for database access
- Remotion for thumbnail generation
- Cloudflare R2 for thumbnail storage

## Related Features
- [Authentication](./authentication.md)
- [Subscription Billing](./subscription-billing.md)
