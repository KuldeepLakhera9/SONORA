"use client";

import React, { use, useState, useEffect } from "react";
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
import { AlbumsService } from "@/modules/albums/albums.service";
import type { Album } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { TrackTable } from "@/components/music/TrackTable";
import { AlbumCard } from "@/components/music/AlbumCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export default function AlbumDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(() => getAlbumById(id) || null);
  const [isLoading, setIsLoading] = useState(false);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

  const isAlbumSaved = useLibraryStore((s) => s.isAlbumSaved);
  const toggleSaveAlbum = useLibraryStore((s) => s.toggleSaveAlbum);

  useEffect(() => {
    let isMounted = true;
    async function loadAlbum() {
      try {
        const dbAlbum = await AlbumsService.getAlbumById(id);
        if (isMounted && dbAlbum) {
          setAlbum(dbAlbum);
        }
      } catch (err) {
        console.error("Failed to load album from database:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAlbum();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!album && !isLoading) {
    notFound();
  }

  const tracks = album ? getTracksByIds(album.trackIds) : [];
  const isSaved = album ? isAlbumSaved(album.id) : false;

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

  const moreAlbums = mockAlbums.filter((a) => a.id !== id).slice(0, 4);

  if (!album) {
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
            src={album.coverUrl}
            alt={album.title}
            fill
            sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-400 uppercase tracking-widest">
            <Disc3 className="w-3.5 h-3.5" />
            <span>{album.type}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#F5F5F7] tracking-tight">
            {album.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#A1A1AA]">
            <Link
              href={`/artist/${album.artistId}`}
              className="text-white font-semibold hover:text-purple-400 transition-colors"
            >
              {album.artistName}
            </Link>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>{tracks.length} tracks</span>
            {durationMins > 0 && (
              <>
                <span>•</span>
                <span>{durationMins} mins</span>
              </>
            )}
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-purple-300">
              {album.genre}
            </span>
          </div>

          {album.description && (
            <p className="text-xs sm:text-sm text-[#71717A] max-w-xl line-clamp-2 mt-1">
              {album.description}
            </p>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePlayAlbum}
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </button>

            <button
              onClick={handleShufflePlay}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white border border-white/10 transition-colors"
              title="Shuffle Album"
              aria-label="Shuffle Album"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleSaveAlbum(album.id)}
              className={cn(
                "p-2.5 rounded-full border transition-all",
                isSaved
                  ? "bg-purple-600/20 border-purple-500 text-purple-400"
                  : "bg-white/5 border-white/10 text-[#A1A1AA] hover:text-white hover:bg-white/10"
              )}
              title={isSaved ? "Remove from Library" : "Save to Library"}
              aria-label={isSaved ? "Remove from Library" : "Save to Library"}
            >
              <Heart
                className={cn("w-4 h-4", isSaved && "fill-current text-purple-400")}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. TRACKLIST */}
      <section className="mt-4">
        <TrackTable tracks={tracks} showAlbum={false} />
      </section>

      {/* 3. MORE RELEASES */}
      <section className="mt-6">
        <SectionHeader
          title={`More from ${album.artistName}`}
          href={`/artist/${album.artistId}`}
          linkText="View Artist"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {moreAlbums.map((a) => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
