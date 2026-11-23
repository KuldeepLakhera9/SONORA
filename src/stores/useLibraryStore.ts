import { create } from "zustand";
import { Playlist } from "@/types/music";
import { mockPlaylists } from "@/data/mock-playlists";

export interface LibraryState {
  likedTrackIds: string[];
  followedArtistIds: string[];
  savedAlbumIds: string[];
  playlists: Playlist[];
  recentlyPlayedTrackIds: string[];

  // Actions
  toggleLikeTrack: (trackId: string) => boolean;
  isTrackLiked: (trackId: string) => boolean;
  toggleFollowArtist: (artistId: string) => boolean;
  isArtistFollowed: (artistId: string) => boolean;
  toggleSaveAlbum: (albumId: string) => boolean;
  isAlbumSaved: (albumId: string) => boolean;
  createPlaylist: (title: string, description?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  recordRecentlyPlayed: (trackId: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  likedTrackIds: [
    "track-1",
    "track-2",
    "track-4",
    "track-6",
    "track-8",
    "track-10",
    "track-12",
    "track-15",
    "track-17",
  ],
  followedArtistIds: ["artist-1", "artist-3", "artist-6"],
  savedAlbumIds: ["album-1", "album-3", "album-4"],
  playlists: mockPlaylists,
  recentlyPlayedTrackIds: [
    "track-1",
    "track-2",
    "track-3",
    "track-7",
    "track-10",
    "track-14",
    "track-17",
  ],

  toggleLikeTrack: (trackId) => {
    const { likedTrackIds, playlists } = get();
    const isLiked = likedTrackIds.includes(trackId);
    const newLikedIds = isLiked
      ? likedTrackIds.filter((id) => id !== trackId)
      : [...likedTrackIds, trackId];

    // Keep the "Liked Songs" playlist in sync
    const updatedPlaylists = playlists.map((p) => {
      if (p.id === "liked-songs") {
        return { ...p, trackIds: newLikedIds };
      }
      return p;
    });

    set({ likedTrackIds: newLikedIds, playlists: updatedPlaylists });
    return !isLiked;
  },

  isTrackLiked: (trackId) => {
    return get().likedTrackIds.includes(trackId);
  },

  toggleFollowArtist: (artistId) => {
    const { followedArtistIds } = get();
    const isFollowed = followedArtistIds.includes(artistId);
    const newFollowed = isFollowed
      ? followedArtistIds.filter((id) => id !== artistId)
      : [...followedArtistIds, artistId];
    set({ followedArtistIds: newFollowed });
    return !isFollowed;
  },

  isArtistFollowed: (artistId) => {
    return get().followedArtistIds.includes(artistId);
  },

  toggleSaveAlbum: (albumId) => {
    const { savedAlbumIds } = get();
    const isSaved = savedAlbumIds.includes(albumId);
    const newSaved = isSaved
      ? savedAlbumIds.filter((id) => id !== albumId)
      : [...savedAlbumIds, albumId];
    set({ savedAlbumIds: newSaved });
    return !isSaved;
  },

  isAlbumSaved: (albumId) => {
    return get().savedAlbumIds.includes(albumId);
  },

  createPlaylist: (title, description = "Created on SONORA") => {
    const id = `user-playlist-${Date.now()}`;
    const newPlaylist: Playlist = {
      id,
      title: title.trim() || "My Playlist",
      description,
      coverUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      creatorName: "You",
      creatorAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      trackIds: [],
      followersCount: 0,
      isCurated: false,
      isUserCreated: true,
    };

    set((state) => ({ playlists: [newPlaylist, ...state.playlists] }));
    return newPlaylist;
  },

  deletePlaylist: (playlistId) => {
    if (playlistId === "liked-songs") return; // cannot delete liked songs
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== playlistId),
    }));
  },

  addTrackToPlaylist: (playlistId, trackId) => {
    set((state) => ({
      playlists: state.playlists.map((p) => {
        if (p.id === playlistId && !p.trackIds.includes(trackId)) {
          return { ...p, trackIds: [...p.trackIds, trackId] };
        }
        return p;
      }),
    }));
  },

  removeTrackFromPlaylist: (playlistId, trackId) => {
    set((state) => ({
      playlists: state.playlists.map((p) => {
        if (p.id === playlistId) {
          return { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) };
        }
        return p;
      }),
    }));
  },

  recordRecentlyPlayed: (trackId) => {
    const { recentlyPlayedTrackIds } = get();
    const updated = [trackId, ...recentlyPlayedTrackIds.filter((id) => id !== trackId)].slice(
      0,
      25
    );
    set({ recentlyPlayedTrackIds: updated });
  },
}));
