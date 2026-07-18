
-- 1. Convert has_role to SECURITY INVOKER (users can read their own roles)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. activity_events: prevent actor spoofing
DROP POLICY IF EXISTS "Authenticated insert activity" ON public.activity_events;
CREATE POLICY "Authenticated insert activity" ON public.activity_events
FOR INSERT TO authenticated
WITH CHECK (actor_id IS NULL OR actor_id = auth.uid());

-- 3. funnel_events: validate affiliate_id against affiliate_links
DROP POLICY IF EXISTS "Anyone insert events" ON public.funnel_events;
CREATE POLICY "Insert validated funnel events" ON public.funnel_events
FOR INSERT TO anon, authenticated
WITH CHECK (
  link_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.affiliate_links al
    WHERE al.id = funnel_events.link_id
      AND al.affiliate_id = funnel_events.affiliate_id
  )
);

-- 4. link_clicks: validate affiliate_id against affiliate_links
DROP POLICY IF EXISTS "Anyone insert clicks" ON public.link_clicks;
CREATE POLICY "Insert validated link clicks" ON public.link_clicks
FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.affiliate_links al
    WHERE al.id = link_clicks.link_id
      AND al.affiliate_id = link_clicks.affiliate_id
  )
);
