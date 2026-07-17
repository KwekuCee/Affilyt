
-- Fix: notifications insert (restrict to service_role only; triggers use SECURITY DEFINER)
DROP POLICY IF EXISTS "System inserts notifications" ON public.notifications;
CREATE POLICY "Service role inserts notifications" ON public.notifications
  FOR INSERT TO service_role WITH CHECK (true);

-- Fix: referrals insert (only allow when referrer_id = auth.uid(); admins/service via other policies)
DROP POLICY IF EXISTS "System inserts referrals" ON public.referrals;
CREATE POLICY "Users insert own referrals" ON public.referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Service role inserts referrals" ON public.referrals
  FOR INSERT TO service_role WITH CHECK (true);

-- Fix: product_reviews insert - require buyer_email match caller email AND matching order
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.product_reviews;
CREATE POLICY "Verified buyers can insert reviews" ON public.product_reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    buyer_email = (auth.jwt() ->> 'email')
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = product_reviews.order_id
        AND o.buyer_email = (auth.jwt() ->> 'email')
        AND o.product_id = product_reviews.product_id
    )
  );

-- Fix: product_reviews update - only the product's seller (or admin)
DROP POLICY IF EXISTS "Sellers can update reviews" ON public.product_reviews;
CREATE POLICY "Sellers update reviews on own products" ON public.product_reviews
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_reviews.product_id
        AND p.seller_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_reviews.product_id
        AND p.seller_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );

-- Fix: SECURITY DEFINER views -> set security_invoker
ALTER VIEW public.channel_stats SET (security_invoker = true);
ALTER VIEW public.daily_earnings SET (security_invoker = true);

-- Fix: SECURITY DEFINER functions executable by anon/authenticated
-- Revoke EXECUTE from anon/authenticated on trigger-only functions
REVOKE EXECUTE ON FUNCTION public.enforce_seller_product_review() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_on_commission() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_on_withdrawal_update() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_withdrawal_balance() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.recompute_product_stats() FROM anon, authenticated, PUBLIC;
-- has_role and get_affiliate_stats: keep authenticated, revoke anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_affiliate_stats(uuid) FROM anon, PUBLIC;

-- Fix: public bucket listing - restrict SELECT on storage.objects for media bucket
-- Remove broad SELECT policies that let anyone list bucket contents
DROP POLICY IF EXISTS "Media readable by anyone with url" ON storage.objects;
DROP POLICY IF EXISTS "Public can read media" ON storage.objects;
-- Note: since bucket is public, files remain accessible via direct URL through the storage CDN,
-- but LIST via the objects API now requires explicit ownership/admin policies.
CREATE POLICY "Admins list media" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers list own product media" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = 'products'
    AND (storage.foldername(name))[2] = (auth.uid())::text
  );
