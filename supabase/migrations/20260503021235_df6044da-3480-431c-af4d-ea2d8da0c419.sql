DROP FUNCTION IF EXISTS public.seed_affilyt_demo_accounts();
DROP FUNCTION IF EXISTS public.create_confirmed_demo_user(text, text, text);
DROP FUNCTION IF EXISTS public.reset_affilyt_demo_accounts();

REVOKE ALL ON FUNCTION public.enforce_seller_product_review() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;