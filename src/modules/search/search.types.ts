import type { Track, Artist, Album, Playlist } from "@/types/music";

export interface SearchResultsPayload {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  totalResults: number;
}
