/**
 * VideoPlayerClient — Remotion-based video preview.
 *
 * This component is dynamically imported (ssr: false) by the
 * /slide-play-video page so that Remotion is never loaded in the
 * main web player bundle.
 *
 * It renders the Remotion Presentation composition using the demo slides,
 * with controls for playback and export initiation.
 */

'use client';

import { useState, useMemo } from 'react';
import { Presentation, type PresentationProps } from '@/remotion/compositions/Presentation';
import { DEMO_SLIDES } from '@/config/demo-slides';
import type { Presentation } from '@/types/presentation';
import type { VoiceConfig } from '@/types/voice';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FPS = 30;

/** Build a minimal Presentation object from demo slides. */
function buildDemoPresentation(): Presentation {
  return {
    id: 'demo-project',
    tenantId: 'demo',
    createdByUserId: 'demo',
    name: 'Demo Presentation',
    script: '',
    intent: 'educational',
    slides: DEMO_SLIDES,
    voiceSettings: { voiceId: '', syncPoints: [] },
    status: 'generated',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function totalDurationFrames(): number {
  const totalMs = DEMO_SLIDES.reduce((sum, s) => sum + s.duration, 0);
  return Math.round((totalMs / 1000) * FPS);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VideoPlayerClient() {
  const presentation = useMemo(buildDemoPresentation, []);
  const [voiceConfig] = useState<VoiceConfig | null>(null);
  const durationFrames = useMemo(totalDurationFrames, []);

  const inputProps: PresentationProps = {
    project: presentation,
    voiceConfig,
    includeVoiceover: false,
    watermark: false,
  };

  // Lazy import @remotion/player only when this component mounts.
  // The Player is rendered inside a Suspense-like pattern via dynamic import.
  const [PlayerComponent, setPlayerComponent] = useState<React.ComponentType<{
    component: React.ComponentType<PresentationProps>;
    inputProps: PresentationProps;
    durationInFrames: number;
    fps: number;
    compositionWidth: number;
    compositionHeight: number;
    style: React.CSSProperties;
    controls: boolean;
    autoPlay: boolean;
  }> | null>(null);

  // Load the Player component on mount
  useState(() => {
    import('@remotion/player').then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPlayerComponent(() => mod.Player as any);
    });
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-black">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl mx-8">
          {PlayerComponent ? (
            <PlayerComponent
              component={Presentation}
              inputProps={inputProps}
              durationInFrames={durationFrames}
              fps={FPS}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8 }}
              controls
              autoPlay={false}
            />
          ) : (
            <div className="flex items-center justify-center text-white/40 text-sm" style={{ aspectRatio: '16/9' }}>
              Loading Remotion player...
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-3 bg-zinc-900 border-t border-white/10 text-center">
        <p className="text-xs text-white/40">
          Remotion video preview — this page lazy-loads Remotion independently from the main player.
        </p>
      </div>
    </div>
  );
}
