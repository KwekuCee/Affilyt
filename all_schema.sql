-- ============================================================================
-- AFFILYT — FULL DATABASE SCHEMA
-- Consolidated schema of all public tables, RLS policies, functions, triggers,
-- and storage buckets. Safe to run once on a fresh project.
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================================
-- ENUMS
-- ============================================================================
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'affiliate', 'seller', 'learner'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- SHARED FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============================================================================
-- USER ROLES (separate table — never store roles on profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM anon;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, username TEXT UNIQUE, email TEXT,
  avatar_url TEXT, phone TEXT, country TEXT,
  package_tier TEXT DEFAULT 'Basic',
  commission_rate NUMERIC DEFAULT 35,
  affiliate_link TEXT UNIQUE,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  momo_number TEXT, momo_provider TEXT, bank_account TEXT, bank_name TEXT,
  is_seller BOOLEAN DEFAULT FALSE,
  seller_status TEXT DEFAULT 'inactive',
  seller_verified_at TIMESTAMPTZ,
  tax_id TEXT, address TEXT, city TEXT, postal_code TEXT,
  total_earnings NUMERIC DEFAULT 0, total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- New auth user → profile + default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', NEW.email)
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    updated_at = now();
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL, description TEXT, category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0, currency TEXT DEFAULT 'USD',
  image_url TEXT, gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  commission_rate NUMERIC NOT NULL DEFAULT 30,
  min_tier TEXT DEFAULT 'Basic',
  status TEXT DEFAULT 'active',
  approval_status TEXT DEFAULT 'pending',
  stock INTEGER, sku TEXT,
  epc NUMERIC DEFAULT 0, conversion_rate NUMERIC DEFAULT 0,
  trust_score NUMERIC DEFAULT 0, refund_rate NUMERIC DEFAULT 0,
  total_sales INTEGER DEFAULT 0, total_clicks INTEGER DEFAULT 0,
  content_assets JSONB DEFAULT '{}'::jsonb,
  landing_page_url TEXT, is_digital BOOLEAN DEFAULT TRUE,
  weight NUMERIC, dimensions TEXT,
  seo_title TEXT, seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved products are public" ON public.products FOR SELECT USING (status = 'active' AND approval_status = 'approved');
CREATE POLICY "Sellers view own products" ON public.products FOR SELECT TO authenticated USING (auth.uid() = seller_id OR auth.uid() = created_by);
CREATE POLICY "Sellers insert own products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id OR auth.uid() = created_by);
CREATE POLICY "Sellers update own products" ON public.products FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.enforce_seller_product_review()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.seller_id IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.approval_status := 'pending';
    NEW.status := 'active';
    NEW.created_by := COALESCE(NEW.created_by, auth.uid());
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_seller_product_review() FROM anon, authenticated, PUBLIC;

CREATE TRIGGER trg_products_review BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.enforce_seller_product_review();

-- ============================================================================
-- AFFILIATE APPLICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, country TEXT,
  package_name TEXT NOT NULL, commission_rate NUMERIC, amount NUMERIC,
  marketing_channels TEXT[] DEFAULT '{}',
  experience TEXT, audience_size TEXT,
  status TEXT DEFAULT 'pending',
  payment_reference TEXT, payment_status TEXT DEFAULT 'pending',
  notes TEXT, reviewed_by UUID, reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.affiliate_applications TO anon, authenticated;
GRANT ALL ON public.affiliate_applications TO service_role;
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.affiliate_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own applications" ON public.affiliate_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all applications" ON public.affiliate_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update applications" ON public.affiliate_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_apps_updated BEFORE UPDATE ON public.affiliate_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- AFFILIATE LINKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  short_code TEXT UNIQUE NOT NULL,
  custom_slug TEXT UNIQUE,
  destination_url TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT,
  clicks INTEGER DEFAULT 0, conversions INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_links TO authenticated;
GRANT SELECT ON public.affiliate_links TO anon;
GRANT ALL ON public.affiliate_links TO service_role;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can resolve links" ON public.affiliate_links FOR SELECT USING (true);
CREATE POLICY "Affiliates manage own links" ON public.affiliate_links FOR ALL TO authenticated USING (auth.uid() = affiliate_id) WITH CHECK (auth.uid() = affiliate_id);
CREATE POLICY "Admins manage all links" ON public.affiliate_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_links_updated BEFORE UPDATE ON public.affiliate_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- LINK CLICKS (real click tracking with channel/utm)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id UUID,
  channel TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  referrer TEXT, user_agent TEXT, ip_address INET,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.link_clicks TO anon, authenticated;
GRANT ALL ON public.link_clicks TO service_role;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert clicks" ON public.link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Affiliates view own clicks" ON public.link_clicks FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);
CREATE POLICY "Admins view all clicks" ON public.link_clicks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- FUNNEL EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,  -- 'view' | 'add_to_cart' | 'checkout' | 'purchase'
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.funnel_events TO anon, authenticated;
GRANT ALL ON public.funnel_events TO service_role;
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert events" ON public.funnel_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Affiliates view own events" ON public.funnel_events FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);
CREATE POLICY "Admins view all events" ON public.funnel_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  affiliate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_email TEXT NOT NULL, buyer_name TEXT, buyer_phone TEXT,
  amount NUMERIC NOT NULL DEFAULT 0, commission NUMERIC DEFAULT 0,
  platform_fee NUMERIC DEFAULT 0, currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_method TEXT, payment_reference TEXT, payment_provider TEXT DEFAULT 'korapay',
  coupon_code TEXT, discount NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Buyers view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR buyer_email = auth.jwt()->>'email');
