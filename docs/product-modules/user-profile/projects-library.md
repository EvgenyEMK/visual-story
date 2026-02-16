# Feature: Projects Library

## Module
User Management

## Overview
The Projects Library is the user's dashboard for managing all their VisualStory projects. It provides project listing, creation, organization, and basic project management functions.

## User Stories

### US-PL-001: View All Projects
**As a** user  
**I want to** see all my projects in one place  
**So that** I can find and access them easily

**Acceptance Criteria:**
- [ ] Grid or list view of projects
- [ ] Project thumbnail preview
- [ ] Project name and last modified date
- [ ] Sort by name, date created, date modified
- [ ] Search projects by name

### US-PL-002: Create New Project
**As a** user  
**I want to** create a new project  
**So that** I can start building a new presentation

**Acceptance Criteria:**
- [ ] "New Project" button
- [ ] Project name input
- [ ] Optional: start from template
- [ ] Creates project and opens editor

### US-PL-003: Open Existing Project
**As a** user  
**I want to** open a project  
**So that** I can continue editing

**Acceptance Criteria:**
- [ ] Click project card to open
- [ ] Opens in editor view
- [ ] Loads project state

### US-PL-004: Rename Project
**As a** user  
**I want to** rename a project  
**So that** I can keep my library organized

**Acceptance Criteria:**
- [ ] Rename option in project menu
- [ ] Inline rename on project card
- [ ] Save on Enter or blur

### US-PL-005: Duplicate Project
**As a** user  
**I want to** duplicate a project  
**So that** I can create variations

**Acceptance Criteria:**
- [ ] Duplicate option in project menu
- [ ] Creates copy with "(Copy)" suffix
- [ ] Copies all slides and settings
- [ ] Does not copy published state

### US-PL-006: Delete Project
**As a** user  
**I want to** delete a project  
**So that** I can remove projects I no longer need

**Acceptance Criteria:**
- [ ] Delete option in project menu
- [ ] Confirmation dialog
- [ ] Soft delete with 30-day recovery (Phase 2)
- [ ] Unpublishes if published

## Technical Specifications

### Project Data Model

> **Implementation**: See `src/types/project.ts` for Project, ProjectSettings, ProjectStatus, and ContentIntent interfaces/types

### API Endpoints

> **Implementation**: See `src/types/project.ts` for ListProjectsRequest, ListProjectsResponse, ProjectSummary, CreateProjectRequest, UpdateProjectRequest, and DuplicateProjectResponse interfaces

### Project Handler

> **Implementation**: See `src/app/api/projects/route.ts` for GET (list with pagination, sorting, search) and POST (create with optional template) handlers

### Thumbnail Generation

> **Implementation**: See `src/services/projects/thumbnail.ts` for the `generateThumbnail` function (Remotion renderStill, R2 upload)

## UI Components

### Projects Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VisualStory                              [Search...]         [User Menu ▼] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  My Projects                                    Sort: [Last Modified ▼]     │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │             │  │             │  │             │  │      +      │        │
│  │   [thumb]   │  │   [thumb]   │  │   [thumb]   │  │             │        │
│  │             │  │             │  │             │  │    New      │        │
│  │─────────────│  │─────────────│  │─────────────│  │   Project   │        │
│  │ Project A   │  │ Project B   │  │ Project C   │  │             │        │
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
│  │ Project D   │  │ Project E   │                                          │
│  │ 8 slides    │  │ 6 slides    │                                          │
│  │ 2 weeks ago │  │ 1 month ago │                                          │
│  │ [⋮]         │  │ [⋮]         │                                          │
│  └─────────────┘  └─────────────┘                                          │
│                                                                             │
│  Showing 1-6 of 6 projects                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Project Card Component

> **Implementation**: See `src/components/projects/project-card.tsx` for the ProjectCard component (thumbnail, inline rename, dropdown menu with rename/duplicate/delete, published indicator)

### New Project Dialog

> **Implementation**: See `src/components/projects/new-project-dialog.tsx` for the NewProjectDialog component (name input, content type radio group)

## Dependencies
- Prisma for database access
- Remotion for thumbnail generation
- Cloudflare R2 for thumbnail storage

## Related Features
- [Authentication](./authentication.md)
- [Subscription Billing](./subscription-billing.md)
