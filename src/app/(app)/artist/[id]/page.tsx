"use client";

import React, { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Play,
  UserPlus,
  UserCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  getArtistById,
  getTracksByIds,
  getAlbumsByArtistId,
  mockArtists,
} from "@/data";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { TrackTable } from "@/components/music/TrackTable";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { formatNumber, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const artist = getArtistById(id);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const isArtistFollowed = useLibraryStore((s) => s.isArtistFollowed);
  const toggleFollowArtist = useLibraryStore((s) => s.toggleFollowArtist);

  if (!artist) {
    notFound();
  }

  const isFollowed = isArtistFollowed(artist.id);
  const popularTracks = getTracksByIds(artist.popularTrackIds);
  const albums = getAlbumsByArtistId(artist.id);
  const similarArtists = mockArtists
    .filter((a) => a.id !== artist.id)
    .slice(0, 4);

  const handlePlayArtist = () => {
    if (popularTracks.length > 0) {
      playTrack(popularTracks[0], popularTracks);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden min-h-[340px] md:min-h-[400px] flex flex-col justify-end p-6 md:p-10 border border-white/10 shadow-2xl">
        {/* Banner background photo with explicit absolute position */}
        <div className="absolute inset-0 z-0" style={{ position: "absolute" }}>
          <Image
            src={artist.bannerUrl}
            alt={artist.name}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-[#09090D]/60 to-transparent" />
        </div>

        {/* Artist Profile Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          <div
            className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl shrink-0"
            style={{ position: "relative" }}
          >
            <Image
              src={artist.avatarUrl}
              alt={artist.name}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Independent Artist</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-2 leading-tight">
              {artist.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs md:text-sm text-[#A1A1AA] mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                {artist.location}
              </span>
              <span>•</span>
              <span className="text-white font-semibold">
                {formatNumber(artist.monthlyListeners)} monthly listeners
              </span>
              <span>•</span>
              <span>{artist.genres.join(", ")}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayArtist}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs md:text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play Artist</span>
              </button>

              <button
                onClick={() => toggleFollowArtist(artist.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-semibold transition-all hover:scale-105 active:scale-95",
                  isFollowed
                    ? "bg-white/10 text-white hover:bg-white/15 border border-white/15"
                    : "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40"
                )}
              >
                {isFollowed ? (
                  <>
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BIOGRAPHY & SOUND PROFILE CARD */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#17171F] border border-white/5 flex flex-col md:flex-row gap-6 justify-between">
        <div className="max-w-3xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#71717A] mb-2">
            About the Artist
          </h3>
          <p className="text-sm md:text-base text-[#F5F5F7] leading-relaxed">
            {artist.bio}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0 md:border-l md:border-white/10 md:pl-6 text-xs text-[#A1A1AA]">
          <span className="font-semibold text-white">Sonic Tags:</span>
          <div className="flex flex-wrap gap-1.5">
            {artist.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] text-purple-300"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. POPULAR TRACKS */}
      <section>
        <SectionHeader
          title="Popular Tracks"
          subtitle={`Most streamed by ${artist.name}`}
        />
        <TrackTable tracks={popularTracks} showCover={true} />
      </section>

      {/* 4. DISCOGRAPHY / ALBUMS */}
      {albums.length > 0 && (
        <section>
          <SectionHeader
            title="Discography & Albums"
            subtitle="Full official studio discography"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SIMILAR ARTISTS */}
      {similarArtists.length > 0 && (
        <section className="pt-4 border-t border-white/[0.06]">
          <SectionHeader
            title="Fans Also Enjoy"
            subtitle="Independent creators with matching acoustic profiles"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarArtists.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
