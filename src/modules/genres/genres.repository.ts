import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { mockGenres } from "@/data";
import type { Genre } from "@/types/music";

export const GenresRepository = {
  /**
   * Retrieves all genres.
   */
  async getAllGenres(): Promise<Genre[]> {
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

  /**
   * Retrieves single genre by slug.
   */
  async getGenreBySlug(slug: string): Promise<Genre | null> {
    const all = await this.getAllGenres();
    return all.find((g) => g.name.toLowerCase() === slug.toLowerCase() || g.id === slug) || null;
  },
};
