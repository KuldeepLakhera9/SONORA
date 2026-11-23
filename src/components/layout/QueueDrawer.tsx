"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Play, Music } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { AudioVisualizer } from "@/components/music/AudioVisualizer";
import { formatTime } from "@/lib/utils";

export function QueueDrawer() {
  const isQueueOpen = usePlayerStore((s) => s.isQueueOpen);
  const setQueueOpen = usePlayerStore((s) => s.setQueueOpen);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queue = usePlayerStore((s) => s.queue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const playTrack = usePlayerStore((s) => s.playTrack);

  if (!isQueueOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={() => setQueueOpen(false)}
      />

      {/* Slide-over panel */}
      <aside className="fixed top-0 right-0 bottom-20 md:bottom-24 z-40 w-80 md:w-96 bg-[#111116] border-l border-white/[0.08] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#F5F5F7]">Play Queue</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono font-medium">
              {queue.length} up next
            </span>
          </div>

          <div className="flex items-center gap-1">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                aria-label="Clear queue"
                title="Clear queue"
                className="p-1.5 rounded-lg text-[#71717A] hover:text-rose-400 hover:bg-white/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setQueueOpen(false)}
              aria-label="Close queue"
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {/* NOW PLAYING CARD */}
          {currentTrack && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center justify-between">
                <span>Now Playing</span>
                <AudioVisualizer isPlaying={isPlaying} />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 shadow-sm">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#17171F]">
                  <Image
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-[#F5F5F7] truncate">
                    {currentTrack.title}
                  </span>
                  <Link
                    href={`/artist/${currentTrack.artistId}`}
                    onClick={() => setQueueOpen(false)}
                    className="text-xs text-[#A1A1AA] hover:text-white truncate"
                  >
                    {currentTrack.artistName}
                  </Link>
                </div>
                <span className="text-xs font-mono text-[#71717A]">
                  {formatTime(currentTrack.duration)}
                </span>
              </div>
            </div>
          )}

          {/* NEXT UP IN QUEUE */}
          <div className="flex-1 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2 flex items-center justify-between">
              <span>Next In Queue</span>
              {queue.length > 0 && (
                <span className="text-[10px] text-[#A1A1AA] lowercase">
                  auto-advances
                </span>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-white/10 text-[#71717A]">
                <Music className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Your queue is empty.</p>
                <p className="text-[11px] text-[#71717A] mt-1">
                  Click the + button on any track to add it here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
                  >
                    <div
                      onClick={() => playTrack(track, queue)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#17171F]">
                        <Image
                          src={track.coverUrl}
                          alt={track.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </div>
                      </div>

                      <div className="flex flex-col min-w-0 pr-1">
                        <span className="text-xs font-semibold text-[#F5F5F7] group-hover:text-purple-300 truncate">
                          {track.title}
                        </span>
                        <span className="text-[11px] text-[#A1A1AA] truncate">
                          {track.artistName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#71717A]">
                        {formatTime(track.duration)}
                      </span>
                      <button
                        onClick={() => removeFromQueue(track.id)}
                        aria-label="Remove from queue"
                        className="p-1 rounded text-[#71717A] opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
