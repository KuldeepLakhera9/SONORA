"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";

/**
 * PlaybackTimer handles the simulated playback clock.
 * When isPlaying is active, it ticks every second, updates progress,
 * handles track endings, and logs recently played tracks.
 */
export function PlaybackTimer() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const tick = usePlayerStore((s) => s.tick);
  const recordRecentlyPlayed = useLibraryStore((s) => s.recordRecentlyPlayed);

  const lastTrackId = useRef<string | null>(null);

  useEffect(() => {
    if (currentTrack && currentTrack.id !== lastTrackId.current) {
      lastTrackId.current = currentTrack.id;
      recordRecentlyPlayed(currentTrack.id);
    }
  }, [currentTrack, recordRecentlyPlayed]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  return null;
}
