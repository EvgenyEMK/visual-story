'use client';

import { useState } from 'react';
import { DemoPageShell, DemoGrid, useDemoPage } from './DemoPageShell';
import { DemoBox } from '../ui-components/DemoBox';
import '../slide-ui/slide-ui.css';
import {
  IconTitleCard,
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

import { SmartItemsList, SmartLegend } from '@/components/slide-ui';
import type { SmartListData, SmartListItem as SmartListItemType } from '@/types/smart-list';

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
// Shared demo data for Popup Callout
// ---------------------------------------------------------------------------

const POPUP_CARDS = [
  { icon: Rocket, title: 'Launch', description: 'Ship features faster with streamlined deployment', color: '#3b82f6' },
  { icon: BarChart3, title: 'Analytics', description: 'Real-time insights and dashboards for data-driven decisions', color: '#8b5cf6' },
  { icon: Shield, title: 'Security', description: 'Enterprise-grade encryption and compliance built in', color: '#14b8a6' },
  { icon: Zap, title: 'Speed', description: '10x faster processing with optimized infrastructure', color: '#f59e0b' },
];

// ---------------------------------------------------------------------------
// Tab sections
// ---------------------------------------------------------------------------

function CardsSection() {
  const { themeMode } = useDemoPage();
  return (
    <DemoGrid>
      {/* IconTitleCard */}
      <DemoBox title="IconTitleCard" description="Icon + title + description. Three variants: icon-title (default), icon-only, card." themeMode={themeMode}>
        <div className="flex flex-col gap-3 p-4 w-full">
          <div className="flex gap-3">
            <IconTitleCard icon={Rocket} title="Launch" description="Ship fast" color="#3b82f6" size="sm" entrance="float-in" />
            <IconTitleCard icon={Shield} title="Secure" description="Built-in encryption" color="#8b5cf6" size="sm" entrance="float-in" delay={0.1} />
            <IconTitleCard icon={Zap} title="Fast" description="10x speed" color="#f59e0b" size="sm" entrance="float-in" delay={0.2} />
          </div>
          <div className="flex gap-3">
            <IconTitleCard icon={Rocket} title="Launch" color="#3b82f6" size="sm" variant="icon-only" entrance="pop-zoom" delay={0.3} />
            <IconTitleCard icon={Shield} title="Secure" color="#8b5cf6" size="sm" variant="icon-only" entrance="pop-zoom" delay={0.4} />
            <IconTitleCard icon={Zap} title="Fast" color="#f59e0b" size="sm" variant="icon-only" entrance="pop-zoom" delay={0.5} />
          </div>
          <IconTitleCard icon={Target} title="Precision Targeting" description="Advanced audience segmentation and personalization for every campaign." variant="card" color="#ef4444" size="md" direction="horizontal" entrance="float-in" delay={0.55} />
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
                <span className="text-white/30 text-[0.5rem]">|</span>
                <span className="text-white/40 text-[0.5625rem]">Q4</span>
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

// ---------------------------------------------------------------------------
// Smart Lists demo data
// ---------------------------------------------------------------------------

const SMART_LIST_TASK_STATUS: SmartListData = {
  items: [
    { id: 'h1', text: 'Sprint 24 — Frontend', isHeader: true },
    { id: 's1', text: 'Implement login page', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 's2', text: 'User profile settings', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 's3', text: 'Dashboard analytics view', primaryIcon: { setId: 'task-status', iconId: 'in-progress' },
      description: 'Chart integration in progress',
      children: [
        { id: 's3a', text: 'Revenue chart', primaryIcon: { setId: 'task-status', iconId: 'done' } },
        { id: 's3b', text: 'User growth chart', primaryIcon: { setId: 'task-status', iconId: 'in-progress' } },
        { id: 's3c', text: 'Conversion funnel', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
      ],
    },
    { id: 's4', text: 'Dark mode support', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
    { id: 's5', text: 'Accessibility audit', primaryIcon: { setId: 'task-status', iconId: 'blocked' },
      description: 'Blocked by missing design specs',
    },
    { id: 'h2', text: 'Sprint 24 — Backend', isHeader: true },
    { id: 's6', text: 'API rate limiting', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 's7', text: 'Database migration v3', primaryIcon: { setId: 'task-status', iconId: 'in-progress' } },
    { id: 's8', text: 'Webhook retry logic', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
  ] as SmartListItemType[],
};

const SMART_LIST_PRIORITY: SmartListData = {
  items: [
    { id: 'p1', text: 'Production database outage recovery plan', primaryIcon: { setId: 'priority', iconId: 'p1' } },
    { id: 'p2', text: 'Customer data export compliance (GDPR)', primaryIcon: { setId: 'priority', iconId: 'p1' } },
    { id: 'p3', text: 'Onboarding flow redesign', primaryIcon: { setId: 'priority', iconId: 'p2' } },
    { id: 'p4', text: 'Search performance optimization', primaryIcon: { setId: 'priority', iconId: 'p2' } },
    { id: 'p5', text: 'Update third-party dependencies', primaryIcon: { setId: 'priority', iconId: 'p3' } },
    { id: 'p6', text: 'Refactor legacy notification service', primaryIcon: { setId: 'priority', iconId: 'p3' } },
    { id: 'p7', text: 'Add dark mode to email templates', primaryIcon: { setId: 'priority', iconId: 'p4' } },
  ] as SmartListItemType[],
};

const SMART_LIST_RISK: SmartListData = {
  items: [
    { id: 'r1', text: 'Cloud infrastructure costs within budget', primaryIcon: { setId: 'risk', iconId: 'ok' } },
    { id: 'r2', text: 'Third-party API deprecation (Stripe v2)', primaryIcon: { setId: 'risk', iconId: 'warning' },
      description: 'Migration deadline: March 2026',
    },
    { id: 'r3', text: 'Team capacity for Q2 initiatives', primaryIcon: { setId: 'risk', iconId: 'issue' },
      description: '2 engineers on leave, no backfill approved',
    },
    { id: 'r4', text: 'Competitor launched AI features', primaryIcon: { setId: 'risk', iconId: 'risk' },
      description: 'Need to accelerate our AI roadmap',
    },
  ] as SmartListItemType[],
};

const SMART_LIST_CHECKBOX: SmartListData = {
  items: [
    { id: 'cb-h1', text: 'Release Checklist', isHeader: true },
    { id: 'cb1', text: 'Code freeze completed', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
    { id: 'cb2', text: 'All unit tests passing', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
    { id: 'cb3', text: 'QA regression testing', primaryIcon: { setId: 'checkbox', iconId: 'partial' },
      description: '18 of 24 test cases verified',
      children: [
        { id: 'cb3a', text: 'Core user flows', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
        { id: 'cb3b', text: 'Payment integration', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
        { id: 'cb3c', text: 'Edge cases & error handling', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
      ],
    },
    { id: 'cb4', text: 'Performance benchmarks reviewed', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'cb5', text: 'Security audit sign-off', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'cb6', text: 'Deploy to staging', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'cb7', text: 'iOS build (dropped from scope)', primaryIcon: { setId: 'checkbox', iconId: 'cancelled' } },
  ] as SmartListItemType[],
};

const SMART_LIST_CIRCLE_STATUS: SmartListData = {
  items: [
    { id: 'cs-h1', text: 'Q1 OKRs — Engineering', isHeader: true },
    { id: 'cs1', text: 'Reduce API latency to <200ms p99', primaryIcon: { setId: 'circle-check', iconId: 'done' } },
    { id: 'cs2', text: 'Ship v2 onboarding flow', primaryIcon: { setId: 'circle-check', iconId: 'active' },
      description: 'Design approved, frontend 70% complete',
    },
    { id: 'cs3', text: 'Migrate to new auth provider', primaryIcon: { setId: 'circle-check', iconId: 'blocked' },
      description: 'Blocked: waiting on vendor security review',
    },
    { id: 'cs4', text: 'Achieve 95% test coverage', primaryIcon: { setId: 'circle-check', iconId: 'empty' } },
    { id: 'cs-h2', text: 'Q1 OKRs — Design', isHeader: true },
    { id: 'cs5', text: 'Design system v3 tokens', primaryIcon: { setId: 'circle-check', iconId: 'done' } },
    { id: 'cs6', text: 'Accessibility compliance (WCAG AA)', primaryIcon: { setId: 'circle-check', iconId: 'active' } },
    { id: 'cs7', text: 'Dark mode for mobile app', primaryIcon: { setId: 'circle-check', iconId: 'cancelled' },
      description: 'Deprioritized — moved to Q2',
    },
  ] as SmartListItemType[],
};

const SMART_LIST_NUMBERED: SmartListData = {
  items: [
    { id: 'n1', text: 'Define project scope and objectives' },
    { id: 'n2', text: 'Assemble cross-functional team' },
    { id: 'n3', text: 'Create project timeline and milestones',
      children: [
        { id: 'n3a', text: 'Identify key deliverables' },
        { id: 'n3b', text: 'Estimate effort per milestone' },
        { id: 'n3c', text: 'Set review checkpoints' },
      ],
    },
    { id: 'n4', text: 'Kickoff meeting with stakeholders' },
    { id: 'n5', text: 'Begin Phase 1 development' },
  ] as SmartListItemType[],
};

// Phase 3 demo: Edit vs. Presentation mode (SL-F09)
const SMART_LIST_EDIT_VS_PRESENT: SmartListData = {
  items: [
    { id: 'ev-h1', text: 'Q1 Objectives', isHeader: true },
    { id: 'ev1', text: 'Launch v2.0 public beta', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 'ev2', text: 'Onboard 50 enterprise pilots', primaryIcon: { setId: 'task-status', iconId: 'in-progress' } },
    { id: 'ev3', text: 'Internal security audit (hidden)', primaryIcon: { setId: 'task-status', iconId: 'in-progress' }, visible: false, description: 'Confidential — hidden from presentation' },
    { id: 'ev4', text: 'Fix critical perf regressions (hidden)', primaryIcon: { setId: 'task-status', iconId: 'todo' }, visible: false },
    { id: 'ev5', text: 'Publish developer documentation', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 'ev-h2', text: 'Stretch Goals', isHeader: true },
    { id: 'ev6', text: 'Mobile-responsive editor', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
    { id: 'ev7', text: 'Offline sync prototype (hidden)', primaryIcon: { setId: 'task-status', iconId: 'blocked' }, visible: false },
    { id: 'ev8', text: 'AI-assisted layout suggestions', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
  ] as SmartListItemType[],
};

// Phase 3 demo: Grouped by status (SL-F16)
const SMART_LIST_GROUPED: SmartListData = {
  items: [
    { id: 'g1', text: 'Migrate to new auth provider', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 'g2', text: 'API rate limiting', primaryIcon: { setId: 'task-status', iconId: 'done' } },
    { id: 'g3', text: 'Payment flow redesign', primaryIcon: { setId: 'task-status', iconId: 'in-progress' } },
    { id: 'g4', text: 'Dashboard analytics', primaryIcon: { setId: 'task-status', iconId: 'in-progress' } },
    { id: 'g5', text: 'Mobile app push notifications', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
    { id: 'g6', text: 'Accessibility audit', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
    { id: 'g7', text: 'Load testing infrastructure', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
    { id: 'g8', text: 'Deprecated API removal', primaryIcon: { setId: 'task-status', iconId: 'blocked' }, description: 'Waiting for client migration deadline' },
  ] as SmartListItemType[],
};

// Phase 2 demo: Dual Icons (task status + risk)
const SMART_LIST_DUAL_ICONS: SmartListData = {
  items: [
    { id: 'di-h1', text: 'Release Readiness', isHeader: true },
    { id: 'di1', text: 'Core API migration', primaryIcon: { setId: 'task-status', iconId: 'done' }, secondaryIcon: { setId: 'risk', iconId: 'ok' } },
    { id: 'di2', text: 'Payment gateway integration', primaryIcon: { setId: 'task-status', iconId: 'in-progress' }, secondaryIcon: { setId: 'risk', iconId: 'warning' }, description: 'Stripe v3 SDK has breaking changes' },
    { id: 'di3', text: 'User data migration', primaryIcon: { setId: 'task-status', iconId: 'in-progress' }, secondaryIcon: { setId: 'risk', iconId: 'risk' }, description: '2M records, no rollback plan yet' },
    { id: 'di4', text: 'Mobile app update', primaryIcon: { setId: 'task-status', iconId: 'todo' }, secondaryIcon: { setId: 'risk', iconId: 'issue' } },
    { id: 'di5', text: 'Documentation refresh', primaryIcon: { setId: 'task-status', iconId: 'todo' } },
  ] as SmartListItemType[],
};

// Phase 2 demo: Expandable detail
const SMART_LIST_WITH_DETAIL: SmartListData = {
  items: [
    { id: 'dt1', text: 'Authentication service', primaryIcon: { setId: 'circle-check', iconId: 'done' },
      detail: 'Implemented JWT-based auth with refresh tokens. Supports Google OAuth and email/password. Rate limiting at 100 req/min per user. Session management via Redis.',
    },
    { id: 'dt2', text: 'File upload system', primaryIcon: { setId: 'circle-check', iconId: 'active' },
      description: 'In progress — drag-and-drop working',
      detail: 'Using Cloudflare R2 for storage. Max file size 50MB. Supports image, PDF, and video. Chunked upload for files >5MB. Virus scanning via ClamAV integration pending.',
    },
    { id: 'dt3', text: 'Real-time notifications', primaryIcon: { setId: 'circle-check', iconId: 'blocked' },
      description: 'Blocked by WebSocket infrastructure',
      detail: 'Architecture decision: SSE vs WebSocket vs polling. WebSocket preferred but requires proxy config changes. ETA for infra team: 2 weeks. Fallback plan: SSE with long-polling for older browsers.',
    },
    { id: 'dt4', text: 'Analytics dashboard', primaryIcon: { setId: 'circle-check', iconId: 'empty' },
      detail: 'Requirements: page views, user sessions, conversion funnel, revenue charts. Tech stack: Recharts for visualization, ClickHouse for time-series queries. Design mockups approved.',
    },
  ] as SmartListItemType[],
};

// Phase 2 demo: Conditional formatting + progress
const SMART_LIST_PROGRESS: SmartListData = {
  items: [
    { id: 'pg1', text: 'Infrastructure setup', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
    { id: 'pg2', text: 'Database schema design', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
    { id: 'pg3', text: 'API endpoint development', primaryIcon: { setId: 'checkbox', iconId: 'checked' } },
    { id: 'pg4', text: 'Frontend component library', primaryIcon: { setId: 'checkbox', iconId: 'partial' } },
    { id: 'pg5', text: 'Integration testing', primaryIcon: { setId: 'checkbox', iconId: 'partial' } },
    { id: 'pg6', text: 'User acceptance testing', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'pg7', text: 'Performance optimization', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'pg8', text: 'Security audit', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'pg9', text: 'Deployment & monitoring', primaryIcon: { setId: 'checkbox', iconId: 'unchecked' } },
    { id: 'pg10', text: 'iOS build descoped', primaryIcon: { setId: 'checkbox', iconId: 'cancelled' } },
  ] as SmartListItemType[],
};

// Phase 2 demo: Gradual disclosure
const SMART_LIST_DISCLOSURE: SmartListData = {
  items: [
    { id: 'gd-h1', text: 'Key Takeaways', isHeader: true },
    { id: 'gd1', text: 'Revenue grew 27% quarter-over-quarter', primaryIcon: { setId: 'circle-check', iconId: 'done' } },
    { id: 'gd2', text: 'Customer churn reduced to 3.2% (target was 5%)', primaryIcon: { setId: 'circle-check', iconId: 'done' } },
    { id: 'gd3', text: 'Enterprise segment outperformed by 40%', primaryIcon: { setId: 'circle-check', iconId: 'done' } },
    { id: 'gd-h2', text: 'Action Items', isHeader: true },
    { id: 'gd4', text: 'Hire 3 additional enterprise sales reps by Q2', primaryIcon: { setId: 'circle-check', iconId: 'active' } },
    { id: 'gd5', text: 'Launch self-serve onboarding for SMB segment', primaryIcon: { setId: 'circle-check', iconId: 'empty' } },
    { id: 'gd6', text: 'Investigate APAC market expansion feasibility', primaryIcon: { setId: 'circle-check', iconId: 'empty' } },
  ] as SmartListItemType[],
};

// ---------------------------------------------------------------------------
// Smart Lists Section (new widget demos)
// ---------------------------------------------------------------------------

function SmartListsSection() {
  const { themeMode } = useDemoPage();
  const [taskListData, setTaskListData] = useState<SmartListData>(SMART_LIST_TASK_STATUS);

  return (
    <DemoGrid>
      {/* Task Status List — interactive editing */}
      <DemoBox
        title="Smart List — Task Status (Editable)"
        description="Full smart list with task-status icon set, collapse/expand, section headers, icon quick-pick. Try clicking icons to change status, or type in items."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'slide-up',
              stagger: 0.05,
            }}
            data={taskListData}
            isEditing={true}
            onDataChange={setTaskListData}
          />
        </div>
      </DemoBox>

      {/* Priority List — presentation mode */}
      <DemoBox
        title="Smart List — Priority (Presentation)"
        description="Priority icon set with conditional accent colors. Non-interactive presentation view."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'priority',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              showAccentBar: true,
              entrance: 'float-in',
              stagger: 0.08,
            }}
            data={SMART_LIST_PRIORITY}
          />
        </div>
      </DemoBox>

      {/* Risk Assessment List */}
      <DemoBox
        title="Smart List — Risk Assessment"
        description="Risk/warning icon set with descriptions. Shows how the widget handles multi-line items."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'risk',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'lg',
              entrance: 'fade',
              stagger: 0.1,
            }}
            data={SMART_LIST_RISK}
          />
        </div>
      </DemoBox>

      {/* Checkbox List */}
      <DemoBox
        title="Smart List — Checkbox (Square)"
        description="Lucide square checkbox icons: checked, unchecked, partial, cancelled. Clean vector icons scale crisply at any size."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'checkbox',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'slide-up',
              stagger: 0.05,
            }}
            data={SMART_LIST_CHECKBOX}
          />
        </div>
      </DemoBox>

      {/* Circle Status List */}
      <DemoBox
        title="Smart List — Circle Status"
        description="Lucide circle icons: empty, active, done, blocked, cancelled. Common pattern for OKR and goal tracking."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'circle-check',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'float-in',
              stagger: 0.06,
            }}
            data={SMART_LIST_CIRCLE_STATUS}
          />
        </div>
      </DemoBox>

      {/* Numbered List */}
      <DemoBox
        title="Smart List — Numbered"
        description="Auto-numbered list (1, 2, 3…) with nested sub-items using a), b), c). Numbers replace icons — no icon shown."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'bullets',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              showNumbering: true,
              numberingFormat: '1.',
              size: 'md',
              entrance: 'slide-up',
              stagger: 0.06,
            }}
            data={SMART_LIST_NUMBERED}
          />
        </div>
      </DemoBox>

      {/* Collapsed by default */}
      <DemoBox
        title="Smart List — Collapsed Sub-Items"
        description="Same task list but with sub-items collapsed by default. Click the chevron to expand."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              collapseDefault: 'all-collapsed',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'fade',
              stagger: 0.04,
            }}
            data={SMART_LIST_TASK_STATUS}
          />
        </div>
      </DemoBox>

      {/* Small size with "a." numbering */}
      <DemoBox
        title="Smart List — Compact Alphabetic"
        description="Small size with a., b., c. numbering only — no icons. Clean agenda / minutes format."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'bullets',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              showNumbering: true,
              numberingFormat: 'a.',
              size: 'sm',
              entrance: 'fade',
              stagger: 0.03,
            }}
            data={{
              items: [
                { id: 'a1', text: 'Review quarterly financials' },
                { id: 'a2', text: 'Discuss hiring plan for Q3' },
                { id: 'a3', text: 'Product roadmap prioritization' },
                { id: 'a4', text: 'Customer feedback analysis' },
                { id: 'a5', text: 'Partnership update from BD team' },
                { id: 'a6', text: 'Action items and next steps' },
              ],
            }}
          />
        </div>
      </DemoBox>

      {/* --- Phase 2 Demos --- */}

      {/* Dual Icons */}
      <DemoBox
        title="Dual Icons — Status + Risk"
        description="Phase 2: Two icon columns per item. Primary = task status, secondary = risk flag. Both clickable in edit mode."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              secondaryIconSetId: 'risk',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'slide-up',
              stagger: 0.06,
            }}
            data={SMART_LIST_DUAL_ICONS}
          />
        </div>
      </DemoBox>

      {/* Conditional Formatting + Progress */}
      <DemoBox
        title="Progress Summary + Conditional Rows"
        description="Phase 2: Auto-calculated progress bar from item statuses. Rows tinted by status color (medium intensity)."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'checkbox',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              conditionalFormatting: true,
              conditionalFormatIntensity: 'medium',
              progressSummary: 'above',
              entrance: 'fade',
              stagger: 0.04,
            }}
            data={SMART_LIST_PROGRESS}
          />
        </div>
      </DemoBox>

      {/* Expandable Detail */}
      <DemoBox
        title="Expandable Detail per Item"
        description="Phase 2: Click the › chevron to expand hidden detail content below each item. One item expanded at a time."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'circle-check',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              detailMode: 'inline',
              size: 'md',
              entrance: 'float-in',
              stagger: 0.06,
            }}
            data={SMART_LIST_WITH_DETAIL}
          />
        </div>
      </DemoBox>

      {/* Linked Legend */}
      <DemoBox
        title="Linked Legend Widget"
        description="Phase 2: SmartLegend auto-reads the icon set. Three visibility modes shown: always visible, expandable, edit-only."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full flex flex-col gap-4">
          <div className="flex gap-3 flex-wrap">
            <SmartLegend
              iconSetId="task-status"
              title="Always Visible"
              size="sm"
              direction="vertical"
              visibility="always"
              entrance="fade"
            />
            <SmartLegend
              iconSetId="checkbox"
              title="Expandable"
              size="sm"
              direction="vertical"
              visibility="expandable"
              entrance="fade"
              delay={0.2}
            />
            <SmartLegend
              iconSetId="risk"
              title="Edit-Only"
              size="sm"
              direction="vertical"
              visibility="edit-only"
              isEditing={true}
              entrance="fade"
              delay={0.4}
            />
          </div>
          <SmartLegend
            iconSetId="circle-check"
            secondaryIconSetId="risk"
            title="Dual Icon Set Legend"
            size="sm"
            direction="horizontal"
            entrance="fade"
            delay={0.6}
          />
        </div>
      </DemoBox>

      {/* Gradual Disclosure — One-by-One Focus */}
      <DemoBox
        title="Gradual Disclosure — Focus Mode"
        description="Phase 2: Click the list and use ← → arrow keys to reveal items one at a time. Current item highlighted, previous dimmed."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'circle-check',
              collapseDefault: 'all-expanded',
              revealMode: 'one-by-one-focus',
              size: 'md',
              entrance: 'fade',
              stagger: 0.05,
            }}
            data={SMART_LIST_DISCLOSURE}
          />
        </div>
      </DemoBox>

      {/* Gradual Disclosure — Accumulate */}
      <DemoBox
        title="Gradual Disclosure — Accumulate"
        description="Phase 2: Items appear one by one, but all previously shown items stay fully visible. Use ← → keys."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'circle-check',
              collapseDefault: 'all-expanded',
              revealMode: 'one-by-one-accumulate',
              size: 'md',
              entrance: 'fade',
              stagger: 0.05,
            }}
            data={SMART_LIST_DISCLOSURE}
          />
        </div>
      </DemoBox>

      {/* --- Phase 3 Demos --- */}

      {/* SL-F09: Edit Mode — show hidden items */}
      <DemoBox
        title="Edit vs. Presentation (Edit Mode)"
        description="Phase 3 SL-F09: In edit mode, hidden items appear dimmed with strikethrough. The ◉/◌ button on hover toggles visibility. Toolbar shows count and bulk actions."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'slide-up',
              stagger: 0.04,
            }}
            data={SMART_LIST_EDIT_VS_PRESENT}
            isEditing={true}
            onDataChange={() => {}}
          />
        </div>
      </DemoBox>

      {/* SL-F09: Presentation Mode — hidden items removed */}
      <DemoBox
        title="Edit vs. Presentation (Presentation)"
        description="Phase 3 SL-F09: Same data as above but in presentation mode — hidden items are completely invisible. Only 5 of 8 items shown."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              entrance: 'float-in',
              stagger: 0.06,
            }}
            data={SMART_LIST_EDIT_VS_PRESENT}
          />
        </div>
      </DemoBox>

      {/* SL-F16: Filter by status */}
      <DemoBox
        title="Filter by Status"
        description="Phase 3 SL-F16: Config filterByStatuses=['in-progress','todo'] — only items with those statuses are shown. 'Done' and 'Blocked' items hidden."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              filterByStatuses: ['in-progress', 'todo'],
              entrance: 'fade',
              stagger: 0.05,
            }}
            data={SMART_LIST_GROUPED}
          />
        </div>
      </DemoBox>

      {/* SL-F16: Group by status */}
      <DemoBox
        title="Group by Status"
        description="Phase 3 SL-F16: Items reorganized into groups by their primary icon status. Synthetic section headers with counts."
        themeMode={themeMode}
        aspect="auto"
      >
        <div className="p-4 w-full">
          <SmartItemsList
            config={{
              iconSetId: 'task-status',
              collapseDefault: 'all-expanded',
              revealMode: 'all-at-once',
              size: 'md',
              groupByStatus: true,
              conditionalFormatting: true,
              conditionalFormatIntensity: 'subtle',
              entrance: 'slide-up',
              stagger: 0.04,
            }}
            data={SMART_LIST_GROUPED}
          />
        </div>
      </DemoBox>
    </DemoGrid>
  );
}

