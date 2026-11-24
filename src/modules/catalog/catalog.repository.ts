import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import {
  mockTracks,
  mockAlbums,
  mockGenres,
  getTrackById as getMockTrackById,
  getAlbumById as getMockAlbumById,
} from "@/data";
import type { Track, Album, Genre } from "@/types/music";
import type { CatalogTrackWithRelations, CatalogAlbumWithRelations } from "./catalog.types";

/**
 * Maps a Supabase DB track row with joined artist/album to the frontend Track model.
 */
function mapDbTrackToFrontend(row: CatalogTrackWithRelations): Track {
  return {
    id: row.id,
    title: row.title,
    artistId: row.artist_id,
    artistName: row.artists?.stage_name || "Unknown Artist",
    albumId: row.album_id || "",
    albumTitle: row.albums?.title || "Single",
    duration: row.duration_seconds,
    coverUrl: row.artwork_path || row.albums?.cover_image_path || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    audioUrl: row.audio_storage_path,
    genre: "Independent",
    releaseYear: new Date(row.release_date).getFullYear(),
    plays: 12450,
  };
}

/**
 * Maps a Supabase DB album row to the frontend Album model.
 */
function mapDbAlbumToFrontend(row: CatalogAlbumWithRelations): Album {
  return {
    id: row.id,
    title: row.title,
    artistId: row.artist_id,
    artistName: row.artists?.stage_name || "Unknown Artist",
    releaseYear: new Date(row.release_date).getFullYear(),
    coverUrl: row.cover_image_path || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    genre: "Independent",
    type: row.album_type === "EP" ? "EP" : row.album_type === "single" ? "Single" : "Album",
    trackIds: (row.tracks || []).map((t: { id: string }) => t.id),
    description: row.description || undefined,
  };
}

/**
 * Catalog Repository — Primary interface for published tracks, albums, and genres.
 * Operates against Supabase when configured, falling back gracefully to mock fixtures.
 */
export const CatalogRepository = {
  /**
   * Retrieves all verified, published tracks.
   * RLS automatically filters out unpublished or rights-unverified tracks.
   */
  async getPublishedTracks(): Promise<Track[]> {
    if (!isSupabaseConfigured()) {
      return mockTracks;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tracks")
        .select(`
          *,
          artists (id, stage_name, slug),
          albums (id, title, slug, cover_image_path)
        `)
        .eq("status", "published")
        .order("release_date", { ascending: false });

      if (error || !data || data.length === 0) {
        return mockTracks;
      }

      return (data as unknown as CatalogTrackWithRelations[]).map(mapDbTrackToFrontend);
    } catch {
      return mockTracks;
    }
  },

  /**
   * Retrieves a single published track by ID.
   */
  async getTrackById(id: string): Promise<Track | undefined> {
    if (!isSupabaseConfigured()) {
      return getMockTrackById(id);
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tracks")
        .select(`
          *,
          artists (id, stage_name, slug),
          albums (id, title, slug, cover_image_path)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return getMockTrackById(id);
      }

      return mapDbTrackToFrontend(data as unknown as CatalogTrackWithRelations);
    } catch {
      return getMockTrackById(id);
    }
  },

  /**
   * Retrieves all published albums.
   */
  async getPublishedAlbums(): Promise<Album[]> {
    if (!isSupabaseConfigured()) {
      return mockAlbums;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("albums")
        .select(`
          *,
          artists (id, stage_name, slug),
          tracks (id)
        `)
        .eq("status", "published")
        .order("release_date", { ascending: false });

      if (error || !data || data.length === 0) {
        return mockAlbums;
      }

      return (data as unknown as CatalogAlbumWithRelations[]).map(mapDbAlbumToFrontend);
    } catch {
      return mockAlbums;
    }
  },

  /**
   * Retrieves a single album by ID.
   */
  async getAlbumById(id: string): Promise<Album | undefined> {
    if (!isSupabaseConfigured()) {
      return getMockAlbumById(id);
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("albums")
        .select(`
          *,
          artists (id, stage_name, slug),
          tracks (id)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return getMockAlbumById(id);
      }

      return mapDbAlbumToFrontend(data as unknown as CatalogAlbumWithRelations);
    } catch {
      return getMockAlbumById(id);
    }
  },

  /**
   * Retrieves all genres.
   */
  async getGenres(): Promise<Genre[]> {
    if (!isSupabaseConfigured()) {
      return mockGenres;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("genres")
        .select("*")
        .order("name", { ascending: true });

      if (error || !data || data.length === 0) {
        return mockGenres;
      }

      return data.map((g, idx) => ({
        id: g.id,
        name: g.name,
        color: mockGenres[idx % mockGenres.length]?.color || "#8B5CF6",
        gradient: mockGenres[idx % mockGenres.length]?.gradient || "from-purple-900 to-indigo-950",
        coverUrl: g.image_path || mockGenres[idx % mockGenres.length]?.coverUrl || "",
        description: g.description || "",
      }));
    } catch {
      return mockGenres;
    }
  },
};
