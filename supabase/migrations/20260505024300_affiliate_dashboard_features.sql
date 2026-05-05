-- ================================================================
-- AFFILIATE DASHBOARD NEW FEATURES — DATABASE MIGRATION
-- Date: 2026-05-05
-- Description: Adds tables for smart links, notifications, 
--   marketing resources, goals, channel attribution, referrals,
--   and tax documents. Also enhances existing affiliate_links table.
-- ================================================================

-- ============================================================
-- 1. SMART LINK CUSTOMIZATION — Enhance affiliate_links table
-- ============================================================
ALTER TABLE public.affiliate_links
ADD COLUMN IF NOT EXISTS custom_slug TEXT,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS utm_content TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Index for custom slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_links_custom_slug 
ON public.affiliate_links (custom_slug) WHERE custom_slug IS NOT NULL;

-- Trigger for updated_at on affiliate_links
DROP TRIGGER IF EXISTS update_affiliate_links_updated_at ON public.affiliate_links;
CREATE TRIGGER update_affiliate_links_updated_at 
BEFORE UPDATE ON public.affiliate_links 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- 2. NOTIFICATIONS CENTER
-- ============================================================
-- Drop old table if it exists (missing columns from prior run)
DROP TABLE IF EXISTS public.notifications CASCADE;

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',       -- 'sale', 'payout', 'contest', 'system', 'info'
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(10,2),
    metadata JSONB DEFAULT '{}'::jsonb,       -- flexible extra data
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.notifications 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" ON public.notifications 
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users delete own notifications" ON public.notifications 
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System inserts notifications" ON public.notifications 
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins manage all notifications" ON public.notifications 
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_notifications_user_unread 
ON public.notifications (user_id, is_read, created_at DESC);


-- ============================================================
-- 3. MARKETING RESOURCES LIBRARY (enhance existing resources table)
-- ============================================================
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'banner',         -- 'banner', 'copy', 'video'
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS preview_url TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,                       -- for swipe copy text
ADD COLUMN IF NOT EXISTS file_size TEXT,
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();


-- ============================================================
-- 4. GOAL TRACKER
-- ============================================================
CREATE TABLE IF NOT EXISTS public.affiliate_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL,                    -- 1-12
    year INTEGER NOT NULL,
    target_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, month, year)
);

ALTER TABLE public.affiliate_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own goals" ON public.affiliate_goals 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users manage own goals" ON public.affiliate_goals 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own goals" ON public.affiliate_goals 
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins view all goals" ON public.affiliate_goals 
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_affiliate_goals_updated_at ON public.affiliate_goals;
CREATE TRIGGER update_affiliate_goals_updated_at 
BEFORE UPDATE ON public.affiliate_goals 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- 5. MULTI-CHANNEL ATTRIBUTION — Track click source
-- ============================================================
CREATE TABLE IF NOT EXISTS public.link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES public.affiliate_links(id) ON DELETE CASCADE NOT NULL,
    affiliate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    channel TEXT,                              -- 'instagram', 'tiktok', 'whatsapp', 'twitter', 'youtube', 'facebook', 'direct', etc.
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    converted BOOLEAN DEFAULT false,           -- true if this click led to a purchase
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own clicks" ON public.link_clicks 
    FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);

CREATE POLICY "Anyone insert clicks" ON public.link_clicks 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all clicks" ON public.link_clicks 
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_link_clicks_affiliate ON public.link_clicks (affiliate_id, created_at DESC);
CREATE INDEX idx_link_clicks_channel ON public.link_clicks (affiliate_id, channel);


-- ============================================================
-- 6. REFERRAL PROGRAM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invite_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',     -- 'pending', 'active', 'inactive'
    bonus_amount NUMERIC(10,2) DEFAULT 0,
    bonus_paid BOOLEAN DEFAULT false,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (referrer_id, referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own referrals" ON public.referrals 
    FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

CREATE POLICY "Users view referred status" ON public.referrals 
    FOR SELECT TO authenticated USING (auth.uid() = referred_id);

CREATE POLICY "System inserts referrals" ON public.referrals 
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins manage referrals" ON public.referrals 
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_referrals_referrer ON public.referrals (referrer_id, status);

-- Add invite_code to profiles for referral tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS referral_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code 
ON public.profiles (referral_code) WHERE referral_code IS NOT NULL;


-- ============================================================
-- 7. TAX DOCUMENTS — Store generated tax doc records
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tax_year INTEGER NOT NULL,
    tin TEXT,                                   -- Tax Identification Number
    business_name TEXT,
    address TEXT,
    gross_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_fees NUMERIC(10,2) NOT NULL DEFAULT 0,
    net_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_orders INTEGER NOT NULL DEFAULT 0,
    monthly_breakdown JSONB DEFAULT '[]'::jsonb, -- Array of {month, gross, fees, orders}
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, tax_year)
);

