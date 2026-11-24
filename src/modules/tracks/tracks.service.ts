import { TracksRepository } from "./tracks.repository";
import type { Track } from "@/types/music";
import type { TrackFilterParams } from "@/modules/catalog/catalog.validation";
import type { PublicCatalogTrack } from "@/modules/catalog/catalog.types";

export function mapCatalogTrackToMusicTrack(t: PublicCatalogTrack): Track {
  return {
    id: t.id,
    title: t.title,
    artistId: t.artistId,
    artistName: t.artistName,
    albumId: t.albumId || "",
    albumTitle: t.albumTitle || "Single",
    duration: t.durationSeconds,
    coverUrl: t.artworkUrl,
    genre: "Independent",
    releaseYear: new Date(t.releaseDate).getFullYear() || 2025,
    plays: t.playCount || 10000,
  };
}

export const TracksService = {
  async getTracks(params: TrackFilterParams) {
    const result = await TracksRepository.getEligibleTracks(params);
    return {
      items: result.data.map(mapCatalogTrackToMusicTrack),
      raw: result.data,
      pagination: result.pagination,
    };
  },

  async getTrackById(idOrSlug: string): Promise<Track | null> {
    const raw = await TracksRepository.getTrackByIdOrSlug(idOrSlug);
    if (!raw) return null;
    return mapCatalogTrackToMusicTrack(raw);
  },

  async getFeaturedTracks(limit = 6): Promise<Track[]> {
    const res = await TracksRepository.getEligibleTracks({
      page: 1,
      limit,
      featured: true,
      sort: "popular",
    });
    return res.data.map(mapCatalogTrackToMusicTrack);
  },

  async getTrendingTracks(limit = 6): Promise<Track[]> {
    const res = await TracksRepository.getEligibleTracks({
      page: 1,
      limit,
      sort: "popular",
    });
    return res.data.map(mapCatalogTrackToMusicTrack);
  },

  async getNewReleases(limit = 6): Promise<Track[]> {
    const res = await TracksRepository.getEligibleTracks({
      page: 1,
      limit,
      sort: "newest",
    });
    return res.data.map(mapCatalogTrackToMusicTrack);
  },
};
