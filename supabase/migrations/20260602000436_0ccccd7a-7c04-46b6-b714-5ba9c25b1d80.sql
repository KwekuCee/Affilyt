
-- 1. withdrawal_settings
CREATE TABLE public.withdrawal_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  preferred_method text NOT NULL DEFAULT 'momo',
  min_payout_amount numeric NOT NULL DEFAULT 10,
  auto_withdraw boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.withdrawal_settings TO authenticated;
GRANT ALL ON public.withdrawal_settings TO service_role;

ALTER TABLE public.withdrawal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own withdrawal settings"
ON public.withdrawal_settings FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all withdrawal settings"
ON public.withdrawal_settings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_withdrawal_settings_updated_at
BEFORE UPDATE ON public.withdrawal_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text NOT NULL DEFAULT 'all',
  variant text NOT NULL DEFAULT 'info',
  cta_label text,
  cta_url text,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read active announcements"
ON public.announcements FOR SELECT
TO authenticated
USING (is_active = true AND (ends_at IS NULL OR ends_at > now()) AND starts_at <= now());

CREATE POLICY "Admins manage announcements"
ON public.announcements FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Trigger: prevent overdrawing on withdrawals
CREATE OR REPLACE FUNCTION public.validate_withdrawal_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  available numeric;
BEGIN
  SELECT
    COALESCE((SELECT SUM(amount) FROM public.commissions
              WHERE affiliate_id = NEW.affiliate_id AND status = 'completed'), 0)
    - COALESCE((SELECT SUM(amount) FROM public.withdrawals
                WHERE affiliate_id = NEW.affiliate_id
                  AND status IN ('pending','processing','completed')), 0)
  INTO available;

  IF NEW.amount > available THEN
    RAISE EXCEPTION 'Insufficient balance: requested %, available %', NEW.amount, available
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_withdrawal_balance_trg
BEFORE INSERT ON public.withdrawals
FOR EACH ROW EXECUTE FUNCTION public.validate_withdrawal_balance();

-- 4. Trigger: recompute product stats after order
CREATE OR REPLACE FUNCTION public.recompute_product_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_clicks integer;
  total_sales integer;
  total_revenue numeric;
  refund_count integer;
BEGIN
  IF NEW.product_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(SUM(clicks), 0) INTO total_clicks
  FROM public.affiliate_links WHERE product_id = NEW.product_id;

  SELECT COUNT(*), COALESCE(SUM(amount), 0) INTO total_sales, total_revenue
  FROM public.orders WHERE product_id = NEW.product_id AND status = 'completed';

  SELECT COUNT(*) INTO refund_count
  FROM public.refunds r
  JOIN public.orders o ON o.id = r.order_id
  WHERE o.product_id = NEW.product_id AND r.status = 'completed';

  UPDATE public.products
  SET
    epc = CASE WHEN total_clicks > 0 THEN ROUND((total_revenue / total_clicks)::numeric, 2) ELSE 0 END,
    conversion_rate = CASE WHEN total_clicks > 0 THEN ROUND((total_sales::numeric / total_clicks * 100), 2) ELSE 0 END,
    refund_rate = CASE WHEN total_sales > 0 THEN ROUND((refund_count::numeric / total_sales * 100), 2) ELSE 0 END,
    updated_at = now()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER recompute_product_stats_trg
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.recompute_product_stats();
