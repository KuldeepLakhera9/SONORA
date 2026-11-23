"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Album } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { getTracksByIds } from "@/data";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  album: Album;
  className?: string;
}

export function AlbumCard({ album, className }: AlbumCardProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  const handlePlayAlbum = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const tracks = getTracksByIds(album.trackIds);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <Link
      href={`/album/${album.id}`}
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
          src={album.coverUrl}
          alt={album.title}
          fill
          sizes="(max-width: 768px) 160px, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={handlePlayAlbum}
          aria-label={`Play ${album.title}`}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 active:scale-90 z-10"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>

        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
          {album.type}
        </span>
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-[#F5F5F7] group-hover:text-purple-300 transition-colors truncate">
          {album.title}
        </span>
        <span className="text-xs text-[#A1A1AA] truncate mt-1">
          {album.artistName}
        </span>
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#71717A]">
          <span>{album.releaseYear}</span>
          <span>•</span>
          <span>{album.trackIds.length} tracks</span>
        </div>
      </div>
    </Link>
  );
}
