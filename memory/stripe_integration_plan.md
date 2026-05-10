# Stripe Integration Plan

## Decision vigente: Stripe Connect real

- `chakana-app/` no usa Stripe Payment Links.
- El frontend llama `supabase/functions/v1/commerce-api`.
- `POST /connect/onboarding-link` crea/reusa una cuenta Stripe Express por Tambu y devuelve Account Link.
- `POST /checkout` valida sesion Supabase, recomputa productos/precios desde Supabase, crea `orders`/`order_items`/`payments` y crea una Stripe Checkout Session.
- La Checkout Session usa destination charge hacia `businesses.stripe_account_id`.
- `stripe-webhook` verifica `Stripe-Signature` con raw body, guarda eventos idempotentes en `stripe_events` y actualiza orden/pago.

## Separacion Aurio vs Stripe

- Aurio es descuento opcional previo al cobro de tarjeta.
- El destino Aurio es `businesses.wallet_adress`.
- El frontend usa `aurio-sdk` para balance, firma y transferencia SPL, pero nunca usa mint authority.
- La recompensa por reseña se ejecuta en `mint-aurio-on-review` con mint authority como Supabase secret.
- Stripe cobra `subtotal - aurio_discount_cents`; el backend recomputa y limita el descuento a 25%.

## Secrets

- Expo solo usa `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` y `EXPO_PUBLIC_AURIO_MINT`.
- Supabase Edge Functions requieren `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `AURIO_MINT_ADDRESS`, `AURIO_MINT_AUTHORITY_KEYPAIR` y opcionalmente `APP_BASE_URL`, `SOLANA_RPC_URL`, `STRIPE_CONNECT_COUNTRY`, `STRIPE_PLATFORM_FEE_CENTS`.
