import type { Track, Album, Artist, Playlist, Genre } from "@/types/music";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PublicCatalogTrack {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  artistImageUrl: string | null;
  albumId: string | null;
  albumTitle: string | null;
  albumSlug: string | null;
  durationSeconds: number;
  artworkUrl: string;
  trackNumber: number | null;
  releaseDate: string;
  language: string;
  explicitContent: boolean;
  isFeatured: boolean;
  playCount: number;
}

export interface PublicCatalogAlbum {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  description: string | null;
  coverArtworkUrl: string;
  releaseDate: string;
  albumType: "album" | "EP" | "single" | "compilation";
  publishedTrackCount: number;
  totalPlayableDurationSeconds: number;
  tracks?: PublicCatalogTrack[];
}

export interface PublicCatalogArtist {
  id: string;
  stageName: string;
  slug: string;
  biography: string | null;
  profileArtworkUrl: string;
  coverArtworkUrl: string;
  country: string | null;
  region: string | null;
  primaryGenre: string | null;
  publishedTrackCount: number;
  publishedAlbumCount: number;
}

export interface HomePageDiscoveryData {
  featuredHeroTrack: Track;
  madeForYouTracks: Track[];
  trendingTracks: Track[];
  newReleasesAlbums: Album[];
  hiddenGems: Track[];
  independentArtists: Artist[];
  popularPlaylists: Playlist[];
}

export interface ExplorePageDiscoveryData {
  genres: Genre[];
  emergingArtists: Artist[];
  featuredCollections: Playlist[];
}

export interface CatalogTrackWithRelations {
  id: string;
  title: string;
  slug: string;
  artist_id: string;
  album_id: string | null;
  duration_seconds: number;
  artwork_path: string | null;
  audio_storage_path: string;
  release_date: string;
  artists?: { stage_name: string } | null;
  albums?: { title: string; cover_image_path: string | null } | null;
}

export interface CatalogAlbumWithRelations {
  id: string;
  title: string;
  artist_id: string;
  description: string | null;
  cover_image_path: string | null;
  release_date: string;
  album_type: string;
  artists?: { stage_name: string } | null;
  tracks?: { id: string }[] | null;
}
