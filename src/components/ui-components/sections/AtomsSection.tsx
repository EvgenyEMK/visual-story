'use client';

import { DemoBox } from '../DemoBox';
import {
  SlideTitle,
  SlideText,
  IconBadge,
  MetricDisplay,
  ProgressBar,
  StatusDot,
  SlideImage,
  CTAButton,
} from '@/components/slide-ui';

// Lucide icons
import { Rocket, Shield, Zap, BarChart3, Target, Eye, Cloud, Lock } from 'lucide-react';
// Phosphor icons
import { RocketLaunch, ChartBar, LockSimple, Lightning } from '@phosphor-icons/react';
// Tabler icons
import { IconBolt, IconChartBar, IconShieldCheck, IconRocket } from '@tabler/icons-react';

interface Props {
  themeMode: 'dark' | 'light';
}

export function AtomsSection({ themeMode }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Tier 1: Atoms</h2>
        <p className="text-sm text-muted-foreground">
          Leaf-level presentation elements. Each supports static and animated modes via the <code className="text-xs bg-muted px-1 py-0.5 rounded">entrance</code> prop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* SlideTitle */}
        <DemoBox title="SlideTitle" description="Heading with optional subtitle. Sizes: sm, md, lg, xl." themeMode={themeMode}>
          <div className="flex flex-col gap-6 p-6 w-full">
            <SlideTitle text="Revenue Growth" subtitle="Q4 2025 Performance Report" size="lg" entrance="fade" />
            <SlideTitle text="Small Title" subtitle="Compact mode" size="sm" align="center" entrance="slide-up" delay={0.3} />
          </div>
        </DemoBox>

        {/* SlideText */}
        <DemoBox title="SlideText" description="Body text with weight, size, alignment, serif, italic options." themeMode={themeMode}>
          <div className="flex flex-col gap-4 p-6 w-full">
            <SlideText text="Regular body text with default styling." size="md" entrance="fade" />
            <SlideText text="Bold medium text for emphasis." size="lg" weight="bold" entrance="fade" delay={0.2} />
            <SlideText text="Italic serif for quotes and callouts." size="md" italic serif entrance="fade" delay={0.4} />
          </div>
        </DemoBox>

        {/* IconBadge */}
        <DemoBox title="IconBadge" description="Icon in a styled container. Works with Lucide, Phosphor, Tabler, or emojis." themeMode={themeMode}>
          <div className="flex items-end gap-4 p-6">
            <IconBadge icon={Rocket} label="Lucide" color="#3b82f6" size="md" shape="rounded" entrance="pop-zoom" />
            <IconBadge icon={RocketLaunch} label="Phosphor" color="#8b5cf6" size="md" shape="circle" entrance="pop-zoom" delay={0.15} />
            <IconBadge icon={IconRocket} label="Tabler" color="#14b8a6" size="md" shape="rounded" entrance="pop-zoom" delay={0.3} />
            <IconBadge icon="🚀" label="Emoji" color="#f59e0b" size="md" shape="square" entrance="pop-zoom" delay={0.45} />
          </div>
        </DemoBox>

        {/* MetricDisplay */}
        <DemoBox title="MetricDisplay" description="Big number with optional label and delta indicator." themeMode={themeMode}>
          <div className="flex gap-8 p-6">
            <MetricDisplay value="$2.4M" label="Annual Revenue" delta="+27% YoY" deltaDirection="up" color="#3b82f6" entrance="pulse" />
            <MetricDisplay value="1,247" label="Users" delta="-3.2%" deltaDirection="down" color="#ef4444" entrance="pulse" delay={0.3} />
          </div>
        </DemoBox>

        {/* ProgressBar */}
        <DemoBox title="ProgressBar" description="Horizontal bar with optional label and value display. Animated wipe." themeMode={themeMode}>
          <div className="flex flex-col gap-3 w-full px-6 py-6">
            <ProgressBar value={85} label="Marketing" color="#3b82f6" showValue entrance="fade" delay={0} />
            <ProgressBar value={72} label="Sales" color="#8b5cf6" showValue entrance="fade" delay={0.2} />
            <ProgressBar value={94} label="Support" color="#14b8a6" showValue entrance="fade" delay={0.4} />
            <ProgressBar value={61} label="R&D" color="#f59e0b" showValue entrance="fade" delay={0.6} />
          </div>
        </DemoBox>

        {/* StatusDot */}
        <DemoBox title="StatusDot" description="Small indicator with optional label and pulse animation." themeMode={themeMode}>
          <div className="flex items-center gap-6 p-6">
            <StatusDot color="#22c55e" label="Online" />
            <StatusDot color="#f59e0b" label="Warning" pulse />
            <StatusDot color="#ef4444" label="Critical" pulse />
            <StatusDot color="#6b7280" label="Offline" />
          </div>
        </DemoBox>

        {/* SlideImage */}
        <DemoBox title="SlideImage" description="Image with masked reveal entrance. Uses any image URL." themeMode={themeMode}>
          <div className="p-6 flex items-center justify-center">
            <SlideImage
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop"
              alt="Mountain landscape"
              width={260}
              height={146}
              borderRadius={12}
              entrance="scale-in"
            />
          </div>
        </DemoBox>

        {/* CTAButton */}
        <DemoBox title="CTAButton" description="Call-to-action button with gradient and optional shimmer effect." themeMode={themeMode}>
          <div className="flex flex-col items-center gap-4 p-6">
            <CTAButton text="Get Started Free" size="lg" shimmer entrance="pop-zoom" />
            <CTAButton text="Learn More" size="md" gradientFrom="#14b8a6" gradientTo="#3b82f6" entrance="fade" delay={0.3} />
            <CTAButton text="Small CTA" size="sm" gradientFrom="#f59e0b" gradientTo="#ef4444" entrance="fade" delay={0.5} />
          </div>
        </DemoBox>

        {/* Icon Libraries Showcase */}
        <DemoBox title="Icon Libraries" description="Three universal monochrome icon sets: Lucide (1500+), Phosphor (7700+), Tabler (4950+)." themeMode={themeMode}>
          <div className="flex flex-col gap-4 p-6 w-full">
            {/* Lucide row */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Lucide React</span>
              <div className="flex gap-3">
                <IconBadge icon={Rocket} color="#3b82f6" size="sm" />
                <IconBadge icon={Shield} color="#3b82f6" size="sm" />
                <IconBadge icon={Zap} color="#3b82f6" size="sm" />
                <IconBadge icon={BarChart3} color="#3b82f6" size="sm" />
                <IconBadge icon={Target} color="#3b82f6" size="sm" />
                <IconBadge icon={Eye} color="#3b82f6" size="sm" />
              </div>
            </div>
            {/* Phosphor row */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Phosphor Icons</span>
              <div className="flex gap-3">
                <IconBadge icon={RocketLaunch} color="#8b5cf6" size="sm" />
                <IconBadge icon={ChartBar} color="#8b5cf6" size="sm" />
                <IconBadge icon={LockSimple} color="#8b5cf6" size="sm" />
                <IconBadge icon={Lightning} color="#8b5cf6" size="sm" />
              </div>
            </div>
            {/* Tabler row */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Tabler Icons</span>
              <div className="flex gap-3">
                <IconBadge icon={IconBolt} color="#14b8a6" size="sm" />
                <IconBadge icon={IconChartBar} color="#14b8a6" size="sm" />
                <IconBadge icon={IconShieldCheck} color="#14b8a6" size="sm" />
                <IconBadge icon={IconRocket} color="#14b8a6" size="sm" />
              </div>
            </div>
          </div>
        </DemoBox>
      </div>
    </div>
  );
}
