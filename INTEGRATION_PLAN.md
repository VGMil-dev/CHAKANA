# Plan de Integración Completa: Auth, Tambús, Productos, Stripe y Supabase

Este documento es una guía accionable y paso a paso diseñada para que un agente de IA implemente completamente:
- Autenticación para clientes y emprendedores
- Creación y administración de tambús y productos
- Integración completa con Stripe (investigación MCP incluida)
- Generación de pantallas faltantes e integración frontend-backend
- Integración y hardening con Supabase (Auth, RLS, Storage, Edge Functions)

Objetivo: entregar un repo funcional donde un usuario pueda registrarse, crear tambús (si su rol lo permite), administrar productos, pagar con Stripe y ver órdenes, con políticas RLS seguras y despliegue documentado.

------------------------------------------------------------

## 1. Resumen del flujo de alto nivel

1. Usuario se registra (cliente o emprendedor).
2. Emprendedor crea un tambú y productos asociados (imágenes subidas a Supabase Storage).
3. Cliente agrega productos al carrito y procede a checkout.
4. Se crea una orden en la base de datos; se inicia pago con Stripe.
5. Webhooks de Stripe confirman pago y actualizan el estado de la orden.
6. RLS asegura acceso según roles.

------------------------------------------------------------

## 2. Requerimientos y decisiones a tomar (preguntas para el humano/agent)

- Método de autenticación preferido: `email+password` + `magic link` (recomendado) o solo `email+password`?
- ¿Usar Stripe Checkout (rápido) o Payment Intents + Elements (más flexible)? Recomendación: Checkout para MVP.
- ¿Se requiere Stripe Connect ahora (pagos a múltiples emprendedores) o solo pagos a la plataforma? (siConnect -> flow distinto)
- ¿Planes de suscripción/recurrencia? (Stripe Billing)

El agente debe pedir respuesta a estas preguntas y registrar las decisiones en `memory/project_state.md`.

------------------------------------------------------------

## 3. Tareas concretas (acción por acción)

1) Discovery automático (script)
 - Leer `package.json`, `src/services/supabase/*`, `supabase/functions/*`, y `chakana-app/app/*`.
 - Listar pantallas faltantes y endpoints inexistentes.

2) Diseño de Auth
 - Roles: `client`, `merchant` (emprendedor), `admin`.
 - Claims extras: `role`, `merchant_id` (nullable).
 - Flujos: registro, login, logout, recovery, verify email, editar perfil.
 - Políticas RLS iniciales (ver sección 6).

3) Esquema de base de datos (migraciones)
 - Tablas mínimas: `users` (extensiones), `roles` (opcional), `merchants` (tambú owner), `tambus`, `products`, `product_images`, `carts`, `cart_items`, `orders`, `order_items`, `payments`.
 - Campos clave: `stripe_customer_id`, `stripe_payment_id`, `stripe_price_id`, `merchant_stripe_account_id`.

4) Supabase
 - Actualizar/crear `src/services/supabase/client.ts` si hace falta.
 - Implementar Storage buckets para `product-images`.
 - Crear funciones edge para webhooks y tareas que necesitan secrets (ej.: `supabase/functions/stripe-webhook/index.ts`).
 - Añadir migraciones SQL en `supabase/migrations/`.

5) Stripe (investigación y configuración MCP)
 - Usar MCP para listar endpoints y ejemplos: crear customers, crear products/prices, crear Checkout Sessions, manejar webhooks.
 - Guardar en `.env.example` variables: `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`.
 - Decidir Checkout vs Payment Intents y documentar.

6) Backend / API
 - Endpoints REST/Edge: `POST /api/tambus`, `GET /api/tambus/:id`, `POST /api/tambus/:id/products`, `PATCH /api/products/:id`, `POST /api/cart`, `POST /api/checkout`, `GET /api/orders/:id`.
 - Middleware: verificar JWT de Supabase y chequear roles.

7) Frontend
 - Generar pantallas faltantes y conectar con los endpoints:
   - Registro / Login
   - Dashboard Emprendedor (crear tambú, añadir productos, ver ventas)
   - Crear/Editar Producto (upload imagen)
   - Carrito y Checkout
   - Historial de órdenes
 - Reusar `store/cart.ts` y `components/cart/*`.