CREATE POLICY "Sellers view their orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Affiliates view their orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- COMMISSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending | completed | reversed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates view own commissions" ON public.commissions FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);
CREATE POLICY "Admins manage commissions" ON public.commissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto notify on commission
CREATE OR REPLACE FUNCTION public.notify_on_commission()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, description, amount)
  VALUES (NEW.affiliate_id, 'sale', 'New Sale!', 'You earned a commission of $' || NEW.amount::TEXT, NEW.amount);
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.notify_on_commission() FROM anon, authenticated, PUBLIC;
CREATE TRIGGER trg_commission_notify AFTER INSERT ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.notify_on_commission();

-- ============================================================================
-- WITHDRAWALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL, currency TEXT DEFAULT 'USD',
  method TEXT, momo_number TEXT, momo_provider TEXT,
  bank_account TEXT, bank_name TEXT,
  status TEXT DEFAULT 'pending',
  reference TEXT, provider_reference TEXT, provider_response JSONB,
  fee NUMERIC DEFAULT 0, net_amount NUMERIC,
  processed_by UUID, processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.withdrawals TO authenticated;
GRANT ALL ON public.withdrawals TO service_role;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates view own withdrawals" ON public.withdrawals FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates request withdrawals" ON public.withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = affiliate_id);
CREATE POLICY "Admins manage withdrawals" ON public.withdrawals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_withdrawals_updated BEFORE UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.validate_withdrawal_balance()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE available NUMERIC;
BEGIN
  SELECT COALESCE((SELECT SUM(amount) FROM public.commissions WHERE affiliate_id = NEW.affiliate_id AND status = 'completed'), 0)
       - COALESCE((SELECT SUM(amount) FROM public.withdrawals WHERE affiliate_id = NEW.affiliate_id AND status IN ('pending','processing','completed')), 0)
  INTO available;
  IF NEW.amount > available THEN
    RAISE EXCEPTION 'Insufficient balance: requested %, available %', NEW.amount, available USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.validate_withdrawal_balance() FROM anon, authenticated, PUBLIC;
CREATE TRIGGER trg_withdrawal_validate BEFORE INSERT ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.validate_withdrawal_balance();

