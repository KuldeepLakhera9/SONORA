-- ==============================================================================
-- SONORA DEVELOPMENT SEED DATA
-- ==============================================================================
-- Description: Fictional seed data for local development and testing.
-- Strict Policy: All artist names, titles, lyrics, and metadata are 100% fictional.
-- Rights records are explicitly flagged as 'DEV_FIXTURE_TESTING_ONLY'.
-- ==============================================================================

-- 1. SEED AUTH USERS (Enables profiles foreign keys in local Supabase)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
    ('00000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@sonora.internal', crypt('Password123!', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'moderator@sonora.internal', crypt('Password123!', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'auravance@sonora.internal', crypt('Password123!', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'solarisecho@sonora.internal', crypt('Password123!', gen_salt('bf')), now(), now(), now()),
    ('00000000-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'listener@sonora.internal', crypt('Password123!', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. SEED PROFILES
INSERT INTO public.profiles (id, username, display_name, avatar_path, bio, role, is_active)
VALUES
    ('00000000-0000-4000-a000-000000000001', 'admin_sonora', 'SONORA Executive Lead', 'artwork/avatars/admin.jpg', 'Platform architecture and catalog integrity lead.', 'admin', true),
    ('00000000-0000-4000-a000-000000000002', 'curator_elena', 'Elena Rostova', 'artwork/avatars/elena.jpg', 'Head of Independent Rights Verification and Editorial Curation.', 'moderator', true),
    ('00000000-0000-4000-a000-000000000003', 'aura_vance', 'Aura Vance', 'artwork/avatars/aura.jpg', 'Ambient composer and modular synth producer based in Reykjavik.', 'artist', true),
    ('00000000-0000-4000-a000-000000000004', 'solaris_echo', 'Solaris Echo', 'artwork/avatars/solaris.jpg', 'Analog synthwave and dream-pop multi-instrumentalist from Kyoto.', 'artist', true),
    ('00000000-0000-4000-a000-000000000005', 'maya_sound', 'Maya Chen', 'artwork/avatars/maya.jpg', 'Acoustic explorer and indie music enthusiast.', 'listener', true)
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    bio = EXCLUDED.bio,
    role = EXCLUDED.role;

-- 3. SEED GENRES (10 distinct genres)
INSERT INTO public.genres (id, name, slug, description, image_path)
VALUES
    ('22222222-0000-4000-a000-000000000001', 'Ambient', 'ambient', 'Subtle, immersive soundscapes focused on atmospheric textures.', 'artwork/genres/ambient.jpg'),
    ('22222222-0000-4000-a000-000000000002', 'Electronic', 'electronic', 'Synthesizer-driven modern electronic rhythms and experiments.', 'artwork/genres/electronic.jpg'),
    ('22222222-0000-4000-a000-000000000003', 'Indie', 'indie', 'Authentic DIY and independent singer-songwriter expressions.', 'artwork/genres/indie.jpg'),
    ('22222222-0000-4000-a000-000000000004', 'Lo-Fi', 'lo-fi', 'Warm, tape-saturated down-tempo beats for deep focus.', 'artwork/genres/lo-fi.jpg'),
    ('22222222-0000-4000-a000-000000000005', 'Neo-Soul', 'neo-soul', 'Rich vocal harmonies fused with classic groove and jazz chords.', 'artwork/genres/neo-soul.jpg'),
    ('22222222-0000-4000-a000-000000000006', 'Post-Rock', 'post-rock', 'Cinematic instrumental crescendos and reverberant guitars.', 'artwork/genres/post-rock.jpg'),
    ('22222222-0000-4000-a000-000000000007', 'Synthwave', 'synthwave', 'Nostalgic neon retro-futuristic analog arpeggios.', 'artwork/genres/synthwave.jpg'),
    ('22222222-0000-4000-a000-000000000008', 'Classical', 'classical', 'Contemporary neoclassical piano and orchestral arrangements.', 'artwork/genres/classical.jpg'),
    ('22222222-0000-4000-a000-000000000009', 'Jazz', 'jazz', 'Modal progressions, acoustic double bass, and fluid improvisation.', 'artwork/genres/jazz.jpg'),
    ('22222222-0000-4000-a000-000000000010', 'Pop', 'pop', 'Catchy hooks, vibrant arrangements, and melodic precision.', 'artwork/genres/pop.jpg')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED ARTISTS (5 fictional artists)
INSERT INTO public.artists (id, owner_user_id, stage_name, slug, biography, profile_image_path, cover_image_path, country, region, primary_genre, verification_status)
VALUES
    ('11111111-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000003', 'Aura Vance', 'aura-vance', 'Blending arctic field recordings with analog modular synthesizers, Aura Vance crafts serene, meditative acoustic architecture.', 'artwork/artists/aura-vance.jpg', 'artwork/artists/aura-vance-cover.jpg', 'Iceland', 'Capital Region', 'Ambient', 'verified'),
    ('11111111-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000004', 'Solaris Echo', 'solaris-echo', 'Kyoto-based producer exploring neon retro-futurism with vintage Roland synthesizers and shimmering guitars.', 'artwork/artists/solaris-echo.jpg', 'artwork/artists/solaris-echo-cover.jpg', 'Japan', 'Kansai', 'Synthwave', 'verified'),
    ('11111111-0000-4000-a000-000000000003', NULL, 'Komorebi Duo', 'komorebi-duo', 'An acoustic and lo-fi collaboration exploring the interplay of sunlight through leaves using cello, tape loops, and rhodes.', 'artwork/artists/komorebi.jpg', 'artwork/artists/komorebi-cover.jpg', 'Norway', 'Vestland', 'Lo-Fi', 'verified'),
    ('11111111-0000-4000-a000-000000000004', NULL, 'Velvet Bloom', 'velvet-bloom', 'Sultry vocals and midnight chords combining golden-era R&B with modern neo-soul textures.', 'artwork/artists/velvet-bloom.jpg', 'artwork/artists/velvet-bloom-cover.jpg', 'United Kingdom', 'London', 'Neo-Soul', 'verified'),
    ('11111111-0000-4000-a000-000000000005', NULL, 'The Drift Collective', 'the-drift-collective', 'A transatlantic ensemble known for expansive dynamic range, slow-burning crescendos, and cinematic post-rock.', 'artwork/artists/drift.jpg', 'artwork/artists/drift-cover.jpg', 'Canada', 'Quebec', 'Post-Rock', 'verified')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED ALBUMS (10 fictional albums across the 5 artists)
INSERT INTO public.albums (id, artist_id, title, slug, description, cover_image_path, release_date, album_type, status)
VALUES
    ('33333333-0000-4000-a000-000000000001', '11111111-0000-4000-a000-000000000001', 'Glacial Resonance', 'glacial-resonance', 'Recorded inside ice caves with contact microphones and analog reverbs.', 'artwork/albums/glacial-resonance.jpg', '2025-01-15', 'album', 'published'),
    ('33333333-0000-4000-a000-000000000002', '11111111-0000-4000-a000-000000000001', 'Permafrost Echoes', 'permafrost-echoes', 'A reflective ambient EP composed during winter solstice.', 'artwork/albums/permafrost.jpg', '2025-06-20', 'EP', 'published'),
    ('33333333-0000-4000-a000-000000000003', '11111111-0000-4000-a000-000000000002', 'Neon Starlight', 'neon-starlight', 'High-energy retro synthwave celebration with lush analog synthesizers.', 'artwork/albums/neon-starlight.jpg', '2024-11-10', 'album', 'published'),
    ('33333333-0000-4000-a000-000000000004', '11111111-0000-4000-a000-000000000002', 'Midnight Drift', 'midnight-drift', 'Down-tempo synth cruise through quiet coastal highways.', 'artwork/albums/midnight-drift.jpg', '2025-04-01', 'single', 'published'),
    ('33333333-0000-4000-a000-000000000005', '11111111-0000-4000-a000-000000000003', 'Quiet Forest Tapes', 'quiet-forest-tapes', 'Gentle acoustic lo-fi melodies recorded on vintage reel-to-reel.', 'artwork/albums/forest-tapes.jpg', '2024-09-18', 'album', 'published'),
    ('33333333-0000-4000-a000-000000000006', '11111111-0000-4000-a000-000000000003', 'Morning Tea Study', 'morning-tea-study', 'Piano and acoustic guitar textures designed for calm focus.', 'artwork/albums/morning-tea.jpg', '2025-03-12', 'EP', 'published'),
    ('33333333-0000-4000-a000-000000000007', '11111111-0000-4000-a000-000000000004', 'Midnight Silk', 'midnight-silk', 'Silky basslines and intimate vocals exploring love in late hours.', 'artwork/albums/midnight-silk.jpg', '2024-12-05', 'album', 'published'),
    ('33333333-0000-4000-a000-000000000008', '11111111-0000-4000-a000-000000000004', 'Golden Hour Groove', 'golden-hour-groove', 'Warm sunset neo-soul single featuring brass and rhodes.', 'artwork/albums/golden-hour.jpg', '2025-05-18', 'single', 'published'),
    ('33333333-0000-4000-a000-000000000009', '11111111-0000-4000-a000-000000000005', 'Monuments of Mist', 'monuments-of-mist', 'A 45-minute journey of building post-rock soundscapes.', 'artwork/albums/monuments.jpg', '2024-08-30', 'album', 'published'),
    ('33333333-0000-4000-a000-000000000010', '11111111-0000-4000-a000-000000000005', 'Horizon Line', 'horizon-line', 'Atmospheric guitar EP exploring distance and return.', 'artwork/albums/horizon.jpg', '2025-02-14', 'EP', 'published')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED TRACKS (20 fictional tracks across the 10 albums)
INSERT INTO public.tracks (id, artist_id, album_id, title, slug, description, duration_seconds, audio_storage_path, artwork_path, track_number, release_date, language, explicit_content, status)
VALUES
    ('44444444-0000-4000-a000-000000000001', '11111111-0000-4000-a000-000000000001', '33333333-0000-4000-a000-000000000001', 'Subzero Tides', 'subzero-tides', 'Deep sub-bass swells evoking ocean water beneath ice.', 284, 'audio/demo/subzero-tides.mp3', 'artwork/tracks/subzero-tides.jpg', 1, '2025-01-15', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000002', '11111111-0000-4000-a000-000000000001', '33333333-0000-4000-a000-000000000001', 'Crystalline Waters', 'crystalline-waters', 'Glacial meltwater captured with analog tape delays.', 215, 'audio/demo/crystalline-waters.mp3', 'artwork/tracks/crystalline.jpg', 2, '2025-01-15', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000003', '11111111-0000-4000-a000-000000000002', '33333333-0000-4000-a000-000000000002', 'Solstice Drone', 'solstice-drone', 'Continuous modular synth chord evolving over seven minutes.', 420, 'audio/demo/solstice-drone.mp3', 'artwork/tracks/solstice.jpg', 1, '2025-06-20', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000004', '11111111-0000-4000-a000-000000000002', '33333333-0000-4000-a000-000000000002', 'Aurora Lights', 'aurora-lights', 'Shimmering harmonics imitating electromagnetic activity.', 312, 'audio/demo/aurora-lights.mp3', 'artwork/tracks/aurora.jpg', 2, '2025-06-20', 'en', false, 'published'),

    ('44444444-0000-4000-a000-000000000005', '11111111-0000-4000-a000-000000000002', '33333333-0000-4000-a000-000000000003', 'Chroma Drift', 'chroma-drift', 'Pulsing synth arpeggios over warm vintage LinnDrum beats.', 275, 'audio/demo/chroma-drift.mp3', 'artwork/tracks/chroma-drift.jpg', 1, '2024-11-10', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000006', '11111111-0000-4000-a000-000000000002', '33333333-0000-4000-a000-000000000003', 'Electric Boulevard', 'electric-boulevard', 'Driving retro bassline reminiscent of 1980s Tokyo nightlife.', 248, 'audio/demo/electric-boulevard.mp3', 'artwork/tracks/electric.jpg', 2, '2024-11-10', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000007', '11111111-0000-4000-a000-000000000002', '33333333-0000-4000-a000-000000000004', 'Highway Sunset', 'highway-sunset', 'Mellow synth chords for evening car drives.', 290, 'audio/demo/highway-sunset.mp3', 'artwork/tracks/highway.jpg', 1, '2025-04-01', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000008', '11111111-0000-4000-a000-000000000002', '33333333-0000-4000-a000-000000000004', 'Coastal Fog', 'coastal-fog', 'Melancholic analog pads and subtle vocal fragments.', 210, 'audio/demo/coastal-fog.mp3', 'artwork/tracks/coastal.jpg', 2, '2025-04-01', 'en', false, 'published'),

    ('44444444-0000-4000-a000-000000000009', '11111111-0000-4000-a000-000000000003', '33333333-0000-4000-a000-000000000005', 'Woodsmoke Memories', 'woodsmoke-memories', 'Warm rhodes keys and acoustic nylon guitar over crackle.', 198, 'audio/demo/woodsmoke.mp3', 'artwork/tracks/woodsmoke.jpg', 1, '2024-09-18', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000010', '11111111-0000-4000-a000-000000000003', '33333333-0000-4000-a000-000000000005', 'Rain On The Canopy', 'rain-on-canopy', 'Field recordings of summer rainfall blended with cello.', 224, 'audio/demo/rain-canopy.mp3', 'artwork/tracks/rain.jpg', 2, '2024-09-18', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000011', '11111111-0000-4000-a000-000000000003', '33333333-0000-4000-a000-000000000006', 'First Light Brew', 'first-light-brew', 'Relaxing fingerpicked acoustic guitar in DADGAD tuning.', 175, 'audio/demo/first-light.mp3', 'artwork/tracks/first-light.jpg', 1, '2025-03-12', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000012', '11111111-0000-4000-a000-000000000003', '33333333-0000-4000-a000-000000000006', 'Quiet Room', 'quiet-room', 'Intimate upright piano recorded with room resonance.', 205, 'audio/demo/quiet-room.mp3', 'artwork/tracks/quiet-room.jpg', 2, '2025-03-12', 'en', false, 'published'),

    ('44444444-0000-4000-a000-000000000013', '11111111-0000-4000-a000-000000000004', '33333333-0000-4000-a000-000000000007', 'Silk & Smoke', 'silk-and-smoke', 'Intimate R&B groove with deep Moog bass and breathy vocals.', 262, 'audio/demo/silk-smoke.mp3', 'artwork/tracks/silk-smoke.jpg', 1, '2024-12-05', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000014', '11111111-0000-4000-a000-000000000004', '33333333-0000-4000-a000-000000000007', 'Velvet Solitude', 'velvet-solitude', 'Late night contemplation with jazz brass and guitar.', 240, 'audio/demo/velvet-solitude.mp3', 'artwork/tracks/velvet.jpg', 2, '2024-12-05', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000015', '11111111-0000-4000-a000-000000000004', '33333333-0000-4000-a000-000000000008', 'Sunset Terrace', 'sunset-terrace', 'Uplifting neo-soul rhythm with funky clean guitar strums.', 228, 'audio/demo/sunset-terrace.mp3', 'artwork/tracks/terrace.jpg', 1, '2025-05-18', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000016', '11111111-0000-4000-a000-000000000004', '33333333-0000-4000-a000-000000000008', 'Honey & Amber', 'honey-and-amber', 'Slow-tempo warm acoustic soul ballad.', 255, 'audio/demo/honey-amber.mp3', 'artwork/tracks/honey.jpg', 2, '2025-05-18', 'en', false, 'published'),

    ('44444444-0000-4000-a000-000000000017', '11111111-0000-4000-a000-000000000005', '33333333-0000-4000-a000-000000000009', 'Cathedral Of Clouds', 'cathedral-of-clouds', 'Towering post-rock crescendo with four interwoven guitars.', 485, 'audio/demo/cathedral-clouds.mp3', 'artwork/tracks/cathedral.jpg', 1, '2024-08-30', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000018', '11111111-0000-4000-a000-000000000005', '33333333-0000-4000-a000-000000000009', 'Valley In Reverse', 'valley-in-reverse', 'Reverse guitar reverbs leading into an explosive percussion climax.', 390, 'audio/demo/valley.mp3', 'artwork/tracks/valley.jpg', 2, '2024-08-30', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000019', '11111111-0000-4000-a000-000000000005', '33333333-0000-4000-a000-000000000010', 'Distant Beacon', 'distant-beacon', 'Minimalist tremolo guitars echoing across vast stereo width.', 340, 'audio/demo/distant-beacon.mp3', 'artwork/tracks/beacon.jpg', 1, '2025-02-14', 'en', false, 'published'),
    ('44444444-0000-4000-a000-000000000020', '11111111-0000-4000-a000-000000000005', '33333333-0000-4000-a000-000000000010', 'Northern Fjord', 'northern-fjord', 'Stirring acoustic post-rock anthem with cello and bowed cymbals.', 410, 'audio/demo/northern-fjord.mp3', 'artwork/tracks/fjord.jpg', 2, '2025-02-14', 'en', false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED TRACK_GENRES
INSERT INTO public.track_genres (track_id, genre_id)
VALUES
    ('44444444-0000-4000-a000-000000000001', '22222222-0000-4000-a000-000000000001'), -- Ambient
    ('44444444-0000-4000-a000-000000000001', '22222222-0000-4000-a000-000000000002'), -- Electronic
    ('44444444-0000-4000-a000-000000000002', '22222222-0000-4000-a000-000000000001'),
    ('44444444-0000-4000-a000-000000000003', '22222222-0000-4000-a000-000000000001'),
    ('44444444-0000-4000-a000-000000000004', '22222222-0000-4000-a000-000000000001'),

    ('44444444-0000-4000-a000-000000000005', '22222222-0000-4000-a000-000000000007'), -- Synthwave
    ('44444444-0000-4000-a000-000000000005', '22222222-0000-4000-a000-000000000002'), -- Electronic
    ('44444444-0000-4000-a000-000000000006', '22222222-0000-4000-a000-000000000007'),
    ('44444444-0000-4000-a000-000000000007', '22222222-0000-4000-a000-000000000007'),
    ('44444444-0000-4000-a000-000000000008', '22222222-0000-4000-a000-000000000007'),

    ('44444444-0000-4000-a000-000000000009', '22222222-0000-4000-a000-000000000004'), -- Lo-Fi
    ('44444444-0000-4000-a000-000000000010', '22222222-0000-4000-a000-000000000004'),
    ('44444444-0000-4000-a000-000000000011', '22222222-0000-4000-a000-000000000003'), -- Indie
    ('44444444-0000-4000-a000-000000000012', '22222222-0000-4000-a000-000000000008'), -- Classical

    ('44444444-0000-4000-a000-000000000013', '22222222-0000-4000-a000-000000000005'), -- Neo-Soul
    ('44444444-0000-4000-a000-000000000014', '22222222-0000-4000-a000-000000000005'),
    ('44444444-0000-4000-a000-000000000015', '22222222-0000-4000-a000-000000000005'),
    ('44444444-0000-4000-a000-000000000016', '22222222-0000-4000-a000-000000000009'), -- Jazz

    ('44444444-0000-4000-a000-000000000017', '22222222-0000-4000-a000-000000000006'), -- Post-Rock
    ('44444444-0000-4000-a000-000000000018', '22222222-0000-4000-a000-000000000006'),
    ('44444444-0000-4000-a000-000000000019', '22222222-0000-4000-a000-000000000006'),
    ('44444444-0000-4000-a000-000000000020', '22222222-0000-4000-a000-000000000006')
ON CONFLICT (track_id, genre_id) DO NOTHING;

-- 8. SEED TRACK_RIGHTS (20 verified rights records authorizing streaming)
-- CRITICAL NOTE: These are strictly fictional development test fixtures.
INSERT INTO public.track_rights (
    id, track_id, rights_holder_name, source_name, source_url, license_type, license_url, attribution_text,
    commercial_use_allowed, streaming_allowed, redistribution_allowed, permission_evidence_path,
    verification_status, verified_by, verified_at
)
VALUES
    ('66666666-0000-4000-a000-000000000001', '44444444-0000-4000-a000-000000000001', 'Aura Vance & Subpolar Soundworks', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-01', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Aura Vance. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/aura-vance-license-01.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000002', '44444444-0000-4000-a000-000000000002', 'Aura Vance & Subpolar Soundworks', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-02', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Aura Vance. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/aura-vance-license-02.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000003', '44444444-0000-4000-a000-000000000003', 'Aura Vance & Subpolar Soundworks', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-03', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Aura Vance. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/aura-vance-license-03.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000004', '44444444-0000-4000-a000-000000000004', 'Aura Vance & Subpolar Soundworks', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-04', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Aura Vance. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/aura-vance-license-04.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),

    ('66666666-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000005', 'Solaris Echo Music Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-05', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Solaris Echo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/solaris-echo-license-01.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000006', '44444444-0000-4000-a000-000000000006', 'Solaris Echo Music Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-06', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Solaris Echo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/solaris-echo-license-02.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000007', '44444444-0000-4000-a000-000000000007', 'Solaris Echo Music Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-07', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Solaris Echo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/solaris-echo-license-03.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000008', '44444444-0000-4000-a000-000000000008', 'Solaris Echo Music Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-08', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed & produced by Solaris Echo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/solaris-echo-license-04.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),

    ('66666666-0000-4000-a000-000000000009', '44444444-0000-4000-a000-000000000009', 'Komorebi Sound Archives', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-09', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Komorebi Duo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/komorebi-license-01.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000010', '44444444-0000-4000-a000-000000000010', 'Komorebi Sound Archives', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-10', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Komorebi Duo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/komorebi-license-02.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000011', '44444444-0000-4000-a000-000000000011', 'Komorebi Sound Archives', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-11', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Komorebi Duo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/komorebi-license-03.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000012', '44444444-0000-4000-a000-000000000012', 'Komorebi Sound Archives', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-12', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Komorebi Duo. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/komorebi-license-04.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),

    ('66666666-0000-4000-a000-000000000013', '44444444-0000-4000-a000-000000000013', 'Velvet Bloom & Midnight Records', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-13', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Velvet Bloom. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/velvet-bloom-license-01.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000014', '44444444-0000-4000-a000-000000000014', 'Velvet Bloom & Midnight Records', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-14', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Velvet Bloom. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/velvet-bloom-license-02.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000015', '44444444-0000-4000-a000-000000000015', 'Velvet Bloom & Midnight Records', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-15', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Velvet Bloom. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/velvet-bloom-license-03.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000016', '44444444-0000-4000-a000-000000000016', 'Velvet Bloom & Midnight Records', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-16', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by Velvet Bloom. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/velvet-bloom-license-04.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),

    ('66666666-0000-4000-a000-000000000017', '44444444-0000-4000-a000-000000000017', 'The Drift Collective Audio Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-17', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by The Drift Collective. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/drift-collective-license-01.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000018', '44444444-0000-4000-a000-000000000018', 'The Drift Collective Audio Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-18', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by The Drift Collective. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/drift-collective-license-02.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000019', '44444444-0000-4000-a000-000000000019', 'The Drift Collective Audio Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-19', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by The Drift Collective. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/drift-collective-license-03.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now()),
    ('66666666-0000-4000-a000-000000000020', '44444444-0000-4000-a000-000000000020', 'The Drift Collective Audio Ltd', 'Direct Artist Submission [DEV FIXTURE]', 'https://sonora.internal/contracts/dev-20', 'SONORA-INDIE-DIRECT-V1', 'https://sonora.internal/licenses/indie-direct', 'Music composed by The Drift Collective. Licensed exclusively for SONORA development.', false, true, false, 'rights-evidence/dev/drift-collective-license-04.pdf', 'verified', '00000000-0000-4000-a000-000000000002', now())
ON CONFLICT (id) DO NOTHING;

-- 9. SEED PLAYLISTS (5 curated & user playlists)
INSERT INTO public.playlists (id, owner_user_id, title, description, cover_image_path, is_public)
VALUES
    ('55555555-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000002', 'Deep Focus Flow', 'Introspective ambient and lo-fi textures engineered for uninterrupted creative concentration.', 'artwork/playlists/focus.jpg', true),
    ('55555555-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000002', 'Midnight Neon Cruise', 'Cinematic retro synthwave and electronic rhythms for night drives.', 'artwork/playlists/neon-cruise.jpg', true),
    ('55555555-0000-4000-a000-000000000003', '00000000-0000-4000-a000-000000000002', 'Nordic Horizons', 'Atmospheric acoustic instruments and glacial field soundscapes.', 'artwork/playlists/nordic.jpg', true),
    ('55555555-0000-4000-a000-000000000004', '00000000-0000-4000-a000-000000000002', 'Golden Hour Soul', 'Sultry neo-soul, warm rhodes, and intimate vocal arrangements.', 'artwork/playlists/golden-soul.jpg', true),
    ('55555555-0000-4000-a000-000000000005', '00000000-0000-4000-a000-000000000005', 'Maya''s Private Sanctuary', 'A private personal playlist curated by Maya Chen.', 'artwork/playlists/maya-private.jpg', false)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED PLAYLIST_TRACKS
INSERT INTO public.playlist_tracks (id, playlist_id, track_id, position)
VALUES
    -- Playlist 1: Deep Focus Flow (ambient/lo-fi tracks)
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000001', '44444444-0000-4000-a000-000000000001', 0),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000001', '44444444-0000-4000-a000-000000000009', 1),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000001', '44444444-0000-4000-a000-000000000010', 2),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000001', '44444444-0000-4000-a000-000000000003', 3),

    -- Playlist 2: Midnight Neon Cruise (synthwave)
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000002', '44444444-0000-4000-a000-000000000005', 0),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000002', '44444444-0000-4000-a000-000000000006', 1),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000002', '44444444-0000-4000-a000-000000000007', 2),

    -- Playlist 3: Nordic Horizons (ambient & post-rock)
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000003', '44444444-0000-4000-a000-000000000002', 0),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000003', '44444444-0000-4000-a000-000000000017', 1),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000003', '44444444-0000-4000-a000-000000000020', 2),

    -- Playlist 4: Golden Hour Soul
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000004', '44444444-0000-4000-a000-000000000013', 0),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000004', '44444444-0000-4000-a000-000000000014', 1),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000004', '44444444-0000-4000-a000-000000000015', 2),

    -- Playlist 5: Maya's Private Sanctuary
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000001', 0),
    (gen_random_uuid(), '55555555-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000013', 1)
ON CONFLICT DO NOTHING;

-- 11. SEED USER_LIKES (Maya Chen liking tracks)
INSERT INTO public.user_likes (id, user_id, track_id)
VALUES
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000001'),
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000005'),
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000013')
ON CONFLICT (user_id, track_id) DO NOTHING;

-- 12. SEED ARTIST_FOLLOWS (Maya following artists)
INSERT INTO public.artist_follows (id, user_id, artist_id)
VALUES
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '11111111-0000-4000-a000-000000000001'),
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '11111111-0000-4000-a000-000000000004')
ON CONFLICT (user_id, artist_id) DO NOTHING;

-- 13. SEED LISTENING_HISTORY
INSERT INTO public.listening_history (id, user_id, track_id, played_at, listened_duration_seconds, completed)
VALUES
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000001', now() - INTERVAL '2 hours', 284, true),
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000005', now() - INTERVAL '1 hour', 275, true),
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000005', '44444444-0000-4000-a000-000000000013', now() - INTERVAL '30 minutes', 140, false)
ON CONFLICT DO NOTHING;

-- 14. SEED UPLOAD_REQUESTS & MODERATION_LOGS
INSERT INTO public.upload_requests (id, artist_id, submitted_by, track_id, submission_type, status, review_notes, reviewed_by, reviewed_at)
VALUES
    ('77777777-0000-4000-a000-000000000001', '11111111-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000003', '44444444-0000-4000-a000-000000000001', 'album_track', 'approved', 'Rights and master audio clarity verified.', '00000000-0000-4000-a000-000000000002', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.moderation_logs (id, moderator_user_id, target_type, target_id, action, previous_status, new_status, notes)
VALUES
    (gen_random_uuid(), '00000000-0000-4000-a000-000000000002', 'track_rights', '66666666-0000-4000-a000-000000000001', 'VERIFY_RIGHTS', 'pending', 'verified', 'Approved initial direct licensing declaration for testing.')
ON CONFLICT DO NOTHING;
