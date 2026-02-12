/**
 * Demo slide deck — 14 slides showcasing various visual elements,
 * grouped animations, standalone elements, and slide transitions.
 *
 * Includes new elements: Zoom-In Word Reveal (slide 2), Items Grid (slides 3, 6),
 * Slide Title headers (slides 3–4, 6–7), and Grid-to-Sidebar transition (slides 6→7).
 *
 * Used by the Slide Editor and Slide Play dev pages.
 *
 * Each slide has BOTH:
 *   - `items`    — the new recursive SlideItem tree (layout/card/atom)
 *   - `elements` — the legacy flat SlideElement[] for backward compatibility
 */

import type { Slide, SlideItem, AtomItem, LayoutItem, CardItem } from '@/types/slide';
import type { SlideScript } from '@/types/script';
import type { GroupedAnimationConfig, HoverEffect } from '@/types/animation';

// ---------------------------------------------------------------------------
// Shared Helpers
// ---------------------------------------------------------------------------

const defaultHover: HoverEffect = {
  type: 'zoom',
  scale: 1.08,
  showLabel: false,
  labelPosition: 'bottom',
  showTooltip: true,
  transitionMs: 150,
};

let _elemId = 0;
function eid(): string {
  return `el-${++_elemId}`;
}

// -- SlideItem builder helpers --

function atom(
  id: string,
  atomType: AtomItem['atomType'],
  content: string,
  opts?: Partial<Omit<AtomItem, 'id' | 'type' | 'atomType' | 'content'>>,
): AtomItem {
  return { id, type: 'atom', atomType, content, ...opts };
}

function card(
  id: string,
  children: SlideItem[],
  opts?: Partial<Omit<CardItem, 'id' | 'type' | 'children'>>,
): CardItem {
  return { id, type: 'card', children, ...opts };
}

function layout(
  id: string,
  layoutType: LayoutItem['layoutType'],
  children: SlideItem[],
  opts?: Partial<Omit<LayoutItem, 'id' | 'type' | 'layoutType' | 'children'>>,
): LayoutItem {
  return { id, type: 'layout', layoutType, children, ...opts };
}

// ---------------------------------------------------------------------------
// Slide 1 — Title Slide (standalone elements, fade transition)
// ---------------------------------------------------------------------------

const slide1Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Visual Storytelling Platform',
    animation: { type: 'fade-in' as const, duration: 1.2, delay: 0.2, easing: 'ease-out' as const },
    position: { x: 80, y: 100 },
    style: { fontSize: 48, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Create stunning animated presentations with AI-powered automation',
    animation: { type: 'fade-in' as const, duration: 1, delay: 0.8, easing: 'ease-out' as const },
    position: { x: 80, y: 200 },
    style: { fontSize: 22, color: '#64748b' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '',
    animation: { type: 'scale-in' as const, duration: 0.8, delay: 1.2, easing: 'spring' as const },
    position: { x: 700, y: 80 },
    style: { width: 200, height: 200, backgroundColor: '#3b82f6', borderRadius: 100, opacity: 0.15 },
  },
];

// ---------------------------------------------------------------------------
// Slide 2 — Section Opener (Zoom-In Word Reveal, standalone, fade transition)
// ---------------------------------------------------------------------------

const slide2Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Platform\nCapabilities',
    animation: { type: 'scale-in' as const, duration: 1.5, delay: 0.3, easing: 'spring' as const },
    position: { x: 200, y: 140 },
    style: { fontSize: 56, fontWeight: 'bold' as const, color: '#1e293b', textAlign: 'center' as const },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Section 1 of 3',
    animation: { type: 'fade-in' as const, duration: 0.6, delay: 1.8, easing: 'ease-out' as const },
    position: { x: 380, y: 320 },
    style: { fontSize: 14, color: '#94a3b8', textAlign: 'center' as const },
  },
];

// ---------------------------------------------------------------------------
// Slide 3 — Capability Overview (items-grid grouped, morph transition)
// ---------------------------------------------------------------------------

const slide3GridItems = [
  { id: eid(), icon: '🎨', title: 'Smart Templates', description: 'AI-selected animation templates based on content', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '🎬', title: 'Auto Animation', description: 'Automatic timing and transition assignment', color: '#3b82f6', elementIds: [] as string[] },
  { id: eid(), icon: '🎙️', title: 'Voice Sync', description: 'Synchronize animations with voice-over narration', color: '#10b981', elementIds: [] as string[] },
  { id: eid(), icon: '📤', title: 'Multi-Export', description: 'Export to video, web player, or embed widget', color: '#f59e0b', elementIds: [] as string[] },
  { id: eid(), icon: '🤖', title: 'AI Assistant', description: 'Script feedback and content suggestions', color: '#ef4444', elementIds: [] as string[] },
];

const slide3GridGroup: GroupedAnimationConfig = {
  type: 'items-grid',
  items: slide3GridItems,
  stepDuration: 1400,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide3Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Platform Capabilities',
    animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 20 },
    style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Five core pillars powering your visual stories',
    animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const },
    position: { x: 80, y: 58 },
    style: { fontSize: 14, color: '#64748b' },
  },
];

// ---------------------------------------------------------------------------
// Slide 4 — Feature List (list-accumulator grouped, slide-left transition)
// ---------------------------------------------------------------------------

const slide4GroupItems = [
  { id: eid(), icon: '🎨', title: 'Smart Templates', description: 'AI-selected animation templates based on content', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '🎬', title: 'Auto Animation', description: 'Automatic timing and transition assignment', color: '#3b82f6', elementIds: [] as string[] },
  { id: eid(), icon: '🎙️', title: 'Voice Sync', description: 'Synchronize animations with voice-over narration', color: '#10b981', elementIds: [] as string[] },
  { id: eid(), icon: '📤', title: 'Multi-Export', description: 'Export to video, web player, or embed widget', color: '#f59e0b', elementIds: [] as string[] },
  { id: eid(), icon: '🤖', title: 'AI Assistant', description: 'Script feedback and content suggestions', color: '#ef4444', elementIds: [] as string[] },
];

