-- ==============================================================================
-- SONORA MIGRATION 04: Storage Buckets & Storage Security Policies
-- ==============================================================================
-- Description: Configures the 3 core storage buckets:
-- 1. 'audio' (Private - Master audio files, signed URL access only)
-- 2. 'artwork' (Public Read - Cover art, profile images, genre banners)
-- 3. 'rights-evidence' (Private - Legal licenses, contracts, permission documents)
-- ==============================================================================

-- 1. INSERT STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'audio',
        'audio',
        false,
        104857600, -- 100MB max per audio file
        ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/aac', 'audio/mp4']
    ),
    (
        'artwork',
        'artwork',
        true,
        10485760, -- 10MB max per image
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    ),
    (
        'rights-evidence',
        'rights-evidence',
        false,
        20971520, -- 20MB max per document
        ARRAY['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. STORAGE OBJECT POLICIES: AUDIO BUCKET (STRICTLY PRIVATE)
-- ==============================================================================

-- Audio is never publicly browsable. Only track owners, moderators, admins, or service role can read master files directly.
CREATE POLICY "audio_owner_or_moderator_select"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'audio' AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_moderator()
            OR auth.role() = 'service_role'
        )
    );

-- Artists can upload audio under their own user folder: audio/{user_id}/*
CREATE POLICY "audio_artist_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'audio'
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (public.is_artist() OR public.is_admin())
    );

-- Artists can delete or update their own audio prior to publication
CREATE POLICY "audio_artist_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'audio'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'audio'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "audio_artist_or_admin_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'audio' AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin()
        )
    );

-- ==============================================================================
-- 3. STORAGE OBJECT POLICIES: ARTWORK BUCKET (PUBLIC READ, AUTHENTICATED WRITE)
-- ==============================================================================

-- Public can read artwork (album covers, artist avatars, playlist thumbnails)
CREATE POLICY "artwork_public_select"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'artwork');

-- Authenticated users can upload artwork to their own user folder: artwork/{user_id}/*
CREATE POLICY "artwork_authenticated_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'artwork'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can modify or delete their own artwork
CREATE POLICY "artwork_owner_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'artwork'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'artwork'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "artwork_owner_or_admin_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'artwork' AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin()
        )
    );

-- ==============================================================================
-- 4. STORAGE OBJECT POLICIES: RIGHTS EVIDENCE BUCKET (STRICTLY CONFIDENTIAL)
-- ==============================================================================

-- Strictly private: Only submitting user, moderators, and admins can view rights evidence
CREATE POLICY "rights_evidence_owner_or_moderator_select"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'rights-evidence' AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_moderator()
            OR auth.role() = 'service_role'
        )
    );

-- Artists can upload licensing agreements under their user folder: rights-evidence/{user_id}/*
CREATE POLICY "rights_evidence_artist_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'rights-evidence'
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (public.is_artist() OR public.is_admin())
    );

-- Rights evidence cannot be tampered with or deleted by ordinary users once submitted (Admins only)
CREATE POLICY "rights_evidence_admin_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'rights-evidence' AND public.is_admin()
    );
