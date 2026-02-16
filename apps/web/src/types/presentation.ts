/**
 * Presentation types and interfaces for VisualFlow.
 *
 * @source docs/modules/user-management/presentations-library.md
 * @source docs/modules/story-editor/script-input.md
 * @source docs/product-summary/MVP-architecture.md
 */

import type { Slide } from '@/types/slide';
import type { VoiceSettings } from '@/types/voice';

// ---------------------------------------------------------------------------
// Enums & Union Types
// ---------------------------------------------------------------------------

/** Content intent drives template selection and AI suggestions. */
export type ContentIntent = 'educational' | 'promotional' | 'storytelling';

/** Lifecycle status of a presentation. */
export type PresentationStatus = 'draft' | 'generated' | 'exported';

// ---------------------------------------------------------------------------
// Core Interfaces
// ---------------------------------------------------------------------------

/**
 * Full presentation model stored in the database.
 * @source docs/product-summary/MVP-architecture.md — Data Models (Core)
 */
export interface Presentation {
  id: string;
  tenantId: string;
  createdByUserId: string;
  name: string;
  script: string;
  intent: ContentIntent;
  slides: Slide[];
  voiceSettings: VoiceSettings;
  status: PresentationStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Presentation-level settings (separate from the presentation data itself).
 * @source docs/modules/user-management/presentations-library.md
 */
export interface PresentationSettings {
  /** Default animation template ID applied to new slides. */
  defaultTemplateId?: string;
  /** Default transition between slides. */
  defaultTransition?: string;
  /** Aspect ratio for the presentation canvas. */
  aspectRatio: '16:9' | '9:16' | '1:1';
  /** Whether auto-save is enabled. */
  autoSave: boolean;
  /** Auto-save interval in milliseconds. */
  autoSaveInterval: number;
}

// ---------------------------------------------------------------------------
// API — List Presentations
// ---------------------------------------------------------------------------

/**
 * Query parameters for listing presentations.
 * @source docs/modules/user-management/presentations-library.md — API Endpoints
 */
export interface ListPresentationsRequest {
  /** Page number (1-based). */
  page?: number;
  /** Items per page. */
  limit?: number;
  /** Sort field. */
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  /** Sort direction. */
  sortOrder?: 'asc' | 'desc';
  /** Full-text search on presentation name. */
  search?: string;
}

/**
 * Paginated list of presentations returned by the API.
 * @source docs/modules/user-management/presentations-library.md — API Endpoints
 */
export interface ListPresentationsResponse {
  presentations: PresentationSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Lightweight presentation representation used in list views / cards.
 * @source docs/modules/user-management/presentations-library.md — API Endpoints
 */
export interface PresentationSummary {
  id: string;
  name: string;
  status: PresentationStatus;
  slideCount: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// API — Create / Update / Duplicate
// ---------------------------------------------------------------------------

/**
 * Payload for creating a new presentation.
 * @source docs/modules/user-management/presentations-library.md — API Endpoints
 */
export interface CreatePresentationRequest {
  name: string;
  intent?: ContentIntent;
  /** Optional template ID to initialise from. */
  templateId?: string;
}

/**
 * Payload for updating an existing presentation.
 * @source docs/modules/user-management/presentations-library.md — API Endpoints
 */
export interface UpdatePresentationRequest {
  name?: string;
  script?: string;
  intent?: ContentIntent;
  status?: PresentationStatus;
}

/**
 * Response after duplicating a presentation.
 * @source docs/modules/user-management/presentations-library.md — US-PL-005
 */
export interface DuplicatePresentationResponse {
  /** The newly created presentation copy. */
  presentation: Presentation;
}

// ---------------------------------------------------------------------------
// Script Sections
// ---------------------------------------------------------------------------

/**
 * A single section of the parsed script (delimited by `---`).
 * @source docs/modules/story-editor/script-input.md — Data Model
 */
export interface ScriptSection {
  id: string;
  order: number;
  content: string;
  wordCount: number;
  /** Estimated read/display duration in seconds. */
  estimatedDuration: number;
}

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

/**
 * Props for the ScriptInput editor component.
 * @source docs/modules/story-editor/script-input.md — Component
 */
export interface ScriptInputProps {
  /** Current script text. */
  value: string;
  /** Callback when the script text changes. */
  onChange: (value: string) => void;
  /** Selected content intent. */
  intent: ContentIntent;
  /** Callback when the content intent changes. */
  onIntentChange: (intent: ContentIntent) => void;
  /** Whether the component is in a loading/saving state. */
  isSaving?: boolean;
}

// ---------------------------------------------------------------------------
// Backward Compatibility Aliases
// ---------------------------------------------------------------------------

/**
 * @deprecated Use `Presentation` instead.
 */
export type Project = Presentation;

/**
 * @deprecated Use `PresentationStatus` instead.
 */
export type ProjectStatus = PresentationStatus;

/**
 * @deprecated Use `PresentationSettings` instead.
 */
export type ProjectSettings = PresentationSettings;

/**
 * @deprecated Use `PresentationSummary` instead.
 */
export type ProjectSummary = PresentationSummary;

/**
 * @deprecated Use `ListPresentationsRequest` instead.
 */
export type ListProjectsRequest = ListPresentationsRequest;

/**
 * @deprecated Use `ListPresentationsResponse` instead.
 */
export type ListProjectsResponse = ListPresentationsResponse;

/**
 * @deprecated Use `CreatePresentationRequest` instead.
 */
export type CreateProjectRequest = CreatePresentationRequest;

/**
 * @deprecated Use `UpdatePresentationRequest` instead.
 */
export type UpdateProjectRequest = UpdatePresentationRequest;

/**
 * @deprecated Use `DuplicatePresentationResponse` instead.
 */
export type DuplicatePresentationResponse_Legacy = DuplicatePresentationResponse;
