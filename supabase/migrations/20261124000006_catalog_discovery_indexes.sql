-- ==============================================================================
-- SONORA MIGRATION 06: Catalog Discovery, Trigram Search & Eligibility Engine
-- ==============================================================================
-- Description:
-- 1. Adds pg_trgm extension for high-performance fuzzy/partial catalog search.
-- 2. Adds editorial 'is_featured' and metric 'play_count' fields to tracks/albums.
-- 3. Implements GIN trigram indexes for sub-millisecond search across entities.
-- 4. Creates public_catalog_tracks view enforcing rights-verification gate.
-- 5. Implements search_catalog() RPC function with parameterized query safety.
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ADD CATALOG EDITORIAL & PERFORMANCE FIELDS
ALTER TABLE public.tracks 
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS play_count BIGINT NOT NULL DEFAULT 0;

ALTER TABLE public.albums
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- 3. CREATE GIN TRIGRAM SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_tracks_title_trgm ON public.tracks USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artists_stage_name_trgm ON public.artists USING gin (stage_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_albums_title_trgm ON public.albums USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_genres_name_trgm ON public.genres USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_playlists_title_trgm ON public.playlists USING gin (title gin_trgm_ops) WHERE is_public = true;

-- 4. ADDITIONAL B-TREE INDEXES FOR CATALOG FEEDS & SORTING
CREATE INDEX IF NOT EXISTS idx_tracks_featured ON public.tracks (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tracks_popular ON public.tracks (play_count DESC);
CREATE INDEX IF NOT EXISTS idx_albums_featured ON public.albums (is_featured) WHERE is_featured = true;

-- 5. CENTRALIZED ELIGIBLE PUBLIC TRACKS VIEW
-- STRICT GATE: Excludes draft/suspended tracks, unverified artists, and tracks without verified streaming rights.
-- SAFE PROJECTION: Excludes private audio_storage_path and permission_evidence_path.
CREATE OR REPLACE VIEW public.public_catalog_tracks AS
SELECT 
    t.id,
    t.artist_id,
    t.album_id,
    t.title,
    t.slug,
    t.description,
    t.duration_seconds,
    t.artwork_path,
    t.track_number,
    t.release_date,
    t.language,
    t.explicit_content,
    t.status,
    t.is_featured,
    t.play_count,
    t.created_at,
    t.updated_at,
    a.stage_name AS artist_name,
    a.slug AS artist_slug,
    a.profile_image_path AS artist_image_path,
    al.title AS album_title,
    al.slug AS album_slug,
    al.cover_image_path AS album_artwork_path
FROM public.tracks t
JOIN public.artists a ON a.id = t.artist_id
LEFT JOIN public.albums al ON al.id = t.album_id
WHERE t.status = 'published'
  AND a.verification_status = 'verified'
  AND EXISTS (
      SELECT 1 FROM public.track_rights tr
      WHERE tr.track_id = t.id
        AND tr.verification_status = 'verified'
        AND tr.streaming_allowed = true
  );

GRANT SELECT ON public.public_catalog_tracks TO anon, authenticated, service_role;

-- 6. UNIFIED CATALOG SEARCH RPC FUNCTION
-- Safely queries across tracks, artists, albums, and public playlists with rank ordering
CREATE OR REPLACE FUNCTION public.search_catalog(
    p_query TEXT,
    p_limit INT DEFAULT 20
)
RETURNS TABLE (
    entity_type TEXT,
    id UUID,
    title TEXT,
    subtitle TEXT,
    image_url TEXT,
    slug TEXT,
    rank REAL
) AS $$
DECLARE
    v_clean_query TEXT;
    v_limit INT := LEAST(COALESCE(p_limit, 20), 50);
BEGIN
    v_clean_query := trim(p_query);
    IF char_length(v_clean_query) = 0 THEN
        RETURN;
    END IF;

    RETURN QUERY
    -- 1. Matching Eligible Tracks
    SELECT 
        'track'::TEXT AS entity_type,
        pct.id,
        pct.title,
        pct.artist_name AS subtitle,
        COALESCE(pct.artwork_path, pct.album_artwork_path) AS image_url,
        pct.slug,
        similarity(pct.title, v_clean_query) AS rank
    FROM public.public_catalog_tracks pct
    WHERE pct.title ILIKE '%' || v_clean_query || '%'
       OR pct.title % v_clean_query

    UNION ALL

    -- 2. Matching Verified Artists
    SELECT 
        'artist'::TEXT AS entity_type,
        a.id,
        a.stage_name AS title,
        COALESCE(a.primary_genre, 'Independent Artist') AS subtitle,
        a.profile_image_path AS image_url,
        a.slug,
        similarity(a.stage_name, v_clean_query) AS rank
    FROM public.artists a
    WHERE a.verification_status = 'verified'
      AND (a.stage_name ILIKE '%' || v_clean_query || '%' OR a.stage_name % v_clean_query)

    UNION ALL

    -- 3. Matching Published Albums
    SELECT 
        'album'::TEXT AS entity_type,
        al.id,
        al.title,
        a.stage_name AS subtitle,
        al.cover_image_path AS image_url,
        al.slug,
        similarity(al.title, v_clean_query) AS rank
    FROM public.albums al
    JOIN public.artists a ON a.id = al.artist_id
    WHERE al.status = 'published'
      AND a.verification_status = 'verified'
      AND (al.title ILIKE '%' || v_clean_query || '%' OR al.title % v_clean_query)

    UNION ALL

    -- 4. Matching Public Playlists
    SELECT 
        'playlist'::TEXT AS entity_type,
        p.id,
        p.title,
        'Curated Playlist'::TEXT AS subtitle,
        p.cover_image_path AS image_url,
        p.id::TEXT AS slug,
        similarity(p.title, v_clean_query) AS rank
    FROM public.playlists p
    WHERE p.is_public = true
      AND (p.title ILIKE '%' || v_clean_query || '%' OR p.title % v_clean_query)

    ORDER BY rank DESC
    LIMIT v_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.search_catalog(TEXT, INT) TO anon, authenticated, service_role;
