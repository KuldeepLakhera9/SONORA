import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export const trackFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  genre: z.string().optional(),
  artistId: z.string().uuid().optional(),
  albumId: z.string().uuid().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "popular", "title", "duration"]).default("newest"),
});

export type TrackFilterParams = z.infer<typeof trackFilterSchema>;

export const albumFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  artistId: z.string().uuid().optional(),
  albumType: z.enum(["album", "EP", "single", "compilation"]).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "title"]).default("newest"),
});

export type AlbumFilterParams = z.infer<typeof albumFilterSchema>;

export const artistFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  genre: z.string().optional(),
  sort: z.enum(["name", "newest"]).default("name"),
});

export type ArtistFilterParams = z.infer<typeof artistFilterSchema>;