const slide4Group: GroupedAnimationConfig = {
  type: 'list-accumulator',
  items: slide4GroupItems,
  stepDuration: 1800,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide4Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Key Features',
    animation: { type: 'slide-down' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 15 },
    style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Exploring each capability in detail',
    animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const },
    position: { x: 80, y: 52 },
    style: { fontSize: 13, color: '#94a3b8' },
  },
];

// ---------------------------------------------------------------------------
// Slide 5 — How It Works (carousel-focus grouped, zoom-in transition)
// ---------------------------------------------------------------------------

const slide5GroupItems = [
  { id: eid(), icon: '1️⃣', title: 'Upload Content', description: 'Import your script, text, or bullet points', color: '#6366f1', elementIds: [] as string[] },
  { id: eid(), icon: '2️⃣', title: 'AI Analysis', description: 'Content is analyzed for type, sentiment, and structure', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '3️⃣', title: 'Template Match', description: 'Best-fit animation template is selected automatically', color: '#a855f7', elementIds: [] as string[] },
  { id: eid(), icon: '4️⃣', title: 'Preview & Edit', description: 'Fine-tune timing, transitions, and visual elements', color: '#c084fc', elementIds: [] as string[] },
  { id: eid(), icon: '5️⃣', title: 'Publish', description: 'Export to video, web player, or embed on any site', color: '#d8b4fe', elementIds: [] as string[] },
];

const slide5Group: GroupedAnimationConfig = {
  type: 'carousel-focus',
  items: slide5GroupItems,
  stepDuration: 2200,
  hoverEffect: { ...defaultHover, type: 'lift' },
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide5Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'How It Works',
    animation: { type: 'slide-down' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 30 },
    style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' },
  },
];

// ---------------------------------------------------------------------------
// Slide 6 — Process Overview Grid (items-grid with grid-to-sidebar transition)
// ---------------------------------------------------------------------------

const slide6GridItems = [
  { id: eid(), icon: '📝', title: 'Write Script', description: 'Draft or import your presentation script and talking points', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '🎨', title: 'Pick Template', description: 'Choose from AI-recommended animation templates', color: '#3b82f6', elementIds: [] as string[] },
  { id: eid(), icon: '🎬', title: 'Auto-Animate', description: 'Let the engine assign timing and transitions automatically', color: '#10b981', elementIds: [] as string[] },
  { id: eid(), icon: '🔍', title: 'Preview', description: 'Watch a full preview with voice-over synchronization', color: '#f59e0b', elementIds: [] as string[] },
];

const slide6GridGroup: GroupedAnimationConfig = {
  type: 'items-grid',
  items: slide6GridItems,
  stepDuration: 1500,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};
// ↑ This slide uses animationTemplate 'grid-to-sidebar' which adds a migration
// transition sub-step after the end-state: items animate from grid → sidebar column.

const slide6Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Creation Process',
    animation: { type: 'fade-in' as const, duration: 0.6, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 20 },
    style: { fontSize: 28, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Four steps from idea to presentation',
    animation: { type: 'fade-in' as const, duration: 0.5, delay: 0.3, easing: 'ease-out' as const },
    position: { x: 80, y: 58 },
    style: { fontSize: 14, color: '#64748b' },
  },
];

// ---------------------------------------------------------------------------
// Slide 7 — Process Detail (list-accumulator with items pre-loaded in sidebar)
// Shows the same 4 items in a sidebar with expanded detail in the main panel.
// ---------------------------------------------------------------------------

const slide7SidebarItems = [
  { id: eid(), icon: '📝', title: 'Write Script', description: 'Start with your raw content — bullet points, paragraphs, or a full script. The editor supports markdown, imports from Google Docs, and paste-from-clipboard.', color: '#8b5cf6', elementIds: [] as string[] },
  { id: eid(), icon: '🎨', title: 'Pick Template', description: 'Choose from 28+ animation templates grouped by style. AI recommends the best match based on your content type (educational, promotional, storytelling).', color: '#3b82f6', elementIds: [] as string[] },
  { id: eid(), icon: '🎬', title: 'Auto-Animate', description: 'The animation engine assigns entrance effects, durations, delays, and transitions automatically. Every element gets the right animation at the right time.', color: '#10b981', elementIds: [] as string[] },
  { id: eid(), icon: '🔍', title: 'Preview', description: 'Watch a real-time preview with synchronized voice-over. Adjust timing with drag handles, swap animations with one click, and fine-tune easing curves.', color: '#f59e0b', elementIds: [] as string[] },
];

const slide7SidebarGroup: GroupedAnimationConfig = {
  type: 'list-accumulator',
  items: slide7SidebarItems,
  stepDuration: 2200,
  hoverEffect: defaultHover,
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide7Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Creation Process',
    animation: { type: 'fade-in' as const, duration: 0.5, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 15 },
    style: { fontSize: 24, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Deep dive into each step',
    animation: { type: 'fade-in' as const, duration: 0.4, delay: 0.2, easing: 'ease-out' as const },
    position: { x: 80, y: 48 },
    style: { fontSize: 13, color: '#94a3b8' },
  },
];

// ---------------------------------------------------------------------------
// Slide 8 — Comparison (standalone elements, push transition)
// ---------------------------------------------------------------------------

