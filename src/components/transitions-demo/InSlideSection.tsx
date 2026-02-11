'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DemoStage, useReplay } from './DemoStage';
import { IN_SLIDE_ANIMATIONS } from '@/config/transition-catalog';

// ═══════════════════════════════════════════════════════════════════════════
// 1. Smooth Fade
// ═══════════════════════════════════════════════════════════════════════════

function SmoothFadeDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[0];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Element" onReplay={replay}>
      <div key={key} className="flex flex-col items-center gap-3 p-6">
        <div style={{ animation: 'vs-smooth-fade 0.8s ease-out forwards', opacity: 0 }}>
          <div className="text-white/90 text-lg font-bold tracking-tight">Revenue Growth</div>
        </div>
        <div style={{ animation: 'vs-smooth-fade 0.8s ease-out 0.3s forwards', opacity: 0 }}>
          <div className="text-white/50 text-sm">Q4 2025 Performance Report</div>
        </div>
        <div style={{ animation: 'vs-smooth-fade 0.8s ease-out 0.6s forwards', opacity: 0 }}>
          <div className="text-3xl font-black text-blue-400 tabular-nums">+34.7%</div>
        </div>
        <div style={{ animation: 'vs-smooth-fade 0.8s ease-out 0.9s forwards', opacity: 0 }}>
          <div className="flex gap-2 mt-1">
            {['Jan', 'Feb', 'Mar', 'Apr'].map((m) => (
              <div key={m} className="text-[10px] text-white/30 text-center">
                <div className="w-8 bg-blue-500/30 rounded-sm mb-1" style={{ height: `${20 + Math.random() * 30}px` }} />
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. Staggered Wipe
// ═══════════════════════════════════════════════════════════════════════════

function StaggeredWipeDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[1];
  const data = [
    { label: 'Marketing', value: 85, color: '#3b82f6' },
    { label: 'Sales', value: 72, color: '#8b5cf6' },
    { label: 'Support', value: 94, color: '#14b8a6' },
    { label: 'R&D', value: 61, color: '#f59e0b' },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Data" onReplay={replay}>
      <div key={key} className="flex flex-col gap-3 w-full px-8 py-6">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-white/60 text-[10px] w-16 text-right shrink-0">{d.label}</span>
            <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${d.value}%`,
                  backgroundColor: d.color,
                  animation: `vs-staggered-wipe 0.8s ease-out ${0.2 + i * 0.2}s forwards`,
                  clipPath: 'inset(0 100% 0 0)',
                }}
              />
            </div>
            <span
              className="text-white/80 text-xs font-mono w-8 tabular-nums"
              style={{ animation: `vs-smooth-fade 0.4s ease-out ${0.6 + i * 0.2}s forwards`, opacity: 0 }}
            >
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Float In (Gentle)
// ═══════════════════════════════════════════════════════════════════════════

function FloatInDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[2];
  const items = [
    { icon: '🚀', label: 'Fast' },
    { icon: '🔒', label: 'Secure' },
    { icon: '✨', label: 'Beautiful' },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Element" onReplay={replay}>
      <div key={key} className="flex gap-4 p-6">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10"
            style={{
              animation: `vs-float-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.15}s forwards`,
              opacity: 0,
              transform: 'translateY(24px)',
            }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-white/80 text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. Pulse (Emphasis)
// ═══════════════════════════════════════════════════════════════════════════

function PulseDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[3];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Emphasis" onReplay={replay}>
      <div key={key} className="flex flex-col items-center gap-2 p-6">
        <div className="text-white/50 text-xs uppercase tracking-widest">Annual Revenue</div>
        <div
          className="text-4xl font-black text-blue-400 tabular-nums"
          style={{ animation: 'vs-pulse-emphasis 1.8s ease-in-out 0.3s forwards' }}
        >
          $2.4M
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold">+27% YoY</span>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. Typewriter Reveal
// ═══════════════════════════════════════════════════════════════════════════

function TypewriterDemo() {
  const [key, setKey] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const fullText = '"Innovation distinguishes between a leader and a follower."';
  const entry = IN_SLIDE_ANIMATIONS[4];

  const replay = useCallback(() => {
    setDisplayText('');
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let idx = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      if (idx < fullText.length) {
        setDisplayText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [key]);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Text" onReplay={replay}>
      <div className="flex flex-col items-center gap-3 px-8 py-6">
        <div className="text-white/90 text-base italic leading-relaxed min-h-[3em] font-serif">
          {displayText}
          <span
            className="inline-block w-[2px] h-[1.1em] bg-blue-400 ml-0.5 align-text-bottom"
            style={{ animation: 'vs-typewriter-blink 0.8s step-end infinite' }}
          />
        </div>
        <div
          className="text-white/40 text-xs mt-2"
          style={{
            opacity: displayText.length >= fullText.length ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          — Steve Jobs
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Pop / Zoom
// ═══════════════════════════════════════════════════════════════════════════

function PopZoomDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[5];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Highlight" onReplay={replay}>
      <div key={key} className="flex flex-col items-center gap-3 p-6">
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
          style={{
            animation: 'vs-pop-zoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards',
            opacity: 0,
            transform: 'scale(0)',
          }}
        >
          <span className="text-3xl">⚡</span>
        </div>
        <div
          className="text-white/90 text-sm font-semibold"
          style={{
            animation: 'vs-smooth-fade 0.5s ease-out 0.5s forwards',
            opacity: 0,
          }}
        >
          Lightning Fast
        </div>
        <div
          className="text-white/50 text-xs text-center max-w-[200px]"
          style={{
            animation: 'vs-smooth-fade 0.5s ease-out 0.7s forwards',
            opacity: 0,
          }}
        >
          Process data 10x faster than before
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. Path Follow (Lines)
// ═══════════════════════════════════════════════════════════════════════════

function PathFollowDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[6];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Flow" onReplay={replay}>
      <div key={key} className="w-full h-full flex items-center justify-center p-4">
        <svg width="280" height="100" viewBox="0 0 280 100" fill="none">
          {/* Connection line */}
          <path
            d="M 40 50 C 100 50, 100 50, 140 50 C 180 50, 180 50, 240 50"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="220"
            strokeDashoffset="220"
            strokeLinecap="round"
            style={{ animation: 'vs-draw-line 1.2s ease-in-out 0.3s forwards' }}
          />
          {/* Step dots & labels */}
          {[
            { cx: 40, label: 'Input' },
            { cx: 140, label: 'Process' },
            { cx: 240, label: 'Output' },
          ].map((s, i) => (
            <g key={s.label}>
              <circle
                cx={s.cx}
                cy={50}
                r={12}
                fill="#1e293b"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{
                  animation: `vs-pop-zoom 0.4s ease-out ${0.3 + i * 0.5}s forwards`,
                  opacity: 0,
                  transformOrigin: `${s.cx}px 50px`,
                  transform: 'scale(0)',
                }}
              />
              <text
                x={s.cx}
                y={50}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="8"
                fontWeight="bold"
                style={{
                  animation: `vs-smooth-fade 0.3s ease-out ${0.5 + i * 0.5}s forwards`,
                  opacity: 0,
                }}
              >
                {i + 1}
              </text>
              <text
                x={s.cx}
                y={75}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
                style={{
                  animation: `vs-smooth-fade 0.3s ease-out ${0.6 + i * 0.5}s forwards`,
                  opacity: 0,
                }}
              >
                {s.label}
              </text>
            </g>
          ))}
          {/* Arrowhead */}
          <polygon
            points="250,50 243,44 243,56"
            fill="#3b82f6"
            style={{
              animation: 'vs-smooth-fade 0.3s ease-out 1.5s forwards',
              opacity: 0,
            }}
          />
        </svg>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. Color Shift
// ═══════════════════════════════════════════════════════════════════════════

function ColorShiftDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[7];
  const features = [
    { icon: '📊', label: 'Analytics', color: '#3b82f6' },
    { icon: '🔐', label: 'Security', color: '#8b5cf6' },
    { icon: '☁️', label: 'Cloud', color: '#14b8a6' },
    { icon: '🤖', label: 'AI', color: '#f59e0b' },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Emphasis" onReplay={replay}>
      <div key={key} className="flex gap-4 p-6">
        {features.map((f, i) => (
          <div
            key={f.label}
            className="flex flex-col items-center gap-2"
            style={{
              animation: `vs-color-shift 0.8s ease-out ${0.3 + i * 0.3}s forwards`,
              filter: 'grayscale(100%) brightness(0.6)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${f.color}20`, border: `1px solid ${f.color}40` }}
            >
              {f.icon}
            </div>
            <span className="text-white/70 text-[10px] font-medium">{f.label}</span>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. Masked Reveal
// ═══════════════════════════════════════════════════════════════════════════

function MaskedRevealDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[8];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Visual" onReplay={replay}>
      <div key={key} className="w-full h-full flex items-center justify-center p-6">
        <div
          className="w-[200px] h-[120px] rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden"
          style={{
            animation: 'vs-masked-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
            clipPath: 'inset(0 100% 0 0)',
          }}
        >
          <div className="text-center">
            <div className="text-white text-lg font-bold">Product Pro</div>
            <div className="text-white/70 text-xs mt-1">Next-gen platform</div>
          </div>
          {/* Decorative dots */}
          <div className="absolute top-3 right-3 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. Shimmer
// ═══════════════════════════════════════════════════════════════════════════

function ShimmerDemo() {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[9];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="CTA" onReplay={replay}>
      <div key={key} className="flex flex-col items-center gap-4 p-6">
        <div className="text-white/60 text-xs">Ready to transform your workflow?</div>
        <button
          className="relative px-6 py-2.5 rounded-lg font-semibold text-sm text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          Get Started Free
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'vs-shimmer 1.5s ease-in-out 0.5s forwards',
              backgroundPosition: '-200% center',
            }}
          />
        </button>
        <div className="text-white/30 text-[10px]">No credit card required</div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section Export
// ═══════════════════════════════════════════════════════════════════════════

export function InSlideSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <SmoothFadeDemo />
      <StaggeredWipeDemo />
      <FloatInDemo />
      <PulseDemo />
      <TypewriterDemo />
      <PopZoomDemo />
      <PathFollowDemo />
      <ColorShiftDemo />
      <MaskedRevealDemo />
      <ShimmerDemo />
    </div>
  );
}
