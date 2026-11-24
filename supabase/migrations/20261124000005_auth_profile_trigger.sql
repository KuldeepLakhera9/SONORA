-- ==============================================================================
-- SONORA MIGRATION 05: Auth Users to Profiles Trigger & Username Validation
-- ==============================================================================
-- Description: Automatically provisions a listener profile upon auth.users
-- registration, sanitizes metadata, prevents role escalation at creation,
-- and provides public username availability checking for the signup form.
-- ==============================================================================

-- 1. USERNAME AVAILABILITY CHECK FUNCTION
CREATE OR REPLACE FUNCTION public.is_username_available(p_username TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_clean_username TEXT;
BEGIN
    v_clean_username := lower(trim(p_username));
    
    -- Format validation check
    IF char_length(v_clean_username) < 3 OR v_clean_username !~ '^[a-z0-9_-]+$' THEN
        RETURN FALSE;
    END IF;

    -- Reserved system usernames
    IF v_clean_username IN ('admin', 'moderator', 'sonora', 'system', 'root', 'support', 'help', 'api', 'auth') THEN
        RETURN FALSE;
    END IF;

    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE lower(username) = v_clean_username
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Allow anon and authenticated users to verify username availability during signup
GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT) TO anon, authenticated, service_role;

-- 2. AUTOMATIC PROFILE CREATION TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_raw_username TEXT;
    v_username TEXT;
    v_display_name TEXT;
    v_avatar_path TEXT;
    v_counter INTEGER := 0;
    v_candidate_username TEXT;
BEGIN
    -- Extract metadata supplied during registration
    v_raw_username := NEW.raw_user_meta_data->>'username';
    v_display_name := NEW.raw_user_meta_data->>'display_name';
    v_avatar_path := NEW.raw_user_meta_data->>'avatar_path';

    -- Fallback display name
    IF v_display_name IS NULL OR char_length(trim(v_display_name)) = 0 THEN
        v_display_name := split_part(COALESCE(NEW.email, 'listener'), '@', 1);
    END IF;

    -- Sanitize and format username
    IF v_raw_username IS NOT NULL AND char_length(trim(v_raw_username)) >= 3 AND trim(v_raw_username) ~* '^[a-zA-Z0-9_-]+$' THEN
        v_username := lower(trim(v_raw_username));
    ELSE
        -- Fallback: Generate clean unique username based on email or user UUID prefix
        v_username := 'user_' || substr(NEW.id::text, 1, 8);
    END IF;

    -- Ensure username uniqueness by appending suffix if collision occurs
    v_candidate_username := v_username;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(v_candidate_username)) LOOP
        v_counter := v_counter + 1;
        v_candidate_username := v_username || '_' || v_counter;
    END LOOP;
    v_username := v_candidate_username;

    -- Insert profile with hardcoded 'listener' role (role escalation prevention)
    INSERT INTO public.profiles (
        id,
        username,
        display_name,
        avatar_path,
        bio,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        v_username,
        v_display_name,
        v_avatar_path,
        COALESCE(NEW.raw_user_meta_data->>'bio', ''),
        'listener'::public.user_role, -- STRICT: Always initialize as listener
        true,
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- 3. BIND TRIGGER TO auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
