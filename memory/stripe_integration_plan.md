# Stripe Integration Plan

## Separacion Aurio vs Stripe

### Descuento Aurio

- Usa el token AUR para descuentos opcionales.
- En MVP usa `buildAurioTransferTx` con wallet destino QA del negocio.
- A futuro puede volver a `payToTambu` cuando exista NFT Tambu real con metadata.
- Usa wallet Phantom/signer del usuario.
- Ya funciona como redencion y no debe mezclarse con el cobro Stripe.

### Checkout Stripe

- Usa tarjeta/fiat y es el pago final.
- Debe pasar por Supabase Edge Function, empezando por `commerce-api`.
- La secret key de Stripe vive solo en Supabase Secrets.
- El webhook vive en `stripe-webhook` y valida `stripe-signature`.
- El frontend solo llama la Edge Function y recibe `checkout_url`/`checkout_session_id`.
- No debe importar secretos, SDK backend ni tocar `useCheckout` de Aurio.

## Checkout hibrido Aurio + Stripe

- Aurio es descuento opcional.
- Stripe cobra el total final.
- El usuario puede pagar sin usar Aurios.
- Si usa Aurios, primero se redimen.
- Despues Stripe cobra `subtotal - descuentoAurio`.
- Para MVP, la redencion Aurio usa `buildAurioTransferTx` hacia payout wallet QA.
- En futuro, la redencion puede usar `payToTambu` con NFT Tambu metadata.
- Backend debe verificar `aurioSignature` antes de aplicar descuento en produccion.

## Archivos extraidos

- `supabase/functions/commerce-api/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `supabase/migrations/003_commerce_auth_stripe.sql`
- `qa/08-commerce-flow.ts`

## Frontend aislado

Se creo `src/services/commerce/stripe.service.ts` como cliente minimo para crear una sesion de Stripe Checkout usando la Edge Function. El servicio requiere sesion Supabase activa, acepta metadata de descuento Aurio y no importa `aurio-sdk`.

## Pendientes antes de activar en UI

- Revisar y aplicar migracion commerce contra el schema real.
- Configurar Supabase Secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
- Desplegar `commerce-api` y `stripe-webhook`.
- Crear boton separado "Pagar con tarjeta" en UI, sin reemplazar el checkout Aurio.
- Agregar smoke test que no llame Stripe real.
