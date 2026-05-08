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

---

## En Progreso

- App Expo / React Native inicializada en `mobile/` con pantalla minima de integracion
- Integracion UI Dev 1 con hooks Dev 2 pendiente

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