const slide8Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Traditional vs. VisualStory',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 40 },
    style: { fontSize: 34, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: 'Traditional Presentations\n• Manual animation setup\n• Static timing\n• No voice sync\n• Limited export',
    animation: { type: 'slide-left' as const, duration: 0.8, delay: 0.3, easing: 'ease-out' as const },
    position: { x: 40, y: 120 },
    style: { width: 380, height: 240, backgroundColor: '#fef2f2', borderRadius: 12, fontSize: 16, color: '#991b1b' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: 'VisualStory\n• AI-powered automation\n• Dynamic timing\n• Voice-over sync\n• Multi-format export',
    animation: { type: 'slide-right' as const, duration: 0.8, delay: 0.6, easing: 'ease-out' as const },
    position: { x: 480, y: 120 },
    style: { width: 380, height: 240, backgroundColor: '#f0fdf4', borderRadius: 12, fontSize: 16, color: '#166534' },
  },
  {
    id: eid(),
    type: 'icon' as const,
    content: '⚡',
    animation: { type: 'bounce' as const, duration: 0.6, delay: 1.2, easing: 'spring' as const },
    position: { x: 435, y: 210 },
    style: { fontSize: 40 },
  },
];

// ---------------------------------------------------------------------------
// Slide 9 — Tech Stack (bento-grid-expansion grouped, fade transition)
// ---------------------------------------------------------------------------

const slide9GroupItems = [
  { id: eid(), icon: '⚛️', title: 'React 19', description: 'Latest React with concurrent features', color: '#61dafb', elementIds: [] as string[] },
  { id: eid(), icon: '▲', title: 'Next.js 16', description: 'App Router with server components', color: '#000000', elementIds: [] as string[] },
  { id: eid(), icon: '🎞️', title: 'Remotion', description: 'Programmatic video creation in React', color: '#0b84f3', elementIds: [] as string[] },
  { id: eid(), icon: '🎨', title: 'Tailwind v4', description: 'Utility-first CSS framework', color: '#38bdf8', elementIds: [] as string[] },
  { id: eid(), icon: '🗄️', title: 'Supabase', description: 'Backend-as-a-service with real-time', color: '#3ecf8e', elementIds: [] as string[] },
  { id: eid(), icon: '🧠', title: 'OpenAI', description: 'AI content analysis and script feedback', color: '#10a37f', elementIds: [] as string[] },
];

const slide9Group: GroupedAnimationConfig = {
  type: 'bento-grid-expansion',
  items: slide9GroupItems,
  stepDuration: 1500,
  hoverEffect: { ...defaultHover, type: 'pulse' },
  allowOutOfOrder: false,
  triggerMode: 'auto',
};

const slide9Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Built With Modern Tech',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 30 },
    style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' },
  },
];

// ---------------------------------------------------------------------------
// Slide 10 — User Workflow (standalone elements with staggered animations)
// ---------------------------------------------------------------------------

const slide10Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Your Creative Workflow',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 30 },
    style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '📝 Write',
    animation: { type: 'slide-up' as const, duration: 0.6, delay: 0.3, easing: 'ease-out' as const },
    position: { x: 60, y: 150 },
    style: { width: 160, height: 100, backgroundColor: '#ede9fe', borderRadius: 12, fontSize: 20, fontWeight: 'bold' as const, color: '#5b21b6', textAlign: 'center' as const },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: '→',
    animation: { type: 'fade-in' as const, duration: 0.3, delay: 0.6, easing: 'linear' as const },
    position: { x: 240, y: 175 },
    style: { fontSize: 32, color: '#94a3b8' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '🎨 Design',
    animation: { type: 'slide-up' as const, duration: 0.6, delay: 0.6, easing: 'ease-out' as const },
    position: { x: 280, y: 150 },
    style: { width: 160, height: 100, backgroundColor: '#dbeafe', borderRadius: 12, fontSize: 20, fontWeight: 'bold' as const, color: '#1e40af', textAlign: 'center' as const },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: '→',
    animation: { type: 'fade-in' as const, duration: 0.3, delay: 0.9, easing: 'linear' as const },
    position: { x: 460, y: 175 },
    style: { fontSize: 32, color: '#94a3b8' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '🎬 Animate',
    animation: { type: 'slide-up' as const, duration: 0.6, delay: 0.9, easing: 'ease-out' as const },
    position: { x: 500, y: 150 },
    style: { width: 160, height: 100, backgroundColor: '#d1fae5', borderRadius: 12, fontSize: 20, fontWeight: 'bold' as const, color: '#065f46', textAlign: 'center' as const },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: '→',
    animation: { type: 'fade-in' as const, duration: 0.3, delay: 1.2, easing: 'linear' as const },
    position: { x: 680, y: 175 },
    style: { fontSize: 32, color: '#94a3b8' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '📤 Publish',
    animation: { type: 'slide-up' as const, duration: 0.6, delay: 1.2, easing: 'ease-out' as const },
    position: { x: 720, y: 150 },
    style: { width: 160, height: 100, backgroundColor: '#fef3c7', borderRadius: 12, fontSize: 20, fontWeight: 'bold' as const, color: '#92400e', textAlign: 'center' as const },
  },
];

// ---------------------------------------------------------------------------
// Slide 11 — Animation Engine (fan-out grouped, slide-up transition)
// ---------------------------------------------------------------------------

const slide11GroupItems = [
  { id: eid(), icon: '✨', title: 'Smooth Fade', description: 'Elegant opacity transitions', color: '#a78bfa', elementIds: [] as string[] },
  { id: eid(), icon: '🎈', title: 'Float In', description: 'Elements drift into position', color: '#34d399', elementIds: [] as string[] },
  { id: eid(), icon: '💥', title: 'Pop Zoom', description: 'Attention-grabbing scale entrance', color: '#fb923c', elementIds: [] as string[] },
  { id: eid(), icon: '✏️', title: 'Typewriter', description: 'Character-by-character text reveal', color: '#60a5fa', elementIds: [] as string[] },
];

const slide11Group: GroupedAnimationConfig = {
  type: 'fan-out',
  items: slide11GroupItems,
  stepDuration: 2000,
  hoverEffect: { ...defaultHover, type: 'brighten' },
  allowOutOfOrder: true,
  triggerMode: 'auto',
};

const slide11Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Animation Engine',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 30 },
    style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: '12 element animations × 11 grouped layouts × 5 slide transitions',
    animation: { type: 'fade-in' as const, duration: 0.6, delay: 0.4, easing: 'ease-out' as const },
    position: { x: 80, y: 80 },
    style: { fontSize: 16, color: '#64748b' },
  },
];

