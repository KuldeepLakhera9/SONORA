import type { Genre } from "@/types/music";

export interface GenreWithMetrics extends Genre {
  trackCount?: number;
  artistCount?: number;
}
