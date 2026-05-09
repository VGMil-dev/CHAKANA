# Stripe Integration Plan

## Separacion Aurio vs Stripe

### Checkout Aurio

- Usa el token AUR para descuentos.
- En MVP usa `buildAurioTransferTx` con wallet destino QA del negocio.
- A futuro puede volver a `payToTambu` cuando exista NFT Tambu real con metadata.
- Usa wallet Phantom/signer del usuario.
- Ya funciona y no debe mezclarse con el servicio Stripe.

### Checkout Stripe

- Usa tarjeta/fiat.
- Debe pasar por Supabase Edge Function, empezando por `commerce-api`.
- La secret key de Stripe vive solo en Supabase Secrets.
- El webhook vive en `stripe-webhook` y valida `stripe-signature`.
- El frontend solo llama la Edge Function y recibe `checkout_url`/`checkout_session_id`.
- No debe importar secretos, SDK backend ni tocar `useCheckout` de Aurio.

## Archivos extraidos

- `supabase/functions/commerce-api/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `supabase/migrations/003_commerce_auth_stripe.sql`
- `qa/08-commerce-flow.ts`

## Frontend aislado

Se creo `src/services/commerce/stripe.service.ts` como cliente minimo para crear una sesion de Stripe Checkout usando la Edge Function. El servicio requiere sesion Supabase activa y no conoce Aurio, wallets ni transacciones Solana.

## Pendientes antes de activar en UI

- Revisar y aplicar migracion commerce contra el schema real.
- Configurar Supabase Secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
- Desplegar `commerce-api` y `stripe-webhook`.
- Crear boton separado "Pagar con tarjeta" en UI, sin reemplazar el checkout Aurio.
- Agregar smoke test que no llame Stripe real.
