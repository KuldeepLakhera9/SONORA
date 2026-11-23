"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart, Plus } from "lucide-react";
import { Track } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { AudioVisualizer } from "./AudioVisualizer";
import { cn } from "@/lib/utils";

interface MusicCardProps {
  track: Track;
  contextTracks?: Track[];
  className?: string;
}

export function MusicCard({ track, contextTracks, className }: MusicCardProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const isTrackLiked = useLibraryStore((s) => s.isTrackLiked);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const liked = isTrackLiked(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, contextTracks);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLikeTrack(track.id);
  };

  const handleQueueClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQueue(track);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col p-3 rounded-xl bg-[#17171F]/80 hover:bg-[#20202A] transition-all duration-300 border border-white/[0.04] hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-950/20",
        isCurrent && "border-purple-500/30 bg-[#20202A]/90",
        className
      )}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#111116] mb-3 shadow-md">
        <Image
          src={track.coverUrl}
          alt={track.title}
          fill
          sizes="(max-width: 768px) 160px, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top actions on hover */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleLikeClick}
            aria-label={liked ? "Unlike" : "Like"}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-black/60 transition-transform active:scale-95",
              liked ? "text-purple-400" : "text-white/80 hover:text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", liked && "fill-purple-400")} />
          </button>
          <button
            onClick={handleQueueClick}
            aria-label="Add to queue"
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-black/60 text-white/80 hover:text-white transition-transform active:scale-95"
            title="Add to queue"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Play button overlay */}
        <button
          onClick={handlePlayClick}
          aria-label={isThisPlaying ? "Pause" : "Play"}
          className={cn(
            "absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 z-10",
            isThisPlaying
              ? "opacity-100 scale-100 shadow-purple-500/30"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Now playing indicator */}
        {isCurrent && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md flex items-center gap-1.5 z-10">
            <AudioVisualizer isPlaying={isPlaying} />
            <span className="text-[10px] font-medium text-purple-300">
              {isPlaying ? "Playing" : "Paused"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <Link
          href={`/album/${track.albumId}`}
          className="text-sm font-semibold text-[#F5F5F7] hover:text-[#8B5CF6] transition-colors truncate"
          title={track.title}
        >
          {track.title}
        </Link>
        <Link
          href={`/artist/${track.artistId}`}
          className="text-xs text-[#A1A1AA] hover:text-white transition-colors truncate mt-1"
          title={track.artistName}
        >
          {track.artistName}
        </Link>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#71717A]">
          <span>{track.genre}</span>
          <span>•</span>
          <span>{track.releaseYear}</span>
        </div>
      </div>
    </div>
  );
}
