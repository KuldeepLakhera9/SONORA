import type { UserLike, ArtistFollow, ListeningHistory } from "@/types/database.types";

export interface UserLibrarySummary {
  likedTrackIds: string[];
  followedArtistIds: string[];
  recentHistory: ListeningHistory[];
}

export type { UserLike, ArtistFollow, ListeningHistory };
