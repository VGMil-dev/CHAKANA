# Project State -- Chakana

**Fase actual:** Integración commerce/auth/stripe en implementación

---

## Foco Actual

- **Objetivo:** Integración end-to-end de auth, tambús/productos, Stripe Connect con embedded flows (NO custom backend).
- **Decisiones activas:** `email+password`, **Stripe Connect + Embedded Account Onboarding**, merchants reciben pagos directamente vía Connected Accounts.
- **Contexto critico:** Merchants se onboarding via Stripe UI embebida (webview/API); clientes pagan directo a merchant accounts. Minimal backend (thin wrappers a Stripe SDK).

---

## Completado

- Documentacion tecnica (SRS, plan 48h, guias por dev)
- Setup de flujo IA (AGENTS.md, memory, agents)

---

## En Progreso

- Migración `003_commerce_auth_stripe.sql` con nuevas tablas y políticas RLS.
- Edge Functions `commerce-api` y `stripe-webhook`.
- Pantallas Expo para auth/merchant/productos/órdenes + conexión a API.

---

## Pendiente (Backlog)

- Ejecutar migraciones en proyecto Supabase real + deploy de funciones edge.
- Configurar secretos de Stripe y validar webhook con Stripe CLI.
- QA en entorno real (registro → tambú/producto → checkout → webhook paid → historial órdenes).

---

## Bloqueado

- (ninguno)

---

**Ultima actualizacion:** 2026-05-09
