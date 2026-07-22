
-- 1. activity_events: restrict INSERTs to admins only (edge functions use service_role and bypass RLS)
DROP POLICY IF EXISTS "Authenticated insert activity" ON public.activity_events;
CREATE POLICY "Admins insert activity" ON public.activity_events
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND actor_id = auth.uid());

-- 2. profiles: remove blanket public SELECT of sensitive PII
DROP POLICY IF EXISTS "Public profile fields viewable by everyone" ON public.profiles;

-- Owners can view their own full profile
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can view other profiles (marketplace/social) via base table if needed
CREATE POLICY "Authenticated view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Public safe view for anonymous marketplace/storefront browsing (no PII/payout details)
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT
  user_id,
  full_name,
  avatar_url,
  bio,
  country,
  business_name,
  business_description,
  business_website,
  store_logo_url,
  store_banner_url,
  store_color_hex,
  package_tier,
  affiliate_link,
  referral_code,
  created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