// ---------------------------------------------------------------------------
// Slide 12 — Export Options (standalone, morph transition)
// ---------------------------------------------------------------------------

const slide12Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Export Anywhere',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 40 },
    style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '🎥 MP4 Video\nHigh-quality video export\nfor social media & YouTube',
    animation: { type: 'scale-in' as const, duration: 0.6, delay: 0.3, easing: 'spring' as const },
    position: { x: 40, y: 130 },
    style: { width: 260, height: 180, backgroundColor: '#faf5ff', borderRadius: 16, fontSize: 14, color: '#581c87' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '🌐 Web Player\nInteractive presentation\nwith click navigation',
    animation: { type: 'scale-in' as const, duration: 0.6, delay: 0.6, easing: 'spring' as const },
    position: { x: 330, y: 130 },
    style: { width: 260, height: 180, backgroundColor: '#eff6ff', borderRadius: 16, fontSize: 14, color: '#1e3a5f' },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: '📦 Embed Widget\nDrop into any website\nwith a single code snippet',
    animation: { type: 'scale-in' as const, duration: 0.6, delay: 0.9, easing: 'spring' as const },
    position: { x: 620, y: 130 },
    style: { width: 260, height: 180, backgroundColor: '#f0fdf4', borderRadius: 16, fontSize: 14, color: '#14532d' },
  },
];

// ---------------------------------------------------------------------------
// Slide 13 — Pricing Tiers (stack-reveal grouped, push transition)
// ---------------------------------------------------------------------------

const slide13GroupItems = [
  { id: eid(), icon: '🆓', title: 'Free', description: '3 projects, basic templates, web player export', color: '#94a3b8', elementIds: [] as string[] },
  { id: eid(), icon: '⭐', title: 'Pro', description: 'Unlimited projects, all templates, video + embed export', color: '#f59e0b', elementIds: [] as string[] },
  { id: eid(), icon: '🏢', title: 'Team', description: 'Collaboration, brand kit, priority support, API access', color: '#8b5cf6', elementIds: [] as string[] },
];

const slide13Group: GroupedAnimationConfig = {
  type: 'stack-reveal',
  items: slide13GroupItems,
  stepDuration: 2000,
  hoverEffect: { ...defaultHover, type: 'lift' },
  allowOutOfOrder: false,
  triggerMode: 'auto',
};

const slide13Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Plans & Pricing',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0, easing: 'ease-out' as const },
    position: { x: 80, y: 30 },
    style: { fontSize: 36, fontWeight: 'bold' as const, color: '#1e293b' },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Start free. Upgrade when you need more.',
    animation: { type: 'fade-in' as const, duration: 0.6, delay: 0.4, easing: 'ease-out' as const },
    position: { x: 80, y: 80 },
    style: { fontSize: 18, color: '#64748b' },
  },
];

// ---------------------------------------------------------------------------
// Slide 14 — Call to Action (standalone, zoom-out transition)
// ---------------------------------------------------------------------------

const slide14Elements = [
  {
    id: eid(),
    type: 'text' as const,
    content: 'Start Creating Today',
    animation: { type: 'scale-in' as const, duration: 1, delay: 0.2, easing: 'spring' as const },
    position: { x: 200, y: 120 },
    style: { fontSize: 52, fontWeight: 'bold' as const, color: '#1e293b', textAlign: 'center' as const },
  },
  {
    id: eid(),
    type: 'text' as const,
    content: 'Transform your ideas into captivating visual stories',
    animation: { type: 'fade-in' as const, duration: 0.8, delay: 0.8, easing: 'ease-out' as const },
    position: { x: 220, y: 210 },
    style: { fontSize: 20, color: '#64748b', textAlign: 'center' as const },
  },
  {
    id: eid(),
    type: 'shape' as const,
    content: 'Get Started — It\'s Free →',
    animation: { type: 'bounce' as const, duration: 0.6, delay: 1.4, easing: 'spring' as const },
    position: { x: 310, y: 290 },
    style: { width: 280, height: 56, backgroundColor: '#3b82f6', borderRadius: 28, fontSize: 18, fontWeight: 'bold' as const, color: '#ffffff', textAlign: 'center' as const },
  },
];

// ---------------------------------------------------------------------------
// Item Trees — new recursive SlideItem representation for each slide
// ---------------------------------------------------------------------------

// Slide 1 — Title (standalone elements with absolute positions)
const slide1Items: SlideItem[] = [
  atom(slide1Elements[0].id, 'text', 'Visual Storytelling Platform', {
    animation: slide1Elements[0].animation,
    position: slide1Elements[0].position,
    style: slide1Elements[0].style,
  }),
  atom(slide1Elements[1].id, 'text', 'Create stunning animated presentations with AI-powered automation', {
    animation: slide1Elements[1].animation,
    position: slide1Elements[1].position,
    style: slide1Elements[1].style,
  }),
  atom(slide1Elements[2].id, 'shape', '', {
    animation: slide1Elements[2].animation,
    position: slide1Elements[2].position,
    style: slide1Elements[2].style,
  }),
];

// Slide 2 — Section opener (absolute positioned atoms)
const slide2Items: SlideItem[] = [
  atom(slide2Elements[0].id, 'text', 'Platform\nCapabilities', {
    animation: slide2Elements[0].animation,
    position: slide2Elements[0].position,
    style: slide2Elements[0].style,
  }),
  atom(slide2Elements[1].id, 'text', 'Section 1 of 3', {
    animation: slide2Elements[1].animation,
    position: slide2Elements[1].position,
    style: slide2Elements[1].style,
  }),
];

