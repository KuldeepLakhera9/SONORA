"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  ListMusic,
  Maximize2,
  Heart,
} from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { formatTime, cn } from "@/lib/utils";

export function BottomPlayer() {
  const router = useRouter();

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const queue = usePlayerStore((s) => s.queue);
  const isQueueOpen = usePlayerStore((s) => s.isQueueOpen);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const prevTrack = usePlayerStore((s) => s.prevTrack);
  const seek = usePlayerStore((s) => s.seek);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const toggleQueue = usePlayerStore((s) => s.toggleQueue);

  const isTrackLiked = useLibraryStore((s) => s.isTrackLiked);
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  if (!currentTrack) return null;

  const liked = isTrackLiked(currentTrack.id);
  const displayTime = isSeeking ? seekTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekTime(parseFloat(e.target.value));
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    setSeekTime(currentTime);
  };

  const handleSeekEnd = () => {
    seek(seekTime);
    setIsSeeking(false);
  };

  const handleExpand = () => {
    router.push("/now-playing");
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 md:h-24 px-3 md:px-6 glass-player flex items-center justify-between select-none">
      {/* LEFT SECTION: Track details & Like */}
      <div className="flex items-center gap-3 w-1/4 min-w-[150px] md:min-w-[220px]">
        {/* Cover thumbnail */}
        <div
          onClick={handleExpand}
          className="relative w-11 h-11 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0 bg-[#17171F] cursor-pointer group shadow-md"
        >
          <Image
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title and artist */}
        <div className="flex flex-col min-w-0 pr-1">
          <Link
            href={`/album/${currentTrack.albumId}`}
            className="text-xs md:text-sm font-semibold text-[#F5F5F7] hover:text-[#8B5CF6] transition-colors truncate"
            title={currentTrack.title}
          >
            {currentTrack.title}
          </Link>
          <Link
            href={`/artist/${currentTrack.artistId}`}
            className="text-[11px] md:text-xs text-[#A1A1AA] hover:text-white transition-colors truncate"
            title={currentTrack.artistName}
          >
            {currentTrack.artistName}
          </Link>
        </div>

        {/* Like Button */}
        <button
          onClick={() => toggleLikeTrack(currentTrack.id)}
          aria-label={liked ? "Unlike" : "Like"}
          className={cn(
            "p-1.5 rounded-full transition-colors shrink-0",
            liked
              ? "text-purple-400"
              : "text-[#71717A] hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4 md:w-5 md:h-5", liked && "fill-purple-400")} />
        </button>
      </div>

      {/* CENTER SECTION: Controls & Scrubbable Seek Bar */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-2 md:px-4">
        {/* Button Controls */}
        <div className="flex items-center gap-3 md:gap-6 mb-1 md:mb-1.5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            aria-label="Toggle Shuffle"
            title="Shuffle"
            className={cn(
              "p-1.5 rounded-full transition-colors hidden sm:block",
              isShuffle ? "text-purple-400" : "text-[#71717A] hover:text-white"
            )}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            onClick={prevTrack}
            aria-label="Previous Track"
            className="p-1.5 rounded-full text-[#A1A1AA] hover:text-white transition-transform active:scale-90"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center shadow-lg transition-all active:scale-95 hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            aria-label="Next Track"
            className="p-1.5 rounded-full text-[#A1A1AA] hover:text-white transition-transform active:scale-90"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeat}
            aria-label="Cycle Repeat"
            title={`Repeat: ${repeatMode}`}
            className={cn(
              "p-1.5 rounded-full transition-colors hidden sm:block",
              repeatMode !== "off" ? "text-purple-400" : "text-[#71717A] hover:text-white"
            )}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Progress seek bar */}
        <div className="flex items-center gap-2.5 w-full">
          <span className="text-[10px] md:text-xs font-mono text-[#71717A] w-9 text-right shrink-0">
            {formatTime(displayTime)}
          </span>

          <div className="relative flex-1 group flex items-center h-4 cursor-pointer">
            {/* Background bar */}
            <div className="w-full h-1 md:h-1.5 rounded-full bg-white/10 group-hover:h-2 transition-all overflow-hidden">
              <div
                className="h-full bg-purple-500 group-hover:bg-purple-400 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Native range input for accessible dragging */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={displayTime}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              aria-label="Seek track position"
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>

          <span className="text-[10px] md:text-xs font-mono text-[#71717A] w-9 shrink-0">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: Queue, Volume, Fullscreen, Demo Status */}
      <div className="flex items-center justify-end gap-2 md:gap-3.5 w-1/4 min-w-[150px] md:min-w-[220px]">
        {/* Demo playback indicator pill */}
        <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#A1A1AA]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Demo Audio</span>
        </div>

        {/* Queue Drawer toggle */}
        <button
          onClick={toggleQueue}
          aria-label="Toggle Queue"
          title="Play Queue"
          className={cn(
            "relative p-2 rounded-lg transition-colors",
            isQueueOpen
              ? "text-purple-400 bg-purple-950/40"
              : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
          )}
        >
          <ListMusic className="w-4 h-4 md:w-5 md:h-5" />
          {queue.length > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
              {queue.length}
            </span>
          )}
        </button>

        {/* Volume controls */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-[#A1A1AA] hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume slider"
            className="w-16 xl:w-20 h-1 rounded-full accent-purple-500 bg-white/15 cursor-pointer"
          />
        </div>

        {/* Expand Player */}
        <button
          onClick={handleExpand}
          aria-label="Expand player"
          title="Full Screen Player"
          className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
        >
          <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </footer>
  );
}
