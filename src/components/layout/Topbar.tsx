"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";

function getInitialGreeting(): string {
  if (typeof window === "undefined") return "Good evening";
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [greeting] = useState<string>(getInitialGreeting);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const isSearchPage = pathname === "/search";

  return (
    <header className="sticky top-0 z-30 w-full h-16 px-4 md:px-8 flex items-center justify-between glass-header">
      {/* Left: Navigation History & Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        {/* History Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors border border-white/5 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.forward()}
            aria-label="Go forward"
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors border border-white/5 active:scale-95 hidden sm:flex"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Entry */}
        {!isSearchPage && (
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md hidden sm:block"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#17171F] border border-white/[0.08] text-xs md:text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </form>
        )}

        {isSearchPage && (
          <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider hidden sm:block">
            Search Audio Catalog
          </div>
        )}
      </div>

      {/* Right: Greeting, Notifications & User Avatar */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <span className="text-xs font-medium text-[#A1A1AA] hidden lg:inline-block">
          {greeting}, <span className="text-white font-semibold">Julian</span>
        </span>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Profile Avatar with explicit relative position */}
        <Link
          href="/library"
          className="relative block w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-purple-500/40 hover:border-purple-400 transition-colors"
          style={{ position: "relative" }}
          title="Your Profile"
        >
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Julian"
            fill
            sizes="36px"
            className="object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
