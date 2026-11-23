"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserPlus, UserCheck, Play } from "lucide-react";
import { Artist } from "@/types/music";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { getTracksByIds } from "@/data";
import { formatNumber, cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: Artist;
  className?: string;
}

export function ArtistCard({ artist, className }: ArtistCardProps) {
  const isArtistFollowed = useLibraryStore((s) => s.isArtistFollowed);
  const toggleFollowArtist = useLibraryStore((s) => s.toggleFollowArtist);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const followed = isArtistFollowed(artist.id);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollowArtist(artist.id);
  };

  const handlePlayArtist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const tracks = getTracksByIds(artist.popularTrackIds);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <Link
      href={`/artist/${artist.id}`}
      className={cn(
        "group relative flex flex-col items-center text-center p-4 rounded-xl bg-[#17171F]/80 hover:bg-[#20202A] transition-all duration-300 border border-white/[0.04] hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-950/20",
        className
      )}
    >
      {/* Avatar */}
      <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#111116] mb-3 shadow-lg border-2 border-white/5 group-hover:border-purple-500/40 transition-colors duration-300">
        <Image
          src={artist.avatarUrl}
          alt={artist.name}
          fill
          sizes="150px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play overlay on hover */}
        <button
          onClick={handlePlayArtist}
          aria-label={`Play ${artist.name}`}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <div className="w-12 h-12 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-lg active:scale-90">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </button>
      </div>

      {/* Info */}
      <span className="text-sm md:text-base font-semibold text-[#F5F5F7] group-hover:text-purple-300 transition-colors truncate max-w-full">
        {artist.name}
      </span>
      <span className="text-xs text-[#A1A1AA] mt-1">
        {formatNumber(artist.monthlyListeners)} monthly listeners
      </span>

      {/* Follow button */}
      <button
        onClick={handleFollowClick}
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95",
          followed
            ? "bg-white/10 text-white hover:bg-white/15 border border-white/10"
            : "bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-purple-300 border border-purple-500/30"
        )}
      >
        {followed ? (
          <>
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="w-3.5 h-3.5" />
            <span>Follow</span>
          </>
        )}
      </button>
    </Link>
  );
}
