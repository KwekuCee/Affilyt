-- 1. Course Structure
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Markdown or HTML content
    video_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT FALSE,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Learner Progress
CREATE TABLE IF NOT EXISTS public.learner_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 3. In-app Messaging
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Robust Payout Workflow
-- Adding administrative fields to existing payout/withdrawal tables
ALTER TABLE public.withdrawals
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

ALTER TABLE public.seller_payouts
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- 5. Real-time Notifications (Enhancement)
-- The existing table is good, but let's ensure it has an index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- 7. Performance Views for Dashboards
CREATE OR REPLACE VIEW public.vendor_stats AS
SELECT
    seller_id,
    SUM(seller_earnings) as total_revenue,
    COUNT(id) as total_orders,
    (SELECT COUNT(*) FROM public.products WHERE seller_id = orders.seller_id) as total_products,
    COUNT(DISTINCT affiliate_id) as total_affiliates
FROM public.orders
GROUP BY seller_id;

CREATE OR REPLACE VIEW public.admin_platform_stats AS
SELECT
    (SELECT SUM(amount) FROM public.orders) as gmv,
    (SELECT SUM(platform_fee) FROM public.orders) as total_platform_fees,
    (SELECT COUNT(*) FROM public.profiles WHERE package_tier IS NOT NULL) as total_affiliates,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_roles WHERE role = 'seller') as total_vendors,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.withdrawals WHERE status = 'pending') as pending_withdrawals,
    (SELECT COUNT(*) FROM public.products WHERE approval_status = 'pending') as pending_approvals;

-- 6. RLS Policies (Basic examples, need refinement based on exact needs)
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Learners can read modules/lessons for products they've purchased
-- (Assuming an 'orders' check)
CREATE POLICY "Learners can view lessons of purchased products" ON public.course_lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND orders.product_id = (SELECT product_id FROM public.course_modules WHERE id = module_id)
            AND orders.status = 'completed'
        )
    );

-- Messages RLS
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);
