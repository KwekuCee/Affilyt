
DROP POLICY IF EXISTS "Service role inserts notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role inserts referrals" ON public.referrals;

-- Convert get_affiliate_stats to SECURITY INVOKER (RLS on underlying tables allows owners)
CREATE OR REPLACE FUNCTION public.get_affiliate_stats(u_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 STABLE
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
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
$function$;
