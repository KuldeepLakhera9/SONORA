# SONORA — Catalog Setup & Migration Guide

## 1. Prerequisites

- PostgreSQL 15+ or Supabase CLI (`supabase`)
- Node.js 20+ and pnpm

---

## 2. Apply Migrations

To apply the complete database schema including Phase 4 catalog discovery views and trigram indexes:

```bash
# Apply migrations sequentially using Supabase CLI
supabase db push

# Or execute migrations directly against your PostgreSQL database:
psql "$DATABASE_URL" -f supabase/migrations/20261124000001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/20261124000002_indexes_and_constraints.sql
psql "$DATABASE_URL" -f supabase/migrations/20261124000003_rls_policies.sql
psql "$DATABASE_URL" -f supabase/migrations/20261124000004_storage_configuration.sql
psql "$DATABASE_URL" -f supabase/migrations/20261124000005_auth_profile_trigger.sql
psql "$DATABASE_URL" -f supabase/migrations/20261124000006_catalog_discovery_indexes.sql
```

---

## 3. Seed Development Fixtures

To populate the catalog with verified fictional independent artists, albums, tracks, and legal rights:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

This seeds:
- 8 Verified Artists (Aura Vance, Solaris Echo, Komorebi Duo, Velvet Bloom, etc.)
- 9 Published Albums & EPs (Glacial Resonance, Neon Starlight, etc.)
- 18 Rights-Verified Published Tracks
- 18 Verified Rights Records with `streaming_allowed = TRUE`
- 8 Curated Public Playlists

---

## 4. Environment Variables

Ensure `.env.local` includes your Supabase project credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

If these environment variables are absent, SONORA automatically falls back to local data fixtures so development never stalls.

---

## 5. Verify Catalog Test Suites

Run the automated test suites:

```bash
# 1. Catalog & Discovery Suite (35 tests)
pnpm dlx tsx scripts/test-catalog-suite.ts

# 2. Authentication & Security Suite (36 tests)
pnpm dlx tsx scripts/test-auth-suite.ts

# 3. Database Schema & RLS Integrity Suite (62 tests)
pnpm dlx tsx scripts/test-schema-integrity.ts
```

All 133 tests must pass with 0 failures.
