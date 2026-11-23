"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  Plus,
  LayoutGrid,
  List,
  Search,
  Bookmark,
  Disc3,
  UserCheck,
  History,
  Music2,
} from "lucide-react";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { getTracksByIds, mockAlbums, mockArtists } from "@/data";
import { TrackTable } from "@/components/music/TrackTable";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CreatePlaylistModal } from "@/components/ui/CreatePlaylistModal";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<
    "playlists" | "liked" | "albums" | "artists" | "recent"
  >("playlists");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playlists = useLibraryStore((s) => s.playlists);
  const likedTrackIds = useLibraryStore((s) => s.likedTrackIds);
  const followedArtistIds = useLibraryStore((s) => s.followedArtistIds);
  const savedAlbumIds = useLibraryStore((s) => s.savedAlbumIds);
  const recentlyPlayedIds = useLibraryStore((s) => s.recentlyPlayedTrackIds);

  const likedTracks = useMemo(
    () => getTracksByIds(likedTrackIds),
    [likedTrackIds]
  );
  const recentTracks = useMemo(
    () => getTracksByIds(recentlyPlayedIds),
    [recentlyPlayedIds]
  );
  const followedArtists = useMemo(
    () => mockArtists.filter((a) => followedArtistIds.includes(a.id)),
    [followedArtistIds]
  );
  const savedAlbums = useMemo(
    () => mockAlbums.filter((al) => savedAlbumIds.includes(al.id)),
    [savedAlbumIds]
  );

  // Filtered lists
  const filteredPlaylists = useMemo(() => {
    return playlists.filter((p) =>
      p.title.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [playlists, searchFilter]);

  const filteredLikedTracks = useMemo(() => {
    return likedTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.artistName.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [likedTracks, searchFilter]);

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Bookmark className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#F5F5F7]">
              Your Sonic Library
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#A1A1AA]">
            Personal collection, liked master recordings, and followed creators.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all self-start md:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* 2. Library Navigation Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "playlists", label: `Playlists (${playlists.length})` },
            { id: "liked", label: `Liked Songs (${likedTrackIds.length})` },
            { id: "albums", label: `Albums (${savedAlbums.length})` },
            { id: "artists", label: `Artists (${followedArtists.length})` },
            { id: "recent", label: `Recently Played (${recentTracks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search within library & View Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#17171F] border border-white/10 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center rounded-xl bg-[#17171F] p-1 border border-white/5">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors",
                viewMode === "grid"
                  ? "bg-white/10 text-white"
                  : "text-[#71717A] hover:text-white"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors",
                viewMode === "list"
                  ? "bg-white/10 text-white"
                  : "text-[#71717A] hover:text-white"
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Tab Contents */}

      {/* PLAYLISTS TAB */}
      {activeTab === "playlists" && (
        <div>
          {filteredPlaylists.length === 0 ? (
            <EmptyState
              icon={Music2}
              title="No playlists found"
              description="You have not created any custom playlists matching this name yet."
              actionText="Create Playlist"
              onAction={() => setIsModalOpen(true)}
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredPlaylists.map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredPlaylists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/playlist/${pl.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                      {pl.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {pl.title}
                      </span>
                      <span className="text-xs text-[#A1A1AA]">
                        By {pl.creatorName} • {pl.trackIds.length} tracks
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-purple-400 font-medium">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIKED SONGS TAB */}
      {activeTab === "liked" && (
        <div>
          {filteredLikedTracks.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No liked songs yet"
              description="Click the heart icon on any track, album, or player to build your personal sanctuary."
              actionText="Discover Songs"
              actionHref="/home"
            />
          ) : (
            <TrackTable tracks={filteredLikedTracks} />
          )}
        </div>
      )}

      {/* SAVED ALBUMS TAB */}
      {activeTab === "albums" && (
        <div>
          {savedAlbums.length === 0 ? (
            <EmptyState
              icon={Disc3}
              title="No saved albums"
              description="Save your favorite independent albums to access their full tracklists in one click."
              actionText="Explore Releases"
              actionHref="/explore"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {savedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOLLOWED ARTISTS TAB */}
      {activeTab === "artists" && (
        <div>
          {followedArtists.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="No followed artists"
              description="Follow independent artists to stay updated on new lossless releases and intimate acoustic sessions."
              actionText="Browse Artists"
              actionHref="/explore"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {followedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECENTLY PLAYED TAB */}
      {activeTab === "recent" && (
        <div>
          {recentTracks.length === 0 ? (
            <EmptyState
              icon={History}
              title="No recent playback history"
              description="Tracks you play across SONORA will automatically appear here."
              actionText="Start Listening"
              actionHref="/home"
            />
          ) : (
            <TrackTable tracks={recentTracks} />
          )}
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