8) Storage de imágenes
 - Implementar subida directa desde frontend a Supabase Storage con signed urls o con `supabase-js`.

9) Webhooks y conciliación
 - Crear `supabase/functions/stripe-webhook/index.ts`.
 - Validar `stripe-signature` y actualizar `payments` y `orders`.

10) Tests y QA
 - Añadir pruebas e2e para: registro, crear tambú (merchant), crear producto, checkout (modo test), webhook update.

11) Despliegue y documentación
 - Añadir `README` pasos: variables de entorno, migraciones, cómo crear claves Stripe y usar Stripe CLI para probar webhooks.

------------------------------------------------------------

## 4. Especificación técnica: DB (esquema mínimo)

users (supabase auth + perfil extendido)
- id (uuid PK)
- email
- full_name
- role (text) -- enum: 'client','merchant','admin'
- merchant_id (uuid) nullable
- stripe_customer_id (text)

merchants
- id (uuid)
- user_id (uuid)
- name
- stripe_account_id (nullable)

tambus
- id, merchant_id, title, description, location, metadata

products
- id, tambu_id, merchant_id, title, description, price_cents, currency, stripe_price_id, active

orders
- id, user_id, total_cents, currency, status, stripe_payment_intent, created_at

payments
- id, order_id, stripe_event_id, amount_cents, status

product_images
- id, product_id, storage_path, url

------------------------------------------------------------

## 5. Políticas RLS (ejemplos a implementar)

- `products`: SELECT público, INSERT/UPDATE/DELETE solo merchant propietario o admin.
- `tambus`: INSERT por merchant autenticado; UPDATE/DELETE solo propietario.
- `orders`: SELECT por el usuario propietario o merchant que recibe el pago; admins pueden ver todo.

El agent debe crear políticas SQL concretas en `supabase/migrations/`.

------------------------------------------------------------

## 6. Integración Stripe: pasos operativos para el agente

1. Ejecutar MCP (Stripe CLI / MCP tool) para enumerar operaciones necesarias: `create customer`, `create checkout.session`, `create product`, `create price`, `webhook signing`.
2. Crear utilitario backend `src/services/stripe/client.ts` con funciones: `createCustomer`, `createCheckoutSession`, `handleWebhookEvent`.
3. Guardar ids relevantes en la BD (`stripe_customer_id`, `stripe_price_id`).
4. Implementar webhook handler en `supabase/functions/stripe-webhook` y desplegarlo con `supabase functions deploy`.

Nota: el agente debe pedir credenciales y sólo documentarlas en `.env.example` (no commitear secrets).

------------------------------------------------------------

## 7. Checklist de verificación (lo que debe pasar para marcar completado)

- Registro/login funcionando para ambos roles.
- Emprendedor puede crear tambú y productos (imágenes visibles).
- Cliente puede realizar checkout de carrito con tarjeta test.
- Webhook de Stripe actualiza orden a `paid`.
- RLS bloquea accesos no autorizados.
- Tests e2e corriendo y aprobados.
- Documentación de despliegue y variables de entorno completa.

------------------------------------------------------------

## 8. Entregables esperados (archivos y ubicación)

- `INTEGRATION_PLAN.md` (este archivo)
- Migraciones en `supabase/migrations/*.sql`
- Webhook function en `supabase/functions/stripe-webhook/index.ts`
- Stripe client util en `src/services/stripe/client.ts`
- Endpoints/edge handlers bajo `src/api/` o `supabase/functions/` según arquitectura
- Pantallas generadas en `chakana-app/app/*` y componentes nuevos en `chakana-app/components/*`
- `.env.example` con variables necesarias
- Tests en `qa/` y/o `tests/`

------------------------------------------------------------

## 9. Siguientes pasos para el agente (acción inmediata)

1. Confirmar decisiones pendientes (Auth flow, Checkout vs Elements, Connect).
2. Ejecutar script de discovery y producir un árbol de tareas detallado (por endpoint y por pantalla).
3. Ejecutar MCP para Stripe y guardar output en `memory/session/stripe_mcp.json`.
4. Aplicar migraciones y crear buckets Storage en Supabase de prueba.

------------------------------------------------------------

Si necesitas que ejecute el paso 1 (discovery) y el 3 (MCP Stripe) ahora, indícalo y lo hago.
