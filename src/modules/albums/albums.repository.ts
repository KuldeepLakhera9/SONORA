import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { mockAlbums, mockTracks } from "@/data";
import type { AlbumFilterParams } from "@/modules/catalog/catalog.validation";
import type { PublicCatalogAlbum, PaginatedResult } from "@/modules/catalog/catalog.types";

export const AlbumsRepository = {
  /**
   * Retrieves all published albums by verified artists.
   */
  async getPublishedAlbums(params: AlbumFilterParams): Promise<PaginatedResult<PublicCatalogAlbum>> {
    if (!isSupabaseConfigured()) {
      let filtered = [...mockAlbums];
      if (params.artistId) {
        filtered = filtered.filter((a) => a.artistId === params.artistId);
      }
      if (params.albumType) {
        filtered = filtered.filter((a) => a.type.toLowerCase() === params.albumType?.toLowerCase());
      }

      const total = filtered.length;
      const start = (params.page - 1) * params.limit;
      const pageData = filtered.slice(start, start + params.limit);

      return {
        data: pageData.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.id,
          artistId: a.artistId,
          artistName: a.artistName,
          artistSlug: a.artistId,
          description: a.description || null,
          coverArtworkUrl: a.coverUrl,
          releaseDate: `${a.releaseYear}-01-01`,
          albumType: a.type === "EP" ? "EP" : a.type === "Single" ? "single" : "album",
          publishedTrackCount: a.trackIds.length,
          totalPlayableDurationSeconds: a.totalDuration || 1800,
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
        .from("albums")
        .select(`
          id,
          title,
          slug,
          description,
          cover_image_path,
          release_date,
          album_type,
          is_featured,
          artists!inner (id, stage_name, slug, verification_status),
          tracks (id, duration_seconds, status)
        `, { count: "exact" })
        .eq("status", "published")
        .eq("artists.verification_status", "verified");

      if (params.artistId) {
        query = query.eq("artist_id", params.artistId);
      }
      if (params.albumType) {
        query = query.eq("album_type", params.albumType);
      }
      if (params.featured !== undefined) {
        query = query.eq("is_featured", params.featured);
      }

      query = query.order("release_date", { ascending: false }).range(offset, offset + params.limit - 1);

      const { data, count, error } = await query;
      if (error || !data) throw error;

      return {
        data: data.map((row: any) => {
          // Calculate track count & duration strictly from published eligible tracks
          const publishedTracks = (row.tracks || []).filter((t: any) => t.status === "published");
          const totalDuration = publishedTracks.reduce((acc: number, t: any) => acc + (t.duration_seconds || 0), 0);

          return {
            id: row.id,
            title: row.title,
            slug: row.slug,
            artistId: row.artists.id,
            artistName: row.artists.stage_name,
            artistSlug: row.artists.slug,
            description: row.description,
            coverArtworkUrl: row.cover_image_path || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
            releaseDate: row.release_date,
            albumType: row.album_type,
            publishedTrackCount: publishedTracks.length,
            totalPlayableDurationSeconds: totalDuration,
          };
        }),
        pagination: {
          page: params.page,
          limit: params.limit,
          total: count ?? data.length,
          totalPages: Math.ceil((count ?? data.length) / params.limit) || 1,
        },
      };
    } catch {
      return {
        data: [],
        pagination: { page: params.page, limit: params.limit, total: 0, totalPages: 1 },
      };
    }
  },

  /**
   * Retrieves single album by ID or slug with its published tracks.
   */
  async getAlbumByIdOrSlug(idOrSlug: string): Promise<PublicCatalogAlbum | null> {
    if (!isSupabaseConfigured()) {
      const mock = mockAlbums.find((a) => a.id === idOrSlug);
      if (!mock) return null;
      return {
        id: mock.id,
        title: mock.title,
        slug: mock.id,
        artistId: mock.artistId,
        artistName: mock.artistName,
        artistSlug: mock.artistId,
        description: mock.description || null,
        coverArtworkUrl: mock.coverUrl,
        releaseDate: `${mock.releaseYear}-01-01`,
        albumType: mock.type === "EP" ? "EP" : mock.type === "Single" ? "single" : "album",
        publishedTrackCount: mock.trackIds.length,
        totalPlayableDurationSeconds: mock.totalDuration || 1800,
      };
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("albums")
        .select(`
          id,
          title,
          slug,
          description,
          cover_image_path,
          release_date,
          album_type,
          artists!inner (id, stage_name, slug, verification_status)
        `)
        .eq("status", "published")
        .eq("artists.verification_status", "verified")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (error || !data) return null;

      // Get eligible tracks in album
      const { data: tracksData } = await supabase
        .from("public_catalog_tracks")
        .select("*")
        .eq("album_id", data.id)
        .order("track_number", { ascending: true });

      const tracks = tracksData || [];
      const totalDuration = tracks.reduce((acc, t) => acc + (t.duration_seconds || 0), 0);

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        artistId: (data.artists as any).id,
        artistName: (data.artists as any).stage_name,
        artistSlug: (data.artists as any).slug,
        description: data.description,
        coverArtworkUrl: data.cover_image_path || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        releaseDate: data.release_date,
        albumType: data.album_type,
        publishedTrackCount: tracks.length,
        totalPlayableDurationSeconds: totalDuration,
        tracks: tracks.map((t) => ({
          id: t.id,
          title: t.title,
          slug: t.slug,
          artistId: t.artist_id,
          artistName: t.artist_name,
          artistSlug: t.artist_slug,
          artistImageUrl: t.artist_image_path,
          albumId: t.album_id,
          albumTitle: t.album_title,
          albumSlug: t.album_slug,
          durationSeconds: t.duration_seconds,
          artworkUrl: t.artwork_path || data.cover_image_path || "",
          trackNumber: t.track_number,
          releaseDate: t.release_date,
          language: t.language,
          explicitContent: t.explicit_content,
          isFeatured: t.is_featured,
          playCount: t.play_count,
        })),
      };
    } catch {
      return null;
    }
  },
};
