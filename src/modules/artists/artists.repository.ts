import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { mockArtists, getArtistById as getMockArtistById } from "@/data";
import type { Artist } from "@/types/music";
import type { ArtistWithRelations } from "./artists.types";

function mapDbArtistToFrontend(row: ArtistWithRelations): Artist {
  return {
    id: row.id,
    name: row.stage_name,
    bio: row.biography || "",
    avatarUrl: row.profile_image_path || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    bannerUrl: row.cover_image_path || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80",
    genres: row.primary_genre ? [row.primary_genre] : ["Independent"],
    location: [row.region, row.country].filter(Boolean).join(", ") || "Global",
    monthlyListeners: 142000,
    followersCount: 38400,
    popularTrackIds: (row.tracks || []).slice(0, 5).map((t) => t.id),
    albumIds: (row.albums || []).map((a) => a.id),
    singleIds: [],
  };
}

/**
 * Artists Repository — Interface for artist profiles and related discographies.
 */
export const ArtistsRepository = {
  /**
   * Retrieves all verified artists.
   */
  async getVerifiedArtists(): Promise<Artist[]> {
    if (!isSupabaseConfigured()) {
      return mockArtists;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("artists")
        .select(`
          *,
          albums (id),
          tracks (id)
        `)
        .eq("verification_status", "verified")
        .order("stage_name", { ascending: true });

      if (error || !data || data.length === 0) {
        return mockArtists;
      }

      return (data as unknown as ArtistWithRelations[]).map(mapDbArtistToFrontend);
    } catch {
      return mockArtists;
    }
  },

  /**
   * Retrieves a single artist profile by ID or slug.
   */
  async getArtistById(id: string): Promise<Artist | undefined> {
    if (!isSupabaseConfigured()) {
      return getMockArtistById(id);
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("artists")
        .select(`
          *,
          albums (id),
          tracks (id)
        `)
        .or(`id.eq.${id},slug.eq.${id}`)
        .maybeSingle();

      if (error || !data) {
        return getMockArtistById(id);
      }

      return mapDbArtistToFrontend(data as unknown as ArtistWithRelations);
    } catch {
      return getMockArtistById(id);
    }
  },
};
