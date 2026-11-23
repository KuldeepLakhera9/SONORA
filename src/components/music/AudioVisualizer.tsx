"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
  barCount?: number;
}

export function AudioVisualizer({
  isPlaying,
  className,
  barCount = 4,
}: AudioVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-end gap-0.5 h-4 w-4", className)}>
      {bars.map((bar) => {
        const animClass =
          bar === 1
            ? "animate-wave-1"
            : bar === 2
            ? "animate-wave-2"
            : bar === 3
            ? "animate-wave-3"
            : "animate-wave-4";

        return (
          <span
            key={bar}
            className={cn(
              "w-0.5 bg-purple-400 rounded-full transition-all duration-300",
              isPlaying ? animClass : "h-1 opacity-40"
            )}
            style={{
              height: isPlaying ? undefined : "3px",
            }}
          />
        );
      })}
    </div>
  );
}
