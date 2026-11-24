import { AlbumsRepository } from "./albums.repository";
import type { Album } from "@/types/music";
import type { AlbumFilterParams } from "@/modules/catalog/catalog.validation";
import type { PublicCatalogAlbum } from "@/modules/catalog/catalog.types";

export function mapCatalogAlbumToMusicAlbum(a: PublicCatalogAlbum): Album {
  return {
    id: a.id,
    title: a.title,
    artistId: a.artistId,
    artistName: a.artistName,
    releaseYear: new Date(a.releaseDate).getFullYear() || 2025,
    coverUrl: a.coverArtworkUrl,
    genre: "Independent",
    type: a.albumType === "EP" ? "EP" : a.albumType === "single" ? "Single" : "Album",
    trackIds: (a.tracks || []).map((t) => t.id),
    totalDuration: a.totalPlayableDurationSeconds,
    description: a.description || undefined,
  };
}

export const AlbumsService = {
  async getAlbums(params: AlbumFilterParams) {
    const result = await AlbumsRepository.getPublishedAlbums(params);
    return {
      items: result.data.map(mapCatalogAlbumToMusicAlbum),
      raw: result.data,
      pagination: result.pagination,
    };
  },

  async getAlbumById(idOrSlug: string): Promise<Album | null> {
    const raw = await AlbumsRepository.getAlbumByIdOrSlug(idOrSlug);
    if (!raw) return null;
    return mapCatalogAlbumToMusicAlbum(raw);
  },

  async getNewReleases(limit = 6): Promise<Album[]> {
    const res = await AlbumsRepository.getPublishedAlbums({
      page: 1,
      limit,
      sort: "newest",
    });
    return res.data.map(mapCatalogAlbumToMusicAlbum);
  },
};
