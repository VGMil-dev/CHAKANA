-- =============================================
-- CHAKANA -- Cash payment method support
-- =============================================
-- Adds payment_method column to orders and extends
-- status CHECK to include cash-specific statuses.

-- 1. Add payment_method column
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'stripe'
    CHECK (payment_method IN ('stripe', 'cash'));

-- 2. Extend the status CHECK constraint to allow cash statuses.
--    The inline CHECK from migration 004 gets the auto-generated name
--    "orders_status_check" in Postgres.
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending', 'checkout_created', 'paid', 'failed', 'canceled', 'cash_pending', 'cash_confirmed'));

-- 3. Index for filtering/querying by payment method
CREATE INDEX IF NOT EXISTS orders_payment_method_idx ON orders(payment_method);
