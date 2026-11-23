"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Playlist } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { getTracksByIds } from "@/data";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: Playlist;
  className?: string;
}

export function PlaylistCard({ playlist, className }: PlaylistCardProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const tracks = getTracksByIds(playlist.trackIds);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className={cn(
        "group relative flex flex-col p-3 rounded-xl bg-[#17171F]/80 hover:bg-[#20202A] transition-all duration-300 border border-white/[0.04] hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-950/20",
        className
      )}
    >
      <div
        className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#111116] mb-3 shadow-md"
        style={{ position: "relative" }}
      >
        <Image
          src={playlist.coverUrl}
          alt={playlist.title}
          fill
          sizes="(max-width: 768px) 160px, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={handlePlay}
          aria-label={`Play ${playlist.title}`}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 active:scale-90 z-10"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>

        {playlist.isCurated && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#8B5CF6]/90 backdrop-blur-md text-white border border-purple-400/20">
            Editorial
          </span>
        )}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-[#F5F5F7] group-hover:text-purple-300 transition-colors truncate">
          {playlist.title}
        </span>
        <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
          {playlist.description}
        </p>
        <span className="text-[11px] text-[#71717A] mt-2">
          {playlist.trackIds.length} tracks • By {playlist.creatorName}
        </span>
      </div>
    </Link>
  );
}
