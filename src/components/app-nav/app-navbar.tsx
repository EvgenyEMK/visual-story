'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/app-nav/language-switcher';
import { ThemeSwitcher } from '@/components/app-nav/theme-switcher';
import { UserMenu } from '@/components/app-nav/user-menu';
import { Link } from '@/lib/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const appNameText = 'VisualStory';

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface AppNavbarNavItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface AppNavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: AppNavbarNavItem[];
  user?: SupabaseUser | null;
  loading?: boolean;
}

export const AppNavbar = React.forwardRef<HTMLElement, AppNavbarProps>(
  (
    {
      className,
      logoHref = '/',
      navigationLinks = [],
      user,
      loading = false,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full max-w-7xl mx-auto bg-background px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger - hidden on desktop, shown on mobile */}
            <div className="md:hidden">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="flex w-full [&>div]:w-full max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0 w-full">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <Link
                            href={link.href}
                            onClick={() => setIsPopoverOpen(false)}
                            className={cn(
                              'flex w-full items-center rounded-md px-3 py-4 sm:py-2 text-md font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline',
                              link.active && 'font-bold text-accent-foreground'
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            </div>
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <Link
                href={logoHref}
                className="flex items-center space-x-2 text-foreground hover:text-foreground/90 transition-colors cursor-pointer"
              >
                <span className="font-bold text-xl sm:text-2xl lg:text-3xl sm:mr-4 lg:mr-16">{appNameText}</span>
              </Link>
              {/* Navigation menu - hidden on mobile, shown on desktop */}
              <div className="hidden md:block">
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <Link
                          href={link.href}
                          className={cn(
                            'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer relative',
                            'before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-current before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100',
                            link.active && 'before:scale-x-100 font-bold'
                          )}
                          data-active={link.active}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <UserMenu user={user} loading={loading} />
          </div>
        </div>
      </header>
    );
  }
);

AppNavbar.displayName = 'AppNavbar';
export { HamburgerIcon };
