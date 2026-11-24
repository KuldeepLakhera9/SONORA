-- ==============================================================================
-- SONORA MIGRATION 02: Performance Indexes & Advanced Constraints
-- ==============================================================================
-- Description: Adds high-performance B-tree indexes for fast querying across
-- library, search, feeds, playback lookups, and moderation workflows.
-- ==============================================================================

-- 1. PROFILES INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles (is_active) WHERE is_active = true;

-- 2. ARTISTS INDEXES
CREATE INDEX IF NOT EXISTS idx_artists_owner_user_id ON public.artists (owner_user_id) WHERE owner_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_artists_verification_status ON public.artists (verification_status);
CREATE INDEX IF NOT EXISTS idx_artists_primary_genre ON public.artists (primary_genre);

-- 3. GENRES INDEXES
CREATE INDEX IF NOT EXISTS idx_genres_slug ON public.genres (slug);

-- 4. ALBUMS INDEXES
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON public.albums (artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_status ON public.albums (status);
CREATE INDEX IF NOT EXISTS idx_albums_release_date ON public.albums (release_date DESC);
CREATE INDEX IF NOT EXISTS idx_albums_published_feed ON public.albums (status, release_date DESC) WHERE status = 'published';

-- 5. TRACKS INDEXES
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON public.tracks (artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON public.tracks (album_id) WHERE album_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracks_status ON public.tracks (status);
CREATE INDEX IF NOT EXISTS idx_tracks_release_date ON public.tracks (release_date DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_published_catalog ON public.tracks (status, release_date DESC) WHERE status = 'published';

-- 6. TRACK_GENRES INDEXES
CREATE INDEX IF NOT EXISTS idx_track_genres_genre_id ON public.track_genres (genre_id);

-- 7. TRACK_RIGHTS INDEXES
CREATE INDEX IF NOT EXISTS idx_track_rights_track_id ON public.track_rights (track_id);
CREATE INDEX IF NOT EXISTS idx_track_rights_status ON public.track_rights (verification_status);
CREATE INDEX IF NOT EXISTS idx_track_rights_verified_streamable ON public.track_rights (track_id, verification_status, streaming_allowed)
    WHERE verification_status = 'verified' AND streaming_allowed = true;

-- 8. PLAYLISTS INDEXES
CREATE INDEX IF NOT EXISTS idx_playlists_owner_user_id ON public.playlists (owner_user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_is_public ON public.playlists (is_public);
CREATE INDEX IF NOT EXISTS idx_playlists_public_feed ON public.playlists (is_public, created_at DESC) WHERE is_public = true;

-- 9. PLAYLIST_TRACKS INDEXES
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON public.playlist_tracks (playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON public.playlist_tracks (track_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_ordering ON public.playlist_tracks (playlist_id, position ASC);

-- 10. USER_LIKES INDEXES
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON public.user_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_track_id ON public.user_likes (track_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_user_recent ON public.user_likes (user_id, created_at DESC);

-- 11. LISTENING_HISTORY INDEXES
CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON public.listening_history (user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_listening_history_track_id ON public.listening_history (track_id);

-- 12. ARTIST_FOLLOWS INDEXES
CREATE INDEX IF NOT EXISTS idx_artist_follows_user_id ON public.artist_follows (user_id);
CREATE INDEX IF NOT EXISTS idx_artist_follows_artist_id ON public.artist_follows (artist_id);

-- 13. UPLOAD_REQUESTS INDEXES
CREATE INDEX IF NOT EXISTS idx_upload_requests_artist_id ON public.upload_requests (artist_id);
CREATE INDEX IF NOT EXISTS idx_upload_requests_submitted_by ON public.upload_requests (submitted_by);
CREATE INDEX IF NOT EXISTS idx_upload_requests_status ON public.upload_requests (status);

-- 14. MODERATION_LOGS INDEXES
CREATE INDEX IF NOT EXISTS idx_moderation_logs_moderator_id ON public.moderation_logs (moderator_user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_target ON public.moderation_logs (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_recent ON public.moderation_logs (created_at DESC);
