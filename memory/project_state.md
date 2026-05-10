# Project State -- Chakana

**Fase actual:** Integracion real en `chakana-app/`

---

## Foco Actual

- **Objetivo:** Usar `chakana-app/` como app canonica con Supabase, Aurio y Stripe Connect reales.
- **Next Step:** Aplicar migracion `004_real_commerce_stripe_connect.sql`, desplegar Edge Functions y configurar secrets de Stripe/Aurio en Supabase.
- **Contexto critico:** Es un hackathon de 48h. Priorizar que funcione sobre que sea elegante.

---

## Completado

- Documentacion tecnica (SRS, plan 48h, guias por dev)
- Setup de flujo IA (AGENTS.md, memory, agents)
- Supabase core: schema, RLS, Auth, reviews, businesses, oracle y QA 01-06 funcionando
- Dev 2 Modulo 1: Zustand store base con slices de user, business, review y UI
- Dev 2 Modulo 2: calculadora de descuento Aurios, helpers de slider y hook `useDiscount`
- Dev 2 Modulo 3: hooks de negocio `useAuth`, `useBusinesses`, `useReviewSubmit` y `useCheckout`
- Dev 2 Modulo 4: tipos compartidos, props para Dev 1, selectores y contrato `DEV2_CONTRACT.md`
- Integracion Supabase Auth en app Expo: `initAuth` al arrancar, login/registro/logout en pantalla minima y estado `authUserId`/`authEmail` en Zustand
- Dev 2 reviews reward: `useReviewSubmit` llama la Edge Function `mint-aurio-on-review` y refresca balance real con `getAurioBalance(walletPubKey)`
- App Expo tras `reset-project`: pantalla temporal en `mobile/app/index.tsx` para probar wallet, balance AURIO, resenas y checkout.
- Dev 2 checkout Aurio: `useCheckout` integra `payToTambu` y `buildAurioTransferTx`, recibe `signTransaction`, envia/confirma la transaccion y refresca balance real con `getAurioBalance(walletPubKey)`.
- Fase 4 prep checkout: UI visual de `mobile/app/(app)/checkout.tsx` conectada a `useCheckout`, balance real, presets Aurios y pago bloqueado hasta recibir `tambuMint` real de Dev 4.
- Limpieza lint Expo: `npm run lint` queda en 0 errores y 0 warnings; smoke e2e sigue pasando.
- Checkout devnet: wallet destino QA de raiz-cafe se lee desde `EXPO_PUBLIC_QA_PAYOUT_WALLET`; no se usa `AURIO_MINT` como destino de pago.
- Fix web: SplashScreen desactiva layout animations de Reanimated en web para evitar crash `Cannot read properties of undefined (reading 'top')`.
- Fix web Solana: `mobile/polyfills.ts` define `globalThis.Buffer` y `crypto.getRandomValues` antes de cargar Expo Router.
- Checkout MVP: mientras no exista NFT Tambu real, QA usa `EXPO_PUBLIC_QA_PAYOUT_WALLET` y `buildAurioTransferTx`; `EXPO_PUBLIC_QA_TAMBU_MINT` queda reservado para `payToTambu`.
- Stripe/commerce MVP: se descarta Stripe Connect API para demo y se usa Stripe Payment Links (`EXPO_PUBLIC_QA_STRIPE_PAYMENT_LINK`) abiertos desde la app; no hay backend Stripe obligatorio para cobrar.
- Checkout hibrido: Aurio queda como descuento opcional/redencion previa y Stripe Payment Link como pago final del emprendimiento; `useHybridCheckout` abre el link despues de redimir Aurios o directo si `auriosToSpend` es 0.
- Checkout UI: tras redimir Aurios se guarda `redeemedAurios`, se muestra balance disponible separado de Aurios aplicados y Stripe pide sesion Supabase activa antes de crear checkout.
- Checkout visual por pasos: si `aurioBalance <= 0`, se salta descuento y se muestra pago Stripe; si hay Aurios, el usuario puede aplicar u omitir descuento antes de pagar con tarjeta.
- Comentarios post-compra: `ReviewForm` de Dev 1 usa `useReviewSubmit`, exige minimo 50 palabras y recompensa 1 Aurio ($0.01 USD de descuento futuro) tras compra Stripe.
- `chakana-app/` ahora contiene `src/` con hooks/store/services reales migrados desde la raiz.
- Se eliminaron mocks usados por la UI final: auth fake, tambuses/inventory/checkout/dashboard/pedidos mock.
- Home carga `businesses` desde Supabase; inventario carga `products`; carrito usa productos reales.
- Checkout usa `businesses.wallet_adress` para redimir Aurios y `commerce-api` para crear Checkout Sessions Stripe Connect.
- Backend commerce real agregado: `products`, `orders`, `order_items`, `payments`, `stripe_events` y campos Stripe Connect en `businesses`.
- Edge Functions reales: `commerce-api`, `stripe-webhook` y `mint-aurio-on-review`.
- Fix Expo Web: Metro resuelve helpers CommonJS de `@babel/runtime/helpers/*` para evitar crash `_objectWithoutPropertiesLoose is not a function` en `expo-router`.
- Fix Supabase Auth Web: cliente usa `storageKey` propio para no restaurar refresh tokens viejos/inválidos del storage default.
- LI.FI Paso 3: `/crosschain` consulta quote real Polygon USDC -> Solana USDC con REST, muestra ruta real/mock, request de demo y fallback seguro sin ejecutar transacciones.
- LI.FI Paso 4: `/crosschain` usa `walletPubKey` Solana conectada como destino del quote; si no existe usa `EXPO_PUBLIC_QA_PAYOUT_WALLET` o wallet mock valida con badge visible.

---

## En Progreso

- Validar Golden Path con datos reales en Supabase y credenciales `E2E_EMAIL`/`E2E_PASSWORD`.
- Completar onboarding operativo de Tambu owner para crear `stripe_account_id` en negocios reales.

---

## Pendiente (Backlog)

- **Fase 1 (H0-4):** Setup Expo, Zustand, Solana MWA, Supabase
- **Fase 2 (H4-12):** Core loop de resenas (texto a Supabase, hash a Solana, mint Aurios)
- **Fase 3 (H12-24):** Descuentos (SPL transfer), propinas (LI.FI)
- **Fase 4 (H24-32):** Reporte de voz IA (ElevenLabs)
- **Fase 5 (H32-40):** Ensamblaje narrativo, copy final
- **Fase 6 (H40-48):** Testing, pitch, video, submit

---

## Bloqueado

- Playwright requiere browser instalado localmente (`npx playwright install chromium`); la descarga quedo colgada en esta sesion y se detuvo.

---

**Ultima actualizacion:** 2026-05-10
