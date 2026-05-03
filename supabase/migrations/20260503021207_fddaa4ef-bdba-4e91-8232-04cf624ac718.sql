-- Ensure auth profile creation trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Improve new-user profile creation so repeated setup does not fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Let admins fully manage profiles for the redesigned Superadmin user tools
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles"
ON public.profiles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Let affiliates manage their own generated product links
DROP POLICY IF EXISTS "Affiliates update own links" ON public.affiliate_links;
CREATE POLICY "Affiliates update own links"
ON public.affiliate_links
FOR UPDATE
USING (auth.uid() = affiliate_id)
WITH CHECK (auth.uid() = affiliate_id);

DROP POLICY IF EXISTS "Affiliates delete own links" ON public.affiliate_links;
CREATE POLICY "Affiliates delete own links"
ON public.affiliate_links
FOR DELETE
USING (auth.uid() = affiliate_id);

-- Require seller-created products to enter the approval queue
CREATE OR REPLACE FUNCTION public.enforce_seller_product_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.seller_id IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.approval_status := 'pending';
    NEW.status := 'active';
    NEW.created_by := COALESCE(NEW.created_by, auth.uid());
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_seller_product_review_trigger ON public.products;
CREATE TRIGGER enforce_seller_product_review_trigger
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.enforce_seller_product_review();

-- Tighten seller update rule so sellers cannot update another seller's rows after edits
DROP POLICY IF EXISTS "Sellers update own products" ON public.products;
CREATE POLICY "Sellers update own products"
ON public.products
FOR UPDATE
USING (auth.uid() = seller_id AND public.has_role(auth.uid(), 'seller'))
WITH CHECK (auth.uid() = seller_id AND public.has_role(auth.uid(), 'seller'));

-- Utility: remove existing Affilyt test accounts and related public data
CREATE OR REPLACE FUNCTION public.reset_affilyt_demo_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  target_ids uuid[];
BEGIN
  SELECT array_agg(id) INTO target_ids
  FROM auth.users
  WHERE lower(email) IN ('admin@affilyt.site', 'affiliate@affilyt.site', 'seller@affilyt.site', 'admin@affilyt.com', 'affiliate@affilyt.com', 'seller@affilyt.com');

  IF target_ids IS NULL THEN
    RETURN;
  END IF;

  DELETE FROM public.withdrawals WHERE affiliate_id = ANY(target_ids);
  DELETE FROM public.seller_payouts WHERE seller_id = ANY(target_ids);
  DELETE FROM public.payouts WHERE affiliate_id = ANY(target_ids);
  DELETE FROM public.commissions WHERE affiliate_id = ANY(target_ids);
  DELETE FROM public.orders WHERE affiliate_id = ANY(target_ids) OR seller_id = ANY(target_ids);
  DELETE FROM public.affiliate_links WHERE affiliate_id = ANY(target_ids);
  DELETE FROM public.products WHERE seller_id = ANY(target_ids) OR created_by = ANY(target_ids);
  DELETE FROM public.seller_subscriptions WHERE user_id = ANY(target_ids);
  DELETE FROM public.affiliate_applications WHERE user_id = ANY(target_ids);
  DELETE FROM public.user_roles WHERE user_id = ANY(target_ids);
  DELETE FROM public.profiles WHERE user_id = ANY(target_ids);
  DELETE FROM auth.users WHERE id = ANY(target_ids);
END;
$$;

-- Utility: create a confirmed user with a password for controlled demo access
CREATE OR REPLACE FUNCTION public.create_confirmed_demo_user(_email text, _password text, _full_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  encrypted_pw text;
BEGIN
  encrypted_pw := crypt(_password, gen_salt('bf'));

  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    lower(_email),
    encrypted_pw,
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', _full_name),
    now(),
    now()
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', lower(_email), 'email_verified', true, 'phone_verified', false),
    'email',
    lower(_email),
    now(),
    now(),
    now()
  );

  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new_user_id, _full_name)
  ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, updated_at = now();

  RETURN new_user_id;
END;
$$;

-- Utility: rebuild the three requested accounts with working dashboard access
CREATE OR REPLACE FUNCTION public.seed_affilyt_demo_accounts()
RETURNS TABLE(role_name text, email text, password text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  admin_id uuid;
  affiliate_id uuid;
  seller_id uuid;
  demo_password text := 'Affilyt@2026';
BEGIN
  PERFORM public.reset_affilyt_demo_accounts();

  admin_id := public.create_confirmed_demo_user('admin@affilyt.site', demo_password, 'Affilyt Superadmin');
  affiliate_id := public.create_confirmed_demo_user('affiliate@affilyt.site', demo_password, 'Affilyt Pro Affiliate');
  seller_id := public.create_confirmed_demo_user('seller@affilyt.site', demo_password, 'Affilyt Seller');

  INSERT INTO public.user_roles (user_id, role) VALUES
    (admin_id, 'admin'),
    (affiliate_id, 'affiliate'),
    (seller_id, 'seller')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.profiles
  SET package_tier = 'Pro', affiliate_link = 'proaffiliate', phone = '+233000000001', country = 'Ghana', momo_number = '0240000001', momo_provider = 'MTN', updated_at = now()
  WHERE user_id = affiliate_id;

  UPDATE public.profiles
  SET phone = '+233000000002', country = 'Ghana', business_name = 'Affilyt Seller Studio', business_description = 'Digital products prepared for affiliate promotion.', business_website = 'https://affilyt.site', momo_number = '0240000002', momo_provider = 'MTN', skrill_email = 'seller@affilyt.site', updated_at = now()
  WHERE user_id = seller_id;

  INSERT INTO public.seller_subscriptions (user_id, amount, status, payment_reference, started_at, expires_at)
  VALUES (seller_id, 50, 'active', 'manual-demo-seller-2026', now(), now() + interval '1 year')
  ON CONFLICT DO NOTHING;

  RETURN QUERY VALUES
    ('Admin', 'admin@affilyt.site', demo_password),
    ('Affiliate', 'affiliate@affilyt.site', demo_password),
    ('Seller', 'seller@affilyt.site', demo_password);
END;
$$;