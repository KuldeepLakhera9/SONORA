import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { mockTracks } from "@/data";
import type { TrackFilterParams } from "@/modules/catalog/catalog.validation";
import type { PublicCatalogTrack, PaginatedResult } from "@/modules/catalog/catalog.types";

export const TracksRepository = {
  /**
   * Retrieves paginated public tracks that satisfy all catalog eligibility requirements.
   */
  async getEligibleTracks(params: TrackFilterParams): Promise<PaginatedResult<PublicCatalogTrack>> {
    if (!isSupabaseConfigured()) {
      let filtered = [...mockTracks];
      if (params.genre) {
        filtered = filtered.filter((t) => t.genre.toLowerCase() === params.genre?.toLowerCase());
      }
      if (params.artistId) {
        filtered = filtered.filter((t) => t.artistId === params.artistId);
      }
      if (params.albumId) {
        filtered = filtered.filter((t) => t.albumId === params.albumId);
      }

      const total = filtered.length;
      const start = (params.page - 1) * params.limit;
      const pageData = filtered.slice(start, start + params.limit);

      return {
        data: pageData.map((t) => ({
          id: t.id,
          title: t.title,
          slug: t.id,
          artistId: t.artistId,
          artistName: t.artistName,
          artistSlug: t.artistId,
          artistImageUrl: null,
          albumId: t.albumId,
          albumTitle: t.albumTitle,
          albumSlug: t.albumId,
          durationSeconds: t.duration,
          artworkUrl: t.coverUrl,
          trackNumber: 1,
          releaseDate: `${t.releaseYear}-01-01`,
          language: "en",
          explicitContent: false,
          isFeatured: true,
          playCount: t.plays,
        })),
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    }

    try {
      const supabase = createClient();
      const offset = (params.page - 1) * params.limit;

      let query = supabase
        .from("public_catalog_tracks")
        .select("*", { count: "exact" });

      if (params.artistId) {
        query = query.eq("artist_id", params.artistId);
      }
      if (params.albumId) {
        query = query.eq("album_id", params.albumId);
      }
      if (params.featured !== undefined) {
        query = query.eq("is_featured", params.featured);
      }

      // Ordering
      switch (params.sort) {
        case "popular":
          query = query.order("play_count", { ascending: false });
          break;
        case "title":
          query = query.order("title", { ascending: true });
          break;
        case "duration":
          query = query.order("duration_seconds", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("release_date", { ascending: false });
          break;
      }

      const { data, count, error } = await query.range(offset, offset + params.limit - 1);

      if (error || !data) {
        throw error || new Error("Failed to fetch tracks");
      }

      const total = count ?? data.length;

      return {
        data: data.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          artistId: row.artist_id,
          artistName: row.artist_name,
          artistSlug: row.artist_slug,
          artistImageUrl: row.artist_image_path,
          albumId: row.album_id,
          albumTitle: row.album_title,
          albumSlug: row.album_slug,
          durationSeconds: row.duration_seconds,
          artworkUrl: row.artwork_path || row.album_artwork_path || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
          trackNumber: row.track_number,
          releaseDate: row.release_date,
          language: row.language,
          explicitContent: row.explicit_content,
          isFeatured: row.is_featured,
          playCount: row.play_count,
        })),
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    } catch {
      // Return safe fallback in local development
      return {
        data: [],
        pagination: { page: params.page, limit: params.limit, total: 0, totalPages: 1 },
      };
    }
  },

  /**
   * Retrieves a single eligible track by ID or slug.
   */
  async getTrackByIdOrSlug(idOrSlug: string): Promise<PublicCatalogTrack | null> {
    if (!isSupabaseConfigured()) {
      const mock = mockTracks.find((t) => t.id === idOrSlug);
      if (!mock) return null;
      return {
        id: mock.id,
        title: mock.title,
        slug: mock.id,
        artistId: mock.artistId,
        artistName: mock.artistName,
        artistSlug: mock.artistId,
        artistImageUrl: null,
        albumId: mock.albumId,
        albumTitle: mock.albumTitle,
        albumSlug: mock.albumId,
        durationSeconds: mock.duration,
        artworkUrl: mock.coverUrl,
        trackNumber: 1,
        releaseDate: `${mock.releaseYear}-01-01`,
        language: "en",
        explicitContent: false,
        isFeatured: true,
        playCount: mock.plays,
      };
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("public_catalog_tracks")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        artistId: data.artist_id,
        artistName: data.artist_name,
        artistSlug: data.artist_slug,
        artistImageUrl: data.artist_image_path,
        albumId: data.album_id,
        albumTitle: data.album_title,
        albumSlug: data.album_slug,
        durationSeconds: data.duration_seconds,
        artworkUrl: data.artwork_path || data.album_artwork_path || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        trackNumber: data.track_number,
        releaseDate: data.release_date,
        language: data.language,
        explicitContent: data.explicit_content,
        isFeatured: data.is_featured,
        playCount: data.play_count,
      };
    } catch {
      return null;
    }
  },
};