// Slide 3 — Capability overview (header + items grid)
const slide3Items: SlideItem[] = [
  layout('s3-root', 'stack', [
    layout('s3-header', 'flex', [
      atom(slide3Elements[0].id, 'text', 'Platform Capabilities', {
        animation: slide3Elements[0].animation,
        style: slide3Elements[0].style,
      }),
      atom(slide3Elements[1].id, 'text', 'Five core pillars powering your visual stories', {
        animation: slide3Elements[1].animation,
        style: slide3Elements[1].style,
      }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s3-grid', 'grid', slide3GridItems.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 30 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
      ], { style: { backgroundColor: gi.color ? `${gi.color}10` : undefined, borderRadius: 16, padding: 16 } }),
    ), { layoutConfig: { columns: 3, gap: 16 }, style: { padding: 24 } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];

// Slide 4 — Feature list (header + list-accumulator area)
const slide4Items: SlideItem[] = [
  layout('s4-root', 'stack', [
    layout('s4-header', 'flex', [
      atom(slide4Elements[0].id, 'text', 'Key Features', {
        animation: slide4Elements[0].animation,
        style: slide4Elements[0].style,
      }),
      atom(slide4Elements[1].id, 'text', 'Exploring each capability in detail', {
        animation: slide4Elements[1].animation,
        style: slide4Elements[1].style,
      }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s4-content', 'sidebar', [
      layout('s4-sidebar', 'stack', slide4GroupItems.map((gi) =>
        card(gi.id, [
          atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 20 } }),
          atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
        ], { style: { padding: 8, borderRadius: 8 } }),
      ), { layoutConfig: { direction: 'column', gap: 6 } }),
      layout('s4-hero', 'flex', [], { layoutConfig: { direction: 'column', align: 'center', justify: 'center' } }),
    ], { layoutConfig: { sidebarWidth: '30%' } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];

// Slide 5 — How It Works (carousel)
const slide5Items: SlideItem[] = [
  layout('s5-root', 'stack', [
    atom(slide5Elements[0].id, 'text', 'How It Works', {
      animation: slide5Elements[0].animation,
      style: slide5Elements[0].style,
    }),
    layout('s5-carousel', 'stack', slide5GroupItems.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 28 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${gi.id}-desc`, 'text', gi.description ?? '', { style: { fontSize: 14, color: '#64748b' } }),
      ], { style: { padding: 24, borderRadius: 16 } }),
    ), { layoutConfig: { direction: 'column', gap: 8, align: 'center', justify: 'center' } }),
  ], { layoutConfig: { direction: 'column', gap: 16 }, style: { padding: 24 } }),
];

// Slide 6 — Process overview grid (grid-to-sidebar)
const slide6Items: SlideItem[] = [
  layout('s6-root', 'stack', [
    layout('s6-header', 'flex', [
      atom(slide6Elements[0].id, 'text', 'Creation Process', {
        animation: slide6Elements[0].animation,
        style: slide6Elements[0].style,
      }),
      atom(slide6Elements[1].id, 'text', 'Four steps from idea to presentation', {
        animation: slide6Elements[1].animation,
        style: slide6Elements[1].style,
      }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s6-grid', 'grid', slide6GridItems.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 30 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
      ], { style: { backgroundColor: gi.color ? `${gi.color}10` : undefined, borderRadius: 16, padding: 16 } }),
    ), { layoutConfig: { columns: 2, gap: 16 }, style: { padding: 24 } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];

// Slide 7 — Process detail (sidebar layout)
const slide7Items: SlideItem[] = [
  layout('s7-root', 'stack', [
    layout('s7-header', 'flex', [
      atom(slide7Elements[0].id, 'text', 'Creation Process', {
        animation: slide7Elements[0].animation,
        style: slide7Elements[0].style,
      }),
      atom(slide7Elements[1].id, 'text', 'Deep dive into each step', {
        animation: slide7Elements[1].animation,
        style: slide7Elements[1].style,
      }),
    ], { layoutConfig: { direction: 'column', gap: 4 } }),
    layout('s7-content', 'sidebar', [
      layout('s7-sidebar', 'stack', slide7SidebarItems.map((gi) =>
        card(gi.id, [
          atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 16 } }),
          atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 12, fontWeight: 'bold' } }),
        ], { style: { padding: 8, borderRadius: 8 } }),
      ), { layoutConfig: { direction: 'column', gap: 6 } }),
      layout('s7-detail', 'flex', slide7SidebarItems.map((gi) =>
        card(`${gi.id}-detail`, [
          atom(`${gi.id}-detail-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 24 } }),
          atom(`${gi.id}-detail-title`, 'text', gi.title, { style: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' } }),
          atom(`${gi.id}-detail-desc`, 'text', gi.description ?? '', { style: { fontSize: 14, color: '#64748b' } }),
        ], { style: { padding: 24, borderRadius: 12 } }),
      ), { layoutConfig: { direction: 'column', gap: 16 } }),
    ], { layoutConfig: { sidebarWidth: '180px' } }),
  ], { layoutConfig: { direction: 'column', gap: 0 }, style: { padding: 16 } }),
];

// Slide 8 — Comparison (standalone absolute-positioned elements)
const slide8Items: SlideItem[] = slide8Elements.map((el) =>
  atom(el.id, el.type as AtomItem['atomType'], el.content, {
    animation: el.animation,
    position: el.position,
    style: el.style,
  }),
);

