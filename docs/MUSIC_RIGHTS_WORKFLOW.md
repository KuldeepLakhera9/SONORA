# SONORA — Music Rights & Licensing Verification Workflow

## 1. Compliance Principles

As an independent music discovery platform, SONORA adheres to strict legal compliance and digital rights attribution. Music catalog discovery is bound to verified ownership:

1. **No Unverified Tracks in Public Surfaces**: Music is invisible to listeners until rights are authenticated.
2. **Streaming Revocation**: Disabling `streaming_allowed` instantly purges the track from all discovery endpoints without deleting catalog metadata.
3. **Zero Audio Exfiltration**: Storage paths and signed URLs are never exposed in catalog discovery payloads.

---

## 2. The Verification Pipeline

```
[Artist Submits Track] 
       │
       ▼
[track_status = 'pending_review']
       │
       ▼
[Moderator / Admin Review]
  - Audio content verification
  - Originality & rights documentation check
  - Explicit content classification
       │
       ├── Reject ───► [track_status = 'rejected', rights.verification = 'rejected']
       │
       └── Approve ──► [track_status = 'published', rights.verification = 'verified', streaming_allowed = TRUE]
                             │
                             ▼
              [public_catalog_tracks View Unlocks Track]
                             │
                             ▼
              [Live on Home, Explore, and Search]
```

---

## 3. Database Rights Table (`track_rights`)

```sql
CREATE TABLE public.track_rights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  rights_owner_id UUID NOT NULL REFERENCES public.profiles(id),
  rights_type TEXT NOT NULL CHECK (rights_type IN ('exclusive', 'non_exclusive', 'public_domain')),
  is_original_work BOOLEAN NOT NULL DEFAULT TRUE,
  has_third_party_samples BOOLEAN NOT NULL DEFAULT FALSE,
  sample_license_details TEXT,
  streaming_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  download_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  permission_evidence_path TEXT,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. Rights Revocation & Expiration

When a rights dispute arises or a licensing term concludes:
```sql
UPDATE public.track_rights
SET streaming_allowed = FALSE,
    verification_status = 'expired',
    updated_at = NOW()
WHERE track_id = '<TRACK_UUID>';
```

Because `public_catalog_tracks` enforces `tr.streaming_allowed = TRUE AND tr.verification_status = 'verified'`, the track disappears from public search, playlists, and discover feeds **immediately** upon query execution without requiring cache purges or server restarts.
