# SONORA — Supabase Setup & Developer Guide

## 1. Overview

SONORA uses Supabase for database, authentication foundations, Row Level Security, and object storage. The project is fully configured for both **local development with the Supabase CLI** and **hosted Supabase Cloud deployment**.

---

## 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required credentials:

```env
# Public Supabase credentials (browser-safe)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-or-cloud-anon-key

# Privileged Supabase Service Role Key (SERVER ONLY — NEVER EXPOSE TO CLIENT)
SUPABASE_SERVICE_ROLE_KEY=your-local-or-cloud-service-role-key
```

> **Safe Local Fallback**: When Supabase credentials are not yet configured in local development, SONORA automatically falls back to Phase 1 mock fixtures, ensuring pages and builds never crash.

---

## 3. Local Supabase CLI Workflow

### Prerequisites
- Docker Desktop installed and running.
- Node.js 20+ and pnpm installed.

### 1. Initialize Supabase
```bash
npx supabase init
```
*(Already initialized in `supabase/config.toml`)*

### 2. Start Local Supabase
```bash
npx supabase start
```
This boots PostgreSQL, PostgREST, Supabase Auth, Storage, and Studio at `http://127.0.0.1:54323`.

### 3. Apply Migrations & Seed Data
```bash
# Applies all migrations in supabase/migrations/ and executes supabase/seed.sql
npx supabase db reset
```

### 4. Generate Fresh TypeScript Types
```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

### 5. Stop Local Supabase
```bash
npx supabase stop
```

---

## 4. Remote Supabase Cloud Workflow

### 1. Link Remote Project
```bash
npx supabase link --project-ref your-project-ref
```

### 2. Push Migrations to Remote
```bash
npx supabase db push
```

### 3. Seed Remote Development Instance (Dev/Staging Only)
```bash
npx supabase db seed
```

---

## 5. Running Schema & Security Tests

SONORA includes an automated integrity test suite verifying all 14 tables, constraints, triggers, storage buckets, seed records, and repository fallbacks:

```bash
pnpm dlx tsx scripts/test-schema-integrity.ts
```