function SmartCardsSection() {
  const { themeMode } = useDemoPage();
  const [activePopup, setActivePopup] = useState<number | null>(null);

  return (
    <DemoGrid>
      {/* Popup Callout demo */}
      <DemoBox
        title="Popup Callout"
        description="Click any card to show a detail popup overlay. The underlying layout stays unchanged. Popup grows from the card."
        themeMode={themeMode}
      >
        <div className="relative w-full h-full">
          <div className="grid grid-cols-2 gap-2 p-3 w-full h-full">
            {POPUP_CARDS.map((card, i) => (
              <IconTitleCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
                variant="card"
                color={card.color}
                size="sm"
                entrance="fade"
                delay={i * 0.1}
                onClick={() => setActivePopup(i)}
              />
            ))}
          </div>
          {activePopup !== null && (
            <DetailPopup
              open={true}
              icon={POPUP_CARDS[activePopup].icon}
              title={POPUP_CARDS[activePopup].title}
              description={POPUP_CARDS[activePopup].description}
              color={POPUP_CARDS[activePopup].color}
              onClose={() => setActivePopup(null)}
            >
              <div className="flex flex-col gap-2">
                <span className="text-white/70 text-xs font-semibold">Detail Content</span>
                <p className="text-white/50 text-[0.625rem] leading-relaxed">
                  This is the expanded detail for {POPUP_CARDS[activePopup].title}. In a real slide, this content comes from the card&apos;s detailItems in the data model.
                </p>
              </div>
            </DetailPopup>
          )}
        </div>
      </DemoBox>

      {/* DetailPopup component showcase */}
      <DemoBox
        title="DetailPopup — Two Column"
        description="Standalone popup with icon identity on the left and detail content on the right. Solid background for readability."
        themeMode={themeMode}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-colors"
            onClick={() => setActivePopup(-1)}
          >
            Show Detail Popup
          </button>
          <DetailPopup
            open={activePopup === -1}
            icon={Rocket}
            title="Launch"
            description="Ship features faster with streamlined deployment pipelines and CI/CD."
            color="#3b82f6"
            onClose={() => setActivePopup(null)}
          >
            <div className="flex flex-col gap-2">
              <span className="text-white/70 text-xs font-semibold">Deployment Pipeline</span>
              <div className="flex flex-col gap-1.5">
                {['CI/CD setup', 'Staging deploy', 'Prod release', 'Rollback plan'].map((t, i) => (
                  <div key={t} className="flex items-center gap-2">
                    {i < 2 ? <CircleCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-white/30" />}
                    <span className={`text-[0.625rem] ${i < 2 ? 'text-white/50 line-through' : 'text-white/70'}`}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </DetailPopup>
        </div>
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
        { value: 'smart-lists', label: 'Smart Lists', count: 19, content: <SmartListsSection /> },
        { value: 'smart-cards', label: 'Smart Cards', count: 4, content: <SmartCardsSection /> },
        { value: 'cards', label: 'Cards & Heroes', count: 4, content: <CardsSection /> },
        { value: 'navigation', label: 'Navigation & Chrome', count: 4, content: <NavigationSection /> },
        { value: 'lists', label: 'Lists & Legends', count: 2, content: <ListsSection /> },
      ]}
    />
  );
}
