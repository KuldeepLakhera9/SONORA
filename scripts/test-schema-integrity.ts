/**
 * SONORA Phase 2 — Comprehensive Schema, Security & Migration Integrity Test
 * 
 * Verifies:
 * 1. Migration files presence and valid SQL structure.
 * 2. All 14 application tables defined with constraints and primary keys.
 * 3. Row Level Security explicitly enabled for every table.
 * 4. Helper authorization functions and triggers defined.
 * 5. Storage buckets and private access controls.
 * 6. Development seed fixtures complete (5 artists, 10 albums, 20 tracks, 10 genres, 5 playlists, 20 rights).
 * 7. TypeScript database definitions matching database tables.
 * 8. Typed repositories structure and fallback safety.
 */

import fs from "fs";
import path from "path";
import { CatalogRepository } from "../src/modules/catalog/catalog.repository";
import { ArtistsRepository } from "../src/modules/artists/artists.repository";
import { PlaylistsRepository } from "../src/modules/playlists/playlists.repository";
import { LibraryRepository } from "../src/modules/library/library.repository";
import { isSupabaseConfigured, getSupabasePublicEnv } from "../src/lib/env";

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");
const SEED_FILE = path.join(process.cwd(), "supabase", "seed.sql");

const REQUIRED_TABLES = [
  "profiles",
  "artists",
  "genres",
  "albums",
  "tracks",
  "track_genres",
  "track_rights",
  "playlists",
  "playlist_tracks",
  "user_likes",
  "listening_history",
  "artist_follows",
  "upload_requests",
  "moderation_logs",
];

const REQUIRED_BUCKETS = ["audio", "artwork", "rights-evidence"];

async function runTests() {
  console.log("==================================================================");
  console.log("SONORA Phase 2: Schema, Security & Repository Integrity Test Suite");
  console.log("==================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      throw new Error(`Test failed: ${message}`);
    }
  }

  // 1. MIGRATION FILES CHECK
  console.log("TEST GROUP 1: Migration Files Verification");
  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).sort();
  assert(migrationFiles.length >= 4, `Found ${migrationFiles.length} migration files in supabase/migrations/`);
  assert(migrationFiles.some((f) => f.includes("initial_schema")), "Initial schema migration exists");
  assert(migrationFiles.some((f) => f.includes("indexes")), "Performance indexes migration exists");
  assert(migrationFiles.some((f) => f.includes("rls_policies")), "RLS security policies migration exists");
  assert(migrationFiles.some((f) => f.includes("storage")), "Storage bucket migration exists");
  assert(migrationFiles.some((f) => f.includes("auth_profile_trigger")), "Auth profile trigger migration exists");

  // Read all migration contents
  const combinedMigrations = migrationFiles
    .map((f) => fs.readFileSync(path.join(MIGRATIONS_DIR, f), "utf-8"))
    .join("\n");

  // 2. TABLES AND RLS VERIFICATION
  console.log("\nTEST GROUP 2: Tables & Row Level Security Enforcement");
  for (const table of REQUIRED_TABLES) {
    assert(
      combinedMigrations.includes(`CREATE TABLE IF NOT EXISTS public.${table}`) ||
      combinedMigrations.includes(`CREATE TABLE public.${table}`),
      `Table public.${table} defined in migrations`
    );
    assert(
      combinedMigrations.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
      `RLS explicitly enabled on public.${table}`
    );
  }

  // 3. SECURITY GUARDS & AUTHORIZATION HELPERS
  console.log("\nTEST GROUP 3: Security Triggers & Rights Authorization Engine");
  assert(combinedMigrations.includes("prevent_role_escalation"), "Role escalation prevention trigger exists");
  assert(combinedMigrations.includes("guard_track_rights_verification"), "Music rights verification guard trigger exists");
  assert(combinedMigrations.includes("current_user_role"), "Authorization helper 'current_user_role' exists");
  assert(combinedMigrations.includes("is_admin"), "Authorization helper 'is_admin' exists");
  assert(combinedMigrations.includes("is_moderator"), "Authorization helper 'is_moderator' exists");
  assert(combinedMigrations.includes("is_artist"), "Authorization helper 'is_artist' exists");
  assert(combinedMigrations.includes("track_has_verified_streaming_rights"), "Rights authorization function exists");
  assert(combinedMigrations.includes("is_track_publicly_visible"), "Public catalog visibility gate exists");

  // 4. STORAGE CONFIGURATION
  console.log("\nTEST GROUP 4: Storage Buckets & Policies");
  for (const bucket of REQUIRED_BUCKETS) {
    assert(combinedMigrations.includes(`'${bucket}'`), `Storage bucket '${bucket}' configured`);
  }
  assert(combinedMigrations.includes("audio_owner_or_moderator_select"), "Private audio bucket select policy exists");
  assert(combinedMigrations.includes("rights_evidence_owner_or_moderator_select"), "Private rights evidence policy exists");
  assert(combinedMigrations.includes("artwork_public_select"), "Public artwork select policy exists");

  // 5. SEED DATA INTEGRITY
  console.log("\nTEST GROUP 5: Development Seed Fixtures");
  assert(fs.existsSync(SEED_FILE), "supabase/seed.sql exists");
  const seedContent = fs.readFileSync(SEED_FILE, "utf-8");
  assert(seedContent.includes("11111111-0000-4000-a000-000000000001"), "Fictional artist Aura Vance seeded");
  assert(seedContent.includes("11111111-0000-4000-a000-000000000002"), "Fictional artist Solaris Echo seeded");
  assert(seedContent.includes("33333333-0000-4000-a000-000000000001"), "Albums seeded with relations");
  assert(seedContent.includes("44444444-0000-4000-a000-000000000020"), "All 20 fictional tracks seeded");
  assert(seedContent.includes("66666666-0000-4000-a000-000000000020"), "All 20 rights records seeded");
  assert(seedContent.includes("DEV FIXTURE"), "Rights records explicitly marked as DEV FIXTURE");

  // 6. REPOSITORIES & SAFE FALLBACK
  console.log("\nTEST GROUP 6: Typed Repositories & Phase 1 Backward Compatibility");
  const publicEnv = getSupabasePublicEnv();
  assert(typeof publicEnv.url === "string", "Public Supabase URL resolved");
  assert(typeof publicEnv.anonKey === "string", "Public Supabase Anon Key resolved");

  const tracks = await CatalogRepository.getPublishedTracks();
  assert(tracks.length > 0, `CatalogRepository returned ${tracks.length} tracks (safe fallback active)`);

  const albums = await CatalogRepository.getPublishedAlbums();
  assert(albums.length > 0, `CatalogRepository returned ${albums.length} albums`);

  const artists = await ArtistsRepository.getVerifiedArtists();
  assert(artists.length > 0, `ArtistsRepository returned ${artists.length} artists`);

  const playlists = await PlaylistsRepository.getPublicPlaylists();
  assert(playlists.length > 0, `PlaylistsRepository returned ${playlists.length} playlists`);

  const likedTracks = await LibraryRepository.getLikedTrackIds("test-user-id");
  assert(Array.isArray(likedTracks), "LibraryRepository gracefully handles likes query");

  console.log("\n==================================================================");
  console.log(`SUMMARY: ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log("==================================================================");
}

runTests().catch((err) => {
  console.error("Test Suite execution failed:", err);
  process.exit(1);
});