// Slide 9 — Tech Stack (bento grid)
const slide9Items: SlideItem[] = [
  layout('s9-root', 'stack', [
    atom(slide9Elements[0].id, 'text', 'Built With Modern Tech', {
      animation: slide9Elements[0].animation,
      style: slide9Elements[0].style,
    }),
    layout('s9-grid', 'grid', slide9GroupItems.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 28 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${gi.id}-desc`, 'text', gi.description ?? '', { style: { fontSize: 12, color: '#64748b' } }),
      ], { style: { padding: 16, borderRadius: 12 } }),
    ), { layoutConfig: { columns: 3, gap: 16 }, style: { padding: 24 } }),
  ], { layoutConfig: { direction: 'column', gap: 16 }, style: { padding: 24 } }),
];

// Slide 10 — Workflow (staggered standalone)
const slide10Items: SlideItem[] = [
  layout('s10-root', 'stack', [
    atom(slide10Elements[0].id, 'text', 'Your Creative Workflow', {
      animation: slide10Elements[0].animation,
      style: slide10Elements[0].style,
    }),
    layout('s10-flow', 'flex', [
      card('s10-write', [
        atom(slide10Elements[1].id, 'text', '📝 Write', {
          animation: slide10Elements[1].animation,
          style: { ...slide10Elements[1].style, textAlign: 'center' },
        }),
      ], { style: { backgroundColor: '#ede9fe', borderRadius: 12, padding: 16, width: 160, height: 100 } }),
      atom(slide10Elements[2].id, 'text', '→', {
        animation: slide10Elements[2].animation,
        style: slide10Elements[2].style,
      }),
      card('s10-design', [
        atom(slide10Elements[3].id, 'text', '🎨 Design', {
          animation: slide10Elements[3].animation,
          style: { ...slide10Elements[3].style, textAlign: 'center' },
        }),
      ], { style: { backgroundColor: '#dbeafe', borderRadius: 12, padding: 16, width: 160, height: 100 } }),
      atom(slide10Elements[4].id, 'text', '→', {
        animation: slide10Elements[4].animation,
        style: slide10Elements[4].style,
      }),
      card('s10-animate', [
        atom(slide10Elements[5].id, 'text', '🎬 Animate', {
          animation: slide10Elements[5].animation,
          style: { ...slide10Elements[5].style, textAlign: 'center' },
        }),
      ], { style: { backgroundColor: '#d1fae5', borderRadius: 12, padding: 16, width: 160, height: 100 } }),
      atom(slide10Elements[6].id, 'text', '→', {
        animation: slide10Elements[6].animation,
        style: slide10Elements[6].style,
      }),
      card('s10-publish', [
        atom(slide10Elements[7].id, 'text', '📤 Publish', {
          animation: slide10Elements[7].animation,
          style: { ...slide10Elements[7].style, textAlign: 'center' },
        }),
      ], { style: { backgroundColor: '#fef3c7', borderRadius: 12, padding: 16, width: 160, height: 100 } }),
    ], { layoutConfig: { direction: 'row', gap: 12, align: 'center', justify: 'center' } }),
  ], { layoutConfig: { direction: 'column', gap: 24 }, style: { padding: 24 } }),
];

// Slide 11 — Animation Engine (fan-out)
const slide11Items: SlideItem[] = [
  layout('s11-root', 'stack', [
    atom(slide11Elements[0].id, 'text', 'Animation Engine', {
      animation: slide11Elements[0].animation,
      style: slide11Elements[0].style,
    }),
    atom(slide11Elements[1].id, 'text', '12 element animations × 11 grouped layouts × 5 slide transitions', {
      animation: slide11Elements[1].animation,
      style: slide11Elements[1].style,
    }),
    layout('s11-fan', 'flex', slide11GroupItems.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 28 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${gi.id}-desc`, 'text', gi.description ?? '', { style: { fontSize: 12, color: '#64748b' } }),
      ], { style: { padding: 16, borderRadius: 12 } }),
    ), { layoutConfig: { direction: 'row', gap: 16, justify: 'center' } }),
  ], { layoutConfig: { direction: 'column', gap: 16 }, style: { padding: 24 } }),
];

// Slide 12 — Export options (standalone absolute)
const slide12Items: SlideItem[] = slide12Elements.map((el) =>
  atom(el.id, el.type as AtomItem['atomType'], el.content, {
    animation: el.animation,
    position: el.position,
    style: el.style,
  }),
);

