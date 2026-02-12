'use client';

import { useState, useCallback, useEffect } from 'react';
import { DemoStage } from './DemoStage';
import type { ThemeMode, TriggerMode } from './DemoStage';
import { GROUPED_ANIMATIONS } from '@/config/transition-catalog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DemoProps = {
  themeMode: ThemeMode;
  triggerMode: TriggerMode;
};

// ---------------------------------------------------------------------------
// Shared hook for stepped animations (supports auto + click trigger modes)
// ---------------------------------------------------------------------------

function useStepper(totalSteps: number, stepMs: number, triggerMode: TriggerMode = 'auto') {
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);

  // Focus override: when set, overrides which item is the "hero" without
  // changing the reveal progress (step). Used by sequential-focus demos so
  // clicking a previously-shown item spotlights it without hiding others.
  const [focusOverride, setFocusOverride] = useState<number | null>(null);

  /** Effective focus position — the item that should be rendered as "hero". */
  const focus = focusOverride ?? step;

  const replay = useCallback(() => {
    setStep(0);
    setFocusOverride(null);
    setRunId((r) => r + 1);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (triggerMode !== 'auto') return;
    if (step >= totalSteps) return;
    const t = setTimeout(() => setStep((s) => s + 1), stepMs);
    return () => clearTimeout(t);
  }, [step, totalSteps, stepMs, runId, triggerMode]);

  // Reset when trigger mode changes
  useEffect(() => {
    setStep(0);
    setFocusOverride(null);
    setRunId((r) => r + 1);
  }, [triggerMode]);

  // ---------------------------------------------------------------------------
  // Navigation controls — keyboard-driven, always clear focusOverride
  // ---------------------------------------------------------------------------

  const advance = useCallback(() => {
    setFocusOverride(null);
    setStep((s) => (s >= totalSteps ? 0 : s + 1));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setFocusOverride(null);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const goTo = useCallback((target: number) => {
    setFocusOverride(null);
    setStep(Math.max(0, Math.min(target, totalSteps)));
  }, [totalSteps]);

  const toStart = useCallback(() => { setFocusOverride(null); setStep(0); }, []);

  const toEnd = useCallback(() => { setFocusOverride(null); setStep(totalSteps); }, [totalSteps]);

  // ---------------------------------------------------------------------------
  // setFocus — click-driven, only changes the hero without altering reveal
  // ---------------------------------------------------------------------------

  /** Set focus to a specific item without changing the reveal progress (step). */
  const setFocus = useCallback((target: number) => {
    setFocusOverride(target);
  }, []);

  /** True when focus is overridden by a click (review mode). */
  const hasFocusOverride = focusOverride !== null;

  return { step, focus, hasFocusOverride, replay, runId, advance, goBack, goTo, setFocus, toStart, toEnd };
}

// ---------------------------------------------------------------------------
// Keyboard handler for grouped animations
// ---------------------------------------------------------------------------

function handleGroupedKeyDown(
  e: React.KeyboardEvent,
  controls: { advance: () => void; goBack: () => void; toStart: () => void; toEnd: () => void },
) {
  switch (e.key) {
    case 'ArrowRight':
    case ' ':
      e.preventDefault();
      controls.advance();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      controls.goBack();
      break;
    case 'ArrowUp':
      e.preventDefault();
      controls.toStart();
      break;
    case 'ArrowDown':
      e.preventDefault();
      controls.toEnd();
      break;
  }
}

// ---------------------------------------------------------------------------
// Shared item data
// ---------------------------------------------------------------------------

const ITEMS = [
  { icon: '🚀', label: 'Launch', color: '#3b82f6', desc: 'Ship features faster with streamlined deployment pipelines' },
  { icon: '📊', label: 'Analytics', color: '#8b5cf6', desc: 'Real-time insights and dashboards for data-driven decisions' },
  { icon: '🔒', label: 'Security', color: '#14b8a6', desc: 'Enterprise-grade encryption and compliance built in' },
  { icon: '⚡', label: 'Speed', color: '#f59e0b', desc: '10× faster processing with optimized infrastructure' },
  { icon: '🎯', label: 'Targeting', color: '#ef4444', desc: 'Precision audience segmentation and personalization' },
];

// ---------------------------------------------------------------------------
// Detail popup for hub-spoke interaction mode
// ---------------------------------------------------------------------------

function HubSpokePopup({ item, onClose }: { item: typeof ITEMS[0]; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-[2px]" style={{ backgroundColor: 'var(--demo-surface-muted)' }} />
      {/* Card */}
      <div
        className="relative rounded-xl p-4 shadow-2xl w-[180px] text-center backdrop-blur-md z-10"
        style={{
          backgroundColor: `${item.color}12`,
          border: `1.5px solid ${item.color}40`,
          boxShadow: `0 8px 32px ${item.color}25`,
          animation: 'vs-popup-enter 0.2s ease-out forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-2">{item.icon}</div>
        <div className="text-sm font-bold mb-1" style={{ color: item.color }}>{item.label}</div>
        <div className="text-[10px] leading-relaxed" style={{ color: 'var(--demo-text-40)' }}>{item.desc}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. List Accumulator (Left Sidebar)
//    Mode: sequential-focus, allowOutOfOrder: true
//    Enhanced: animated move-to-sidebar, click-from-sidebar reverse, showAllFromStart option
// ═══════════════════════════════════════════════════════════════════════════

function ListAccumulatorDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[0];
  const items = ITEMS.slice(0, 4);
  const { step, focus, hasFocusOverride, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(5, 1800, triggerMode);
  const clickable = triggerMode === 'click';

  // Option: show all items as faint placeholders in the sidebar from the start
  const showAllFromStart = false;

  // Hero: the item rendered big in the center (focus-driven)
  const heroIdx = focus < items.length ? focus : -1;

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
      <div className="absolute inset-0 flex">
        {/* Left sidebar — accumulated list */}
        <div className="w-[30%] bg-slate-800/50 border-r border-white/5 p-2 flex flex-col gap-1.5 pt-3">
          {items.map((item, i) => {
            const inSidebar = i < step;
            // Show as faint placeholder if showAllFromStart is enabled
            const showAsPlaceholder = showAllFromStart && !inSidebar;

            return (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-md transition-all duration-700"
                style={{
                  // Sidebar items animate FROM the center (right + larger) TO their sidebar position
                  opacity: inSidebar ? 1 : showAsPlaceholder ? 0.2 : 0,
                  transform: inSidebar
                    ? 'translateX(0) scale(1)'
                    : showAsPlaceholder
                      ? 'translateX(0) scale(1)'
                      : 'translateX(80px) scale(1.6)',
                  backgroundColor: i === heroIdx && hasFocusOverride ? `${item.color}25` : (i === step - 1 ? `${item.color}15` : 'transparent'),
                  transitionDelay: `${i * 50}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: clickable && inSidebar ? 'pointer' : 'default',
                  pointerEvents: inSidebar ? 'auto' : 'none',
                }}
                onClick={clickable && inSidebar ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i); } : undefined}
              >
                <span className="text-[10px]">{item.icon}</span>
                <span className="text-white/60 text-[8px] truncate">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Center — hero item */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {items.map((item, i) => {
            const isHero = i === heroIdx;
            // When hero changes due to focus override (sidebar click), animate from left
            const fromSidebar = hasFocusOverride && isHero;

            return (
              <div
                key={item.label}
                className="absolute flex flex-col items-center gap-2 transition-all duration-700"
                style={{
                  opacity: isHero ? 1 : 0,
                  transform: isHero
                    ? 'scale(1) translateY(0) translateX(0)'
                    : 'scale(0.35) translateX(-100px) translateY(-40px)',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
            );
          })}
          {step >= items.length && heroIdx < 0 && (
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
//    Mode: sequential-focus, allowOutOfOrder: true
//    Enhanced: animated move-to-shelf, click-from-shelf reverse, showAllFromStart option
// ═══════════════════════════════════════════════════════════════════════════

function CarouselFocusDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[1];
  const { step, focus, hasFocusOverride, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(5, 1600, triggerMode);
  const clickable = triggerMode === 'click';

  // Option: show all items in shelf from the start (visible as faint placeholders)
  const showAllFromStart = false;

  // Hero: the item shown big in the center (focus-driven)
  const activeIndex = focus < ITEMS.length ? focus : -1;

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
      <div className="absolute inset-0 flex flex-col">
        {/* Center stage */}
        <div className="flex-1 flex items-center justify-center relative">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="absolute flex flex-col items-center gap-2 transition-all duration-500"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                // Non-hero items shrink toward the bottom shelf (move-to-shelf effect)
                transform: i === activeIndex
                  ? 'scale(1) translateY(0)'
                  : 'scale(0.35) translateY(60px)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
          {ITEMS.map((item, i) => {
            // Committed items: have been the hero and moved on (i < step)
            const isRevealed = i < step;
            const isActive = i === activeIndex;
            // Show as faint placeholder if showAllFromStart is enabled
            const showAsPlaceholder = showAllFromStart && !isRevealed;
            // In review mode (focus override), the active item stays enabled & clickable
            const dimActive = isActive && !hasFocusOverride;
            const isClickable = clickable && isRevealed && (hasFocusOverride || !isActive);
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-0.5 transition-all duration-500"
                style={{
                  opacity: dimActive ? 0.3 : isRevealed ? 1 : showAsPlaceholder ? 0.2 : 0.3,
                  filter: dimActive ? 'grayscale(100%)' : isRevealed ? 'grayscale(0%)' : 'grayscale(100%)',
                  // Revealed items arrive from above (from center stage) — shrinking into place
                  transform: dimActive
                    ? 'scale(0.8) translateY(-4px)'
                    : 'scale(1) translateY(0)',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: isClickable ? 'pointer' : 'default',
                }}
                onClick={isClickable ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i); } : undefined}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: `${item.color}15`,
                    border: `1px solid ${isActive && hasFocusOverride ? item.color : `${item.color}30`}`,
                    boxShadow: isActive && hasFocusOverride ? `0 0 6px ${item.color}25` : 'none',
                  }}
                >
                  {item.icon}
                </div>
                <span className="text-white/40 text-[7px]">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Bento Grid Expansion
//    Mode: sequential-focus, allowOutOfOrder: true
// ═══════════════════════════════════════════════════════════════════════════

function BentoGridDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[2];
  const { focus, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(5, 2000, triggerMode);
  const items = ITEMS.slice(0, 4);
  const clickable = triggerMode === 'click';

  // Hero: expanded item (focus-driven). Thumbnails are always visible.
  const expandedIndex = focus < items.length ? focus : -1;

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
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
              className="flex-1 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-500"
              style={{
                backgroundColor: i === expandedIndex ? `${item.color}30` : `${item.color}10`,
                border: `1px solid ${i === expandedIndex ? `${item.color}50` : `${item.color}15`}`,
                opacity: i === expandedIndex ? 1 : 0.6,
                transform: i === expandedIndex ? 'scale(1.05)' : 'scale(1)',
                cursor: clickable && i !== expandedIndex ? 'pointer' : 'default',
              }}
              onClick={clickable && i !== expandedIndex ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i); } : undefined}
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
//    Mode: hub-spoke
// ═══════════════════════════════════════════════════════════════════════════

function CircularSatelliteDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[3];
  const { step, replay, advance, goBack, toStart, toEnd } = useStepper(6, 1200, triggerMode);
  const satellites = ITEMS.slice(0, 5);
  const clickable = triggerMode === 'click';
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  // Close popup on mode change
  useEffect(() => { setSelectedChild(null); }, [triggerMode]);

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (selectedChild !== null) { e.preventDefault(); setSelectedChild(null); }
          return;
        }
        if (selectedChild !== null) setSelectedChild(null);
        handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd });
      }
    : undefined;

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
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
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
                  cursor: clickable && isVisible ? 'pointer' : 'default',
                }}
                onClick={clickable && isVisible ? (e: React.MouseEvent) => { e.stopPropagation(); setSelectedChild(selectedChild === i ? null : i); } : undefined}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: `${item.color}20`,
                    border: `2px solid ${isActive || selectedChild === i ? item.color : `${item.color}40`}`,
                    boxShadow: isActive || selectedChild === i ? `0 0 12px ${item.color}40` : 'none',
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

      {/* Detail popup */}
      {selectedChild !== null && <HubSpokePopup item={satellites[selectedChild]} onClose={() => setSelectedChild(null)} />}
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. Infinite Path (Timeline)
//    Mode: sequential-focus, allowOutOfOrder: true
// ═══════════════════════════════════════════════════════════════════════════

function InfinitePathDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[4];
  const { step, focus, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(5, 1600, triggerMode);
  const clickable = triggerMode === 'click';

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
      <div className="absolute inset-0 overflow-hidden flex items-center">
        {/* Road container — scrolls to the focused item */}
        <div
          className="flex items-center gap-0 h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(${-focus * 120 + 100}px)`,
          }}
        >
          {/* Road line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10" style={{ width: '900px' }} />

          {/* Items on the road */}
          {ITEMS.map((item, i) => {
            // Committed items (i < step) + the focused item are "shown"
            const isShown = i < step || i === focus;
            const isClickable = clickable && isShown;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center w-[120px] shrink-0 relative transition-all duration-700"
                style={{
                  opacity: isShown ? 1 : 0.15,
                  cursor: isClickable ? 'pointer' : 'default',
                }}
                onClick={isClickable ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i); } : undefined}
              >
                {/* Vertical connector */}
                <div
                  className="w-0.5 h-8 transition-all duration-500"
                  style={{
                    backgroundColor: isShown ? `${item.color}60` : 'var(--demo-surface-muted)',
                  }}
                />
                {/* Node */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-500 mb-1"
                  style={{
                    backgroundColor: `${item.color}${isShown ? '25' : '10'}`,
                    border: `2px solid ${item.color}${isShown ? '60' : '15'}`,
                    transform: i === focus ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: i === focus ? `0 4px 16px ${item.color}30` : 'none',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-[9px] font-medium transition-all duration-300"
                  style={{ color: i === focus ? 'var(--demo-text)' : 'var(--demo-text-40)' }}
                >
                  {item.label}
                </span>
                {/* Dot on the road */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: isShown ? item.color : 'var(--demo-surface-strong)',
                    marginTop: '32px',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Stack Reveal (Z-Axis)
//    Mode: sequential-focus, allowOutOfOrder: false
// ═══════════════════════════════════════════════════════════════════════════

function StackRevealDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[5];
  const items = ITEMS.slice(0, 4);
  const { step, replay, advance, goBack, toStart, toEnd } = useStepper(items.length + 1, 1600, triggerMode);
  const clickable = triggerMode === 'click';

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown} stageClassName="perspective-[800px]">
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '800px' }}>
        {items.map((item, i) => {
          const isRevealed = i < step;
          const isCurrent = i === step;
          const stackOffset = Math.max(0, i - step);

          let transform: string;
          let opacity: number;
          let zIndex: number;

          if (isRevealed) {
            transform = `translateX(${-200 - (step - i - 1) * 30}px) rotateY(15deg) scale(0.8)`;
            opacity = Math.max(0, 0.5 - (step - i - 1) * 0.2);
            zIndex = 0;
          } else if (isCurrent) {
            transform = 'translateZ(40px) rotateX(0deg)';
            opacity = 1;
            zIndex = 10;
          } else {
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
//    Mode: sequential-focus, allowOutOfOrder: true
// ═══════════════════════════════════════════════════════════════════════════

function FanOutDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[6];
  const items = ITEMS.slice(0, 5);
  const { step, focus, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(items.length + 1, 1000, triggerMode);
  const clickable = triggerMode === 'click';

  // Fan state: driven by step (reveal progress)
  const isFanned = step > 0;
  // Fan angles for 5 items: -30, -15, 0, 15, 30
  const fanAngle = (i: number) => (i - Math.floor(items.length / 2)) * 15;
  // Highlight: driven by focus (which card is spotlighted)
  const highlightIndex = focus > 0 ? Math.min(focus - 1, items.length - 1) : -1;

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
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
                cursor: clickable && isFanned ? 'pointer' : 'default',
              }}
              onClick={clickable && isFanned ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i + 1); } : undefined}
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
                <span className="text-white/60 text-[7px] font-medium">{item.label}</span>
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
//    Mode: hub-spoke
// ═══════════════════════════════════════════════════════════════════════════

function MolecularBondDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[7];
  const items = ITEMS.slice(0, 5);
  const { step, replay, advance, goBack, toStart, toEnd } = useStepper(items.length + 1, 1200, triggerMode);
  const clickable = triggerMode === 'click';
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  // Close popup on mode change
  useEffect(() => { setSelectedChild(null); }, [triggerMode]);

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (selectedChild !== null) { e.preventDefault(); setSelectedChild(null); }
          return;
        }
        if (selectedChild !== null) setSelectedChild(null);
        handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd });
      }
    : undefined;

  const positions = [
    { x: -70, y: -50 },
    { x: 70, y: -40 },
    { x: -55, y: 50 },
    { x: 65, y: 55 },
    { x: 0, y: -70 },
  ];

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* SVG bonds */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {positions.map((pos, i) => {
            const cx = 50;
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
        <div
          className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center z-10 shadow-lg"
          style={{ background: 'var(--demo-center-gradient)' }}
        >
          <span className="text-[10px] font-bold" style={{ color: 'var(--demo-node-text)' }}>Ideas</span>
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
                cursor: clickable && isVisible ? 'pointer' : 'default',
              }}
              onClick={clickable && isVisible ? (e: React.MouseEvent) => { e.stopPropagation(); setSelectedChild(selectedChild === i ? null : i); } : undefined}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                style={{
                  backgroundColor: `${item.color}20`,
                  border: `2px solid ${isActive || selectedChild === i ? item.color : `${item.color}40`}`,
                  boxShadow: isActive || selectedChild === i ? `0 0 16px ${item.color}30` : 'none',
                }}
              >
                {item.icon}
              </div>
              <div
                className="text-[7px] text-center mt-0.5 transition-opacity duration-300"
                style={{ color: isActive ? 'var(--demo-text)' : 'var(--demo-text-40)' }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail popup */}
      {selectedChild !== null && <HubSpokePopup item={items[selectedChild]} onClose={() => setSelectedChild(null)} />}
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. Perspective Pivot (3D Flip)
//    Mode: sequential-focus, allowOutOfOrder: false
// ═══════════════════════════════════════════════════════════════════════════

function PerspectivePivotDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[8];
  const items = ITEMS.slice(0, 4);
  const { step, replay, advance, goBack, toStart, toEnd } = useStepper(items.length, 2000, triggerMode);
  const clickable = triggerMode === 'click';

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
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
//     Mode: sequential-focus, allowOutOfOrder: true
// ═══════════════════════════════════════════════════════════════════════════

function MagnifyingGlassDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[9];
  const items = ITEMS.slice(0, 4);
  const { focus, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(items.length + 1, 1800, triggerMode);
  const isDark = themeMode === 'dark';
  const clickable = triggerMode === 'click';

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  // Grid positions for items (as percentages)
  const gridPos = [
    { x: 25, y: 30 },
    { x: 70, y: 25 },
    { x: 30, y: 70 },
    { x: 68, y: 68 },
  ];

  // Lens target: driven by focus (not step)
  const lensTarget = focus > 0 && focus <= items.length ? gridPos[focus - 1] : { x: 50, y: 50 };
  const focusedItemIndex = focus > 0 && focus <= items.length ? focus - 1 : -1;

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replay} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Blurred background canvas */}
        <div
          className="absolute inset-0"
          style={{ filter: isDark ? 'blur(3px) brightness(0.4)' : 'blur(3px) brightness(0.85) saturate(0.5)' }}
        >
          {items.map((item, i) => (
            <div
              key={item.label}
              className="absolute flex flex-col items-center gap-1"
              style={{
                left: `${gridPos[i].x}%`,
                top: `${gridPos[i].y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: clickable ? 'pointer' : 'default',
              }}
              onClick={clickable ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i + 1); } : undefined}
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
        {focusedItemIndex >= 0 && (
          <div
            className="absolute text-[9px] text-white/80 font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm transition-all duration-1000"
            style={{
              left: `${lensTarget.x}%`,
              top: `calc(${lensTarget.y}% + 56px)`,
              transform: 'translateX(-50%)',
            }}
          >
            {items[focusedItemIndex].label}
          </div>
        )}
      </div>
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 11. Items Grid (Row / Column)
//     Mode: sequential-focus, allowOutOfOrder: true
//     Multiple animation modes: one-by-one, opacity-highlight, callout
//     Transition to sidebar (List Accumulator) layout
// ═══════════════════════════════════════════════════════════════════════════

const GRID_ITEMS = [
  { icon: '🚀', label: 'Launch', color: '#3b82f6', desc: 'Ship features faster with streamlined deployment pipelines', subtitle: 'Go Live' },
  { icon: '📊', label: 'Analytics', color: '#8b5cf6', desc: 'Real-time insights and dashboards for data-driven decisions', subtitle: 'Data-Driven' },
  { icon: '🔒', label: 'Security', color: '#14b8a6', desc: 'Enterprise-grade encryption and compliance built in', subtitle: 'Enterprise' },
  { icon: '⚡', label: 'Speed', color: '#f59e0b', desc: '10× faster processing with optimized infrastructure', subtitle: 'Performance' },
  { icon: '🎯', label: 'Targeting', color: '#ef4444', desc: 'Precision audience segmentation and personalization', subtitle: 'Smart Focus' },
];

// Default grid layouts for different item counts
function getGridLayout(count: number): { rows: number[]; cols: number } {
  const layouts: Record<number, { rows: number[]; cols: number }> = {
    2: { rows: [2], cols: 2 },
    3: { rows: [3], cols: 3 },
    4: { rows: [2, 2], cols: 2 },
    5: { rows: [2, 3], cols: 3 },
    6: { rows: [3, 3], cols: 3 },
    7: { rows: [3, 4], cols: 4 },
    8: { rows: [4, 4], cols: 4 },
  };
  return layouts[count] || { rows: [count], cols: count };
}

type GridAnimMode = 'one-by-one' | 'opacity-highlight';

function ItemsGridDemo({ themeMode, triggerMode }: DemoProps) {
  const entry = GROUPED_ANIMATIONS[10];
  const items = GRID_ITEMS;
  const { step, focus, replay, advance, goBack, setFocus, toStart, toEnd } = useStepper(items.length + 1, 1400, triggerMode);
  const clickable = triggerMode === 'click';
  const layout = getGridLayout(items.length);

  // Animation mode: toggleable in the demo
  const [animMode, setAnimMode] = useState<GridAnimMode>('one-by-one');
  // Show callout for active item
  const showCallout = true;

  // Track the transition-to-sidebar phase
  const [transitionPhase, setTransitionPhase] = useState<'grid' | 'transitioning' | 'sidebar'>('grid');

  // Active item for callout and highlight
  const activeIdx = focus < items.length ? focus : -1;

  const onKeyDown = clickable
    ? (e: React.KeyboardEvent) => handleGroupedKeyDown(e, { advance, goBack, toStart, toEnd })
    : undefined;

  // Detect when all items are shown → auto-trigger transition after delay (auto mode only)
  useEffect(() => {
    if (step >= items.length + 1 && triggerMode === 'auto' && transitionPhase === 'grid') {
      const t = setTimeout(() => setTransitionPhase('transitioning'), 800);
      const t2 = setTimeout(() => setTransitionPhase('sidebar'), 1400);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [step, triggerMode, items.length, transitionPhase]);

  // Reset transition phase on replay
  useEffect(() => {
    setTransitionPhase('grid');
  }, [step === 0 ? 'reset' : '']); // eslint-disable-line react-hooks/exhaustive-deps

  const replayAll = useCallback(() => {
    setTransitionPhase('grid');
    replay();
  }, [replay]);

  // Build row-based grid structure
  let itemIdx = 0;
  const rows = layout.rows.map((rowCount) => {
    const rowItems = items.slice(itemIdx, itemIdx + rowCount);
    itemIdx += rowCount;
    return rowItems;
  });

  return (
    <DemoStage index={entry.index} title={entry.name} description={entry.description} whyGreat={entry.whyGreat} category="Grouped" onReplay={replayAll} themeMode={themeMode} onStageClick={clickable ? advance : undefined} onKeyDown={onKeyDown}>
      {/* Animation mode toggle (overlaid) */}
      <div className="absolute top-2 left-2 z-20 flex gap-1">
        {(['one-by-one', 'opacity-highlight'] as GridAnimMode[]).map((mode) => (
          <button
            key={mode}
            className="px-1.5 py-0.5 rounded text-[7px] font-medium transition-colors"
            style={{
              backgroundColor: animMode === mode ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)',
              color: animMode === mode ? '#93c5fd' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${animMode === mode ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
            }}
            onClick={(e) => { e.stopPropagation(); setAnimMode(mode); replayAll(); }}
          >
            {mode === 'one-by-one' ? 'One by One' : 'Highlight'}
          </button>
        ))}
      </div>

      {transitionPhase === 'sidebar' ? (
        /* ── Sidebar layout (post-transition) ── */
        <div className="absolute inset-0 flex">
          <div className="w-[30%] bg-slate-800/50 border-r border-white/5 p-2 flex flex-col gap-1.5 pt-3">
            {items.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-md transition-all duration-500"
                style={{
                  backgroundColor: i === 0 ? `${item.color}20` : 'transparent',
                  border: i === 0 ? `1px solid ${item.color}30` : '1px solid transparent',
                }}
              >
                <span className="text-[10px]">{item.icon}</span>
                <span className="text-white/60 text-[8px] truncate">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2" style={{ animation: 'vs-smooth-fade 0.5s ease-out forwards' }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${items[0].color}20`, border: `2px solid ${items[0].color}50` }}
              >
                {items[0].icon}
              </div>
              <div className="text-white/90 text-xs font-bold">{items[0].label}</div>
              <div className="text-white/40 text-[8px] max-w-[160px] text-center">{items[0].desc}</div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Grid layout ── */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
          {(() => {
            let globalIdx = 0;
            return rows.map((rowItems, rowIdx) => (
              <div key={rowIdx} className="flex gap-3 justify-center">
                {rowItems.map((item) => {
                  const i = globalIdx++;
                  const isShown = animMode === 'one-by-one'
                    ? i < step
                    : true; // opacity-highlight shows all from start
                  const isActive = i === activeIdx;
                  const isHighlighted = animMode === 'opacity-highlight' && isActive;
                  const isTransitioning = transitionPhase === 'transitioning';

                  return (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-1 relative"
                      style={{
                        opacity: isTransitioning
                          ? 0.6
                          : animMode === 'opacity-highlight'
                            ? (step === 0 ? 0.3 : isHighlighted ? 1 : 0.3)
                            : isShown ? 1 : 0,
                        transform: isTransitioning
                          ? `scale(0.5) translateX(-${60 + i * 10}px)`
                          : isHighlighted
                            ? 'scale(1.08)'
                            : isShown
                              ? 'scale(1)'
                              : 'scale(0.7)',
                        filter: animMode === 'opacity-highlight' && !isHighlighted && step > 0
                          ? 'grayscale(50%)'
                          : 'none',
                        transition: isTransitioning
                          ? `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`
                          : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: clickable && isShown ? 'pointer' : 'default',
                      }}
                      onClick={clickable && isShown ? (e: React.MouseEvent) => { e.stopPropagation(); setFocus(i); } : undefined}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                        style={{
                          backgroundColor: `${item.color}${isActive ? '30' : '15'}`,
                          border: `1.5px solid ${item.color}${isActive ? '60' : '25'}`,
                          boxShadow: isHighlighted ? `0 4px 16px ${item.color}25` : 'none',
                        }}
                      >
                        {item.icon}
                      </div>
                      <span className="text-white/80 text-[8px] font-semibold">{item.label}</span>
                      <span className="text-white/30 text-[7px]">{item.subtitle}</span>

                      {/* Callout context box for active item */}
                      {showCallout && isActive && !isTransitioning && (
                        <div
                          className="absolute -bottom-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[7px] text-white/70 z-10"
                          style={{
                            backgroundColor: `${item.color}20`,
                            border: `1px solid ${item.color}30`,
                            animation: 'vs-callout-enter 0.3s ease-out forwards',
                          }}
                        >
                          {item.desc.slice(0, 40)}…
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      )}
    </DemoStage>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section Export
// ═══════════════════════════════════════════════════════════════════════════

export function GroupedSection({ themeMode, triggerMode }: { themeMode: ThemeMode; triggerMode: TriggerMode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ListAccumulatorDemo themeMode={themeMode} triggerMode={triggerMode} />
      <CarouselFocusDemo themeMode={themeMode} triggerMode={triggerMode} />
      <BentoGridDemo themeMode={themeMode} triggerMode={triggerMode} />
      <CircularSatelliteDemo themeMode={themeMode} triggerMode={triggerMode} />
      <InfinitePathDemo themeMode={themeMode} triggerMode={triggerMode} />
      <StackRevealDemo themeMode={themeMode} triggerMode={triggerMode} />
      <FanOutDemo themeMode={themeMode} triggerMode={triggerMode} />
      <MolecularBondDemo themeMode={themeMode} triggerMode={triggerMode} />
      <PerspectivePivotDemo themeMode={themeMode} triggerMode={triggerMode} />
      <MagnifyingGlassDemo themeMode={themeMode} triggerMode={triggerMode} />
      <ItemsGridDemo themeMode={themeMode} triggerMode={triggerMode} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// @internal — exported for automated testing only
// ---------------------------------------------------------------------------

export { useStepper, handleGroupedKeyDown, ListAccumulatorDemo, CarouselFocusDemo };
export type { DemoProps };
