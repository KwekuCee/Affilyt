-- 1. Ensure 'learner' role exists in app_role enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'learner') THEN
        ALTER TYPE public.app_role ADD VALUE 'learner';
    END IF;
END $$;

-- 2. Define user variables
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    user_email TEXT := 'student@affilyt.site';
    user_password TEXT := 'Affilyt@2026'; -- Plain text for hashing
    hashed_password TEXT;
BEGIN
    -- Hash the password using bcrypt (Supabase default)
    -- Requires extensions.crypt to be enabled (standard in Supabase)
    hashed_password := crypt(user_password, gen_salt('bf'));

    -- 3. Create entry in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        created_at,
        updated_at,
        last_sign_in_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
    )
    VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        user_email,
        hashed_password,
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Learner Student"}',
        false,
        'authenticated',
        'authenticated',
        now(),
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

    -- 4. Create identity for the user
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
    VALUES (
        gen_random_uuid(),
        new_user_id,
        format('{"sub":"%s","email":"%s"}', new_user_id, user_email)::jsonb,
        'email',
        now(),
        now(),
        now()
    );

    -- 5. Create profile entry in public.profiles
    -- Adjust columns based on your specific profiles table structure
    INSERT INTO public.profiles (
        id,
        user_id,
        full_name,
        created_at,
        updated_at
    )
    VALUES (
        gen_random_uuid(),
        new_user_id,
        'Learner Student',
        now(),
        now()
    );

    -- 6. Assign the 'learner' role in public.user_roles
    INSERT INTO public.user_roles (
        user_id,
        role
    )
    VALUES (
        new_user_id,
        'learner'
    );

    RAISE NOTICE 'User created successfully with ID: %', new_user_id;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating user: %', SQLERRM;
END $$;
