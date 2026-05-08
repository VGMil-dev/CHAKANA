-- =============================================
-- CHAKANA — Schema inicial
-- =============================================

-- Tabla: profiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_pubkey TEXT,
  role TEXT NOT NULL DEFAULT 'ambassador' CHECK (role IN ('ambassador', 'owner', 'admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: businesses (Tambus)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  wallet_pubkey TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: reviews (Reseñas de Embajadores)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  solana_memo_signature TEXT,
  aurios_rewarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_min_length CHECK (char_length(text) > 50)
);

-- Tabla: audio_reports
CREATE TABLE IF NOT EXISTS audio_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- RLS: profiles
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: read own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: insert own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: update own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- RLS: businesses
-- =============================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses: anyone can read" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "businesses: owner manages own" ON businesses
  FOR ALL USING (auth.uid() = owner_id);

-- =============================================
-- RLS: reviews
-- =============================================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews: ambassador inserts own" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews: ambassador reads own" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reviews: owner reads business reviews" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = reviews.business_id
        AND b.owner_id = auth.uid()
    )
  );

-- =============================================
-- RLS: audio_reports
-- =============================================
ALTER TABLE audio_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audio_reports: owner reads own" ON audio_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = audio_reports.business_id
        AND b.owner_id = auth.uid()
    )
  );

-- =============================================
-- Trigger: crear profile automáticamente al registrar usuario
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
