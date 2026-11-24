# SONORA — Search Architecture & Implementation

## 1. Overview

SONORA's search architecture is built for rapid, typo-tolerant, multi-entity discovery across independent music catalogs. It combines PostgreSQL trigram matching (`pg_trgm`), indexed GIN expressions, a weighted RPC search coordinator (`search_catalog`), and client-side debounced state management with loading skeletons.

---

## 2. PostgreSQL Trigram Engine (`pg_trgm`)

PostgreSQL's `pg_trgm` extension breaks search inputs and database strings into 3-character slices ("trigrams"). It computes similarity scores based on the proportion of overlapping trigrams:

$$\text{similarity}(A, B) = \frac{|T(A) \cap T(B)|}{|T(A) \cup T(B)|}$$

This enables:
1. **Typo Tolerance**: Finding "Solaris Echo" even if the user types "Solarsi" or "Solarrs".
2. **Prefix & Infix Matching**: Instant matching on substrings across long track and album titles.
3. **Accent Insensitivity**: Clean handling of diverse artist naming conventions.

---

## 3. Database Search RPC (`public.search_catalog`)

Migration `20261124000006_catalog_discovery_indexes.sql` introduces the `search_catalog` function:

```sql
CREATE OR REPLACE FUNCTION public.search_catalog(
  p_query TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  entity_type TEXT,
  id UUID,
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  slug TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- 1. Rights-Verified Tracks
  SELECT
    'track'::TEXT AS entity_type,
    pct.id,
    pct.title,
    pct.artist_name AS subtitle,
    pct.artwork_path AS image_url,
    pct.slug,
    similarity(pct.title, p_query) AS rank
  FROM public.public_catalog_tracks pct
  WHERE pct.title % p_query OR pct.title ILIKE '%' || p_query || '%'
  
  UNION ALL

  -- 2. Verified Artists
  SELECT
    'artist'::TEXT AS entity_type,
    a.id,
    a.stage_name AS title,
    COALESCE(a.primary_genre, 'Artist') AS subtitle,
    a.profile_image_path AS image_url,
    a.slug,
    similarity(a.stage_name, p_query) AS rank
  FROM public.artists a
  WHERE a.verification_status = 'verified'
    AND (a.stage_name % p_query OR a.stage_name ILIKE '%' || p_query || '%')

  UNION ALL

  -- 3. Published Albums
  SELECT
    'album'::TEXT AS entity_type,
    al.id,
    al.title,
    a.stage_name AS subtitle,
    al.cover_image_path AS image_url,
    al.slug,
    similarity(al.title, p_query) AS rank
  FROM public.albums al
  JOIN public.artists a ON a.id = al.artist_id
  WHERE al.status = 'published'
    AND a.verification_status = 'verified'
    AND (al.title % p_query OR al.title ILIKE '%' || p_query || '%')

  UNION ALL

  -- 4. Public Curated Playlists
  SELECT
    'playlist'::TEXT AS entity_type,
    p.id,
    p.title,
    COALESCE(pr.display_name, 'Curated') AS subtitle,
    p.cover_image_path AS image_url,
    p.id::TEXT AS slug,
    similarity(p.title, p_query) AS rank
  FROM public.playlists p
  LEFT JOIN public.profiles pr ON pr.id = p.created_by
  WHERE p.is_public = TRUE
    AND (p.title % p_query OR p.title ILIKE '%' || p_query || '%')

  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$;
```

---

## 4. Client Search Flow

1. **Debounce**: 250ms debounce prevents search thrashing while typing.
2. **API Call**: Invokes `/api/catalog/search?q={query}&limit=20`.
3. **Tab Filtering**: Users switch between `All`, `Tracks`, `Artists`, `Albums`, and `Playlists` with result counts.
4. **Top Match**: Automatically highlights the most relevant artist or track in a dedicated hero card.
5. **Fallback**: If offline, seamlessly switches to local indexed search (`searchAll(query)`).
