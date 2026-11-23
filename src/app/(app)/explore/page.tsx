"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Globe, Compass } from "lucide-react";
import { SectionHeader } from "@/components/music/SectionHeader";
import { GenreCard } from "@/components/music/GenreCard";
import { MoodCard } from "@/components/music/MoodCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import {
  mockGenres,
  mockMoods,
  mockActivities,
  mockArtists,
  getTracksByIds,
} from "@/data";
import { usePlayerStore } from "@/stores/usePlayerStore";

export default function ExplorePage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "genres" | "moods" | "activities">("all");
  const playTrack = usePlayerStore((s) => s.playTrack);

  const emergingArtists = mockArtists.slice(4, 8);

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
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-purple-600/30"
                    : "bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Browse by Genre */}
      {(selectedTab === "all" || selectedTab === "genres") && (
        <section id="genres">
          <SectionHeader
            title="Browse by Genre"
            subtitle="Curated independent expressions across ten essential sonic traditions"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {mockGenres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Mood Collections */}
      {(selectedTab === "all" || selectedTab === "moods") && (
        <section id="moods">
          <SectionHeader
            title="Atmospheric Mood Collections"
            subtitle="Intelligently attuned to emotional resonance and room energy"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockMoods.map((mood) => (
              <MoodCard key={mood.id} mood={mood} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Music for Activities */}
      {(selectedTab === "all" || selectedTab === "activities") && (
        <section id="activities">
          <SectionHeader
            title="Soundtracks for Daily Flow"
            subtitle="Continuous sonic landscapes crafted for specific moments"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mockActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => handlePlayActivity(act.trackIds)}
                className="group relative rounded-2xl overflow-hidden bg-[#17171F] border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden bg-[#111116]"
                  style={{ position: "relative" }}
                >
                  <Image
                    src={act.coverUrl}
                    alt={act.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17171F] via-[#17171F]/40 to-transparent" />
                  <button
                    aria-label={`Play ${act.name}`}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {act.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
                    {act.subtitle}
                  </p>
                  <span className="text-[11px] text-purple-400 font-semibold mt-3 inline-block">
                    {act.trackIds.length} Tracks in Flow
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Global Music Discovery Spotlight */}
      <section>
        <SectionHeader
          title="Global Soundscapes Spotlight"
          subtitle="Independent scenes blossoming outside the commercial studio system"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-[#17171F] border border-indigo-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-2">
                <Globe className="w-4 h-4" />
                <span>Reykjavík & Nordic Wave</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ethereal Tape Reverb</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Slow-evolving string harmonies and analog synthesizer pads inspired by volcanic landscapes and midnight auroras.
              </p>
            </div>
            <Link
              href="/artist/artist-1"
              className="mt-6 text-xs font-semibold text-indigo-300 hover:underline"
            >
              Explore Nordic Scene →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 to-[#17171F] border border-amber-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2">
                <Globe className="w-4 h-4" />
                <span>Kyoto & Tape Curation</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Acoustic Bamboo Lo-fi</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Antique koto instruments recorded with reel-to-reel field tape recorders in historical temple districts.
              </p>
            </div>
            <Link
              href="/artist/artist-3"
              className="mt-6 text-xs font-semibold text-amber-300 hover:underline"
            >
              Explore Kyoto Scene →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-950/30 to-[#17171F] border border-pink-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-pink-400 text-xs font-mono mb-2">
                <Globe className="w-4 h-4" />
                <span>Melbourne & Montreal</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Warm Analog Neo-Soul</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Juno-106 analog synthesis, broken syncopated grooves, and rich vocal harmonies bridging jazz and electronic.
              </p>
            </div>
            <Link
              href="/artist/artist-2"
              className="mt-6 text-xs font-semibold text-pink-300 hover:underline"
            >
              Explore Neo-Soul Scene →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Emerging Artists */}
      <section>
        <SectionHeader
          title="Emerging Independent Visionaries"
          subtitle="Self-producing innovators crafting their sound without compromise"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {emergingArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
}
