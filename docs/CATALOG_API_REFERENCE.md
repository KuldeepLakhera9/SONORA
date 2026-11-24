# SONORA — Catalog API Reference

All catalog endpoints are served under `/api/catalog/` with standardized JSON response envelopes, input validation via Zod, and rate-friendly cache headers.

## Standard Response Structure

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

Error response:
```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "VALIDATION_ERROR"
}
```

---

## Endpoints

### 1. Tracks API

#### `GET /api/catalog/tracks`
Retrieves a paginated list of rights-verified, published tracks.

- **Query Parameters**:
  - `page` (number, default: 1): Page number.
  - `limit` (number, 1-50, default: 20): Results per page.
  - `genre` (string, optional): Filter by primary genre.
  - `artistId` (uuid, optional): Filter by artist UUID.
  - `albumId` (uuid, optional): Filter by album UUID.
  - `sort` (enum, optional): `newest` | `popular` | `title` | `duration` (default: `newest`).

#### `GET /api/catalog/tracks/[id]`
Retrieves a single rights-verified track by UUID or slug.

---

### 2. Artists API

#### `GET /api/catalog/artists`
Retrieves verified independent creators.

- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, 1-50, default: 20)
  - `genre` (string, optional)
  - `sort` (`name` | `newest`, default: `name`)

#### `GET /api/catalog/artists/[slug]`
Retrieves full artist profile, biography, location, and verified discography.

---

### 3. Albums API

#### `GET /api/catalog/albums`
Retrieves published albums, EPs, and singles.

- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, 1-50, default: 20)
  - `artistId` (uuid, optional)
  - `albumType` (`album` | `EP` | `single` | `compilation`, optional)
  - `sort` (`newest` | `title`, default: `newest`)

#### `GET /api/catalog/albums/[slug]`
Retrieves album details including track count, total duration, and tracklist.

---

### 4. Genres API

#### `GET /api/catalog/genres`
Returns the taxonomy of musical genres with colors, descriptions, and cover artwork.

#### `GET /api/catalog/genres/[slug]`
Returns genre metadata and top tracks matching the genre.

---

### 5. Playlists API

#### `GET /api/catalog/playlists`
Returns public and editorial curated playlists.

- **Query Parameters**:
  - `curated` (boolean, optional): Filter by editorial status.
  - `limit` (number, 1-50, default: 20)

---

### 6. Discovery Curations

#### `GET /api/catalog/featured`
Returns editorial featured hero and spotlight tracks.

#### `GET /api/catalog/new-releases`
Returns fresh albums and EPs ordered by release date descending.

#### `GET /api/catalog/trending`
Returns high-velocity tracks ordered by `play_count DESC`.

#### `GET /api/catalog/recently-added`
Returns newest tracks added to the catalog.

---

### 7. Global Search API

#### `GET /api/catalog/search`
Multi-entity fuzzy search across tracks, artists, albums, and playlists.

- **Query Parameters**:
  - `q` (string, 1-100 characters, required): Search term.
  - `type` (`all` | `tracks` | `artists` | `albums` | `playlists`, default: `all`)
  - `limit` (number, 1-50, default: 20)

- **Response Body**:
```json
{
  "success": true,
  "data": {
    "query": "Solaris",
    "tracks": [ ... ],
    "artists": [ ... ],
    "albums": [ ... ],
    "playlists": [ ... ]
  }
}
```
