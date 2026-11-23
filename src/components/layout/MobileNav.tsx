"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Compass,
  Search,
  Bookmark,
  Disc3,
  Play,
  Pause,
  Maximize2,
} from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const navItems = [
    { label: "Discover", href: "/home", icon: Disc3 },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Library", href: "/library", icon: Bookmark },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
      {/* Floating mini-player on mobile (pointer-events-auto) */}
      {currentTrack && (
        <div className="pointer-events-auto mx-2 mb-2 p-2 rounded-xl glass-player border border-white/10 shadow-2xl flex items-center justify-between">
          <div
            onClick={() => router.push("/now-playing")}
            className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#17171F]">
              <Image
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#F5F5F7] truncate">
                {currentTrack.title}
              </span>
              <span className="text-[10px] text-[#A1A1AA] truncate">
                {currentTrack.artistName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center active:scale-90"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={() => router.push("/now-playing")}
              aria-label="Expand player"
              className="p-1.5 text-[#A1A1AA] hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main bottom mobile nav bar (pointer-events-auto) */}
      <nav className="pointer-events-auto h-14 bg-[#111116]/95 backdrop-blur-xl border-t border-white/[0.08] flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/home" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-colors",
                isActive ? "text-purple-400 font-semibold" : "text-[#71717A] hover:text-[#A1A1AA]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-purple-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
