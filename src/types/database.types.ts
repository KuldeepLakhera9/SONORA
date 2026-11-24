/**
 * SONORA — Complete Supabase Database TypeScript Definitions
 * 
 * Auto-generated schema definitions matching PostgreSQL migrations:
 * - 20261124000001_initial_schema.sql
 * - 20261124000002_indexes_and_constraints.sql
 * - 20261124000003_rls_policies.sql
 * - 20261124000004_storage_configuration.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "listener" | "artist" | "moderator" | "admin";
export type VerificationStatus = "pending" | "verified" | "rejected" | "expired";
export type AlbumType = "album" | "EP" | "single" | "compilation";
export type AlbumStatus = "draft" | "published" | "archived";
export type TrackStatus = "draft" | "pending_review" | "published" | "rejected" | "suspended";
export type SubmissionStatus = "submitted" | "under_review" | "approved" | "rejected" | "changes_requested";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_path: string | null;
          bio: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_path?: string | null;
          bio?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_path?: string | null;
          bio?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      artists: {
        Row: {
          id: string;
          owner_user_id: string | null;
          stage_name: string;
          slug: string;
          biography: string | null;
          profile_image_path: string | null;
          cover_image_path: string | null;
          country: string | null;
          region: string | null;
          primary_genre: string | null;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id?: string | null;
          stage_name: string;
          slug: string;
          biography?: string | null;
          profile_image_path?: string | null;
          cover_image_path?: string | null;
          country?: string | null;
          region?: string | null;
          primary_genre?: string | null;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_user_id?: string | null;
          stage_name?: string;
          slug?: string;
          biography?: string | null;
          profile_image_path?: string | null;
          cover_image_path?: string | null;
          country?: string | null;
          region?: string | null;
          primary_genre?: string | null;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artists_owner_user_id_fkey";
            columns: ["owner_user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      genres: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_path?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      albums: {
        Row: {
          id: string;
          artist_id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image_path: string | null;
          release_date: string;
          album_type: AlbumType;
          status: AlbumStatus;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image_path?: string | null;
          release_date?: string;
          album_type?: AlbumType;
          status?: AlbumStatus;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image_path?: string | null;
          release_date?: string;
          album_type?: AlbumType;
          status?: AlbumStatus;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey";
            columns: ["artist_id"];
            referencedRelation: "artists";
            referencedColumns: ["id"];
          }
        ];
      };

      tracks: {
        Row: {
          id: string;
          artist_id: string;
          album_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          duration_seconds: number;
          audio_storage_path: string;
          artwork_path: string | null;
          track_number: number | null;
          release_date: string;
          language: string;
          explicit_content: boolean;
          status: TrackStatus;
          is_featured: boolean;
          play_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          album_id?: string | null;
          title: string;
          slug: string;
          description?: string | null;
          duration_seconds: number;
          audio_storage_path: string;
          artwork_path?: string | null;
          track_number?: number | null;
          release_date?: string;
          language?: string;
          explicit_content?: boolean;
          status?: TrackStatus;
          is_featured?: boolean;
          play_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          album_id?: string | null;
          title?: string;
          slug?: string;
          description?: string | null;
          duration_seconds?: number;
          audio_storage_path?: string;
          artwork_path?: string | null;
          track_number?: number | null;
          release_date?: string;
          language?: string;
          explicit_content?: boolean;
          status?: TrackStatus;
          is_featured?: boolean;
          play_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tracks_artist_id_fkey";
            columns: ["artist_id"];
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tracks_album_id_fkey";
            columns: ["album_id"];
            referencedRelation: "albums";
            referencedColumns: ["id"];
          }
        ];
      };

      track_genres: {
        Row: {
          track_id: string;
          genre_id: string;
          created_at: string;
        };
        Insert: {
          track_id: string;
          genre_id: string;
          created_at?: string;
        };
        Update: {
          track_id?: string;
          genre_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "track_genres_track_id_fkey";
            columns: ["track_id"];
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "track_genres_genre_id_fkey";
            columns: ["genre_id"];
            referencedRelation: "genres";
            referencedColumns: ["id"];
          }
        ];
      };

      track_rights: {
        Row: {
          id: string;
          track_id: string;
          rights_holder_name: string;
          source_name: string;
          source_url: string | null;
          license_type: string;
          license_url: string | null;
          attribution_text: string | null;
          commercial_use_allowed: boolean;
          streaming_allowed: boolean;
          redistribution_allowed: boolean;
          permission_evidence_path: string | null;
          verification_status: VerificationStatus;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          track_id: string;
          rights_holder_name: string;
          source_name: string;
          source_url?: string | null;
          license_type: string;
          license_url?: string | null;
          attribution_text?: string | null;
          commercial_use_allowed?: boolean;
          streaming_allowed?: boolean;
          redistribution_allowed?: boolean;
          permission_evidence_path?: string | null;
          verification_status?: VerificationStatus;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          track_id?: string;
          rights_holder_name?: string;
          source_name?: string;
          source_url?: string | null;
          license_type?: string;
          license_url?: string | null;
          attribution_text?: string | null;
          commercial_use_allowed?: boolean;
          streaming_allowed?: boolean;
          redistribution_allowed?: boolean;
          permission_evidence_path?: string | null;
          verification_status?: VerificationStatus;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "track_rights_track_id_fkey";
            columns: ["track_id"];
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "track_rights_verified_by_fkey";
            columns: ["verified_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      playlists: {
        Row: {
          id: string;
          owner_user_id: string;
          title: string;
          description: string | null;
          cover_image_path: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          title: string;
          description?: string | null;
          cover_image_path?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_user_id?: string;
          title?: string;
          description?: string | null;
          cover_image_path?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playlists_owner_user_id_fkey";
            columns: ["owner_user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      playlist_tracks: {
        Row: {
          id: string;
          playlist_id: string;
          track_id: string;
          position: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          track_id: string;
          position: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          playlist_id?: string;
          track_id?: string;
          position?: number;
          added_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey";
            columns: ["playlist_id"];
            referencedRelation: "playlists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey";
            columns: ["track_id"];
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          }
        ];
      };

      user_likes: {
        Row: {
          id: string;
          user_id: string;
          track_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          track_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          track_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_likes_track_id_fkey";
            columns: ["track_id"];
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          }
        ];
      };

      listening_history: {
        Row: {
          id: string;
          user_id: string;
          track_id: string;
          played_at: string;
          listened_duration_seconds: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          track_id: string;
          played_at?: string;
          listened_duration_seconds?: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          track_id?: string;
          played_at?: string;
          listened_duration_seconds?: number;
          completed?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listening_history_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listening_history_track_id_fkey";
            columns: ["track_id"];
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          }
        ];
      };

      artist_follows: {
        Row: {
          id: string;
          user_id: string;
          artist_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artist_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artist_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artist_follows_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artist_follows_artist_id_fkey";
            columns: ["artist_id"];
            referencedRelation: "artists";
            referencedColumns: ["id"];
          }
        ];
      };

      upload_requests: {
        Row: {
          id: string;
          artist_id: string;
          submitted_by: string;
          track_id: string | null;
          submission_type: string;
          status: SubmissionStatus;
          review_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artist_id: string;
          submitted_by: string;
          track_id?: string | null;
          submission_type: string;
          status?: SubmissionStatus;
          review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          submitted_by?: string;
          track_id?: string | null;
          submission_type?: string;
          status?: SubmissionStatus;
          review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "upload_requests_artist_id_fkey";
            columns: ["artist_id"];
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "upload_requests_submitted_by_fkey";
            columns: ["submitted_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "upload_requests_track_id_fkey";
            columns: ["track_id"];
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "upload_requests_reviewed_by_fkey";
            columns: ["reviewed_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      moderation_logs: {
        Row: {
          id: string;
          moderator_user_id: string;
          target_type: string;
          target_id: string;
          action: string;
          previous_status: string | null;
          new_status: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          moderator_user_id: string;
          target_type: string;
          target_id: string;
          action: string;
          previous_status?: string | null;
          new_status?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          moderator_user_id?: string;
          target_type?: string;
          target_id?: string;
          action?: string;
          previous_status?: string | null;
          new_status?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "moderation_logs_moderator_user_id_fkey";
            columns: ["moderator_user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      public_catalog_tracks: {
        Row: {
          id: string;
          artist_id: string;
          album_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          duration_seconds: number;
          artwork_path: string | null;
          track_number: number | null;
          release_date: string;
          language: string;
          explicit_content: boolean;
          status: TrackStatus;
          is_featured: boolean;
          play_count: number;
          created_at: string;
          updated_at: string;
          artist_name: string;
          artist_slug: string;
          artist_image_path: string | null;
          album_title: string | null;
          album_slug: string | null;
          album_artwork_path: string | null;
        };
        Relationships: [];
      };
    };

    Functions: {
      search_catalog: {
        Args: {
          p_query: string;
          p_limit?: number;
        };
        Returns: {
          entity_type: "track" | "artist" | "album" | "playlist";
          id: string;
          title: string;
          subtitle: string | null;
          image_url: string | null;
          slug: string;
          rank: number;
        }[];
      };
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_moderator: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_artist: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      owns_artist: {
        Args: { p_artist_id: string };
        Returns: boolean;
      };
      track_has_verified_streaming_rights: {
        Args: { p_track_id: string };
        Returns: boolean;
      };
      is_track_publicly_visible: {
        Args: { p_track_id: string };
        Returns: boolean;
      };
    };

    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      album_type: AlbumType;
      album_status: AlbumStatus;
      track_status: TrackStatus;
      submission_status: SubmissionStatus;
    };

    CompositeTypes: Record<string, never>;
  };
}

// ------------------------------------------------------------------------------
// Convenient Domain Row & Mutation Type Aliases
// ------------------------------------------------------------------------------
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type DbArtist = Database["public"]["Tables"]["artists"]["Row"];
export type ArtistInsert = Database["public"]["Tables"]["artists"]["Insert"];
export type ArtistUpdate = Database["public"]["Tables"]["artists"]["Update"];

export type DbGenre = Database["public"]["Tables"]["genres"]["Row"];
export type GenreInsert = Database["public"]["Tables"]["genres"]["Insert"];
export type GenreUpdate = Database["public"]["Tables"]["genres"]["Update"];

export type DbAlbum = Database["public"]["Tables"]["albums"]["Row"];
export type AlbumInsert = Database["public"]["Tables"]["albums"]["Insert"];
export type AlbumUpdate = Database["public"]["Tables"]["albums"]["Update"];

export type DbTrack = Database["public"]["Tables"]["tracks"]["Row"];
export type TrackInsert = Database["public"]["Tables"]["tracks"]["Insert"];
export type TrackUpdate = Database["public"]["Tables"]["tracks"]["Update"];

export type TrackGenre = Database["public"]["Tables"]["track_genres"]["Row"];
export type TrackGenreInsert = Database["public"]["Tables"]["track_genres"]["Insert"];

export type TrackRights = Database["public"]["Tables"]["track_rights"]["Row"];
export type TrackRightsInsert = Database["public"]["Tables"]["track_rights"]["Insert"];
export type TrackRightsUpdate = Database["public"]["Tables"]["track_rights"]["Update"];

export type DbPlaylist = Database["public"]["Tables"]["playlists"]["Row"];
export type PlaylistInsert = Database["public"]["Tables"]["playlists"]["Insert"];
export type PlaylistUpdate = Database["public"]["Tables"]["playlists"]["Update"];

export type PlaylistTrack = Database["public"]["Tables"]["playlist_tracks"]["Row"];
export type PlaylistTrackInsert = Database["public"]["Tables"]["playlist_tracks"]["Insert"];

export type UserLike = Database["public"]["Tables"]["user_likes"]["Row"];
export type UserLikeInsert = Database["public"]["Tables"]["user_likes"]["Insert"];

export type ListeningHistory = Database["public"]["Tables"]["listening_history"]["Row"];
export type ListeningHistoryInsert = Database["public"]["Tables"]["listening_history"]["Insert"];

export type ArtistFollow = Database["public"]["Tables"]["artist_follows"]["Row"];
export type ArtistFollowInsert = Database["public"]["Tables"]["artist_follows"]["Insert"];

export type UploadRequest = Database["public"]["Tables"]["upload_requests"]["Row"];
export type UploadRequestInsert = Database["public"]["Tables"]["upload_requests"]["Insert"];
export type UploadRequestUpdate = Database["public"]["Tables"]["upload_requests"]["Update"];

export type ModerationLog = Database["public"]["Tables"]["moderation_logs"]["Row"];
export type ModerationLogInsert = Database["public"]["Tables"]["moderation_logs"]["Insert"];
