# SONORA — Independent Music Discovery & Streaming Platform

> "Discover music. Discover yourself."

SONORA is a premium independent music discovery and streaming web application combining the intuitive usability and personalization of Spotify with the editorial elegance and depth of Apple Music.

---

## 🚀 Status & Roadmap

- [x] **Phase 1: Premium UI Foundation** (Landing page, discovery feeds, explore, search, library, playlists, albums, artist profile, responsive navigation, player UI).
- [x] **Phase 2: Supabase Backend & Database Foundation** (14 core tables, strict foreign keys, indexes, RLS policies, role escalation guards, rights verification engine, storage buckets, seed data, TypeScript types, typed repository modules).
- [x] **Phase 3: Supabase Authentication & User Management** (Signup with username verification & password strength meter, email confirmation callback, secure login, password recovery & reset, profile management, avatar uploads, user menu integration, route protection via proxy, role authorization helpers).
- [ ] **Phase 4: Artist Submission & Editorial Moderation Portal**
- [ ] **Phase 5: Secure Audio Streaming & Signed Playback Delivery**
- [ ] **Phase 6: Recommendation Engine & Music DNA Analytics**

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4, Lucide React, Zustand.
- **Backend & Database**: Supabase, PostgreSQL 17, Row Level Security (RLS), Supabase Storage.
- **Client SDKs**: `@supabase/supabase-js`, `@supabase/ssr`.

---

## 📁 Repository Structure

```
├── docs/                       # Comprehensive architectural documentation
│   ├── AUTHENTICATION_AND_USER_MANAGEMENT.md # Phase 3 auth architecture & workflows
│   ├── DATABASE_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── RLS_SECURITY.md
│   ├── STORAGE_ARCHITECTURE.md
│   └── SUPABASE_SETUP.md
├── scripts/
│   ├── test-auth-suite.ts      # Auth validation, schemas, and security test runner
│   └── test-schema-integrity.ts # Schema, security, and repository automated test runner
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   ├── components/             # Reusable UI components & layouts
│   ├── data/                   # Phase 1 mock fixtures & helper queries
│   ├── lib/
│   │   ├── env.ts              # Centralized environment variable validation
│   │   └── supabase/           # Browser, Server, Admin, and Middleware Supabase clients
│   ├── modules/                # Typed domain repository layer
│   │   ├── catalog/            # Tracks, albums, genres
│   │   ├── artists/            # Artist profiles & discography
│   │   ├── playlists/          # Public and user playlists
│   │   └── library/            # Likes, follows, playback history
│   ├── stores/                 # Zustand player and library stores
│   └── types/
│       ├── database.types.ts   # Strongly typed Supabase schema definitions
│       └── music.ts            # Frontend domain models
└── supabase/
    ├── config.toml             # Supabase CLI configuration
    ├── migrations/             # Version-controlled SQL migrations
    ├── tests/                  # PostgreSQL assertion test scripts
    └── seed.sql                # Fictional development fixtures
```

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to explore SONORA.

### 4. Run Schema & Security Tests
```bash
pnpm dlx tsx scripts/test-schema-integrity.ts
```

### 5. Production Build
```bash
pnpm build
```

---

## 🔒 Security Architecture Highlights

1. **Row Level Security**: Enabled across 100% of public tables.
2. **Role Escalation Protection**: The `guard_profiles_role_escalation` database trigger prevents listeners from self-promoting to privileged roles.
3. **Rights Verification Gate**: Tracks are never discoverable without an approved rights record with streaming authorization.
4. **Conflict of Interest Prevention**: Artists are strictly prohibited from approving their own track rights.
5. **Least-Privilege Storage**: Audio assets and legal rights evidence are strictly private buckets.

For full architectural details, consult the [docs/](file:///c:/Kuldeep's%20Work/Projects/SONORA/docs) directory.
