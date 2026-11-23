"use client";

import React, { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Play,
  Shuffle,
  Heart,
  Sparkles,
} from "lucide-react";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { getTracksByIds, mockPlaylists } from "@/data";
import { TrackTable } from "@/components/music/TrackTable";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SectionHeader } from "@/components/music/SectionHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export default function PlaylistDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const playlists = useLibraryStore((s) => s.playlists);
  const playlist = playlists.find((p) => p.id === id) || mockPlaylists.find((p) => p.id === id);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

  if (!playlist) {
    notFound();
  }

  const tracks = getTracksByIds(playlist.trackIds);
  const totalDurationSeconds = tracks.reduce((acc, t) => acc + t.duration, 0);
  const durationMins = Math.floor(totalDurationSeconds / 60);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      toggleShuffle();
      const randomIdx = getRandomIndex(tracks.length);
      playTrack(tracks[randomIdx], tracks);
    }
  };

  const otherPlaylists = playlists.filter((p) => p.id !== playlist.id).slice(0, 4);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#17171F] to-[#111116] border border-white/[0.08] p-6 md:p-8 lg:p-10 shadow-2xl">
        {/* Ambient Blur Backdrop */}
        <div className="absolute inset-0 opacity-20 filter blur-3xl scale-150 pointer-events-none">
          <Image
            src={playlist.coverUrl}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Cover Art */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
            <Image
              src={playlist.coverUrl}
              alt={playlist.title}
              fill
              sizes="(max-width: 768px) 240px, 300px"
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{playlist.isCurated ? "Editorial Playlist" : "User Collection"}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-3 leading-tight">
              {playlist.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 mb-4 leading-relaxed max-w-2xl">
              {playlist.description}
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-[#A1A1AA] font-medium">
              <span className="text-white font-semibold">{playlist.creatorName}</span>
              <span>•</span>
              <span>{tracks.length} tracks</span>
              <span>•</span>
              <span>approx. {durationMins} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTION BAR */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
          <span>Play All</span>
        </button>

        <button
          onClick={handleShufflePlay}
          disabled={tracks.length === 0}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          title="Shuffle Playlist"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        <button
          aria-label="Like playlist"
          className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-purple-400 border border-white/5 transition-all"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* 3. TRACK LISTING TABLE */}
      <section className="mt-2">
        <TrackTable tracks={tracks} playlistId={playlist.id} />
      </section>

      {/* 4. OTHER RECOMMENDED PLAYLISTS */}
      {otherPlaylists.length > 0 && (
        <section className="mt-8 pt-8 border-t border-white/[0.06]">
          <SectionHeader
            title="You Might Also Enjoy"
            subtitle="Curated by the SONORA Editorial Team"
            href="/explore"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {otherPlaylists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
