"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Search,
  Bookmark,
  Heart,
  Plus,
  Sparkles,
  Music2,
  Disc3,
  ExternalLink,
} from "lucide-react";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { CreatePlaylistModal } from "@/components/ui/CreatePlaylistModal";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const playlists = useLibraryStore((s) => s.playlists);
  const likedTrackIds = useLibraryStore((s) => s.likedTrackIds);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mainNav = [
    { name: "Discover", href: "/home", icon: Disc3 },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Search", href: "/search", icon: Search },
    { name: "Your Library", href: "/library", icon: Bookmark },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen bg-[#111116] border-r border-white/[0.06] p-4 select-none z-30">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-3 py-3 mb-4">
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white font-mono">
                SONORA
              </span>
              <span className="text-[10px] text-purple-400 font-medium tracking-widest uppercase">
                Independent Music
              </span>
            </div>
          </Link>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-1 mb-6">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/home" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.06]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#71717A]")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Playlists & Collection Header */}
        <div className="flex items-center justify-between px-3 mb-2 text-xs font-bold uppercase tracking-wider text-[#71717A]">
          <span>Your Playlists</span>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Create playlist"
            title="Create playlist"
            className="p-1 rounded-md text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Liked Songs Shortcut */}
        <Link
          href="/playlist/liked-songs"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors mb-1",
            pathname === "/playlist/liked-songs"
              ? "bg-purple-950/40 text-purple-300 border border-purple-500/20"
              : "text-[#F5F5F7] hover:bg-white/[0.05]"
          )}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-pink-500 flex items-center justify-center shrink-0 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate">Liked Songs</span>
            <span className="text-[10px] text-[#71717A]">
              {likedTrackIds.length} tracks
            </span>
          </div>
        </Link>

        {/* User / Curated Playlists scrollable list */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-0.5 pr-1">
          {playlists
            .filter((p) => p.id !== "liked-songs")
            .map((playlist) => {
              const isCurrent = pathname === `/playlist/${playlist.id}`;
              return (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors truncate",
                    isCurrent
                      ? "text-purple-300 font-semibold bg-white/[0.06]"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.03]"
                  )}
                  title={playlist.title}
                >
                  <span className="truncate">{playlist.title}</span>
                  {playlist.isCurated && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 shrink-0">
                      Curation
                    </span>
                  )}
                </Link>
              );
            })}
        </div>

        {/* Indie Discovery Promo Card */}
        <div className="mt-auto pt-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-[#17171F] border border-purple-500/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">Independent Spotlight</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              100% of platform discovery is dedicated to independent creators.
            </p>
            <Link
              href="/explore"
              className="text-[11px] font-semibold text-purple-300 hover:text-purple-200 inline-flex items-center gap-1"
            >
              Explore Indie Charts <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
