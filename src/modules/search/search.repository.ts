import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { searchAll } from "@/data";
import type { SearchFilterParams } from "./search.validation";
import type { SearchResultsPayload } from "./search.types";
import { TracksRepository } from "@/modules/tracks/tracks.repository";
import { mapCatalogTrackToMusicTrack } from "@/modules/tracks/tracks.service";
import { AlbumsRepository } from "@/modules/albums/albums.repository";
import { mapCatalogAlbumToMusicAlbum } from "@/modules/albums/albums.service";
import { ArtistsRepository } from "@/modules/artists/artists.repository";
import { PlaylistsRepository } from "@/modules/playlists/playlists.repository";

export const SearchRepository = {
  /**
   * Performs real database catalog search across tracks, artists, albums, and playlists.
   */
  async searchCatalog(params: SearchFilterParams): Promise<SearchResultsPayload> {
    const query = params.q.trim();

    if (!isSupabaseConfigured() || !query) {
      if (!query) {
        return { tracks: [], artists: [], albums: [], playlists: [], totalResults: 0 };
      }
      const mockResult = searchAll(query);
      return {
        tracks: mockResult.tracks.slice(0, params.limit),
        artists: mockResult.artists.slice(0, params.limit),
        albums: mockResult.albums.slice(0, params.limit),
        playlists: mockResult.playlists.slice(0, params.limit),
        totalResults:
          mockResult.tracks.length +
          mockResult.artists.length +
          mockResult.albums.length +
          mockResult.playlists.length,
      };
    }

    try {
      const supabase = createClient();

      // Execute unified search or parallel entity searches
      const [tracksRes, albumsRes, allArtists, allPlaylists] = await Promise.all([
        supabase
          .from("public_catalog_tracks")
          .select("*")
          .ilike("title", `%${query}%`)
          .limit(params.limit),
        supabase
          .from("albums")
          .select("*, artists!inner(id, stage_name, slug)")
          .eq("status", "published")
          .ilike("title", `%${query}%`)
          .limit(params.limit),
        ArtistsRepository.getVerifiedArtists(),
        PlaylistsRepository.getPublicPlaylists(),
      ]);

      const matchedTracks = (tracksRes.data || []).map((t) =>
        mapCatalogTrackToMusicTrack({
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
          artworkUrl: t.artwork_path || t.album_artwork_path || "",
          trackNumber: t.track_number,
          releaseDate: t.release_date,
          language: t.language,
          explicitContent: t.explicit_content,
          isFeatured: t.is_featured,
          playCount: t.play_count,
        })
      );

      const matchedAlbums = (albumsRes.data || []).map((a: any) =>
        mapCatalogAlbumToMusicAlbum({
          id: a.id,
          title: a.title,
          slug: a.slug,
          artistId: a.artists.id,
          artistName: a.artists.stage_name,
          artistSlug: a.artists.slug,
          description: a.description,
          coverArtworkUrl: a.cover_image_path || "",
          releaseDate: a.release_date,
          albumType: a.album_type,
          publishedTrackCount: 0,
          totalPlayableDurationSeconds: 0,
        })
      );

      const queryLower = query.toLowerCase();
      const matchedArtists = allArtists
        .filter((a) => a.name.toLowerCase().includes(queryLower))
        .slice(0, params.limit);

      const matchedPlaylists = allPlaylists
        .filter((p) => p.title.toLowerCase().includes(queryLower))
        .slice(0, params.limit);

      const totalResults =
        matchedTracks.length +
        matchedArtists.length +
        matchedAlbums.length +
        matchedPlaylists.length;

      return {
        tracks: matchedTracks,
        artists: matchedArtists,
        albums: matchedAlbums,
        playlists: matchedPlaylists,
        totalResults,
      };
    } catch {
      const mockResult = searchAll(query);
      return {
        tracks: mockResult.tracks.slice(0, params.limit),
        artists: mockResult.artists.slice(0, params.limit),
        albums: mockResult.albums.slice(0, params.limit),
        playlists: mockResult.playlists.slice(0, params.limit),
        totalResults:
          mockResult.tracks.length +
          mockResult.artists.length +
          mockResult.albums.length +
          mockResult.playlists.length,
      };
    }
  },
};
