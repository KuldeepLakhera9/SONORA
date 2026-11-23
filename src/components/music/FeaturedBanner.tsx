"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Sparkles, Heart } from "lucide-react";
import { Track } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { AudioVisualizer } from "./AudioVisualizer";
import { cn } from "@/lib/utils";

interface FeaturedBannerProps {
  track: Track;
  className?: string;
}

export function FeaturedBanner({ track, className }: FeaturedBannerProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  const isTrackLiked = useLibraryStore((s) => s.isTrackLiked);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const liked = isTrackLiked(track.id);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-[#17171F] via-[#20202A] to-[#17171F] border border-white/[0.08] shadow-2xl",
        className
      )}
    >
      {/* Background ambient glow image */}
      <div
        className="absolute inset-0 opacity-25 filter blur-3xl scale-125 pointer-events-none"
        style={{ position: "absolute" }}
      >
        <Image
          src={track.coverUrl}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#09090D] via-[#09090D]/80 to-transparent z-0" />

      {/* Main content grid */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between p-6 md:p-10 lg:p-12 gap-6 md:gap-10">
        {/* Left Column: Editorial Details */}
        <div className="flex-1 flex flex-col items-start max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Release of the Week</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-2 leading-tight">
            {track.title}
          </h1>

          <Link
            href={`/artist/${track.artistId}`}
            className="text-lg md:text-xl font-medium text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors mb-4"
          >
            {track.artistName}
          </Link>

          <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed mb-6 max-w-lg">
            Experience Nordic dream pop at its pinnacle. Submerged synthesizer textures, crystalline vocals, and expansive soundscapes capturing the polar midnight.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlay}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all active:scale-95 hover:scale-[1.02]"
            >
              {isThisPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Preview</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Listen Now</span>
                </>
              )}
            </button>

            <Link
              href={`/album/${track.albumId}`}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-[#F5F5F7] font-semibold text-sm border border-white/10 transition-all hover:scale-[1.02] active:scale-95"
            >
              Explore Album
            </Link>

            <button
              onClick={() => toggleLikeTrack(track.id)}
              aria-label={liked ? "Unlike" : "Like"}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-90",
                liked
                  ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                  : "border-white/10 bg-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/10"
              )}
            >
              <Heart className={cn("w-5 h-5", liked && "fill-purple-400")} />
            </button>
          </div>
        </div>

        {/* Right Column: Hero Artwork */}
        <div
          className="relative group shrink-0 w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{ position: "relative" }}
        >
          <Image
            src={track.coverUrl}
            alt={track.title}
            fill
            sizes="(max-width: 768px) 240px, 320px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {isCurrent && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-semibold text-purple-300">
              <AudioVisualizer isPlaying={isPlaying} />
              <span>{isPlaying ? "Live" : "Ready"}</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-white/80 font-mono">
            {track.genre} • {track.releaseYear}
          </div>
        </div>
      </div>
    </div>
  );
}
