import { mockTracks } from "./mock-tracks";
import { mockArtists } from "./mock-artists";
import { mockAlbums } from "./mock-albums";
import { mockPlaylists } from "./mock-playlists";
import { mockGenres, mockMoods, mockActivities } from "./mock-genres-moods";
import { Track, Artist, Album, Playlist } from "@/types/music";

export {
  mockTracks,
  mockArtists,
  mockAlbums,
  mockPlaylists,
  mockGenres,
  mockMoods,
  mockActivities,
};

export function getTrackById(id: string): Track | undefined {
  return mockTracks.find((t) => t.id === id);
}

export function getTracksByIds(ids: string[]): Track[] {
  return ids
    .map((id) => mockTracks.find((t) => t.id === id))
    .filter((t): t is Track => t !== undefined);
}

export function getArtistById(id: string): Artist | undefined {
  return mockArtists.find((a) => a.id === id);
}

export function getAlbumById(id: string): Album | undefined {
  return mockAlbums.find((al) => al.id === id);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return mockPlaylists.find((p) => p.id === id);
}

export function getTracksByArtistId(artistId: string): Track[] {
  return mockTracks.filter((t) => t.artistId === artistId);
}

export function getAlbumsByArtistId(artistId: string): Album[] {
  return mockAlbums.filter((a) => a.artistId === artistId);
}

export function getFeaturedHeroTrack(): Track {
  return mockTracks[0]; // Ethereal Fjord by Aura Vance
}

export function searchAll(query: string): {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
} {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      tracks: mockTracks.slice(0, 8),
      artists: mockArtists.slice(0, 4),
      albums: mockAlbums.slice(0, 4),
      playlists: mockPlaylists.slice(0, 4),
    };
  }

  const tracks = mockTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artistName.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      (t.mood && t.mood.toLowerCase().includes(q))
  );

  const artists = mockArtists.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.genres.some((g) => g.toLowerCase().includes(q)) ||
      a.location.toLowerCase().includes(q)
  );

  const albums = mockAlbums.filter(
    (al) =>
      al.title.toLowerCase().includes(q) ||
      al.artistName.toLowerCase().includes(q) ||
      al.genre.toLowerCase().includes(q)
  );

  const playlists = mockPlaylists.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.creatorName.toLowerCase().includes(q)
  );

  return { tracks, artists, albums, playlists };
}
