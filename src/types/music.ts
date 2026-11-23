export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string; // sample or simulated
  genre: string;
  releaseYear: number;
  plays: number;
  isLiked?: boolean;
  bpm?: number;
  mood?: string;
  lyrics?: string[];
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  genres: string[];
  location: string;
  monthlyListeners: number;
  followersCount: number;
  isFollowed?: boolean;
  popularTrackIds: string[];
  albumIds: string[];
  singleIds: string[];
  socials?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  releaseYear: number;
  coverUrl: string;
  genre: string;
  type: "Album" | "EP" | "Single";
  trackIds: string[];
  totalDuration?: number;
  description?: string;
  recordLabel?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  creatorName: string;
  creatorAvatar?: string;
  trackIds: string[];
  followersCount: number;
  isCurated?: boolean;
  moodTag?: string;
  isUserCreated?: boolean;
}

export interface Genre {
  id: string;
  name: string;
  color: string;
  gradient: string;
  coverUrl: string;
  description: string;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  coverUrl: string;
  description: string;
  recommendedTrackIds: string[];
}

export interface ActivityCollection {
  id: string;
  name: string;
  subtitle: string;
  coverUrl: string;
  trackIds: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: "release" | "playlist" | "recommendation";
  linkUrl?: string;
}
