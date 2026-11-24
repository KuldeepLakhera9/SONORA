-- ==============================================================================
-- SONORA MIGRATION 03: Row Level Security (RLS) & Authorization Engine
-- ==============================================================================
-- Description: Enables RLS on all 14 core tables, creates security helper
-- functions, role escalation guards, rights verification guards, and granular
-- policies across unauthenticated, listener, artist, moderator, and admin roles.
-- ==============================================================================

-- 1. SECURITY HELPER FUNCTIONS (SECURITY DEFINER with fixed search_path)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role AS $$
DECLARE
    v_role public.user_role;
BEGIN
    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();
    RETURN COALESCE(v_role, 'listener'::public.user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT public.current_user_role() = 'admin'::public.user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT public.current_user_role() IN ('moderator'::public.user_role, 'admin'::public.user_role));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_artist()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT public.current_user_role() IN ('artist'::public.user_role, 'moderator'::public.user_role, 'admin'::public.user_role));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.owns_artist(p_artist_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.artists
        WHERE id = p_artist_id AND owner_user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.track_has_verified_streaming_rights(p_track_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.track_rights
        WHERE track_id = p_track_id
          AND verification_status = 'verified'
          AND streaming_allowed = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_track_publicly_visible(p_track_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.tracks
        WHERE id = p_track_id
          AND status = 'published'
          AND public.track_has_verified_streaming_rights(p_track_id) = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. ROLE ESCALATION GUARD TRIGGER
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- Allow service role or admins to modify roles
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF auth.role() = 'service_role' OR public.is_admin() THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'SECURITY ERROR: Self-promotion or role modification is forbidden. Contact an administrator.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER guard_profiles_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_escalation();

-- 3. RIGHTS VERIFICATION GUARD TRIGGER
-- Ensures artists cannot approve their own rights records and only moderators/admins can verify
CREATE OR REPLACE FUNCTION public.guard_track_rights_verification()
RETURNS TRIGGER AS $$
DECLARE
    v_artist_owner UUID;
BEGIN
    -- If verification status is being changed to 'verified'
    IF NEW.verification_status = 'verified' AND (OLD.verification_status IS NULL OR OLD.verification_status <> 'verified') THEN
        -- Service role can seed or automate
        IF auth.role() <> 'service_role' THEN
            -- Check caller is moderator or admin
            IF NOT public.is_moderator() THEN
                RAISE EXCEPTION 'SECURITY ERROR: Only moderators and administrators can verify music rights.';
            END IF;

            -- Check artist owner is not approving their own track
            SELECT a.owner_user_id INTO v_artist_owner
            FROM public.tracks t
            JOIN public.artists a ON a.id = t.artist_id
            WHERE t.id = NEW.track_id;

            IF v_artist_owner IS NOT NULL AND v_artist_owner = auth.uid() THEN
                RAISE EXCEPTION 'SECURITY ERROR: Conflict of interest — Artists are strictly prohibited from approving their own track rights.';
            END IF;
        END IF;

        NEW.verified_by = COALESCE(auth.uid(), NEW.verified_by);
        NEW.verified_at = now();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER guard_track_rights_approval
    BEFORE INSERT OR UPDATE ON public.track_rights
    FOR EACH ROW
    EXECUTE FUNCTION public.guard_track_rights_verification();

-- ==============================================================================
-- 4. ENABLE RLS ON ALL 14 TABLES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. RLS POLICIES FOR EACH TABLE
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TABLE 1: profiles
-- ------------------------------------------------------------------------------
CREATE POLICY "profiles_public_read_active"
    ON public.profiles FOR SELECT
    USING (is_active = true OR id = auth.uid() OR public.is_moderator());

CREATE POLICY "profiles_user_update_self"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert_self_or_admin"
    ON public.profiles FOR INSERT
    WITH CHECK (id = auth.uid() OR public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "profiles_admin_delete"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 2: artists
-- ------------------------------------------------------------------------------
CREATE POLICY "artists_public_read_verified"
    ON public.artists FOR SELECT
    USING (verification_status = 'verified' OR owner_user_id = auth.uid() OR public.is_moderator());

CREATE POLICY "artists_owner_or_admin_insert"
    ON public.artists FOR INSERT
    TO authenticated
    WITH CHECK (owner_user_id = auth.uid() OR public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "artists_owner_or_moderator_update"
    ON public.artists FOR UPDATE
    TO authenticated
    USING (owner_user_id = auth.uid() OR public.is_moderator())
    WITH CHECK (owner_user_id = auth.uid() OR public.is_moderator());

CREATE POLICY "artists_admin_delete"
    ON public.artists FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 3: genres
-- ------------------------------------------------------------------------------
CREATE POLICY "genres_public_read_all"
    ON public.genres FOR SELECT
    USING (true);

CREATE POLICY "genres_admin_manage"
    ON public.genres FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 4: albums
-- ------------------------------------------------------------------------------
CREATE POLICY "albums_public_read_published"
    ON public.albums FOR SELECT
    USING (status = 'published' OR public.owns_artist(artist_id) OR public.is_moderator());

CREATE POLICY "albums_artist_insert"
    ON public.albums FOR INSERT
    TO authenticated
    WITH CHECK (public.owns_artist(artist_id) OR public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "albums_artist_or_moderator_update"
    ON public.albums FOR UPDATE
    TO authenticated
    USING (public.owns_artist(artist_id) OR public.is_moderator())
    WITH CHECK (public.owns_artist(artist_id) OR public.is_moderator());

CREATE POLICY "albums_admin_delete"
    ON public.albums FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 5: tracks
-- ------------------------------------------------------------------------------
CREATE POLICY "tracks_public_read_verified_published"
    ON public.tracks FOR SELECT
    USING (public.is_track_publicly_visible(id) OR public.owns_artist(artist_id) OR public.is_moderator());

CREATE POLICY "tracks_artist_insert"
    ON public.tracks FOR INSERT
    TO authenticated
    WITH CHECK (public.owns_artist(artist_id) OR public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "tracks_artist_or_moderator_update"
    ON public.tracks FOR UPDATE
    TO authenticated
    USING (public.owns_artist(artist_id) OR public.is_moderator())
    WITH CHECK (public.owns_artist(artist_id) OR public.is_moderator());

CREATE POLICY "tracks_admin_delete"
    ON public.tracks FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 6: track_genres
-- ------------------------------------------------------------------------------
CREATE POLICY "track_genres_public_read"
    ON public.track_genres FOR SELECT
    USING (
        public.is_track_publicly_visible(track_id)
        OR EXISTS (
            SELECT 1 FROM public.tracks t
            WHERE t.id = track_id AND (public.owns_artist(t.artist_id) OR public.is_moderator())
        )
    );

CREATE POLICY "track_genres_artist_or_admin_insert"
    ON public.track_genres FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tracks t
            WHERE t.id = track_id AND (public.owns_artist(t.artist_id) OR public.is_admin())
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "track_genres_artist_or_admin_delete"
    ON public.track_genres FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tracks t
            WHERE t.id = track_id AND (public.owns_artist(t.artist_id) OR public.is_admin())
        )
    );

-- ------------------------------------------------------------------------------
-- TABLE 7: track_rights
-- ------------------------------------------------------------------------------
-- Important: Raw rights records and evidence are PRIVATE. Ordinary listeners cannot query rights metadata.
CREATE POLICY "track_rights_owner_or_moderator_read"
    ON public.track_rights FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tracks t
            WHERE t.id = track_id AND public.owns_artist(t.artist_id)
        )
        OR public.is_moderator()
        OR auth.role() = 'service_role'
    );

CREATE POLICY "track_rights_artist_insert_declaration"
    ON public.track_rights FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tracks t
            WHERE t.id = track_id AND (public.owns_artist(t.artist_id) OR public.is_admin())
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "track_rights_moderator_update"
    ON public.track_rights FOR UPDATE
    TO authenticated
    USING (public.is_moderator() OR auth.role() = 'service_role')
    WITH CHECK (public.is_moderator() OR auth.role() = 'service_role');

CREATE POLICY "track_rights_admin_delete"
    ON public.track_rights FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 8: playlists
-- ------------------------------------------------------------------------------
CREATE POLICY "playlists_public_or_owner_read"
    ON public.playlists FOR SELECT
    USING (is_public = true OR owner_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "playlists_owner_insert"
    ON public.playlists FOR INSERT
    TO authenticated
    WITH CHECK (owner_user_id = auth.uid() OR public.is_admin() OR auth.role() = 'service_role');

CREATE POLICY "playlists_owner_update"
    ON public.playlists FOR UPDATE
    TO authenticated
    USING (owner_user_id = auth.uid() OR public.is_admin())
    WITH CHECK (owner_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "playlists_owner_delete"
    ON public.playlists FOR DELETE
    TO authenticated
    USING (owner_user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 9: playlist_tracks
-- ------------------------------------------------------------------------------
CREATE POLICY "playlist_tracks_public_or_owner_read"
    ON public.playlist_tracks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.playlists p
            WHERE p.id = playlist_id AND (p.is_public = true OR p.owner_user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "playlist_tracks_owner_insert"
    ON public.playlist_tracks FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.playlists p
            WHERE p.id = playlist_id AND (p.owner_user_id = auth.uid() OR public.is_admin())
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "playlist_tracks_owner_update"
    ON public.playlist_tracks FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.playlists p
            WHERE p.id = playlist_id AND (p.owner_user_id = auth.uid() OR public.is_admin())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.playlists p
            WHERE p.id = playlist_id AND (p.owner_user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "playlist_tracks_owner_delete"
    ON public.playlist_tracks FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.playlists p
            WHERE p.id = playlist_id AND (p.owner_user_id = auth.uid() OR public.is_admin())
        )
    );

-- ------------------------------------------------------------------------------
-- TABLE 10: user_likes
-- ------------------------------------------------------------------------------
-- Private to the user
CREATE POLICY "user_likes_owner_read"
    ON public.user_likes FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_likes_owner_insert"
    ON public.user_likes FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_likes_owner_delete"
    ON public.user_likes FOR DELETE
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 11: listening_history
-- ------------------------------------------------------------------------------
-- Private to the user
CREATE POLICY "listening_history_owner_read"
    ON public.listening_history FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "listening_history_owner_insert"
    ON public.listening_history FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "listening_history_owner_delete"
    ON public.listening_history FOR DELETE
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 12: artist_follows
-- ------------------------------------------------------------------------------
CREATE POLICY "artist_follows_owner_read"
    ON public.artist_follows FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "artist_follows_owner_insert"
    ON public.artist_follows FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "artist_follows_owner_delete"
    ON public.artist_follows FOR DELETE
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 13: upload_requests
-- ------------------------------------------------------------------------------
CREATE POLICY "upload_requests_owner_or_moderator_read"
    ON public.upload_requests FOR SELECT
    TO authenticated
    USING (submitted_by = auth.uid() OR public.owns_artist(artist_id) OR public.is_moderator());

CREATE POLICY "upload_requests_artist_insert"
    ON public.upload_requests FOR INSERT
    TO authenticated
    WITH CHECK (submitted_by = auth.uid() AND (public.owns_artist(artist_id) OR public.is_admin()));

CREATE POLICY "upload_requests_moderator_or_artist_update"
    ON public.upload_requests FOR UPDATE
    TO authenticated
    USING (submitted_by = auth.uid() OR public.is_moderator())
    WITH CHECK (submitted_by = auth.uid() OR public.is_moderator());

CREATE POLICY "upload_requests_admin_delete"
    ON public.upload_requests FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- TABLE 14: moderation_logs
-- ------------------------------------------------------------------------------
-- Immutable audit log: Only moderators and admins can read or insert. No update or delete allowed!
CREATE POLICY "moderation_logs_moderator_read"
    ON public.moderation_logs FOR SELECT
    TO authenticated
    USING (public.is_moderator());

CREATE POLICY "moderation_logs_moderator_insert"
    ON public.moderation_logs FOR INSERT
    TO authenticated
    WITH CHECK (moderator_user_id = auth.uid() AND public.is_moderator());

-- Note: No UPDATE or DELETE policies are created for moderation_logs, ensuring immutability.
