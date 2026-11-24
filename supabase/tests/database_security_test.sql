-- ==============================================================================
-- SONORA DATABASE & RLS SECURITY TEST SUITE
-- ==============================================================================
-- Description: Automated SQL test suite verifying table structures, relational
-- integrity, role escalation prevention, and music rights verification guards.
-- ==============================================================================

BEGIN;

-- 1. VERIFY ALL 14 TABLES EXIST
DO $$
DECLARE
    v_expected_tables TEXT[] := ARRAY[
        'profiles', 'artists', 'genres', 'albums', 'tracks',
        'track_genres', 'track_rights', 'playlists', 'playlist_tracks',
        'user_likes', 'listening_history', 'artist_follows',
        'upload_requests', 'moderation_logs'
    ];
    t TEXT;
    v_found BOOLEAN;
BEGIN
    FOREACH t IN ARRAY v_expected_tables LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = t
        ) INTO v_found;
        
        IF NOT v_found THEN
            RAISE EXCEPTION 'TEST FAILED: Missing expected table: public.%', t;
        END IF;
    END LOOP;
    RAISE NOTICE 'SUCCESS: All 14 application tables verified in public schema.';
END $$;

-- 2. VERIFY ROW LEVEL SECURITY IS ENABLED ON ALL 14 TABLES
DO $$
DECLARE
    v_tables TEXT[] := ARRAY[
        'profiles', 'artists', 'genres', 'albums', 'tracks',
        'track_genres', 'track_rights', 'playlists', 'playlist_tracks',
        'user_likes', 'listening_history', 'artist_follows',
        'upload_requests', 'moderation_logs'
    ];
    t TEXT;
    v_rls_enabled BOOLEAN;
BEGIN
    FOREACH t IN ARRAY v_tables LOOP
        SELECT rowsecurity INTO v_rls_enabled
        FROM pg_tables
        WHERE schemaname = 'public' AND tablename = t;

        IF NOT v_rls_enabled THEN
            RAISE EXCEPTION 'SECURITY TEST FAILED: RLS is disabled on table public.%', t;
        END IF;
    END LOOP;
    RAISE NOTICE 'SUCCESS: Row Level Security is active on all 14 core tables.';
END $$;

-- 3. TEST ROLE ESCALATION PREVENTION TRIGGER
DO $$
DECLARE
    v_test_user_id UUID := '00000000-0000-4000-a000-000000000005'; -- listener
    v_escalated BOOLEAN := false;
BEGIN
    -- Simulate authenticated listener context
    PERFORM set_config('request.jwt.claim.sub', v_test_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    BEGIN
        UPDATE public.profiles
        SET role = 'admin'
        WHERE id = v_test_user_id;

        v_escalated := true;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'SUCCESS: Profile role escalation prevented as expected: %', SQLERRM;
    END;

    IF v_escalated THEN
        RAISE EXCEPTION 'SECURITY TEST FAILED: Listener was able to escalate role to admin!';
    END IF;
END $$;

-- 4. TEST ARTIST CANNOT SELF-APPROVE TRACK RIGHTS
DO $$
DECLARE
    v_artist_user_id UUID := '00000000-0000-4000-a000-000000000003'; -- Aura Vance owner
    v_track_id UUID := '44444444-0000-4000-a000-000000000001';
    v_self_approved BOOLEAN := false;
BEGIN
    -- Simulate authenticated artist context
    PERFORM set_config('request.jwt.claim.sub', v_artist_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    BEGIN
        INSERT INTO public.track_rights (
            track_id, rights_holder_name, source_name, license_type,
            commercial_use_allowed, streaming_allowed, verification_status
        ) VALUES (
            v_track_id, 'Self Publishing', 'Self submission', 'CUSTOM',
            true, true, 'verified'
        );

        v_self_approved := true;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'SUCCESS: Artist self-approval blocked by trigger guard: %', SQLERRM;
    END;

    IF v_self_approved THEN
        RAISE EXCEPTION 'SECURITY TEST FAILED: Artist successfully self-approved their own track rights!';
    END IF;
END $$;

-- 5. TEST CHECK CONSTRAINTS (Track duration > 0)
DO $$
DECLARE
    v_invalid_track_created BOOLEAN := false;
BEGIN
    BEGIN
        INSERT INTO public.tracks (
            artist_id, title, slug, duration_seconds, audio_storage_path, status
        ) VALUES (
            '11111111-0000-4000-a000-000000000001', 'Zero Duration Track', 'zero-duration', -10, 'audio/test.mp3', 'draft'
        );
        v_invalid_track_created := true;
    EXCEPTION
        WHEN check_violation THEN
            RAISE NOTICE 'SUCCESS: Positive duration check constraint correctly rejected negative duration.';
    END;

    IF v_invalid_track_created THEN
        RAISE EXCEPTION 'INTEGRITY TEST FAILED: Track with negative duration was inserted!';
    END IF;
END $$;

ROLLBACK;
