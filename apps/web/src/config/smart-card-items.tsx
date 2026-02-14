/**
 * Shared CardExpandItem data used by both the Demo page and the
 * Slide Editor / Slide Play card-expand slides.
 *
 * Matches the SMART_CARD_ITEMS from ContentWidgetsClient.tsx exactly.
 */

import {
  Rocket,
  Shield,
  Zap,
  BarChart3,
  Circle,
  CircleCheck,
} from 'lucide-react';
import type { CardExpandItem } from '@/components/slide-ui';

// ---------------------------------------------------------------------------
// Shared Smart Card Items
// ---------------------------------------------------------------------------

export const SMART_CARD_ITEMS: CardExpandItem[] = [
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
              {i < 2
                ? <CircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                : <Circle className="w-3.5 h-3.5 text-white/30" />}
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
