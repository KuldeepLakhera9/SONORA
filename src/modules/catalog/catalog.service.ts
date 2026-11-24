import { TracksService } from "@/modules/tracks/tracks.service";
import { AlbumsService } from "@/modules/albums/albums.service";
import { ArtistsService } from "@/modules/artists/artists.service";
import { PlaylistsRepository } from "@/modules/playlists/playlists.repository";
import { GenresService } from "@/modules/genres/genres.service";
import { mockTracks, mockAlbums, mockArtists, mockPlaylists } from "@/data";
import type {
  HomePageDiscoveryData,
  ExplorePageDiscoveryData,
} from "./catalog.types";

export const CatalogService = {
  /**
   * Aggregates real database-backed sections for the Home / Discover page.
   */
  async getHomePageData(): Promise<HomePageDiscoveryData> {
    try {
      const [
        featuredTracks,
        trendingTracks,
        newAlbums,
        artists,
        publicPlaylists,
      ] = await Promise.all([
        TracksService.getFeaturedTracks(1),
        TracksService.getTrendingTracks(6),
        AlbumsService.getNewReleases(6),
        ArtistsService.getFeaturedArtists(6),
        PlaylistsRepository.getPublicPlaylists(),
      ]);

      const heroTrack = featuredTracks[0] || trendingTracks[0] || mockTracks[0];

      return {
        featuredHeroTrack: heroTrack,
        madeForYouTracks: trendingTracks.slice(0, 6).length > 0 ? trendingTracks.slice(0, 6) : mockTracks.slice(0, 6),
        trendingTracks: trendingTracks.length > 0 ? trendingTracks : mockTracks.slice(0, 6),
        newReleasesAlbums: newAlbums.length > 0 ? newAlbums : mockAlbums.slice(0, 6),
        hiddenGems: trendingTracks.slice(2, 8).length > 0 ? trendingTracks.slice(2, 8) : mockTracks.slice(6, 12),
        independentArtists: artists.length > 0 ? artists : mockArtists.slice(0, 6),
        popularPlaylists: publicPlaylists.length > 0 ? publicPlaylists.slice(0, 6) : mockPlaylists.slice(0, 6),
      };
    } catch {
      return {
        featuredHeroTrack: mockTracks[0],
        madeForYouTracks: mockTracks.slice(0, 6),
        trendingTracks: mockTracks.slice(0, 6),
        newReleasesAlbums: mockAlbums.slice(0, 6),
        hiddenGems: mockTracks.slice(6, 12),
        independentArtists: mockArtists.slice(0, 6),
        popularPlaylists: mockPlaylists.slice(0, 6),
      };
    }
  },

  /**
   * Aggregates real catalog data for the Explore page.
   */
  async getExplorePageData(): Promise<ExplorePageDiscoveryData> {
    try {
      const [genres, artists, playlists] = await Promise.all([
        GenresService.getGenres(),
        ArtistsService.getArtists(),
        PlaylistsRepository.getPublicPlaylists(),
      ]);

      return {
        genres,
        emergingArtists: artists.slice(0, 6),
        featuredCollections: playlists.slice(0, 4),
      };
    } catch {
      return {
        genres: [],
        emergingArtists: [],
        featuredCollections: [],
      };
    }
  },
};
