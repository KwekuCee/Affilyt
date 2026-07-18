
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference text;
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_reference_key
  ON public.orders (payment_reference)
  WHERE payment_reference IS NOT NULL;
