import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { mockPlaylists, getPlaylistById as getMockPlaylistById } from "@/data";
import type { Playlist } from "@/types/music";
import type { PlaylistWithTracks } from "./playlists.types";
import type { PlaylistInsert } from "@/types/database.types";

function mapDbPlaylistToFrontend(row: PlaylistWithTracks): Playlist {
  const sortedTracks = [...(row.playlist_tracks || [])].sort((a, b) => a.position - b.position);
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    coverUrl: row.cover_image_path || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    creatorName: row.profiles?.display_name || "SONORA Editorial",
    creatorAvatar: row.profiles?.avatar_path || undefined,
    trackIds: sortedTracks.map((pt) => pt.track_id),
    followersCount: 1420,
    isCurated: true,
  };
}

/**
 * Playlists Repository — Interface for curated and user playlists.
 */
export const PlaylistsRepository = {
  /**
   * Retrieves all public playlists.
   */
  async getPublicPlaylists(): Promise<Playlist[]> {
    if (!isSupabaseConfigured()) {
      return mockPlaylists;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("playlists")
        .select(`
          *,
          profiles (display_name, avatar_path),
          playlist_tracks (track_id, position)
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return mockPlaylists;
      }

      return (data as unknown as PlaylistWithTracks[]).map(mapDbPlaylistToFrontend);
    } catch {
      return mockPlaylists;
    }
  },

  /**
   * Retrieves a playlist by ID.
   */
  async getPlaylistById(id: string): Promise<Playlist | undefined> {
    if (!isSupabaseConfigured()) {
      return getMockPlaylistById(id);
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("playlists")
        .select(`
          *,
          profiles (display_name, avatar_path),
          playlist_tracks (track_id, position)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return getMockPlaylistById(id);
      }

      return mapDbPlaylistToFrontend(data as unknown as PlaylistWithTracks);
    } catch {
      return getMockPlaylistById(id);
    }
  },

  /**
   * Creates a new playlist for the authenticated user.
   */
  async createPlaylist(params: PlaylistInsert) {
    const supabase = createClient();
    return await supabase.from("playlists").insert(params).select().single();
  },

  /**
   * Adds a track to a playlist at a specific ordering position.
   */
  async addTrackToPlaylist(playlistId: string, trackId: string, position: number) {
    const supabase = createClient();
    return await supabase.from("playlist_tracks").insert({
      playlist_id: playlistId,
      track_id: trackId,
      position,
    });
  },

  /**
   * Removes a track from a playlist.
   */
  async removeTrackFromPlaylist(playlistId: string, trackId: string) {
    const supabase = createClient();
    return await supabase
      .from("playlist_tracks")
      .delete()
      .match({ playlist_id: playlistId, track_id: trackId });
  },
};
