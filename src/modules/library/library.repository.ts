import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import type { ListeningHistoryInsert } from "@/types/database.types";

/**
 * Library Repository — Interface for user private library collections:
 * liked songs, followed artists, and playback history.
 */
export const LibraryRepository = {
  /**
   * Fetches liked track IDs for the current authenticated user.
   */
  async getLikedTrackIds(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_likes")
        .select("track_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return data.map((row) => row.track_id);
    } catch {
      return [];
    }
  },

  /**
   * Likes a track for the authenticated user.
   */
  async likeTrack(userId: string, trackId: string) {
    const supabase = createClient();
    return await supabase
      .from("user_likes")
      .insert({ user_id: userId, track_id: trackId });
  },

  /**
   * Unlikes a track for the authenticated user.
   */
  async unlikeTrack(userId: string, trackId: string) {
    const supabase = createClient();
    return await supabase
      .from("user_likes")
      .delete()
      .match({ user_id: userId, track_id: trackId });
  },

  /**
   * Fetches followed artist IDs for the current authenticated user.
   */
  async getFollowedArtistIds(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("artist_follows")
        .select("artist_id")
        .eq("user_id", userId);

      if (error || !data) return [];
      return data.map((row) => row.artist_id);
    } catch {
      return [];
    }
  },

  /**
   * Follows an artist.
   */
  async followArtist(userId: string, artistId: string) {
    const supabase = createClient();
    return await supabase
      .from("artist_follows")
      .insert({ user_id: userId, artist_id: artistId });
  },

  /**
   * Unfollows an artist.
   */
  async unfollowArtist(userId: string, artistId: string) {
    const supabase = createClient();
    return await supabase
      .from("artist_follows")
      .delete()
      .match({ user_id: userId, artist_id: artistId });
  },

  /**
   * Appends an event to the user's private listening history.
   */
  async recordPlay(params: ListeningHistoryInsert) {
    const supabase = createClient();
    return await supabase.from("listening_history").insert(params);
  },
};