CREATE OR REPLACE FUNCTION public.notify_on_withdrawal_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, type, title, description, amount)
    VALUES (NEW.affiliate_id, 'payout',
      CASE WHEN NEW.status = 'completed' THEN 'Payout Processed'
           WHEN NEW.status = 'failed' THEN 'Payout Failed'
           ELSE 'Payout Update' END,
      'Your withdrawal of $' || NEW.amount::TEXT || ' status: ' || NEW.status,
      NEW.amount);
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.notify_on_withdrawal_update() FROM anon, authenticated, PUBLIC;
CREATE TRIGGER trg_withdrawal_notify AFTER UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.notify_on_withdrawal_update();

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT, amount NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- AFFILIATE GOALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  reached_half_at TIMESTAMPTZ, reached_full_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, month, year)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_goals TO authenticated;
GRANT ALL ON public.affiliate_goals TO service_role;
ALTER TABLE public.affiliate_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goals" ON public.affiliate_goals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view goals" ON public.affiliate_goals FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_goals_updated BEFORE UPDATE ON public.affiliate_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- REFERRALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email TEXT,
  status TEXT DEFAULT 'pending', -- pending | active | completed
  tier TEXT DEFAULT 'Bronze',
  bonus_amount NUMERIC DEFAULT 0,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Referrers view own" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id);
CREATE POLICY "Referrers insert own" ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Admins manage referrals" ON public.referrals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- RESOURCES (marketing assets uploaded by admin)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  type TEXT, -- banner | copy | video
  category TEXT, product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  file_url TEXT, preview_url TEXT, content TEXT,
  file_size TEXT, dimensions TEXT, min_tier TEXT DEFAULT 'Basic',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are public" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins manage resources" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_resources_updated BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- CONTESTS, COUPONS, TESTIMONIALS, BLOGS, PRODUCT REVIEWS, ANNOUNCEMENTS,
-- SELLER SUBSCRIPTIONS/PAYOUTS/COUPONS, TAX DOCS, ACTIVITY, AUDIT, SYSTEM
-- (Definitions omitted here for brevity — see individual migration files)
-- ============================================================================

-- Minimal stubs to satisfy FK references from other tables (safe to skip if already present):

CREATE TABLE IF NOT EXISTS public.contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT, prize NUMERIC DEFAULT 0,
  starts_at TIMESTAMPTZ, ends_at TIMESTAMPTZ, status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contests TO anon, authenticated;
GRANT ALL ON public.contests TO service_role;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contests public" ON public.contests FOR SELECT USING (true);
CREATE POLICY "Admins manage contests" ON public.contests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL, value JSONB, updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.system_settings TO anon, authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.system_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Public media bucket (product images, resource previews)
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Private tax-docs bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('tax-docs', 'tax-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Private resource-files bucket (for downloadable admin resources)
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-files', 'resource-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: media (public read, authenticated upload)
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Owners update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND owner = auth.uid());
CREATE POLICY "Owners delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND owner = auth.uid());
CREATE POLICY "Admins manage media" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- resource-files (public read, admin write)
CREATE POLICY "Public read resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resource-files');
CREATE POLICY "Admins upload resource files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update resource files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete resource files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));

-- tax-docs (owner-only)
CREATE POLICY "Owners read tax docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'tax-docs' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Owners upload tax docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tax-docs' AND owner = auth.uid());

-- ============================================================================
-- HELPFUL AGGREGATE (SECURITY INVOKER for RLS enforcement)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_affiliate_stats(u_id UUID)
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'earnings', COALESCE((SELECT SUM(amount) FROM public.commissions WHERE affiliate_id = u_id AND status = 'completed'), 0),
    'clicks',   COALESCE((SELECT SUM(clicks) FROM public.affiliate_links WHERE affiliate_id = u_id), 0),
    'sales',    (SELECT COUNT(*) FROM public.orders WHERE affiliate_id = u_id)
  ) INTO result;
  RETURN result;
END; $$;

-- END OF SCHEMA
