"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  Shuffle,
  Heart,
  Disc3,
} from "lucide-react";
import { getAlbumById, getTracksByIds, mockAlbums } from "@/data";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { TrackTable } from "@/components/music/TrackTable";
import { AlbumCard } from "@/components/music/AlbumCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export default function AlbumDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const album = getAlbumById(id);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

  const isAlbumSaved = useLibraryStore((s) => s.isAlbumSaved);
  const toggleSaveAlbum = useLibraryStore((s) => s.toggleSaveAlbum);

  if (!album) {
    notFound();
  }

  const tracks = getTracksByIds(album.trackIds);
  const isSaved = isAlbumSaved(album.id);

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const durationMins = Math.floor(totalDuration / 60);

  const handlePlayAlbum = () => {
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

  // Other releases by this artist or genre
  const otherReleases = mockAlbums
    .filter((a) => a.id !== album.id && (a.artistId === album.artistId || a.genre === album.genre))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#17171F] to-[#111116] border border-white/[0.08] p-6 md:p-8 lg:p-10 shadow-2xl">
        {/* Ambient Blur Backdrop with explicit absolute position */}
        <div
          className="absolute inset-0 opacity-25 filter blur-3xl scale-150 pointer-events-none"
          style={{ position: "absolute" }}
        >
          <Image src={album.coverUrl} alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          <div
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10"
            style={{ position: "relative" }}
          >
            <Image
              src={album.coverUrl}
              alt={album.title}
              fill
              sizes="(max-width: 768px) 240px, 300px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Disc3 className="w-3.5 h-3.5" />
              <span>
                {album.type} • {album.genre}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-2 leading-tight">
              {album.title}
            </h1>

            <Link
              href={`/artist/${album.artistId}`}
              className="text-base sm:text-lg font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-4"
            >
              {album.artistName}
            </Link>

            {album.description && (
              <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 mb-4 leading-relaxed max-w-2xl">
                {album.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-[#71717A] font-medium">
              <span>{album.releaseYear}</span>
              <span>•</span>
              <span>{tracks.length} tracks</span>
              <span>•</span>
              <span>approx. {durationMins} minutes</span>
              {album.recordLabel && (
                <>
                  <span>•</span>
                  <span>{album.recordLabel}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTION BAR */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={handlePlayAlbum}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
          <span>Play Album</span>
        </button>

        <button
          onClick={handleShufflePlay}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          title="Shuffle Album"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        <button
          onClick={() => toggleSaveAlbum(album.id)}
          aria-label={isSaved ? "Remove from Library" : "Save Album"}
          className={cn(
            "p-3.5 rounded-full border transition-all active:scale-90",
            isSaved
              ? "bg-purple-600/20 text-purple-400 border-purple-500/40"
              : "bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white border-white/5"
          )}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-purple-400")} />
        </button>
      </div>

      {/* 3. TRACKLIST */}
      <section className="mt-2">
        <TrackTable tracks={tracks} showAlbum={false} />
      </section>

      {/* 4. MORE RELEASES */}
      {otherReleases.length > 0 && (
        <section className="mt-8 pt-8 border-t border-white/[0.06]">
          <SectionHeader
            title="More Independent Releases"
            subtitle={`Explore more sonic projects in ${album.genre}`}
            href="/explore"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {otherReleases.map((al) => (
              <AlbumCard key={al.id} album={al} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
