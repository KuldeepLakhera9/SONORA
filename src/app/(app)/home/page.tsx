"use client";

import React from "react";
import { FeaturedBanner } from "@/components/music/FeaturedBanner";
import { SectionHeader } from "@/components/music/SectionHeader";
import { MusicCard } from "@/components/music/MusicCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import {
  mockTracks,
  mockAlbums,
  mockArtists,
  mockPlaylists,
  getFeaturedHeroTrack,
  getTracksByIds,
} from "@/data";
import { useLibraryStore } from "@/stores/useLibraryStore";

export default function HomePage() {
  const heroTrack = getFeaturedHeroTrack();
  const recentlyPlayedIds = useLibraryStore((s) => s.recentlyPlayedTrackIds);
  const recentTracks = getTracksByIds(recentlyPlayedIds).slice(0, 6);

  // Curated subsets
  const madeForYouTracks = mockTracks.slice(0, 6);
  const trendingTracks = [
    mockTracks[1], // Midnight Velocity
    mockTracks[2], // Kyoto Lanterns
    mockTracks[3], // Silk & Smoke
    mockTracks[5], // Chroma Drift
    mockTracks[6], // Concrete Frequency
    mockTracks[7], // Shinjuku Tea House
  ];
  const hiddenGems = [
    mockTracks[9], // Cedar Creek Hollow
    mockTracks[12], // Late Night Southbank
    mockTracks[14], // Pacific Fog
    mockTracks[16], // Ode to Winter Solstice
    mockTracks[11], // Polar Twilight
    mockTracks[4], // Crystalline Waters
  ];
  const newAlbums = mockAlbums.slice(0, 6);
  const featuredArtists = mockArtists.slice(0, 6);
  const popularPlaylists = mockPlaylists.slice(0, 6);

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-8">
      {/* 1. Large Editorial Featured Music Banner */}
      <FeaturedBanner track={heroTrack} />

      {/* 2. Recently Played (if any) */}
      {recentTracks.length > 0 && (
        <section>
          <SectionHeader
            title="Recently Played"
            subtitle="Pick up your sonic thread where you left off"
            href="/library"
            linkText="View Library"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {recentTracks.map((track) => (
              <MusicCard
                key={track.id}
                track={track}
                contextTracks={recentTracks}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Made for You */}
      <section>
        <SectionHeader
          title="Made for You"
          subtitle="Intelligent discovery attuned to your acoustic DNA"
          href="/explore"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {madeForYouTracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              contextTracks={madeForYouTracks}
            />
          ))}
        </div>
      </section>

      {/* 4. Trending Now */}
      <section>
        <SectionHeader
          title="Trending Now"
          subtitle="Resonating across independent circles worldwide"
          href="/explore"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {trendingTracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              contextTracks={trendingTracks}
            />
          ))}
        </div>
      </section>

      {/* 5. New Releases (Albums & EPs) */}
      <section>
        <SectionHeader
          title="New Releases"
          subtitle="Pristine studio albums & extended plays fresh from master tape"
          href="/explore"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {newAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* 6. Hidden Gems */}
      <section>
        <SectionHeader
          title="Hidden Gems"
          subtitle="Undiscovered indie masterworks waiting to be heard"
          href="/explore"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {hiddenGems.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              contextTracks={hiddenGems}
            />
          ))}
        </div>
      </section>

      {/* 7. Discover Independent Artists */}
      <section>
        <SectionHeader
          title="Discover Independent Artists"
          subtitle="Creators retaining 100% ownership and artistic freedom"
          href="/explore"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* 8. Popular Playlists */}
      <section>
        <SectionHeader
          title="Popular Editorial Playlists"
          subtitle="Masterfully curated for uninterrupted immersion"
          href="/explore"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {popularPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
}
