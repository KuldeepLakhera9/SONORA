# SONORA — Database Schema Specification

This document details all 14 core PostgreSQL tables, custom ENUMs, constraints, and performance indexes implemented in Phase 2.

---

## 1. Custom PostgreSQL Types & ENUMs

| ENUM Name | Allowed Values | Description |
|:---|:---|:---|
| `user_role` | `listener`, `artist`, `moderator`, `admin` | Application access tier. |
| `verification_status` | `pending`, `verified`, `rejected`, `expired` | Verification status for artists and licensing. |
| `album_type` | `album`, `EP`, `single`, `compilation` | Release format. |
| `album_status` | `draft`, `published`, `archived` | Lifecycle state of albums. |
| `track_status` | `draft`, `pending_review`, `published`, `rejected`, `suspended` | Lifecycle state of tracks. |
| `submission_status` | `submitted`, `under_review`, `approved`, `rejected`, `changes_requested` | Artist upload workflow state. |

---

## 2. Table Specifications

### 1. `profiles`
Represents public user identity, synchronized with `auth.users`.
- `id` (UUID, PK) → `auth.users(id) ON DELETE CASCADE`
- `username` (TEXT, UNIQUE, NOT NULL, CHECK >= 3 chars)
- `display_name` (TEXT, NOT NULL)
- `avatar_path` (TEXT, NULL)
- `bio` (TEXT, NULL)
- `role` (`user_role`, NOT NULL, DEFAULT `'listener'`)
- `is_active` (BOOLEAN, NOT NULL, DEFAULT `true`)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT `now()`)
- `updated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT `now()`)

### 2. `artists`
Stores verified artist profiles and discography ownership.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `owner_user_id` (UUID, FK → `profiles(id) ON DELETE SET NULL`)
- `stage_name` (TEXT, NOT NULL, CHECK > 0 chars)
- `slug` (TEXT, UNIQUE, NOT NULL, CHECK format `^[a-z0-9-]+$`)
- `biography` (TEXT, NULL)
- `profile_image_path` (TEXT, NULL)
- `cover_image_path` (TEXT, NULL)
- `country` (TEXT, NULL)
- `region` (TEXT, NULL)
- `primary_genre` (TEXT, NULL)
- `verification_status` (`verification_status`, NOT NULL, DEFAULT `'pending'`)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 3. `genres`
Editorial musical genres.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `name` (TEXT, UNIQUE, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `description` (TEXT, NULL)
- `image_path` (TEXT, NULL)
- `created_at` (TIMESTAMPTZ)

### 4. `albums`
Artist releases and collections.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `artist_id` (UUID, FK → `artists(id) ON DELETE RESTRICT`)
- `title` (TEXT, NOT NULL)
- `slug` (TEXT, NOT NULL)
- `description` (TEXT, NULL)
- `cover_image_path` (TEXT, NULL)
- `release_date` (DATE, NOT NULL, DEFAULT `CURRENT_DATE`)
- `album_type` (`album_type`, NOT NULL, DEFAULT `'album'`)
- `status` (`album_status`, NOT NULL, DEFAULT `'draft'`)
- `created_at` / `updated_at` (TIMESTAMPTZ)
- *Constraint*: `UNIQUE (artist_id, slug)`

### 5. `tracks`
Master track catalog assets.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `artist_id` (UUID, FK → `artists(id) ON DELETE RESTRICT`)
- `album_id` (UUID, FK → `albums(id) ON DELETE SET NULL`)
- `title` (TEXT, NOT NULL)
- `slug` (TEXT, NOT NULL)
- `description` (TEXT, NULL)
- `duration_seconds` (INTEGER, NOT NULL, CHECK > 0)
- `audio_storage_path` (TEXT, NOT NULL)
- `artwork_path` (TEXT, NULL)
- `track_number` (INTEGER, NULL, CHECK > 0)
- `release_date` (DATE, NOT NULL, DEFAULT `CURRENT_DATE`)
- `language` (TEXT, NOT NULL, DEFAULT `'en'`)
- `explicit_content` (BOOLEAN, NOT NULL, DEFAULT `false`)
- `status` (`track_status`, NOT NULL, DEFAULT `'draft'`)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 6. `track_genres`
M:N mapping between tracks and genres.
- `track_id` (UUID, FK → `tracks(id) ON DELETE CASCADE`)
- `genre_id` (UUID, FK → `genres(id) ON DELETE CASCADE`)
- `created_at` (TIMESTAMPTZ)
- *Primary Key*: `(track_id, genre_id)`

### 7. `track_rights`
Legal rights, agreements, and distribution permissions.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `track_id` (UUID, FK → `tracks(id) ON DELETE RESTRICT`)
- `rights_holder_name` (TEXT, NOT NULL)
- `source_name` (TEXT, NOT NULL)
- `source_url` (TEXT, NULL)
- `license_type` (TEXT, NOT NULL)
- `license_url` (TEXT, NULL)
- `attribution_text` (TEXT, NULL)
- `commercial_use_allowed` (BOOLEAN, NOT NULL, DEFAULT `false`)
- `streaming_allowed` (BOOLEAN, NOT NULL, DEFAULT `true`)
- `redistribution_allowed` (BOOLEAN, NOT NULL, DEFAULT `false`)
- `permission_evidence_path` (TEXT, NULL)
- `verification_status` (`verification_status`, NOT NULL, DEFAULT `'pending'`)
- `verified_by` (UUID, FK → `profiles(id) ON DELETE SET NULL`)
- `verified_at` (TIMESTAMPTZ, NULL)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 8. `playlists`
Curated and user-created playlists.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `owner_user_id` (UUID, FK → `profiles(id) ON DELETE CASCADE`)
- `title` (TEXT, NOT NULL)
- `description` (TEXT, NULL)
- `cover_image_path` (TEXT, NULL)
- `is_public` (BOOLEAN, NOT NULL, DEFAULT `true`)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 9. `playlist_tracks`
Ordered items within playlists.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `playlist_id` (UUID, FK → `playlists(id) ON DELETE CASCADE`)
- `track_id` (UUID, FK → `tracks(id) ON DELETE CASCADE`)
- `position` (INTEGER, NOT NULL, CHECK >= 0)
- `added_at` (TIMESTAMPTZ, NOT NULL, DEFAULT `now()`)
- *Constraints*: `UNIQUE (playlist_id, track_id)`, `UNIQUE (playlist_id, position)`

### 10. `user_likes`
Private liked tracks.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `user_id` (UUID, FK → `profiles(id) ON DELETE CASCADE`)
- `track_id` (UUID, FK → `tracks(id) ON DELETE CASCADE`)
- `created_at` (TIMESTAMPTZ)
- *Constraint*: `UNIQUE (user_id, track_id)`

### 11. `listening_history`
Streaming playback history events.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `user_id` (UUID, FK → `profiles(id) ON DELETE CASCADE`)
- `track_id` (UUID, FK → `tracks(id) ON DELETE CASCADE`)
- `played_at` (TIMESTAMPTZ, NOT NULL, DEFAULT `now()`)
- `listened_duration_seconds` (INTEGER, NOT NULL, DEFAULT 0, CHECK >= 0)
- `completed` (BOOLEAN, NOT NULL, DEFAULT `false`)
- `created_at` (TIMESTAMPTZ)

### 12. `artist_follows`
Artist subscriptions.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `user_id` (UUID, FK → `profiles(id) ON DELETE CASCADE`)
- `artist_id` (UUID, FK → `artists(id) ON DELETE CASCADE`)
- `created_at` (TIMESTAMPTZ)
- *Constraint*: `UNIQUE (user_id, artist_id)`

### 13. `upload_requests`
Artist upload submission pipeline.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `artist_id` (UUID, FK → `artists(id) ON DELETE RESTRICT`)
- `submitted_by` (UUID, FK → `profiles(id) ON DELETE RESTRICT`)
- `track_id` (UUID, FK → `tracks(id) ON DELETE SET NULL`)
- `submission_type` (TEXT, NOT NULL, CHECK IN `'single'`, `'album_track'`, `'remix'`, `'re-release'`)
- `status` (`submission_status`, NOT NULL, DEFAULT `'submitted'`)
- `review_notes` (TEXT, NULL)
- `reviewed_by` (UUID, FK → `profiles(id) ON DELETE SET NULL`)
- `reviewed_at` (TIMESTAMPTZ, NULL)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 14. `moderation_logs`
Immutable administrative audit log.
- `id` (UUID, PK, DEFAULT `gen_random_uuid()`)
- `moderator_user_id` (UUID, FK → `profiles(id) ON DELETE RESTRICT`)
- `target_type` (TEXT, NOT NULL, CHECK IN `'track'`, `'album'`, `'artist'`, `'track_rights'`, `'upload_request'`, `'profile'`, `'playlist'`)
- `target_id` (UUID, NOT NULL)
- `action` (TEXT, NOT NULL)
- `previous_status` (TEXT, NULL)
- `new_status` (TEXT, NULL)
- `notes` (TEXT, NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL, DEFAULT `now()`)
