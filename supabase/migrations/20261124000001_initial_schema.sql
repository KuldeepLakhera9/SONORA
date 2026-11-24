-- ==============================================================================
-- SONORA MIGRATION 01: Core Schema & Enums
-- ==============================================================================
-- Description: Sets up PostgreSQL enums, utility functions, and the 14 core
-- application tables with strict constraints, foreign keys, and audit timestamps.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('listener', 'artist', 'moderator', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE album_type AS ENUM ('album', 'EP', 'single', 'compilation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE album_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE track_status AS ENUM ('draft', 'pending_review', 'published', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('submitted', 'under_review', 'approved', 'rejected', 'changes_requested');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TIMESTAMP UPDATE FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLE 1: profiles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_path TEXT,
    bio TEXT,
    role user_role NOT NULL DEFAULT 'listener',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT username_min_length CHECK (char_length(username) >= 3),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_-]+$')
);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 2: artists
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    stage_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    biography TEXT,
    profile_image_path TEXT,
    cover_image_path TEXT,
    country TEXT,
    region TEXT,
    primary_genre TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT stage_name_not_empty CHECK (char_length(trim(stage_name)) > 0),
    CONSTRAINT slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE TRIGGER update_artists_updated_at
    BEFORE UPDATE ON public.artists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 3: genres
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT genre_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT genre_slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

-- ==============================================================================
-- TABLE 4: albums
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    cover_image_path TEXT,
    release_date DATE NOT NULL DEFAULT CURRENT_DATE,
    album_type album_type NOT NULL DEFAULT 'album',
    status album_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT album_title_not_empty CHECK (char_length(trim(title)) > 0),
    CONSTRAINT unique_artist_album_slug UNIQUE (artist_id, slug)
);

CREATE TRIGGER update_albums_updated_at
    BEFORE UPDATE ON public.albums
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 5: tracks
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE RESTRICT,
    album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    duration_seconds INTEGER NOT NULL,
    audio_storage_path TEXT NOT NULL,
    artwork_path TEXT,
    track_number INTEGER,
    release_date DATE NOT NULL DEFAULT CURRENT_DATE,
    language TEXT NOT NULL DEFAULT 'en',
    explicit_content BOOLEAN NOT NULL DEFAULT false,
    status track_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT duration_positive CHECK (duration_seconds > 0),
    CONSTRAINT track_number_positive CHECK (track_number IS NULL OR track_number > 0),
    CONSTRAINT track_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE TRIGGER update_tracks_updated_at
    BEFORE UPDATE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 6: track_genres
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.track_genres (
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (track_id, genre_id)
);

-- ==============================================================================
-- TABLE 7: track_rights
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.track_rights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE RESTRICT,
    rights_holder_name TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    license_type TEXT NOT NULL,
    license_url TEXT,
    attribution_text TEXT,
    commercial_use_allowed BOOLEAN NOT NULL DEFAULT false,
    streaming_allowed BOOLEAN NOT NULL DEFAULT true,
    redistribution_allowed BOOLEAN NOT NULL DEFAULT false,
    permission_evidence_path TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT rights_holder_not_empty CHECK (char_length(trim(rights_holder_name)) > 0),
    CONSTRAINT license_type_not_empty CHECK (char_length(trim(license_type)) > 0)
);

CREATE TRIGGER update_track_rights_updated_at
    BEFORE UPDATE ON public.track_rights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 8: playlists
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_path TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT playlist_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON public.playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 9: playlist_tracks
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT position_non_negative CHECK (position >= 0),
    CONSTRAINT unique_track_per_playlist UNIQUE (playlist_id, track_id),
    CONSTRAINT unique_playlist_position UNIQUE (playlist_id, position) DEFERRABLE INITIALLY DEFERRED
);

-- ==============================================================================
-- TABLE 10: user_likes
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_track_like UNIQUE (user_id, track_id)
);

-- ==============================================================================
-- TABLE 11: listening_history
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.listening_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    listened_duration_seconds INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT listened_duration_non_negative CHECK (listened_duration_seconds >= 0)
);

-- ==============================================================================
-- TABLE 12: artist_follows
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.artist_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_artist_follow UNIQUE (user_id, artist_id)
);

-- ==============================================================================
-- TABLE 13: upload_requests
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.upload_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE RESTRICT,
    submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
    submission_type TEXT NOT NULL,
    status submission_status NOT NULL DEFAULT 'submitted',
    review_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT submission_type_valid CHECK (submission_type IN ('single', 'album_track', 'remix', 're-release'))
);

CREATE TRIGGER update_upload_requests_updated_at
    BEFORE UPDATE ON public.upload_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE 14: moderation_logs
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    action TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT target_type_valid CHECK (target_type IN ('track', 'album', 'artist', 'track_rights', 'upload_request', 'profile', 'playlist'))
);
