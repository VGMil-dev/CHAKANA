# Stripe Branch Audit

## Rama analizada

origin/copilot/complete-integration-workflow

## Archivos Stripe detectados

| Archivo | Tipo | Que hace | Riesgo | Recomendacion |
|--------|------|----------|--------|---------------|
| `.env.example` | Config/env | Documenta `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_RESTRICTED_API_KEY`, `APP_BASE_URL` y Supabase envs. | Contiene placeholders de secretos backend junto a envs publicas; si se copia sin cuidado puede normalizar secretos en frontend. | Extraer solo nombres de variables a los `.env.example` correctos. Nunca copiar valores reales. |
| `src/services/stripe/client.ts` | Backend Stripe | Cliente Stripe REST: customer, checkout session y verificacion HMAC de webhook. | Lee `process.env.STRIPE_SECRET`; no debe entrar al bundle de `mobile/`. Puede confundir frontera frontend/backend. | Usar solo como referencia o moverlo a entorno backend. No importarlo desde Expo. |
| `supabase/functions/commerce-api/index.ts` | Backend/Edge Function Stripe | API commerce: tambus, products, cart, orders y checkout session Stripe. Usa service role y `STRIPE_SECRET`. | Grande, mezcla catalogo, ordenes, Stripe y auth. Depende de schema nuevo y puede chocar con RLS actual. | Candidato a extraer en fase backend, despues de adaptar a schema actual y revisar rutas. |
| `supabase/functions/stripe-webhook/index.ts` | Backend/Edge Function Stripe | Verifica `stripe-signature`, marca orden pagada o fallida, actualiza `payments`. | Usa tipos abiertos, depende de tablas `orders` y `payments`, y debe desplegarse solo con secrets. | Candidato a extraer, pero parchear tipos y validar schema antes de deploy. |
| `supabase/migrations/003_commerce_auth_stripe.sql` | Backend/schema | Crea merchants, users, tambus, products, carts, orders, payments, storage bucket y RLS. | Migracion amplia: puede sobrescribir decisiones de auth/RLS y contratos actuales. | No aplicar directa. Reusar como base para una migracion revisada. |
| `src/services/supabase/commerce.service.ts` | Frontend/servicio Supabase | Helpers directos para crear tambu, product y order contra Supabase. | Usa casts demasiado abiertos y acceso directo a tablas; no pasa el criterio de no tipos laxos si se copia tal cual. | No copiar tal cual. Reescribir tipado o preferir Edge Function. |
| `chakana-app/services/commerce.ts` | Frontend Stripe/commerce | Cliente frontend para `commerce-api`: tambus, products, cart, checkout, orders, imagenes. | Pertenece a `chakana-app`, no a `mobile/`; URLs de success/cancel hardcodeadas a example.com. | Usar como referencia para crear un servicio aislado en `mobile/`. |
| `chakana-app/services/supabase.ts` | Frontend config | Crea cliente Supabase y URL de `functions/v1/commerce-api`. | Puede duplicar o contradecir el cliente Supabase actual. | Extraer solo idea de `getCommerceApiUrl`, no el archivo completo. |
| `chakana-app/app/checkout.tsx` | Pantalla frontend | Pantalla checkout Stripe dentro de la app alternativa. | Choca con `mobile/app/(app)/checkout.tsx`, donde vive Aurio. La rama ademas borra el checkout Aurio. | No copiar. Crear despues un boton/pantalla separada para tarjeta. |
| `chakana-app/app/orders.tsx` | Pantalla frontend | Lista ordenes de commerce. | Depende del servicio y estructura `chakana-app`. | No copiar por ahora. |
| `chakana-app/app/merchant-dashboard.tsx` | Pantalla frontend | Dashboard merchant para tambu/productos. | Fuera del runtime `mobile/` actual. | No copiar por ahora. |
| `chakana-app/app/product-editor.tsx` | Pantalla frontend | Editor de producto con imagen. | Fuera del runtime `mobile/` actual y depende de schema nuevo. | No copiar por ahora. |
| `qa/08-commerce-flow.ts` | Tests | Smoke QA para tablas commerce, bucket y lectura de orders. | Usa casts laxos y requiere schema/service role; no aplica al runtime actual sin migracion. | Usar como referencia despues de migrar schema. |
| `qa/package.json` | Tests/config | Agrega script `test:commerce`. | Inofensivo, pero no sirve sin `08-commerce-flow.ts` y schema. | No copiar hasta tener backend Stripe integrado. |
| `memory/session/stripe_mcp.json` | Docs/tests | Mapeo manual de operaciones Stripe REST. | Es documentacion auxiliar, no fuente de verdad. | Opcional como referencia; no necesario para MVP. |
| `INTEGRATION_PLAN.md` | Docs | Plan amplio de auth, commerce y Stripe Connect. | Puede estar desfasado respecto a `mobile/` y Aurio. | Leer como contexto, no copiar contratos enteros. |
| `chakana-app/README.md` | Docs/config | Notas de deploy de Edge Functions y Stripe CLI. | Orientado a `chakana-app`. | Extraer comandos de deploy si se adopta Edge Function. |

