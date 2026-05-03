CREATE OR REPLACE FUNCTION public.get_affiliate_stats(u_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

REVOKE ALL ON FUNCTION public.get_affiliate_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_affiliate_stats(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;