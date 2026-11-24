"use client";

import React, { useState, useEffect } from "react";
import { FeaturedBanner } from "@/components/music/FeaturedBanner";
import { SectionHeader } from "@/components/music/SectionHeader";
import { MusicCard } from "@/components/music/MusicCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { BannerSkeleton, CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { CatalogService } from "@/modules/catalog/catalog.service";
import type { HomePageDiscoveryData } from "@/modules/catalog/catalog.types";
import {
  mockTracks,
  mockAlbums,
  mockArtists,
  mockPlaylists,
  getFeaturedHeroTrack,
  getTracksByIds,
} from "@/data";
import { useLibraryStore } from "@/stores/useLibraryStore";

const initialData: HomePageDiscoveryData = {
  featuredHeroTrack: getFeaturedHeroTrack(),
  madeForYouTracks: mockTracks.slice(0, 6),
  trendingTracks: mockTracks.slice(0, 6),
  newReleasesAlbums: mockAlbums.slice(0, 6),
  hiddenGems: mockTracks.slice(6, 12),
  independentArtists: mockArtists.slice(0, 6),
  popularPlaylists: mockPlaylists.slice(0, 6),
};

export default function HomePage() {
  const [data, setData] = useState<HomePageDiscoveryData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const recentlyPlayedIds = useLibraryStore((s) => s.recentlyPlayedTrackIds);
  const recentTracks = getTracksByIds(recentlyPlayedIds).slice(0, 6);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const homeData = await CatalogService.getHomePageData();
        if (isMounted && homeData) {
          setData(homeData);
        }
      } catch (err) {
        console.error("Failed to load catalog home page data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 md:gap-14 pb-8">
        <BannerSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-8">
      {/* 1. Large Editorial Featured Music Banner */}
      <FeaturedBanner track={data.featuredHeroTrack} />

      {/* 2. Recently Played (if any) */}
      {recentTracks.length > 0 && (
        <section>
          <SectionHeader
            title="Recently Played"
            subtitle="Pick up your sonic thread where you left off"
            href="/library"
            linkText="View Library"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentTracks.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Made For You / Discovery Flow */}
      <section>
        <SectionHeader
          title="Made For You"
          subtitle="Independent gems aligned to your listening atmosphere"
          href="/explore"
          linkText="Explore All"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.madeForYouTracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* 4. Trending Independent Tracks */}
      <section>
        <SectionHeader
          title="Trending Independent"
          subtitle="Tracks creating acoustic resonance across the network"
          href="/explore"
          linkText="See Trending"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.trendingTracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* 5. Fresh Album & EP Releases */}
      <section>
        <SectionHeader
          title="New Releases"
          subtitle="Complete bodies of work straight from studio cutting rooms"
          href="/explore"
          linkText="All Releases"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.newReleasesAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* 6. Hidden Gems / Deep Cuts */}
      <section>
        <SectionHeader
          title="Sonic Horizons"
          subtitle="Undiscovered masterpieces flying beneath mainstream radar"
          href="/explore"
          linkText="Discover More"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.hiddenGems.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* 7. Featured Independent Artists */}
      <section>
        <SectionHeader
          title="Independent Visionaries"
          subtitle="Distinctive voices shaping the future of global sound"
          href="/explore"
          linkText="All Creators"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.independentArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* 8. Curated Public Editorial Playlists */}
      <section>
        <SectionHeader
          title="Editorial Mixes"
          subtitle="Carefully sculpted sonic journeys for focused states and travel"
          href="/library"
          linkText="All Playlists"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.popularPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
}
