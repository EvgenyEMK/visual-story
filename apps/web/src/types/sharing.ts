/**
 * Sharing, publishing, and embed types for VisualFlow.
 *
 * @source docs/modules/export-publish/embed-sharing.md
 */

// ---------------------------------------------------------------------------
// Enums & Union Types
// ---------------------------------------------------------------------------

/** Visibility levels for a published project. */
export type Visibility = 'public' | 'unlisted' | 'password' | 'private';

// ---------------------------------------------------------------------------
// Publish Settings
// ---------------------------------------------------------------------------

/**
 * Settings configured when publishing a project.
 * @source docs/modules/export-publish/embed-sharing.md — Publish Flow
 */
export interface PublishSettings {
  /** Visibility level. */
  visibility: Visibility;
  /** Password for password-protected projects. */
  password?: string;
  /** Whether embedding on external websites is allowed. */
  allowEmbed: boolean;
  /** Whether viewers can download the video. */
  allowDownload: boolean;
}

/**
 * A published presentation's public-facing data.
 * @source docs/modules/export-publish/embed-sharing.md — Share ID Generation
 */
export interface PublishedPresentation {
  id: string;
  presentationId: string;
  /** Unique short ID used in the share URL (nanoid). */
  shareId: string;
  /** Full public URL (e.g. https://visualflow.app/play/{shareId}). */
  shareUrl: string;
  /** Publish/visibility settings. */
  settings: PublishSettings;
  /** Open Graph thumbnail URL. */
  thumbnailUrl?: string;
  /** Number of times the published presentation has been viewed. */
  viewCount: number;
  publishedAt: Date;
  updatedAt: Date;
}

/**
 * @deprecated Use `PublishedPresentation` instead.
 */
export type PublishedProject = PublishedPresentation;

/**
 * Data needed to render social share buttons and OG meta tags.
 * @source docs/modules/export-publish/embed-sharing.md — Social Share
 */
export interface ShareData {
  /** Presentation title used in share text. */
  title: string;
  /** Short description for social cards. */
  description: string;
  /** Public share URL. */
  url: string;
  /** OG image URL. */
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Embed
// ---------------------------------------------------------------------------

/**
 * Response containing the embed code/iframe snippet.
 * @source docs/modules/export-publish/embed-sharing.md — US-ES-004
 */
export interface EmbedResponse {
  /** Full iframe HTML string. */
  embedCode: string;
  /** Direct embed src URL. */
  embedUrl: string;
  /** Default width in pixels. */
  width: number;
  /** Default height in pixels. */
  height: number;
}

// ---------------------------------------------------------------------------
// Web Player Component Props
// ---------------------------------------------------------------------------

/**
 * Props for the WebPlayer component (public playback page).
 * @source docs/modules/export-publish/web-player.md
 */
export interface WebPlayerProps {
  /** The published presentation data. */
  project: PublishedPresentation;
  /** Slide data for rendering. */
  slides: import('@/types/slide').Slide[];
  /** Audio URL for voice-over playback. */
  audioUrl?: string;
  /** Whether the player should auto-play. */
  autoPlay?: boolean;
}

/**
 * Props for the player controls overlay.
 * @source docs/modules/export-publish/web-player.md
 */
export interface PlayerControlsProps {
  /** Whether the presentation is currently playing. */
  isPlaying: boolean;
  /** Current playback time in seconds. */
  currentTime: number;
  /** Total duration in seconds. */
  totalDuration: number;
  /** Callback to toggle play/pause. */
  onPlayPause: () => void;
  /** Callback to seek to a specific time. */
  onSeek: (time: number) => void;
  /** Current volume level (0–1). */
  volume: number;
  /** Callback to change volume. */
  onVolumeChange: (volume: number) => void;
  /** Whether fullscreen mode is active. */
  isFullscreen: boolean;
  /** Callback to toggle fullscreen. */
  onToggleFullscreen: () => void;
}
