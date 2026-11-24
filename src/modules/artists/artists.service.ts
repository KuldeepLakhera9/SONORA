import { ArtistsRepository } from "./artists.repository";
import type { Artist } from "@/types/music";

export const ArtistsService = {
  async getArtists(): Promise<Artist[]> {
    return await ArtistsRepository.getVerifiedArtists();
  },

  async getArtistById(idOrSlug: string): Promise<Artist | null> {
    const artist = await ArtistsRepository.getArtistById(idOrSlug);
    return artist || null;
  },

  async getFeaturedArtists(limit = 6): Promise<Artist[]> {
    const all = await ArtistsRepository.getVerifiedArtists();
    return all.slice(0, limit);
  },
};
