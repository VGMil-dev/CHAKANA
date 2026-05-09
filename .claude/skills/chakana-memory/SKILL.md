---
name: chakana-memory
description: Carga el contexto completo del proyecto Chakana — pantallas, componentes, stores, integraciones, estado built/pending, y guía de rol. Usar al inicio de cada sesión de trabajo en este repo.
user-invocable: true
---

Lee los siguientes archivos en orden y sintetiza el contexto para la sesión:

## Paso 1 — Índice de Memoria
Lee `memory/MEMORY.md` para ver qué memorias existen.

## Paso 2 — Memorias del App (leer en paralelo)
- `memory/chakana_built_vs_pending.md` — qué UI está lista, qué servicios faltan, prioridades demo
- `memory/chakana_screens_routes.md` — rutas Expo Router, Golden Path, navegación
- `memory/chakana_components_map.md` — todos los componentes por carpeta
- `memory/chakana_state_services.md` — Zustand stores, data mocks, estado de integraciones externas
- `memory/tech_architecture.md` — stack, dependencias críticas, mecánica Aurios, contratos entre devs
- `memory/supabase-contracts.md` — API contracts Dev4→Dev2 (Auth, Reviews, Businesses)

## Paso 3 — Estado del Proyecto
Lee `memory/project_state.md` y `memory/decisions.md`.

## Paso 4 — Rol del Agente
Si el usuario indicó un rol (Dev 1–4), lee el archivo correspondiente en `agents/`:
- Dev 1 (UI): `agents/dev1-ui.md`
- Dev 2 (Logic): `agents/dev2-logic.md`
- Dev 3 (Web3): `agents/dev3-web3.md`
- Dev 4 (Backend): `agents/dev4-backend.md`

## Paso 5 — Output estructurado
Después de leer todo, emite un resumen con este formato exacto:

---
**CONTEXTO CHAKANA CARGADO**

**Fase actual:** [fase del project_state]
**Golden Path:** Onboarding → Login → Home → Inventario → Carrito → Checkout → Pago → Reseña → Home
**Rol activo:** [Dev X — nombre]

**Construido (UI funcional):**
- [lista de 3–5 ítems clave]

**Pendiente (integraciones):**
- [lista de 3–5 ítems críticos para la demo]

**Reglas activas para esta sesión:**
1. Think Before Coding — emitir plan antes de tocar código
2. No Ghost Code — solo lo que se usa en el Golden Path
3. Surgical Changes — diffs pequeños, sin refactors de paso

**¿Cuál es tu tarea?**
---
