# CHAKANA -- Instrucciones para Agentes IA

> Este archivo es leido por cualquier agente IA (Claude Code, Cursor, Copilot, Windsurf, etc.)
> al inicio de cada sesion. Define como operar en este repositorio.

---

## Carga de Contexto (Hacer Primero)

**Claude Code:** ejecuta `/chakana-memory` para cargar todo el contexto automáticamente.

**Otros agentes (Gemini, Codex, Copilot, GPT):** lee `memory/AGENT_STARTER.md`. Ese archivo contiene el protocolo completo con instrucciones específicas por herramienta.

### Índice de Memoria (`memory/`)

| Archivo | Contenido |
|---------|-----------|
| `MEMORY.md` | Índice de todos los documentos de contexto |
| `AGENT_STARTER.md` | Protocolo universal para cualquier agente |
| `chakana_built_vs_pending.md` | Qué UI existe, qué servicios faltan |
| `chakana_screens_routes.md` | Rutas Expo Router y Golden Path |
| `chakana_components_map.md` | Mapa completo de componentes |
| `chakana_state_services.md` | Zustand stores y estado de integraciones |
| `tech_architecture.md` | Stack, dependencias críticas, mecánica Aurios |
| `supabase-contracts.md` | API contracts Dev4→Dev2 |
| `project_state.md` | Fase actual, completado, pendiente, bloqueado |
| `decisions.md` | ADRs y definición de "Done" |

---

## Protocolos de Ejecucion (Karpathy-Inspired)

Para maximizar el exito en 48h, todo agente DEBE seguir estos tres principios:

1. **Think Before Coding:** Antes de escribir codigo, emite un resumen de tu plan. Identifica asunciones, archivos a tocar y posibles conflictos con otros devs. Si hay ambiguedad, DETENTE y pregunta.
2. **Simplicity First:** El MVP premia lo que funciona. Evita sobre-ingenieria, abstracciones prematuras o librerias innecesarias. Si puedes hacerlo con 10 lineas en lugar de 50, hazlo.
3. **Surgical Changes:** Mantén los diffs pequeños. No hagas refactorizaciones "de paso". Si no es parte de tu tarea asignada, no lo toques.

---

## Protocolo de Sesion

**Al iniciar sesion:**
1. Cargar contexto via `/chakana-memory` (Claude) o `memory/AGENT_STARTER.md` (otros).
2. Identificar tu rol (Dev 1-4) y leer tu guia en `agents/`.
3. **Validar Plan:** Exponer brevemente qué vas a hacer antes de empezar.

**Durante la sesion:**
- Tarea completada → actualizar `memory/project_state.md`.
- Cambio de arquitectura o contrato → documentar en `memory/decisions.md`.

---

## Equipo y Roles

| Dev | Rol | Foco Principal | Guía |
|-----|-----|----------------|------|
| Dev 1 | UI/UX | Layout, animaciones, feedback visual | `agents/dev1-ui.md` |
| Dev 2 | Logic | Zustand, integracion de servicios, flujo de datos | `agents/dev2-logic.md` |
| Dev 3 | Web3 | Solana transactions, wallet adapter, tokens | `agents/dev3-web3.md` |
| Dev 4 | Backend | Supabase Edge Functions, IA (ElevenLabs), RLS | `agents/dev4-backend.md` |

---

## Reglas de Oro

- **Vibe Coding:** Delega UI y boilerplate; supervisa logica critica (Web3/Auth).
- **No Ghost Code:** Todo codigo debe ser funcional para el demo. Si no se usa en el "Golden Path" de Valentina, es basura.
- **Verification:** Despues de cada cambio, indica como verificarlo (ej: "Corre `npx expo run:android` y revisa el log X").
- **Security:** Keys en `.env` (no commitear). ElevenLabs y Keypair Mint Authority solo en backend.

---

## Golden Path de la Demo

```
Onboarding → Login → Home → Inventario → Carrito → Checkout → Pago → Reseña → Home
```
