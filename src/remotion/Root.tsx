/**
 * Remotion entry point — registers all video compositions.
 * @source docs/modules/export-publish/video-export.md
 */

import { Composition } from 'remotion';
import { Presentation } from './compositions/Presentation';

// ---------------------------------------------------------------------------
// Default composition configuration
// ---------------------------------------------------------------------------

const FPS = 30;
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
/** Default duration in frames (placeholder — actual duration is per-project). */
const DEFAULT_DURATION_FRAMES = FPS * 60; // 60 seconds

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export default function RemotionRoot() {
  return (
    <>
      <Composition
        id="Presentation"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={Presentation as any}
        durationInFrames={DEFAULT_DURATION_FRAMES}
        fps={FPS}
        width={DEFAULT_WIDTH}
        height={DEFAULT_HEIGHT}
        defaultProps={{
          project: {
            id: '',
            tenantId: '',
            createdByUserId: '',
            name: 'Preview',
            script: '',
            intent: 'educational' as const,
            slides: [],
            voiceSettings: {} as never,
            status: 'draft' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          voiceConfig: null,
          includeVoiceover: true,
          watermark: false,
        }}
      />

      {/* TODO: Add additional compositions for individual slide previews */}
      {/* TODO: Add composition for thumbnail generation (single frame) */}
    </>
  );
}
