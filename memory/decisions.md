# Architectural Decisions -- Chakana

> Registro de decisiones criticas, cambios de arquitectura y contratos entre servicios.

---

## Log de Decisiones

### [2026-05-09] - Stripe Connect con Embedded Flows (NO custom backend)
- **Contexto:** Necesitamos que los tambus (merchants) reciban pagos directamente vía Stripe Connect, pero sin implementar nuestro propio backend para onboarding.
- **Decision:** Usar Stripe Connect + Stripe Embedded Account Onboarding (o Embedded Forms). Clientes pagan a merchants via Connected Accounts. **Sin custom backend para Connect.**
- **Impacto:** 
  - Merchants se onboarding via Stripe's embedded UI (en la app mobile via webview o API).
  - Payments fluyen directamente a merchant Stripe accounts (con plataforma fee).
  - Edge Functions reducidas: sin `commerce-api` full, más thin wrappers a Stripe SDK.
  - `.env` incluye `STRIPE_RESTRICTED_API_KEY` (para crear ephemeral keys cliente-side si aplica).

### [2026-05-09] - Integración Auth + Commerce Básica (MVP)
- **Contexto:** `INTEGRATION_PLAN.md` exige flujo end-to-end de autenticación, tambús/productos y pagos.
- **Decision:** Se adopta `email+password`, Stripe Connect con embedded flows, tablas mínimas para mapeo de merchants a Stripe accounts.
- **Impacto:** Se agregan tablas `users/merchants/tambus/products/carts/orders`, RLS por rol, minimal Edge Functions (webhooks solo).

### [2026-05-08] - Sistema de Memoria e Instrucciones (Karpathy)
- **Contexto:** Necesitamos maxima velocidad y minima friccion entre 4 IAs.
- **Decision:** Implementar protocolos de "Think Before Coding", "Simplicity First" y "Surgical Changes" inspirados en el repo `andrej-karpathy-skills`.
- **Impacto:** Los agentes ahora deben validar su plan antes de ejecutar y priorizar la simplicidad sobre la elegancia.

---

## Contratos y Protocolos

### Definicion de "Done" para Hackathon
1. El codigo compila y corre en el emulador/dispositivo.
2. La funcionalidad es visible/testeable en el "Golden Path" de la demo.
3. El estado de la memoria (`project_state.md`) ha sido actualizado.
4. No hay errores de linting o tipos que rompan el build de produccion.
