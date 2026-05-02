-- Create public media bucket for admin uploads (images for blogs/testimonials/products)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public can read media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Admins can upload
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Sellers can also upload product images to their own folder under media/products/{user_id}/...
CREATE POLICY "Sellers can upload product media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND public.has_role(auth.uid(), 'seller')
  AND (storage.foldername(name))[1] = 'products'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Sellers can update own product media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND public.has_role(auth.uid(), 'seller')
  AND (storage.foldername(name))[1] = 'products'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Sellers can delete own product media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND public.has_role(auth.uid(), 'seller')
  AND (storage.foldername(name))[1] = 'products'
  AND (storage.foldername(name))[2] = auth.uid()::text
);