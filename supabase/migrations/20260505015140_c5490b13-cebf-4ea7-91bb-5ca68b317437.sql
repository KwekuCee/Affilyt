
-- Activity feed (lightweight events)
CREATE TABLE public.activity_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  actor_id UUID,
  actor_label TEXT,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view activity" ON public.activity_events FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated insert activity" ON public.activity_events FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE INDEX idx_activity_created ON public.activity_events (created_at DESC);

-- Audit log (admin actions)
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit" ON public.audit_log FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert audit" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE INDEX idx_audit_created ON public.audit_log (created_at DESC);

-- Refunds
CREATE TABLE public.refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reverse_commission BOOLEAN NOT NULL DEFAULT true,
  processed_by UUID,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage refunds" ON public.refunds FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Coupons
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percent',
  discount_value NUMERIC NOT NULL,
  applies_to TEXT NOT NULL DEFAULT 'all',
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated read active coupons" ON public.coupons FOR SELECT TO authenticated USING (is_active = true);

-- Broadcasts (queued emails)
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all',
  audience_filter JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued',
  recipient_count INTEGER DEFAULT 0,
  created_by UUID,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage broadcasts" ON public.broadcasts FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Tier history (track upgrades / downgrades)
CREATE TABLE public.tier_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  from_tier TEXT,
  to_tier TEXT NOT NULL,
  changed_by UUID,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tier_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view tier history" ON public.tier_history FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write tier history" ON public.tier_history FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users view own tier history" ON public.tier_history FOR SELECT USING (user_id = auth.uid());
