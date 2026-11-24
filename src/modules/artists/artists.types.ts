import type { DbArtist, DbAlbum, DbTrack } from "@/types/database.types";
import type { Artist } from "@/types/music";

export interface ArtistWithRelations extends DbArtist {
  albums?: DbAlbum[];
  tracks?: DbTrack[];
}

export type ArtistItem = Artist;
