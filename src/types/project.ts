/**
 * Project types and interfaces for VisualStory.
 *
 * @source docs/modules/user-management/projects-library.md
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

/** Lifecycle status of a project. */
export type ProjectStatus = 'draft' | 'generated' | 'exported';

// ---------------------------------------------------------------------------
// Core Interfaces
// ---------------------------------------------------------------------------

/**
 * Full project model stored in the database.
 * @source docs/product-summary/MVP-architecture.md — Data Models (Core)
 */
export interface Project {
  id: string;
  tenantId: string;
  createdByUserId: string;
  name: string;
  script: string;
  intent: ContentIntent;
  slides: Slide[];
  voiceSettings: VoiceSettings;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project-level settings (separate from the project data itself).
 * @source docs/modules/user-management/projects-library.md
 */
export interface ProjectSettings {
  /** Default animation template ID applied to new slides. */
  defaultTemplateId?: string;
  /** Default transition between slides. */
  defaultTransition?: string;
  /** Aspect ratio for the project canvas. */
  aspectRatio: '16:9' | '9:16' | '1:1';
  /** Whether auto-save is enabled. */
  autoSave: boolean;
  /** Auto-save interval in milliseconds. */
  autoSaveInterval: number;
}

// ---------------------------------------------------------------------------
// API — List Projects
// ---------------------------------------------------------------------------

/**
 * Query parameters for listing projects.
 * @source docs/modules/user-management/projects-library.md — API Endpoints
 */
export interface ListProjectsRequest {
  /** Page number (1-based). */
  page?: number;
  /** Items per page. */
  limit?: number;
  /** Sort field. */
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  /** Sort direction. */
  sortOrder?: 'asc' | 'desc';
  /** Full-text search on project name. */
  search?: string;
}

/**
 * Paginated list of projects returned by the API.
 * @source docs/modules/user-management/projects-library.md — API Endpoints
 */
export interface ListProjectsResponse {
  projects: ProjectSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Lightweight project representation used in list views / cards.
 * @source docs/modules/user-management/projects-library.md — API Endpoints
 */
export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
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
 * Payload for creating a new project.
 * @source docs/modules/user-management/projects-library.md — API Endpoints
 */
export interface CreateProjectRequest {
  name: string;
  intent?: ContentIntent;
  /** Optional template ID to initialise from. */
  templateId?: string;
}

/**
 * Payload for updating an existing project.
 * @source docs/modules/user-management/projects-library.md — API Endpoints
 */
export interface UpdateProjectRequest {
  name?: string;
  script?: string;
  intent?: ContentIntent;
  status?: ProjectStatus;
}

/**
 * Response after duplicating a project.
 * @source docs/modules/user-management/projects-library.md — US-PL-005
 */
export interface DuplicateProjectResponse {
  /** The newly created project copy. */
  project: Project;
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
