-- AFFILIATE HUB SQL SCHEMA UPDATE
-- DATE: 2026-05-01

-- 1. Withdrawals Table (For Korapay/MoMo)
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    ghs_amount NUMERIC(10,2), -- Converted amount in GHS for Korapay
    method TEXT NOT NULL, -- 'momo', 'bank', etc.
    provider TEXT, -- 'MTN', 'Vodafone', etc.
    account_number TEXT NOT NULL,
    account_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    reference TEXT UNIQUE, -- Korapay reference
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates view own withdrawals" ON public.withdrawals 
    FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates request withdrawals" ON public.withdrawals 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = affiliate_id);

CREATE POLICY "Admins manage withdrawals" ON public.withdrawals 
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by authenticated users" ON public.system_settings 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage settings" ON public.system_settings 
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert Default Settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('payout_config', '{"min_threshold": 50, "ghs_exchange_rate": 13.5, "automatic_approval": false}', 'Configurations for payouts and exchange rates'),
    ('commission_config', '{"default_rate": 50, "platform_fee": 10}', 'Default commission rates and fees')
ON CONFLICT (key) DO NOTHING;

-- 3. Enhance Contests for Prizes
ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS prize_image_url TEXT,
ADD COLUMN IF NOT EXISTS winners_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS participation_rules TEXT;

-- 4. Tiered Leaderboard Support (Computed Stats View)
CREATE OR REPLACE VIEW public.leaderboard_stats AS
SELECT 
    p.user_id,
    p.full_name,
    p.avatar_url,
    p.package_tier,
    COALESCE(SUM(c.amount), 0) as total_earnings,
    COUNT(c.id) as sales_count
FROM public.profiles p
LEFT JOIN public.commissions c ON p.user_id = c.affiliate_id
WHERE c.status = 'completed' OR c.status IS NULL
GROUP BY p.user_id, p.full_name, p.avatar_url, p.package_tier;

-- 5. Trigger for updated_at on withdrawals
CREATE TRIGGER update_withdrawals_updated_at 
BEFORE UPDATE ON public.withdrawals 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RPC function for stats (Optional but efficient)
CREATE OR REPLACE FUNCTION get_affiliate_stats(u_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'earnings', COALESCE((SELECT SUM(amount) FROM public.commissions WHERE affiliate_id = u_id AND status = 'completed'), 0),
        'clicks', COALESCE((SELECT SUM(clicks) FROM public.affiliate_links WHERE affiliate_id = u_id), 0),
        'sales', (SELECT COUNT(*) FROM public.orders WHERE affiliate_id = u_id)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
