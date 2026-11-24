"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Compass } from "lucide-react";
import { SectionHeader } from "@/components/music/SectionHeader";
import { GenreCard } from "@/components/music/GenreCard";
import { MoodCard } from "@/components/music/MoodCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { CatalogService } from "@/modules/catalog/catalog.service";
import type { ExplorePageDiscoveryData } from "@/modules/catalog/catalog.types";
import {
  mockGenres,
  mockMoods,
  mockActivities,
  mockArtists,
  mockPlaylists,
  getTracksByIds,
} from "@/data";
import { usePlayerStore } from "@/stores/usePlayerStore";

const initialExploreData: ExplorePageDiscoveryData = {
  genres: mockGenres,
  emergingArtists: mockArtists.slice(4, 8),
  featuredCollections: mockPlaylists.slice(0, 4),
};

export default function ExplorePage() {
  const [data, setData] = useState<ExplorePageDiscoveryData>(initialExploreData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | "genres" | "moods" | "activities">("all");
  const playTrack = usePlayerStore((s) => s.playTrack);

  useEffect(() => {
    let isMounted = true;
    async function loadExploreData() {
      try {
        const exploreData = await CatalogService.getExplorePageData();
        if (isMounted && exploreData && exploreData.genres.length > 0) {
          setData(exploreData);
        }
      } catch (err) {
        console.error("Failed to load explore data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadExploreData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlayActivity = (trackIds: string[]) => {
    const tracks = getTracksByIds(trackIds);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14 pb-8">
      {/* Hero Header */}
      <div className="relative rounded-2xl md:rounded-3xl p-6 md:p-10 bg-gradient-to-r from-purple-950/40 via-[#17171F] to-[#111116] border border-white/[0.08] overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Sonic Cartography</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-3">
            Explore Music & Moods
          </h1>
          <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
            Navigate through independent sonic frontiers. From icy Reykjavík ambient drift to syncopated Bristol bass and Kyoto tea house lo-fi.
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {[
              { id: "all", label: "Overview" },
              { id: "genres", label: "All Genres" },
              { id: "moods", label: "Mood Collections" },
              { id: "activities", label: "Activity Soundtracks" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-[#17171F] text-[#A1A1AA] hover:text-white hover:bg-white/[0.08] border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute right-40 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* SECTION 1: GENRES */}
          {(selectedTab === "all" || selectedTab === "genres") && (
            <section>
              <SectionHeader
                title="Sound Dimensions & Genres"
                subtitle="Curated spectrum of independent electronic, ambient, acoustic, and neoclassical forms"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
                {data.genres.map((genre) => (
                  <GenreCard key={genre.id} genre={genre} />
                ))}
              </div>
            </section>
          )}

          {/* SECTION 2: MOOD COLLECTIONS */}
          {(selectedTab === "all" || selectedTab === "moods") && (
            <section>
              <SectionHeader
                title="Mood Landscapes"
                subtitle="Emotional atmospheres tailored to introspective sessions, nocturnal focus, and calm"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
                {mockMoods.map((mood) => (
                  <MoodCard key={mood.id} mood={mood} />
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3: ACTIVITIES */}
          {(selectedTab === "all" || selectedTab === "activities") && (
            <section>
              <SectionHeader
                title="Activity Soundtracks"
                subtitle="Sonic backdrops calibrated to specific workflows and mental states"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockActivities.map((act) => (
                  <div
                    key={act.id}
                    className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#17171F] border border-white/5 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                        {act.name}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-2">
                        {act.subtitle}
                      </p>
                      <span className="inline-block mt-3 text-[11px] font-mono text-purple-400/80">
                        {act.trackIds.length} tracks
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlayActivity(act.trackIds)}
                      className="mt-4 w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-purple-600 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Play Stream
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: EMERGING CREATORS */}
          {selectedTab === "all" && (
            <section>
              <SectionHeader
                title="Emerging Creators"
                subtitle="Rising sonic architects breaking creative frontiers"
                href="/explore"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.emergingArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* SECTION 5: FEATURED EDITORIAL COLLECTIONS */}
          {selectedTab === "all" && (
            <section>
              <SectionHeader
                title="Featured Mix Collections"
                subtitle="Editorial selections updated weekly"
                href="/library"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.featuredCollections.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
