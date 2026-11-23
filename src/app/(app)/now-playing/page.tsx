"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Heart,
  ListMusic,
  Mic2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { mockTracks } from "@/data/mock-tracks";
import { MusicCard } from "@/components/music/MusicCard";
import { SectionHeader } from "@/components/music/SectionHeader";
import { AudioVisualizer } from "@/components/music/AudioVisualizer";
import { formatTime, cn } from "@/lib/utils";

export default function NowPlayingPage() {
  const router = useRouter();

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);

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

  const [activeTab, setActiveTab] = useState<"player" | "lyrics">("player");
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  if (!currentTrack) {
    return (
      <div className="py-20 text-center text-[#A1A1AA]">
        No track currently selected.
      </div>
    );
  }

  const liked = isTrackLiked(currentTrack.id);
  const displayTime = isSeeking ? seekTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const relatedTracks = mockTracks
    .filter((t) => t.id !== currentTrack.id && (t.genre === currentTrack.genre || t.artistId === currentTrack.artistId))
    .slice(0, 4);

  return (
    <div className="relative flex flex-col items-center max-w-4xl mx-auto py-4 md:py-8 pb-16">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full bg-purple-600/25 filter blur-3xl pointer-events-none -z-10" />

      {/* Top back bar */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>

        {/* Tab switcher: Player vs Lyrics */}
        <div className="flex items-center rounded-full bg-[#17171F] p-1 border border-white/5">
          <button
            onClick={() => setActiveTab("player")}
            className={cn(
              "px-4 py-1 rounded-full text-xs font-semibold transition-colors",
              activeTab === "player"
                ? "bg-purple-600 text-white"
                : "text-[#A1A1AA] hover:text-white"
            )}
          >
            Artwork
          </button>
          <button
            onClick={() => setActiveTab("lyrics")}
            className={cn(
              "inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-semibold transition-colors",
              activeTab === "lyrics"
                ? "bg-purple-600 text-white"
                : "text-[#A1A1AA] hover:text-white"
            )}
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>
        </div>

        <button
          onClick={toggleQueue}
          aria-label="Toggle queue"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ListMusic className="w-4 h-4" />
        </button>
      </div>

      {/* Central View: Player or Lyrics */}
      {activeTab === "player" ? (
        <div className="w-full flex flex-col items-center">
          {/* Large Artwork with Shadow and explicit relative position */}
          <div
            className="relative aspect-square w-64 sm:w-80 md:w-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8 bg-[#17171F] group"
            style={{ position: "relative" }}
          >
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              fill
              sizes="(max-width: 768px) 320px, 400px"
              className={cn(
                "object-cover transition-transform duration-700",
                isPlaying ? "scale-100" : "scale-95 opacity-80"
              )}
              priority
            />
            {/* Live Visualizer badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-semibold text-purple-300">
              <AudioVisualizer isPlaying={isPlaying} />
              <span>{isPlaying ? "Simulated Lossless" : "Paused"}</span>
            </div>
          </div>

          {/* Track Metadata */}
          <div className="w-full flex items-center justify-between mb-6 px-2">
            <div className="flex flex-col min-w-0 pr-4">
              <h1 className="text-2xl md:text-3xl font-black text-[#F5F5F7] truncate">
                {currentTrack.title}
              </h1>
              <Link
                href={`/artist/${currentTrack.artistId}`}
                className="text-base text-purple-400 hover:text-purple-300 font-medium truncate mt-1"
              >
                {currentTrack.artistName}
              </Link>
              <Link
                href={`/album/${currentTrack.albumId}`}
                className="text-xs text-[#71717A] hover:underline mt-0.5 truncate"
              >
                {currentTrack.albumTitle} • {currentTrack.genre}
              </Link>
            </div>

            <button
              onClick={() => toggleLikeTrack(currentTrack.id)}
              aria-label={liked ? "Unlike" : "Like"}
              className={cn(
                "p-3 rounded-full border transition-all active:scale-90",
                liked
                  ? "bg-purple-600/20 text-purple-400 border-purple-500/40"
                  : "bg-white/5 text-[#A1A1AA] hover:text-white border-white/10"
              )}
            >
              <Heart className={cn("w-6 h-6", liked && "fill-purple-400")} />
            </button>
          </div>
        </div>
      ) : (
        /* Lyrics view */
        <div className="w-full max-w-lg min-h-[380px] p-6 rounded-3xl bg-[#17171F] border border-white/10 mb-8 flex flex-col justify-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-6 flex items-center justify-center gap-1.5">
            <Mic2 className="w-4 h-4" />
            <span>Interactive Lyrics Preview</span>
          </div>
          <div className="flex flex-col gap-4 text-base md:text-lg font-medium leading-relaxed">
            {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
              currentTrack.lyrics.map((line, idx) => (
                <p
                  key={idx}
                  className={cn(
                    "transition-colors",
                    idx === 0 || idx === 1
                      ? "text-white font-bold text-lg md:text-xl scale-105"
                      : "text-[#71717A] hover:text-[#A1A1AA]"
                  )}
                >
                  {line}
                </p>
              ))
            ) : (
              <p className="text-[#71717A]">
                Instrumental arrangement — no vocals recorded for this master.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Scrubbable Seek Bar */}
      <div className="w-full flex flex-col gap-2 mb-6">
        <div className="relative group flex items-center h-4 cursor-pointer">
          <div className="w-full h-1.5 rounded-full bg-white/10 group-hover:h-2 transition-all overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={displayTime}
            onMouseDown={() => {
              setIsSeeking(true);
              setSeekTime(currentTime);
            }}
            onTouchStart={() => {
              setIsSeeking(true);
              setSeekTime(currentTime);
            }}
            onChange={(e) => setSeekTime(parseFloat(e.target.value))}
            onMouseUp={() => {
              seek(seekTime);
              setIsSeeking(false);
            }}
            onTouchEnd={() => {
              seek(seekTime);
              setIsSeeking(false);
            }}
            aria-label="Seek track"
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#71717A]">
          <span>{formatTime(displayTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Large Controls */}
      <div className="flex items-center justify-center gap-6 md:gap-8 mb-10">
        <button
          onClick={toggleShuffle}
          aria-label="Toggle Shuffle"
          className={cn(
            "p-2.5 rounded-full transition-colors",
            isShuffle ? "text-purple-400 bg-purple-500/10" : "text-[#71717A] hover:text-white"
          )}
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={prevTrack}
          aria-label="Previous Track"
          className="p-3 rounded-full text-white hover:text-purple-400 transition-transform active:scale-90"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-1" />
          )}
        </button>

        <button
          onClick={nextTrack}
          aria-label="Next Track"
          className="p-3 rounded-full text-white hover:text-purple-400 transition-transform active:scale-90"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>

        <button
          onClick={cycleRepeat}
          aria-label="Cycle Repeat"
          className={cn(
            "p-2.5 rounded-full transition-colors",
            repeatMode !== "off"
              ? "text-purple-400 bg-purple-500/10"
              : "text-[#71717A] hover:text-white"
          )}
        >
          {repeatMode === "one" ? (
            <Repeat1 className="w-5 h-5" />
          ) : (
            <Repeat className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Volume Slider in full view */}
      <div className="flex items-center gap-3 w-64 mb-12">
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="text-[#71717A] hover:text-white"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
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
          aria-label="Volume"
          className="w-full h-1.5 rounded-full accent-purple-500 bg-white/10 cursor-pointer"
        />
      </div>

      {/* Related Tracks */}
      {relatedTracks.length > 0 && (
        <div className="w-full pt-8 border-t border-white/[0.08]">
          <SectionHeader
            title="Recommended Next"
            subtitle={`More independent ${currentTrack.genre}`}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedTracks.map((t) => (
              <MusicCard key={t.id} track={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
