
CREATE TABLE IF NOT EXISTS public.seller_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  payment_reference TEXT,
  amount NUMERIC NOT NULL DEFAULT 50,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '1 year'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seller_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers view own subscription" ON public.seller_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own subscription" ON public.seller_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all subscriptions" ON public.seller_subscriptions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage subscriptions" ON public.seller_subscriptions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seller_id UUID,
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS business_name TEXT;

CREATE POLICY "Sellers create own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id AND has_role(auth.uid(), 'seller'::app_role));
CREATE POLICY "Sellers update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS platform_fee NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seller_earnings NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seller_id UUID;

CREATE POLICY "Sellers view own product orders" ON public.orders FOR SELECT USING (auth.uid() = seller_id);

CREATE TABLE IF NOT EXISTS public.seller_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers view own payouts" ON public.seller_payouts FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers request payouts" ON public.seller_payouts FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Admins view all seller payouts" ON public.seller_payouts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage seller payouts" ON public.seller_payouts FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS business_description TEXT,
  ADD COLUMN IF NOT EXISTS business_website TEXT;
