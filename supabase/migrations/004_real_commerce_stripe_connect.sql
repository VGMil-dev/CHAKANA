-- =============================================
-- CHAKANA -- Commerce real + Stripe Connect
-- =============================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS wallet_adress TEXT,
  ADD COLUMN IF NOT EXISTS nfc_adress TEXT,
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'businesses'
      AND column_name = 'wallet_pubkey'
  ) THEN
    UPDATE businesses
    SET wallet_adress = COALESCE(wallet_adress, wallet_pubkey)
    WHERE wallet_adress IS NULL;
  END IF;
END $$;

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

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_products ON products;
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'checkout_created', 'paid', 'failed', 'canceled')),
  currency TEXT NOT NULL DEFAULT 'usd',
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  aurios_spent INTEGER NOT NULL DEFAULT 0 CHECK (aurios_spent >= 0),
  aurio_discount_cents INTEGER NOT NULL DEFAULT 0 CHECK (aurio_discount_cents >= 0),
  final_total_cents INTEGER NOT NULL CHECK (final_total_cents >= 0),
  aurio_signature TEXT,
  wallet_pubkey TEXT,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_orders ON orders;
CREATE TRIGGER set_updated_at_orders BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_amount_cents INTEGER NOT NULL CHECK (unit_amount_cents > 0),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_event_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_payments ON payments;
CREATE TRIGGER set_updated_at_payments BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_business_id_idx ON products(business_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_business_id_idx ON orders(business_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products: active readable" ON products;
CREATE POLICY "products: active readable" ON products
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "products: owner manages own" ON products;
CREATE POLICY "products: owner manages own" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = products.business_id
        AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "orders: buyer reads own" ON orders;
CREATE POLICY "orders: buyer reads own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders: owner reads own business" ON orders;
CREATE POLICY "orders: owner reads own business" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = orders.business_id
        AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "order_items: buyer reads own" ON order_items;
CREATE POLICY "order_items: buyer reads own" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "order_items: owner reads own business" ON order_items;
CREATE POLICY "order_items: owner reads own business" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN businesses b ON b.id = o.business_id
      WHERE o.id = order_items.order_id
        AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "payments: buyer reads own" ON payments;
CREATE POLICY "payments: buyer reads own" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = payments.order_id
        AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "payments: owner reads own business" ON payments;
CREATE POLICY "payments: owner reads own business" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN businesses b ON b.id = o.business_id
      WHERE o.id = payments.order_id
        AND b.owner_id = auth.uid()
    )
  );
