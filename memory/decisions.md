# Architectural Decisions -- Chakana

> Registro de decisiones criticas, cambios de arquitectura y contratos entre servicios.

---

## Log de Decisiones

### [2026-05-08] - Sistema de Memoria e Instrucciones (Karpathy)
- **Contexto:** Necesitamos maxima velocidad y minima friccion entre 4 IAs.
- **Decision:** Implementar protocolos de "Think Before Coding", "Simplicity First" y "Surgical Changes" inspirados en el repo `andrej-karpathy-skills`.
- **Impacto:** Los agentes ahora deben validar su plan antes de ejecutar y priorizar la simplicidad sobre la elegancia.

### [2026-05-08] - Contrato reward AURIO por reseña
- **Contexto:** Dev 4 entrega la Edge Function oficial `mint-aurio-on-review`.
- **Decision:** Dev 2 solo llama `POST /functions/v1/mint-aurio-on-review` con `userWallet`, `reviewText` y `businessId`, y refresca el balance real con `getAurioBalance(walletPubKey)`.
- **Impacto:** El frontend no mintea, no usa mint authority y no suma Aurios manualmente. 1 comentario post-compra valido recompensa 1 Aurio, equivalente a $0.01 USD de descuento futuro.

### [2026-05-09] - Stripe MVP via Payment Links
- **Contexto:** Para Expo Go y velocidad MVP, Stripe Connect API/direct charges queda fuera del flujo de demo.
- **Decision:** El pago final abre un Stripe Payment Link del emprendimiento (`https://buy.stripe.com/...`) configurado por env o por negocio; Chakana no crea Checkout Sessions ni transfiere fondos.
- **Impacto:** El cobro funciona sin backend Stripe. Aurios se redimen antes de abrir el link; el ajuste dinamico del monto queda pendiente para una fase con cupones/links por monto/backend.

### [2026-05-09] - `chakana-app` canonica + Stripe Connect real
- **Contexto:** La UI correcta vive en `chakana-app/`, pero la logica real estaba dividida entre `mobile/` y `src/`.
- **Decision:** `chakana-app/` pasa a ser el runtime canonico. La logica real se migra a `chakana-app/src/`, los mocks visuales se eliminan y Stripe Payment Links queda reemplazado por Stripe Connect via Supabase Edge Functions.
- **Impacto:** Home, inventario, carrito, checkout y reseñas consumen Supabase. Aurio redime contra `businesses.wallet_adress`. Stripe cobra con Checkout Sessions y destination charges hacia `businesses.stripe_account_id`. Los secretos viven solo en Edge Functions.

---

## Contratos y Protocolos

### Definicion de "Done" para Hackathon
1. El codigo compila y corre en el emulador/dispositivo.
2. La funcionalidad es visible/testeable en el "Golden Path" de la demo.
3. El estado de la memoria (`project_state.md`) ha sido actualizado.
4. No hay errores de linting o tipos que rompan el build de produccion.
