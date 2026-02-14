"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon, LogOut as LogOutIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface UserMenuProps {
  user?: SupabaseUser | null;
  loading?: boolean;
}

export function UserMenu({ user: propUser, loading: propLoading = false }: UserMenuProps) {
  const t = useTranslations();
  const [user, setUser] = useState<SupabaseUser | null>(propUser ?? null);
  const [loading, setLoading] = useState(propLoading);
  const [avatarError, setAvatarError] = useState(false);
  const router = useRouter();

  // If user is provided as prop, use it; otherwise fetch independently
  useEffect(() => {
    // If user is passed as prop, skip fetching
    if (propUser !== undefined) {
      return;
    }

    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAvatarError(false);
    });

    return () => subscription.unsubscribe();
  }, [propUser]);

  // Sync prop changes to state
  useEffect(() => {
    if (propUser !== undefined) {
      setUser(propUser);
    }
    if (propLoading !== undefined) {
      setLoading(propLoading);
    }
  }, [propUser, propLoading]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  // Don't show anything while loading or if user is not logged in
  if (loading || !user) {
    return null;
  }

  const email = user?.email;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || email?.split('@')[0];
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const showAvatar = avatarUrl && !avatarError;

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 rounded-full">
          {showAvatar ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full rounded-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <UserIcon size={ICON_SIZE} className="text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {displayName && <p className="text-sm font-medium leading-none">{displayName}</p>}
            {email && (
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleLogout}
        >
          <LogOutIcon className={cn("mr-2 h-4 w-4")} />
          <span>{t('navigation.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
