'use client';

import { useState, useCallback, useEffect } from 'react';
import { DemoStage } from './DemoStage';
import { GROUPED_ANIMATIONS } from '@/config/transition-catalog';

// ---------------------------------------------------------------------------
// Shared hook for stepped animations
// ---------------------------------------------------------------------------

function useStepper(totalSteps: number, stepMs: number, autoStart = true) {
  const [step, setStep] = useState(autoStart ? 0 : -1);
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => {
    setStep(0);
    setRunId((r) => r + 1);
  }, []);

  useEffect(() => {
    if (step < 0) return;
    if (step >= totalSteps) return;
    const t = setTimeout(() => setStep((s) => s + 1), stepMs);
    return () => clearTimeout(t);
  }, [step, totalSteps, stepMs, runId]);

  return { step, replay, runId };
}

// Shared item data
const ITEMS = [
  { icon: '🚀', label: 'Launch', color: '#3b82f6' },
  { icon: '📊', label: 'Analytics', color: '#8b5cf6' },
  { icon: '🔒', label: 'Security', color: '#14b8a6' },
  { icon: '⚡', label: 'Speed', color: '#f59e0b' },
  { icon: '🎯', label: 'Targeting', color: '#ef4444' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 1. List Accumulator (Left Sidebar)
// ═══════════════════════════════════════════════════════════════════════════

function ListAccumulatorDemo() {
  const entry = GROUPED_ANIMATIONS[0];
  const { step, replay } = useStepper(5, 1800);
  const items = ITEMS.slice(0, 4);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 flex">
        {/* Left sidebar — accumulated list */}
        <div className="w-[30%] bg-slate-800/50 border-r border-white/5 p-2 flex flex-col gap-1.5 pt-3">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 px-1.5 py-1 rounded-md transition-all duration-700"
              style={{
                opacity: i < step ? 1 : 0,
                transform: i < step ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.8)',
                backgroundColor: i === step - 1 ? `${item.color}15` : 'transparent',
                transitionDelay: `${i * 50}ms`,
              }}
            >
              <span className="text-[10px]">{item.icon}</span>
              <span className="text-white/60 text-[8px] truncate">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Center — hero item */}
        <div className="flex-1 flex items-center justify-center relative">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="absolute flex flex-col items-center gap-2 transition-all duration-700"
              style={{
                opacity: i === step ? 1 : 0,
                transform: i === step ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${item.color}20`, border: `2px solid ${item.color}50` }}
              >
                {item.icon}
              </div>
              <div className="text-white/90 text-xs font-bold">{item.label}</div>
              <div className="text-white/40 text-[9px]">Feature {i + 1} of {items.length}</div>
            </div>
          ))}
          {step >= items.length && (
            <div className="text-white/50 text-xs" style={{ animation: 'vs-smooth-fade 0.5s ease-out forwards' }}>
              All items listed ✓
            </div>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. Carousel Focus (Horizontal)
// ═══════════════════════════════════════════════════════════════════════════

function CarouselFocusDemo() {
  const entry = GROUPED_ANIMATIONS[1];
  const { step, replay } = useStepper(5, 1600);
  const activeIndex = step < ITEMS.length ? step : -1;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 flex flex-col">
        {/* Center stage */}
        <div className="flex-1 flex items-center justify-center relative">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="absolute flex flex-col items-center gap-2 transition-all duration-500"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transform: i === activeIndex ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(30px)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: `${item.color}25`, border: `2px solid ${item.color}60`, boxShadow: `0 8px 24px ${item.color}20` }}
              >
                {item.icon}
              </div>
              <div className="text-white/90 text-sm font-bold">{item.label}</div>
              <div className="text-white/40 text-[9px]">Powerful {item.label.toLowerCase()} capabilities</div>
            </div>
          ))}
        </div>

        {/* Bottom shelf */}
        <div className="h-14 bg-slate-800/50 border-t border-white/5 flex items-center justify-center gap-3 px-4">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-0.5 transition-all duration-500 cursor-default"
              style={{
                opacity: i === activeIndex ? 0.3 : i <= step ? 1 : 0.3,
                filter: i === activeIndex ? 'grayscale(100%)' : i <= step ? 'grayscale(0%)' : 'grayscale(100%)',
                transform: i === activeIndex ? 'scale(0.8) translateY(-4px)' : 'scale(1) translateY(0)',
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}30` }}
              >
                {item.icon}
              </div>
              <span className="text-[7px] text-white/40">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Bento Grid Expansion
// ═══════════════════════════════════════════════════════════════════════════

function BentoGridDemo() {
  const entry = GROUPED_ANIMATIONS[2];
  const { step, replay } = useStepper(5, 2000);
  const items = ITEMS.slice(0, 4);
  const expandedIndex = step < items.length ? step : -1;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 p-3 flex gap-2">
        {/* Main area */}
        <div className="flex-1 flex flex-col gap-2 relative">
          {/* Expanded item */}
          {items.map((item, i) => (
            <div
              key={item.label}
              className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-700"
              style={{
                backgroundColor: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                opacity: i === expandedIndex ? 1 : 0,
                transform: i === expandedIndex ? 'scale(1)' : 'scale(0.9)',
              }}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-white/90 text-sm font-bold">{item.label}</span>
              <span className="text-white/40 text-[9px] px-4 text-center">
                Advanced {item.label.toLowerCase()} features for your workflow
              </span>
            </div>
          ))}
          {expandedIndex < 0 && (
            <div className="flex-1 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xs">
              Select an item
            </div>
          )}
        </div>

        {/* Right sidebar — grid thumbnails */}
        <div className="w-[28%] flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="flex-1 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-500 cursor-default"
              style={{
                backgroundColor: i === expandedIndex ? `${item.color}30` : `${item.color}10`,
                border: `1px solid ${i === expandedIndex ? `${item.color}50` : `${item.color}15`}`,
                opacity: i === expandedIndex ? 1 : 0.6,
                transform: i === expandedIndex ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-white/60 text-[8px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. Circular Satellite (Orbital)
// ═══════════════════════════════════════════════════════════════════════════

function CircularSatelliteDemo() {
  const entry = GROUPED_ANIMATIONS[3];
  const { step, replay } = useStepper(6, 1200);
  const satellites = ITEMS.slice(0, 5);

  // Position satellites around a circle
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 60;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Core */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-10 shadow-lg shadow-blue-500/30">
          <span className="text-white text-xs font-bold">Core</span>
        </div>

        {/* Satellites */}
        {satellites.map((item, i) => {
          const pos = getPosition(i, satellites.length);
          const isVisible = i < step;
          const isActive = i === step - 1;

          return (
            <div key={item.label} className="absolute" style={{ left: '50%', top: '50%' }}>
              {/* Connection line */}
              <div
                className="absolute w-[60px] h-[1px] origin-left"
                style={{
                  backgroundColor: `${item.color}40`,
                  transform: `rotate(${Math.atan2(pos.y, pos.x)}rad)`,
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  left: 0,
                  top: 0,
                }}
              />
              {/* Satellite node */}
              <div
                className="absolute flex flex-col items-center gap-1 transition-all duration-700"
                style={{
                  transform: isVisible
                    ? `translate(${pos.x - 16}px, ${pos.y - 16}px) scale(1)`
                    : 'translate(-16px, -16px) scale(0)',
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md"
                  style={{
                    backgroundColor: `${item.color}20`,
                    border: `2px solid ${isActive ? item.color : `${item.color}40`}`,
                    boxShadow: isActive ? `0 0 12px ${item.color}40` : 'none',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-[7px] text-white/60 whitespace-nowrap transition-opacity duration-300"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. Infinite Path (Timeline)
// ═══════════════════════════════════════════════════════════════════════════

function InfinitePathDemo() {
  const entry = GROUPED_ANIMATIONS[4];
  const { step, replay } = useStepper(5, 1600);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 overflow-hidden flex items-center">
        {/* Road container that slides */}
        <div
          className="flex items-center gap-0 h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${-step * 120 + 100}px)`,
          }}
        >
          {/* Road line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10" style={{ width: '900px' }} />

          {/* Items on the road */}
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col items-center w-[120px] shrink-0 relative transition-all duration-700"
              style={{
                opacity: i <= step ? 1 : 0.15,
              }}
            >
              {/* Vertical connector */}
              <div
                className="w-0.5 h-8 transition-all duration-500"
                style={{
                  backgroundColor: i <= step ? `${item.color}60` : 'rgba(255,255,255,0.1)',
                }}
              />
              {/* Node */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-500 mb-1"
                style={{
                  backgroundColor: `${item.color}${i <= step ? '25' : '10'}`,
                  border: `2px solid ${item.color}${i <= step ? '60' : '15'}`,
                  transform: i === step ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: i === step ? `0 4px 16px ${item.color}30` : 'none',
                }}
              >
                {item.icon}
              </div>
              <span
                className="text-[9px] font-medium transition-all duration-300"
                style={{ color: i === step ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
              >
                {item.label}
              </span>
              {/* Dot on the road */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i <= step ? item.color : 'rgba(255,255,255,0.2)',
                  marginTop: '32px',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Stack Reveal (Z-Axis)
// ═══════════════════════════════════════════════════════════════════════════

function StackRevealDemo() {
  const entry = GROUPED_ANIMATIONS[5];
  const items = ITEMS.slice(0, 4);
  const { step, replay } = useStepper(items.length + 1, 1600);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} stageClassName="perspective-[800px]">
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '800px' }}>
        {items.map((item, i) => {
          const isRevealed = i < step;
          const isCurrent = i === step;
          const stackOffset = Math.max(0, i - step);

          let transform: string;
          let opacity: number;
          let zIndex: number;

          if (isRevealed) {
            // Fly away to the left
            transform = `translateX(${-200 - (step - i - 1) * 30}px) rotateY(15deg) scale(0.8)`;
            opacity = Math.max(0, 0.5 - (step - i - 1) * 0.2);
            zIndex = 0;
          } else if (isCurrent) {
            // Front and center
            transform = 'translateZ(40px) rotateX(0deg)';
            opacity = 1;
            zIndex = 10;
          } else {
            // In the stack behind
            transform = `translateZ(${-stackOffset * 20}px) translateY(${stackOffset * 6}px) rotateX(8deg)`;
            opacity = Math.max(0.2, 0.7 - stackOffset * 0.2);
            zIndex = items.length - i;
          }

          return (
            <div
              key={item.label}
              className="absolute w-[160px] h-[100px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-700 shadow-xl"
              style={{
                backgroundColor: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                transform,
                opacity,
                zIndex,
                backfaceVisibility: 'hidden',
              }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white/90 text-xs font-bold">{item.label}</span>
              <span className="text-white/40 text-[8px]">Card {i + 1}</span>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. Fan-Out (Hand of Cards)
// ═══════════════════════════════════════════════════════════════════════════

function FanOutDemo() {
  const entry = GROUPED_ANIMATIONS[6];
  const items = ITEMS.slice(0, 5);
  const { step, replay } = useStepper(items.length + 1, 1000);
  const isFanned = step > 0;

  // Fan angles for 5 items: -30, -15, 0, 15, 30
  const fanAngle = (i: number) => (i - Math.floor(items.length / 2)) * 15;
  const highlightIndex = Math.min(step - 1, items.length - 1);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 flex items-center justify-center">
        {items.map((item, i) => {
          const angle = fanAngle(i);
          const isHighlighted = isFanned && i === highlightIndex;

          return (
            <div
              key={item.label}
              className="absolute transition-all duration-700 origin-bottom"
              style={{
                transform: isFanned
                  ? `rotate(${angle}deg) translateY(-40px)`
                  : 'rotate(0deg) translateY(0)',
                zIndex: isHighlighted ? 20 : 10 - Math.abs(angle),
              }}
            >
              <div
                className="w-12 h-16 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-lg"
                style={{
                  backgroundColor: isHighlighted ? `${item.color}30` : `${item.color}15`,
                  border: `2px solid ${isHighlighted ? item.color : `${item.color}30`}`,
                  transform: isHighlighted ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: isHighlighted ? `0 0 20px ${item.color}30` : '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[7px] text-white/60 font-medium">{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. Molecular Bond (Network)
// ═══════════════════════════════════════════════════════════════════════════

function MolecularBondDemo() {
  const entry = GROUPED_ANIMATIONS[7];
  const items = ITEMS.slice(0, 5);
  const { step, replay } = useStepper(items.length + 1, 1200);

  const positions = [
    { x: -70, y: -50 },
    { x: 70, y: -40 },
    { x: -55, y: 50 },
    { x: 65, y: 55 },
    { x: 0, y: -70 },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* SVG bonds */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {positions.map((pos, i) => {
            const cx = 50; // center %
            const cy = 50;
            const isVisible = i < step;
            return (
              <line
                key={`bond-${i}`}
                x1={`${cx}%`}
                y1={`${cy}%`}
                x2={`${cx + pos.x * 0.35}%`}
                y2={`${cy + pos.y * 0.35}%`}
                stroke={isVisible ? `${items[i].color}60` : 'transparent'}
                strokeWidth="1.5"
                strokeDasharray="60"
                strokeDashoffset={isVisible ? 0 : 60}
                style={{ transition: 'all 0.8s ease-out' }}
              />
            );
          })}
        </svg>

        {/* Central bubble */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-white/20 flex items-center justify-center z-10 shadow-lg">
          <span className="text-white text-[10px] font-bold">Ideas</span>
        </div>

        {/* Child bubbles */}
        {items.map((item, i) => {
          const pos = positions[i];
          const isVisible = i < step;
          const isActive = i === step - 1;

          return (
            <div
              key={item.label}
              className="absolute transition-all duration-700"
              style={{
                left: '50%',
                top: '50%',
                transform: isVisible
                  ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(1)`
                  : 'translate(-50%, -50%) scale(0)',
                opacity: isVisible ? 1 : 0,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                style={{
                  backgroundColor: `${item.color}20`,
                  border: `2px solid ${isActive ? item.color : `${item.color}40`}`,
                  boxShadow: isActive ? `0 0 16px ${item.color}30` : 'none',
                }}
              >
                {item.icon}
              </div>
              <div
                className="text-[7px] text-center mt-0.5 transition-opacity duration-300"
                style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. Perspective Pivot (3D Flip)
// ═══════════════════════════════════════════════════════════════════════════

function PerspectivePivotDemo() {
  const entry = GROUPED_ANIMATIONS[8];
  const items = ITEMS.slice(0, 4);
  const { step, replay } = useStepper(items.length, 2000);

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '600px' }}>
        <div
          className="relative w-[140px] h-[100px] transition-transform duration-1000"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${-step * 90}deg)`,
          }}
        >
          {/* 4 faces of the cube */}
          {items.map((item, i) => {
            const faceStyles: React.CSSProperties[] = [
              { transform: 'translateZ(70px)' },
              { transform: 'rotateY(90deg) translateZ(70px)' },
              { transform: 'rotateY(180deg) translateZ(70px)' },
              { transform: 'rotateY(270deg) translateZ(70px)' },
            ];

            return (
              <div
                key={item.label}
                className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 backface-hidden"
                style={{
                  ...faceStyles[i],
                  backgroundColor: `${item.color}20`,
                  border: `1px solid ${item.color}40`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white/90 text-xs font-bold">{item.label}</span>
                <span className="text-white/40 text-[8px]">Face {i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. Magnifying Glass (Map/Canvas)
// ═══════════════════════════════════════════════════════════════════════════

function MagnifyingGlassDemo() {
  const entry = GROUPED_ANIMATIONS[9];
  const items = ITEMS.slice(0, 4);
  const { step, replay } = useStepper(items.length + 1, 1800);

  // Grid positions for items (as percentages)
  const gridPos = [
    { x: 25, y: 30 },
    { x: 70, y: 25 },
    { x: 30, y: 70 },
    { x: 68, y: 68 },
  ];

  const lensTarget = step > 0 && step <= items.length ? gridPos[step - 1] : { x: 50, y: 50 };

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Blurred background canvas */}
        <div className="absolute inset-0" style={{ filter: 'blur(3px) brightness(0.4)' }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${gridPos[i].x}%`, top: `${gridPos[i].y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}
              >
                {item.icon}
              </div>
              <span className="text-white/60 text-[8px]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Magnifying lens */}
        <div
          className="absolute w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl transition-all duration-1000 ease-in-out"
          style={{
            left: `${lensTarget.x}%`,
            top: `${lensTarget.y}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(0,0,0,0.3)',
            background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.3) 100%)',
          }}
        >
          {/* Clear content inside the lens */}
          <div
            className="absolute"
            style={{
              width: '100vw',
              height: '100vh',
              left: `calc(50% - ${lensTarget.x}vw * 0.01 * var(--stage-w, 300))`,
              top: `calc(50% - ${lensTarget.y}vh * 0.01 * var(--stage-h, 200))`,
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.label}
                className="absolute flex flex-col items-center gap-1"
                style={{
                  left: `${gridPos[i].x}%`,
                  top: `${gridPos[i].y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${item.color}25`, border: `1.5px solid ${item.color}60` }}
                >
                  {item.icon}
                </div>
                <span className="text-white/90 text-[8px] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lens label */}
        {step > 0 && step <= items.length && (
          <div
            className="absolute text-[9px] text-white/80 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm transition-all duration-1000"
            style={{
              left: `${lensTarget.x}%`,
              top: `calc(${lensTarget.y}% + 56px)`,
              transform: 'translateX(-50%)',
            }}
          >
            {items[step - 1].label}
          </div>
        )}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section Export
// ═══════════════════════════════════════════════════════════════════════════

export function GroupedSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ListAccumulatorDemo />
      <CarouselFocusDemo />
      <BentoGridDemo />
      <CircularSatelliteDemo />
      <InfinitePathDemo />
      <StackRevealDemo />
      <FanOutDemo />
      <MolecularBondDemo />
      <PerspectivePivotDemo />
      <MagnifyingGlassDemo />
    </div>
  );
}
