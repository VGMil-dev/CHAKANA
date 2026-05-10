-- =============================================
-- CHAKANA -- Stripe Payment Links MVP
-- =============================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS stripe_payment_link_url TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_businesses ON businesses;
CREATE TRIGGER set_updated_at_businesses BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, wallet_pubkey)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'wallet_pubkey'
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        wallet_pubkey = COALESCE(EXCLUDED.wallet_pubkey, profiles.wallet_pubkey);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
