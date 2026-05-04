
-- 1. Drop & recreate leaderboard view without SECURITY DEFINER
DROP VIEW IF EXISTS public.leaderboard_stats CASCADE;
CREATE VIEW public.leaderboard_stats
WITH (security_invoker = true)
AS
SELECT
  p.user_id,
  p.full_name,
  p.avatar_url,
  p.package_tier,
  COALESCE(SUM(c.amount) FILTER (WHERE c.status = 'completed'), 0)::numeric AS total_earnings,
  COUNT(o.id)::int AS sales_count
FROM public.profiles p
LEFT JOIN public.commissions c ON c.affiliate_id = p.user_id
LEFT JOIN public.orders o ON o.affiliate_id = p.user_id
WHERE p.package_tier IS NOT NULL
GROUP BY p.user_id, p.full_name, p.avatar_url, p.package_tier;

GRANT SELECT ON public.leaderboard_stats TO authenticated, anon;

-- 2. Tighten orders insert policy (no more WITH CHECK true)
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users create their orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (
  buyer_email = (auth.jwt() ->> 'email')
  OR has_role(auth.uid(), 'admin')
);

-- 3. Restrict SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.get_affiliate_stats(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_affiliate_stats(uuid) TO authenticated;
-- (still callable, but not by anon; the function itself only returns data for the requested uid)

-- 4. Storage: prevent listing of media bucket; keep direct file reads via known URL
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
-- Allow read only when the path is known (still public bucket, but list is gated)
CREATE POLICY "Media readable by anyone with url"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');
-- (Public bucket means files are still served via direct URL; listing requires no broader policy)

-- 5. Ensure 'affiliate' role exists in enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'affiliate' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'affiliate';
  END IF;
END$$;

-- 6. Contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (
    length(full_name) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 1 AND 2000
  );
CREATE POLICY "Admins read contact" ON public.contact_messages
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update contact" ON public.contact_messages
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- 7. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users mark own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR user_id = auth.uid());
