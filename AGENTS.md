# CHAKANA -- Instrucciones para Agentes IA

> Este archivo es leido por cualquier agente IA (Claude Code, Cursor, Copilot, Windsurf, etc.)
> al inicio de cada sesion. Define como operar en este repositorio.

---

## Protocolos de Ejecucion (Karpathy-Inspired)

Para maximizar el exito en 48h, todo agente DEBE seguir estos tres principios:

1. **Think Before Coding:** Antes de escribir codigo, emite un resumen de tu plan. Identifica asunciones, archivos a tocar y posibles conflictos con otros devs. Si hay ambiguedad, DETENTE y pregunta.
2. **Simplicity First:** El MVP premia lo que funciona. Evita sobre-ingenieria, abstracciones prematuras o librerias innecesarias. Si puedes hacerlo con 10 lineas en lugar de 50, hazlo.
3. **Surgical Changes:** Mantén los diffs pequeños. No hagas refactorizaciones "de paso". Si no es parte de tu tarea asignada, no lo toques.

---

## Protocolo de Sesion

**Al iniciar sesion:**
1. Leer `memory/MEMORY.md` para cargar contexto.
2. Identificar tu rol (Dev 1-4) y leer tu guia en `agents/`.
3. Revisar `memory/project_state.md` y `memory/decisions.md`.
4. **Validar Plan:** Exponer brevemente qué vas a hacer antes de empezar.

**Durante la sesion:**
- Tarea completada -> actualizar `memory/project_state.md`.
- Cambio de arquitectura o contrato -> documentar en `memory/decisions.md`.

---

## Equipo y Roles

| Dev | Rol | Foco Principal |
|-----|-----|----------------|
| Dev 1 | UI/UX | Layout, animaciones, feedback visual. |
| Dev 2 | Logic | Zustand, integracion de servicios, flujo de datos. |
| Dev 3 | Web3 | Solana transactions, wallet adapter, tokens. |
| Dev 4 | Backend | Supabase Edge Functions, IA (ElevenLabs), RLS. |

---

## Reglas de Oro

- **Vibe Coding:** Delega UI y boilerplate; supervisa logica critica (Web3/Auth).
- **No Ghost Code:** Todo codigo debe ser funcional para el demo. Si no se usa en el "Golden Path" de Valentina, es basura.
- **Verification:** Despues de cada cambio, indica como verificarlo (ej: "Corre `npx expo run:android` y revisa el log X").
- **Security:** Keys en `.env` (no commitear). ElevenLabs solo en backend.