## Archivos que si conviene extraer

En una fase posterior, conviene traer de forma aislada:

- `supabase/functions/commerce-api/index.ts`, solo como base backend para crear checkout sessions.
- `supabase/functions/stripe-webhook/index.ts`, despues de corregir tipos y validar firma/webhook en Supabase.
- `supabase/migrations/003_commerce_auth_stripe.sql`, solo como referencia para una migracion nueva y revisada.
- `chakana-app/services/commerce.ts`, solo como referencia para crear un cliente `mobile` separado, por ejemplo `src/services/stripeCheckout.service.ts`.
- Variables de `.env.example`, copiadas manualmente a los ejemplos correctos.
- `qa/08-commerce-flow.ts`, despues de tener schema y Edge Functions listos.

Comandos candidatos para una extraccion controlada, cuando se apruebe:

```bash
git checkout origin/copilot/complete-integration-workflow -- supabase/functions/commerce-api/index.ts
git checkout origin/copilot/complete-integration-workflow -- supabase/functions/stripe-webhook/index.ts
git checkout origin/copilot/complete-integration-workflow -- supabase/migrations/003_commerce_auth_stripe.sql
git checkout origin/copilot/complete-integration-workflow -- qa/08-commerce-flow.ts
```

Para frontend, recomiendo no usar `git checkout` directo. Mejor crear un archivo nuevo en `mobile/` o `src/services/` copiando solo el patron de `chakana-app/services/commerce.ts`.

## Archivos que NO conviene extraer

- Cualquier borrado o reestructura de `mobile/`.
- `chakana-app/app/checkout.tsx`, porque el checkout actual de `mobile/` ya es Aurio y no debe mezclarse.
- `chakana-app/app/*` como rutas completas, porque pertenecen a otro runtime.
- `chakana-app/package.json`, porque usa versiones distintas de Expo/React Native.
- `src/services/supabase/client.ts`, `auth.service.ts`, `reviews.service.ts` y `index.ts` desde esa rama sin auditoria separada.
- `supabase/functions/review-reward-oracle/index.ts` desde esa rama sin auditoria separada.
- Archivos de memoria completos de la rama, porque podrian pisar decisiones actuales de Dev 2/Aurio.
- `.env` reales o valores concretos de Stripe.

## Dependencias necesarias

Para `mobile/` no hay dependencia Stripe obligatoria si se usa Stripe Checkout por URL desde una Edge Function.

Para backend/Supabase Edge Functions:

- `@supabase/supabase-js` via import Deno `https://esm.sh/@supabase/supabase-js@2`.
- Stripe se consume por REST con `fetch`; no requiere SDK npm.

Para QA:

- `ts-node`
- `typescript`
- `@supabase/supabase-js`
- `dotenv`

## Variables de entorno necesarias

Publicas, si el cliente llega a usar Stripe publishable key:

- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Solo backend o Supabase secrets:

- `STRIPE_SECRET` o `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL`

Opcional futuro:

- `STRIPE_RESTRICTED_API_KEY`

## Riesgos

- No mezclar checkout Stripe con checkout Aurio.
- No exponer `STRIPE_SECRET_KEY` en mobile.
- Webhooks solo backend.
- Edge Functions deben usar secrets.
- No guardar claves reales.
- La rama elimina gran parte de `mobile/`; un merge completo destruiria el runtime actual.
- La migracion commerce crea tablas y politicas amplias; debe revisarse contra el schema actual antes de aplicar.
- El webhook debe procesar el raw body exacto para validar `stripe-signature`.
- El checkout Stripe debe ser una ruta o accion separada, por ejemplo "Pagar con tarjeta", no una sustitucion del flujo Aurio.

## Plan recomendado

Fase A:
Copiar solo servicios/hook Stripe aislados. Crear un cliente frontend minimo que llame a una Edge Function propia y abra `checkout_url`. No tocar `useCheckout` de Aurio.

Fase B:
Copiar Edge Function Stripe si existe. Empezar por `commerce-api` y `stripe-webhook`, ajustando tipos, CORS, secrets y schema.

Fase C:
Crear pantalla o boton separado "Pagar con tarjeta". Mantener `mobile/app/(app)/checkout.tsx` como flujo Aurio y agregar Stripe como accion paralela.

Fase D:
Tests smoke sin llamar Stripe real. Verificar render de boton, llamada mockeada a endpoint local o respuesta controlada, y que no se abre wallet ni se firma nada.
