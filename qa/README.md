# QA Smoke Tests — Chakana Supabase Integration

Scripts de verificación rápida para cada criterio de aceptación del plan de Supabase.
Correr DESPUÉS de completar cada Task del plan de implementación.

## Setup

```bash
cd qa
npm install
cp .env.example .env   # Rellenar con tus credenciales
```

## Correr todos los tests

```bash
npm test
```

## Correr un test específico

```bash
npx ts-node qa/01-project-connection.ts
npx ts-node qa/02-schema-and-rls.ts
npx ts-node qa/03-auth-service.ts
npx ts-node qa/04-reviews-service.ts
npx ts-node qa/05-businesses-service.ts
npx ts-node qa/06-oracle-edge-function.ts
npx ts-node qa/07-generate-report-edge-function.ts
npx ts-node qa/08-commerce-flow.ts
```

## Criterios de aceptación por Task

| QA Script | Task del Plan | Criterio |
|-----------|--------------|---------|
| `01-project-connection` | Task 1 | Proyecto activo, URL y anon key válidos |
| `02-schema-and-rls` | Task 2 | 4 tablas existen, RLS activo, trigger funciona |
| `03-auth-service` | Task 5 | signUp, signIn, signOut, getUser funcionan |
| `04-reviews-service` | Task 6 | insertReview guarda en DB, RLS bloquea acceso cruzado |
| `05-businesses-service` | Task 7 | getAllBusinesses retorna datos, seed de Raíz Café existe |
| `06-oracle-edge-function` | Task 9 | Webhook actualiza aurios_rewarded tras insert |
| `07-generate-report` | Task 10 | Edge function retorna audio_url válida |
| `08-commerce-flow` | Integración completa | Tablas commerce + bucket + lectura de órdenes del usuario |
