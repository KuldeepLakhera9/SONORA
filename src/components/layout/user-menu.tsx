"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Library,
  LogOut,
  ChevronDown,
  Sparkles,
  Shield,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { logoutAction } from "@/lib/auth/actions";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database.types";

interface UserMenuProps {
  initialUser?: User | null;
  initialProfile?: Profile | null;
}

export function UserMenu({ initialUser, initialProfile }: UserMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null);
  const [loading, setLoading] = useState(true);

  // Sync auth state with Supabase client
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // In local dev without live DB, default to an authenticated listener profile for preview
      setUser({
        id: "00000000-0000-4000-a000-000000000005",
        email: "maya@sonora.internal",
      } as User);
      setProfile({
        id: "00000000-0000-4000-a000-000000000005",
        username: "maya_sound",
        display_name: "Maya Chen",
        avatar_path:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        bio: "Acoustic explorer & indie music enthusiast",
        role: "listener",
        is_active: true,
        created_at: "2025-01-10T12:00:00Z",
        updated_at: "2025-01-10T12:00:00Z",
      });
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Fetch initial user
    const checkUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          const { data: currentProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

          setProfile(currentProfile);
        } else {
          setProfile(null);
        }
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        setProfile(currentProfile);
      } else {
        setProfile(null);
      }
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutAction();
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
        <Loader2 className="w-3.5 h-3.5 text-[#71717A] animate-spin" />
      </div>
    );
  }

  // LOGGED OUT STATE
  if (!user) {
    return (
      <div className="flex items-center gap-2.5">
        <Link
          href="/login"
          className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="text-xs font-semibold text-white px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 transition-all active:scale-95"
        >
          Get Started
        </Link>
      </div>
    );
  }

  // LOGGED IN STATE
  const avatarUrl =
    profile?.avatar_path ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  const displayName = profile?.display_name || user.email?.split("@")[0] || "Listener";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-colors group"
        aria-expanded={isOpen}
        aria-label="User navigation menu"
      >
        <div
          className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-purple-500/40"
          style={{ position: "relative" }}
        >
          <Image
            src={avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <span className="text-xs font-medium text-white max-w-[110px] truncate hidden md:inline-block">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#71717A] group-hover:text-white transition-transform mr-1 hidden sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#17171F] border border-white/10 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* User Header */}
          <div className="px-3 py-2.5 border-b border-white/5">
            <p className="text-sm font-bold text-white truncate">{displayName}</p>
            {profile?.username && (
              <p className="text-xs text-purple-400 font-medium">@{profile.username}</p>
            )}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {profile?.role || "Listener"}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[#71717A]" />
              <span>Your Profile</span>
            </Link>
            <Link
              href="/library"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <Library className="w-4 h-4 text-[#71717A]" />
              <span>Your Library</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-1 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
