"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Plus, Check, MoreHorizontal } from "lucide-react";
import { Track } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { AudioVisualizer } from "./AudioVisualizer";
import { formatTime, cn } from "@/lib/utils";

interface TrackRowProps {
  track: Track;
  index: number;
  contextTracks?: Track[];
  showAlbum?: boolean;
  showCover?: boolean;
  playlistId?: string; // if rendered inside a playlist, allow removal
  className?: string;
}

export function TrackRow({
  track,
  index,
  contextTracks,
  showAlbum = true,
  showCover = true,
  playlistId,
  className,
}: TrackRowProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const isTrackLiked = useLibraryStore((s) => s.isTrackLiked);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);
  const removeTrackFromPlaylist = useLibraryStore(
    (s) => s.removeTrackFromPlaylist
  );
  const playlists = useLibraryStore((s) => s.playlists);
  const addTrackToPlaylist = useLibraryStore((s) => s.addTrackToPlaylist);

  const [addedFeedback, setAddedFeedback] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const liked = isTrackLiked(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, contextTracks);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeTrack(track.id);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      onClick={handleRowClick}
      className={cn(
        "group relative flex items-center justify-between px-3 md:px-4 py-2.5 rounded-lg transition-colors cursor-pointer select-none",
        isCurrent
          ? "bg-purple-950/30 text-purple-300 hover:bg-purple-950/40"
          : "hover:bg-white/[0.05] text-[#F5F5F7]",
        className
      )}
    >
      {/* Left: Index / Play Button & Title */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
        {/* Index / Play / Visualizer */}
        <div className="w-6 flex items-center justify-center shrink-0 text-xs text-[#71717A]">
          {isThisPlaying ? (
            <div className="flex items-center justify-center">
              <AudioVisualizer isPlaying={isPlaying} />
            </div>
          ) : (
            <>
              <span className="group-hover:hidden font-medium">
                {index + 1}
              </span>
              <button
                type="button"
                aria-label="Play"
                className="hidden group-hover:flex items-center justify-center text-white"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Artwork with explicit relative position */}
        {showCover && (
          <div
            className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-[#17171F]"
            style={{ position: "relative" }}
          >
            <Image
              src={track.coverUrl}
              alt={track.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        )}

        {/* Title & Artist */}
        <div className="flex flex-col min-w-0 pr-2">
          <span
            className={cn(
              "text-sm font-semibold truncate",
              isCurrent ? "text-purple-300" : "text-[#F5F5F7] group-hover:text-white"
            )}
          >
            {track.title}
          </span>
          <Link
            href={`/artist/${track.artistId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-[#A1A1AA] hover:text-white hover:underline truncate"
          >
            {track.artistName}
          </Link>
        </div>
      </div>

      {/* Middle: Album (Hidden on mobile) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 px-4">
          <Link
            href={`/album/${track.albumId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-[#A1A1AA] hover:text-white hover:underline truncate block"
          >
            {track.albumTitle}
          </Link>
        </div>
      )}

      {/* Right: Actions & Duration */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Like Button */}
        <button
          onClick={handleLike}
          aria-label={liked ? "Unlike" : "Like"}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            liked
              ? "text-purple-400 opacity-100"
              : "text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-purple-400")} />
        </button>

        {/* Add to Queue Button */}
        <button
          onClick={handleAddToQueue}
          aria-label="Add to queue"
          title="Add to queue"
          className="p-1.5 rounded-full text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-white transition-all"
        >
          {addedFeedback ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>

        {/* Duration */}
        <span className="text-xs font-mono text-[#71717A] w-10 text-right">
          {formatTime(track.duration)}
        </span>

        {/* More Actions Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={handleToggleMenu}
            aria-label="More options"
            className="p-1.5 rounded-full text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 z-50 w-48 rounded-xl bg-[#17171F] border border-white/10 shadow-2xl p-1.5 text-xs text-[#F5F5F7] animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  onClick={(e) => {
                    handleAddToQueue(e);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Queue
                </button>
                <button
                  onClick={(e) => {
                    handleLike(e);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {liked ? "Remove from Liked" : "Save to Liked Songs"}
                </button>

                {playlistId && (
                  <button
                    onClick={() => {
                      removeTrackFromPlaylist(playlistId, track.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-900/40 text-rose-300 flex items-center gap-2"
                  >
                    Remove from Playlist
                  </button>
                )}

                <div className="my-1 border-t border-white/10" />

                <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#71717A]">
                  Add to playlist
                </div>
                {playlists
                  .filter((p) => p.id !== "liked-songs")
                  .slice(0, 3)
                  .map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => {
                        addTrackToPlaylist(pl.id, track.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 truncate"
                    >
                      {pl.title}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
