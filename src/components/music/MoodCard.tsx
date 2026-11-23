"use client";

import React from "react";
import { Play } from "lucide-react";
import { Mood } from "@/types/music";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { getTracksByIds } from "@/data";
import { cn } from "@/lib/utils";

interface MoodCardProps {
  mood: Mood;
  className?: string;
}

export function MoodCard({ mood, className }: MoodCardProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);

  const handlePlayMood = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const tracks = getTracksByIds(mood.recommendedTrackIds);
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div
      onClick={handlePlayMood}
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg overflow-hidden bg-gradient-to-br bg-[#17171F]/90",
        mood.gradient,
        className
      )}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-3xl mb-2 block">{mood.emoji}</span>
          <h3 className="text-base md:text-lg font-bold text-white">
            {mood.name}
          </h3>
          <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1 max-w-[85%]">
            {mood.description}
          </p>
        </div>

        <button
          onClick={handlePlayMood}
          aria-label={`Play ${mood.name} mix`}
          className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#8B5CF6] text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-105 active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </button>
      </div>

      <div className="relative z-10 mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A1A1AA]">
        <span>{mood.recommendedTrackIds.length} Curated Tracks</span>
        <span className="font-medium text-purple-400 group-hover:underline">
          Play Mix →
        </span>
      </div>
    </div>
  );
}
