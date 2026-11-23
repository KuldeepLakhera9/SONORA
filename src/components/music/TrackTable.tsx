import React from "react";
import { Track } from "@/types/music";
import { TrackRow } from "./TrackRow";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackTableProps {
  tracks: Track[];
  showAlbum?: boolean;
  showCover?: boolean;
  playlistId?: string;
  className?: string;
}

export function TrackTable({
  tracks,
  showAlbum = true,
  showCover = true,
  playlistId,
  className,
}: TrackTableProps) {
  if (tracks.length === 0) {
    return (
      <div className="py-12 text-center text-[#71717A] text-sm">
        No tracks available in this collection.
      </div>
    );
  }

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {/* Table Header */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-white/[0.06] text-xs font-medium uppercase tracking-wider text-[#71717A] mb-1 select-none">
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          <span className="w-6 text-center">#</span>
          <span>Title</span>
        </div>
        {showAlbum && (
          <div className="hidden md:block flex-1 px-4">
            <span>Album</span>
          </div>
        )}
        <div className="flex items-center gap-4 justify-end pr-8">
          <Clock className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-0.5">
        {tracks.map((track, idx) => (
          <TrackRow
            key={track.id}
            track={track}
            index={idx}
            contextTracks={tracks}
            showAlbum={showAlbum}
            showCover={showCover}
            playlistId={playlistId}
          />
        ))}
      </div>
    </div>
  );
}
