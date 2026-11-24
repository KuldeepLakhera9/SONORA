"use client";

import React, { use, useState, useEffect } from "react";
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
import { PlaylistsRepository } from "@/modules/playlists/playlists.repository";
import type { Playlist } from "@/types/music";
import { TrackTable } from "@/components/music/TrackTable";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export default function PlaylistDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const playlists = useLibraryStore((s) => s.playlists);
  const [playlist, setPlaylist] = useState<Playlist | null>(
    () => playlists.find((p) => p.id === id) || mockPlaylists.find((p) => p.id === id) || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

  useEffect(() => {
    let isMounted = true;
    async function loadPlaylist() {
      try {
        const p = await PlaylistsRepository.getPlaylistById(id);
        if (isMounted && p) {
          setPlaylist(p);
        }
      } catch (err) {
        console.error("Failed to load playlist:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPlaylist();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!playlist && !isLoading) {
    notFound();
  }

  const tracks = playlist ? getTracksByIds(playlist.trackIds) : [];
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

  const otherPlaylists = playlists.filter((p) => p.id !== (playlist?.id || id)).slice(0, 4);

  if (!playlist) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* 1. HERO BANNER */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 pt-4 pb-2">
        {/* Cover Art */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 shrink-0 border border-white/10 group">
          <Image
            src={playlist.coverUrl}
            alt={playlist.title}
            fill
            sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{playlist.isCurated ? "Curated Mix" : "Playlist"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#F5F5F7] tracking-tight">
            {playlist.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#A1A1AA]">
            <span className="text-white font-semibold">{playlist.creatorName}</span>
            <span>•</span>
            <span>{tracks.length} tracks</span>
            {durationMins > 0 && (
              <>
                <span>•</span>
                <span>{durationMins} mins</span>
              </>
            )}
            {playlist.followersCount && (
              <>
                <span>•</span>
                <span>{playlist.followersCount.toLocaleString()} saves</span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#71717A] max-w-xl line-clamp-2 mt-1">
            {playlist.description}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePlayAll}
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play All</span>
            </button>

            <button
              onClick={handleShufflePlay}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white border border-white/10 transition-colors"
              title="Shuffle Playlist"
              aria-label="Shuffle Playlist"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. TRACKLIST */}
      <section className="mt-4">
        <TrackTable tracks={tracks} showAlbum={true} />
      </section>

      {/* 3. MORE PLAYLISTS */}
      {otherPlaylists.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            title="More Editorial Mixes"
            href="/explore"
            linkText="Explore All"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {otherPlaylists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
