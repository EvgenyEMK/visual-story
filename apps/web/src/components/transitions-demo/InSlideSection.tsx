'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DemoStage, useReplay } from './DemoStage';
import type { ThemeMode } from './DemoStage';
import { IN_SLIDE_ANIMATIONS } from '@/config/transition-catalog';

type ThemeProps = { themeMode: ThemeMode };

// ═══════════════════════════════════════════════════════════════════════════
// 1. Smooth Fade
// ═══════════════════════════════════════════════════════════════════════════

function SmoothFadeDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[0];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Element" onReplay={replay} themeMode={themeMode}>
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
              <div key={m} className="text-[0.625rem] text-white/30 text-center">
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

function StaggeredWipeDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[1];
  const data = [
    { label: 'Marketing', value: 85, color: '#3b82f6' },
    { label: 'Sales', value: 72, color: '#8b5cf6' },
    { label: 'Support', value: 94, color: '#14b8a6' },
    { label: 'R&D', value: 61, color: '#f59e0b' },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Data" onReplay={replay} themeMode={themeMode}>
      <div key={key} className="flex flex-col gap-3 w-full px-8 py-6">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-white/60 text-[0.625rem] w-16 text-right shrink-0">{d.label}</span>
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

function FloatInDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[2];
  const items = [
    { icon: '🚀', label: 'Fast' },
    { icon: '🔒', label: 'Secure' },
    { icon: '✨', label: 'Beautiful' },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Element" onReplay={replay} themeMode={themeMode}>
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

function PulseDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[3];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Emphasis" onReplay={replay} themeMode={themeMode}>
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

function TypewriterDemo({ themeMode }: ThemeProps) {
  const [key, setKey] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = '"Innovation distinguishes between a leader and a follower."';
  const entry = IN_SLIDE_ANIMATIONS[4];
  // Option: set to true to show blinking cursor during typing
  const isTypingCursorVisible = false;

  const replay = useCallback(() => {
    setDisplayText('');
    setIsTyping(true);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let idx = 0;
    setDisplayText('');
    setIsTyping(true);
    const interval = setInterval(() => {
      if (idx < fullText.length) {
        setDisplayText(fullText.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [key]);

  const showCursor = isTypingCursorVisible && isTyping;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Text" onReplay={replay} themeMode={themeMode}>
      <div className="flex flex-col items-start gap-3 px-8 py-6 w-full">
        <div className="text-white/90 text-base italic leading-relaxed min-h-[3em] font-serif text-left">
          {displayText}
          {showCursor && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-blue-400 ml-0.5 align-text-bottom"
              style={{ animation: 'vs-typewriter-blink 0.8s step-end infinite' }}
            />
          )}
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

function PopZoomDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[5];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Highlight" onReplay={replay} themeMode={themeMode}>
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

function PathFollowDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[6];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Flow" onReplay={replay} themeMode={themeMode}>
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
                stroke="#3b82f6"
                strokeWidth="2"
                style={{
                  fill: 'var(--demo-node-bg)',
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
                fontSize="8"
                fontWeight="bold"
                style={{
                  fill: 'var(--demo-node-text)',
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

function ColorShiftDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[7];
  const features = [
    { icon: '📊', label: 'Analytics', color: '#3b82f6' },
    { icon: '🔐', label: 'Security', color: '#8b5cf6' },
    { icon: '☁️', label: 'Cloud', color: '#14b8a6' },
    { icon: '🤖', label: 'AI', color: '#f59e0b' },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Emphasis" onReplay={replay} themeMode={themeMode}>
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
            <span className="text-white/70 text-[0.625rem] font-medium">{f.label}</span>
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. Masked Reveal
// ═══════════════════════════════════════════════════════════════════════════

function MaskedRevealDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[8];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Visual" onReplay={replay} themeMode={themeMode}>
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

function ShimmerDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[9];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="CTA" onReplay={replay} themeMode={themeMode}>
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
        <div className="text-white/30 text-[0.625rem]">No credit card required</div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 11. Slide Title
// ═══════════════════════════════════════════════════════════════════════════

function SlideTitleDemo({ themeMode }: ThemeProps) {
  const { key, replay } = useReplay();
  const entry = IN_SLIDE_ANIMATIONS[10];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Structure" onReplay={replay} themeMode={themeMode}>
      <div key={key} className="absolute inset-0 flex flex-col">
        {/* Title bar area */}
        <div className="px-6 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Title + Subtitle */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div
                className="text-white/90 text-base font-bold tracking-tight"
                style={{
                  animation: 'vs-title-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
                  opacity: 0,
                }}
              >
                Market Analysis 2025
              </div>
              <div
                className="text-white/40 text-[0.625rem]"
                style={{
                  animation: 'vs-subtitle-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
                  opacity: 0,
                }}
              >
                Quarterly performance & growth metrics
              </div>
            </div>
            {/* Right: Status / Legend placeholder */}
            <div
              className="flex items-center gap-2 shrink-0"
              style={{
                animation: 'vs-title-right-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards',
                opacity: 0,
              }}
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white/50 text-[0.5rem]">On Track</span>
              </div>
              <div className="text-white/20 text-[0.5rem]">|</div>
              <span className="text-white/40 text-[0.5rem]">Q4</span>
            </div>
          </div>
        </div>
        {/* Placeholder body content */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="flex flex-col items-center gap-2"
            style={{
              animation: 'vs-smooth-fade 0.6s ease-out 0.8s forwards',
              opacity: 0,
            }}
          >
            <div className="flex gap-3">
              {[65, 82, 45, 90, 73].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-5 rounded-sm bg-blue-500/50" style={{ height: `${h * 0.5}px` }} />
                  <div className="text-[0.375rem] text-white/30">Q{i + 1}</div>
                </div>
              ))}
            </div>
            <div className="text-white/20 text-[0.5rem] mt-1">Slide content area</div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 12. Zoom-In Word Reveal
// ═══════════════════════════════════════════════════════════════════════════

function ZoomInWordDemo({ themeMode }: ThemeProps) {
  const [key, setKey] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const entry = IN_SLIDE_ANIMATIONS[11];
  const lines = ['The Future of', 'Digital Innovation'];
  const allWords = lines.flatMap((line, lineIdx) =>
    line.split(' ').map((word, wordIdx) => ({ word, lineIdx, wordIdx }))
  );
  const wordDelay = 180; // ms between each word

  const replay = useCallback(() => {
    setVisibleWords(0);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let count = 0;
    setVisibleWords(0);
    const interval = setInterval(() => {
      count++;
      if (count <= allWords.length) {
        setVisibleWords(count);
      } else {
        clearInterval(interval);
      }
    }, wordDelay);
    return () => clearInterval(interval);
  }, [key, allWords.length]);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Text" onReplay={replay} themeMode={themeMode}>
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ perspective: '400px' }}>
        <div className="flex flex-col items-center gap-1">
          {lines.map((line, lineIdx) => {
            const words = line.split(' ');
            // Calculate the global offset for this line
            const lineOffset = lines.slice(0, lineIdx).reduce((sum, l) => sum + l.split(' ').length, 0);

            return (
              <div key={lineIdx} className="flex gap-2 justify-center flex-wrap">
                {words.map((word, wordIdx) => {
                  const globalIdx = lineOffset + wordIdx;
                  const isVisible = globalIdx < visibleWords;

                  return (
                    <span
                      key={`${lineIdx}-${wordIdx}`}
                      className="text-white/90 text-lg font-black tracking-tight"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'scale(1) translateZ(0)' : 'scale(0.3) translateZ(-50px)',
                        filter: isVisible ? 'blur(0)' : 'blur(4px)',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'inline-block',
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
          {/* Subtitle that appears after all words */}
          <div
            className="text-white/40 text-[0.625rem] mt-3"
            style={{
              opacity: visibleWords >= allWords.length ? 1 : 0,
              transition: 'opacity 0.5s ease 0.2s',
            }}
          >
            Section 3 of 5
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section Export
// ═══════════════════════════════════════════════════════════════════════════

export function InSlideSection({ themeMode, gridClassName }: { themeMode: ThemeMode; gridClassName?: string }) {
  return (
    <div className={gridClassName ?? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}>
      <SmoothFadeDemo themeMode={themeMode} />
      <StaggeredWipeDemo themeMode={themeMode} />
      <FloatInDemo themeMode={themeMode} />
      <PulseDemo themeMode={themeMode} />
      <TypewriterDemo themeMode={themeMode} />
      <PopZoomDemo themeMode={themeMode} />
      <PathFollowDemo themeMode={themeMode} />
      <ColorShiftDemo themeMode={themeMode} />
      <MaskedRevealDemo themeMode={themeMode} />
      <ShimmerDemo themeMode={themeMode} />
      <SlideTitleDemo themeMode={themeMode} />
      <ZoomInWordDemo themeMode={themeMode} />
    </div>
  );
}
