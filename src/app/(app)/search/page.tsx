"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, History, TrendingUp, Music2, Users, Disc3, ListMusic } from "lucide-react";
import { TrackTable } from "@/components/music/TrackTable";
import { ArtistCard } from "@/components/music/ArtistCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { searchAll, mockGenres } from "@/data";
import type { Track, Artist, Album, Playlist } from "@/types/music";
import { cn } from "@/lib/utils";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlParam = searchParams.get("q") || searchParams.get("genre") || "";
  const [query, setQuery] = useState(urlParam);
  const [activeTab, setActiveTab] = useState<"all" | "tracks" | "artists" | "albums" | "playlists">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
  } | null>(null);

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

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/catalog/search?q=${encodeURIComponent(query.trim())}&limit=20`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSearchResults({
              tracks: json.data.tracks || [],
              artists: json.data.artists || [],
              albums: json.data.albums || [],
              playlists: json.data.playlists || [],
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("API search error, falling back to local index:", err);
      }

      // Fallback
      setSearchResults(searchAll(query.trim()));
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (searchResults) return searchResults;
    if (query.trim()) return searchAll(query.trim());
    return { tracks: [], artists: [], albums: [], playlists: [] };
  }, [searchResults, query]);

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
    setSearchResults(null);
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
                        className="p-0.5 rounded-full hover:bg-white/10 text-[#71717A] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingQueries.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelectQuery(item)}
                    className="px-3 py-1.5 rounded-full bg-[#17171F] border border-white/5 text-xs text-[#F5F5F7] hover:border-purple-500/40 hover:bg-purple-600/10 transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Categorized Filter Tabs (Only during active search) */}
      {isSearching && (
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 overflow-x-auto no-scrollbar">
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
                "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all",
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-white/[0.04] text-[#A1A1AA] hover:text-white hover:bg-white/[0.08]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 3. Search Results State */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isSearching && totalResults === 0 ? (
        <EmptyState
          title={`No results found for "${query}"`}
          description="Check your spelling, explore by genre, or discover trending independent tracks on Explore."
          actionText="Explore Music"
          actionHref="/explore"
        />
      ) : isSearching ? (
        <div className="flex flex-col gap-10">
          {/* Top Result Card */}
          {activeTab === "all" && (results.tracks[0] || results.artists[0]) && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-80 shrink-0">
                <SectionHeader title="Top Result" />
                {results.artists[0] ? (
                  <div className="p-5 rounded-2xl bg-[#17171F] border border-white/5 flex flex-col gap-4">
                    <ArtistCard artist={results.artists[0]} />
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#17171F] border border-white/5 flex flex-col gap-4">
                    <TrackTable tracks={results.tracks.slice(0, 1)} />
                  </div>
                )}
              </div>

              {results.tracks.length > 0 && (
                <div className="flex-1">
                  <SectionHeader title="Matching Songs" />
                  <TrackTable tracks={results.tracks.slice(0, 4)} />
                </div>
              )}
            </div>
          )}

          {/* Tracks Section */}
          {(activeTab === "all" || activeTab === "tracks") && results.tracks.length > 0 && (
            <section>
              <SectionHeader
                title="Songs"
                subtitle={`${results.tracks.length} matching independent tracks`}
              />
              <TrackTable tracks={results.tracks} />
            </section>
          )}

          {/* Artists Section */}
          {(activeTab === "all" || activeTab === "artists") && results.artists.length > 0 && (
            <section>
              <SectionHeader
                title="Artists"
                subtitle={`${results.artists.length} matching independent creators`}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {(activeTab === "all" || activeTab === "albums") && results.albums.length > 0 && (
            <section>
              <SectionHeader
                title="Albums & EPs"
                subtitle={`${results.albums.length} releases found`}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}

          {/* Playlists Section */}
          {(activeTab === "all" || activeTab === "playlists") && results.playlists.length > 0 && (
            <section>
              <SectionHeader
                title="Playlists"
                subtitle={`${results.playlists.length} curated mixes found`}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Empty Query State — Browse All Genres */
        <section className="pt-4">
          <SectionHeader
            title="Browse All Genres & Moods"
            subtitle="Dive directly into soundscapes"
            href="/explore"
            linkText="View All"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {mockGenres.slice(0, 12).map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleSelectQuery(genre.name)}
                className="group relative h-28 rounded-2xl p-4 text-left overflow-hidden flex flex-col justify-end transition-all hover:scale-[1.02] border border-white/5"
                style={{
                  background: `linear-gradient(135deg, ${genre.color}25 0%, #17171F 100%)`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ backgroundColor: genre.color }}
                />
                <span className="relative z-10 text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {genre.name}
                </span>
                <span className="relative z-10 text-[10px] text-[#A1A1AA]">
                  Explore
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
    <Suspense
      fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
