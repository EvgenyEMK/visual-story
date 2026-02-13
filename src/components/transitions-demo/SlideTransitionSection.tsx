'use client';

import { useState, useCallback, useEffect } from 'react';
import { DemoStage } from './DemoStage';
import type { ThemeMode } from './DemoStage';
import { SLIDE_TRANSITIONS } from '@/config/transition-catalog';

type ThemeProps = { themeMode: ThemeMode };

// ---------------------------------------------------------------------------
// Shared mock slide components
// ---------------------------------------------------------------------------

function MockSlideA({ label = 'Slide A' }: { label?: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mb-3">
        <span className="text-lg">📊</span>
      </div>
      <div className="text-white/90 text-sm font-bold">{label}</div>
      <div className="text-white/40 text-[10px] mt-1">Market Overview</div>
      <div className="flex gap-1.5 mt-3">
        <div className="w-6 h-3 rounded-sm bg-blue-500/40" />
        <div className="w-6 h-4 rounded-sm bg-blue-500/50" />
        <div className="w-6 h-6 rounded-sm bg-blue-500/60" />
        <div className="w-6 h-5 rounded-sm bg-blue-500/50" />
      </div>
    </div>
  );
}

function MockSlideB({ label = 'Slide B' }: { label?: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-3">
        <span className="text-lg">🎯</span>
      </div>
      <div className="text-white/90 text-sm font-bold">{label}</div>
      <div className="text-white/40 text-[10px] mt-1">Growth Strategy</div>
      <div className="mt-3 flex flex-col gap-1 items-center">
        <div className="w-24 h-1.5 rounded bg-purple-400/40" />
        <div className="w-20 h-1.5 rounded bg-purple-400/30" />
        <div className="w-16 h-1.5 rounded bg-purple-400/20" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook for slide transition cycling
// ---------------------------------------------------------------------------

function useTransitionCycle(durationMs: number = 2000) {
  const [phase, setPhase] = useState<'a' | 'transitioning' | 'b'>('a');
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => {
    setPhase('a');
    setRunId((r) => r + 1);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('transitioning'), 600);
    const t2 = setTimeout(() => setPhase('b'), 600 + durationMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [runId, durationMs]);

  return { phase, replay, runId };
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. Morph (Smart Move)
// ═══════════════════════════════════════════════════════════════════════════

function MorphDemo({ themeMode }: ThemeProps) {
  const entry = SLIDE_TRANSITIONS[0];
  const [phase, setPhase] = useState<'a' | 'morphing' | 'b'>('a');
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => {
    setPhase('a');
    setRunId((r) => r + 1);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('morphing'), 600);
    const t2 = setTimeout(() => setPhase('b'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [runId]);

  const iconStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)', position: 'absolute' };
    if (phase === 'a') return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.2)' };
    return { ...base, top: '15%', left: '15%', transform: 'translate(0, 0) scale(0.7)' };
  };

  const contentStyle = (): React.CSSProperties => ({
    transition: 'opacity 0.8s ease',
    opacity: phase === 'b' ? 1 : 0,
  });

  const bgStyle = (): React.CSSProperties => ({
    transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
    background: phase === 'a'
      ? 'linear-gradient(135deg, #1e293b, #0f172a)'
      : 'linear-gradient(135deg, #1e1b4b, #312e81)',
  });

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Transition" onReplay={replay} themeMode={themeMode}>
      <div className="absolute inset-0" style={bgStyle()}>
        {/* The shared morphing element */}
        <div style={iconStyle()}>
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-2xl">📊</span>
          </div>
        </div>
        {/* Slide A content (fades out) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: phase === 'a' ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          <div className="text-white/80 text-sm font-bold mt-16">Market Overview</div>
          <div className="text-white/40 text-[10px] mt-1">Q4 2025</div>
        </div>
        {/* Slide B content (fades in) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={contentStyle()}>
          <div className="text-white/80 text-sm font-bold">Detailed Analytics</div>
          <div className="text-white/40 text-[10px] mt-1">Breaking down the numbers</div>
          <div className="flex gap-1.5 mt-3">
            <div className="w-4 h-6 rounded-sm bg-purple-400/50" />
            <div className="w-4 h-8 rounded-sm bg-purple-400/60" />
            <div className="w-4 h-5 rounded-sm bg-purple-400/40" />
            <div className="w-4 h-10 rounded-sm bg-purple-400/70" />
            <div className="w-4 h-7 rounded-sm bg-purple-400/50" />
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. Push (Directional)
// ═══════════════════════════════════════════════════════════════════════════

function PushDemo({ themeMode }: ThemeProps) {
  const entry = SLIDE_TRANSITIONS[1];
  const { phase, replay, runId } = useTransitionCycle(800);

  const slideAStyle = (): React.CSSProperties => ({
    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: phase === 'a' ? 'translateX(0)' : 'translateX(-100%)',
  });

  const slideBStyle = (): React.CSSProperties => ({
    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: phase === 'a' ? 'translateX(100%)' : 'translateX(0)',
  });

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Transition" onReplay={replay} themeMode={themeMode}>
      <div key={runId} className="absolute inset-0 overflow-hidden">
        <div style={slideAStyle()}>
          <MockSlideA />
        </div>
        <div style={slideBStyle()}>
          <MockSlideB />
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Pan (Cinematic)
// ═══════════════════════════════════════════════════════════════════════════

function PanDemo({ themeMode }: ThemeProps) {
  const entry = SLIDE_TRANSITIONS[2];
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => setRunId((r) => r + 1), []);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Transition" onReplay={replay} themeMode={themeMode}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Large canvas that pans */}
        <div
          key={runId}
          className="absolute"
          style={{
            width: '300%',
            height: '200%',
            top: 0,
            left: 0,
            animation: 'vs-pan-canvas 6s cubic-bezier(0.45, 0, 0.55, 1) 0.3s forwards',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
          }}
        >
          {/* Canvas cells with different content */}
          {[
            { bg: 'from-slate-800 to-slate-900', icon: '🎯', label: 'Strategy' },
            { bg: 'from-blue-900 to-slate-900', icon: '📊', label: 'Data' },
            { bg: 'from-indigo-900 to-slate-900', icon: '🚀', label: 'Growth' },
            { bg: 'from-slate-800 to-indigo-900', icon: '💡', label: 'Ideas' },
            { bg: 'from-purple-900 to-slate-900', icon: '🔗', label: 'Connect' },
            { bg: 'from-slate-900 to-blue-900', icon: '✨', label: 'Results' },
          ].map((cell, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${cell.bg} flex flex-col items-center justify-center border border-white/5`}
            >
              <span className="text-2xl mb-2">{cell.icon}</span>
              <span className="text-white/70 text-xs font-medium">{cell.label}</span>
            </div>
          ))}
        </div>
        {/* Viewport indicator */}
        <div className="absolute bottom-2 right-2 bg-black/50 rounded px-2 py-0.5 text-[8px] text-white/50 backdrop-blur-sm">
          Panning...
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. Zoom (Focus)
// ═══════════════════════════════════════════════════════════════════════════

function ZoomDemo({ themeMode }: ThemeProps) {
  const entry = SLIDE_TRANSITIONS[3];
  const [phase, setPhase] = useState<'overview' | 'zooming' | 'detail'>('overview');
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => {
    setPhase('overview');
    setRunId((r) => r + 1);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('zooming'), 800);
    const t2 = setTimeout(() => setPhase('detail'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [runId]);

  const overviewStyle = (): React.CSSProperties => ({
    transition: 'all 1s cubic-bezier(0.45, 0, 0.55, 1)',
    transform: phase === 'overview' ? 'scale(1)' : 'scale(3)',
    opacity: phase === 'detail' ? 0 : 1,
    transformOrigin: '70% 60%',
  });

  const detailStyle = (): React.CSSProperties => ({
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: phase === 'detail' ? 'scale(1)' : 'scale(0.3)',
    opacity: phase === 'detail' ? 1 : 0,
  });

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Transition" onReplay={replay} themeMode={themeMode}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Overview slide */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center" style={overviewStyle()}>
          <div className="grid grid-cols-3 gap-2 p-4">
            {['📈', '📊', '🎯', '💰', '📋', '🔍'].map((icon, i) => (
              <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm ${i === 4 ? 'bg-blue-500/30 border border-blue-400/50 ring-2 ring-blue-400/30' : 'bg-white/5 border border-white/10'}`}>
                {icon}
              </div>
            ))}
          </div>
        </div>
        {/* Detail slide */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center" style={detailStyle()}>
          <span className="text-3xl mb-2">📋</span>
          <div className="text-white/90 text-sm font-bold">Project Timeline</div>
          <div className="text-white/50 text-[10px] mt-1">Detailed breakdown</div>
          <div className="flex gap-2 mt-3">
            {[40, 65, 30, 80, 55].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-4 rounded-sm bg-blue-400/60" style={{ height: `${h * 0.4}px` }} />
                <div className="text-[7px] text-white/30">W{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. Cross-Fade
// ═══════════════════════════════════════════════════════════════════════════

function CrossFadeDemo({ themeMode }: ThemeProps) {
  const entry = SLIDE_TRANSITIONS[4];
  const { phase, replay, runId } = useTransitionCycle(1200);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Transition" onReplay={replay} themeMode={themeMode}>
      <div key={runId} className="absolute inset-0 overflow-hidden">
        {/* Slide A */}
        <div
          className="absolute inset-0"
          style={{
            transition: 'opacity 1.2s ease-in-out',
            opacity: phase === 'a' ? 1 : 0,
          }}
        >
          <MockSlideA label="Chapter 1" />
        </div>
        {/* Slide B */}
        <div
          className="absolute inset-0"
          style={{
            transition: 'opacity 1.2s ease-in-out',
            opacity: phase === 'a' ? 0 : 1,
          }}
        >
          <MockSlideB label="Chapter 2" />
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section Export
// ═══════════════════════════════════════════════════════════════════════════

export function SlideTransitionSection({ themeMode, gridClassName }: { themeMode: ThemeMode; gridClassName?: string }) {
  return (
    <div className={gridClassName ?? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}>
      <MorphDemo themeMode={themeMode} />
      <PushDemo themeMode={themeMode} />
      <PanDemo themeMode={themeMode} />
      <ZoomDemo themeMode={themeMode} />
      <CrossFadeDemo themeMode={themeMode} />
    </div>
  );
}
