"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, History, TrendingUp } from "lucide-react";
import { TrackTable } from "@/components/music/TrackTable";
import { ArtistCard } from "@/components/music/ArtistCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchAll, mockGenres } from "@/data";
import { cn } from "@/lib/utils";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlParam = searchParams.get("q") || searchParams.get("genre") || "";
  const [query, setQuery] = useState(urlParam);
  const [activeTab, setActiveTab] = useState<"all" | "tracks" | "artists" | "albums" | "playlists">("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Aura Vance",
    "Synthwave",
    "Kyoto Lo-fi",
    "Nordic Ambient",
  ]);

  const trendingQueries = [
    "Glacial Resonance",
    "Ethereal Fjord",
    "Solaris Echo",
    "Velvet Bloom",
    "Midnight Focus",
    "Dream Pop",
  ];

  const results = useMemo(() => {
    return searchAll(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 7)]);
    }
    router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectQuery = (text: string) => {
    setQuery(text);
    if (!recentSearches.includes(text)) {
      setRecentSearches((prev) => [text, ...prev.slice(0, 7)]);
    }
    router.replace(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleClearQuery = () => {
    setQuery("");
    router.replace("/search");
  };

  const removeRecent = (text: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== text));
  };

  const totalResults =
    results.tracks.length +
    results.artists.length +
    results.albums.length +
    results.playlists.length;

  const isSearching = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* 1. Prominent Search Bar */}
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-3xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to? (Tracks, artists, moods...)"
            className="w-full pl-12 pr-12 py-3.5 md:py-4 rounded-2xl bg-[#17171F] border border-white/10 text-sm md:text-base text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500 shadow-xl transition-all"
            autoFocus={!urlParam}
          />
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              aria-label="Clear search query"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#71717A] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Trending & Recent quick pills (when query is empty) */}
        {!isSearching && (
          <div className="flex flex-col gap-4 pt-2">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17171F] border border-white/5 text-xs text-[#A1A1AA] hover:text-white hover:border-purple-500/30 transition-all cursor-pointer"
                    >
                      <span onClick={() => handleSelectQuery(item)}>
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecent(item);
                        }}
                        className="text-[#71717A] hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingQueries.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectQuery(term)}
                    className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs when query is present */}
        {isSearching && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-white/[0.06] pb-3">
            {[
              { id: "all", label: `All (${totalResults})` },
              { id: "tracks", label: `Tracks (${results.tracks.length})` },
              { id: "artists", label: `Artists (${results.artists.length})` },
              { id: "albums", label: `Albums (${results.albums.length})` },
              { id: "playlists", label: `Playlists (${results.playlists.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                  activeTab === tab.id
                    ? "bg-[#8B5CF6] text-white shadow-md shadow-purple-600/30"
                    : "bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Results Content */}
      {isSearching && totalResults === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We couldn't find any independent tracks, artists, or albums matching "${query}". Try searching for another keyword or check out trending recommendations.`}
          actionText="Clear Search"
          onAction={handleClearQuery}
        />
      ) : (
        <div className="flex flex-col gap-10">
          {/* TRACKS RESULTS */}
          {(activeTab === "all" || activeTab === "tracks") &&
            results.tracks.length > 0 && (
              <section>
                <SectionHeader
                  title="Songs & Tracks"
                  subtitle={`${results.tracks.length} matching independent tracks`}
                />
                <TrackTable
                  tracks={activeTab === "all" ? results.tracks.slice(0, 6) : results.tracks}
                />
              </section>
            )}

          {/* ARTISTS RESULTS */}
          {(activeTab === "all" || activeTab === "artists") &&
            results.artists.length > 0 && (
              <section>
                <SectionHeader
                  title="Artists"
                  subtitle={`${results.artists.length} matching independent creators`}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {(activeTab === "all"
                    ? results.artists.slice(0, 6)
                    : results.artists
                  ).map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

          {/* ALBUMS RESULTS */}
          {(activeTab === "all" || activeTab === "albums") &&
            results.albums.length > 0 && (
              <section>
                <SectionHeader
                  title="Albums & EPs"
                  subtitle={`${results.albums.length} matching releases`}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {(activeTab === "all"
                    ? results.albums.slice(0, 6)
                    : results.albums
                  ).map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

          {/* PLAYLISTS RESULTS */}
          {(activeTab === "all" || activeTab === "playlists") &&
            results.playlists.length > 0 && (
              <section>
                <SectionHeader
                  title="Playlists"
                  subtitle={`${results.playlists.length} curated collections`}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {(activeTab === "all"
                    ? results.playlists.slice(0, 6)
                    : results.playlists
                  ).map((pl) => (
                    <PlaylistCard key={pl.id} playlist={pl} />
                  ))}
                </div>
              </section>
            )}
        </div>
      )}

      {/* When idle: Popular genres grid */}
      {!isSearching && (
        <section className="pt-4">
          <SectionHeader
            title="Explore Genres & Tags"
            subtitle="Dive into handpicked independent acoustics"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {mockGenres.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelectQuery(g.name)}
                className="p-4 rounded-xl bg-[#17171F] hover:bg-[#20202A] border border-white/5 hover:border-purple-500/30 text-left transition-all hover:scale-[1.02]"
              >
                <span className="text-sm font-bold text-white block">
                  {g.name}
                </span>
                <span className="text-[11px] text-[#71717A] line-clamp-1 mt-1">
                  {g.description}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#A1A1AA]">Loading search catalog...</div>}>
      <SearchContent />
    </Suspense>
  );
}
