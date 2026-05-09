# Project State -- Chakana

**Fase actual:** Fase 1 - Setup inicial en progreso

---

## Foco Actual

- **Objetivo:** Conectar la app Expo con Supabase, Zustand y los modulos Web3/Backend ya preparados.
- **Next Step:** Dev 2 implementa hooks de negocio sobre `src/store` y `src/services/supabase`.
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

---

## En Progreso

- App Expo / React Native inicializada en `mobile/` con pantalla minima de integracion
- Integracion UI Dev 1 con hooks Dev 2 pendiente
- Falta conectar Businesses para reemplazar env QA por `tambuMint` o `payoutWallet` del negocio seleccionado.

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

- (ninguno)

---

**Ultima actualizacion:** 2026-05-08