// Slide 13 — Pricing (stack reveal)
const slide13Items: SlideItem[] = [
  layout('s13-root', 'stack', [
    atom(slide13Elements[0].id, 'text', 'Plans & Pricing', {
      animation: slide13Elements[0].animation,
      style: slide13Elements[0].style,
    }),
    atom(slide13Elements[1].id, 'text', 'Start free. Upgrade when you need more.', {
      animation: slide13Elements[1].animation,
      style: slide13Elements[1].style,
    }),
    layout('s13-cards', 'flex', slide13GroupItems.map((gi) =>
      card(gi.id, [
        atom(`${gi.id}-icon`, 'icon', gi.icon ?? '', { style: { fontSize: 28 } }),
        atom(`${gi.id}-title`, 'text', gi.title, { style: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' } }),
        atom(`${gi.id}-desc`, 'text', gi.description ?? '', { style: { fontSize: 14, color: '#64748b' } }),
      ], { style: { padding: 24, borderRadius: 16 } }),
    ), { layoutConfig: { direction: 'row', gap: 20, justify: 'center' } }),
  ], { layoutConfig: { direction: 'column', gap: 20 }, style: { padding: 24 } }),
];

// Slide 14 — CTA (standalone absolute)
const slide14Items: SlideItem[] = slide14Elements.map((el) =>
  atom(el.id, el.type as AtomItem['atomType'], el.content, {
    animation: el.animation,
    position: el.position,
    style: el.style,
  }),
);

// ---------------------------------------------------------------------------
// Demo Slides Array
// ---------------------------------------------------------------------------

export const DEMO_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    order: 0,
    content: 'Title slide — introduce the platform',
    animationTemplate: 'smooth-fade',
    items: slide1Items,
    elements: slide1Elements,
    duration: 5000,
    transition: 'fade',
  },
  {
    id: 'slide-2',
    order: 1,
    content: 'Section opener — Zoom-In Word Reveal for "Platform Capabilities"',
    animationTemplate: 'zoom-in-word',
    items: slide2Items,
    elements: slide2Elements,
    duration: 6000,
    transition: 'fade',
  },
  {
    id: 'slide-3',
    order: 2,
    content: 'Capability overview — Items Grid showing 5 key areas with Slide Title',
    animationTemplate: 'slide-title',
    items: slide3Items,
    elements: slide3Elements,
    duration: 10000,
    transition: 'morph',
    groupedAnimation: slide3GridGroup,
  },
  {
    id: 'slide-4',
    order: 3,
    content: 'Key Features — list accumulator grouped animation with Slide Title header',
    animationTemplate: 'staggered-wipe',
    items: slide4Items,
    elements: slide4Elements,
    duration: 12000,
    transition: 'slide-left',
    groupedAnimation: slide4Group,
  },
  {
    id: 'slide-5',
    order: 4,
    content: 'How It Works — carousel focus grouped animation',
    animationTemplate: 'float-in',
    items: slide5Items,
    elements: slide5Elements,
    duration: 14000,
    transition: 'zoom-in',
    groupedAnimation: slide5Group,
  },
  {
    id: 'slide-6',
    order: 5,
    content: 'Creation Process — Items Grid with grid-to-sidebar transition',
    animationTemplate: 'grid-to-sidebar',
    items: slide6Items,
    elements: slide6Elements,
    duration: 12000,
    transition: 'fade',
    groupedAnimation: slide6GridGroup,
  },
  {
    id: 'slide-7',
    order: 6,
    content: 'Creation Process Detail — sidebar layout with expanded content',
    animationTemplate: 'sidebar-detail',
    items: slide7Items,
    elements: slide7Elements,
    duration: 14000,
    transition: 'fade',
    groupedAnimation: slide7SidebarGroup,
  },
  {
    id: 'slide-8',
    order: 7,
    content: 'Traditional vs VisualStory comparison',
    animationTemplate: 'smooth-fade',
    items: slide8Items,
    elements: slide8Elements,
    duration: 8000,
    transition: 'slide-left',
  },
  {
    id: 'slide-9',
    order: 8,
    content: 'Tech Stack — bento grid grouped animation',
    animationTemplate: 'pop-zoom',
    items: slide9Items,
    elements: slide9Elements,
    duration: 12000,
    transition: 'fade',
    groupedAnimation: slide9Group,
  },
  {
    id: 'slide-10',
    order: 9,
    content: 'Creative workflow — staggered standalone elements',
    animationTemplate: 'staggered-wipe',
    items: slide10Items,
    elements: slide10Elements,
    duration: 8000,
    transition: 'slide-right',
  },
  {
    id: 'slide-11',
    order: 10,
    content: 'Animation Engine — fan-out grouped animation',
    animationTemplate: 'pulse-emphasis',
    items: slide11Items,
    elements: slide11Elements,
    duration: 11000,
    transition: 'slide-up',
    groupedAnimation: slide11Group,
  },
  {
    id: 'slide-12',
    order: 11,
    content: 'Export options — standalone elements',
    animationTemplate: 'pop-zoom',
    items: slide12Items,
    elements: slide12Elements,
    duration: 8000,
    transition: 'morph',
  },
  {
    id: 'slide-13',
    order: 12,
    content: 'Plans & Pricing — stack reveal grouped animation',
    animationTemplate: 'smooth-fade',
    items: slide13Items,
    elements: slide13Elements,
    duration: 10000,
    transition: 'slide-left',
    groupedAnimation: slide13Group,
  },
  {
    id: 'slide-14',
    order: 13,
    content: 'Call to Action — closing slide',
    animationTemplate: 'pop-zoom',
    items: slide14Items,
    elements: slide14Elements,
    duration: 6000,
    transition: 'zoom-out',
  },
];

// ---------------------------------------------------------------------------
// Demo Scripts
// ---------------------------------------------------------------------------

