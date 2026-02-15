'use client';

import { AppNavbar, AppNavbarNavItem } from '@/components/app-nav/app-navbar';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { hasEnvVars } from '@/lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function AppNavbarWrapper() {
  const t = useTranslations();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasEnvVars) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch {
        // Supabase not configured
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    try {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch {
      // Supabase not configured
    }
  }, []);

  // Define navigation links based on authentication status
  const navigationLinks: AppNavbarNavItem[] = user
    ? [
        // Logged in user navigation
        {
          href: '/dashboard',
          label: t('navigation.dashboard'),
          active: pathname.includes('/dashboard')
        },
        {
          href: '/projects',
          label: t('navigation.projects'),
          active: pathname.includes('/projects')
        },
      ]
    : [
        // Not logged in user navigation
        {
          href: '/',
          label: t('navigation.home'),
          active: pathname === '/' || pathname === '/en' || pathname === '/fr'
        },
        {
          href: '/demo',
          label: t('navigation.demo'),
          active: pathname.includes('/demo')
        },
        {
          href: '/slide-editor',
          label: t('navigation.slideEditor'),
          active: pathname.includes('/slide-editor')
        },
        {
          href: '/slide-play',
          label: t('navigation.slidePlay'),
          active: pathname.includes('/slide-play')
        },
        {
          href: '/data-structures',
          label: t('navigation.dataDev'),
          active: pathname.includes('/data-structures')
        },
      ];

  return (
    <AppNavbar
      navigationLinks={navigationLinks}
      logoHref="/"
      user={user}
      loading={loading}
    />
  );
}
