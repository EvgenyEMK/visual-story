/**
 * AI Assistant types — script feedback, visual suggestions, asset generation.
 *
 * @source docs/modules/ai-assistant/script-feedback.md
 * @source docs/modules/ai-assistant/visual-suggestions.md
 * @source docs/modules/ai-assistant/asset-generation.md
 */

// ---------------------------------------------------------------------------
// Script Feedback
// ---------------------------------------------------------------------------

/** Categories analysed by the AI script feedback engine. */
export type FeedbackCategory =
  | 'hook'
  | 'structure'
  | 'clarity'
  | 'engagement'
  | 'cta'
  | 'conclusion';

/** Priority levels for individual suggestions. */
export type SuggestionPriority = 'low' | 'medium' | 'high';

/**
 * A single actionable suggestion returned by the AI.
 * @source docs/modules/ai-assistant/script-feedback.md — Feedback Categories
 */
export interface Suggestion {
  id: string;
  category: FeedbackCategory;
  priority: SuggestionPriority;
  /** Description of the issue found. */
  issue: string;
  /** Recommended improvement. */
  suggestion: string;
  /** Original text that should be changed (for "Apply" action). */
  originalText?: string;
  /** Suggested replacement text. */
  replacementText?: string;
  /** Whether the user has applied this suggestion. */
  applied?: boolean;
  /** Whether the user has dismissed this suggestion. */
  dismissed?: boolean;
}

/**
 * Request payload for AI script feedback.
 * @source docs/modules/ai-assistant/script-feedback.md — API Endpoint
 */
export interface ScriptFeedbackRequest {
  projectId: string;
  script: string;
  intent: 'educational' | 'promotional' | 'storytelling';
}

/**
 * Response from the AI script feedback endpoint.
 * @source docs/modules/ai-assistant/script-feedback.md — API Endpoint
 */
export interface ScriptFeedbackResponse {
  /** Overall script quality score (0–100). */
  overallScore: number;
  /** Per-category scores (0–10). */
  categoryScores: Record<FeedbackCategory, number>;
  /** Actionable suggestions. */
  suggestions: Suggestion[];
}

// ---------------------------------------------------------------------------
// Visual Suggestions — Icons
// ---------------------------------------------------------------------------

/**
 * A single icon entry in the searchable library index.
 * @source docs/modules/ai-assistant/visual-suggestions.md — Icon Library Index
 */
export interface IconEntry {
  /** Unique icon identifier (e.g. "trending-up"). */
  name: string;
  /** Category this icon belongs to. */
  category: string;
  /** Search tags / synonyms. */
  tags: string[];
  /** Icon library source (e.g. "lucide", "heroicons"). */
  source: 'lucide' | 'heroicons' | 'phosphor';
}

/**
 * Full icon library index used for search.
 * @source docs/modules/ai-assistant/visual-suggestions.md — Icon Library Index
 */
export interface IconIndex {
  icons: IconEntry[];
  categories: string[];
  /** Total number of icons in the index. */
  totalCount: number;
}

/**
 * A single suggested icon with relevance info.
 * @source docs/modules/ai-assistant/visual-suggestions.md — Suggestion Algorithm
 */
export interface SuggestedIcon {
  /** Icon name from the library. */
  iconName: string;
  /** Why the AI selected this icon. */
  reason: string;
  /** Relevance score (0–1). */
  relevance: number;
}

/**
 * AI-generated icon suggestions for a specific slide element.
 * @source docs/modules/ai-assistant/visual-suggestions.md — Suggestion Algorithm
 */
export interface IconSuggestion {
  /** The slide element text that triggered the suggestion. */
  forText: string;
  slideId: string;
  /** Suggested icons (typically 3–5). */
  icons: SuggestedIcon[];
}

// ---------------------------------------------------------------------------
// Asset Generation — Stock Images (MVP)
// ---------------------------------------------------------------------------

/**
 * A stock image search result (Unsplash / Pexels).
 * @source docs/modules/ai-assistant/asset-generation.md — Stock Image Integration
 */
export interface StockImageResult {
  id: string;
  /** Direct URL to the image. */
  url: string;
  /** Thumbnail URL for previews. */
  thumbnailUrl: string;
  /** Alt text / description. */
  description: string;
  /** Photographer or author name. */
  author: string;
  /** Attribution URL. */
  authorUrl: string;
  /** Source platform. */
  source: 'unsplash' | 'pexels';
  width: number;
  height: number;
}

/** Placeholder style options available in the MVP. */
export type PlaceholderStyle = 'photo' | 'illustration' | 'abstract' | 'pattern';

/**
 * Configuration for a placeholder image element.
 * @source docs/modules/ai-assistant/asset-generation.md — Placeholder System
 */
export interface PlaceholderConfig {
  style: PlaceholderStyle;
  /** Background gradient or colour (CSS value). */
  background: string;
  /** Lucide icon name displayed in the centre. */
  icon: string;
  /** Label text shown on the placeholder. */
  label: string;
  /** Aspect ratio. */
  aspectRatio: '16:9' | '4:3' | '1:1';
}

// ---------------------------------------------------------------------------
// Phase 2 — AI Image Generation
// ---------------------------------------------------------------------------

/**
 * Request payload for AI image generation.
 * @source docs/modules/ai-assistant/asset-generation.md — Phase 2: AI Image Generation
 */
// Phase 2
export interface ImageGenerationRequest {
  /** Text prompt describing the desired image. */
  prompt: string;
  /** Visual style for the generated image. */
  style: 'realistic' | 'illustration' | 'abstract';
  /** Number of variations to generate (2–4). */
  variations?: number;
  /** Target width in pixels. */
  width?: number;
  /** Target height in pixels. */
  height?: number;
}

/**
 * A single AI-generated image result.
 * @source docs/modules/ai-assistant/asset-generation.md — Phase 2: AI Image Generation
 */
// Phase 2
export interface GeneratedImage {
  id: string;
  /** R2 URL of the generated image. */
  url: string;
  /** The prompt that produced this image. */
  prompt: string;
  style: 'realistic' | 'illustration' | 'abstract';
  width: number;
  height: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

/**
 * Props for the FeedbackPanel component.
 * @source docs/modules/ai-assistant/script-feedback.md — Component Implementation
 */
export interface FeedbackPanelProps {
  /** Feedback response data to display. */
  feedback: ScriptFeedbackResponse | null;
  /** Whether feedback is currently being generated. */
  isLoading: boolean;
  /** Callback when the user requests new feedback. */
  onRequestFeedback: () => void;
  /** Callback when a suggestion is applied. */
  onApplySuggestion: (suggestion: Suggestion) => void;
  /** Callback when a suggestion is dismissed. */
  onDismissSuggestion: (suggestionId: string) => void;
}

/**
 * Props for the IconPanel component.
 * @source docs/modules/ai-assistant/visual-suggestions.md — Component Implementation
 */
export interface IconPanelProps {
  /** Current slide ID for contextual suggestions. */
  slideId: string;
  /** AI-generated icon suggestions for the current slide. */
  suggestions: IconSuggestion[];
  /** Callback when an icon is added to the slide. */
  onAddIcon: (iconName: string) => void;
  /** Callback when the user searches manually. */
  onSearch: (query: string) => void;
  /** Search results from the icon library. */
  searchResults: IconEntry[];
  /** Whether suggestions are loading. */
  isLoading: boolean;
}
