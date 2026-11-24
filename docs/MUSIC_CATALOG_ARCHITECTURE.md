# SONORA — Music Catalog & Discovery Architecture

## 1. Architectural Vision

The SONORA Music Catalog & Discovery system transitions the platform from static mock presentations into a database-backed, rights-verified catalog engine. Built on a modular monolith pattern, it bridges PostgreSQL storage, Supabase RLS security policies, Next.js Server Components, and client-side reactive discovery experiences.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│   (Home / Discover, Explore, Global Search, Details)   │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌──────────────────────────┐┌─────────────────────────────┐
│  Next.js Route Handlers  ││    Client-Side Store &      │
│  (/api/catalog/*)        ││    React Discovery Skeletons│
└────────────┬─────────────┘└────────────┬────────────────┘
             │                           │
             ▼                           ▼
┌────────────────────────────────────────────────────────┐
│             Domain Repository & Service Layer          │
│   (TracksService, AlbumsService, ArtistsService,       │
│    GenresService, SearchService, CatalogService)       │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌──────────────────────────┐┌─────────────────────────────┐
│  public_catalog_tracks   ││   search_catalog() RPC      │
│  (Database View Gate)    ││   (pg_trgm Fuzzy Search)    │
└────────────┬─────────────┘└────────────┬────────────────┘
             │                           │
             ▼                           ▼
┌────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                   │
│   (tracks, albums, artists, track_rights, genres)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Public Catalog Eligibility Verification Gate

To protect artists, ensure digital rights compliance, and prevent unverified or infringing audio from appearing in public surfaces, SONORA enforces a **Strict 5-Point Catalog Eligibility Rule**:

A track is eligible for public discovery **ONLY** when ALL of the following criteria evaluate to `TRUE`:

1. `tracks.status = 'published'` (Draft, review, or rejected tracks are excluded).
2. `artists.verification_status = 'verified'` (Only identity-verified creators are published).
3. An active `track_rights` record exists linked via `track_id`.
4. `track_rights.verification_status = 'verified'`.
5. `track_rights.streaming_allowed = TRUE`.

This rule is enforced at the database layer through the `public.public_catalog_tracks` view:

```sql
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
JOIN public.track_rights tr ON tr.track_id = t.id
WHERE t.status = 'published'
  AND a.verification_status = 'verified'
  AND tr.verification_status = 'verified'
  AND tr.streaming_allowed = TRUE;
```

**Privacy Guarantee**: The view explicitly excludes internal operational fields:
- `audio_storage_path` (Protected until signed streaming access in Phase 5).
- `permission_evidence_path` (Private legal documentation).
- Moderation review notes and admin logs.

---

## 3. High-Performance Indexing Strategy

To support fast discovery, multi-faceted filtering, and millisecond search across millions of records, migration `20261124000006_catalog_discovery_indexes.sql` establishes:

1. **Composite & Filtered B-tree Indexes**:
   - `idx_tracks_catalog_composite`: `(status, is_featured, play_count DESC)` — Accelerates trending and featured queries.
   - `idx_tracks_album_position`: `(album_id, track_number)` — Instant album tracklist ordering.
   - `idx_albums_catalog_newest`: `(status, release_date DESC)` — Powers New Releases carousel.
   - `idx_playlists_public_curated`: `(is_public, is_curated, created_at DESC)` — Delivers curated editorial shelves.

2. **GIN Trigram Indexes (`pg_trgm`)**:
   - `idx_tracks_title_trgm`: Fast substring and typo-tolerant track search.
   - `idx_artists_stage_name_trgm`: Instant creator fuzzy matching.
   - `idx_albums_title_trgm`: Instant body-of-work discovery.
   - `idx_genres_name_trgm`: Sound dimension taxonomy search.
   - `idx_playlists_title_trgm`: Editorial mix search.

---

## 4. Layered Module Architecture

Catalog discovery is isolated in domain modules under `src/modules/`:
- `src/modules/catalog/`: Coordinates home and explore discovery bundles.
- `src/modules/tracks/`: Handles track pagination, sorting (`newest`, `popular`, `title`, `duration`), and metadata.
- `src/modules/albums/`: Computes aggregate album duration and published track count.
- `src/modules/artists/`: Queries verified creators and discography listings.
- `src/modules/genres/`: Manages genre taxonomy and category listings.
- `src/modules/search/`: Orchestrates global search, ranking, and graceful local fallbacks.
- `src/modules/playlists/`: Fetches public and curated editorial playlists.

---

## 5. Graceful Development Mode Fallback

When developing offline or before connecting live Supabase credentials, all repositories seamlessly detect environment status via `isSupabaseConfigured()`. If unconfigured, repositories fall back cleanly to curated mock fixtures (`src/data`), guaranteeing zero broken layouts or blocked development workflows.