export const DEMO_SCRIPTS: SlideScript[] = [
  {
    slideId: 'slide-1',
    opening: {
      text: 'Welcome to VisualStory — a platform that transforms your ideas into captivating animated presentations.',
      notes: 'Title slide. Set an inspiring, confident tone.',
    },
    elements: [
      { elementId: slide1Elements[0].id, label: 'Main Title', script: { text: 'Visual Storytelling Platform — the future of presentations.', notes: 'Emphasize "visual storytelling".' } },
      { elementId: slide1Elements[1].id, label: 'Subtitle', script: { text: 'Create stunning animated presentations with AI-powered automation.', notes: 'Bridges to next slide.' } },
    ],
  },
  {
    slideId: 'slide-2',
    opening: {
      text: 'Let\'s explore what makes VisualStory powerful.',
      notes: 'Section opener — Zoom-In Word Reveal. Words zoom in one by one.',
    },
    elements: [
      { elementId: slide2Elements[0].id, label: 'Section Title', script: { text: 'Platform Capabilities — the core of what we offer.', notes: 'Each word zooms in from behind. Last step morphs to slide title.' } },
      { elementId: slide2Elements[1].id, label: 'Section Number', script: { text: 'Section one of three.', notes: 'Subtle context indicator.' } },
    ],
  },
  {
    slideId: 'slide-3',
    opening: {
      text: 'Here\'s an overview of the five core capabilities that power VisualStory.',
      notes: 'Items Grid layout with end-state showing all items revealed.',
    },
    elements: slide3GridItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title} — ${item.description}.`,
        notes: `Grid item with callout.`,
      },
    })),
  },
  {
    slideId: 'slide-4',
    opening: {
      text: 'Let me walk you through each feature in detail.',
      notes: 'List accumulator layout with Slide Title header.',
    },
    elements: slide4GroupItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title} — ${item.description}.`,
        notes: `Grouped item for list accumulator. Color: ${item.color}.`,
      },
    })),
  },
  {
    slideId: 'slide-5',
    opening: {
      text: 'Here\'s how the process works, from content to publication.',
      notes: 'Five-step carousel focus animation.',
    },
    elements: slide5GroupItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `Step: ${item.title}. ${item.description}.`,
        notes: `Carousel step.`,
      },
    })),
  },
  {
    slideId: 'slide-6',
    opening: {
      text: 'The creation process has four simple steps.',
      notes: 'Items Grid with grid-to-sidebar transition. Last sub-step animates items into a sidebar column.',
    },
    elements: slide6GridItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title} — ${item.description}.`,
        notes: `Grid item. Will migrate to sidebar on transition step.`,
      },
    })),
  },
  {
    slideId: 'slide-7',
    opening: {
      text: 'Let\'s explore each step in detail.',
      notes: 'Sidebar layout — items from the previous grid now appear in the left panel. Main area shows expanded detail.',
    },
    elements: slide7SidebarItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title}: ${item.description}`,
        notes: `Sidebar item with expanded detail.`,
      },
    })),
  },
  {
    slideId: 'slide-8',
    opening: {
      text: 'How does VisualStory compare to traditional presentation tools?',
      notes: 'Side-by-side comparison.',
    },
    elements: [
      { elementId: slide8Elements[0].id, label: 'Heading', script: { text: 'Traditional versus VisualStory.', notes: 'Set up the comparison framing.' } },
      { elementId: slide8Elements[1].id, label: 'Traditional Side', script: { text: 'Traditional tools require manual setup, static timing, and limited export options.', notes: 'Red-tinted panel.' } },
      { elementId: slide8Elements[2].id, label: 'VisualStory Side', script: { text: 'VisualStory automates everything — dynamic timing, voice sync, multi-format export.', notes: 'Green-tinted panel.' } },
    ],
  },
  {
    slideId: 'slide-9',
    opening: {
      text: 'VisualStory is built on a modern, production-ready tech stack.',
      notes: 'Bento grid reveals each technology tile.',
    },
    elements: slide9GroupItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title} — ${item.description}.`,
        notes: `Tech tile in bento grid.`,
      },
    })),
  },
  {
    slideId: 'slide-10',
    opening: {
      text: 'The creative workflow is simple and intuitive.',
      notes: 'Four sequential boxes animate up one-by-one.',
    },
    elements: [
      { elementId: slide10Elements[0].id, label: 'Heading', script: { text: 'Your creative workflow in four simple steps.', notes: 'Pipeline metaphor.' } },
      { elementId: slide10Elements[1].id, label: 'Write Step', script: { text: 'Start by writing your script or importing content.', notes: 'Purple box.' } },
      { elementId: slide10Elements[3].id, label: 'Design Step', script: { text: 'Design your visual layout with smart templates.', notes: 'Blue box.' } },
      { elementId: slide10Elements[5].id, label: 'Animate Step', script: { text: 'Add animations — or let AI do it for you.', notes: 'Green box.' } },
      { elementId: slide10Elements[7].id, label: 'Publish Step', script: { text: 'Publish to video, web, or embed.', notes: 'Yellow box.' } },
    ],
  },
  {
    slideId: 'slide-11',
    opening: {
      text: 'The animation engine offers extensive variety.',
      notes: 'Fan-out layout showcasing sample animation types.',
    },
    elements: slide11GroupItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title} — ${item.description}.`,
        notes: `Fan-out grouped item.`,
      },
    })),
  },
  {
    slideId: 'slide-12',
    opening: {
      text: 'Export your presentations in the format that works best.',
      notes: 'Three cards scale in sequentially.',
    },
    elements: [
      { elementId: slide12Elements[0].id, label: 'Heading', script: { text: 'Export anywhere.', notes: 'Simple, direct.' } },
      { elementId: slide12Elements[1].id, label: 'MP4 Video', script: { text: 'Export as high-quality MP4 video for social media and YouTube.', notes: 'Purple card.' } },
      { elementId: slide12Elements[2].id, label: 'Web Player', script: { text: 'Share as an interactive web player with click navigation.', notes: 'Blue card.' } },
      { elementId: slide12Elements[3].id, label: 'Embed Widget', script: { text: 'Or embed directly on any website with a single code snippet.', notes: 'Green card.' } },
    ],
  },
  {
    slideId: 'slide-13',
    opening: {
      text: 'We offer flexible plans for every creator.',
      notes: 'Stack reveal animation — each pricing tier stacks on top.',
    },
    elements: slide13GroupItems.map((item) => ({
      elementId: item.id,
      label: item.title,
      script: {
        text: `${item.title} tier: ${item.description}.`,
        notes: `Pricing tier card.`,
      },
    })),
  },
  {
    slideId: 'slide-14',
    opening: {
      text: 'Ready to transform your ideas into visual stories?',
      notes: 'Closing CTA slide. Bold, motivational energy.',
    },
    elements: [
      { elementId: slide14Elements[0].id, label: 'CTA Headline', script: { text: 'Start creating today.', notes: 'Large, impactful text with spring animation.' } },
      { elementId: slide14Elements[1].id, label: 'CTA Subtitle', script: { text: 'Transform your ideas into captivating visual stories.', notes: 'Supporting line.' } },
      { elementId: slide14Elements[2].id, label: 'CTA Button', script: { text: 'Get started — it\'s free.', notes: 'Blue pill button with bounce.' } },
    ],
  },
];
