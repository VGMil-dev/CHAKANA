-- =============================================
-- CHAKANA -- Images, categories, location, storage
-- =============================================

-- 1. Add columns to businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;

-- 2. Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('business-images', 'business-images', true),
  ('product-images', 'product-images', true),
  ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage policies: public read for image buckets
CREATE POLICY "business-images: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'business-images');

CREATE POLICY "business-images: authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'business-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "product-images: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "product-images: authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- reports: only service role writes, owner reads
CREATE POLICY "reports: owner read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reports'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
