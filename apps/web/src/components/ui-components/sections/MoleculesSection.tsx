'use client';

import { useState } from 'react';
import { DemoBox } from '../DemoBox';
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
} from '@/components/slide-ui';
import type { ListRow, LegendEntry } from '@/components/slide-ui';

import { Rocket, Shield, Zap, BarChart3, Target, ChevronRight, Circle, CircleDot, CircleCheck, Clock, ListTodo } from 'lucide-react';

interface Props {
  themeMode: 'dark' | 'light';
}

export function MoleculesSection({ themeMode }: Props) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const thumbs = [
    { icon: Rocket, label: 'Launch', color: '#3b82f6' },
    { icon: BarChart3, label: 'Analytics', color: '#8b5cf6' },
    { icon: Shield, label: 'Security', color: '#14b8a6' },
    { icon: Zap, label: 'Speed', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Tier 2: Molecules</h2>
        <p className="text-sm text-muted-foreground">
          Common combinations of atoms that recur across slides: cards, quotes, heroes, flow nodes, title bars, thumbnails, popups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            {/* Vertical legend */}
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
            {/* Horizontal legend */}
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
      </div>
    </div>
  );
}
