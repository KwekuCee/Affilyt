
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE FUNCTION public.resolve_affiliate_ref(_ref text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id
  FROM public.profiles
  WHERE affiliate_link = _ref
     OR affiliate_link ILIKE '%' || _ref || '%'
     OR referral_code = _ref
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.resolve_affiliate_ref(text) FROM public;
GRANT EXECUTE ON FUNCTION public.resolve_affiliate_ref(text) TO anon, authenticated;