ALTER TABLE public.tax_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tax docs" ON public.tax_documents 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users create own tax docs" ON public.tax_documents 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own tax docs" ON public.tax_documents 
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins view all tax docs" ON public.tax_documents 
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));


-- ============================================================
-- 8. CONVERSION FUNNEL — Add event tracking to orders
-- ============================================================
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS funnel_stage TEXT DEFAULT 'purchase',  -- 'click', 'view', 'add_to_cart', 'purchase'
ADD COLUMN IF NOT EXISTS channel TEXT,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- Page view / add-to-cart events for funnel tracking
CREATE TABLE IF NOT EXISTS public.funnel_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    link_id UUID REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,                  -- 'click', 'page_view', 'add_to_cart', 'purchase'
    channel TEXT,
    session_id TEXT,                           -- group events by visitor session
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own events" ON public.funnel_events 
    FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);

CREATE POLICY "Anyone insert events" ON public.funnel_events 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all events" ON public.funnel_events 
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_funnel_events_affiliate ON public.funnel_events (affiliate_id, event_type, created_at DESC);
CREATE INDEX idx_funnel_events_product ON public.funnel_events (product_id, event_type);


-- ============================================================
-- 9. EARNINGS CALENDAR — Daily earnings view (computed)
-- ============================================================
CREATE OR REPLACE VIEW public.daily_earnings AS
SELECT 
    c.affiliate_id,
    DATE(c.created_at) AS earn_date,
    SUM(c.amount) AS total_amount,
    COUNT(c.id) AS order_count
FROM public.commissions c
WHERE c.status IN ('completed', 'pending')
GROUP BY c.affiliate_id, DATE(c.created_at);


-- ============================================================
-- 10. CHANNEL ATTRIBUTION — Aggregated view per channel
-- ============================================================
CREATE OR REPLACE VIEW public.channel_stats AS
SELECT 
    lc.affiliate_id,
    COALESCE(lc.channel, 'direct') AS channel,
    COUNT(lc.id) AS total_clicks,
    COUNT(lc.id) FILTER (WHERE lc.converted = true) AS conversions,
    COALESCE(SUM(o.commission_amount) FILTER (WHERE lc.converted = true), 0) AS revenue
FROM public.link_clicks lc
LEFT JOIN public.orders o ON lc.order_id = o.id
GROUP BY lc.affiliate_id, COALESCE(lc.channel, 'direct');


-- ============================================================
-- 11. AUTO-NOTIFY ON SALE — Function to insert notification on new commission
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_commission()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, title, description, amount)
    VALUES (
        NEW.affiliate_id,
        'sale',
        'New Sale!',
        'You earned a commission of $' || NEW.amount::TEXT,
        NEW.amount
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_commission ON public.commissions;
CREATE TRIGGER trg_notify_commission
AFTER INSERT ON public.commissions
FOR EACH ROW EXECUTE FUNCTION public.notify_on_commission();


-- ============================================================
-- 12. AUTO-NOTIFY ON WITHDRAWAL STATUS — Function to notify on payout updates
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_on_withdrawal_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (user_id, type, title, description, amount)
        VALUES (
            NEW.affiliate_id,
            'payout',
            CASE 
                WHEN NEW.status = 'completed' THEN 'Payout Processed'
                WHEN NEW.status = 'processing' THEN 'Payout Processing'
                WHEN NEW.status = 'failed' THEN 'Payout Failed'
                ELSE 'Payout Update'
            END,
            CASE 
                WHEN NEW.status = 'completed' THEN 'Your withdrawal of $' || NEW.amount::TEXT || ' has been sent.'
                WHEN NEW.status = 'failed' THEN 'Your withdrawal of $' || NEW.amount::TEXT || ' could not be processed.'
                ELSE 'Your withdrawal of $' || NEW.amount::TEXT || ' status changed to ' || NEW.status
            END,
            NEW.amount
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_withdrawal ON public.withdrawals;
CREATE TRIGGER trg_notify_withdrawal
AFTER UPDATE ON public.withdrawals
FOR EACH ROW EXECUTE FUNCTION public.notify_on_withdrawal_update();
