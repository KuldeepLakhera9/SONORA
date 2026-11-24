import { z } from "zod";

export const searchFilterSchema = z.object({
  q: z.string().max(100).default(""),
  type: z.enum(["all", "tracks", "artists", "albums", "playlists"]).default("all"),
  genre: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SearchFilterParams = z.infer<typeof searchFilterSchema>;
