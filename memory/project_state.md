# Project State -- Chakana

**Fase actual:** Integración commerce/auth/stripe en implementación

---

## Foco Actual

- **Objetivo:** Integración end-to-end de auth, tambús/productos, checkout Stripe y órdenes.
- **Decisiones activas:** `email+password`, Stripe Checkout (no Elements), sin Stripe Connect en esta iteración.
- **Contexto critico:** Mantener MVP funcional completo y seguro (RLS + webhooks + variables de entorno).

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
