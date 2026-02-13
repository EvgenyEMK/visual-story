'use client';

import { Link } from '@/lib/navigation';
import { Blocks, Component, LayoutTemplate, Sparkles } from 'lucide-react';

const DEMO_SECTIONS = [
  {
    href: '/demo/content-building-blocks',
    title: 'Content Building Blocks',
    subtitle: 'Atoms',
    description:
      'Leaf-level presentation elements: titles, text, icons, metrics, progress bars, images, and buttons.',
    icon: Blocks,
    color: '#3b82f6',
    count: 8,
  },
  {
    href: '/demo/content-widgets',
    title: 'Content Widgets',
    subtitle: 'Molecules',
    description:
      'Common combinations of atoms: feature cards, stat cards, quotes, heroes, timelines, lists, and more.',
    icon: Component,
    color: '#8b5cf6',
    count: 10,
  },
  {
    href: '/demo/slide-layout-templates',
    title: 'Slide Layout Templates',
    subtitle: 'Layouts',
    description:
      'Slide-level compositions combining molecules with layout strategies: grids, sidebars, bento, hub-spoke.',
    icon: LayoutTemplate,
    color: '#14b8a6',
    count: 9,
  },
  {
    href: '/demo/transitions-animations',
    title: 'Transitions & Animations',
    subtitle: '28 Demos',
    description:
      'In-slide animations, slide-to-slide transitions, and grouped item animations for storytelling presentations.',
    icon: Sparkles,
    color: '#f59e0b',
    count: 28,
  },
];

export function DemoHubClient() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Component Library</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Explore the full VisualStory presentation toolkit — from atomic building
          blocks to complete slide layouts and cinematic transitions.
        </p>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {DEMO_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow no-underline"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${section.color}15`,
                      border: `1.5px solid ${section.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: section.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {section.title}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {section.subtitle} · {section.count} components
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
