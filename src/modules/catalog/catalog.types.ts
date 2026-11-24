import type { DbTrack, DbAlbum, DbGenre, TrackRights } from "@/types/database.types";
import type { Track, Album, Genre } from "@/types/music";

export interface CatalogTrackWithRelations extends DbTrack {
  artists?: {
    id: string;
    stage_name: string;
    slug: string;
  } | null;
  albums?: {
    id: string;
    title: string;
    slug: string;
    cover_image_path: string | null;
  } | null;
  track_rights?: TrackRights[];
}

export interface CatalogAlbumWithRelations extends DbAlbum {
  artists?: {
    id: string;
    stage_name: string;
    slug: string;
  } | null;
  tracks?: DbTrack[];
}

export type TrackItem = Track;
export type AlbumItem = Album;
export type GenreItem = Genre;
