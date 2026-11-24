import type { DbPlaylist, PlaylistTrack, DbTrack } from "@/types/database.types";
import type { Playlist } from "@/types/music";

export interface PlaylistWithTracks extends DbPlaylist {
  playlist_tracks?: Array<PlaylistTrack & { tracks?: DbTrack | null }>;
  profiles?: {
    display_name: string;
    avatar_path: string | null;
  } | null;
}

export type PlaylistItem = Playlist;
