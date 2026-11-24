"use client";

import React, { use, useState, useEffect } from "react";
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
import { ArtistsService } from "@/modules/artists/artists.service";
import type { Artist } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { TrackTable } from "@/components/music/TrackTable";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatNumber, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [artist, setArtist] = useState<Artist | null>(() => getArtistById(id) || null);
  const [isLoading, setIsLoading] = useState(false);

  const playTrack = usePlayerStore((s) => s.playTrack);
  const isArtistFollowed = useLibraryStore((s) => s.isArtistFollowed);
  const toggleFollowArtist = useLibraryStore((s) => s.toggleFollowArtist);

  useEffect(() => {
    let isMounted = true;
    async function loadArtist() {
      try {
        const dbArtist = await ArtistsService.getArtistById(id);
        if (isMounted && dbArtist) {
          setArtist(dbArtist);
        }
      } catch (err) {
        console.error("Failed to load artist from database:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadArtist();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!artist && !isLoading) {
    notFound();
  }

  const isFollowed = artist ? isArtistFollowed(artist.id) : false;
  const popularTracks = artist ? getTracksByIds(artist.popularTrackIds) : [];
  const albums = artist ? getAlbumsByArtistId(artist.id) : [];
  const similarArtists = mockArtists
    .filter((a) => a.id !== (artist?.id || id))
    .slice(0, 4);

  const handlePlayArtist = () => {
    if (popularTracks.length > 0) {
      playTrack(popularTracks[0], popularTracks);
    }
  };

  if (!artist) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden min-h-[340px] md:min-h-[400px] flex flex-col justify-end p-6 md:p-10 border border-white/10 shadow-2xl">
        {/* Banner background photo with explicit absolute position */}
        <div className="absolute inset-0">
          <Image
            src={artist.bannerUrl || artist.avatarUrl}
            alt={artist.name}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center brightness-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-[#09090D]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090D]/90 via-[#09090D]/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Verified Independent Creator</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
              {artist.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-[#A1A1AA]">
              <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
              {artist.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#71717A]" />
                    {artist.location}
                  </span>
                </>
              )}
              {artist.genres.length > 0 && (
                <>
                  <span>•</span>
                  <span>{artist.genres.join(", ")}</span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#D4D4D8] line-clamp-3 leading-relaxed max-w-xl">
            {artist.bio}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePlayArtist}
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Artist</span>
            </button>

            <button
              onClick={() => toggleFollowArtist(artist.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2",
                isFollowed
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white text-black border-white hover:bg-white/90"
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

      {/* 2. POPULAR TRACKS */}
      <section>
        <SectionHeader
          title="Popular Releases"
          subtitle="Top tracks trending across listeners worldwide"
        />
        <TrackTable tracks={popularTracks} showAlbum={true} />
      </section>

      {/* 3. DISCOGRAPHY / ALBUMS */}
      {albums.length > 0 && (
        <section>
          <SectionHeader
            title="Discography"
            subtitle="Albums, EPs and conceptual records"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 4. SIMILAR CREATORS */}
      <section>
        <SectionHeader
          title="Fans Also Enjoy"
          subtitle="Acoustically aligned independent creators"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {similarArtists.map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
