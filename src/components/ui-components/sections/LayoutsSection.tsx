'use client';

import { DemoBox } from '../DemoBox';
import {
  GridOfCards,
  SidebarDetail,
  CenterStageShelf,
  BentoLayout,
  HorizontalTimeline,
  HubSpoke,
  TitleSlide,
  StackOfCards,
  StatDashboard,
  StatusDot,
  MetricDisplay,
  ProgressBar,
} from '@/components/slide-ui';

import { Rocket, Shield, Zap, BarChart3, Target, Eye, Cloud, Lock, Send, FileText } from 'lucide-react';

interface Props {
  themeMode: 'dark' | 'light';
}

const DEMO_ITEMS = [
  { icon: Rocket, title: 'Launch', description: 'Ship features faster with streamlined deployment pipelines', color: '#3b82f6' },
  { icon: BarChart3, title: 'Analytics', description: 'Real-time insights and dashboards for data-driven decisions', color: '#8b5cf6' },
  { icon: Shield, title: 'Security', description: 'Enterprise-grade encryption and compliance built in', color: '#14b8a6' },
  { icon: Zap, title: 'Speed', description: '10x faster processing with optimized infrastructure', color: '#f59e0b' },
];

const DEMO_ITEMS_5 = [
  ...DEMO_ITEMS,
  { icon: Target, title: 'Targeting', description: 'Precision audience segmentation and personalization', color: '#ef4444' },
];

const TIMELINE_ITEMS = [
  { icon: FileText, label: 'Brief', color: '#3b82f6' },
  { icon: Eye, label: 'Research', color: '#8b5cf6' },
  { icon: Cloud, label: 'Design', color: '#14b8a6' },
  { icon: Zap, label: 'Build', color: '#f59e0b' },
  { icon: Send, label: 'Launch', color: '#ef4444' },
];

export function LayoutsSection({ themeMode }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Tier 3: Layouts</h2>
        <p className="text-sm text-muted-foreground">
          Slide-level compositions that combine molecules with layout strategies. Interactive and animated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* GridOfCards */}
        <DemoBox title="GridOfCards" description="Auto-grid of FeatureCards with staggered entrance. Configurable columns, gap, card size." themeMode={themeMode}>
          <div className="p-4 w-full h-full flex items-center">
            <GridOfCards
              items={DEMO_ITEMS}
              columns={2}
              gap={10}
              cardSize="sm"
              entrance="float-in"
              stagger={0.12}
            />
          </div>
        </DemoBox>

        {/* SidebarDetail */}
        <DemoBox title="SidebarDetail" description="Left sidebar with thumbnails + right detail area. Click items to navigate." themeMode={themeMode}>
          <div className="absolute inset-0">
            <SidebarDetail
              items={DEMO_ITEMS}
              sidebarWidth="140px"
              defaultActive={0}
            />
          </div>
        </DemoBox>

        {/* CenterStageShelf */}
        <DemoBox title="CenterStageShelf" description="Center hero spotlight + bottom shelf of thumbnails. Click to switch." themeMode={themeMode}>
          <div className="absolute inset-0">
            <CenterStageShelf
              items={DEMO_ITEMS}
              defaultActive={0}
              shelfHeight={52}
            />
          </div>
        </DemoBox>

        {/* BentoLayout */}
        <DemoBox title="BentoLayout" description="Main expanded area + right sidebar grid. Click tiles to expand." themeMode={themeMode}>
          <div className="absolute inset-0">
            <BentoLayout
              items={DEMO_ITEMS}
              defaultExpanded={0}
              sidebarWidth="28%"
            />
          </div>
        </DemoBox>

        {/* HorizontalTimeline */}
        <DemoBox title="HorizontalTimeline" description="Horizontal chain of FlowNodes with connectors. Click nodes to focus." themeMode={themeMode}>
          <div className="flex items-center justify-center px-4 w-full">
            <HorizontalTimeline
              items={TIMELINE_ITEMS}
              defaultActive={2}
              nodeSize={40}
            />
          </div>
        </DemoBox>

        {/* HubSpoke */}
        <DemoBox title="HubSpoke" description="Central hub with radial spoke nodes and connection lines. Click for detail popup." themeMode={themeMode}>
          <div className="absolute inset-0">
            <HubSpoke
              hubLabel="Core"
              items={DEMO_ITEMS_5.map((i) => ({ ...i, label: i.title }))}
              radius={75}
              nodeSize={36}
              clickable
            />
          </div>
        </DemoBox>

        {/* TitleSlide */}
        <DemoBox title="TitleSlide" description="TitleBar + body content. Standard slide template with heading zone." themeMode={themeMode}>
          <div className="absolute inset-0">
            <TitleSlide
              title="Market Analysis 2025"
              subtitle="Quarterly performance & growth metrics"
              right={
                <div className="flex items-center gap-2">
                  <StatusDot color="#22c55e" label="On Track" />
                </div>
              }
              entrance="fade"
            >
              <div className="flex flex-col items-center gap-3">
                <MetricDisplay value="+34.7%" label="Revenue Growth" color="#3b82f6" size="lg" entrance="pulse" delay={0.3} />
                <div className="w-48">
                  <ProgressBar value={87} color="#3b82f6" showValue height={8} entrance="fade" delay={0.6} />
                </div>
              </div>
            </TitleSlide>
          </div>
        </DemoBox>

        {/* StackOfCards */}
        <DemoBox title="StackOfCards" description="3D stacked cards with perspective. Click to cycle through the stack." themeMode={themeMode}>
          <div className="absolute inset-0">
            <StackOfCards
              items={DEMO_ITEMS.map((i) => ({ icon: i.icon, title: i.title, subtitle: i.description?.slice(0, 30), color: i.color }))}
              cardWidth={160}
              cardHeight={100}
            />
          </div>
        </DemoBox>

        {/* StatDashboard */}
        <DemoBox title="StatDashboard" description="Grid of StatCards for KPI slides. Staggered entrance animation." themeMode={themeMode}>
          <div className="p-4 w-full h-full flex items-center">
            <StatDashboard
              stats={[
                { value: '$2.4M', label: 'Revenue', delta: '+27%', deltaDirection: 'up', color: '#3b82f6', progress: 85 },
                { value: '1,247', label: 'Users', delta: '+12%', deltaDirection: 'up', color: '#8b5cf6', progress: 72 },
                { value: '94%', label: 'Uptime', delta: 'On Track', deltaDirection: 'neutral', color: '#14b8a6', progress: 94 },
              ]}
              columns={3}
              gap={10}
              entrance="float-in"
              stagger={0.15}
            />
          </div>
        </DemoBox>
      </div>
    </div>
  );
}
