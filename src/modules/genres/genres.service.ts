import { GenresRepository } from "./genres.repository";
import type { Genre } from "@/types/music";

export const GenresService = {
  async getGenres(): Promise<Genre[]> {
    return await GenresRepository.getAllGenres();
  },

  async getGenreBySlug(slug: string): Promise<Genre | null> {
    return await GenresRepository.getGenreBySlug(slug);
  },
};
