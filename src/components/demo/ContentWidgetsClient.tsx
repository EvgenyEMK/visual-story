'use client';

import { useState } from 'react';
import { DemoPageShell, DemoGrid, useDemoPage } from './DemoPageShell';
import { DemoBox } from '../ui-components/DemoBox';
import '../slide-ui/slide-ui.css';
import {
  FeatureCard,
  StatCard,
  QuoteBlock,
  HeroSpotlight,
  FlowNode,
  TitleBar,
  ItemThumbnail,
  DetailPopup,
  StatusDot,
  ItemsList,
  StatusLegend,
  CardExpandLayout,
} from '@/components/slide-ui';
import type { ListRow, LegendEntry, CardExpandItem } from '@/components/slide-ui';

import {
  Rocket,
  Shield,
  Zap,
  BarChart3,
  Target,
  ChevronRight,
  Circle,
  CircleDot,
  CircleCheck,
  Clock,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared demo data for Smart Cards
// ---------------------------------------------------------------------------

const SMART_CARD_ITEMS: CardExpandItem[] = [
  {
    id: 'sc-launch',
    icon: Rocket,
    title: 'Launch',
    description: 'Ship features faster',
    color: '#3b82f6',
    detailContent: (
      <div className="flex flex-col gap-2">
        <span className="text-white/70 text-xs font-semibold">Deployment Pipeline</span>
        <div className="flex flex-col gap-1.5">
          {['CI/CD setup', 'Staging deploy', 'Prod release', 'Rollback plan'].map((t, i) => (
            <div key={t} className="flex items-center gap-2">
              {i < 2 ? <CircleCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-white/30" />}
              <span className={`text-[10px] ${i < 2 ? 'text-white/50 line-through' : 'text-white/70'}`}>{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[9px] text-white/30">2 of 4 tasks complete</div>
      </div>
    ),
  },
  {
    id: 'sc-analytics',
    icon: BarChart3,
    title: 'Analytics',
    description: 'Data-driven decisions',
    color: '#8b5cf6',
    detailContent: (
      <div className="flex flex-col gap-2">
        <span className="text-white/70 text-xs font-semibold">Key Metrics</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'DAU', value: '12.4K', delta: '+8%' },
            { label: 'Retention', value: '67%', delta: '+3%' },
            { label: 'ARPU', value: '$4.20', delta: '+12%' },
            { label: 'Churn', value: '2.1%', delta: '-0.5%' },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-white/5 p-2">
              <div className="text-[8px] text-white/40">{m.label}</div>
              <div className="text-xs font-bold text-white/80">{m.value}</div>
              <div className="text-[8px] text-emerald-400">{m.delta}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'sc-security',
    icon: Shield,
    title: 'Security',
    description: 'Enterprise-grade protection',
    color: '#14b8a6',
    detailContent: (
      <div className="flex flex-col gap-2">
        <span className="text-white/70 text-xs font-semibold">Compliance Status</span>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'SOC 2 Type II', status: 'Certified' },
            { label: 'GDPR', status: 'Compliant' },
            { label: 'ISO 27001', status: 'In Progress' },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between">
              <span className="text-[10px] text-white/60">{c.label}</span>
              <span className={`text-[9px] font-medium ${c.status === 'In Progress' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'sc-speed',
    icon: Zap,
    title: 'Speed',
    description: '10x faster processing',
    color: '#f59e0b',
    detailContent: (
      <div className="flex flex-col gap-2">
        <span className="text-white/70 text-xs font-semibold">Performance</span>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'API Latency', value: '42ms', pct: 95 },
            { label: 'Throughput', value: '8.2K rps', pct: 82 },
            { label: 'Cache Hit', value: '97.3%', pct: 97 },
          ].map((p) => (
            <div key={p.label} className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/60">{p.label}</span>
                <span className="text-[10px] text-white/80 font-medium">{p.value}</span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400/60" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ---------------------------------------------------------------------------
// Tab sections
// ---------------------------------------------------------------------------

function CardsSection() {
  const { themeMode } = useDemoPage();
  return (
    <DemoGrid>
      {/* FeatureCard */}
      <DemoBox title="FeatureCard" description="Icon + title + description. Vertical or horizontal layout, multiple sizes." themeMode={themeMode}>
        <div className="flex flex-col gap-3 p-4 w-full">
          <div className="flex gap-3">
            <FeatureCard icon={Rocket} title="Launch" description="Ship fast" color="#3b82f6" size="sm" entrance="float-in" />
            <FeatureCard icon={Shield} title="Secure" description="Built-in encryption" color="#8b5cf6" size="sm" entrance="float-in" delay={0.1} />
            <FeatureCard icon={Zap} title="Fast" description="10x speed" color="#f59e0b" size="sm" entrance="float-in" delay={0.2} />
          </div>
          <FeatureCard icon={Target} title="Precision Targeting" description="Advanced audience segmentation and personalization for every campaign." color="#ef4444" size="md" direction="horizontal" entrance="float-in" delay={0.35} />
        </div>
      </DemoBox>

      {/* StatCard */}
      <DemoBox title="StatCard" description="Metric with optional progress bar. Composes MetricDisplay + ProgressBar." themeMode={themeMode}>
        <div className="flex gap-3 p-4 w-full">
          <StatCard value="$2.4M" label="Revenue" delta="+27%" deltaDirection="up" color="#3b82f6" progress={85} entrance="fade" />
          <StatCard value="94%" label="Uptime" delta="On Target" deltaDirection="neutral" color="#14b8a6" progress={94} entrance="fade" delay={0.2} />
        </div>
      </DemoBox>

      {/* QuoteBlock */}
      <DemoBox title="QuoteBlock" description="Styled quote with attribution. Serif italic text with accent bar." themeMode={themeMode}>
        <div className="p-4 w-full">
          <QuoteBlock
            quote="Innovation distinguishes between a leader and a follower."
            attribution="— Steve Jobs"
            size="lg"
            entrance="fade"
          />
        </div>
      </DemoBox>

      {/* HeroSpotlight */}
      <DemoBox title="HeroSpotlight" description="Large centered icon with title and description. Used as focus element." themeMode={themeMode}>
        <div className="p-4 flex items-center justify-center">
          <HeroSpotlight
            icon={Zap}
            title="Lightning Fast"
            description="Process data 10x faster than before with our optimized infrastructure."
            color="#f59e0b"
            size="lg"
            entrance="pop-zoom"
          />
        </div>
      </DemoBox>
    </DemoGrid>
  );
}

function NavigationSection() {
  const { themeMode } = useDemoPage();
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const thumbs = [
    { icon: Rocket, label: 'Launch', color: '#3b82f6' },
    { icon: BarChart3, label: 'Analytics', color: '#8b5cf6' },
    { icon: Shield, label: 'Security', color: '#14b8a6' },
    { icon: Zap, label: 'Speed', color: '#f59e0b' },
  ];

  return (
    <DemoGrid>
      {/* FlowNode */}
      <DemoBox title="FlowNode" description="Step node for timelines and process flows. Active state with glow." themeMode={themeMode}>
        <div className="flex items-center gap-1 p-6">
          {[
            { icon: Rocket, label: 'Input', color: '#3b82f6', active: false },
            { icon: Zap, label: 'Process', color: '#8b5cf6', active: true },
            { icon: Target, label: 'Output', color: '#14b8a6', active: false },
          ].map((node, i) => (
            <div key={node.label} className="flex items-center">
              <FlowNode
                icon={node.icon}
                label={node.label}
                color={node.color}
                active={node.active}
                nodeSize={44}
                entrance="pop-zoom"
                delay={i * 0.2}
              />
              {i < 2 && (
                <div className="mx-2">
                  <ChevronRight className="w-3 h-3 text-white/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DemoBox>

      {/* TitleBar */}
      <DemoBox title="TitleBar" description="Slide heading with subtitle and optional right slot (status, legend)." themeMode={themeMode}>
        <div className="w-full flex flex-col">
          <TitleBar
            title="Market Analysis 2025"
            subtitle="Quarterly performance & growth metrics"
            right={
              <div className="flex items-center gap-2">
                <StatusDot color="#22c55e" label="On Track" />
                <span className="text-white/30 text-[8px]">|</span>
                <span className="text-white/40 text-[9px]">Q4</span>
              </div>
            }
            size="lg"
            entrance="fade"
          />
          <div className="flex-1 flex items-center justify-center py-8">
            <span className="text-white/20 text-xs">Slide content area</span>
          </div>
        </div>
      </DemoBox>

      {/* ItemThumbnail */}
      <DemoBox title="ItemThumbnail" description="Compact clickable thumbnail for sidebars and shelves." themeMode={themeMode}>
        <div className="flex flex-col gap-1 p-4 w-full max-w-[200px]">
          {thumbs.map((t, i) => (
            <ItemThumbnail
              key={t.label}
              icon={t.icon}
              label={t.label}
              color={t.color}
              active={i === activeThumb}
              onClick={() => setActiveThumb(i)}
            />
          ))}
        </div>
      </DemoBox>

      {/* DetailPopup */}
      <DemoBox title="DetailPopup" description="Overlay popup with icon, title, description. Click to toggle." themeMode={themeMode}>
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-colors"
            onClick={() => setPopupOpen(true)}
          >
            Show Popup
          </button>
          <DetailPopup
            open={popupOpen}
            icon={Rocket}
            title="Launch"
            description="Ship features faster with streamlined deployment pipelines and CI/CD."
            color="#3b82f6"
            onClose={() => setPopupOpen(false)}
          />
        </div>
      </DemoBox>
    </DemoGrid>
  );
}

function ListsSection() {
  const { themeMode } = useDemoPage();
  return (
    <DemoGrid>
      {/* ItemsList */}
      <DemoBox title="ItemsList" description="Vertical items list with icons, headers, checked states, and nested sub-lists." themeMode={themeMode} aspect="auto">
        <div className="p-4 w-full">
          <ItemsList
            size="md"
            entrance="slide-up"
            stagger={0.06}
            items={[
              { id: 'h1', kind: 'header', text: 'Project Alpha', color: '#3b82f6' },
              { id: 'i1', text: 'Design system setup', icon: CircleCheck, color: '#22c55e', checked: true },
              { id: 'i2', text: 'API integration', icon: CircleDot, color: '#f59e0b', description: 'In progress — 60% complete',
                children: [
                  { id: 'i2a', text: 'Auth endpoints', icon: CircleCheck, color: '#22c55e', checked: true },
                  { id: 'i2b', text: 'Data sync endpoints', icon: Clock, color: '#f59e0b' },
                ],
              },
              { id: 'i3', text: 'Write unit tests', icon: Circle, color: '#94a3b8' },
              { id: 'h2', kind: 'header', text: 'Project Beta', color: '#8b5cf6' },
              { id: 'i4', text: 'Requirements gathering', icon: CircleCheck, color: '#22c55e', checked: true },
              { id: 'i5', text: 'UI wireframes', icon: CircleDot, color: '#f59e0b' },
              { id: 'i6', text: 'Backend scaffolding', icon: Circle, color: '#94a3b8' },
            ] satisfies ListRow[]}
          />
        </div>
      </DemoBox>

      {/* StatusLegend */}
      <DemoBox title="StatusLegend" description="Icon legend explaining status indicators used in lists or slides." themeMode={themeMode} aspect="auto">
        <div className="p-4 w-full flex flex-col gap-4">
          <StatusLegend
            title="Task Status"
            size="md"
            entrance="fade"
            stagger={0.08}
            entries={[
              { id: 'l1', icon: Circle, label: 'To Do', color: '#94a3b8' },
              { id: 'l2', icon: Clock, label: 'In Progress', color: '#f59e0b' },
              { id: 'l3', icon: CircleCheck, label: 'Done', color: '#22c55e' },
            ] satisfies LegendEntry[]}
          />
          <StatusLegend
            title="Priority"
            size="sm"
            direction="horizontal"
            entrance="fade"
            delay={0.3}
            stagger={0.06}
            entries={[
              { id: 'p1', icon: '🔴', label: 'Critical', color: '#ef4444' },
              { id: 'p2', icon: '🟡', label: 'Medium', color: '#f59e0b' },
              { id: 'p3', icon: '🟢', label: 'Low', color: '#22c55e' },
            ] satisfies LegendEntry[]}
          />
        </div>
      </DemoBox>
    </DemoGrid>
  );
}

function SmartCardsSection() {
  const { themeMode } = useDemoPage();

  return (
    <DemoGrid>
      {/* Grid-to-Overlay variant */}
      <DemoBox
        title="CardExpandLayout — Grid to Overlay"
        description="Click a card to expand it with a detailed view. Remaining cards stack to the right. Default variant."
        themeMode={themeMode}
      >
        <CardExpandLayout
          items={SMART_CARD_ITEMS}
          variant="grid-to-overlay"
          cardSize="sm"
          columns={2}
          gap={8}
        />
      </DemoBox>

      {/* Center Popup variant */}
      <DemoBox
        title="CardExpandLayout — Center Popup"
        description="Expanded card appears as a centered overlay with backdrop blur. Grid stays dimmed behind."
        themeMode={themeMode}
      >
        <CardExpandLayout
          items={SMART_CARD_ITEMS}
          variant="center-popup"
          cardSize="sm"
          columns={2}
          gap={8}
        />
      </DemoBox>

      {/* Sidebar-Detail variant */}
      <DemoBox
        title="CardExpandLayout — Sidebar Detail"
        description="Cards become a persistent sidebar. Click to show detail in the main area."
        themeMode={themeMode}
      >
        <CardExpandLayout
          items={SMART_CARD_ITEMS}
          variant="sidebar-detail"
          cardSize="sm"
          defaultExpanded={0}
        />
      </DemoBox>

      {/* Row-to-Split variant */}
      <DemoBox
        title="CardExpandLayout — Row to Split"
        description="Single row of cards. Clicking expands into a two-column split with remaining cards as tabs above."
        themeMode={themeMode}
      >
        <CardExpandLayout
          items={SMART_CARD_ITEMS}
          variant="row-to-split"
          cardSize="sm"
          gap={8}
        />
      </DemoBox>
    </DemoGrid>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function ContentWidgetsClient() {
  return (
    <DemoPageShell
      title="Content Widgets"
      description="Tier 2 — Common combinations of atoms that recur across slides (Molecules). Cards, quotes, heroes, flow nodes, title bars, thumbnails, popups, and smart expandable cards."
      tabs={[
        { value: 'smart-cards', label: 'Smart Cards', count: 4, content: <SmartCardsSection /> },
        { value: 'cards', label: 'Cards & Heroes', count: 4, content: <CardsSection /> },
        { value: 'navigation', label: 'Navigation & Chrome', count: 4, content: <NavigationSection /> },
        { value: 'lists', label: 'Lists & Legends', count: 2, content: <ListsSection /> },
      ]}
    />
  );
}
